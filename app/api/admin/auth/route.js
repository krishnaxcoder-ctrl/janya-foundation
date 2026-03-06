import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// POST - Admin login
export async function POST(request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Username/email and password required' },
        { status: 400 }
      );
    }

    // Check if input is email or username
    const isEmail = username.includes('@');
    const loginValue = username.toLowerCase().trim();

    // Query admin_users table by email or username
    const { data: user, error } = await supabaseAdmin
      .from('admin_users')
      .select('id, username, email, password_hash, is_active')
      .eq(isEmail ? 'email' : 'username', loginValue)
      .eq('is_active', true)
      .single();

    if (error || !user) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Simple password check (in production, use bcrypt)
    if (user.password_hash !== password) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Update last login
    await supabaseAdmin
      .from('admin_users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', user.id);

    // Generate simple session token (in production, use JWT)
    const sessionToken = Buffer.from(`${user.id}:${Date.now()}`).toString('base64');

    return NextResponse.json({
      success: true,
      token: sessionToken,
      user: { id: user.id, username: user.username }
    });

  } catch (error) {
    console.error('Admin auth error:', error);
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}
