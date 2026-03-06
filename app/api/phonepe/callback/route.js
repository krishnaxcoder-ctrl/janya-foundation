import { NextResponse } from 'next/server';
import { waitUntil } from '@vercel/functions';
import { supabaseAdmin } from '@/lib/supabase';
import { Resend } from 'resend';
import crypto from 'crypto';

// Webhook credentials - MUST match PhonePe Dashboard configuration
const WEBHOOK_USERNAME = process.env.PHONEPE_WEBHOOK_USERNAME || 'janyafoundation';
const WEBHOOK_PASSWORD = process.env.PHONEPE_WEBHOOK_PASSWORD || 'sdAS212dsdas2';

// Validate PhonePe webhook authentication
// PhonePe sends SHA256(username:password) in Authorization header
function validateAuth(request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) {
    console.log('[Webhook] No authorization header received');
    return false;
  }

  const expectedHash = crypto
    .createHash('sha256')
    .update(`${WEBHOOK_USERNAME}:${WEBHOOK_PASSWORD}`)
    .digest('hex');

  // PhonePe may send with or without prefix, check both
  const receivedHash = authHeader.replace(/^(SHA256\s+|Bearer\s+)/i, '').trim();

  const isValid = receivedHash.toLowerCase() === expectedHash.toLowerCase();

  console.log('[Webhook] Auth validation:', {
    received: authHeader.substring(0, 30) + '...',
    expectedStart: expectedHash.substring(0, 20) + '...',
    isValid
  });

  return isValid;
}

// PhonePe webhook endpoint
// CRITICAL: Must respond with 2xx within 3-5 seconds
export async function POST(request) {
  const startTime = Date.now();

  try {
    // Parse body first (needed for logging)
    const body = await request.json();

    // Log webhook receipt immediately
    console.log('[Webhook] ========== PHONEPE CALLBACK RECEIVED ==========');
    console.log('[Webhook] Timestamp:', new Date().toISOString());
    console.log('[Webhook] Body:', JSON.stringify(body, null, 2));

    // Log headers for debugging
    const headers = {};
    request.headers.forEach((value, key) => {
      headers[key] = key === 'authorization' ? value.substring(0, 30) + '...' : value;
    });
    console.log('[Webhook] Headers:', JSON.stringify(headers, null, 2));

    // Validate authentication
    const isAuthValid = validateAuth(request);
    if (!isAuthValid) {
      console.log('[Webhook] AUTH FAILED - but processing anyway for debugging');
      // Note: In production, you may want to return 401 here
      // return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // Extract event info
    const { event, type, payload } = body;
    const eventName = event || type;

    console.log('[Webhook] Event:', eventName);
    console.log('[Webhook] Payload:', JSON.stringify(payload, null, 2));

    // Extract payment details from payload
    const {
      merchantOrderId,
      orderId,
      state,
      amount,
      paymentDetails
    } = payload || {};

    const paymentId = paymentDetails?.[0]?.transactionId || orderId;
    const transactionId = merchantOrderId;

    console.log('[Webhook] Extracted:', {
      transactionId,
      orderId,
      paymentId,
      state,
      amount: amount ? amount / 100 : null,
      event: eventName
    });

    // Normalize state - PhonePe can send different values
    const normalizedState = state?.toUpperCase();

    // IMPORTANT: Respond immediately with 200 OK
    // PhonePe requires response within 3-5 seconds
    // Process the actual work asynchronously AFTER responding

    // Check for SUCCESS states (COMPLETED, SUCCESS, PAID)
    if (normalizedState === 'COMPLETED' || normalizedState === 'SUCCESS' || normalizedState === 'PAID') {
      console.log('[Webhook] Payment SUCCESS detected for:', transactionId, '| State:', normalizedState);

      // Use waitUntil() to guarantee background work completes after response
      // Vercel keeps the function alive until this promise resolves
      waitUntil(
        processPaymentSuccessAsync(transactionId, paymentId, amount).catch(err => {
          console.error('[Webhook] Async processing error:', err.message);
        })
      );

      console.log('[Webhook] Responded in', Date.now() - startTime, 'ms');
      return NextResponse.json({
        success: true,
        message: 'Webhook received - processing success'
      });
    }

    // Check for FAILED states
    if (normalizedState === 'FAILED' || normalizedState === 'FAILURE' || normalizedState === 'CANCELLED') {
      console.log('[Webhook] Payment FAILED detected for:', transactionId, '| State:', normalizedState);

      // Use waitUntil() to guarantee background work completes after response
      waitUntil(
        processPaymentFailureAsync(transactionId).catch(err => {
          console.error('[Webhook] Async failure processing error:', err.message);
        })
      );

      console.log('[Webhook] Responded in', Date.now() - startTime, 'ms');
      return NextResponse.json({
        success: true,
        message: 'Webhook received - processing failure'
      });
    }

    // PENDING or unknown state - still acknowledge but log for debugging
    console.log('[Webhook] State not final:', normalizedState, '| Event:', eventName, '| Transaction:', transactionId);
    console.log('[Webhook] Responded in', Date.now() - startTime, 'ms');

    return NextResponse.json({
      success: true,
      message: 'Webhook acknowledged - state pending or unknown'
    });

  } catch (error) {
    console.error('[Webhook] ERROR:', error.message);
    console.error('[Webhook] Stack:', error.stack);

    // Still return 200 to prevent PhonePe retries on parse errors
    // Log the error for investigation
    return NextResponse.json({
      success: true,
      message: 'Webhook received with error',
      error: error.message
    });
  }
}

// Async function to process successful payment (runs after response)
// Includes retry logic for network failures
async function processPaymentSuccessAsync(transactionId, paymentId, amountPaise, retryCount = 0) {
  const MAX_RETRIES = 3;
  const RETRY_DELAY = 7000; // 7 seconds

  console.log('[Webhook Async] Processing success for:', transactionId, retryCount > 0 ? `(retry ${retryCount})` : '');

  if (!supabaseAdmin) {
    console.error('[Webhook Async] Supabase not configured');
    return;
  }

  try {
    // Find the registration
    const { data: registration, error: fetchError } = await supabaseAdmin
      .from('marathon_registrations')
      .select('*')
      .eq('transaction_id', transactionId)
      .single();

    if (fetchError || !registration) {
      // Retry on network errors
      if (retryCount < MAX_RETRIES && (fetchError?.message?.includes('fetch') || fetchError?.code === 'PGRST116')) {
        console.log('[Webhook Async] Fetch failed, retrying in', RETRY_DELAY, 'ms...');
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        return processPaymentSuccessAsync(transactionId, paymentId, amountPaise, retryCount + 1);
      }
      console.error('[Webhook Async] Registration not found:', transactionId, fetchError?.message);
      return;
    }

    // Already processed?
    if (registration.payment_status === 'SUCCESS') {
      console.log('[Webhook Async] Already SUCCESS:', transactionId);
      return;
    }

    console.log('[Webhook Async] Found registration:', {
      id: registration.id,
      name: registration.name,
      email: registration.email,
      status: registration.payment_status
    });

    // Update to SUCCESS first
    const { error: updateError } = await supabaseAdmin
      .from('marathon_registrations')
      .update({
        payment_status: 'SUCCESS',
        payment_id: paymentId,
        webhook_received_at: new Date().toISOString()
      })
      .eq('transaction_id', transactionId);

    if (updateError) {
      // Retry on network errors
      if (retryCount < MAX_RETRIES && updateError.message?.includes('fetch')) {
        console.log('[Webhook Async] Update failed, retrying in', RETRY_DELAY, 'ms...');
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        return processPaymentSuccessAsync(transactionId, paymentId, amountPaise, retryCount + 1);
      }
      console.error('[Webhook Async] Update failed:', updateError.message);
      return;
    }

    console.log('[Webhook Async] Updated to SUCCESS:', transactionId);

    // Send emails (skip for donations)
    if (!registration.is_donation && process.env.RESEND_API_KEY) {
      try {
        const emailSuccess = await sendConfirmationEmails(registration, transactionId, paymentId);

        // Mark email as sent only if both emails succeeded
        await supabaseAdmin
          .from('marathon_registrations')
          .update({ email_sent: emailSuccess === true })
          .eq('transaction_id', transactionId);

        console.log('[Webhook Async] Emails sent for:', transactionId, '| Success:', emailSuccess);
      } catch (emailError) {
        console.error('[Webhook Async] Email error:', emailError.message);
        // Mark as not sent on error
        await supabaseAdmin
          .from('marathon_registrations')
          .update({ email_sent: false })
          .eq('transaction_id', transactionId);
      }
    }

    console.log('[Webhook Async] Processing complete for:', transactionId);

  } catch (error) {
    // Retry on network errors
    if (retryCount < MAX_RETRIES && (error.message?.includes('fetch') || error.message?.includes('network'))) {
      console.log('[Webhook Async] Error, retrying in', RETRY_DELAY, 'ms...', error.message);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return processPaymentSuccessAsync(transactionId, paymentId, amountPaise, retryCount + 1);
    }
    console.error('[Webhook Async] Error:', error.message);
  }
}

// Async function to process failed payment
// Includes retry logic for network failures
async function processPaymentFailureAsync(transactionId, retryCount = 0) {
  const MAX_RETRIES = 3;
  const RETRY_DELAY = 7000; // 7 seconds

  console.log('[Webhook Async] Processing failure for:', transactionId, retryCount > 0 ? `(retry ${retryCount})` : '');

  if (!supabaseAdmin || !transactionId) return;

  try {
    const { error } = await supabaseAdmin
      .from('marathon_registrations')
      .update({
        payment_status: 'FAILED',
        webhook_received_at: new Date().toISOString()
      })
      .eq('transaction_id', transactionId)
      .eq('payment_status', 'PENDING');

    if (error) {
      // Retry on network errors
      if (retryCount < MAX_RETRIES && error.message?.includes('fetch')) {
        console.log('[Webhook Async] Failed update error, retrying in', RETRY_DELAY, 'ms...');
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        return processPaymentFailureAsync(transactionId, retryCount + 1);
      }
      console.error('[Webhook Async] Failed to update to FAILED:', error.message);
    } else {
      console.log('[Webhook Async] Marked as FAILED:', transactionId);
    }
  } catch (error) {
    // Retry on network errors
    if (retryCount < MAX_RETRIES && (error.message?.includes('fetch') || error.message?.includes('network'))) {
      console.log('[Webhook Async] Failure processing error, retrying in', RETRY_DELAY, 'ms...', error.message);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return processPaymentFailureAsync(transactionId, retryCount + 1);
    }
    console.error('[Webhook Async] Failure processing error:', error.message);
  }
}

// Send confirmation emails to admin and participant
async function sendConfirmationEmails(registration, transactionId, paymentId) {
  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY not configured');
    return;
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const adminEmail = process.env.ADMIN_EMAIL || 'krishnaxcoder@gmail.com';

    const {
      name, email, phone, emergency_phone, date_of_birth, age_legacy, gender,
      tshirt_size, address, race_category, is_run_for_cause, race_type,
      total_amount
    } = registration;

    const raceCategoryDisplay = is_run_for_cause ? `${race_category} (Run for Cause)` : race_category;
    const raceTypeDisplay = race_type || (is_run_for_cause ? 'No Competition' : 'Competition');
    const runForCauseNote = is_run_for_cause ? '<span style="color: #6b7280; font-size: 12px;"> - No prize, No chip | T-shirt, Medal, E-certificate & Refreshment</span>' : '';
    const dobDisplay = date_of_birth ? new Date(date_of_birth).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : 'N/A';
    const ageDisplay = age_legacy ? `${age_legacy} years` : 'N/A';

    // Admin email content
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
            <tr><td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #6b7280;">Emergency Contact:</td><td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${emergency_phone}</td></tr>
            <tr><td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #6b7280;">Date of Birth:</td><td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${dobDisplay}${age_legacy ? ` (${age_legacy} years)` : ''}</td></tr>
            <tr><td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #6b7280;">Gender:</td><td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${gender}</td></tr>
            <tr><td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #6b7280;">T-Shirt Size:</td><td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${tshirt_size || 'N/A'}</td></tr>
            <tr><td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #6b7280;">Address:</td><td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${address || 'Not provided'}</td></tr>
          </table>
          <h2 style="color: #1f2937; border-bottom: 2px solid #ec4899; padding-bottom: 10px; margin-top: 20px;">Registration Details</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #6b7280;">Race Category:</td><td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #1f2937; font-weight: bold;">${raceCategoryDisplay}${runForCauseNote}</td></tr>
            <tr><td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #6b7280;">Race Type:</td><td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #1f2937; font-weight: bold;">${raceTypeDisplay}</td></tr>
            <tr><td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #6b7280;">Amount Paid:</td><td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #059669; font-weight: bold;">₹${total_amount}</td></tr>
            <tr><td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #6b7280;">Payment ID:</td><td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #1f2937; font-size: 12px;">${paymentId}</td></tr>
            <tr><td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #6b7280;">Order ID:</td><td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #1f2937; font-size: 12px;">${transactionId}</td></tr>
          </table>
        </div>
        <div style="background: #1f2937; padding: 15px; text-align: center;"><p style="color: #9ca3af; margin: 0; font-size: 12px;">Janya Foundation Marathon</p></div>
      </div>
    `;

    // Participant email content
    const participantEmailContent = `
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
              <tr><td style="padding: 8px 0; color: #6b7280;">Emergency Contact:</td><td style="padding: 8px 0; color: #1f2937; font-weight: bold; text-align: right;">${emergency_phone}</td></tr>
              <tr><td style="padding: 8px 0; color: #6b7280;">Date of Birth:</td><td style="padding: 8px 0; color: #1f2937; font-weight: bold; text-align: right;">${dobDisplay}${age_legacy ? ` (${age_legacy} years)` : ''}</td></tr>
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
              <li><strong>BIB Collection:</strong> 6 Mar (4-9 PM) & 7 Mar (1-9 PM) - Decathlon, Belapur</li>
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
    `;

    // Send participant email first (most important for user)
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
      console.log('Participant email sent via webhook:', participantResult.data?.id || 'failed', participantResult.error?.message || '');

      if (participantResult.error) {
        console.error('Webhook participant email error:', JSON.stringify(participantResult.error));
      }
    } catch (participantErr) {
      console.error('Webhook participant email exception:', participantErr.message);
    }

    // Add 3 second delay before sending admin email to avoid rate limiting (429 errors)
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Send admin email - also CC foundation email to ensure delivery
    try {
      const adminResult = await resend.emails.send({
        from: 'Janya Foundation <noreply@janyafoundation.in>',
        replyTo: email, // Reply-to the participant
        to: [adminEmail, 'janyafoundation.04@gmail.com'].filter((e, i, arr) => arr.indexOf(e) === i), // Remove duplicates
        subject: `New Marathon Registration - ${name} (${raceCategoryDisplay})`,
        html: adminEmailContent,
      });
      adminEmailSent = !!adminResult.data?.id;
      console.log('Admin email sent via webhook:', adminResult.data?.id || 'failed', adminResult.error?.message || '');

      if (adminResult.error) {
        console.error('Webhook admin email error:', JSON.stringify(adminResult.error));
      }
    } catch (adminErr) {
      console.error('Webhook admin email exception:', adminErr.message);
    }

    console.log(`Webhook email status - Participant: ${participantEmailSent}, Admin: ${adminEmailSent}`);

    // Return true only if both emails sent successfully
    return participantEmailSent && adminEmailSent;

  } catch (error) {
    console.error('Error sending confirmation emails:', error);
  }
}

// PhonePe may also send GET requests for verification
export async function GET(request) {
  return NextResponse.json({
    success: true,
    message: 'PhonePe webhook endpoint is active',
    endpoint: '/api/phonepe/callback',
    supportedEvents: [
      'checkout.order.completed',
      'checkout.order.failed',
      'pg.order.completed',
      'pg.order.failed'
    ],
    timestamp: new Date().toISOString()
  });
}
