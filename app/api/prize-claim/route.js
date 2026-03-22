import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { Resend } from 'resend';

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

    // Extract files
    const ageProofFile = formData.get('ageProof');
    const aadharCardFile = formData.get('aadharCard');
    const panCardFile = formData.get('panCard');

    // Validate required fields
    if (!fullName || !phone || !email || !address || !ageCategory || !age) {
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
        // Fallback to public URL path
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

    // Get race category label
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

    // Send email notifications
    let emailStatus = { claimant: null, admin: null, errors: [] };

    try {
      if (!process.env.RESEND_API_KEY) {
        console.error('RESEND_API_KEY is not set');
        emailStatus.errors.push('RESEND_API_KEY not configured');
      } else {
        const resend = new Resend(process.env.RESEND_API_KEY);
        console.log('Resend initialized, sending emails...');
        const adminEmail = process.env.ADMIN_EMAIL || 'janyafoundation.04@gmail.com';

        // Email to Admin/Owner
        const adminEmailContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(to right, #ec4899, #f472b6); padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">New Prize Claim Submission</h1>
            </div>
            <div style="padding: 20px; background: #f9fafb;">
              <div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
                <p style="color: #92400e; margin: 0; font-weight: bold;">
                  ⚠️ Action Required: Please verify the documents and process the prize money.
                </p>
              </div>

              <h2 style="color: #1f2937; border-bottom: 2px solid #ec4899; padding-bottom: 10px;">Claimant Details</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #6b7280;">Claim ID:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #ec4899; font-weight: bold;">${claimId}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #6b7280;">Name:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${fullName}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #6b7280;">Phone:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${phone}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #6b7280;">Email:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${email}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #6b7280;">Address:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${address}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #6b7280;">Race Category:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #1f2937; font-weight: bold;">${raceCategoryLabel}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #6b7280;">Age:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${age} years</td>
                </tr>
              </table>

              <h2 style="color: #1f2937; border-bottom: 2px solid #ec4899; padding-bottom: 10px; margin-top: 20px;">Uploaded Documents</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #6b7280;">Age Proof:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">
                    <a href="${ageProofUrl}" style="color: #3b82f6; text-decoration: underline;" target="_blank">View Document</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #6b7280;">Aadhar Card:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">
                    <a href="${aadharCardUrl}" style="color: #3b82f6; text-decoration: underline;" target="_blank">View Document</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #6b7280;">PAN Card:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">
                    <a href="${panCardUrl}" style="color: #3b82f6; text-decoration: underline;" target="_blank">View Document</a>
                  </td>
                </tr>
              </table>

              <div style="background: #dbeafe; border: 1px solid #3b82f6; border-radius: 8px; padding: 15px; margin-top: 20px;">
                <p style="color: #1e40af; margin: 0; font-size: 14px;">
                  <strong>Next Steps:</strong><br/>
                  1. Click the links above to view/download the documents<br/>
                  2. Cross-check with marathon registration records<br/>
                  3. Process the prize money within 60-70 working days
                </p>
              </div>
            </div>
            <div style="background: #1f2937; padding: 15px; text-align: center;">
              <p style="color: #9ca3af; margin: 0; font-size: 12px;">Janya Foundation Marathon - Prize Claim System</p>
            </div>
          </div>
        `;

        // Email to Claimant (Confirmation)
        const claimantEmailContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(to right, #ec4899, #f472b6); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">Documents Received!</h1>
              <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Your prize claim has been submitted successfully</p>
            </div>

            <div style="padding: 30px; background: #ffffff;">
              <p style="color: #1f2937; font-size: 16px; line-height: 1.6;">
                Dear <strong>${fullName}</strong>,
              </p>
              <p style="color: #4b5563; font-size: 14px; line-height: 1.6;">
                Thank you for submitting your documents for the prize claim. We have received your submission and our team will verify your documents shortly.
              </p>

              <div style="background: #fdf2f8; border-radius: 10px; padding: 20px; margin: 20px 0;">
                <h2 style="color: #ec4899; margin: 0 0 15px 0; font-size: 18px;">Claim Details</h2>
                <table style="width: 100%;">
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280;">Claim ID:</td>
                    <td style="padding: 8px 0; color: #ec4899; font-weight: bold; text-align: right;">${claimId}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280;">Race Category:</td>
                    <td style="padding: 8px 0; color: #1f2937; font-weight: bold; text-align: right;">${raceCategoryLabel}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280;">Submitted On:</td>
                    <td style="padding: 8px 0; color: #1f2937; font-weight: bold; text-align: right;">${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</td>
                  </tr>
                </table>
              </div>

              <div style="background: #d1fae5; border: 1px solid #10b981; border-radius: 10px; padding: 20px; margin: 20px 0;">
                <h3 style="color: #065f46; margin: 0 0 10px 0; font-size: 16px;">What's Next?</h3>
                <ul style="color: #047857; font-size: 14px; line-height: 1.8; padding-left: 20px; margin: 0;">
                  <li>Our team will verify your documents within 7-14 working days</li>
                  <li>Your prize money will be credited within <strong>60-70 working days</strong> after verification</li>
                  <li>We will contact you if any additional information is required</li>
                </ul>
              </div>

              <p style="color: #4b5563; font-size: 14px; line-height: 1.6;">
                If you have any questions, feel free to contact us at <a href="tel:+919321496142" style="color: #ec4899;">+91 93214 96142</a> or email us at <a href="mailto:janyafoundation.04@gmail.com" style="color: #ec4899;">janyafoundation.04@gmail.com</a>
              </p>

              <p style="color: #1f2937; font-size: 14px; margin-top: 20px;">
                Thank you for participating!<br/>
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

        // Send email to claimant first
        try {
          console.log('Sending claimant email to:', email);
          const claimantResult = await resend.emails.send({
            from: 'Janya Foundation <noreply@janyafoundation.in>',
            replyTo: 'janyafoundation.04@gmail.com',
            to: email,
            subject: `Prize Claim Received - ${claimId}`,
            html: claimantEmailContent,
          });
          console.log('Claimant email result:', claimantResult);
          emailStatus.claimant = claimantResult.data?.id || 'sent';
        } catch (err) {
          console.error('Claimant email error:', err);
          emailStatus.errors.push(`Claimant email failed: ${err.message}`);
        }

        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Send email to admin/owner
        try {
          const adminRecipients = [adminEmail, 'janyafoundation.04@gmail.com'].filter((e, i, arr) => arr.indexOf(e) === i);
          console.log('Sending admin email to:', adminRecipients);
          const adminResult = await resend.emails.send({
            from: 'Janya Foundation <noreply@janyafoundation.in>',
            replyTo: email,
            to: adminRecipients,
            subject: `New Prize Claim - ${fullName} (${raceCategoryLabel})`,
            html: adminEmailContent,
          });
          console.log('Admin email result:', adminResult);
          emailStatus.admin = adminResult.data?.id || 'sent';
        } catch (err) {
          console.error('Admin email error:', err);
          emailStatus.errors.push(`Admin email failed: ${err.message}`);
        }
      }
    } catch (emailError) {
      console.error('Email error:', emailError);
      emailStatus.errors.push(`General email error: ${emailError.message}`);
    }

    return NextResponse.json({
      success: true,
      message: 'Prize claim submitted successfully',
      claimId: claimId,
      emailStatus: emailStatus,
    });
  } catch (error) {
    console.error('Prize claim error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
