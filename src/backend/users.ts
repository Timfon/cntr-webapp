import { doc, setDoc, getDoc, updateDoc, collection, query, where, getDocs, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '@/firebase';
import { UserRole } from '@/types/user';
import { User, Submission } from '@/types/database';

/**
 * User Management Service
 * Handles all user operations including profiles, roles, and data management
 */
export const userService = {
  // ===== USER PROFILE & ROLE OPERATIONS =====

  /**
   * Create user profile with role
   */
  async createUserProfile(userId: string, email: string, displayName?: string, role: UserRole = 'general', additionalData?: any): Promise<void> {
    try {
      // Validate that the role is one of the allowed values
      const validRoles: UserRole[] = ['undergraduate', 'advanced', 'expert', 'legislative_staff', 'general'];
      if (!validRoles.includes(role)) {
        throw new Error(`Invalid role: ${role}. Must be one of: ${validRoles.join(', ')}`);
      }

      const userDoc = doc(db, "users", userId);
      const userData: User = {
        uid: userId,
        email,
        role,
        assignedBills: [],
        inProgress: null,
        completedBills: [],
        ...additionalData, // Include any additional fields
      };
      
      await setDoc(userDoc, {
        ...userData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }, { merge: true });
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw new Error('Failed to create user profile');
    }
  },

  /**
   * Get user profile
   */
  async getUserProfile(userId: string): Promise<User | null> {
    return this.getUser(userId);
  },

  // ===== USER DATA OPERATIONS =====

  /**
   * Create or update a user
   * Can be used for both partial updates and full user creation
   */
  async updateUser(userData: Partial<User>): Promise<void> {
    try {
      const userDoc = doc(db, "users", userData.uid!);
      await setDoc(userDoc, {
        ...userData,
        updatedAt: serverTimestamp(),
      }, { merge: true });
    } catch (error) {
      console.error('Error updating user:', error);
      throw new Error('Failed to update user');
    }
  },

  /**
   * Get user by UID
   */
  async getUser(uid: string): Promise<User | null> {
    try {
      const userDoc = doc(db, "users", uid);
      const userSnap = await getDoc(userDoc);
      
      if (userSnap.exists()) {
        return userSnap.data() as User;
      }
      return null;
    } catch (error) {
      console.error('Error getting user:', error);
      throw new Error('Failed to get user');
    }
  },

  /**
   * Get all submissions for a user
   */
  async getUserSubmissions(uid: string): Promise<Submission[]> {
    try {
      const submissionsQuery = query(
        collection(db, "submissions"),
        where("uid", "==", uid),
        orderBy("submissionDate", "desc")
      );
      const submissionsSnap = await getDocs(submissionsQuery);
      
      return submissionsSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Submission[];
    } catch (error) {
      console.error('Error getting user submissions:', error);
      throw new Error('Failed to get user submissions');
    }
  },
};
