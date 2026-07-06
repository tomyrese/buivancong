import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Basic ')) {
      return NextResponse.json(
        { error: 'Missing or invalid Authorization header' },
        { status: 401, headers: { 'WWW-Authenticate': 'Basic realm="Secure Area"' } }
      );
    }

    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');

    // Default secure credentials
    const expectedUsername = process.env.VIETQR_USERNAME || 'isinhvien_vietqr';
    const expectedPassword = process.env.VIETQR_PASSWORD || 'secure_vietqr_callback_pass_2026';

    if (username !== expectedUsername || password !== expectedPassword) {
      return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
    }

    const secretToken = process.env.VIETQR_CALLBACK_TOKEN || 'vqr_callback_secret_token_1029384756';

    return NextResponse.json({
      access_token: secretToken,
      token_type: 'Bearer',
      expires_in: 86400 // 1 day
    });
  } catch (error: any) {
    console.error('Error in token_generate:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// Support GET for testing/connectivity checks by VietQR system if needed
export async function GET(request: Request) {
  return POST(request);
}
