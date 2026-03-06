import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request) {
  try {
    const { couponCode, phone, email, name, transactionId, amountDiscounted } = await request.json();

    if (!couponCode || !phone || !email) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const code = couponCode.trim().toUpperCase();

    // Record the coupon usage
    const { data, error } = await supabaseAdmin
      .from('coupon_usage')
      .insert({
        coupon_code: code,
        phone: phone,
        email: email,
        name: name || null,
        transaction_id: transactionId || null,
        amount_discounted: amountDiscounted || 100
      })
      .select()
      .single();

    if (error) {
      // Check if it's a duplicate error (coupon already used)
      if (error.code === '23505') {
        return NextResponse.json(
          { success: false, error: 'Coupon already used by this phone number' },
          { status: 200 }
        );
      }
      console.error('Error recording coupon usage:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to record coupon usage' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Coupon usage recorded', data },
      { status: 200 }
    );

  } catch (error) {
    console.error('Coupon record error:', error);
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}
