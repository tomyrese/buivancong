import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: Request) {
  try {
    const supabaseUrl = 
      process.env.NEXT_PUBLIC_SUPABASE_URL || 
      process.env.SUPABASE_URL || 
      'https://placeholder-project.supabase.co';

    const supabaseServiceKey = 
      process.env.SUPABASE_SECRET_KEY || 
      'placeholder-key';

    const isSupabaseConfigured = 
      supabaseUrl && 
      supabaseServiceKey && 
      !supabaseUrl.includes('placeholder') && 
      !supabaseServiceKey.includes('placeholder');

    if (!isSupabaseConfigured) {
      // Return mock registrations for local/offline testing
      return NextResponse.json({
        registrations: [
          {
            userId: 'u-mock-1',
            name: 'Nguyễn Văn Minh',
            email: 'minh.nguyen@gmail.com',
            phone: '0987654321',
            purchasedPackages: ['combo-toan-logic'],
            enrolledCourses: ['math-10', 'math-11', 'math-12'],
            createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
          },
          {
            userId: 'u-mock-2',
            name: 'Trần Thị Mai',
            email: 'mai.tran@gmail.com',
            phone: '0912345678',
            purchasedPackages: ['combo-toan-dien'],
            enrolledCourses: [
              'math-10', 'math-11', 'math-12',
              'physics-12', 'biology-12', 'chemistry-12', 'geography-12', 'history-12', 'economy-law-12'
            ],
            createdAt: new Date(Date.now() - 86400000 * 5).toISOString()
          }
        ]
      });
    }

    const adminSupabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Fetch all users from Supabase Auth admin API
    const { data: { users }, error } = await adminSupabase.auth.admin.listUsers();
    if (error) throw error;

    // Filter out users who have purchased packages
    const registrations = users
      .filter((u) => u.user_metadata?.purchased_packages && u.user_metadata.purchased_packages.length > 0)
      .map((u) => ({
        userId: u.id,
        name: u.user_metadata?.name || 'Học Viên',
        email: u.email || '',
        phone: u.user_metadata?.phone || 'Chưa cập nhật',
        purchasedPackages: u.user_metadata?.purchased_packages || [],
        enrolledCourses: u.user_metadata?.enrolled_courses || [],
        createdAt: u.created_at
      }));

    return NextResponse.json({ registrations });
  } catch (error: any) {
    console.error('Error fetching registrations:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    if (!userId) {
      return NextResponse.json({ error: 'Missing userId parameter' }, { status: 400 });
    }

    const supabaseUrl = 
      process.env.NEXT_PUBLIC_SUPABASE_URL || 
      process.env.SUPABASE_URL || 
      'https://placeholder-project.supabase.co';

    const supabaseServiceKey = 
      process.env.SUPABASE_SECRET_KEY || 
      'placeholder-key';

    const isSupabaseConfigured = 
      supabaseUrl && 
      supabaseServiceKey && 
      !supabaseUrl.includes('placeholder') && 
      !supabaseServiceKey.includes('placeholder');

    if (!isSupabaseConfigured) {
      return NextResponse.json({ success: true, message: 'Mock registration cleared' });
    }

    const adminSupabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Reset user's purchased packages and enrolled courses
    // First, fetch the current metadata to avoid unsetting name, phone, etc.
    const { data: { user }, error: getError } = await adminSupabase.auth.admin.getUserById(userId);
    if (getError) throw getError;

    const currentMetadata = user?.user_metadata || {};

    const { error: updateError } = await adminSupabase.auth.admin.updateUserById(userId, {
      user_metadata: {
        ...currentMetadata,
        purchased_packages: [],
        enrolled_courses: []
      }
    });

    if (updateError) throw updateError;

    return NextResponse.json({ success: true, message: 'Registration cleared successfully' });
  } catch (error: any) {
    console.error('Error deleting registration:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
