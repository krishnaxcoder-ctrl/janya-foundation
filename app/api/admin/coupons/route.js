import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// GET - Fetch all coupons (admin)
export async function GET() {
  try {
    const { data: coupons, error } = await supabaseAdmin
      .from('coupons')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching coupons:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch coupons' },
        { status: 500 }
      );
    }

    // Get usage counts from marathon_registrations (successful payments with coupon)
    const { data: registrations, error: regError } = await supabaseAdmin
      .from('marathon_registrations')
      .select('coupon_code')
      .eq('payment_status', 'SUCCESS')
      .not('coupon_code', 'is', null);

    if (regError) {
      console.error('Error fetching registration coupon usage:', regError);
    }

    // Count usages per coupon code
    const usageMap = {};
    if (registrations) {
      registrations.forEach(reg => {
        const code = reg.coupon_code?.toUpperCase();
        if (code) {
          usageMap[code] = (usageMap[code] || 0) + 1;
        }
      });
    }

    // Add uses_count to each coupon
    const couponsWithUsage = (coupons || []).map(coupon => ({
      ...coupon,
      uses_count: usageMap[coupon.code?.toUpperCase()] || 0
    }));

    return NextResponse.json({
      success: true,
      coupons: couponsWithUsage
    });

  } catch (error) {
    console.error('Admin coupons API error:', error);
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}

// POST - Create new coupon
export async function POST(request) {
  try {
    const body = await request.json();
    const { code, type, amount, percent, discount_by_race, final_price_by_race, competitive_only, valid_race_ids, max_uses, expires_at, is_active } = body;

    if (!code || !type) {
      return NextResponse.json(
        { success: false, error: 'Code and type are required' },
        { status: 400 }
      );
    }

    // Validate type-specific fields
    if (type === 'fixed' && !amount) {
      return NextResponse.json(
        { success: false, error: 'Amount is required for fixed type coupons' },
        { status: 400 }
      );
    }
    if (type === 'percent' && !percent) {
      return NextResponse.json(
        { success: false, error: 'Percent is required for percent type coupons' },
        { status: 400 }
      );
    }
    if (type === 'raceFixed' && !discount_by_race) {
      return NextResponse.json(
        { success: false, error: 'Discount by race is required for raceFixed type coupons' },
        { status: 400 }
      );
    }
    if (type === 'raceFinalPrice' && !final_price_by_race) {
      return NextResponse.json(
        { success: false, error: 'Final price by race is required for raceFinalPrice type coupons' },
        { status: 400 }
      );
    }

    const { data: coupon, error } = await supabaseAdmin
      .from('coupons')
      .insert([{
        code: code.toUpperCase(),
        type,
        amount: type === 'fixed' ? amount : null,
        percent: type === 'percent' ? percent : null,
        discount_by_race: type === 'raceFixed' ? discount_by_race : null,
        final_price_by_race: type === 'raceFinalPrice' ? final_price_by_race : null,
        competitive_only: competitive_only || false,
        valid_race_ids: valid_race_ids || null,
        max_uses: max_uses || null,
        expires_at: expires_at || null,
        is_active: is_active !== undefined ? is_active : true
      }])
      .select()
      .single();

    if (error) {
      if (error.code === '23505') { // Unique constraint violation
        return NextResponse.json(
          { success: false, error: 'Coupon code already exists' },
          { status: 400 }
        );
      }
      console.error('Error creating coupon:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to create coupon' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      coupon
    });

  } catch (error) {
    console.error('Admin coupons POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}

// PUT - Update coupon
export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Coupon ID is required' },
        { status: 400 }
      );
    }

    // Uppercase code if provided
    if (updates.code) {
      updates.code = updates.code.toUpperCase();
    }

    updates.updated_at = new Date().toISOString();

    const { data: coupon, error } = await supabaseAdmin
      .from('coupons')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating coupon:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to update coupon' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      coupon
    });

  } catch (error) {
    console.error('Admin coupons PUT error:', error);
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete coupon
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Coupon ID is required' },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from('coupons')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting coupon:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to delete coupon' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true
    });

  } catch (error) {
    console.error('Admin coupons DELETE error:', error);
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}
