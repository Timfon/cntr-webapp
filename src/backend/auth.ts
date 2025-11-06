import { 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { auth } from '@/firebase';
import { userService } from './users';
import { UserRole } from '@/types/user';

/**
 * Backend authentication service functions
 * All authentication operations are centralized here
 */

export const authService = {
  /**
   * Sign in with Google
   */
  async signInWithGoogle() {
    try {
      const googleProvider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, googleProvider);
      
      let isNewUser = false;
      try {
        const userProfile = await userService.getUserProfile(result.user.uid);
        if (!userProfile) {
          isNewUser = true;
        }
      } catch (error: any) {
        isNewUser = true;
      }
      
      return { success: true, user: result.user, isNewUser };
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      console.error('Error details:', {
        code: error?.code,
        message: error?.message,
        email: error?.email,
        credential: error?.credential
      });
      return { success: false, error: `Google sign-in failed: ${error?.message || 'Unknown error'}` };
    }
  },

  /**
   * Sign in with email and password
   */
  async signInWithEmail(email: string, password: string) {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      
      // Ensure user profile exists (for existing users who might not have profiles)
      try {
        const userProfile = await userService.getUserProfile(result.user.uid);
        if (!userProfile) {
          return { success: false, error: 'User profile not found' };
        }
      } catch (error: any) {
        return { success: false, error: 'User profile not found' };
      }
      
      return { success: true, user: result.user };
    } catch (error: any) {
      console.error('Email sign-in error:', error);
      
      // Handle specific Firebase error codes
      if (error?.code === 'auth/invalid-credential' || error?.code === 'auth/wrong-password') {
        return { success: false, error: 'Incorrect password' };
      } else if (error?.code === 'auth/user-not-found') {
        return { success: false, error: 'No account found with this email address' };
      } else if (error?.code === 'auth/invalid-email') {
        return { success: false, error: 'Please enter a valid email address' };
      } else if (error?.code === 'auth/user-disabled') {
        return { success: false, error: 'This account has been disabled' };
      } else if (error?.code === 'auth/too-many-requests') {
        return { success: false, error: 'Too many failed attempts. Please try again later' };
      } else {
        return { success: false, error: 'Sign-in failed. Please try again' };
      }
    }
  },

  /**
   * Sign up with email and password
   */
  async signUpWithEmail(email: string, password: string, firstName: string, lastName: string, role: UserRole, cohort: string) {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Create user profile with default role
      await userService.createUserProfile(
        result.user.uid,
        email,
        firstName,
        lastName,
        role,
        cohort,
      );
      
      return { success: true, user: result.user };
    } catch (error: any) {
      console.error('Email sign-up error:', error);
      
      // Provide specific error messages based on Firebase error codes
      if (error?.code === 'auth/email-already-in-use') {
        return { success: false, error: 'This email is already registered. Please sign in instead.' };
      } else if (error?.code === 'auth/weak-password') {
        return { success: false, error: 'Password is too weak. Please choose a stronger password.' };
      } else if (error?.code === 'auth/invalid-email') {
        return { success: false, error: 'Please enter a valid email address.' };
      } else {
        return { success: false, error: 'Sign-up failed. Please try again.' };
      }
    }
  },

  /**
   * Sign out
   */
  async signOut() {
    try {
      await signOut(auth);
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
    return onAuthStateChanged(auth, callback);
  },

  /**
   * Get current user
   */
  getCurrentUser() {
    return auth.currentUser;
  },

  /**
   * Check if user has completed profile setup
   * Profile is considered complete if firstName and lastName exist
   */
  async hasCompletedProfile(uid: string): Promise<boolean> {
    try {
      const userProfile = await userService.getUserProfile(uid);
      if (!userProfile) return false;
      
      // Check if required profile fields are present
      return !!(userProfile.firstName && userProfile.lastName);
    } catch (error) {
      console.error('Error checking profile completion:', error);
      return false;
    }
  }
};
