import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET - Fetch all active races (public)
export async function GET() {
  try {
    const { data: races, error } = await supabase
      .from('races')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Error fetching races:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch races' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      races: races || []
    });

  } catch (error) {
    console.error('Races API error:', error);
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}
