import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// GET - Fetch all races (admin)
export async function GET() {
  try {
    const { data: races, error } = await supabaseAdmin
      .from('races')
      .select('*')
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
    console.error('Admin races API error:', error);
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}

// POST - Create new race
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      id, distance, name, price, description,
      is_run_for_cause, is_kids_run, is_donation, is_test,
      min_age, max_age, is_sold_out, is_active, sort_order, category
    } = body;

    if (!id || !distance || !name || price === undefined) {
      return NextResponse.json(
        { success: false, error: 'ID, distance, name, and price are required' },
        { status: 400 }
      );
    }

    const { data: race, error } = await supabaseAdmin
      .from('races')
      .insert([{
        id: id.toLowerCase().replace(/\s+/g, ''),
        distance,
        name,
        price,
        description: description || null,
        is_run_for_cause: is_run_for_cause || false,
        is_kids_run: is_kids_run || false,
        is_donation: is_donation || false,
        is_test: is_test || false,
        min_age: min_age || 5,
        max_age: max_age || 100,
        is_sold_out: is_sold_out || false,
        is_active: is_active !== undefined ? is_active : true,
        sort_order: sort_order || 0,
        category: category || 'competitive'
      }])
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json(
          { success: false, error: 'Race ID already exists' },
          { status: 400 }
        );
      }
      console.error('Error creating race:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to create race' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      race
    });

  } catch (error) {
    console.error('Admin races POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}

// PUT - Update race
export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Race ID is required' },
        { status: 400 }
      );
    }

    updates.updated_at = new Date().toISOString();

    const { data: race, error } = await supabaseAdmin
      .from('races')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating race:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to update race' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      race
    });

  } catch (error) {
    console.error('Admin races PUT error:', error);
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete race
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Race ID is required' },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from('races')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting race:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to delete race' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true
    });

  } catch (error) {
    console.error('Admin races DELETE error:', error);
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}
