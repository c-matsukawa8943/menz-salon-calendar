import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { idToken } = await req.json();

  if (!idToken) {
    return NextResponse.json({ error: 'ID token is required' }, { status: 400 });
  }
  
  const response = NextResponse.json({ success: true });
  
  response.cookies.set({
    name: 'firebase_id_token',
    value: idToken,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 5, // 5日間
    path: '/'
  });

  return response;
} 