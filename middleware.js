import { NextResponse } from 'next/server';
const ADMIN_SECRET = process.env.JWT_SECRET || 'your_admin_secret';
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
  // const { pathname } = request.nextUrl;
  // if (pathname.startsWith("/admin/login")) {
  //   return NextResponse.next();
  // }
  // if (pathname.startsWith('/admin')) {
  //   const token = request.cookies.get('admin_token')?.value;
  //   if (!token) {
  //     return NextResponse.rewrite(new URL('/404', request.url));
  //   }
  //   const decoded = parseJwt(token);
  //   if (!decoded || decoded.name !== 'admin' || !decoded.email) {
  //     return NextResponse.rewrite(new URL('/404', request.url));
  //   }
  //   if (decoded.exp && Date.now() >= decoded.exp * 1000) {
  //     return NextResponse.rewrite(new URL('/404', request.url));
  //   }
  // }
  return NextResponse.next();
}
export const config = {
  matcher: ['/admin/:path*'],
};