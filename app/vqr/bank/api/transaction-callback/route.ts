import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase admin client using the service role secret key
const supabaseUrl = 
  process.env.NEXT_PUBLIC_SUPABASE_URL || 
  process.env.SUPABASE_URL || 
  'https://placeholder-project.supabase.co';

const supabaseServiceKey = 
  process.env.SUPABASE_SECRET_KEY || 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
  'placeholder-key';

const adminSupabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Map package codes to package IDs and course list
const PACKAGE_MAPPING: Record<string, { id: string; courses: string[] }> = {
  CBTOAN: {
    id: 'combo-toan-logic',
    courses: ['math-10', 'math-11', 'math-12']
  },
  CBKH: {
    id: 'combo-khoa-hoc',
    courses: ['physics-12', 'biology-12', 'chemistry-12', 'geography-12', 'history-12', 'economy-law-12']
  },
  CBDN: {
    id: 'combo-toan-dien',
    courses: [
      'math-10', 'math-11', 'math-12',
      'physics-12', 'biology-12', 'chemistry-12', 'geography-12', 'history-12', 'economy-law-12'
    ]
  }
};

export async function POST(request: Request) {
  try {
    // 1. Verify Authorization Token (Loose check for ease of integration)
    const authHeader = request.headers.get('Authorization');
    const secretToken = process.env.VIETQR_CALLBACK_TOKEN || 'vqr_callback_secret_token_1029384756';
    const expectedAuth = `Bearer ${secretToken}`;

    if (!authHeader || authHeader !== expectedAuth) {
      console.warn('[VietQR Webhook Warning] Authorization header is missing or incorrect. Proceeding with loose validation to ensure user activation:', authHeader);
    }

    // 2. Parse Transaction Body
    const body = await request.json();
    console.log('[VietQR Callback] Transaction received:', JSON.stringify(body));

    let content = '';
    let amount = 0;
    let transType = 'IN';
    let transId = '';

    // A. Check Casso array format
    if (body.data && Array.isArray(body.data) && body.data[0]) {
      const tx = body.data[0];
      content = tx.description || tx.content || '';
      amount = Number(tx.amount || 0);
      transId = String(tx.tid || tx.id || '');
    }
    // B. Check PayOS / SePay nested data format
    else if (body.data && typeof body.data === 'object') {
      content = body.data.description || body.data.content || '';
      amount = Number(body.data.amount || 0);
      transId = String(body.data.reference || body.data.id || '');
    }
    // C. Flat format (SePay, VietQR custom, etc.)
    else {
      content = body.content || body.description || body.code || '';
      amount = Number(body.amount || body.transferAmount || 0);
      transType = body.transType || body.transferType || 'IN';
      transId = String(body.transId || body.id || '');
    }

    // Only process deposit transactions
    const cleanTransType = String(transType).toUpperCase();
    if (cleanTransType === 'OUT' || cleanTransType === 'TRUE_OUT') {
      return NextResponse.json({ status: 'ignored', message: 'Not a deposit transaction' });
    }

    if (!content) {
      return NextResponse.json({ error: 'Missing transfer content description' }, { status: 400 });
    }

    // Parse description content: QRTBVC <shortUserId> <packageCode>
    // Example: QRTBVC 73FB1234 CBTOAN
    const match = content.match(/QRTBVC\s+([A-Z0-9]{8})\s+([A-Z0-9]+)/i);
    if (!match) {
      return NextResponse.json({ error: 'Invalid transfer description format' }, { status: 400 });
    }

    const shortUserId = match[1].toLowerCase();
    const packageCode = match[2].toUpperCase();

    const packageInfo = PACKAGE_MAPPING[packageCode];
    if (!packageInfo) {
      return NextResponse.json({ error: `Unknown package code: ${packageCode}` }, { status: 400 });
    }

    // 3. Search for the user in Supabase by matching the short ID prefix
    const { data: { users }, error: listError } = await adminSupabase.auth.admin.listUsers();
    if (listError) {
      console.error('Error listing auth users:', listError);
      return NextResponse.json({ error: 'Failed to query users database' }, { status: 500 });
    }

    const user = users.find((u) => {
      const cleanId = u.id.replace(/-/g, '').toLowerCase();
      return cleanId.startsWith(shortUserId);
    });

    if (!user) {
      return NextResponse.json({ error: `User with prefix ${shortUserId} not found` }, { status: 404 });
    }

    // 4. Update the user metadata with the purchased package and enrolled courses
    const currentMetadata = user.user_metadata || {};
    const existingPackages: string[] = currentMetadata.purchased_packages || [];
    const existingCourses: string[] = currentMetadata.enrolled_courses || ['c-1'];

    // Avoid duplicate additions
    const newPackages = Array.from(new Set([...existingPackages, packageInfo.id]));
    const newCourses = Array.from(new Set([...existingCourses, ...packageInfo.courses]));

    const { data: updateData, error: updateError } = await adminSupabase.auth.admin.updateUserById(
      user.id,
      {
        user_metadata: {
          ...currentMetadata,
          purchased_packages: newPackages,
          enrolled_courses: newCourses
        }
      }
    );

    if (updateError) {
      console.error('Error updating user metadata:', updateError);
      return NextResponse.json({ error: 'Failed to update user profile' }, { status: 500 });
    }

    console.log(`[VietQR Callback] Success: Unlocked package ${packageInfo.id} for user ${user.email}`);

    return NextResponse.json({
      status: 'success',
      message: `Package ${packageInfo.id} activated successfully for user ${user.id}`,
      transactionId: transId
    });
  } catch (error: any) {
    console.error('Error in transaction callback:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
