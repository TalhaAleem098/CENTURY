import { NextResponse } from 'next/server';

const ADMIN_SECRET = process.env.JWT_SECRET || 'your_admin_secret'; // Use a strong secret in production

function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

export function middleware(request) {
  const { pathname } = request.nextUrl;
  console.log(`Middleware triggered for: ${pathname}`);
  // Allow all Next.js static files, API routes, and special files
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/robots.txt') ||
    pathname.startsWith('/sitemap') ||
    pathname.startsWith('/api') ||
    pathname.match(/\.(js|css|png|jpg|jpeg|svg|webp|ico|txt|xml|json|mp4)$/)
  ) {
    return NextResponse.next();
  }

  // Only protect /admin routes, but allow /admin/login
  if (pathname.startsWith("/admin/login")) {
    return NextResponse.next();
  }
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('admin_token')?.value;
    if (!token) {
      return NextResponse.rewrite(new URL('/404', request.url));
    }
    const decoded = parseJwt(token);
    if (!decoded || decoded.name !== 'admin' || !decoded.email) {
      return NextResponse.rewrite(new URL('/404', request.url));
    }
    if (decoded.exp && Date.now() >= decoded.exp * 1000) {
      return NextResponse.rewrite(new URL('/404', request.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
