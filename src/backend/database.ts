import { doc, setDoc, getDoc, updateDoc, addDoc, collection, query, where, getDocs, orderBy, runTransaction, limit, startAfter, QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
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
   * Update user's in-progress bill using transaction to prevent race conditions
   */
  async updateUserProgress(uid: string, billId: string, answers: Record<string, any>, flags?: Record<string, boolean>, notes?: Record<string, string>, currentSection?: string): Promise<void> {
    try {
      const userDocRef = doc(db, "users", uid);

      await runTransaction(db, async (transaction) => {
        const userDoc = await transaction.get(userDocRef);

        if (!userDoc.exists()) {
          throw new Error('User does not exist');
        }

        const userData = userDoc.data() as User;
        const existingProgress = userData?.inProgress;
        const isNewBill = !existingProgress || existingProgress.billId !== billId;

        transaction.update(userDocRef, {
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
      });
    } catch (error) {
      console.error('Error updating user progress:', error);
      throw new Error('Failed to update user progress');
    }
  },

  /**
   * Update user's current section using transaction
   */
  async updateCurrentSection(uid: string, currentSection: string): Promise<void> {
    try {
      const userDocRef = doc(db, "users", uid);

      await runTransaction(db, async (transaction) => {
        const userDoc = await transaction.get(userDocRef);

        if (!userDoc.exists()) {
          throw new Error('User does not exist');
        }

        const userData = userDoc.data() as User;

        if (userData?.inProgress) {
          transaction.update(userDocRef, {
            inProgress: {
              ...userData.inProgress,
              currentSection,
              lastUpdated: new Date().toISOString(),
            },
            updatedAt: new Date().toISOString(),
          });
        }
      });
    } catch (error) {
      console.error('Error updating current section:', error);
      throw new Error('Failed to update current section');
    }
  },

  /**
   * Update user's flags using transaction
   */
  async updateUserFlags(uid: string, flags: Record<string, boolean>): Promise<void> {
    try {
      const userDocRef = doc(db, "users", uid);

      await runTransaction(db, async (transaction) => {
        const userDoc = await transaction.get(userDocRef);

        if (!userDoc.exists()) {
          throw new Error('User does not exist');
        }

        const userData = userDoc.data() as User;

        if (userData?.inProgress) {
          transaction.update(userDocRef, {
            inProgress: {
              ...userData.inProgress,
              flags,
              lastUpdated: new Date().toISOString(),
            },
            updatedAt: new Date().toISOString(),
          });
        }
      });
    } catch (error) {
      console.error('Error updating user flags:', error);
      throw new Error('Failed to update user flags');
    }
  },

  /**
   * Update user's notes using transaction
   */
  async updateUserNotes(uid: string, notes: { [questionId: string]: string }): Promise<void> {
    try {
      const userDocRef = doc(db, "users", uid);

      await runTransaction(db, async (transaction) => {
        const userDoc = await transaction.get(userDocRef);

        if (!userDoc.exists()) {
          throw new Error('User does not exist');
        }

        const userData = userDoc.data() as User;

        if (userData?.inProgress) {
          transaction.update(userDocRef, {
            inProgress: {
              ...userData.inProgress,
              notes,
              lastUpdated: new Date().toISOString(),
            },
            updatedAt: new Date().toISOString(),
          });
        }
      });
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
   * Get all bills with optional pagination
   * @param pageSize - Number of bills to fetch (default: 50)
   * @param lastDoc - Last document from previous page for cursor-based pagination
   */
  async getBills(pageSize: number = 50, lastDoc?: QueryDocumentSnapshot<DocumentData>): Promise<{ bills: Bill[], lastDoc: QueryDocumentSnapshot<DocumentData> | null }> {
    try {
      // Build query with pagination
      let billsQuery = query(
        collection(db, "bills"),
        orderBy("createdAt", "desc"),
        limit(pageSize)
      );

      // Add cursor if provided
      if (lastDoc) {
        billsQuery = query(
          collection(db, "bills"),
          orderBy("createdAt", "desc"),
          startAfter(lastDoc),
          limit(pageSize)
        );
      }

      try {
        const billsSnap = await getDocs(billsQuery);

        // If no bills or createdAt doesn't exist, try without ordering
        if (billsSnap.docs.length === 0 && !lastDoc) {
          const billsQueryNoOrder = query(collection(db, "bills"), limit(pageSize));
          const billsSnapNoOrder = await getDocs(billsQueryNoOrder);
          return {
            bills: billsSnapNoOrder.docs.map(doc => ({
              billId: doc.id,
              ...(doc.data() as any)
            })) as Bill[],
            lastDoc: billsSnapNoOrder.docs[billsSnapNoOrder.docs.length - 1] || null
          };
        }

        return {
          bills: billsSnap.docs.map(doc => ({
            billId: doc.id,
            ...(doc.data() as any)
          })) as Bill[],
          lastDoc: billsSnap.docs[billsSnap.docs.length - 1] || null
        };
      } catch (orderError: any) {
        // If ordering fails, get bills without ordering
        const billsQueryNoOrder = query(collection(db, "bills"), limit(pageSize));
        const billsSnap = await getDocs(billsQueryNoOrder);
        return {
          bills: billsSnap.docs.map(doc => ({
            billId: doc.id,
            ...(doc.data() as any)
          })) as Bill[],
          lastDoc: billsSnap.docs[billsSnap.docs.length - 1] || null
        };
      }
    } catch (error: any) {
      console.error('Error getting bills:', error);
      if (error?.code === 'permission-denied') {
        throw new Error('Permission denied: Check your Firestore security rules to allow reading bills');
      }
      throw new Error(`Failed to get bills: ${error?.message || 'Unknown error'}`);
    }
  },

  /**
   * Get all bills (simple version for backwards compatibility)
   * Note: This fetches all bills without pagination - use getAllBills() with pagination instead
   */
  async getAllBills(): Promise<Bill[]> {
    const { bills } = await this.getBills(1000); // Fetch up to 1000 bills
    return bills;
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
        submissionDate: submissionData.submissionDate || new Date().toISOString(),
        version: submissionData.version || '1.0',
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
   * Check if user has access to a bill (CLIENT-SIDE ONLY - FOR UI)
   * Permission Model:
   * - Admin (role='admin'): Can access ALL bills
   * - Scorers (all other roles): Can only access their assigned bills
   */
  async userHasAccessToBill(uid: string, billId: string): Promise<boolean> {
    try {
      const user = await userService.getUser(uid);
      if (!user) return false;

      // Admins have access to all bills
      if (user.role === 'admin') return true;

      // Scorers only have access to assigned bills
      return user.assignedBills.includes(billId);
    } catch (error) {
      console.error('Error checking bill access:', error);
      return false;
    }
  }
};