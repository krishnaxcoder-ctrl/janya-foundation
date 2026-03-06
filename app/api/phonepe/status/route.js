import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { Resend } from 'resend';

// UAT/Sandbox URLs
const BASE_URL_UAT = 'https://api-preprod.phonepe.com/apis/pg-sandbox';
const AUTH_URL_UAT = 'https://api-preprod.phonepe.com/apis/pg-sandbox';

// Production URLs
const BASE_URL_PROD = 'https://api.phonepe.com/apis/pg';
const AUTH_URL_PROD = 'https://api.phonepe.com/apis/identity-manager';

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

  const data = await response.json();

  if (data.access_token) {
    return data.access_token;
  }

  throw new Error(data.message || 'Failed to get access token');
}

export async function POST(request) {
  try {
    const { transactionId } = await request.json();

    if (!transactionId) {
      return NextResponse.json(
        { error: 'Transaction ID is required' },
        { status: 400 }
      );
    }

    const clientId = process.env.PHONEPE_CLIENT_ID;
    const clientSecret = process.env.PHONEPE_CLIENT_SECRET;
    const clientVersion = process.env.PHONEPE_CLIENT_VERSION || '1';
    const env = process.env.PHONEPE_ENV || 'UAT';

    const baseUrl = env === 'PRODUCTION' ? BASE_URL_PROD : BASE_URL_UAT;
    const authUrl = env === 'PRODUCTION' ? AUTH_URL_PROD : AUTH_URL_UAT;

    // Get OAuth token
    const accessToken = await getAccessToken(clientId, clientSecret, clientVersion, authUrl);

    // Check order status using v2 API
    const response = await fetch(`${baseUrl}/checkout/v2/order/${transactionId}/status`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `O-Bearer ${accessToken}`,
      },
    });

    const data = await response.json();
    console.log('PhonePe Status Response:', JSON.stringify(data, null, 2));

    // Handle different status responses
    // PhonePe may return 'COMPLETED' or 'SUCCESS' depending on API version
    if (data.state === 'COMPLETED' || data.state === 'SUCCESS') {
      const paymentId = data.paymentDetails?.[0]?.transactionId || data.orderId || transactionId;

      // Immediately update DB to SUCCESS and send email
      let emailSent = false;
      if (supabaseAdmin) {
        try {
          // First check if already processed
          const { data: existing } = await supabaseAdmin
            .from('marathon_registrations')
            .select('*')
            .eq('transaction_id', transactionId)
            .single();

          if (existing && existing.payment_status === 'PENDING') {
            // Update to SUCCESS first
            await supabaseAdmin
              .from('marathon_registrations')
              .update({
                payment_status: 'SUCCESS',
                payment_id: paymentId
              })
              .eq('transaction_id', transactionId);
            console.log('DB updated to SUCCESS for:', transactionId);

            // Send email (webhook might also send, but we check email_sent)
            if (process.env.RESEND_API_KEY && !existing.is_donation && !existing.email_sent) {
              sendConfirmationEmail(existing, transactionId, paymentId)
                .then(async () => {
                  console.log('Email sent via status API for:', transactionId);
                  await supabaseAdmin
                    .from('marathon_registrations')
                    .update({ email_sent: true })
                    .eq('transaction_id', transactionId);
                })
                .catch(err => console.error('Email error:', err.message));
              emailSent = true;
            }
          } else if (existing && existing.payment_status === 'SUCCESS') {
            // Already SUCCESS - check if email was sent
            if (existing.email_sent === true) {
              console.log('Already processed and email sent (likely by webhook):', transactionId);
              emailSent = true; // Email was already sent
            } else {
              console.log('Already SUCCESS but email not sent, attempting:', transactionId);
              // Try to send email only if not already sent
              if (process.env.RESEND_API_KEY && !existing.is_donation) {
                sendConfirmationEmail(existing, transactionId, paymentId)
                  .then(async () => {
                    console.log('Email sent for existing registration:', transactionId);
                    await supabaseAdmin
                      .from('marathon_registrations')
                      .update({ email_sent: true })
                      .eq('transaction_id', transactionId);
                  })
                  .catch(err => console.error('Email error:', err.message));
                emailSent = true;
              }
            }
          }
        } catch (dbError) {
          console.error('DB error (non-blocking):', dbError.message);
        }
      }

      return NextResponse.json({
        success: true,
        status: 'SUCCESS',
        message: 'Payment completed successfully',
        transactionId: data.orderId || transactionId,
        paymentId: paymentId,
        amount: data.amount ? data.amount / 100 : null,
        rawState: data.state,
        emailSent,
      });
    } else if (data.state === 'PENDING' || data.state === 'CREATED') {
      return NextResponse.json({
        success: true,
        status: 'PENDING',
        message: 'Payment is pending',
        transactionId: transactionId,
      });
    } else if (data.state === 'FAILED') {
      return NextResponse.json({
        success: false,
        status: 'FAILED',
        message: data.errorMessage || 'Payment failed',
        code: data.errorCode,
      });
    } else {
      return NextResponse.json({
        success: false,
        status: data.state || 'UNKNOWN',
        message: data.message || 'Unknown payment status',
        details: data,
      });
    }

  } catch (error) {
    console.error('Error checking PhonePe status:', error);
    return NextResponse.json(
      { error: 'Failed to check payment status: ' + error.message },
      { status: 500 }
    );
  }
}

// Send confirmation emails
async function sendConfirmationEmail(registration, transactionId, paymentId) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const adminEmail = process.env.ADMIN_EMAIL || 'krishnaxcoder@gmail.com';

  const { name, email, phone, emergency_phone, date_of_birth, gender, tshirt_size, address, race_category, race_name, race_type, is_run_for_cause, total_amount } = registration;

  const raceCategoryDisplay = is_run_for_cause ? `${race_category} (Run for Cause)` : race_category;
  const raceTypeDisplay = race_type || (is_run_for_cause ? 'No Competition' : 'Competition');
  const age = calculateAge(date_of_birth);
  const dobDisplay = date_of_birth ? new Date(date_of_birth).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : 'N/A';
  const ageDisplay = age ? `${age} years` : 'N/A';

  // Send participant email first (most important for user)
  await resend.emails.send({
    from: 'Janya Foundation <noreply@janyafoundation.in>',
    to: email,
    subject: 'Registration Confirmed - Janya Foundation Marathon',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(to right, #ec4899, #f472b6); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Registration Confirmed!</h1>
          <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Thank you for registering for Janya Foundation Marathon</p>
        </div>
        <div style="padding: 30px; background: #ffffff;">
          <p style="color: #1f2937; font-size: 16px; line-height: 1.6;">Dear <strong>${name}</strong>,</p>
          <p style="color: #4b5563; font-size: 14px; line-height: 1.6;">We are thrilled to confirm your registration for the <strong>Janya Foundation Marathon</strong>! Your participation helps us support women and children in need.</p>
          <div style="background: #fdf2f8; border-radius: 10px; padding: 20px; margin: 20px 0;">
            <h2 style="color: #ec4899; margin: 0 0 15px 0; font-size: 18px;">Your Details</h2>
            <table style="width: 100%;">
              <tr><td style="padding: 8px 0; color: #6b7280;">Name:</td><td style="padding: 8px 0; color: #1f2937; font-weight: bold; text-align: right;">${name}</td></tr>
              <tr><td style="padding: 8px 0; color: #6b7280;">Email:</td><td style="padding: 8px 0; color: #1f2937; font-weight: bold; text-align: right;">${email}</td></tr>
              <tr><td style="padding: 8px 0; color: #6b7280;">Phone:</td><td style="padding: 8px 0; color: #1f2937; font-weight: bold; text-align: right;">${phone}</td></tr>
              <tr><td style="padding: 8px 0; color: #6b7280;">Emergency Contact:</td><td style="padding: 8px 0; color: #1f2937; font-weight: bold; text-align: right;">${emergency_phone || 'N/A'}</td></tr>
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
              ${is_run_for_cause ? '<tr><td colspan="2" style="padding: 4px 0; color: #6b7280; font-size: 12px; text-align: right;">* No prize, No chip | T-shirt, Medal, E-certificate & Refreshment</td></tr>' : ''}
              <tr><td style="padding: 8px 0; color: #6b7280;">T-Shirt Size:</td><td style="padding: 8px 0; color: #1f2937; font-weight: bold; text-align: right;">${tshirt_size || 'N/A'}</td></tr>
              <tr><td style="padding: 8px 0; color: #6b7280;">Amount Paid:</td><td style="padding: 8px 0; color: #059669; font-weight: bold; text-align: right;">₹${total_amount}</td></tr>
              <tr><td style="padding: 8px 0; color: #6b7280;">Payment ID:</td><td style="padding: 8px 0; color: #1f2937; text-align: right; font-size: 11px;">${paymentId}</td></tr>
              <tr><td style="padding: 8px 0; color: #6b7280;">Order ID:</td><td style="padding: 8px 0; color: #1f2937; text-align: right; font-size: 11px;">${transactionId}</td></tr>
            </table>
          </div>
          <div style="background: #f3f4f6; border-radius: 10px; padding: 20px; margin: 20px 0;">
            <h3 style="color: #1f2937; margin: 0 0 10px 0; font-size: 16px;">What's Next?</h3>
            <ul style="color: #4b5563; font-size: 14px; line-height: 1.8; padding-left: 20px; margin: 0;">
              <li>Save this email for your records</li>
              <li><strong>BIB Collection (3KM, 5KM, 10KM & 21.1KM):</strong> March 6-7, 2026 (5 PM - 8 PM) - Decathlon, Belapur</li>
              <li><strong>Marathon Day:</strong> March 8, 2026 (5:00 AM) - BD Somani International School, Sector 27</li>
              <li>Reach the venue at least 30 minutes before your race starts</li>
              <li>Bring a valid ID proof on the event day</li>
            </ul>
          </div>
          <p style="color: #4b5563; font-size: 14px; line-height: 1.6;">If you have any questions, feel free to contact us at <a href="tel:+919321496142" style="color: #ec4899;">+91 93214 96142</a></p>
          <p style="color: #1f2937; font-size: 14px; margin-top: 20px;">See you at the marathon!<br/><strong>Team Janya Foundation</strong></p>
        </div>
        <div style="background: #1f2937; padding: 20px; text-align: center;">
          <p style="color: #9ca3af; margin: 0; font-size: 12px;">Janya Foundation | Empowering Women & Children</p>
          <p style="color: #6b7280; margin: 5px 0 0 0; font-size: 11px;">This is an automated email. Please do not reply directly.</p>
        </div>
      </div>
    `,
  });

  // Add 3 second delay before sending admin email to avoid rate limiting (429 errors)
  await new Promise(resolve => setTimeout(resolve, 3000));

  // Admin email
  await resend.emails.send({
    from: 'Janya Foundation <noreply@janyafoundation.in>',
    to: adminEmail,
    subject: `New Marathon Registration - ${name} (${raceCategoryDisplay})`,
    html: `
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
            <tr><td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #6b7280;">Emergency Contact:</td><td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${emergency_phone || 'N/A'}</td></tr>
            <tr><td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #6b7280;">Date of Birth:</td><td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${dobDisplay}${age ? ` (${age} years)` : ''}</td></tr>
            <tr><td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #6b7280;">Gender:</td><td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${gender}</td></tr>
            <tr><td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #6b7280;">T-Shirt Size:</td><td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${tshirt_size || 'N/A'}</td></tr>
            <tr><td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #6b7280;">Address:</td><td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${address || 'Not provided'}</td></tr>
          </table>
          <h2 style="color: #1f2937; border-bottom: 2px solid #ec4899; padding-bottom: 10px; margin-top: 20px;">Registration Details</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #6b7280;">Race Category:</td><td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #1f2937; font-weight: bold;">${raceCategoryDisplay}</td></tr>
            <tr><td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #6b7280;">Race Type:</td><td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #1f2937; font-weight: bold;">${raceTypeDisplay}</td></tr>
            <tr><td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #6b7280;">Amount Paid:</td><td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #059669; font-weight: bold;">₹${total_amount}</td></tr>
            <tr><td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #6b7280;">Payment ID:</td><td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #1f2937; font-size: 12px;">${paymentId}</td></tr>
            <tr><td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #6b7280;">Order ID:</td><td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #1f2937; font-size: 12px;">${transactionId}</td></tr>
          </table>
        </div>
        <div style="background: #1f2937; padding: 15px; text-align: center;"><p style="color: #9ca3af; margin: 0; font-size: 12px;">Janya Foundation Marathon</p></div>
      </div>
    `,
  });
}
