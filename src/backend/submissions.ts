import { createBrowserSupabaseClient } from '@/lib/supabase/client';
import { Submission, SubmissionWithBill } from '@/types/database';

/**
 * Handles completed submission operations
 */
export const submissionService = {
  /**
   * Create a new submission
   */
  async createSubmission(submissionData: {
    userId: string;
    billId: string;
    assignmentId?: string;
    answers: Record<string, any>;
    notes?: Record<string, string>;
  }): Promise<string> {
    try {
      const supabase = createBrowserSupabaseClient();
      const { data, error } = await supabase
        .from('submissions')
        .insert({
          user_id: submissionData.userId,
          bill_id: submissionData.billId,
          assignment_id: submissionData.assignmentId || null,
          answers: submissionData.answers,
          notes: submissionData.notes || null,
          submitted_at: new Date().toISOString()
        })
        .select('id')
        .single();

      if (error) throw error;
      return data.id;
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
      const supabase = createBrowserSupabaseClient();
      const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .eq('id', submissionId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        throw error;
      }
      return data as Submission;
    } catch (error) {
      console.error('Error getting submission:', error);
      throw new Error('Failed to get submission');
    }
  },

  /**
   * Get submission with bill details
   */
  async getSubmissionWithBill(submissionId: string): Promise<SubmissionWithBill | null> {
    try {
      const supabase = createBrowserSupabaseClient();
      const { data, error } = await supabase
        .from('submissions')
        .select(`
          *,
          bill:bills(*)
        `)
        .eq('id', submissionId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        throw error;
      }
      return data as SubmissionWithBill;
    } catch (error) {
      console.error('Error getting submission with bill:', error);
      throw new Error('Failed to get submission');
    }
  },

  /**
   * Get all submissions for a bill
   */
  async getBillSubmissions(billId: string): Promise<Submission[]> {
    try {
      const supabase = createBrowserSupabaseClient();
      const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .eq('bill_id', billId)
        .order('submitted_at', { ascending: false });

      if (error) throw error;
      return (data || []) as Submission[];
    } catch (error) {
      console.error('Error getting bill submissions:', error);
      throw new Error('Failed to get bill submissions');
    }
  },

  /**
   * Get user's submissions
   */
  async getUserSubmissions(userId: string): Promise<SubmissionWithBill[]> {
    try {
      const supabase = createBrowserSupabaseClient();
      const { data, error } = await supabase
        .from('submissions')
        .select(`
          *,
          bill:bills(*)
        `)
        .eq('user_id', userId)
        .order('submitted_at', { ascending: false });

      if (error) throw error;
      return (data || []) as SubmissionWithBill[];
    } catch (error) {
      console.error('Error getting user submissions:', error);
      throw new Error('Failed to get user submissions');
    }
  },

  /**
   * Get all submissions (admin only)
   */
  async getAllSubmissions(): Promise<Submission[]> {
    try {
      const supabase = createBrowserSupabaseClient();
      const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (error) throw error;
      return (data || []) as Submission[];
    } catch (error) {
      console.error('Error getting all submissions:', error);
      throw new Error('Failed to get all submissions');
    }
  },

  /**
   * Get submissions with filters (for analytics)
   */
  async getSubmissionsWithFilters(options: {
    billId?: string;
    userId?: string;
    startDate?: string;
    endDate?: string;
    limit?: number;
  } = {}): Promise<SubmissionWithBill[]> {
    try {
      const supabase = createBrowserSupabaseClient();
      let query = supabase
        .from('submissions')
        .select(`
          *,
          bill:bills(*)
        `);

      if (options.billId) {
        query = query.eq('bill_id', options.billId);
      }

      if (options.userId) {
        query = query.eq('user_id', options.userId);
      }

      if (options.startDate) {
        query = query.gte('submitted_at', options.startDate);
      }

      if (options.endDate) {
        query = query.lte('submitted_at', options.endDate);
      }

      query = query.order('submitted_at', { ascending: false });

      if (options.limit) {
        query = query.limit(options.limit);
      }

      const { data, error } = await query;

      if (error) throw error;
      return (data || []) as SubmissionWithBill[];
    } catch (error) {
      console.error('Error getting submissions with filters:', error);
      throw new Error('Failed to get submissions');
    }
  }
};
