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
