import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { Resend } from 'resend';

const sendConfirmationEmail = async (userEmail, fullName, claimId, raceCategory) => {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not set');
      return false;
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    console.log('Sending prize claim email to:', userEmail);

    const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
              <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
                <!-- Header -->
                <div style="background: linear-gradient(135deg, #ec4899 0%, #be185d 100%); padding: 40px 30px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">🏆 Congratulations!</h1>
                  <p style="color: #fce7f3; margin: 10px 0 0 0; font-size: 16px;">Your Prize Claim Has Been Received</p>
                </div>

                <!-- Content -->
                <div style="padding: 40px 30px;">
                  <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                    Dear <strong>${fullName}</strong>,
                  </p>

                  <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                    Thank you for participating in the <strong>Janya Foundation Marathon 2026</strong>! We have successfully received your prize claim submission.
                  </p>

                  <!-- Claim Details Box -->
                  <div style="background-color: #fdf2f8; border-radius: 12px; padding: 25px; margin: 25px 0;">
                    <h3 style="color: #be185d; margin: 0 0 15px 0; font-size: 18px;">📋 Claim Details</h3>
                    <table style="width: 100%; border-collapse: collapse;">
                      <tr>
                        <td style="color: #6b7280; padding: 8px 0; font-size: 14px;">Claim ID:</td>
                        <td style="color: #111827; padding: 8px 0; font-size: 14px; font-weight: bold; text-align: right;">${claimId}</td>
                      </tr>
                      <tr>
                        <td style="color: #6b7280; padding: 8px 0; font-size: 14px;">Race Category:</td>
                        <td style="color: #111827; padding: 8px 0; font-size: 14px; font-weight: bold; text-align: right;">${raceCategory}</td>
                      </tr>
                      <tr>
                        <td style="color: #6b7280; padding: 8px 0; font-size: 14px;">Status:</td>
                        <td style="color: #f59e0b; padding: 8px 0; font-size: 14px; font-weight: bold; text-align: right;">Under Review</td>
                      </tr>
                    </table>
                  </div>

                  <!-- Timeline Info -->
                  <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 25px 0; border-radius: 0 8px 8px 0;">
                    <h4 style="color: #92400e; margin: 0 0 10px 0; font-size: 16px;">⏱️ Processing Timeline</h4>
                    <p style="color: #78350f; margin: 0; font-size: 14px; line-height: 1.6;">
                      Your documents are now under review. The verification process will take <strong>60-70 working days</strong>. Once verified, your prize money will be credited to your bank account.
                    </p>
                  </div>

                  <!-- What's Next -->
                  <div style="margin: 25px 0;">
                    <h3 style="color: #111827; margin: 0 0 15px 0; font-size: 18px;">📌 What Happens Next?</h3>
                    <ul style="color: #374151; font-size: 14px; line-height: 1.8; padding-left: 20px; margin: 0;">
                      <li>Our team will verify your submitted documents</li>
                      <li>You will receive an email notification once verification is complete</li>
                      <li>Prize money will be transferred to your bank account after successful verification</li>
                      <li>If we need any additional information, we will contact you via email or phone</li>
                    </ul>
                  </div>

                  <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 25px 0 0 0;">
                    Thank you for being a part of our mission to empower women and children!
                  </p>

                  <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 20px 0 0 0;">
                    Warm regards,<br>
                    <strong style="color: #be185d;">Team Janya Foundation</strong>
                  </p>
                </div>

                <!-- Footer -->
                <div style="background-color: #f9fafb; padding: 25px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                  <p style="color: #6b7280; font-size: 12px; margin: 0 0 10px 0;">
                    Need help? Contact us at <a href="mailto:janyafoundation.04@gmail.com" style="color: #ec4899;">janyafoundation.04@gmail.com</a>
                  </p>
                  <p style="color: #6b7280; font-size: 12px; margin: 0 0 10px 0;">
                    Or call us at <a href="tel:+919321496142" style="color: #ec4899;">+91 93214 96142</a>
                  </p>
                  <p style="color: #9ca3af; font-size: 11px; margin: 15px 0 0 0;">
                    © 2026 Janya Foundation. All rights reserved.
                  </p>
                </div>
              </div>
            </body>
            </html>
          `;

    const textContent = `
Congratulations ${fullName}!

Your Prize Claim Has Been Received

Thank you for participating in the Janya Foundation Marathon 2026! We have successfully received your prize claim submission.

Claim Details:
- Claim ID: ${claimId}
- Race Category: ${raceCategory}
- Status: Under Review

Processing Timeline:
Your documents are now under review. The verification process will take 60-70 working days. Once verified, your prize money will be credited to your bank account.

What Happens Next?
- Our team will verify your submitted documents
- You will receive an email notification once verification is complete
- Prize money will be transferred to your bank account after successful verification
- If we need any additional information, we will contact you via email or phone

Thank you for being a part of our mission to empower women and children!

Warm regards,
Team Janya Foundation

Need help? Contact us at janyafoundation.04@gmail.com or call +91 93214 96142

© 2026 Janya Foundation. All rights reserved.
`;

    const result = await resend.emails.send({
      from: 'Janya Foundation <noreply@janyafoundation.in>',
      replyTo: 'janyafoundation04@gmail.com',
      to: userEmail,
      subject: `Prize Claim Received - ${claimId}`,
      html: htmlContent,
      text: textContent,
    });

    if (result.error) {
      console.error('Resend error:', result.error);
      return false;
    }

    console.log('Email sent successfully, ID:', result.data?.id);
    return true;
  } catch (error) {
    console.error('Email sending error:', error.message);
    return false;
  }
};

const sendAdminNotificationEmail = async (claimData) => {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not set');
      return false;
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const adminEmail = process.env.ADMIN_EMAIL || 'janyafoundation.04@gmail.com';

    console.log('Sending admin notification email to:', adminEmail);

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 40px 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">🏆 New Prize Claim Received</h1>
            <p style="color: #fef3c7; margin: 10px 0 0 0; font-size: 16px;">Action Required - Review Documents</p>
          </div>

          <!-- Content -->
          <div style="padding: 40px 30px;">
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
              A new prize claim has been submitted for the <strong>Janya Foundation Marathon 2026</strong>. Please review the details below.
            </p>

            <!-- Claim Details Box -->
            <div style="background-color: #fef3c7; border-radius: 12px; padding: 25px; margin: 25px 0;">
              <h3 style="color: #92400e; margin: 0 0 15px 0; font-size: 18px;">📋 Claim Details</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="color: #6b7280; padding: 8px 0; font-size: 14px;">Claim ID:</td>
                  <td style="color: #111827; padding: 8px 0; font-size: 14px; font-weight: bold; text-align: right;">${claimData.claimId}</td>
                </tr>
                <tr>
                  <td style="color: #6b7280; padding: 8px 0; font-size: 14px;">Full Name:</td>
                  <td style="color: #111827; padding: 8px 0; font-size: 14px; font-weight: bold; text-align: right;">${claimData.fullName}</td>
                </tr>
                <tr>
                  <td style="color: #6b7280; padding: 8px 0; font-size: 14px;">Email:</td>
                  <td style="color: #111827; padding: 8px 0; font-size: 14px; font-weight: bold; text-align: right;">${claimData.email}</td>
                </tr>
                <tr>
                  <td style="color: #6b7280; padding: 8px 0; font-size: 14px;">Phone:</td>
                  <td style="color: #111827; padding: 8px 0; font-size: 14px; font-weight: bold; text-align: right;">${claimData.phone}</td>
                </tr>
                <tr>
                  <td style="color: #6b7280; padding: 8px 0; font-size: 14px;">Age:</td>
                  <td style="color: #111827; padding: 8px 0; font-size: 14px; font-weight: bold; text-align: right;">${claimData.age} years</td>
                </tr>
                <tr>
                  <td style="color: #6b7280; padding: 8px 0; font-size: 14px;">Race Category:</td>
                  <td style="color: #111827; padding: 8px 0; font-size: 14px; font-weight: bold; text-align: right;">${claimData.raceCategory}</td>
                </tr>
                <tr>
                  <td style="color: #6b7280; padding: 8px 0; font-size: 14px;">Prize Money Option:</td>
                  <td style="color: #111827; padding: 8px 0; font-size: 14px; font-weight: bold; text-align: right;">${claimData.openCategoryPrizeMoney}</td>
                </tr>
              </table>
            </div>

            <!-- Address -->
            <div style="background-color: #f3f4f6; border-radius: 12px; padding: 20px; margin: 25px 0;">
              <h4 style="color: #374151; margin: 0 0 10px 0; font-size: 16px;">📍 Address</h4>
              <p style="color: #6b7280; margin: 0; font-size: 14px; line-height: 1.6;">${claimData.address}</p>
            </div>

            <!-- Documents -->
            <div style="background-color: #ecfdf5; border-radius: 12px; padding: 20px; margin: 25px 0;">
              <h4 style="color: #065f46; margin: 0 0 10px 0; font-size: 16px;">📄 Uploaded Documents</h4>
              <ul style="color: #374151; font-size: 14px; line-height: 1.8; padding-left: 20px; margin: 0;">
                <li>Age Proof Document</li>
                <li>Aadhar Card</li>
                <li>PAN Card</li>
              </ul>
              <p style="color: #6b7280; font-size: 12px; margin: 15px 0 0 0;">
                View documents in Supabase Storage under: prize-documents/${claimData.claimId}/
              </p>
            </div>

            <!-- Action Required -->
            <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 20px; margin: 25px 0; border-radius: 0 8px 8px 0;">
              <h4 style="color: #991b1b; margin: 0 0 10px 0; font-size: 16px;">⚠️ Action Required</h4>
              <p style="color: #7f1d1d; margin: 0; font-size: 14px; line-height: 1.6;">
                Please verify the submitted documents and update the claim status within <strong>60-70 working days</strong>.
              </p>
            </div>

            <p style="color: #374151; font-size: 14px; line-height: 1.6; margin: 25px 0 0 0;">
              Submitted at: <strong>${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</strong>
            </p>
          </div>

          <!-- Footer -->
          <div style="background-color: #f9fafb; padding: 25px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="color: #9ca3af; font-size: 11px; margin: 0;">
              This is an automated notification from Janya Foundation Prize Claim System.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    const textContent = `
New Prize Claim Received - Action Required

A new prize claim has been submitted for the Janya Foundation Marathon 2026.

Claim Details:
- Claim ID: ${claimData.claimId}
- Full Name: ${claimData.fullName}
- Email: ${claimData.email}
- Phone: ${claimData.phone}
- Age: ${claimData.age} years
- Race Category: ${claimData.raceCategory}
- Prize Money Option: ${claimData.openCategoryPrizeMoney}

Address:
${claimData.address}

Uploaded Documents:
- Age Proof Document
- Aadhar Card
- PAN Card

Documents Location: prize-documents/${claimData.claimId}/

Action Required:
Please verify the submitted documents and update the claim status within 60-70 working days.

Submitted at: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}

This is an automated notification from Janya Foundation Prize Claim System.
`;

    const result = await resend.emails.send({
      from: 'Janya Foundation <noreply@janyafoundation.in>',
      to: adminEmail,
      subject: `🏆 New Prize Claim: ${claimData.claimId} - ${claimData.fullName}`,
      html: htmlContent,
      text: textContent,
    });

    if (result.error) {
      console.error('Admin email error:', result.error);
      return false;
    }

    console.log('Admin notification email sent, ID:', result.data?.id);
    return true;
  } catch (error) {
    console.error('Admin email sending error:', error.message);
    return false;
  }
};

const sendStatusUpdateEmail = async (claimData, newStatus) => {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not set');
      return false;
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    console.log('Sending status update email to:', claimData.email);

    // Status configurations
    const statusConfig = {
      under_review: {
        title: '📋 Your Prize Claim is Under Review',
        subtitle: 'We are reviewing your documents',
        color: '#3b82f6', // blue
        bgColor: '#eff6ff',
        message: 'Your prize claim documents are currently being reviewed by our team. This process typically takes 60-70 working days.',
        nextSteps: [
          'Our team is verifying your submitted documents',
          'We will contact you if any additional information is needed',
          'You will receive an email once the review is complete',
        ],
      },
      verified: {
        title: '✅ Your Prize Claim is Verified!',
        subtitle: 'Documents successfully verified',
        color: '#22c55e', // green
        bgColor: '#f0fdf4',
        message: 'Great news! Your documents have been successfully verified. Your prize money will be processed shortly.',
        nextSteps: [
          'Your documents have been approved',
          'Prize money transfer will be initiated soon',
          'You will receive a confirmation once payment is made',
        ],
      },
      paid: {
        title: '🎉 Prize Money Transferred!',
        subtitle: 'Payment completed successfully',
        color: '#a855f7', // purple
        bgColor: '#faf5ff',
        message: 'Congratulations! Your prize money has been successfully transferred to your bank account.',
        nextSteps: [
          'Check your bank account for the credited amount',
          'The transfer may take 2-3 business days to reflect',
          'Keep this email for your records',
        ],
      },
      rejected: {
        title: '❌ Prize Claim Rejected',
        subtitle: 'Unable to process your claim',
        color: '#ef4444', // red
        bgColor: '#fef2f2',
        message: 'Unfortunately, we were unable to verify your prize claim. Please review the reason below and contact us if you have questions.',
        nextSteps: [
          'Review the rejection reason provided',
          'Contact us if you believe this is an error',
          'You may submit a new claim with correct documents',
        ],
      },
    };

    const config = statusConfig[newStatus];
    if (!config) {
      console.log('No email config for status:', newStatus);
      return false;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          <!-- Header -->
          <div style="background: ${config.color}; padding: 40px 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">${config.title}</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">${config.subtitle}</p>
          </div>

          <!-- Content -->
          <div style="padding: 40px 30px;">
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
              Dear <strong>${claimData.full_name}</strong>,
            </p>

            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
              ${config.message}
            </p>

            <!-- Claim Details Box -->
            <div style="background-color: ${config.bgColor}; border-radius: 12px; padding: 25px; margin: 25px 0;">
              <h3 style="color: ${config.color}; margin: 0 0 15px 0; font-size: 18px;">📋 Claim Details</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="color: #6b7280; padding: 8px 0; font-size: 14px;">Claim ID:</td>
                  <td style="color: #111827; padding: 8px 0; font-size: 14px; font-weight: bold; text-align: right;">${claimData.claim_id}</td>
                </tr>
                <tr>
                  <td style="color: #6b7280; padding: 8px 0; font-size: 14px;">Race Category:</td>
                  <td style="color: #111827; padding: 8px 0; font-size: 14px; font-weight: bold; text-align: right;">${claimData.race_category}</td>
                </tr>
                <tr>
                  <td style="color: #6b7280; padding: 8px 0; font-size: 14px;">Status:</td>
                  <td style="color: ${config.color}; padding: 8px 0; font-size: 14px; font-weight: bold; text-align: right;">${newStatus.replace('_', ' ').toUpperCase()}</td>
                </tr>
                ${claimData.prize_amount ? `
                <tr>
                  <td style="color: #6b7280; padding: 8px 0; font-size: 14px;">Prize Amount:</td>
                  <td style="color: #111827; padding: 8px 0; font-size: 14px; font-weight: bold; text-align: right;">₹${claimData.prize_amount}</td>
                </tr>
                ` : ''}
                ${claimData.admin_notes && newStatus === 'rejected' ? `
                <tr>
                  <td style="color: #6b7280; padding: 8px 0; font-size: 14px;">Reason:</td>
                  <td style="color: #111827; padding: 8px 0; font-size: 14px; text-align: right;">${claimData.admin_notes}</td>
                </tr>
                ` : ''}
              </table>
            </div>

            <!-- What's Next -->
            <div style="margin: 25px 0;">
              <h3 style="color: #111827; margin: 0 0 15px 0; font-size: 18px;">📌 What's Next?</h3>
              <ul style="color: #374151; font-size: 14px; line-height: 1.8; padding-left: 20px; margin: 0;">
                ${config.nextSteps.map(step => `<li>${step}</li>`).join('')}
              </ul>
            </div>

            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 25px 0 0 0;">
              Thank you for being a part of Janya Foundation Marathon 2026!
            </p>

            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 20px 0 0 0;">
              Warm regards,<br>
              <strong style="color: #be185d;">Team Janya Foundation</strong>
            </p>
          </div>

          <!-- Footer -->
          <div style="background-color: #f9fafb; padding: 25px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 12px; margin: 0 0 10px 0;">
              Need help? Contact us at <a href="mailto:janyafoundation.04@gmail.com" style="color: #ec4899;">janyafoundation.04@gmail.com</a>
            </p>
            <p style="color: #6b7280; font-size: 12px; margin: 0 0 10px 0;">
              Or call us at <a href="tel:+919321496142" style="color: #ec4899;">+91 93214 96142</a>
            </p>
            <p style="color: #9ca3af; font-size: 11px; margin: 15px 0 0 0;">
              © 2026 Janya Foundation. All rights reserved.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    const textContent = `
${config.title}

Dear ${claimData.full_name},

${config.message}

Claim Details:
- Claim ID: ${claimData.claim_id}
- Race Category: ${claimData.race_category}
- Status: ${newStatus.replace('_', ' ').toUpperCase()}
${claimData.prize_amount ? `- Prize Amount: ₹${claimData.prize_amount}` : ''}
${claimData.admin_notes && newStatus === 'rejected' ? `- Reason: ${claimData.admin_notes}` : ''}

What's Next?
${config.nextSteps.map(step => `- ${step}`).join('\n')}

Thank you for being a part of Janya Foundation Marathon 2026!

Warm regards,
Team Janya Foundation

Need help? Contact us at janyafoundation.04@gmail.com or call +91 93214 96142

© 2026 Janya Foundation. All rights reserved.
`;

    const statusEmojis = {
      under_review: '📋',
      verified: '✅',
      paid: '🎉',
      rejected: '❌',
    };

    const result = await resend.emails.send({
      from: 'Janya Foundation <noreply@janyafoundation.in>',
      replyTo: 'janyafoundation04@gmail.com',
      to: claimData.email,
      subject: `${statusEmojis[newStatus] || '📬'} Prize Claim Update: ${newStatus.replace('_', ' ').toUpperCase()} - ${claimData.claim_id}`,
      html: htmlContent,
      text: textContent,
    });

    if (result.error) {
      console.error('Status update email error:', result.error);
      return false;
    }

    console.log('Status update email sent, ID:', result.data?.id);
    return true;
  } catch (error) {
    console.error('Status update email error:', error.message);
    return false;
  }
};

export async function POST(request) {
  try {
    const formData = await request.formData();

    // Extract form fields
    const fullName = formData.get('fullName');
    const phone = formData.get('phone');
    const email = formData.get('email');
    const address = formData.get('address');
    const ageCategory = formData.get('ageCategory');
    const age = formData.get('age');
    const openCategoryPrizeMoney = formData.get('openCategoryPrizeMoney');

    // Extract files
    const ageProofFile = formData.get('ageProof');
    const aadharCardFile = formData.get('aadharCard');
    const panCardFile = formData.get('panCard');

    // Validate required fields
    if (!fullName || !phone || !email || !address || !ageCategory || !age || !openCategoryPrizeMoney) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate files
    if (!ageProofFile || !aadharCardFile || !panCardFile) {
      return NextResponse.json(
        { success: false, error: 'All documents are required' },
        { status: 400 }
      );
    }

    // Validate phone number
    if (!/^[0-9]{10}$/.test(phone)) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid 10-digit phone number' },
        { status: 400 }
      );
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Generate unique ID for this claim
    const claimId = `PRIZE-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const timestamp = new Date().toISOString();

    // Upload files to Supabase Storage
    const uploadFile = async (file, docType) => {
      const fileExtension = file.name.split('.').pop();
      const sanitizedName = fullName.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
      const fileName = `${claimId}/${docType}_${sanitizedName}.${fileExtension}`;

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const { data, error } = await supabaseAdmin.storage
        .from('prize-documents')
        .upload(fileName, buffer, {
          contentType: file.type,
          upsert: false,
        });

      if (error) {
        console.error(`Error uploading ${docType}:`, error);
        throw new Error(`Failed to upload ${docType}: ${error.message}`);
      }

      // Get signed URL (valid for 1 year)
      const { data: signedUrlData, error: signedUrlError } = await supabaseAdmin.storage
        .from('prize-documents')
        .createSignedUrl(fileName, 60 * 60 * 24 * 365); // 1 year

      if (signedUrlError) {
        console.error(`Error getting signed URL for ${docType}:`, signedUrlError);
        return `prize-documents/${fileName}`;
      }

      return signedUrlData.signedUrl;
    };

    // Upload all files
    let ageProofUrl, aadharCardUrl, panCardUrl;

    try {
      console.log('Uploading age proof...');
      ageProofUrl = await uploadFile(ageProofFile, 'age_proof');
      console.log('Uploading aadhar card...');
      aadharCardUrl = await uploadFile(aadharCardFile, 'aadhar_card');
      console.log('Uploading pan card...');
      panCardUrl = await uploadFile(panCardFile, 'pan_card');
      console.log('All files uploaded successfully');
    } catch (uploadError) {
      console.error('File upload error:', uploadError);
      return NextResponse.json(
        { success: false, error: uploadError.message || 'Failed to upload documents. Please try again.' },
        { status: 500 }
      );
    }

    // Save to database
    const { data, error: dbError } = await supabaseAdmin
      .from('prize_claims')
      .insert([
        {
          claim_id: claimId,
          full_name: fullName,
          phone: phone,
          email: email,
          address: address,
          race_category: ageCategory,
          age: parseInt(age),
          open_category_prize_money: openCategoryPrizeMoney,
          age_proof_url: ageProofUrl,
          aadhar_card_url: aadharCardUrl,
          pan_card_url: panCardUrl,
          status: 'pending',
          created_at: timestamp,
        },
      ])
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { success: false, error: 'Failed to save claim. Please try again.' },
        { status: 500 }
      );
    }

    // Send confirmation email
    const raceCategoryLabels = {
      '5km': '5 KM Competitive',
      '10km': '10 KM Competitive',
      '21km': '21.1 KM Half Marathon',
      'cause5km': '5 KM Run for Cause',
      'cause10km': '10 KM Run for Cause',
      '3km': '3 KM Fun Run',
      'kidsrun': 'Kids Run',
    };
    const raceCategoryLabel = raceCategoryLabels[ageCategory] || ageCategory;

    // Send confirmation email to participant
    try {
      const emailSent = await sendConfirmationEmail(email, fullName, claimId, raceCategoryLabel);
      console.log('Participant email sent status:', emailSent);
    } catch (emailError) {
      console.error('Participant email sending failed:', emailError);
      // Don't fail the request if email fails
    }

    // Send notification email to admin
    try {
      const adminEmailSent = await sendAdminNotificationEmail({
        claimId,
        fullName,
        email,
        phone,
        age,
        address,
        raceCategory: raceCategoryLabel,
        openCategoryPrizeMoney,
      });
      console.log('Admin email sent status:', adminEmailSent);
    } catch (adminEmailError) {
      console.error('Admin email sending failed:', adminEmailError);
      // Don't fail the request if admin email fails
    }

    return NextResponse.json({
      success: true,
      message: 'Prize claim submitted successfully',
      claimId: claimId,
    });
  } catch (error) {
    console.error('Prize claim error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}

// GET - Fetch all prize claims (for admin dashboard)
export async function GET(request) {
  try {
    const { data, error } = await supabaseAdmin
      .from('prize_claims')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching prize claims:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch prize claims' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      claims: data || [],
    });
  } catch (error) {
    console.error('Prize claims fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

// PATCH - Update prize claim status
export async function PATCH(request) {
  try {
    const body = await request.json();
    const { claimId, status, adminNotes, prizeAmount, paymentReference } = body;

    if (!claimId) {
      return NextResponse.json(
        { success: false, error: 'Claim ID is required' },
        { status: 400 }
      );
    }

    const updateData = {};
    if (status) updateData.status = status;
    if (adminNotes !== undefined) updateData.admin_notes = adminNotes;
    if (prizeAmount !== undefined) updateData.prize_amount = prizeAmount;
    if (paymentReference) updateData.payment_reference = paymentReference;

    if (status === 'verified') {
      updateData.verified_at = new Date().toISOString();
    }
    if (status === 'paid') {
      updateData.payment_date = new Date().toISOString();
    }

    const { data, error } = await supabaseAdmin
      .from('prize_claims')
      .update(updateData)
      .eq('claim_id', claimId)
      .select()
      .single();

    if (error) {
      console.error('Error updating prize claim:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to update prize claim' },
        { status: 500 }
      );
    }

    // Send status update email to customer if status changed
    if (status && data) {
      try {
        const emailSent = await sendStatusUpdateEmail(data, status);
        console.log('Status update email sent:', emailSent);
      } catch (emailError) {
        console.error('Failed to send status update email:', emailError);
        // Don't fail the request if email fails
      }
    }

    return NextResponse.json({
      success: true,
      claim: data,
    });
  } catch (error) {
    console.error('Prize claim update error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
