import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  console.log('ミドルウェアが実行されました: ' + request.nextUrl.pathname);
  
  // クッキーの取得
  const token = request.cookies.get('firebase_id_token');
  console.log('トークンの有無:', !!token);
  
  // '/calendar'へのアクセスかつトークンがない場合、ログインページにリダイレクト
  if (request.nextUrl.pathname.startsWith('/calendar')) {
    if (!token) {
      console.log('認証トークンがないため、ログインページにリダイレクト');
      return NextResponse.redirect(new URL('/login', request.url));
    }
    console.log('認証トークンあり、アクセス許可');
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/calendar/:path*'], 
};
