import { doc, setDoc, getDoc, addDoc, collection } from 'firebase/firestore';
import { auth, db } from '@/firebase';

export const backendFirebase = {
  /**
   * Save user progress to Firestore
   */
  async saveProgress(userId: string, data: any): Promise<void> {
    try {
      const userDoc = doc(db, "progress", userId);
      await setDoc(userDoc, data, { merge: true });
    } catch (error) {
      console.error('Error saving progress:', error);
      throw new Error('Failed to save progress');
    }
  },

  /**
   * Get user progress from Firestore
   */
  async getProgress(userId: string): Promise<any> {
    try {
      const userDoc = doc(db, "progress", userId);
      const docSnap = await getDoc(userDoc);
      
      if (docSnap.exists()) {
        return docSnap.data();
      }
      return null;
    } catch (error) {
      console.error('Error getting progress:', error);
      throw new Error('Failed to get progress');
    }
  },

  /**
   * Submit completed form
   */
  async submitForm(submissionData: any): Promise<void> {
    try {
      await addDoc(collection(db, "submissions"), submissionData);
    } catch (error) {
      console.error('Error submitting form:', error);
      throw new Error('Failed to submit form');
    }
  },

  /**
   * Clear user progress after submission
   */
  async clearProgress(userId: string): Promise<void> {
    try {
      const userDoc = doc(db, "progress", userId);
      await setDoc(userDoc, {
        answers: {},
        flags: {},
        notes: {},
        currentSection: "general",
        selectedBill: '',
      });
    } catch (error) {
      console.error('Error clearing progress:', error);
      throw new Error('Failed to clear progress');
    }
  },

  /**
   * Get current authenticated user
   */
  getCurrentUser() {
    return auth.currentUser;
  }
};
