import { authMiddleware } from 'next-firebase-auth-edge/lib/next/middleware';
import { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  return authMiddleware(request, {
    loginPath: '/login',
    logoutPath: '/logout',
    cookieName: 'AuthToken',
    cookieSignatureKeys: [process.env.FIREBASE_COOKIE_SECRET_CURRENT || 'secret1'],
    cookieSerializeOptions: { path: '/', httpOnly: true, secure: true, sameSite: 'lax' },
    serviceAccount: {
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
      privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
    },
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
    debug: true,
  });
}

export const config = {
  matcher: ['/calendar/:path*'],
}; 