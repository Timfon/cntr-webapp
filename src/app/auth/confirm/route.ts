import { type EmailOtpType } from '@supabase/supabase-js';
import { type NextRequest } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams, origin } = new URL(request.url);
    const token_hash = searchParams.get('token_hash');
    const typeParam = searchParams.get('type');
    const type: EmailOtpType | null = typeParam === 'email' ? 'signup' : (typeParam as EmailOtpType | null);
    const next = searchParams.get('next') ?? '/signup/success';

    if (!token_hash || !type) {
      console.error('Missing required parameters:', { token_hash: !!token_hash, type });
      return NextResponse.redirect(`${origin}/signin?error=missing_token`);
    }

    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    if (error) {
      console.error('Error verifying email token:', error);
      if (error.message?.includes('expired') || error.message?.includes('invalid') || error.message?.includes('has expired')) {
        return NextResponse.redirect(`${origin}/signin?error=expired_link&details=${encodeURIComponent('Email verification link has expired. Please request a new verification email.')}`);
      }
      return NextResponse.redirect(`${origin}/signin?error=invalid_token&details=${encodeURIComponent(error.message || 'Invalid verification token')}`);
    }

    // Get the authenticated user after verification
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error('Error getting user after verification:', userError);
      return NextResponse.redirect(`${origin}/signin?error=auth_error`);
    }

    // Check if user profile already exists
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('id, name')
      .eq('id', user.id)
      .maybeSingle();

    if (profileError && profileError.code !== 'PGRST116') {
      console.error('Error checking user profile:', profileError);
    }

    // If profile doesn't exist, create it from user_metadata
    if (!userProfile || !userProfile.name) {
      if (user.user_metadata) {
        try {
          const metadata = user.user_metadata;
          const { error: insertError } = await supabase.from('users').insert({
            id: user.id,
            email: user.email || '',
            name: metadata.name || metadata.full_name || user.email || 'User',
            role: (metadata.role as any) || 'general',
            cohort_id: metadata.cohort_id || null
          });

          if (insertError) {
            console.error('Failed to create profile after email verification:', insertError);
            // If profile creation fails, redirect to signup to complete profile
            const signupUrl = new URL('/signup/account', origin);
            signupUrl.searchParams.set('email', user.email || '');
            signupUrl.searchParams.set('name', metadata.name || metadata.full_name || '');
            return NextResponse.redirect(signupUrl);
          }
        } catch (error: any) {
          console.error('Error creating profile after verification:', error);
          // Fall through to signup flow
          const signupUrl = new URL('/signup/account', origin);
          signupUrl.searchParams.set('email', user.email || '');
          signupUrl.searchParams.set('name', user.user_metadata?.name || user.user_metadata?.full_name || '');
          return NextResponse.redirect(signupUrl);
        }
      } else {
        // No metadata - redirect to signup flow
        const signupUrl = new URL('/signup/account', origin);
        signupUrl.searchParams.set('email', user.email || '');
        return NextResponse.redirect(signupUrl);
      }
    }

    // If email was just verified (signup), redirect to success page
    if (type === 'signup' || type === 'email_change') {
      return NextResponse.redirect(`${origin}/signup/success?verified=true`);
    }

    // For other types (recovery, etc.), redirect to next URL
    // Ensure next is a valid path (not a full URL)
    const nextPath = next.startsWith('http') ? '/dashboard' : next;
    return NextResponse.redirect(`${origin}${nextPath}`);
  } catch (error: any) {
    console.error('Fatal error in /auth/confirm:', error);
    const { origin } = new URL(request.url);
    return NextResponse.redirect(`${origin}/signin?error=server_error&details=${encodeURIComponent(error.message || 'An unexpected error occurred')}`);
  }
}

