import { createBrowserSupabaseClient } from '@/lib/supabase/client';
import { userService } from './users';
import { UserRole } from '@/types/database';

/**
 * Authentication service
 */
export const authService = {
  /**
   * Sign in with Google
   */
  async signInWithGoogle() {
    try {
      const supabase = createBrowserSupabaseClient();
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) throw error;
      return { success: true, data };
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      return { success: false, error: `Google sign-in failed: ${error?.message || 'Unknown error'}` };
    }
  },

  /**
   * Sign in with email and password
   */
  async signInWithEmail(email: string, password: string) {
    try {
      const supabase = createBrowserSupabaseClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          return { success: false, error: 'Incorrect email or password' };
        } else if (error.message.includes('Email not confirmed')) {
          return { success: false, error: 'Please verify your email before signing in' };
        } else if (error.message.includes('Too many requests')) {
          return { success: false, error: 'Too many failed attempts. Please try again later' };
        }
        return { success: false, error: error.message };
      }

      if (data.user) {
        const userProfile = await userService.getUser(data.user.id);
        if (!userProfile) {
          return { success: false, error: 'User profile not found. Please contact support.' };
        }
      }

      return { success: true, user: data.user, session: data.session };
    } catch (error: any) {
      console.error('Email sign-in error:', error);
      return { success: false, error: 'Sign-in failed. Please try again' };
    }
  },

  /**
   * Sign up with email and password
   * Note: Profile will be created in /auth/callback after email verification
   * Signup data (name, role, cohort_id) is stored in user_metadata for later use
   */
  async signUpWithEmail(
    email: string, 
    password: string, 
    name: string, 
    role: UserRole = 'general',
    cohortId?: string
  ) {
    try {
      const supabase = createBrowserSupabaseClient();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role,
            cohort_id: cohortId || null 
          },
          emailRedirectTo: `/auth/confirm?next=/signup/success`
        }
      });

      if (error) {
        if (error.message.includes('already registered')) {
          return { success: false, error: 'This email is already registered. Please sign in instead.' };
        } else if (error.message.includes('weak password') || error.message.includes('at least')) {
          return { success: false, error: 'Password is too weak. Please choose a stronger password (at least 6 characters).' };
        } else if (error.message.includes('invalid email')) {
          return { success: false, error: 'Please enter a valid email address.' };
        }
        return { success: false, error: error.message };
      }

      // Check if email confirmation is required (session is null)
      const requiresEmailVerification = !data.session;

      // If we have a session (email verification not required), create profile immediately
      if (data.user && data.session) {
        try {
          await userService.createUser({
            id: data.user.id,
            email: email,
            name: name,
            role: role,
            cohort_id: cohortId
          });
        } catch (profileError: any) {
          // If profile creation fails, log but don't fail signup
          console.warn('Profile creation failed:', profileError.message);
        }
      }
      // If email verification is required, profile will be created in /auth/confirm after verification

      return { 
        success: true, 
        user: data.user, 
        session: data.session,
        requiresEmailVerification 
      };
    } catch (error: any) {
      console.error('Email sign-up error:', error);
      return { success: false, error: 'Sign-up failed. Please try again.' };
    }
  },

  /**
   * Sign out
   */
  async signOut() {
    try {
      const supabase = createBrowserSupabaseClient();
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      console.error('Sign out error:', error);
      return { success: false, error: 'Sign out failed' };
    }
  },

  /**
   * Listen to auth state changes
   */
  onAuthStateChanged(callback: (user: any) => void) {
    const supabase = createBrowserSupabaseClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      callback(session?.user || null);
    });
    return () => subscription.unsubscribe();
  },

  /**
   * Get current user
   */
  async getCurrentUser() {
    const supabase = createBrowserSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  /**
   * Get current session
   */
  async getSession() {
    const supabase = createBrowserSupabaseClient();
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  },

  /**
   * Send password reset email
   */
  async sendPasswordReset(email: string) {
    try {
      const supabase = createBrowserSupabaseClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) {
        if (error.message.includes('not found')) {
          return { success: false, error: 'No account found with this email address' };
        }
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: 'Failed to send reset email. Please try again.' };
    }
  },

  /**
   * Update user password
   */
  async updatePassword(newPassword: string) {
    try {
      const supabase = createBrowserSupabaseClient();
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        if (error.message.includes('weak password') || error.message.includes('at least')) {
          return { success: false, error: 'Please choose a stronger password.' };
        }
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: 'Failed to reset password. Please try again.' };
    }
  },

  /**
   * Check if user has completed profile setup
   */
  async hasCompletedProfile(uid: string): Promise<boolean> {
    try {
      const userProfile = await userService.getUser(uid);
      if (!userProfile) return false;
      return !!userProfile.name;
    } catch (error) {
      console.error('Error checking profile completion:', error);
      return false;
    }
  },

  /**
   * Verify password reset code
   */
  async verifyPasswordResetCode(_code: string) {
    try {
      const supabase = createBrowserSupabaseClient();
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        return { success: true, email: session.user.email || '' };
      }
      return { success: false, error: 'No active session. Please use the reset link from your email.' };
    } catch (error: any) {
      return { success: false, error: 'Failed to verify reset code' };
    }
  },

  /**
   * Confirm password reset
   */
  async confirmPasswordReset(_code: string, newPassword: string) {
    return this.updatePassword(newPassword);
  }
};
