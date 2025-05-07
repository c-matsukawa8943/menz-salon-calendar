import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  console.log('ミドルウェアが実行されました: ' + request.nextUrl.pathname);
  
  // クッキーの取得
  const token = request.cookies.get('firebase_id_token');
  console.log('トークンの有無:', !!token);

  // matcherで指定したすべてのパスで認証チェック
  const protectedPaths = [
    '/calendar',
    '/reservation/confirmation',
    '/admin',
    '/mypage'
  ];
  const isProtected = protectedPaths.some((path) => request.nextUrl.pathname.startsWith(path));

  if (isProtected && !token) {
    console.log('認証トークンがないため、ログインページにリダイレクト');
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/calendar/:path*',
    '/reservation/:path*',
    '/reservation/confirmation/:path*',
    '/reservation',
    '/admin/:path*',
    '/mypage/:path*'
  ],
};
