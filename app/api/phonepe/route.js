import { NextResponse } from 'next/server';

// UAT/Sandbox URLs
const BASE_URL_UAT = 'https://api-preprod.phonepe.com/apis/pg-sandbox';
const AUTH_URL_UAT = 'https://api-preprod.phonepe.com/apis/pg-sandbox';

// Production URLs
const BASE_URL_PROD = 'https://api.phonepe.com/apis/pg';
const AUTH_URL_PROD = 'https://api.phonepe.com/apis/identity-manager';

// Get OAuth access token from PhonePe with retry logic
async function getAccessToken(clientId, clientSecret, clientVersion, authUrl, retries = 3) {
  console.log('Requesting OAuth token from:', `${authUrl}/v1/oauth/token`);

  let lastError;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(`${authUrl}/v1/oauth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: clientId,
          client_version: clientVersion,
          client_secret: clientSecret,
          grant_type: 'client_credentials',
        }),
      });

      const responseText = await response.text();
      console.log('OAuth Response Status:', response.status);
      console.log('OAuth Response:', responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        throw new Error(`Invalid OAuth response: ${responseText}`);
      }

      if (data.access_token) {
        return data.access_token;
      }

      throw new Error(data.message || data.error?.message || 'Failed to get access token');
    } catch (error) {
      lastError = error;
      console.log(`OAuth attempt ${attempt}/${retries} failed:`, error.message);

      // If it's a network error (fetch failed), wait and retry
      if (attempt < retries && (error.message.includes('fetch failed') || error.cause?.code === 'ENOTFOUND' || error.cause?.code === 'ECONNRESET')) {
        console.log(`Retrying in ${attempt * 500}ms...`);
        await new Promise(resolve => setTimeout(resolve, attempt * 500));
        continue;
      }

      throw error;
    }
  }

  throw lastError;
}

export async function POST(request) {
  try {
    const { amount, notes = {} } = await request.json();

    // Validate amount (minimum ₹10)
    if (!amount || amount < 10) {
      return NextResponse.json(
        { error: 'Minimum donation amount is ₹10' },
        { status: 400 }
      );
    }

    const clientId = process.env.PHONEPE_CLIENT_ID;
    const clientSecret = process.env.PHONEPE_CLIENT_SECRET;
    const clientVersion = process.env.PHONEPE_CLIENT_VERSION || '1';
    const env = process.env.PHONEPE_ENV || 'UAT';

    if (!clientId || !clientSecret) {
      console.error('Missing PhonePe credentials');
      return NextResponse.json(
        { error: 'Payment gateway not configured' },
        { status: 500 }
      );
    }

    // PhonePe API URLs
    const baseUrl = env === 'PRODUCTION' ? BASE_URL_PROD : BASE_URL_UAT;
    const authUrl = env === 'PRODUCTION' ? AUTH_URL_PROD : AUTH_URL_UAT;

    console.log('Environment:', env);
    console.log('Base URL:', baseUrl);
    console.log('Auth URL:', authUrl);
    console.log('Client ID:', clientId);

    // Step 1: Get OAuth access token
    console.log('Getting OAuth token...');
    let accessToken;
    try {
      accessToken = await getAccessToken(clientId, clientSecret, clientVersion, authUrl);
      console.log('Access token obtained successfully');
    } catch (tokenError) {
      console.error('Token error:', tokenError.message);
      return NextResponse.json(
        { error: 'Authentication failed: ' + tokenError.message },
        { status: 500 }
      );
    }

    const merchantOrderId = `JANYA${Date.now()}`;
    const baseAppUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const redirectUrl = `${baseAppUrl}/donation-success?transactionId=${merchantOrderId}`;
    const callbackUrl = `${baseAppUrl}/api/phonepe/callback`;

    // Step 2: Create payment request
    const payload = {
      merchantOrderId: merchantOrderId,
      amount: amount * 100, // Convert to paise
      expireAfter: 1200, // 20 minutes
      metaInfo: {
        udf1: notes.donor_name || '',
        udf2: notes.donor_email || '',
        udf3: notes.donor_phone || '',
        udf4: notes.pan_number || '',
        udf5: notes.donation_type || 'once'
      },
      paymentFlow: {
        type: 'PG_CHECKOUT',
        message: `Donation to Janya Foundation - Rs ${amount}`,
        merchantUrls: {
          redirectUrl: redirectUrl,
          callbackUrl: callbackUrl
        }
      }
    };

    console.log('Payment Request URL:', `${baseUrl}/checkout/v2/pay`);
    console.log('Payment Payload:', JSON.stringify(payload, null, 2));

    // Payment request with retry logic
    let response;
    let responseText;
    const maxRetries = 3;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        response = await fetch(`${baseUrl}/checkout/v2/pay`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `O-Bearer ${accessToken}`,
          },
          body: JSON.stringify(payload)
        });

        responseText = await response.text();
        console.log('Payment Response Status:', response.status);
        console.log('Payment Response:', responseText);
        break; // Success, exit retry loop
      } catch (fetchError) {
        console.log(`Payment request attempt ${attempt}/${maxRetries} failed:`, fetchError.message);

        if (attempt < maxRetries && (fetchError.message.includes('fetch failed') || fetchError.cause?.code === 'ENOTFOUND' || fetchError.cause?.code === 'ECONNRESET')) {
          console.log(`Retrying payment request in ${attempt * 500}ms...`);
          await new Promise(resolve => setTimeout(resolve, attempt * 500));
          continue;
        }

        throw fetchError;
      }
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse PhonePe response:', responseText);
      return NextResponse.json(
        { error: 'Invalid response from PhonePe' },
        { status: 500 }
      );
    }

    // Check for redirect URL in various response formats
    const checkoutUrl = data.redirectUrl || data.checkoutPageUrl || data.data?.redirectUrl || data.data?.checkoutPageUrl;

    if (checkoutUrl) {
      return NextResponse.json({
        success: true,
        redirectUrl: checkoutUrl,
        transactionId: merchantOrderId,
        orderId: data.orderId || data.data?.orderId,
      });
    }

    // Error handling
    console.error('PhonePe API Error:', JSON.stringify(data, null, 2));
    return NextResponse.json(
      {
        success: false,
        error: data.message || data.error?.message || 'Failed to initiate payment',
        code: data.code || data.error?.code,
        details: data
      },
      { status: 400 }
    );

  } catch (error) {
    console.error('Error creating PhonePe payment:', error);
    return NextResponse.json(
      { error: 'Failed to create payment order: ' + error.message },
      { status: 500 }
    );
  }
}
