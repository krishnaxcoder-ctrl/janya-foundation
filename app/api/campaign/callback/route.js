import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  try {
    const body = await request.json();
    console.log('Campaign callback received:', JSON.stringify(body, null, 2));

    const { merchantOrderId, state, paymentDetails } = body;

    if (!merchantOrderId) {
      return NextResponse.json({ success: false, error: 'Missing order ID' }, { status: 400 });
    }

    // Update the donation record if it exists
    const { error } = await supabase
      .from('campaign_donations')
      .update({
        payment_status: state === 'COMPLETED' ? 'SUCCESS' : state,
        payment_id: paymentDetails?.transactionId || null,
      })
      .eq('transaction_id', merchantOrderId);

    if (error) {
      console.error('Error updating donation:', error);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Callback error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
