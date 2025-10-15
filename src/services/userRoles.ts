import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '@/firebase';
import { UserRole, UserProfile } from '@/types/user';

/**
 * User Roles Service
 * Handles all user role management operations
 */
export const userRolesService = {
  /**
   * Create or update user profile with role and additional fields
   */
  async createUserProfile(userId: string, email: string, displayName?: string, role: UserRole = 'general', additionalData?: Partial<UserProfile>): Promise<void> {
    try {
      // Validate that the role is one of the allowed values
      const validRoles: UserRole[] = ['undergraduate', 'advanced', 'expert', 'legislative_staff', 'general'];
      if (!validRoles.includes(role)) {
        throw new Error(`Invalid role: ${role}. Must be one of: ${validRoles.join(', ')}`);
      }

      const userDoc = doc(db, "users", userId);
      const userProfile: UserProfile = {
        uid: userId,
        email,
        displayName,
        role,
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        ...additionalData, // Include any additional fields
      };
      
      await setDoc(userDoc, userProfile, { merge: true });
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw new Error('Failed to create user profile');
    }
  },

  /**
   * Get user profile by ID
   */
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const userDoc = doc(db, "users", userId);
      const docSnap = await getDoc(userDoc);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as UserProfile;
      }
      return null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw new Error('Failed to get user profile');
    }
  },

  /**
   * Update user profile with additional fields
   */
  async updateUserProfile(userId: string, additionalData: Partial<UserProfile>): Promise<void> {
    try {
      const userDoc = doc(db, "users", userId);
      await updateDoc(userDoc, {
        ...additionalData,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw new Error('Failed to update user profile');
    }
  },
};
