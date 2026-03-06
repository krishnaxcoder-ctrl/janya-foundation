import { Resend } from 'resend';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not set');
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 500 }
      );
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const {
      firstName,
      lastName,
      email,
      phone,
      company,
      city,
      state,
      subject,
      message,
      services
    } = await request.json();

    // Validate required fields
    if (!firstName || !lastName || !email || !phone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const adminEmail = process.env.ADMIN_EMAIL || 'janyafoundation.04@gmail.com';
    const fullName = `${firstName} ${lastName}`;

    // Map subject value to display text
    const subjectMap = {
      donation: 'Donation Inquiry',
      marathon: 'Marathon Registration',
      volunteer: 'Volunteering',
      partnership: 'Partnership',
      csr: 'CSR Programs',
      media: 'Media / Press',
      other: 'Other'
    };

    // Map service IDs to labels
    const serviceMap = {
      donation: 'Donation Inquiry',
      marathon: 'Marathon Registration',
      volunteer: 'Volunteering',
      partnership: 'Partnership',
      csr: 'CSR Programs',
      other: 'Other'
    };

    const subjectDisplay = subjectMap[subject] || subject || 'General Inquiry';
    const servicesDisplay = services?.length > 0
      ? services.map(s => serviceMap[s] || s).join(', ')
      : 'Not specified';

    // Email to Admin
    const adminEmailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(to right, #ec4899, #f472b6); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">New Contact Form Submission</h1>
        </div>
        <div style="padding: 20px; background: #f9fafb;">
          <h2 style="color: #1f2937; border-bottom: 2px solid #ec4899; padding-bottom: 10px;">Contact Details</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #6b7280; width: 140px;">Name:</td>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${fullName}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #6b7280;">Email:</td>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">
                <a href="mailto:${email}" style="color: #ec4899;">${email}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #6b7280;">Phone:</td>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">
                <a href="tel:+91${phone}" style="color: #ec4899;">+91 ${phone}</a>
              </td>
            </tr>
            ${company ? `
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #6b7280;">Company:</td>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${company}</td>
            </tr>
            ` : ''}
            ${city || state ? `
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #6b7280;">Location:</td>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${[city, state].filter(Boolean).join(', ')}</td>
            </tr>
            ` : ''}
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #6b7280;">Subject:</td>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #1f2937; font-weight: bold;">${subjectDisplay}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #6b7280;">Interest:</td>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${servicesDisplay}</td>
            </tr>
          </table>

          ${message ? `
          <h2 style="color: #1f2937; border-bottom: 2px solid #ec4899; padding-bottom: 10px; margin-top: 20px;">Message</h2>
          <div style="background: white; padding: 15px; border-radius: 8px; border: 1px solid #e5e7eb;">
            <p style="color: #1f2937; margin: 0; white-space: pre-wrap; line-height: 1.6;">${message}</p>
          </div>
          ` : ''}

          <div style="margin-top: 20px; padding: 15px; background: #fdf2f8; border-radius: 8px;">
            <p style="margin: 0; font-size: 14px; color: #6b7280;">
              <strong>Quick Actions:</strong><br/>
              <a href="mailto:${email}?subject=Re: ${subjectDisplay}" style="color: #ec4899;">Reply via Email</a> |
              <a href="https://wa.me/91${phone}" style="color: #22c55e;">WhatsApp</a> |
              <a href="tel:+91${phone}" style="color: #3b82f6;">Call</a>
            </p>
          </div>
        </div>
        <div style="background: #1f2937; padding: 15px; text-align: center;">
          <p style="color: #9ca3af; margin: 0; font-size: 12px;">Janya Foundation - Contact Form</p>
          <p style="color: #6b7280; margin: 5px 0 0 0; font-size: 11px;">
            Submitted on ${new Date().toLocaleString('en-IN', { dateStyle: 'full', timeStyle: 'short', timeZone: 'Asia/Kolkata' })}
          </p>
        </div>
      </div>
    `;

    // Send email to admin
    const result = await resend.emails.send({
      from: 'Janya Foundation <noreply@janyafoundation.in>',
      to: adminEmail,
      replyTo: email,
      subject: `Contact Form: ${subjectDisplay} - ${fullName}`,
      html: adminEmailContent,
    });

    if (result.error) {
      console.error('Email send error:', result.error);
      return NextResponse.json({
        success: false,
        error: result.error.message
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      emailId: result.data?.id,
      message: 'Message sent successfully'
    });

  } catch (error) {
    console.error('Error sending contact email:', error);
    return NextResponse.json(
      {
        error: 'Failed to send message',
        details: error.message || String(error)
      },
      { status: 500 }
    );
  }
}
