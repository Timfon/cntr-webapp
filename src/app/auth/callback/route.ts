import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

/**
 * Auth callback handler for OAuth (Google) and password recovery
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const flowType = searchParams.get('type');
  const next = searchParams.get('next') ?? '/dashboard';

  if (code) {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error('Error exchanging code for session:', error);
      return NextResponse.redirect(`${origin}/signin?error=invalid_code&details=${encodeURIComponent(error.message)}`);
    }

    if (!data || !data.user) {
      return NextResponse.redirect(`${origin}/signin?error=no_user`);
    }

    // Get the authenticated user (following Supabase recommended pattern)
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.redirect(`${origin}/signin?error=auth_error`);
    }

    // Check if this is a password recovery flow
    // Either via explicit type parameter or AMR claim
    const sessionUser = data.session?.user as any;
    const amr = sessionUser?.amr;
    const hasRecoveryAMR = amr?.some((claim: any) => claim.method === 'recovery');

    if (flowType === 'recovery' || hasRecoveryAMR) {
      return NextResponse.redirect(`${origin}/reset-password`);
    }

    // Check if user profile exists
    const { data: userProfile } = await supabase
      .from('users')
      .select('id, name')
      .eq('id', user.id)
      .maybeSingle();

    // If profile doesn't exist, redirect to signup flow (for OAuth users like Google)
    if (!userProfile || !userProfile.name) {
      const signupUrl = new URL('/signup/account', origin);
      signupUrl.searchParams.set('email', user.email || '');
      signupUrl.searchParams.set('name', user.user_metadata?.full_name || user.user_metadata?.name || '');
      signupUrl.searchParams.set('provider', 'google');
      return NextResponse.redirect(signupUrl);
    }

    // User is authenticated and has profile - redirect to next URL
    return NextResponse.redirect(`${origin}${next}`);
  }

  // No code parameter
  return NextResponse.redirect(`${origin}/signin?error=missing_code`);
}
