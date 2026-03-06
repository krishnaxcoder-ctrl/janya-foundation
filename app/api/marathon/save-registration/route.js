import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { Resend } from 'resend';

// UAT/Sandbox URLs
const BASE_URL_UAT = 'https://api-preprod.phonepe.com/apis/pg-sandbox';
const AUTH_URL_UAT = 'https://api-preprod.phonepe.com/apis/pg-sandbox';

// Production URLs
const BASE_URL_PROD = 'https://api.phonepe.com/apis/pg';
const AUTH_URL_PROD = 'https://api.phonepe.com/apis/identity-manager';

const CONVENIENCE_FEE_PERCENT = 3.5;

// Calculate age from date of birth
function calculateAge(dateOfBirth) {
  if (!dateOfBirth) return null;
  const today = new Date();
  const birth = new Date(dateOfBirth);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

// Get OAuth access token from PhonePe
async function getAccessToken(clientId, clientSecret, clientVersion, authUrl) {
  const response = await fetch(`${authUrl}/v1/oauth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_version: clientVersion,
      client_secret: clientSecret,
      grant_type: 'client_credentials',
    }),
  });

  const data = await response.json();
  if (data.access_token) return data.access_token;
  throw new Error(data.message || 'Failed to get access token');
}

// Resolve race ID from category + flags
// First tries to use raceId directly if provided, then falls back to legacy mapping
function resolveRaceId(raceCategory, isDonation, isRunForCause, raceId = null) {
  // If raceId is directly provided, use it
  if (raceId) {
    return raceId;
  }

  // Legacy mapping for backward compatibility
  if (isDonation) {
    if (raceCategory === '₹1') return 'donate1';
    if (raceCategory === '₹100') return 'donate100';
    if (raceCategory === '₹200') return 'donate200';
  } else if (raceCategory === '1 KM') {
    return isRunForCause ? 'test-non-competitive' : 'test-competitive';
  } else if (raceCategory === '0 KM') {
    return isRunForCause ? 'test-non-competitive' : 'test-competitive';
  } else if (isRunForCause) {
    if (raceCategory === '3 KM') return '3km';
    if (raceCategory === '5 KM') return 'cause5km';
    if (raceCategory === '10 KM') return 'cause10km';
  } else {
    if (raceCategory === '5 KM') return '5km';
    if (raceCategory === '10 KM') return '10km';
    if (raceCategory === '21.1 KM') return '21km';
    if (raceCategory === 'Kids') return 'kidsrun';
    if (raceCategory === 'Kids Test') return 'test-kids';
  }
  return null;
}

export async function POST(request) {
  try {
    const data = await request.json();

    const {
      name, email, phone, emergencyPhone, dateOfBirth,
      gender, tshirtSize, address, raceId: providedRaceId, raceCategory, raceName,
      isRunForCause, raceType, couponCode, isDonation,
      transactionId
    } = data;

    // --- STEP 1: Validate transactionId format ---
    if (!transactionId || !transactionId.startsWith('MARATHON')) {
      return NextResponse.json(
        { success: false, error: 'Invalid transaction ID' },
        { status: 400 }
      );
    }

    // --- STEP 2: Check if Supabase is ready ---
    if (!supabaseAdmin) {
      console.error('Supabase client is not initialized');
      return NextResponse.json(
        { success: false, error: 'Database connection not configured' },
        { status: 500 }
      );
    }

    // --- STEP 3: Check existing registration ---
    const { data: existing } = await supabaseAdmin
      .from('marathon_registrations')
      .select('*')
      .eq('transaction_id', transactionId)
      .single();

    // If already marked as SUCCESS and email already sent, do NOT send emails again
    if (existing && existing.payment_status === 'SUCCESS') {
      if (existing.email_sent === true) {
        console.log('Registration already processed and email already sent, skipping:', transactionId);
        return NextResponse.json({
          success: true,
          message: 'Registration already saved',
          alreadyProcessed: true,
          emailSent: true, // Email was already sent previously
          data: existing
        });
      }
      // If SUCCESS but email_sent is false/null, we should try to send email
      console.log('Registration SUCCESS but email not sent yet, will attempt to send:', transactionId);
    }

    // --- STEP 4: Verify payment with PhonePe ---
    const clientId = process.env.PHONEPE_CLIENT_ID;
    const clientSecret = process.env.PHONEPE_CLIENT_SECRET;
    const clientVersion = process.env.PHONEPE_CLIENT_VERSION || '1';
    const env = process.env.PHONEPE_ENV || 'UAT';
    const baseUrl = env === 'PRODUCTION' ? BASE_URL_PROD : BASE_URL_UAT;
    const authUrl = env === 'PRODUCTION' ? AUTH_URL_PROD : AUTH_URL_UAT;

    let phonepeData;
    try {
      const accessToken = await getAccessToken(clientId, clientSecret, clientVersion, authUrl);
      const statusResponse = await fetch(`${baseUrl}/checkout/v2/order/${transactionId}/status`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `O-Bearer ${accessToken}`,
        },
      });
      phonepeData = await statusResponse.json();
    } catch (verifyError) {
      console.error('PhonePe verification failed:', verifyError.message);
      return NextResponse.json(
        { success: false, error: 'Payment verification failed' },
        { status: 500 }
      );
    }

    if (phonepeData.state !== 'COMPLETED' && phonepeData.state !== 'SUCCESS') {
      console.error(`Payment not completed. State: ${phonepeData.state}`, JSON.stringify(phonepeData));
      return NextResponse.json(
        { success: false, error: `Payment has not been completed. Status: ${phonepeData.state}` },
        { status: 400 }
      );
    }

    const verifiedAmountPaise = phonepeData.amount;
    const verifiedAmount = verifiedAmountPaise ? verifiedAmountPaise / 100 : 0;
    const verifiedPaymentId = phonepeData.paymentDetails?.[0]?.transactionId || transactionId;

    // --- STEP 5: Validate race category and fetch from database ---
    // Use directly provided raceId if available, otherwise use legacy mapping
    const raceId = resolveRaceId(raceCategory, isDonation, isRunForCause, providedRaceId);

    if (!raceId) {
      console.error(`Invalid race category: ${raceCategory}, isDonation: ${isDonation}, isRunForCause: ${isRunForCause}`);
      return NextResponse.json(
        { success: false, error: 'Invalid race category' },
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
        { success: false, error: 'Invalid race category' },
        { status: 400 }
      );
    }

    // Check sold-out
    if (race.is_sold_out) {
      return NextResponse.json(
        { success: false, error: 'This race category is sold out' },
        { status: 400 }
      );
    }

    let expectedBasePrice = race.price;
    let expectedFeePercent = CONVENIENCE_FEE_PERCENT;
    let expectedDiscount = 0;
    let isRaceFinalPriceCoupon = false;

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

    const expectedFee = Math.round(expectedBasePrice * expectedFeePercent / 100);
    // For raceFinalPrice, total = finalPrice + fee (no discount subtraction since price is already adjusted)
    const expectedTotal = isRaceFinalPriceCoupon
      ? expectedBasePrice + expectedFee
      : Math.max(0, race.price + expectedFee - expectedDiscount);

    // --- STEP 6: Verify PhonePe amount matches expected price ---
    if (verifiedAmount !== expectedTotal) {
      console.error(`Amount mismatch! PhonePe verified ₹${verifiedAmount}, expected ₹${expectedTotal} for race ${raceId}`);
      return NextResponse.json(
        { success: false, error: 'Payment amount does not match expected price' },
        { status: 400 }
      );
    }

    // --- STEP 7: Send confirmation emails IMMEDIATELY after payment verification ---
    // Using user-filled details from request (not from DB)
    let emailSent = false;
    try {
      if (process.env.RESEND_API_KEY && !isDonation) {
        const resend = new Resend(process.env.RESEND_API_KEY);
        const adminEmail = process.env.ADMIN_EMAIL || 'krishnaxcoder@gmail.com';

        const raceCategoryDisplay = isRunForCause ? `${raceCategory} (Run for Cause)` : raceCategory;
        const raceTypeDisplay = raceType || (isRunForCause ? 'No Competition' : 'Competition');
        const runForCauseNote = isRunForCause ? '<span style="color: #6b7280; font-size: 12px;"> - No prize, No chip | T-shirt, Medal, E-certificate & Refreshment</span>' : '';
        const age = calculateAge(dateOfBirth);
        const dobDisplay = dateOfBirth ? new Date(dateOfBirth).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : 'N/A';
        const ageDisplay = age ? `${age} years` : 'N/A';

        const adminEmailContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(to right, #ec4899, #f472b6); padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">New Marathon Registration</h1>
            </div>
            <div style="padding: 20px; background: #f9fafb;">
              <h2 style="color: #1f2937; border-bottom: 2px solid #ec4899; padding-bottom: 10px;">Participant Details</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #6b7280;">Name:</td><td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${name}</td></tr>
                <tr><td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #6b7280;">Email:</td><td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${email}</td></tr>
                <tr><td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #6b7280;">Phone:</td><td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${phone}</td></tr>
                <tr><td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #6b7280;">Emergency Contact:</td><td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${emergencyPhone}</td></tr>
                <tr><td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #6b7280;">Date of Birth:</td><td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${dobDisplay}${age ? ` (${age} years)` : ''}</td></tr>
                <tr><td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #6b7280;">Gender:</td><td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${gender}</td></tr>
                <tr><td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #6b7280;">T-Shirt Size:</td><td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${tshirtSize || 'N/A'}</td></tr>
                <tr><td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #6b7280;">Address:</td><td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${address || 'Not provided'}</td></tr>
              </table>
              <h2 style="color: #1f2937; border-bottom: 2px solid #ec4899; padding-bottom: 10px; margin-top: 20px;">Registration Details</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #6b7280;">Race Category:</td><td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #1f2937; font-weight: bold;">${raceCategoryDisplay}${runForCauseNote}</td></tr>
                <tr><td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #6b7280;">Race Type:</td><td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #1f2937; font-weight: bold;">${raceTypeDisplay}</td></tr>
                ${couponCode && expectedDiscount > 0 ? `<tr><td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #6b7280;">Coupon Applied:</td><td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #059669; font-weight: bold;">${couponCode} (-₹${expectedDiscount})</td></tr>` : ''}
                <tr><td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #6b7280;">Amount Paid:</td><td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #059669; font-weight: bold;">₹${expectedTotal}</td></tr>
                <tr><td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #6b7280;">Payment ID:</td><td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #1f2937; font-size: 12px;">${verifiedPaymentId}</td></tr>
                <tr><td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #6b7280;">Order ID:</td><td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #1f2937; font-size: 12px;">${transactionId}</td></tr>
              </table>
            </div>
            <div style="background: #1f2937; padding: 15px; text-align: center;"><p style="color: #9ca3af; margin: 0; font-size: 12px;">Janya Foundation Marathon</p></div>
          </div>
        `;

        const participantEmailContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(to right, #ec4899, #f472b6); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">Registration Confirmed!</h1>
              <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Thank you for registering for Janya Foundation Marathon</p>
            </div>
            <div style="padding: 30px; background: #ffffff;">
              <p style="color: #1f2937; font-size: 16px; line-height: 1.6;">Dear <strong>${name}</strong>,</p>
              <p style="color: #4b5563; font-size: 14px; line-height: 1.6;">We are thrilled to confirm your registration for the <strong>Janya Foundation Marathon</strong>!</p>
              <div style="background: #fdf2f8; border-radius: 10px; padding: 20px; margin: 20px 0;">
                <h2 style="color: #ec4899; margin: 0 0 15px 0; font-size: 18px;">Your Details</h2>
                <table style="width: 100%;">
                  <tr><td style="padding: 8px 0; color: #6b7280;">Name:</td><td style="padding: 8px 0; color: #1f2937; font-weight: bold; text-align: right;">${name}</td></tr>
                  <tr><td style="padding: 8px 0; color: #6b7280;">Email:</td><td style="padding: 8px 0; color: #1f2937; font-weight: bold; text-align: right;">${email}</td></tr>
                  <tr><td style="padding: 8px 0; color: #6b7280;">Phone:</td><td style="padding: 8px 0; color: #1f2937; font-weight: bold; text-align: right;">${phone}</td></tr>
                  <tr><td style="padding: 8px 0; color: #6b7280;">Emergency Contact:</td><td style="padding: 8px 0; color: #1f2937; font-weight: bold; text-align: right;">${emergencyPhone}</td></tr>
                  <tr><td style="padding: 8px 0; color: #6b7280;">Date of Birth:</td><td style="padding: 8px 0; color: #1f2937; font-weight: bold; text-align: right;">${dobDisplay}${age ? ` (${age} years)` : ''}</td></tr>
                  <tr><td style="padding: 8px 0; color: #6b7280;">Gender:</td><td style="padding: 8px 0; color: #1f2937; font-weight: bold; text-align: right;">${gender}</td></tr>
                  <tr><td style="padding: 8px 0; color: #6b7280;">Address:</td><td style="padding: 8px 0; color: #1f2937; font-weight: bold; text-align: right;">${address || 'Not provided'}</td></tr>
                </table>
              </div>
              <div style="background: #fdf2f8; border-radius: 10px; padding: 20px; margin: 20px 0;">
                <h2 style="color: #ec4899; margin: 0 0 15px 0; font-size: 18px;">Registration Details</h2>
                <table style="width: 100%;">
                  <tr><td style="padding: 8px 0; color: #6b7280;">Race Category:</td><td style="padding: 8px 0; color: #1f2937; font-weight: bold; text-align: right;">${raceCategoryDisplay}</td></tr>
                  <tr><td style="padding: 8px 0; color: #6b7280;">Race Type:</td><td style="padding: 8px 0; color: #1f2937; font-weight: bold; text-align: right;">${raceTypeDisplay}</td></tr>
                  ${couponCode && expectedDiscount > 0 ? `<tr><td style="padding: 8px 0; color: #6b7280;">Coupon Applied:</td><td style="padding: 8px 0; color: #059669; font-weight: bold; text-align: right;">${couponCode} (-₹${expectedDiscount})</td></tr>` : ''}
                  <tr><td style="padding: 8px 0; color: #6b7280;">Amount Paid:</td><td style="padding: 8px 0; color: #059669; font-weight: bold; text-align: right;">₹${expectedTotal}</td></tr>
                  <tr><td style="padding: 8px 0; color: #6b7280;">Transaction ID:</td><td style="padding: 8px 0; color: #1f2937; text-align: right; font-size: 11px;">${transactionId}</td></tr>
                </table>
              </div>
              <div style="background: #f3f4f6; border-radius: 10px; padding: 20px; margin: 20px 0;">
                <h3 style="color: #1f2937; margin: 0 0 10px 0; font-size: 16px;">What's Next?</h3>
                <ul style="color: #4b5563; font-size: 14px; line-height: 1.8; padding-left: 20px; margin: 0;">
                  <li>Save this email for your records</li>
                  <li><strong>BIB Collection (3KM, 5KM, 10KM & 21.1KM):</strong> March 6-7, 2026 (5 PM - 8 PM) - Decathlon, Belapur</li>
                  <li><strong>Marathon Day:</strong> March 8, 2026 (5:00 AM)</li>
                </ul>
              </div>
              <p style="color: #4b5563; font-size: 14px; line-height: 1.6;">Contact us at <a href="tel:+919321496142" style="color: #ec4899;">+91 93214 96142</a></p>
              <p style="color: #1f2937; font-size: 14px; margin-top: 20px;">See you at the marathon!<br/><strong>Team Janya Foundation</strong></p>
            </div>
            <div style="background: #1f2937; padding: 20px; text-align: center;">
              <p style="color: #9ca3af; margin: 0; font-size: 12px;">Janya Foundation | Empowering Women & Children</p>
            </div>
          </div>
        `;

        // Send emails sequentially with delay to avoid rate limiting (429 errors)
        // Send participant email first (most important)
        let participantEmailSent = false;
        let adminEmailSent = false;

        try {
          const participantResult = await resend.emails.send({
            from: 'Janya Foundation <noreply@janyafoundation.in>',
            replyTo: 'janyafoundation.04@gmail.com',
            to: email,
            subject: 'Registration Confirmed - Janya Foundation Marathon',
            html: participantEmailContent,
          });
          participantEmailSent = !!participantResult.data?.id;
          console.log('Participant email sent:', participantResult.data?.id || 'failed', participantResult.error?.message || '');

          if (participantResult.error) {
            console.error('Participant email error details:', JSON.stringify(participantResult.error));
          }
        } catch (participantErr) {
          console.error('Participant email exception:', participantErr.message);
        }

        // Add 3 second delay before sending admin email to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 3000));

        try {
          // Send to admin - also CC the foundation email to ensure delivery
          const adminResult = await resend.emails.send({
            from: 'Janya Foundation <noreply@janyafoundation.in>',
            replyTo: email, // Reply-to the participant
            to: [adminEmail, 'janyafoundation.04@gmail.com'].filter((e, i, arr) => arr.indexOf(e) === i), // Remove duplicates
            subject: `New Marathon Registration - ${name} (${raceCategoryDisplay})`,
            html: adminEmailContent,
          });
          adminEmailSent = !!adminResult.data?.id;
          console.log('Admin email sent:', adminResult.data?.id || 'failed', adminResult.error?.message || '');

          if (adminResult.error) {
            console.error('Admin email error details:', JSON.stringify(adminResult.error));
          }
        } catch (adminErr) {
          console.error('Admin email exception:', adminErr.message);
        }

        // Both emails must succeed for emailSent to be true
        emailSent = participantEmailSent && adminEmailSent;
        console.log(`Email status - Participant: ${participantEmailSent}, Admin: ${adminEmailSent}, Final: ${emailSent}`);
      }
    } catch (emailError) {
      console.error('Email sending failed (non-fatal):', emailError.message);
      // Continue to save registration even if email fails
    }

    // --- STEP 8: Save or Update registration in database ---
    let savedData;

    // Case 1: Already SUCCESS but email wasn't sent - just update email_sent flag
    if (existing && existing.payment_status === 'SUCCESS' && existing.email_sent !== true) {
      const { data: updatedData, error: updateError } = await supabaseAdmin
        .from('marathon_registrations')
        .update({
          email_sent: emailSent
        })
        .eq('transaction_id', transactionId)
        .select();

      if (updateError) {
        console.error('Supabase email_sent update error:', updateError);
      } else {
        console.log('Updated email_sent for existing SUCCESS registration:', transactionId);
      }
      savedData = updatedData || existing;

      return NextResponse.json({
        success: true,
        message: 'Email sent for existing registration',
        alreadyProcessed: true,
        emailSent,
        data: savedData
      });
    }

    // Case 2: PENDING -> SUCCESS
    if (existing && existing.payment_status === 'PENDING') {
      const { data: updatedData, error: updateError } = await supabaseAdmin
        .from('marathon_registrations')
        .update({
          payment_id: verifiedPaymentId,
          payment_status: 'SUCCESS',
          race_id: raceId, // Ensure race_id is set even for old pending registrations
          email_sent: emailSent // Track if email was successfully sent
        })
        .eq('transaction_id', transactionId)
        .select();

      if (updateError) {
        console.error('Supabase update error:', updateError);
        return NextResponse.json(
          { success: false, error: 'Failed to update registration', details: updateError.message },
          { status: 500 }
        );
      }
      savedData = updatedData;
      console.log('Registration updated to SUCCESS:', transactionId);
    } else {
      const { data: insertedData, error: insertError } = await supabaseAdmin
        .from('marathon_registrations')
        .insert([
          {
            name,
            email,
            phone,
            emergency_phone: emergencyPhone,
            date_of_birth: dateOfBirth || null,
            age_legacy: dateOfBirth ? (() => {
              const today = new Date();
              const birth = new Date(dateOfBirth);
              let age = today.getFullYear() - birth.getFullYear();
              const monthDiff = today.getMonth() - birth.getMonth();
              if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
                age--;
              }
              return age;
            })() : null,
            gender,
            tshirt_size: tshirtSize,
            address,
            race_id: raceId,
            race_category: raceCategory,
            race_name: raceName,
            is_run_for_cause: isRunForCause || false,
            race_type: raceType || (isRunForCause ? 'No Competition' : 'Competition'),
            amount: expectedBasePrice,
            convenience_fee: expectedFee,
            coupon_code: couponCode || null,
            coupon_discount: expectedDiscount,
            total_amount: expectedTotal,
            payment_id: verifiedPaymentId,
            transaction_id: transactionId,
            payment_status: 'SUCCESS',
            is_donation: isDonation || false,
            email_sent: emailSent // Track if email was successfully sent
          }
        ])
        .select();

      if (insertError) {
        console.error('Supabase insert error:', insertError);
        return NextResponse.json(
          { success: false, error: 'Failed to save registration', details: insertError.message },
          { status: 500 }
        );
      }
      savedData = insertedData;
      console.log('Registration inserted successfully:', transactionId);
    }

    return NextResponse.json({
      success: true,
      message: 'Registration saved successfully',
      emailSent,
      data: savedData
    });

  } catch (error) {
    console.error('Save registration error:', error);
    return NextResponse.json(
      { success: false, error: 'Server error', details: error.message },
      { status: 500 }
    );
  }
}
