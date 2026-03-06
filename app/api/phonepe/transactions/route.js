import { NextResponse } from 'next/server';

// UAT/Sandbox URLs
const BASE_URL_UAT = 'https://api-preprod.phonepe.com/apis/pg-sandbox';
const AUTH_URL_UAT = 'https://api-preprod.phonepe.com/apis/pg-sandbox';

// Production URLs
const BASE_URL_PROD = 'https://api.phonepe.com/apis/pg';
const AUTH_URL_PROD = 'https://api.phonepe.com/apis/identity-manager';

// Get OAuth access token from PhonePe
async function getAccessToken(clientId, clientSecret, clientVersion, authUrl) {
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

  const data = await response.json();

  if (data.access_token) {
    return data.access_token;
  }

  throw new Error(data.message || 'Failed to get access token');
}

export async function POST(request) {
  try {
    const { transactionIds } = await request.json();

    if (!transactionIds || !Array.isArray(transactionIds) || transactionIds.length === 0) {
      return NextResponse.json(
        { error: 'transactionIds array is required' },
        { status: 400 }
      );
    }

    // Limit to prevent abuse
    if (transactionIds.length > 50) {
      return NextResponse.json(
        { error: 'Maximum 50 transactions per request' },
        { status: 400 }
      );
    }

    const clientId = process.env.PHONEPE_CLIENT_ID;
    const clientSecret = process.env.PHONEPE_CLIENT_SECRET;
    const clientVersion = process.env.PHONEPE_CLIENT_VERSION || '1';
    const env = process.env.PHONEPE_ENV || 'UAT';

    if (!clientId || !clientSecret) {
      return NextResponse.json(
        { error: 'PhonePe credentials not configured' },
        { status: 500 }
      );
    }

    const baseUrl = env === 'PRODUCTION' ? BASE_URL_PROD : BASE_URL_UAT;
    const authUrl = env === 'PRODUCTION' ? AUTH_URL_PROD : AUTH_URL_UAT;

    // Get OAuth token
    const accessToken = await getAccessToken(clientId, clientSecret, clientVersion, authUrl);

    // Fetch status for each transaction in parallel
    const results = await Promise.allSettled(
      transactionIds.map(async (txnId) => {
        const id = txnId.trim();
        // Use details=true to get full payment attempts, errorContext=true for error info
        const statusUrl = `${baseUrl}/checkout/v2/order/${id}/status?details=true&errorContext=true`;
        console.log('Fetching PhonePe status:', statusUrl);

        const response = await fetch(statusUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `O-Bearer ${accessToken}`,
          },
        });

        const responseText = await response.text();
        console.log(`PhonePe response for ${id}:`, responseText);

        let data;
        try {
          data = JSON.parse(responseText);
        } catch (e) {
          throw new Error(`Invalid response from PhonePe: ${responseText.substring(0, 200)}`);
        }

        // PhonePe may wrap response in a 'data' object in some versions
        const orderData = data.data || data;

        // Map metaInfo UDF fields to readable labels
        const metaInfo = orderData.metaInfo || {};
        const isDonation = id.startsWith('JANYA');
        const customFields = isDonation
          ? {
              name: metaInfo.udf1 || null,
              email: metaInfo.udf2 || null,
              phone: metaInfo.udf3 || null,
              pan_number: metaInfo.udf4 || null,
              donation_type: metaInfo.udf5 || null,
            }
          : {
              name: metaInfo.udf1 || null,
              email: metaInfo.udf2 || null,
              phone: metaInfo.udf3 || null,
              race_category: metaInfo.udf4 || null,
              race_type: metaInfo.udf5 || null,
              gender: metaInfo.udf6 || null,
              date_of_birth: metaInfo.udf7 || null,
              tshirt_size: metaInfo.udf8 || null,
              address: metaInfo.udf9 || null,
              emergency_phone: metaInfo.udf10 || null,
              coupon_code: metaInfo.udf11 || null,
              coupon_discount: metaInfo.udf12 || null,
              convenience_fee: metaInfo.udf13 || null,
              is_run_for_cause: metaInfo.udf14 || null,
              is_donation: metaInfo.udf15 || null,
            };

        return {
          transactionId: id,
          orderId: orderData.orderId || null,
          state: orderData.state || 'UNKNOWN',
          amount: orderData.amount ? orderData.amount / 100 : null,
          paymentDetails: orderData.paymentDetails || [],
          expireAt: orderData.expireAt || null,
          metaInfo: metaInfo,
          customFields: customFields,
          errorCode: orderData.errorCode || null,
          errorMessage: orderData.errorMessage || null,
          // Include raw response for debugging on frontend
          _raw: orderData,
        };
      })
    );

    const transactions = results.map((result, i) => {
      if (result.status === 'fulfilled') {
        return result.value;
      }
      return {
        transactionId: transactionIds[i].trim(),
        state: 'ERROR',
        amount: null,
        errorMessage: result.reason?.message || 'Failed to fetch status',
      };
    });

    return NextResponse.json({ success: true, transactions });
  } catch (error) {
    console.error('Error fetching PhonePe transactions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transactions: ' + error.message },
      { status: 500 }
    );
  }
}
