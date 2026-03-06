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
      city,
      state,
      zipCode,
      message
    } = await request.json();

    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !city || !state) {
      return NextResponse.json(
        { error: 'Please fill all required fields' },
        { status: 400 }
      );
    }

    const volunteerEmailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(to right, #3b82f6, #6366f1); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">New Volunteer Application</h1>
        </div>
        <div style="padding: 20px; background: #f9fafb;">
          <h2 style="color: #1f2937; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">Personal Details</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #6b7280; width: 40%;">Name:</td>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${firstName} ${lastName}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #6b7280;">Email:</td>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #1f2937;"><a href="mailto:${email}" style="color: #3b82f6;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #6b7280;">Phone:</td>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #1f2937;"><a href="tel:${phone}" style="color: #3b82f6;">${phone}</a></td>
            </tr>
          </table>

          <h2 style="color: #1f2937; border-bottom: 2px solid #3b82f6; padding-bottom: 10px; margin-top: 20px;">Location</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #6b7280; width: 40%;">City:</td>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${city}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #6b7280;">State:</td>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${state}</td>
            </tr>
            ${zipCode ? `
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #6b7280;">Zip Code:</td>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${zipCode}</td>
            </tr>
            ` : ''}
          </table>

          ${message ? `
          <h2 style="color: #1f2937; border-bottom: 2px solid #3b82f6; padding-bottom: 10px; margin-top: 20px;">Message</h2>
          <div style="padding: 15px; background: white; border-radius: 8px; border: 1px solid #e5e7eb;">
            <p style="color: #1f2937; margin: 0; line-height: 1.6;">${message.replace(/\n/g, '<br>')}</p>
          </div>
          ` : ''}

          <div style="margin-top: 20px; padding: 15px; background: #dbeafe; border-radius: 8px;">
            <p style="color: #1e40af; margin: 0; font-size: 14px;">
              <strong>Action Required:</strong> Please reach out to this volunteer to discuss opportunities.
            </p>
          </div>
        </div>
        <div style="background: #1f2937; padding: 15px; text-align: center;">
          <p style="color: #9ca3af; margin: 0; font-size: 12px;">Janya Foundation - Volunteer Application</p>
          <p style="color: #6b7280; margin: 5px 0 0 0; font-size: 11px;">Submitted on ${new Date().toLocaleString('en-IN', { dateStyle: 'full', timeStyle: 'short' })}</p>
        </div>
      </div>
    `;

    const result = await resend.emails.send({
      from: 'Janya Foundation <noreply@janyafoundation.in>',
      to: 'janyafoundation04@gmail.com',
      subject: `New Volunteer Application - ${firstName} ${lastName}`,
      html: volunteerEmailContent,
    });

    if (result.error) {
      console.error('Email error:', result.error);
      return NextResponse.json({
        success: false,
        error: result.error.message
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      emailId: result.data?.id,
      message: 'Volunteer application submitted successfully'
    });

  } catch (error) {
    console.error('Error sending volunteer email:', error);
    return NextResponse.json(
      { error: 'Failed to submit application', details: error.message },
      { status: 500 }
    );
  }
}
