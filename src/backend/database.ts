import { doc, setDoc, getDoc, updateDoc, addDoc, collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/firebase';
import { User, Submission, Bill } from '@/types/database';
import { userService } from './users';

/**
 * Database Service
 * Handles all direct database operations for the new structure
 */
export const databaseService = {
  // ===== USER PROGRESS OPERATIONS =====

  /**
   * Update user's in-progress bill
   */
  async updateUserProgress(uid: string, billId: string, answers: Record<string, any>, flags?: Record<string, boolean>, notes?: Record<string, string>, currentSection?: string): Promise<void> {
    try {
      const userDoc = doc(db, "users", uid);
      const userSnap = await getDoc(userDoc);
      const userData = userSnap.data() as User;
      
      // Get existing inProgress data or create new
      const existingProgress = userData?.inProgress;
      const isNewBill = !existingProgress || existingProgress.billId !== billId;
      
      await updateDoc(userDoc, {
        inProgress: {
          billId,
          currentSection: currentSection || existingProgress?.currentSection || 'general',
          answers,
          flags: flags || existingProgress?.flags || {},
          notes: notes || existingProgress?.notes || {},
          lastUpdated: new Date().toISOString(),
          startedAt: isNewBill ? new Date().toISOString() : existingProgress?.startedAt || new Date().toISOString(),
        },
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error updating user progress:', error);
      throw new Error('Failed to update user progress');
    }
  },

  /**
   * Update user's current section
   */
  async updateCurrentSection(uid: string, currentSection: string): Promise<void> {
    try {
      const userDoc = doc(db, "users", uid);
      const userSnap = await getDoc(userDoc);
      const userData = userSnap.data() as User;
      
      if (userData?.inProgress) {
        await updateDoc(userDoc, {
          inProgress: {
            ...userData.inProgress,
            currentSection,
            lastUpdated: new Date().toISOString(),
          },
          updatedAt: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error('Error updating current section:', error);
      throw new Error('Failed to update current section');
    }
  },

  /**
   * Update user's flags
   */
  async updateUserFlags(uid: string, flags: Record<string, boolean>): Promise<void> {
    try {
      const userDoc = doc(db, "users", uid);
      const userSnap = await getDoc(userDoc);
      const userData = userSnap.data() as User;
      
      if (userData?.inProgress) {
        await updateDoc(userDoc, {
          inProgress: {
            ...userData.inProgress,
            flags,
            lastUpdated: new Date().toISOString(),
          },
          updatedAt: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error('Error updating user flags:', error);
      throw new Error('Failed to update user flags');
    }
  },

  /**
   * Update user's notes
   */
  async updateUserNotes(uid: string, notes: { [questionId: string]: string }): Promise<void> {
    try {
      const userDoc = doc(db, "users", uid);
      const userSnap = await getDoc(userDoc);
      const userData = userSnap.data() as User;
      
      if (userData?.inProgress) {
        await updateDoc(userDoc, {
          inProgress: {
            ...userData.inProgress,
            notes,
            lastUpdated: new Date().toISOString(),
          },
          updatedAt: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error('Error updating user notes:', error);
      throw new Error('Failed to update user notes');
    }
  },

  /**
   * Clear user's in-progress bill
   */
  async clearUserProgress(uid: string): Promise<void> {
    try {
      const userDoc = doc(db, "users", uid);
      await updateDoc(userDoc, {
        inProgress: null,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error clearing user progress:', error);
      throw new Error('Failed to clear user progress');
    }
  },


  // ===== BILL OPERATIONS =====

  /**
   * Create a new bill
   */
  async createBill(billData: Omit<Bill, 'billId'>): Promise<string> {
    try {
      const billRef = await addDoc(collection(db, "bills"), {
        ...billData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      return billRef.id;
    } catch (error) {
      console.error('Error creating bill:', error);
      throw new Error('Failed to create bill');
    }
  },

  /**
   * Get bill by ID
   */
  async getBill(billId: string): Promise<Bill | null> {
    try {
      const billDoc = doc(db, "bills", billId);
      const billSnap = await getDoc(billDoc);
      
      if (billSnap.exists()) {
        return { ...billSnap.data() } as unknown as Bill;
      }
      return null;
    } catch (error) {
      console.error('Error getting bill:', error);
      throw new Error('Failed to get bill');
    }
  },

  /**
   * Get all bills
   */
  async getAllBills(): Promise<Bill[]> {
    try {
      const billsQuery = query(collection(db, "bills"), orderBy("createdAt", "desc"));
      const billsSnap = await getDocs(billsQuery);
      
      return billsSnap.docs.map(doc => ({
        ...doc.data(),
      })) as Bill[];
    } catch (error) {
      console.error('Error getting bills:', error);
      throw new Error('Failed to get bills');
    }
  },

  /**
   * Update bill
   */
  async updateBill(billId: string, updates: Partial<Bill>): Promise<void> {
    try {
      const billDoc = doc(db, "bills", billId);
      await updateDoc(billDoc, {
        ...updates,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error updating bill:', error);
      throw new Error('Failed to update bill');
    }
  },

  // ===== SUBMISSION OPERATIONS =====

  /**
   * Create a new submission
   */
  async createSubmission(submissionData: Omit<Submission, 'id'>): Promise<string> {
    try {
      const submissionRef = await addDoc(collection(db, "submissions"), {
        billId: submissionData.billId,
        uid: submissionData.uid,
        answers: submissionData.answers,
        notes: submissionData.notes,
        createdAt: submissionData.createdAt,
      });
      return submissionRef.id;
    } catch (error) {
      console.error('Error creating submission:', error);
      throw new Error('Failed to create submission');
    }
  },

  /**
   * Get submission by ID
   */
  async getSubmission(submissionId: string): Promise<Submission | null> {
    try {
      const submissionDoc = doc(db, "submissions", submissionId);
      const submissionSnap = await getDoc(submissionDoc);
      
      if (submissionSnap.exists()) {
        return { id: submissionId, ...submissionSnap.data() } as Submission;
      }
      return null;
    } catch (error) {
      console.error('Error getting submission:', error);
      throw new Error('Failed to get submission');
    }
  },


  /**
   * Get all submissions for a bill
   */
  async getBillSubmissions(billId: string): Promise<Submission[]> {
    try {
      const submissionsQuery = query(
        collection(db, "submissions"),
        where("billId", "==", billId),
        orderBy("submissionDate", "desc")
      );
      const submissionsSnap = await getDocs(submissionsQuery);
      
      return submissionsSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Submission[];
    } catch (error) {
      console.error('Error getting bill submissions:', error);
      throw new Error('Failed to get bill submissions');
    }
  },

  /**
   * Get all submissions
   */
  async getAllSubmissions(): Promise<Submission[]> {
    try {
      const submissionsQuery = query(
        collection(db, "submissions"),
        orderBy("submissionDate", "desc")
      );
      const submissionsSnap = await getDocs(submissionsQuery);
      
      return submissionsSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Submission[];
    } catch (error) {
      console.error('Error getting all submissions:', error);
      throw new Error('Failed to get all submissions');
    }
  },

  // ===== UTILITY OPERATIONS =====

  /**
   * Check if user has access to a bill
   */
  async userHasAccessToBill(uid: string, billId: string): Promise<boolean> {
    try {
      const user = await userService.getUser(uid);
      if (!user) return false;
      
      // Check if user has access to this bill
      return user.assignedBills.includes(billId) || user.role === 'admin';
    } catch (error) {
      console.error('Error checking bill access:', error);
      return false;
    }
  }
};
