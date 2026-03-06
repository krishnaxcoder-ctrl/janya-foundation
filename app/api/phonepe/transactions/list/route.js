import { NextResponse } from 'next/server';
import crypto from 'crypto';

// Comprehensive Transaction Recon API endpoints
const RECON_URL_UAT = 'https://mercury-uat.phonepe.com/enterprise-sandbox/v1/transactions/details';
const RECON_URL_PROD = 'https://mercury-t2.phonepe.com/v1/transactions/details';
const RECON_PATH = '/v1/transactions/details';

// OAuth endpoints (for fetching metaInfo via order status)
const BASE_URL_UAT = 'https://api-preprod.phonepe.com/apis/pg-sandbox';
const AUTH_URL_UAT = 'https://api-preprod.phonepe.com/apis/pg-sandbox';
const BASE_URL_PROD = 'https://api.phonepe.com/apis/pg';
const AUTH_URL_PROD = 'https://api.phonepe.com/apis/identity-manager';

// Generate X-VERIFY header for Recon API
function generateXVerify(payload, saltKey, saltIndex) {
  const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64');
  const hashInput = base64Payload + RECON_PATH + saltKey;
  const hash = crypto.createHash('sha256').update(hashInput).digest('hex');
  return { xVerify: hash + '###' + saltIndex, base64Payload };
}

// Get OAuth access token for order status API
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
    const body = await request.json();
    const { startDate, endDate, pageSize = 25, searchAfter, fetchMetaInfo = false } = body;

    const merchantId = process.env.PHONEPE_MERCHANT_ID;
    const saltKey = process.env.PHONEPE_SALT_KEY;
    const saltIndex = process.env.PHONEPE_SALT_INDEX || '1';
    const env = process.env.PHONEPE_ENV || 'UAT';

    if (!merchantId || !saltKey) {
      return NextResponse.json(
        { error: 'PHONEPE_MERCHANT_ID and PHONEPE_SALT_KEY are required in .env' },
        { status: 500 }
      );
    }

    // Calculate timestamps (epoch seconds)
    const now = Math.floor(Date.now() / 1000);
    const startTimestamp = startDate
      ? Math.floor(new Date(startDate).getTime() / 1000)
      : now - 30 * 24 * 60 * 60; // default: last 30 days
    const endTimestamp = endDate
      ? Math.floor(new Date(endDate).getTime() / 1000)
      : now;

    // Build Recon API payload
    const payload = {
      merchantId,
      size: Math.min(pageSize, 50),
      startTimestamp,
      endTimestamp,
    };

    if (searchAfter && searchAfter.timestamp && searchAfter.transactionId) {
      payload.searchAfter = searchAfter;
    }

    const { xVerify, base64Payload } = generateXVerify(payload, saltKey, saltIndex);
    const reconUrl = env === 'PRODUCTION' ? RECON_URL_PROD : RECON_URL_UAT;

    console.log('Recon API URL:', reconUrl);
    console.log('Recon payload:', JSON.stringify(payload));

    const reconResponse = await fetch(reconUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-VERIFY': xVerify,
      },
      body: JSON.stringify(payload),
    });

    const reconText = await reconResponse.text();
    console.log('Recon API response:', reconText);

    let reconData;
    try {
      reconData = JSON.parse(reconText);
    } catch (e) {
      return NextResponse.json(
        { error: 'Invalid response from PhonePe Recon API: ' + reconText.substring(0, 300) },
        { status: 500 }
      );
    }

    if (!reconData.success && !reconData.data) {
      return NextResponse.json(
        { error: reconData.message || 'Failed to fetch transactions from PhonePe', raw: reconData },
        { status: 400 }
      );
    }

    const txnDetails = reconData.data?.transactionDetails || [];
    const nextSearchAfter = reconData.data?.searchAfter || null;
    const totalResult = reconData.data?.totalResult || 0;

    // Map transactions to a clean format
    let transactions = txnDetails.map((txn) => ({
      transactionId: txn.transactionId || null,
      merchantOrderId: txn.merchantOrderId || null,
      amount: txn.amount ? txn.amount / 100 : null,
      state: txn.paymentState || 'UNKNOWN',
      responseCode: txn.payResponseCode || null,
      transactionDate: txn.transactionDate || null,
      merchantId: txn.merchantId || null,
      settlement: txn.transactionLevelSettlement || null,
      refunds: txn.refundTransactionDetails || [],
      // These will be populated if fetchMetaInfo is true
      metaInfo: null,
      customFields: null,
      paymentDetails: null,
    }));

    // Optionally fetch metaInfo for each transaction via Order Status API
    if (fetchMetaInfo && transactions.length > 0) {
      const clientId = process.env.PHONEPE_CLIENT_ID;
      const clientSecret = process.env.PHONEPE_CLIENT_SECRET;
      const clientVersion = process.env.PHONEPE_CLIENT_VERSION || '1';

      if (clientId && clientSecret) {
        const baseUrl = env === 'PRODUCTION' ? BASE_URL_PROD : BASE_URL_UAT;
        const authUrl = env === 'PRODUCTION' ? AUTH_URL_PROD : AUTH_URL_UAT;

        try {
          const accessToken = await getAccessToken(clientId, clientSecret, clientVersion, authUrl);

          const statusResults = await Promise.allSettled(
            transactions.map(async (txn) => {
              const orderId = txn.merchantOrderId;
              if (!orderId) return null;

              const res = await fetch(
                `${baseUrl}/checkout/v2/order/${orderId}/status?details=true&errorContext=true`,
                {
                  method: 'GET',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `O-Bearer ${accessToken}`,
                  },
                }
              );
              const data = await res.json();
              const orderData = data.data || data;
              return {
                orderId,
                metaInfo: orderData.metaInfo || null,
                paymentDetails: orderData.paymentDetails || null,
              };
            })
          );

          // Merge metaInfo into transactions
          statusResults.forEach((result, i) => {
            if (result.status === 'fulfilled' && result.value) {
              const metaInfo = result.value.metaInfo || {};
              transactions[i].metaInfo = metaInfo;
              transactions[i].paymentDetails = result.value.paymentDetails;

              // Map UDF fields
              const id = transactions[i].merchantOrderId || '';
              const isDonation = id.startsWith('JANYA');
              transactions[i].customFields = isDonation
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
            }
          });
        } catch (oauthErr) {
          console.error('Failed to fetch metaInfo via OAuth:', oauthErr.message);
        }
      }
    }

    return NextResponse.json({
      success: true,
      transactions,
      totalResult,
      searchAfter: nextSearchAfter,
    });
  } catch (error) {
    console.error('Error in transaction list API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transactions: ' + error.message },
      { status: 500 }
    );
  }
}
