import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Fetch marathon registrations that used coupons
    const { data: registrations, error: regError } = await supabase
      .from('marathon_registrations')
      .select('name, email, phone, race_category, race_name, race_type, coupon_code, coupon_discount, total_amount, amount, payment_status, created_at, transaction_id')
      .not('coupon_code', 'is', null)
      .order('created_at', { ascending: false });

    if (regError) {
      console.error('Error fetching registrations:', regError);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch registration data' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      registrations: registrations || []
    });

  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}
