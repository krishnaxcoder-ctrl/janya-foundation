import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// UAT/Sandbox URLs
const BASE_URL_UAT = 'https://api-preprod.phonepe.com/apis/pg-sandbox';
const AUTH_URL_UAT = 'https://api-preprod.phonepe.com/apis/pg-sandbox';

// Production URLs
const BASE_URL_PROD = 'https://api.phonepe.com/apis/pg';
const AUTH_URL_PROD = 'https://api.phonepe.com/apis/identity-manager';

const CONVENIENCE_FEE_PERCENT = 3.5;

// Get OAuth access token from PhonePe with retry logic
async function getAccessToken(clientId, clientSecret, clientVersion, authUrl, retries = 3) {
  console.log('Requesting OAuth token from:', `${authUrl}/v1/oauth/token`);

  let lastError;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(`${authUrl}/v1/oauth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: clientId,
          client_version: clientVersion,
          client_secret: clientSecret,
          grant_type: 'client_credentials',
        }),
      });

      const responseText = await response.text();
      console.log('OAuth Response Status:', response.status);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        throw new Error(`Invalid OAuth response: ${responseText}`);
      }

      if (data.access_token) {
        return data.access_token;
      }

      throw new Error(data.message || data.error?.message || 'Failed to get access token');
    } catch (error) {
      lastError = error;
      console.log(`OAuth attempt ${attempt}/${retries} failed:`, error.message);

      if (attempt < retries && (error.message.includes('fetch failed') || error.cause?.code === 'ENOTFOUND' || error.cause?.code === 'ECONNRESET')) {
        console.log(`Retrying in ${attempt * 500}ms...`);
        await new Promise(resolve => setTimeout(resolve, attempt * 500));
        continue;
      }

      throw error;
    }
  }

  throw lastError;
}

// Sanitize UDF value: only alphanumeric, underscores, hyphens, spaces, @, ., +
function sanitizeUdf(value, maxLen = 256) {
  if (!value) return null;
  const str = String(value).replace(/[^a-zA-Z0-9_\- @.+]/g, '').trim();
  return str ? str.substring(0, maxLen) : null;
}

// Build metaInfo with only non-empty fields (PhonePe rejects empty values)
function buildMetaInfo(p) {
  const fields = {
    udf1: sanitizeUdf(p?.name),
    udf2: sanitizeUdf(p?.email),
    udf3: sanitizeUdf(p?.phone),
    udf4: sanitizeUdf(p?.raceCategory),
    udf5: sanitizeUdf(p?.raceType || (p?.isRunForCause ? 'No Competition' : 'Competition')),
    udf6: sanitizeUdf(p?.gender),
    udf7: sanitizeUdf(p?.dateOfBirth),
    udf8: sanitizeUdf(p?.tshirtSize),
    udf9: sanitizeUdf(p?.address),
    udf10: sanitizeUdf(p?.emergencyPhone),
    udf11: sanitizeUdf(p?.couponCode, 50),
    udf12: sanitizeUdf(String(p?.couponDiscount || 0), 50),
    udf13: sanitizeUdf(String(p?.convenienceFee || 0), 50),
    udf14: sanitizeUdf(p?.isRunForCause ? 'true' : 'false', 50),
    udf15: sanitizeUdf(p?.isDonation ? 'true' : 'false', 50),
  };
  // Remove null entries so PhonePe doesn't receive empty fields
  return Object.fromEntries(Object.entries(fields).filter(([, v]) => v !== null));
}

// Resolve race ID from category and flags
// First tries to use raceId directly if provided, then falls back to legacy mapping
function resolveRaceId(category, isDonation, isRunForCause, raceId = null) {
  // If raceId is directly provided, use it
  if (raceId) {
    return raceId;
  }

  // Legacy mapping for backward compatibility
  if (isDonation) {
    if (category === '₹1') return 'donate1';
    if (category === '₹100') return 'donate100';
    if (category === '₹200') return 'donate200';
    return null;
  }

  if (category === '1 KM' || category === '0 KM') {
    return isRunForCause ? 'test-non-competitive' : 'test-competitive';
  }

  if (isRunForCause) {
    if (category === '3 KM') return '3km';
    if (category === '5 KM') return 'cause5km';
    if (category === '10 KM') return 'cause10km';
    return null;
  }

  if (category === '5 KM') return '5km';
  if (category === '10 KM') return '10km';
  if (category === '21.1 KM') return '21km';
  if (category === 'Kids') return 'kidsrun';
  if (category === 'Kids Test') return 'test-kids';

  return null;
}

export async function POST(request) {
  try {
    const { amount, participantData } = await request.json();

    // Validate amount
    if (!amount || amount < 1) {
      return NextResponse.json(
        { error: 'Invalid registration amount' },
        { status: 400 }
      );
    }

    // --- SERVER-SIDE PRICE VALIDATION ---
    const category = participantData?.raceCategory;
    const isDonation = participantData?.isDonation;
    const isRunForCause = participantData?.isRunForCause;

    // Resolve race ID - use directly provided raceId if available, otherwise use legacy mapping
    const raceId = resolveRaceId(category, isDonation, isRunForCause, participantData?.raceId);
    if (!raceId) {
      return NextResponse.json(
        { error: 'Invalid race category' },
        { status: 400 }
      );
    }

    // Fetch race from database
    const { data: race, error: raceError } = await supabaseAdmin
      .from('races')
      .select('*')
      .eq('id', raceId)
      .eq('is_active', true)
      .single();

    if (raceError || !race) {
      console.error('Race not found:', raceId, raceError);
      return NextResponse.json(
        { error: 'Invalid race category' },
        { status: 400 }
      );
    }

    // Check if race is sold out
    if (race.is_sold_out) {
      return NextResponse.json(
        { error: 'This race category is sold out' },
        { status: 400 }
      );
    }

    let expectedBasePrice = race.price;
    let expectedFeePercent = CONVENIENCE_FEE_PERCENT;
    let expectedDiscount = 0;
    let isRaceFinalPriceCoupon = false;

    const couponCode = participantData?.couponCode;
    if (couponCode && !isDonation) {
      // Fetch coupon from database
      const { data: coupon, error: couponError } = await supabaseAdmin
        .from('coupons')
        .select('*')
        .eq('code', couponCode.toUpperCase())
        .eq('is_active', true)
        .single();

      if (!couponError && coupon) {
        // Check valid_race_ids restriction
        const validRaceIds = coupon.valid_race_ids;
        const raceAllowed = !validRaceIds || validRaceIds.length === 0 || validRaceIds.includes(raceId);

        // Check expiry
        if (raceAllowed && (!coupon.expires_at || new Date(coupon.expires_at) > new Date())) {
          // Check max uses
          if (!coupon.max_uses || coupon.uses_count < coupon.max_uses) {
            if (coupon.type === 'percent') {
              expectedDiscount = Math.round(race.price * parseFloat(coupon.percent) / 100);
            } else if (coupon.type === 'raceFixed') {
              expectedDiscount = coupon.discount_by_race?.[raceId] || 0;
            } else if (coupon.type === 'raceFinalPrice') {
              // For raceFinalPrice, the base price becomes the final price from coupon
              const finalPrice = coupon.final_price_by_race?.[raceId];
              if (finalPrice !== undefined) {
                isRaceFinalPriceCoupon = true;
                expectedDiscount = race.price - finalPrice;  // Discount = original - final
                expectedBasePrice = finalPrice;  // Base price is now the final price
                expectedFeePercent = 3;  // 3% convenience fee for this coupon type
              }
            } else {
              expectedDiscount = coupon.amount;
            }
          }
        }
      }
    }

    // Calculate expected total server-side
    const expectedFee = Math.round(expectedBasePrice * expectedFeePercent / 100);
    // For raceFinalPrice, total = finalPrice + fee (no discount subtraction since price is already adjusted)
    const expectedTotal = isRaceFinalPriceCoupon
      ? expectedBasePrice + expectedFee
      : Math.max(0, race.price + expectedFee - expectedDiscount);

    if (amount !== expectedTotal) {
      console.error(`Price mismatch! Client sent ₹${amount}, server expected ₹${expectedTotal} for race ${raceId} (coupon: ${couponCode || 'none'})`);
      return NextResponse.json(
        { error: 'Payment amount does not match expected price. Please refresh and try again.' },
        { status: 400 }
      );
    }
    // --- END PRICE VALIDATION ---

    // Generate transaction ID early so we can save pending registration
    const merchantOrderId = `MARATHON${Date.now()}`;

    // --- SAVE PENDING REGISTRATION BEFORE PAYMENT ---
    if (supabaseAdmin && !isDonation) {
      try {
        const { error: insertError } = await supabaseAdmin
          .from('marathon_registrations')
          .insert([{
            name: participantData?.name,
            email: participantData?.email,
            phone: participantData?.phone,
            emergency_phone: participantData?.emergencyPhone,
            date_of_birth: participantData?.dateOfBirth || null,
            age_legacy: participantData?.dateOfBirth ? (() => {
              const today = new Date();
              const birth = new Date(participantData.dateOfBirth);
              let age = today.getFullYear() - birth.getFullYear();
              const monthDiff = today.getMonth() - birth.getMonth();
              if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
                age--;
              }
              return age;
            })() : null,
            gender: participantData?.gender,
            tshirt_size: participantData?.tshirtSize,
            address: participantData?.address,
            race_id: raceId,
            race_category: participantData?.raceCategory,
            race_name: participantData?.raceName,
            is_run_for_cause: participantData?.isRunForCause || false,
            race_type: participantData?.raceType || (participantData?.isRunForCause ? 'No Competition' : 'Competition'),
            amount: expectedBasePrice,
            convenience_fee: expectedFee,
            coupon_code: couponCode || null,
            coupon_discount: expectedDiscount,
            total_amount: expectedTotal,
            transaction_id: merchantOrderId,
            payment_status: 'PENDING',
            is_donation: false
          }]);

        if (insertError) {
          console.error('Failed to save pending registration:', insertError);
        } else {
          console.log('Pending registration saved:', merchantOrderId);
        }
      } catch (pendingError) {
        console.error('Error saving pending registration:', pendingError);
      }
    }
    // --- END PENDING REGISTRATION ---

    const clientId = process.env.PHONEPE_CLIENT_ID;
    const clientSecret = process.env.PHONEPE_CLIENT_SECRET;
    const clientVersion = process.env.PHONEPE_CLIENT_VERSION || '1';
    const env = process.env.PHONEPE_ENV || 'UAT';

    if (!clientId || !clientSecret) {
      console.error('Missing PhonePe credentials');
      return NextResponse.json(
        { error: 'Payment gateway not configured' },
        { status: 500 }
      );
    }

    // PhonePe API URLs
    const baseUrl = env === 'PRODUCTION' ? BASE_URL_PROD : BASE_URL_UAT;
    const authUrl = env === 'PRODUCTION' ? AUTH_URL_PROD : AUTH_URL_UAT;

    console.log('Environment:', env);
    console.log('Base URL:', baseUrl);

    // Step 1: Get OAuth access token
    console.log('Getting OAuth token...');
    let accessToken;
    try {
      accessToken = await getAccessToken(clientId, clientSecret, clientVersion, authUrl);
      console.log('Access token obtained successfully');
    } catch (tokenError) {
      console.error('Token error:', tokenError.message);
      return NextResponse.json(
        { error: 'Authentication failed: ' + tokenError.message },
        { status: 500 }
      );
    }

    const baseAppUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const redirectUrl = `${baseAppUrl}/marathon-success?transactionId=${merchantOrderId}`;
    const callbackUrl = `${baseAppUrl}/api/phonepe/callback`;

    // Step 2: Create payment request
    const payload = {
      merchantOrderId: merchantOrderId,
      amount: amount * 100, // Convert to paise
      expireAfter: 1200, // 20 minutes
      metaInfo: buildMetaInfo(participantData),
      paymentFlow: {
        type: 'PG_CHECKOUT',
        message: `Marathon Registration - ${participantData?.raceCategory || 'Race'} - Rs ${amount}`,
        merchantUrls: {
          redirectUrl: redirectUrl,
          callbackUrl: callbackUrl
        }
      }
    };

    console.log('Payment Request URL:', `${baseUrl}/checkout/v2/pay`);
    console.log('Payment Payload:', JSON.stringify(payload, null, 2));

    // Payment request with retry logic
    let response;
    let responseText;
    const maxRetries = 3;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        response = await fetch(`${baseUrl}/checkout/v2/pay`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `O-Bearer ${accessToken}`,
          },
          body: JSON.stringify(payload)
        });

        responseText = await response.text();
        console.log('Payment Response Status:', response.status);
        console.log('Payment Response:', responseText);
        break;
      } catch (fetchError) {
        console.log(`Payment request attempt ${attempt}/${maxRetries} failed:`, fetchError.message);

        if (attempt < maxRetries && (fetchError.message.includes('fetch failed') || fetchError.cause?.code === 'ENOTFOUND' || fetchError.cause?.code === 'ECONNRESET')) {
          console.log(`Retrying payment request in ${attempt * 500}ms...`);
          await new Promise(resolve => setTimeout(resolve, attempt * 500));
          continue;
        }

        throw fetchError;
      }
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse PhonePe response:', responseText);
      return NextResponse.json(
        { error: 'Invalid response from PhonePe' },
        { status: 500 }
      );
    }

    // Check for redirect URL in various response formats
    const checkoutUrl = data.redirectUrl || data.checkoutPageUrl || data.data?.redirectUrl || data.data?.checkoutPageUrl;

    if (checkoutUrl) {
      return NextResponse.json({
        success: true,
        redirectUrl: checkoutUrl,
        transactionId: merchantOrderId,
        orderId: data.orderId || data.data?.orderId,
      });
    }

    // Error handling
    console.error('PhonePe API Error:', JSON.stringify(data, null, 2));
    return NextResponse.json(
      {
        success: false,
        error: data.message || data.error?.message || 'Failed to initiate payment',
        code: data.code || data.error?.code,
        details: data
      },
      { status: 400 }
    );

  } catch (error) {
    console.error('Error creating marathon payment:', error);
    return NextResponse.json(
      { error: 'Failed to create payment order: ' + error.message },
      { status: 500 }
    );
  }
}
