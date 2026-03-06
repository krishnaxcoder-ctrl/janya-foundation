import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// PhonePe URLs
const BASE_URL_UAT = 'https://api-preprod.phonepe.com/apis/pg-sandbox';
const AUTH_URL_UAT = 'https://api-preprod.phonepe.com/apis/pg-sandbox';
const BASE_URL_PROD = 'https://api.phonepe.com/apis/pg';
const AUTH_URL_PROD = 'https://api.phonepe.com/apis/identity-manager';

async function getAccessToken(clientId, clientSecret, clientVersion, authUrl) {
  const response = await fetch(`${authUrl}/v1/oauth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_version: clientVersion,
      client_secret: clientSecret,
      grant_type: 'client_credentials',
    }),
  });

  const data = await response.json();
  if (data.access_token) return data.access_token;
  throw new Error(data.message || 'Failed to get access token');
}

export async function POST(request) {
  try {
    const {
      transactionId,
      donor_name,
      donor_email,
      donor_phone,
      address,
      pincode,
      city,
      state: donor_state,
      country,
      pan_number,
      is_anonymous,
      message
    } = await request.json();

    if (!transactionId) {
      return NextResponse.json({ error: 'Transaction ID is required' }, { status: 400 });
    }

    const clientId = process.env.PHONEPE_CLIENT_ID;
    const clientSecret = process.env.PHONEPE_CLIENT_SECRET;
    const clientVersion = process.env.PHONEPE_CLIENT_VERSION || '1';
    const env = process.env.PHONEPE_ENV || 'UAT';

    const baseUrl = env === 'PRODUCTION' ? BASE_URL_PROD : BASE_URL_UAT;
    const authUrl = env === 'PRODUCTION' ? AUTH_URL_PROD : AUTH_URL_UAT;

    const accessToken = await getAccessToken(clientId, clientSecret, clientVersion, authUrl);

    // Check payment status with PhonePe
    const statusResponse = await fetch(`${baseUrl}/checkout/v2/order/${transactionId}/status`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `O-Bearer ${accessToken}`,
      },
    });

    const statusData = await statusResponse.json();
    console.log('Payment status:', JSON.stringify(statusData, null, 2));

    const state = statusData.state || statusData.data?.state;
    const amount = (statusData.amount || statusData.data?.amount || 0) / 100;
    const paymentId = statusData.paymentDetails?.[0]?.transactionId || statusData.orderId;

    // Check if donation already exists
    const { data: existingDonation } = await supabase
      .from('campaign_donations')
      .select('id, payment_status')
      .eq('transaction_id', transactionId)
      .single();

    if (existingDonation) {
      // Update existing record if payment completed
      if (existingDonation.payment_status !== 'SUCCESS' && state === 'COMPLETED') {
        await supabase
          .from('campaign_donations')
          .update({
            payment_status: 'SUCCESS',
            payment_id: paymentId,
          })
          .eq('transaction_id', transactionId);
      }

      return NextResponse.json({
        success: state === 'COMPLETED',
        status: state === 'COMPLETED' ? 'SUCCESS' : state,
        amount,
        transactionId,
        alreadyRecorded: true,
      });
    }

    // Fallback: Create new donation record if it doesn't exist (shouldn't happen normally)
    if (state === 'COMPLETED' && donor_name && donor_email && donor_phone) {
      const { error: insertError } = await supabase
        .from('campaign_donations')
        .insert({
          donor_name,
          donor_email,
          donor_phone,
          address: address || null,
          pincode: pincode || null,
          city: city || null,
          state: donor_state || null,
          country: country || 'INDIA',
          pan_number: pan_number || null,
          amount,
          transaction_id: transactionId,
          payment_id: paymentId,
          payment_status: 'SUCCESS',
          campaign_id: 'hpv-vaccination',
          is_anonymous: is_anonymous || false,
          display_name: is_anonymous ? 'Anonymous' : donor_name,
          message: message || null,
        });

      if (insertError) {
        console.error('Error saving donation:', insertError);
      }
    }

    return NextResponse.json({
      success: state === 'COMPLETED',
      status: state === 'COMPLETED' ? 'SUCCESS' : state,
      amount,
      transactionId,
      paymentId,
    });

  } catch (error) {
    console.error('Status check error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
