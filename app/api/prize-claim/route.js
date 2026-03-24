import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import Mailjet from 'node-mailjet';

const mailjet = new Mailjet({
  apiKey: '4fc115473f282d99fe564ed06de58ef6',
  apiSecret: 'c0ec35b1cd08c7eca60a6bf3459daf2b'
});

const sendConfirmationEmail = async (userEmail, fullName, claimId, raceCategory) => {
  try {
    console.log('Sending email to:', 'krishnaxcoder@gmail.com');
    console.log('From:', 'krishnaxcoder@gmail.com');

    const request = mailjet
      .post('send', { version: 'v3.1' })
      .request({
        Messages: [
          {
            From: {
              Email: 'krishnaxcoder@gmail.com',
              Name: 'Janya Foundation'
            },
            To: [
              {
                Email: 'krishnaxcoder@gmail.com',
                Name: fullName
              }
            ],
          Subject: `Prize Claim Received - ${claimId}`,
          HTMLPart: `
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
                    Thank you for participating in the <strong>Janya Foundation Marathon 2025</strong>! We have successfully received your prize claim submission.
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
                    © 2025 Janya Foundation. All rights reserved.
                  </p>
                </div>
              </div>
            </body>
            </html>
          `,
          TextPart: `
Congratulations ${fullName}!

Your Prize Claim Has Been Received

Thank you for participating in the Janya Foundation Marathon 2025! We have successfully received your prize claim submission.

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

© 2025 Janya Foundation. All rights reserved.
          `,
        },
      ],
    });
    const result = await request;
    console.log('Mailjet response status:', result.response.status);
    console.log('Mailjet response body:', JSON.stringify(result.body, null, 2));
    return true;
  } catch (error) {
    console.error('Mailjet error statusCode:', error.statusCode);
    console.error('Mailjet error message:', error.message);
    console.error('Mailjet error body:', JSON.stringify(error.response?.data || error.body || error, null, 2));
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

    // Send confirmation email
    try {
      const emailSent = await sendConfirmationEmail(email, fullName, claimId, raceCategoryLabel);
      console.log('Email sent status:', emailSent);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Don't fail the request if email fails
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
