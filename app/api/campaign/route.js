import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// PhonePe URLs
const BASE_URL_UAT = 'https://api-preprod.phonepe.com/apis/pg-sandbox';
const AUTH_URL_UAT = 'https://api-preprod.phonepe.com/apis/pg-sandbox';
const BASE_URL_PROD = 'https://api.phonepe.com/apis/pg';
const AUTH_URL_PROD = 'https://api.phonepe.com/apis/identity-manager';

async function getAccessToken(clientId, clientSecret, clientVersion, authUrl, retries = 3) {
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
      if (attempt < retries && (error.message.includes('fetch failed') || error.cause?.code === 'ENOTFOUND' || error.cause?.code === 'ECONNRESET')) {
        await new Promise(resolve => setTimeout(resolve, attempt * 500));
        continue;
      }
      throw error;
    }
  }

  throw lastError;
}

export async function POST(request) {
  try {
    const {
      amount,
      donor_name,
      donor_email,
      donor_phone,
      address,
      pincode,
      city,
      state,
      country,
      pan_number,
      is_anonymous,
      message
    } = await request.json();

    if (!amount || amount < 10) {
      return NextResponse.json({ error: 'Minimum donation amount is ₹10' }, { status: 400 });
    }

    if (!donor_name || !donor_email || !donor_phone) {
      return NextResponse.json({ error: 'Donor name, email, and phone are required' }, { status: 400 });
    }

    if (!address || !pincode || !city || !state) {
      return NextResponse.json({ error: 'Address details are required' }, { status: 400 });
    }

    const clientId = process.env.PHONEPE_CLIENT_ID;
    const clientSecret = process.env.PHONEPE_CLIENT_SECRET;
    const clientVersion = process.env.PHONEPE_CLIENT_VERSION || '1';
    const env = process.env.PHONEPE_ENV || 'UAT';

    if (!clientId || !clientSecret) {
      return NextResponse.json({ error: 'Payment gateway not configured' }, { status: 500 });
    }

    const baseUrl = env === 'PRODUCTION' ? BASE_URL_PROD : BASE_URL_UAT;
    const authUrl = env === 'PRODUCTION' ? AUTH_URL_PROD : AUTH_URL_UAT;

    let accessToken;
    try {
      accessToken = await getAccessToken(clientId, clientSecret, clientVersion, authUrl);
    } catch (tokenError) {
      return NextResponse.json({ error: 'Authentication failed: ' + tokenError.message }, { status: 500 });
    }

    const merchantOrderId = `HPV${Date.now()}`;
    const baseAppUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const redirectUrl = `${baseAppUrl}/hpv-campaign?transactionId=${merchantOrderId}&verify=true`;
    const callbackUrl = `${baseAppUrl}/api/campaign/callback`;

    // Create PENDING donation record before redirecting to PhonePe
    const { error: insertError } = await supabase
      .from('campaign_donations')
      .insert({
        donor_name,
        donor_email,
        donor_phone,
        address: address || null,
        pincode: pincode || null,
        city: city || null,
        state: state || null,
        country: country || 'INDIA',
        pan_number: pan_number || null,
        amount,
        transaction_id: merchantOrderId,
        payment_status: 'PENDING',
        campaign_id: 'hpv-vaccination',
        is_anonymous: is_anonymous || false,
        display_name: is_anonymous ? 'Anonymous' : donor_name,
        message: message || null,
      });

    if (insertError) {
      console.error('Error creating pending donation:', insertError);
      // Continue anyway - the callback/status will try again
    }

    const payload = {
      merchantOrderId: merchantOrderId,
      amount: amount * 100,
      expireAfter: 1200,
      metaInfo: {
        udf1: donor_name,
        udf2: donor_email,
        udf3: donor_phone,
        udf4: pan_number || '',
        udf5: is_anonymous ? 'anonymous' : 'public'
      },
      paymentFlow: {
        type: 'PG_CHECKOUT',
        message: `HPV Vaccination Campaign Donation - Rs ${amount}`,
        merchantUrls: {
          redirectUrl: redirectUrl,
          callbackUrl: callbackUrl
        }
      }
    };

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
        break;
      } catch (fetchError) {
        if (attempt < maxRetries) {
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
      return NextResponse.json({ error: 'Invalid response from PhonePe' }, { status: 500 });
    }

    const checkoutUrl = data.redirectUrl || data.checkoutPageUrl || data.data?.redirectUrl || data.data?.checkoutPageUrl;

    if (checkoutUrl) {
      return NextResponse.json({
        success: true,
        redirectUrl: checkoutUrl,
        transactionId: merchantOrderId,
        orderId: data.orderId || data.data?.orderId,
      });
    }

    return NextResponse.json({
      success: false,
      error: data.message || data.error?.message || 'Failed to initiate payment',
      code: data.code || data.error?.code,
    }, { status: 400 });

  } catch (error) {
    console.error('Error creating campaign payment:', error);
    return NextResponse.json({ error: 'Failed to create payment order: ' + error.message }, { status: 500 });
  }
}
