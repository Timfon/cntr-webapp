import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session if expired - required for Server Components
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // Allow auth callback and confirmation routes to complete
  const authCallbackPaths = ['/auth/callback', '/auth/confirm'];
  if (authCallbackPaths.some(path => pathname.startsWith(path))) {
    return supabaseResponse;
  }

  // Allow password reset flow (but user must be authenticated via recovery link)
  if (pathname.startsWith('/reset-password')) {
    return supabaseResponse;
  }

  // Allow forgot password page
  if (pathname === '/forgot-password') {
    return supabaseResponse;
  }

  // Protect routes that require authentication
  const protectedPaths = ['/dashboard', '/scorecard', '/settings', '/view-all-bills', '/admin'];
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));

  if (isProtectedPath && !user) {
    const url = request.nextUrl.clone();
    url.pathname = '/signin';
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users away from auth pages
  const authPaths = ['/signin', '/signup'];
  const isAuthPath = authPaths.some(path => pathname === path || pathname.startsWith(path + '/'));

  if (isAuthPath && user) {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
