import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const campaignId = searchParams.get('campaign') || 'hpv-vaccination';

    // Get total raised and donor count (include donations without campaign_id for backward compatibility)
    const { data: stats, error: statsError } = await supabase
      .from('campaign_donations')
      .select('amount')
      .eq('payment_status', 'SUCCESS');

    if (statsError) {
      console.error('Stats error:', statsError);
      return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
    }

    const totalRaised = stats.reduce((sum, d) => sum + Number(d.amount), 0);
    const donorCount = stats.length;

    // Get recent donations (last 10)
    const { data: recentDonations, error: recentError } = await supabase
      .from('campaign_donations')
      .select('id, display_name, amount, message, created_at, is_anonymous')
      .eq('payment_status', 'SUCCESS')
      .order('created_at', { ascending: false })
      .limit(10);

    if (recentError) {
      console.error('Recent donations error:', recentError);
    }

    // Campaign goal
    const goal = 500000;
    const progressPercent = Math.min((totalRaised / goal) * 100, 100);

    return NextResponse.json({
      success: true,
      campaign: {
        id: campaignId,
        name: 'HPV Vaccination Campaign',
        goal,
        totalRaised,
        donorCount,
        progressPercent: Math.round(progressPercent * 100) / 100,
      },
      recentDonations: recentDonations || [],
    });

  } catch (error) {
    console.error('Campaign stats error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
