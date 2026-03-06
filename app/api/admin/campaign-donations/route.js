import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET(request) {
  try {
    // Get all campaign donations
    const { data: donations, error } = await supabase
      .from('campaign_donations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching campaign donations:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    // Calculate stats
    const successfulDonations = donations.filter(d => d.payment_status === 'SUCCESS');
    const totalRaised = successfulDonations.reduce((sum, d) => sum + Number(d.amount || 0), 0);
    const donorCount = successfulDonations.length;

    return NextResponse.json({
      success: true,
      donations: donations || [],
      stats: {
        totalRaised,
        donorCount,
        goal: 500000,
      }
    });

  } catch (error) {
    console.error('Error in campaign donations API:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
