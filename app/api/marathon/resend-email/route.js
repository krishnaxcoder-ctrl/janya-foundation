import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { Resend } from 'resend';

export async function POST(request) {
  try {
    const { transactionId } = await request.json();

    if (!transactionId) {
      return NextResponse.json(
        { success: false, error: 'Transaction ID is required' },
        { status: 400 }
      );
    }

    // Fetch registration from database
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

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'Email service not configured' },
        { status: 500 }
      );
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const adminEmail = process.env.ADMIN_EMAIL || 'krishnaxcoder@gmail.com';

    const {
      name, email, phone, emergency_phone, date_of_birth, age_legacy, gender,
      tshirt_size, address, race_category, is_run_for_cause, race_type,
      total_amount, payment_id, is_donation
    } = registration;

    // Skip donations
    if (is_donation) {
      return NextResponse.json(
        { success: false, error: 'Cannot send email for donation entries' },
        { status: 400 }
      );
    }

    const raceCategoryDisplay = is_run_for_cause ? `${race_category} (Run for Cause)` : race_category;
    const raceTypeDisplay = race_type || (is_run_for_cause ? 'No Competition' : 'Competition');
    const runForCauseNote = is_run_for_cause ? '<span style="color: #6b7280; font-size: 12px;"> - No prize, No chip | T-shirt, Medal, E-certificate & Refreshment</span>' : '';
    const dobDisplay = date_of_birth ? new Date(date_of_birth).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : 'N/A';
    const ageDisplay = age_legacy ? `${age_legacy} years` : 'N/A';

    // Admin email content
    const adminEmailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(to right, #ec4899, #f472b6); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Marathon Registration (Resend)</h1>
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
            <tr><td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #6b7280;">Payment ID:</td><td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #1f2937; font-size: 12px;">${payment_id}</td></tr>
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
              <tr><td style="padding: 8px 0; color: #6b7280;">Payment ID:</td><td style="padding: 8px 0; color: #1f2937; text-align: right; font-size: 11px;">${payment_id}</td></tr>
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
    let participantEmailId = null;
    let participantError = null;
    let adminEmailId = null;
    let adminError = null;

    try {
      const participantResult = await resend.emails.send({
        from: 'Janya Foundation <noreply@janyafoundation.in>',
        replyTo: 'janyafoundation.04@gmail.com',
        to: email,
        subject: 'Registration Confirmed - Janya Foundation Marathon',
        html: participantEmailContent,
      });
      participantEmailId = participantResult.data?.id || null;
      participantError = participantResult.error?.message || null;
      console.log('Resend participant email:', participantEmailId || 'failed', participantError || '');
    } catch (err) {
      participantError = err.message;
      console.error('Resend participant email exception:', err.message);
    }

    // Add 3 second delay before sending admin email to avoid rate limiting (429 errors)
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Send admin email - also CC foundation email to ensure delivery
    try {
      const adminResult = await resend.emails.send({
        from: 'Janya Foundation <noreply@janyafoundation.in>',
        replyTo: email, // Reply-to the participant
        to: [adminEmail, 'janyafoundation.04@gmail.com'].filter((e, i, arr) => arr.indexOf(e) === i), // Remove duplicates
        subject: `Marathon Registration (Resend) - ${name} (${raceCategoryDisplay})`,
        html: adminEmailContent,
      });
      adminEmailId = adminResult.data?.id || null;
      adminError = adminResult.error?.message || null;
      console.log('Resend admin email:', adminEmailId || 'failed', adminError || '');
    } catch (err) {
      adminError = err.message;
      console.error('Resend admin email exception:', err.message);
    }

    const success = !!(adminEmailId && participantEmailId);

    // Update email_sent flag in database
    if (success) {
      await supabaseAdmin
        .from('marathon_registrations')
        .update({ email_sent: true })
        .eq('transaction_id', transactionId);
    }

    return NextResponse.json({
      success,
      adminEmailId,
      adminError,
      participantEmailId,
      participantError,
      participant: { name, email }
    });

  } catch (error) {
    console.error('Resend email error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
