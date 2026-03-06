import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request) {
  try {
    const { couponCode } = await request.json();

    if (!couponCode) {
      return NextResponse.json(
        { valid: false, error: 'Coupon code is required' },
        { status: 400 }
      );
    }

    const code = couponCode.trim().toUpperCase();

    // Check if Supabase client is initialized
    if (!supabase) {
      console.error('Supabase client is not initialized');
      return NextResponse.json(
        { valid: false, error: 'Database connection not configured' },
        { status: 500 }
      );
    }

    // Fetch coupon from database
    const { data: coupon, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', code)
      .eq('is_active', true)
      .single();

    if (error || !coupon) {
      return NextResponse.json(
        { valid: false, error: 'Invalid coupon code' },
        { status: 200 }
      );
    }

    // Check if coupon has expired
    if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
      return NextResponse.json(
        { valid: false, error: 'This coupon has expired' },
        { status: 200 }
      );
    }

    // Check if coupon has reached max uses
    if (coupon.max_uses && coupon.uses_count >= coupon.max_uses) {
      return NextResponse.json(
        { valid: false, error: 'This coupon has reached its usage limit' },
        { status: 200 }
      );
    }

    // Return coupon based on type
    if (coupon.type === 'percent') {
      return NextResponse.json(
        {
          valid: true,
          discountType: 'percent',
          percent: parseFloat(coupon.percent),
          competitiveOnly: coupon.competitive_only || false,
          validRaceIds: coupon.valid_race_ids || null,
          message: `Coupon applied successfully! You get ${coupon.percent}% off`
        },
        { status: 200 }
      );
    }

    if (coupon.type === 'raceFixed') {
      const discountByRace = coupon.discount_by_race;
      const discountSummary = Object.entries(discountByRace)
        .map(([race, amt]) => `${race.toUpperCase()}: ₹${amt}`)
        .join(', ');

      return NextResponse.json(
        {
          valid: true,
          discountType: 'raceFixed',
          discountByRace: discountByRace,
          validRaceIds: coupon.valid_race_ids || null,
          message: `Coupon applied! ${discountSummary}`
        },
        { status: 200 }
      );
    }

    // Race Final Price type - sets the base price to a fixed amount (convenience fee calculated on new price)
    if (coupon.type === 'raceFinalPrice') {
      const finalPriceByRace = coupon.final_price_by_race;
      const priceSummary = Object.entries(finalPriceByRace)
        .map(([race, price]) => `${race.toUpperCase()}: ₹${price}`)
        .join(', ');

      return NextResponse.json(
        {
          valid: true,
          discountType: 'raceFinalPrice',
          finalPriceByRace: finalPriceByRace,
          competitiveOnly: coupon.competitive_only || false,
          validRaceIds: coupon.valid_race_ids || null,
          message: `Special pricing applied! ${priceSummary} + 3% convenience fee`
        },
        { status: 200 }
      );
    }

    // Fixed type coupon
    return NextResponse.json(
      {
        valid: true,
        discountType: 'fixed',
        discount: coupon.amount,
        competitiveOnly: coupon.competitive_only || false,
        validRaceIds: coupon.valid_race_ids || null,
        message: `Coupon applied successfully! You save ₹${coupon.amount}`
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Coupon check error:', error);
    return NextResponse.json(
      { valid: false, error: 'Server error' },
      { status: 500 }
    );
  }
}
