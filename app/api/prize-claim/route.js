import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

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
    const uploadFile = async (file, folder) => {
      const fileExtension = file.name.split('.').pop();
      const fileName = `${claimId}_${folder}_${Date.now()}.${fileExtension}`;
      const filePath = `prize-claims/${claimId}/${fileName}`;

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const { data, error } = await supabaseAdmin.storage
        .from('documents')
        .upload(filePath, buffer, {
          contentType: file.type,
          upsert: false,
        });

      if (error) {
        console.error(`Error uploading ${folder}:`, error);
        throw new Error(`Failed to upload ${folder}`);
      }

      // Get public URL
      const { data: urlData } = supabaseAdmin.storage
        .from('documents')
        .getPublicUrl(filePath);

      return urlData.publicUrl;
    };

    // Upload all files
    let ageProofUrl, aadharCardUrl, panCardUrl;

    try {
      ageProofUrl = await uploadFile(ageProofFile, 'age_proof');
      aadharCardUrl = await uploadFile(aadharCardFile, 'aadhar_card');
      panCardUrl = await uploadFile(panCardFile, 'pan_card');
    } catch (uploadError) {
      console.error('File upload error:', uploadError);
      return NextResponse.json(
        { success: false, error: 'Failed to upload documents. Please try again.' },
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

    // Optional: Send confirmation email
    try {
      // You can add Resend email notification here
      // Similar to how marathon registration emails are sent
    } catch (emailError) {
      console.error('Email error:', emailError);
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
