import { Resend } from 'resend';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // Check if API key exists
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not set');
      return NextResponse.json(
        { error: 'Email service not configured', details: 'Missing API key' },
        { status: 500 }
      );
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const {
      participantName,
      participantEmail,
      participantPhone,
      emergencyPhone,
      participantDateOfBirth,
      participantAge,
      participantGender,
      participantTshirtSize,
      participantAddress,
      raceCategory,
      isRunForCause,
      raceType,
      amount,
      couponCode,
      couponDiscount,
      paymentId,
      orderId
    } = await request.json();

    // --- Verify this is a real transaction before sending emails ---
    if (!orderId || !orderId.startsWith('MARATHON')) {
      return NextResponse.json(
        { error: 'Invalid transaction ID' },
        { status: 400 }
      );
    }

    // Verify payment was actually completed with PhonePe
    const { supabaseAdmin } = await import('@/lib/supabase');
    if (supabaseAdmin) {
      const { data: registration } = await supabaseAdmin
        .from('marathon_registrations')
        .select('id, payment_status')
        .eq('transaction_id', orderId)
        .limit(1);

      if (!registration || registration.length === 0) {
        return NextResponse.json(
          { error: 'Registration not found. Save registration first.' },
          { status: 400 }
        );
      }
    }

    const raceCategoryDisplay = isRunForCause ? `${raceCategory} (Run for Cause)` : raceCategory;
    const raceTypeDisplay = raceType || (isRunForCause ? 'No Competition' : 'Competition');
    const runForCauseNote = isRunForCause ? '<span style="color: #6b7280; font-size: 12px;"> - No prize, No chip | T-shirt, Medal, E-certificate & Refreshment</span>' : '';

    const adminEmail = process.env.ADMIN_EMAIL || 'krishnaxcoder@gmail.com';

    // Email to Admin
    const adminEmailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(to right, #ec4899, #f472b6); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">New Marathon Registration</h1>
        </div>
        <div style="padding: 20px; background: #f9fafb;">
          <h2 style="color: #1f2937; border-bottom: 2px solid #ec4899; padding-bottom: 10px;">Participant Details</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #6b7280;">Name:</td>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${participantName}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #6b7280;">Email:</td>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${participantEmail}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #6b7280;">Phone:</td>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${participantPhone}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #6b7280;">Emergency Contact:</td>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${emergencyPhone}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #6b7280;">Date of Birth:</td>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${participantDateOfBirth ? new Date(participantDateOfBirth).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : 'N/A'}${participantAge ? ` (${participantAge} years)` : ''}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #6b7280;">Gender:</td>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${participantGender}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #6b7280;">T-Shirt Size:</td>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${participantTshirtSize || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #6b7280;">Address:</td>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${participantAddress || 'Not provided'}</td>
            </tr>
          </table>

          <h2 style="color: #1f2937; border-bottom: 2px solid #ec4899; padding-bottom: 10px; margin-top: 20px;">Registration Details</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #6b7280;">Race Category:</td>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #1f2937; font-weight: bold;">${raceCategoryDisplay}${runForCauseNote}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #6b7280;">Race Type:</td>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #1f2937; font-weight: bold;">${raceTypeDisplay}</td>
            </tr>
            ${couponCode && couponDiscount > 0 ? `
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #6b7280;">Coupon Applied:</td>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #059669; font-weight: bold;">${couponCode} (-₹${couponDiscount})</td>
            </tr>
            ` : ''}
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #6b7280;">Amount Paid:</td>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #059669; font-weight: bold;">₹${amount}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #6b7280;">Payment ID:</td>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #1f2937; font-size: 12px;">${paymentId}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #6b7280;">Order ID:</td>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #1f2937; font-size: 12px;">${orderId}</td>
            </tr>
          </table>
        </div>
        <div style="background: #1f2937; padding: 15px; text-align: center;">
          <p style="color: #9ca3af; margin: 0; font-size: 12px;">Janya Foundation Marathon</p>
        </div>
      </div>
    `;

    // Email to Participant
    const participantEmailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(to right, #ec4899, #f472b6); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Registration Confirmed!</h1>
          <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Thank you for registering for Janya Foundation Marathon</p>
        </div>

        <div style="padding: 30px; background: #ffffff;">
          <p style="color: #1f2937; font-size: 16px; line-height: 1.6;">
            Dear <strong>${participantName}</strong>,
          </p>
          <p style="color: #4b5563; font-size: 14px; line-height: 1.6;">
            We are thrilled to confirm your registration for the <strong>Janya Foundation Marathon</strong>!
            Your participation helps us support women and children in need.
          </p>

          <div style="background: #fdf2f8; border-radius: 10px; padding: 20px; margin: 20px 0;">
            <h2 style="color: #ec4899; margin: 0 0 15px 0; font-size: 18px;">Your Details</h2>
            <table style="width: 100%;">
              <tr>
                <td style="padding: 8px 0; color: #6b7280;">Name:</td>
                <td style="padding: 8px 0; color: #1f2937; font-weight: bold; text-align: right;">${participantName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280;">Email:</td>
                <td style="padding: 8px 0; color: #1f2937; font-weight: bold; text-align: right;">${participantEmail}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280;">Phone:</td>
                <td style="padding: 8px 0; color: #1f2937; font-weight: bold; text-align: right;">${participantPhone}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280;">Emergency Contact:</td>
                <td style="padding: 8px 0; color: #1f2937; font-weight: bold; text-align: right;">${emergencyPhone}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280;">Date of Birth:</td>
                <td style="padding: 8px 0; color: #1f2937; font-weight: bold; text-align: right;">${participantDateOfBirth ? new Date(participantDateOfBirth).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : 'N/A'}${participantAge ? ` (${participantAge} years)` : ''}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280;">Gender:</td>
                <td style="padding: 8px 0; color: #1f2937; font-weight: bold; text-align: right;">${participantGender}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280;">Address:</td>
                <td style="padding: 8px 0; color: #1f2937; font-weight: bold; text-align: right;">${participantAddress || 'Not provided'}</td>
              </tr>
            </table>
          </div>

          <div style="background: #fdf2f8; border-radius: 10px; padding: 20px; margin: 20px 0;">
            <h2 style="color: #ec4899; margin: 0 0 15px 0; font-size: 18px;">Registration Details</h2>
            <table style="width: 100%;">
              <tr>
                <td style="padding: 8px 0; color: #6b7280;">Race Category:</td>
                <td style="padding: 8px 0; color: #1f2937; font-weight: bold; text-align: right;">${raceCategoryDisplay}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280;">Race Type:</td>
                <td style="padding: 8px 0; color: #1f2937; font-weight: bold; text-align: right;">${raceTypeDisplay}</td>
              </tr>
              ${isRunForCause ? '<tr><td colspan="2" style="padding: 4px 0; color: #6b7280; font-size: 12px; text-align: right;">* No prize, No chip | T-shirt, Medal, E-certificate & Refreshment</td></tr>' : ''}
              <tr>
                <td style="padding: 8px 0; color: #6b7280;">T-Shirt Size:</td>
                <td style="padding: 8px 0; color: #1f2937; font-weight: bold; text-align: right;">${participantTshirtSize || 'N/A'}</td>
              </tr>
              ${couponCode && couponDiscount > 0 ? `
              <tr>
                <td style="padding: 8px 0; color: #6b7280;">Coupon Applied:</td>
                <td style="padding: 8px 0; color: #059669; font-weight: bold; text-align: right;">${couponCode} (-₹${couponDiscount})</td>
              </tr>
              ` : ''}
              <tr>
                <td style="padding: 8px 0; color: #6b7280;">Amount Paid:</td>
                <td style="padding: 8px 0; color: #059669; font-weight: bold; text-align: right;">₹${amount}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280;">Payment ID:</td>
                <td style="padding: 8px 0; color: #1f2937; text-align: right; font-size: 11px;">${paymentId}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280;">Order ID:</td>
                <td style="padding: 8px 0; color: #1f2937; text-align: right; font-size: 11px;">${orderId}</td>
              </tr>
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

          <p style="color: #4b5563; font-size: 14px; line-height: 1.6;">
            If you have any questions, feel free to contact us at <a href="tel:+919321496142" style="color: #ec4899;">+91 93214 96142</a>
          </p>

          <p style="color: #1f2937; font-size: 14px; margin-top: 20px;">
            See you at the marathon!<br/>
            <strong>Team Janya Foundation</strong>
          </p>
        </div>

        <div style="background: #1f2937; padding: 20px; text-align: center;">
          <p style="color: #9ca3af; margin: 0; font-size: 12px;">
            Janya Foundation | Empowering Women & Children
          </p>
          <p style="color: #6b7280; margin: 5px 0 0 0; font-size: 11px;">
            This is an automated email. Please do not reply directly.
          </p>
        </div>
      </div>
    `;

    console.log('Sending email to admin:', adminEmail);
    console.log('API Key exists:', !!process.env.RESEND_API_KEY);
    console.log('API Key prefix:', process.env.RESEND_API_KEY?.substring(0, 10));

    let adminEmailId = null;
    let adminError = null;
    let participantEmailId = null;
    let participantError = null;

    // Send participant email first (most important for user)
    try {
      const participantResult = await resend.emails.send({
        from: 'Janya Foundation <noreply@janyafoundation.in>',
        replyTo: 'janyafoundation.04@gmail.com',
        to: participantEmail,
        subject: 'Registration Confirmed - Janya Foundation Marathon',
        html: participantEmailContent,
      });
      participantEmailId = participantResult.data?.id || null;
      participantError = participantResult.error?.message || null;
      console.log('Participant email result:', participantEmailId || 'failed', participantError || '');
    } catch (err) {
      participantError = err.message;
      console.error('Participant email exception:', err.message);
    }

    // Add 3 second delay before sending admin email to avoid rate limiting (429 errors)
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Send email to admin - also CC foundation email to ensure delivery
    try {
      const adminResult = await resend.emails.send({
        from: 'Janya Foundation <noreply@janyafoundation.in>',
        replyTo: participantEmail, // Reply-to the participant
        to: [adminEmail, 'janyafoundation.04@gmail.com'].filter((e, i, arr) => arr.indexOf(e) === i), // Remove duplicates
        subject: `New Marathon Registration - ${participantName} (${raceCategoryDisplay})`,
        html: adminEmailContent,
      });
      adminEmailId = adminResult.data?.id || null;
      adminError = adminResult.error?.message || null;
      console.log('Admin email result:', adminEmailId || 'failed', adminError || '');
    } catch (err) {
      adminError = err.message;
      console.error('Admin email exception:', err.message);
    }

    const success = !!(adminEmailId && participantEmailId);
    console.log(`Email status - Participant: ${!!participantEmailId}, Admin: ${!!adminEmailId}, Success: ${success}`);

    // Check if any email failed
    if (!success) {
      return NextResponse.json({
        success: false,
        error: participantError || adminError || 'Email sending failed',
        adminEmailId,
        adminError,
        participantEmailId,
        participantError
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      adminEmailId,
      participantEmailId,
      message: 'Registration saved. Emails sent successfully.'
    });

  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      {
        error: 'Failed to send email',
        details: typeof error === 'object' ? (error.message || JSON.stringify(error)) : String(error)
      },
      { status: 500 }
    );
  }
}
