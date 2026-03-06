import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { Resend } from 'resend';

// This endpoint manually fixes PENDING registrations after payment was completed
// Use this when webhook didn't fire and success page failed
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

    // Update to SUCCESS if still PENDING
    if (registration.payment_status === 'PENDING') {
      const { error: updateError } = await supabaseAdmin
        .from('marathon_registrations')
        .update({
          payment_status: 'SUCCESS',
          payment_id: transactionId // Use transactionId as paymentId if not available
        })
        .eq('transaction_id', transactionId);

      if (updateError) {
        return NextResponse.json(
          { success: false, error: 'Failed to update registration' },
          { status: 500 }
        );
      }

      console.log('Registration fixed to SUCCESS:', transactionId);
    }

    // Send emails
    let emailSent = false;
    if (process.env.RESEND_API_KEY && !registration.is_donation) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        const adminEmail = process.env.ADMIN_EMAIL || 'krishnaxcoder@gmail.com';

        const raceCategoryDisplay = registration.is_run_for_cause
          ? `${registration.race_category} (Run for Cause)`
          : registration.race_category;

        // Calculate age from date of birth
        let age = null;
        if (registration.date_of_birth) {
          const today = new Date();
          const birth = new Date(registration.date_of_birth);
          age = today.getFullYear() - birth.getFullYear();
          const monthDiff = today.getMonth() - birth.getMonth();
          if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
          }
        }
        const dobDisplay = registration.date_of_birth
          ? new Date(registration.date_of_birth).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' })
          : 'N/A';

        // Send participant email first (most important for user)
        const participantResult = await resend.emails.send({
          from: 'Janya Foundation <noreply@janyafoundation.in>',
          to: registration.email,
          subject: 'Registration Confirmed - Janya Foundation Marathon',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: linear-gradient(to right, #ec4899, #f472b6); padding: 30px; text-align: center;">
                <h1 style="color: white; margin: 0;">Registration Confirmed!</h1>
              </div>
              <div style="padding: 30px;">
                <p>Dear <strong>${registration.name}</strong>,</p>
                <p>Your registration for <strong>${raceCategoryDisplay}</strong> has been confirmed.</p>
                <div style="background: #fdf2f8; padding: 20px; border-radius: 10px; margin: 20px 0;">
                  <p><strong>Race:</strong> ${raceCategoryDisplay}</p>
                  <p><strong>Race Type:</strong> ${registration.race_type}</p>
                  <p><strong>T-Shirt Size:</strong> ${registration.tshirt_size || 'N/A'}</p>
                  <p><strong>Amount Paid:</strong> ₹${registration.total_amount}</p>
                  <p><strong>Transaction ID:</strong> ${transactionId}</p>
                </div>
                <div style="background: #f3f4f6; padding: 20px; border-radius: 10px;">
                  <h3>What's Next?</h3>
                  <ul>
                    <li><strong>BIB Collection (3KM, 5KM, 10KM & 21.1KM):</strong> March 6-7, 2026 (5 PM - 8 PM) - Decathlon, Belapur</li>
                    <li><strong>Marathon Day:</strong> March 8, 2026 (5:00 AM) - BD Somani International School, Sector 27</li>
                  </ul>
                </div>
                <p style="margin-top: 20px;">See you at the marathon!<br/><strong>Team Janya Foundation</strong></p>
              </div>
            </div>
          `,
        });

        // Add 3 second delay before sending admin email to avoid rate limiting (429 errors)
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Send admin email
        const adminResult = await resend.emails.send({
          from: 'Janya Foundation <noreply@janyafoundation.in>',
          to: adminEmail,
          subject: `Marathon Registration (Fixed) - ${registration.name} (${raceCategoryDisplay})`,
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
              <h2 style="color: #ec4899;">Registration Details (Fixed)</h2>
              <p><strong>Name:</strong> ${registration.name}</p>
              <p><strong>Email:</strong> ${registration.email}</p>
              <p><strong>Phone:</strong> ${registration.phone}</p>
              <p><strong>Emergency Contact:</strong> ${registration.emergency_phone || 'N/A'}</p>
              <p><strong>Date of Birth:</strong> ${dobDisplay}${age ? ` (${age} years)` : ''}</p>
              <p><strong>Gender:</strong> ${registration.gender || 'N/A'}</p>
              <p><strong>Race:</strong> ${raceCategoryDisplay}</p>
              <p><strong>Race Type:</strong> ${registration.race_type}</p>
              <p><strong>T-Shirt Size:</strong> ${registration.tshirt_size || 'N/A'}</p>
              <p><strong>Amount:</strong> ₹${registration.total_amount}</p>
              <p><strong>Transaction ID:</strong> ${transactionId}</p>
              <p style="color: #f59e0b; font-size: 12px;">Note: This registration was manually fixed.</p>
            </div>
          `,
        });

        emailSent = !!(adminResult.data?.id || participantResult.data?.id);
        console.log('Fix-pending emails sent:', emailSent);
      } catch (emailError) {
        console.error('Email error:', emailError.message);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Registration fixed and emails sent',
      emailSent,
      registration: {
        name: registration.name,
        email: registration.email,
        race_category: registration.race_category,
        total_amount: registration.total_amount
      }
    });

  } catch (error) {
    console.error('Fix pending error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
