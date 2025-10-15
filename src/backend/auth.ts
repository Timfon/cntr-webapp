import { 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { auth } from '@/firebase';
import { backendFirebase } from './firebase';

/**
 * Backend authentication service functions
 * All authentication operations are centralized here
 */

export const backendAuth = {
  /**
   * Sign in with Google
   */
  async signInWithGoogle() {
    try {
      const googleProvider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, googleProvider);
      
      // Ensure user profile exists (for existing users who might not have profiles)
      try {
        const userProfile = await backendFirebase.userRoles.getUserProfile(result.user.uid);
        if (!userProfile) {
          await backendFirebase.userRoles.createUserProfile(
            result.user.uid, 
            result.user.email || '', 
            result.user.displayName || undefined, 
            'general'
          );
        }
      } catch (error: any) {
        console.log('Creating new user profile for existing Google user:', result.user.uid);
        // If getting profile fails, create one
        await backendFirebase.userRoles.createUserProfile(
          result.user.uid, 
          result.user.email || '', 
          result.user.displayName || undefined, 
          'general'
        );
      }
      
      console.log('Google sign-in successful:', result.user.email);
      
      return { success: true, user: result.user };
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
        const userProfile = await backendFirebase.userRoles.getUserProfile(result.user.uid);
        if (!userProfile) {
          await backendFirebase.userRoles.createUserProfile(
            result.user.uid, 
            email, 
            result.user.displayName || undefined, 
            'general'
          );
        }
      } catch (error: any) {
        console.log('Creating new user profile for existing user:', result.user.uid);
        // If getting profile fails, create one
        await backendFirebase.userRoles.createUserProfile(
          result.user.uid, 
          email, 
          result.user.displayName || undefined, 
          'general'
        );
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
  async signUpWithEmail(email: string, password: string, displayName?: string) {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Create user profile with default role
      await backendFirebase.userRoles.createUserProfile(
        result.user.uid, 
        email, 
        displayName, 
        'general'
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
  }
};
