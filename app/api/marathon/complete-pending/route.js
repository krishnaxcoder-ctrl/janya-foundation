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

// This endpoint completes PENDING registrations by verifying payment with PhonePe
// Used when success page doesn't have sessionStorage data
export async function POST(request) {
  try {
    const { transactionId } = await request.json();

    if (!transactionId) {
      return NextResponse.json(
        { success: false, error: 'Transaction ID is required' },
        { status: 400 }
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        { success: false, error: 'Database not configured' },
        { status: 500 }
      );
    }

    // Find the registration
    const { data: registration, error: fetchError } = await supabaseAdmin
      .from('marathon_registrations')
      .select('*')
      .eq('transaction_id', transactionId)
      .single();

    if (fetchError || !registration) {
      return NextResponse.json(
        { success: false, error: 'Registration not found' },
        { status: 404 }
      );
    }

    // If already SUCCESS and email already sent, do NOT send emails again
    if (registration.payment_status === 'SUCCESS') {
      if (registration.email_sent === true) {
        console.log('Registration already completed and email sent, skipping:', transactionId);
        return NextResponse.json({
          success: true,
          message: 'Registration already completed',
          alreadyProcessed: true,
          emailSent: true,
          registration: {
            name: registration.name,
            email: registration.email,
            race_category: registration.race_category,
            total_amount: registration.total_amount
          }
        });
      }
      // Email not sent yet, try to send and update
      console.log('Registration SUCCESS but email not sent, attempting to send:', transactionId);
      let emailSent = false;
      if (process.env.RESEND_API_KEY && !registration.is_donation) {
        try {
          emailSent = await sendConfirmationEmails(registration, transactionId);
          if (emailSent) {
            await supabaseAdmin
              .from('marathon_registrations')
              .update({ email_sent: true })
              .eq('transaction_id', transactionId);
          }
        } catch (emailError) {
          console.error('Email error:', emailError.message);
        }
      }
      return NextResponse.json({
        success: true,
        message: 'Registration already completed, email sent',
        alreadyProcessed: true,
        emailSent,
        registration: {
          name: registration.name,
          email: registration.email,
          race_category: registration.race_category,
          total_amount: registration.total_amount
        }
      });
    }

    // If not PENDING, something is wrong
    if (registration.payment_status !== 'PENDING') {
      return NextResponse.json({
        success: false,
        error: `Unexpected payment status: ${registration.payment_status}`
      }, { status: 400 });
    }

    // Verify payment with PhonePe
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
      console.log('PhonePe verification response:', JSON.stringify(phonepeData, null, 2));
    } catch (verifyError) {
      console.error('PhonePe verification failed:', verifyError.message);
      return NextResponse.json(
        { success: false, error: 'Payment verification failed: ' + verifyError.message },
        { status: 500 }
      );
    }

    // Check if payment is successful
    if (phonepeData.state !== 'COMPLETED' && phonepeData.state !== 'SUCCESS') {
      return NextResponse.json({
        success: false,
        error: `Payment not completed. Status: ${phonepeData.state}`,
        phonepeState: phonepeData.state
      }, { status: 400 });
    }

    // Get payment ID from PhonePe response
    const paymentId = phonepeData.paymentDetails?.[0]?.transactionId || transactionId;

    // Send confirmation emails first
    let emailSent = false;
    if (process.env.RESEND_API_KEY && !registration.is_donation) {
      try {
        emailSent = await sendConfirmationEmails(registration, transactionId, paymentId);
      } catch (emailError) {
        console.error('Email error:', emailError.message);
      }
    }

    // Update registration to SUCCESS with email_sent status
    const { error: updateError } = await supabaseAdmin
      .from('marathon_registrations')
      .update({
        payment_status: 'SUCCESS',
        payment_id: paymentId,
        email_sent: emailSent
      })
      .eq('transaction_id', transactionId);

    if (updateError) {
      console.error('Update error:', updateError);
      return NextResponse.json(
        { success: false, error: 'Failed to update registration' },
        { status: 500 }
      );
    }

    console.log('Registration completed successfully:', transactionId, 'emailSent:', emailSent);

    return NextResponse.json({
      success: true,
      message: 'Registration completed and emails sent',
      emailSent,
      registration: {
        name: registration.name,
        email: registration.email,
        race_category: registration.race_category,
        total_amount: registration.total_amount
      }
    });

  } catch (error) {
    console.error('Complete pending error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

async function sendConfirmationEmails(registration, transactionId, paymentId = null) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const adminEmail = process.env.ADMIN_EMAIL || 'krishnaxcoder@gmail.com';

  const raceCategoryDisplay = registration.is_run_for_cause
    ? `${registration.race_category} (Run for Cause)`
    : registration.race_category;
  const raceTypeDisplay = registration.race_type || (registration.is_run_for_cause ? 'No Competition' : 'Competition');
  const age = calculateAge(registration.date_of_birth);
  const dobDisplay = registration.date_of_birth
    ? new Date(registration.date_of_birth).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' })
    : 'N/A';
  const ageDisplay = age ? `${age} years` : 'N/A';
  const displayPaymentId = paymentId || registration.payment_id || transactionId;

  // Participant email first (most important for user)
  const participantResult = await resend.emails.send({
    from: 'Janya Foundation <noreply@janyafoundation.in>',
    to: registration.email,
    subject: 'Registration Confirmed - Janya Foundation Marathon',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(to right, #ec4899, #f472b6); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Registration Confirmed!</h1>
          <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Thank you for registering for Janya Foundation Marathon</p>
        </div>
        <div style="padding: 30px; background: #ffffff;">
          <p style="color: #1f2937; font-size: 16px;">Dear <strong>${registration.name}</strong>,</p>
          <p style="color: #4b5563; font-size: 14px;">We are thrilled to confirm your registration for the <strong>Janya Foundation Marathon</strong>!</p>
          <div style="background: #fdf2f8; border-radius: 10px; padding: 20px; margin: 20px 0;">
            <h2 style="color: #ec4899; margin: 0 0 15px 0; font-size: 18px;">Your Details</h2>
            <p><strong>Name:</strong> ${registration.name}</p>
            <p><strong>Race Category:</strong> ${raceCategoryDisplay}</p>
            <p><strong>Race Type:</strong> ${raceTypeDisplay}</p>
            ${registration.is_run_for_cause ? '<p style="font-size: 12px; color: #6b7280;">* No prize, No chip | T-shirt, Medal, E-certificate & Refreshment</p>' : ''}
            <p><strong>T-Shirt Size:</strong> ${registration.tshirt_size || 'N/A'}</p>
            <p><strong>Amount Paid:</strong> <span style="color: #059669; font-weight: bold;">₹${registration.total_amount}</span></p>
            <p><strong>Transaction ID:</strong> ${transactionId}</p>
          </div>
          <div style="background: #f3f4f6; border-radius: 10px; padding: 20px; margin: 20px 0;">
            <h3 style="color: #1f2937; margin: 0 0 10px 0;">What's Next?</h3>
            <ul style="color: #4b5563; font-size: 14px; padding-left: 20px;">
              <li><strong>BIB Collection (3KM, 5KM, 10KM & 21.1KM):</strong> March 6-7, 2026 (5 PM - 8 PM) - Decathlon, Belapur</li>
              <li><strong>Marathon Day:</strong> March 8, 2026 (5:00 AM) - BD Somani International School, Sector 27</li>
            </ul>
          </div>
          <p style="color: #1f2937; margin-top: 20px;">See you at the marathon!<br/><strong>Team Janya Foundation</strong></p>
        </div>
        <div style="background: #1f2937; padding: 20px; text-align: center;">
          <p style="color: #9ca3af; margin: 0; font-size: 12px;">Janya Foundation | Empowering Women & Children</p>
        </div>
      </div>
    `,
  });

  // Add 3 second delay before sending admin email to avoid rate limiting (429 errors)
  await new Promise(resolve => setTimeout(resolve, 3000));

  // Admin email
  const adminResult = await resend.emails.send({
    from: 'Janya Foundation <noreply@janyafoundation.in>',
    to: adminEmail,
    subject: `Marathon Registration - ${registration.name} (${raceCategoryDisplay})`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(to right, #ec4899, #f472b6); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">New Marathon Registration</h1>
        </div>
        <div style="padding: 20px; background: #f9fafb;">
          <h2 style="color: #1f2937;">Participant Details</h2>
          <p><strong>Name:</strong> ${registration.name}</p>
          <p><strong>Email:</strong> ${registration.email}</p>
          <p><strong>Phone:</strong> ${registration.phone}</p>
          <p><strong>Emergency Contact:</strong> ${registration.emergency_phone || 'N/A'}</p>
          <p><strong>Date of Birth:</strong> ${dobDisplay}${age ? ` (${age} years)` : ''}</p>
          <p><strong>Gender:</strong> ${registration.gender}</p>
          <p><strong>T-Shirt Size:</strong> ${registration.tshirt_size || 'N/A'}</p>
          <h2 style="color: #1f2937;">Registration Details</h2>
          <p><strong>Race:</strong> ${raceCategoryDisplay}</p>
          <p><strong>Race Type:</strong> ${raceTypeDisplay}</p>
          <p><strong>Amount:</strong> ₹${registration.total_amount}</p>
          <p><strong>Transaction ID:</strong> ${transactionId}</p>
          <p><strong>Payment ID:</strong> ${displayPaymentId}</p>
        </div>
      </div>
    `,
  });

  const emailSent = !!(adminResult.data?.id || participantResult.data?.id);
  console.log('Confirmation emails sent:', emailSent, 'admin:', adminResult.data?.id, 'participant:', participantResult.data?.id);
  return emailSent;
}
