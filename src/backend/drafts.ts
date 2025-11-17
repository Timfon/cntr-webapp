import { createBrowserSupabaseClient } from '@/lib/supabase/client';
import { SubmissionDraft } from '@/types/database';

/**
 * Handles submission draft operations
 */
export const draftService = {
  /**
   * Save or update submission draft
   */
  async saveDraft(
    userId: string,
    billId: string,
    assignmentId: string,
    data: {
      answers: Record<string, any>;
      flags?: Record<string, boolean>;
      currentSection?: string;
      notes?: Record<string, string>;
    }
  ): Promise<void> {
    try {
      const supabase = createBrowserSupabaseClient();
      const { error } = await supabase
        .from('submission_drafts')
        .upsert(
          {
            user_id: userId,
            bill_id: billId,
            assignment_id: assignmentId,
            answers: data.answers,
            notes: data.notes || {},
            flags: data.flags || {},
            current_section: data.currentSection || 'general',
            last_saved_at: new Date().toISOString()
          },
          {
            onConflict: 'user_id,bill_id'
          }
        );

      if (error) throw error;
    } catch (error) {
      console.error('Error saving submission draft:', error);
      throw new Error('Failed to save draft');
    }
  },

  /**
   * Get submission draft
   */
  async getDraft(userId: string, billId: string): Promise<SubmissionDraft | null> {
    try {
      const supabase = createBrowserSupabaseClient();
      const { data, error } = await supabase
        .from('submission_drafts')
        .select('*')
        .eq('user_id', userId)
        .eq('bill_id', billId)
        .maybeSingle();

      if (error) throw error;
      return data as SubmissionDraft | null;
    } catch (error) {
      console.error('Error getting submission draft:', error);
      throw new Error('Failed to get draft');
    }
  },

  /**
   * Delete submission draft
   */
  async deleteDraft(userId: string, billId: string): Promise<void> {
    try {
      const supabase = createBrowserSupabaseClient();
      const { error } = await supabase
        .from('submission_drafts')
        .delete()
        .eq('user_id', userId)
        .eq('bill_id', billId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting submission draft:', error);
      throw new Error('Failed to delete draft');
    }
  },

  /**
   * Update draft section only
   */
  async updateDraftSection(userId: string, billId: string, section: string): Promise<void> {
    try {
      const supabase = createBrowserSupabaseClient();
      const { error } = await supabase
        .from('submission_drafts')
        .update({
          current_section: section,
          last_saved_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('bill_id', billId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating draft section:', error);
      throw new Error('Failed to update draft section');
    }
  }
};
