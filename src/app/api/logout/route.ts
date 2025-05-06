import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const response = NextResponse.json({ success: true });
  
  // 認証用クッキーを削除
  response.cookies.delete('firebase_id_token');
  
  return response;
}