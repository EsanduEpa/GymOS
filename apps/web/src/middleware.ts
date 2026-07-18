import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicPaths = ['/login', '/register', '/forgot-password', '/'];
const roleRouteMap: Record<string, string> = {
  SUPER_ADMIN: '/admin',
  GYM_OWNER: '/gym',
  GYM_ADMIN: '/gym',
  TRAINER: '/trainer',
  MEMBER: '/member',
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('gymos_token')?.value;
  const userRole = request.cookies.get('gymos_role')?.value;

  // Allow public paths
  if (publicPaths.some((path) => pathname === path)) {
    // If authenticated and on login/register, redirect to dashboard
    if (token && userRole && (pathname === '/login' || pathname === '/register' || pathname === '/')) {
      const dashboardPath = roleRouteMap[userRole] || '/gym';
      return NextResponse.redirect(new URL(dashboardPath, request.url));
    }
    return NextResponse.next();
  }

  // Allow static files and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/favicon') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Protected routes — require auth
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Role-based access control
  const protectedPrefixes = ['/admin', '/gym', '/trainer', '/member'];
  const matchedPrefix = protectedPrefixes.find((prefix) => pathname.startsWith(prefix));

  if (matchedPrefix && userRole) {
    const allowedPath = roleRouteMap[userRole];
    if (allowedPath && !pathname.startsWith(allowedPath)) {
      // User is trying to access a route not for their role
      return NextResponse.redirect(new URL(allowedPath, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
