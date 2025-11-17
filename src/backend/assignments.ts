import { createBrowserSupabaseClient } from '@/lib/supabase/client';
import { UserBillAssignmentWithBill, UserBillAssignmentWithDraft } from '@/types/database';
import {
  validateUUID,
  validateAssignmentStatus,
  validateDateString,
  ValidationError
} from '@/utils/validation';

/**
 * Handles user bill assignment operations
 */
export const assignmentService = {
  /**
   * Get user's bill assignments by status
   */
  async getUserAssignments(
    userId: string,
    status?: 'assigned' | 'in_progress' | 'completed'
  ): Promise<UserBillAssignmentWithBill[]> {
    try {
      validateUUID(userId, 'userId');
      if (status) {
        validateAssignmentStatus(status);
      }

      const supabase = createBrowserSupabaseClient();
      let query = supabase
        .from('user_bill_assignments')
        .select(`
          *,
          bill:bills(*)
        `)
        .eq('user_id', userId);

      if (status) {
        query = query.eq('status', status);
      }

      query = query.order('assigned_at', { ascending: false });

      const { data, error } = await query;

      if (error) throw error;
      return (data || []) as UserBillAssignmentWithBill[];
    } catch (error) {
      if (error instanceof ValidationError) throw error;
      console.error('Error getting user assignments:', error);
      throw new Error('Failed to get user assignments');
    }
  },

  /**
   * Get user's in-progress assignment with draft
   */
  async getUserInProgressAssignment(userId: string): Promise<UserBillAssignmentWithDraft | null> {
    try {
      validateUUID(userId, 'userId');

      const supabase = createBrowserSupabaseClient();
      const { data, error } = await supabase
        .from('user_bill_assignments')
        .select(`
          *,
          bill:bills(*),
          draft:submission_drafts(*)
        `)
        .eq('user_id', userId)
        .eq('status', 'in_progress')
        .maybeSingle();

      if (error) throw error;
      return data as UserBillAssignmentWithDraft | null;
    } catch (error) {
      if (error instanceof ValidationError) throw error;
      console.error('Error getting in-progress assignment:', error);
      throw new Error('Failed to get in-progress assignment');
    }
  },

  /**
   * Update assignment status with authorization check
   * @param currentUserId - The ID of the user making the request (for authorization)
   * @param assignmentId - The assignment to update
   * @param status - New status
   */
  async updateAssignmentStatus(
    currentUserId: string,
    assignmentId: string,
    status: 'assigned' | 'in_progress' | 'completed'
  ): Promise<void> {
    try {
      validateUUID(currentUserId, 'currentUserId');
      validateUUID(assignmentId, 'assignmentId');
      validateAssignmentStatus(status);

      const supabase = createBrowserSupabaseClient();

      // Authorization check: Verify the user owns this assignment
      const { data: assignment, error: fetchError } = await supabase
        .from('user_bill_assignments')
        .select('user_id')
        .eq('id', assignmentId)
        .single();

      if (fetchError) {
        if (fetchError.code === 'PGRST116') {
          throw new Error('Assignment not found');
        }
        throw fetchError;
      }

      if (assignment.user_id !== currentUserId) {
        throw new Error('Not authorized to update this assignment');
      }

      const updates: Record<string, string> = { status };

      if (status === 'in_progress') {
        updates.started_at = new Date().toISOString();
      } else if (status === 'completed') {
        updates.completed_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('user_bill_assignments')
        .update(updates)
        .eq('id', assignmentId);

      if (error) throw error;
    } catch (error) {
      if (error instanceof ValidationError) throw error;
      if (error instanceof Error && error.message.includes('Not authorized')) throw error;
      if (error instanceof Error && error.message.includes('not found')) throw error;
      console.error('Error updating assignment status:', error);
      throw new Error('Failed to update assignment status');
    }
  },

  /**
   * Create a new assignment (admin function)
   * Note: In production, add admin role verification
   */
  async createAssignment(
    userId: string,
    billId: string,
    deadline?: string
  ): Promise<string> {
    try {
      validateUUID(userId, 'userId');
      validateUUID(billId, 'billId');
      if (deadline) {
        validateDateString(deadline, 'deadline');
      }

      const supabase = createBrowserSupabaseClient();
      const { data, error } = await supabase
        .from('user_bill_assignments')
        .insert({
          user_id: userId,
          bill_id: billId,
          deadline: deadline || null
        })
        .select('id')
        .single();

      if (error) throw error;
      return data.id;
    } catch (error) {
      if (error instanceof ValidationError) throw error;
      console.error('Error creating assignment:', error);
      throw new Error('Failed to create assignment');
    }
  },

  /**
   * Get assignment by ID
   */
  async getAssignment(assignmentId: string): Promise<UserBillAssignmentWithBill | null> {
    try {
      validateUUID(assignmentId, 'assignmentId');

      const supabase = createBrowserSupabaseClient();
      const { data, error } = await supabase
        .from('user_bill_assignments')
        .select(`
          *,
          bill:bills(*)
        `)
        .eq('id', assignmentId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        throw error;
      }
      return data as UserBillAssignmentWithBill;
    } catch (error) {
      if (error instanceof ValidationError) throw error;
      console.error('Error getting assignment:', error);
      throw new Error('Failed to get assignment');
    }
  }
};
