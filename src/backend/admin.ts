import { createBrowserSupabaseClient } from '@/lib/supabase/client';
import { User, UserRole, UserWithCohort } from '@/types/database';
import {
  validateUUID,
  validateUserRole,
  ValidationError
} from '@/utils/validation';

/**
 * Admin Service
 * Handles admin-only operations
 */
export const adminService = {
  /**
   * Update user role (admin only)
   * @param currentUserId - ID of the admin making the request
   * @param userId - ID of the user to update
   * @param role - New role
   */
  async updateUserRole(
    currentUserId: string,
    userId: string,
    role: UserRole
  ): Promise<void> {
    try {
      validateUUID(currentUserId, 'currentUserId');
      validateUUID(userId, 'userId');
      validateUserRole(role);

      // Verify current user is admin
      const supabase = createBrowserSupabaseClient();
      const { data: currentUser, error: currentUserError } = await supabase
        .from('users')
        .select('role')
        .eq('id', currentUserId)
        .single();

      if (currentUserError || !currentUser || currentUser.role !== 'admin') {
        throw new Error('Not authorized: Admin access required');
      }

      const { error } = await supabase
        .from('users')
        .update({ role })
        .eq('id', userId);

      if (error) {
        console.error('Supabase error updating user role:', error.message, error.code, error.details);
        throw error;
      }
    } catch (error: unknown) {
      if (error instanceof ValidationError) throw error;
      const err = error as { message?: string };
      console.error('Error updating user role:', error);
      throw new Error(`Failed to update user role: ${err?.message || 'Unknown error'}`);
    }
  },

  /**
   * Get all users with cohort information (admin only)
   */
  async getAllUsersWithCohorts(): Promise<UserWithCohort[]> {
    try {
      const supabase = createBrowserSupabaseClient();
      const { data, error } = await supabase
        .from('users')
        .select(`
          *,
          cohort:cohorts(*)
        `)
        .order('created_at', { ascending: false })
        .limit(1000);

      if (error) throw error;
      return (data || []) as UserWithCohort[];
    } catch (error) {
      console.error('Error getting all users with cohorts:', error);
      throw new Error('Failed to get users');
    }
  },

  /**
   * Check if user is admin
   */
  async isAdmin(userId: string): Promise<boolean> {
    try {
      validateUUID(userId, 'userId');
      const supabase = createBrowserSupabaseClient();
      const { data, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        .single();

      if (error || !data) return false;
      return data.role === 'admin';
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  },

  /**
   * Get all users with cohorts and their assignment progress
   * Optimized to fetch all data in 2 queries instead of N+1 queries
   */
  async getUsersWithProgress(): Promise<UserWithCohort[]> {
    try {
      const supabase = createBrowserSupabaseClient();

      // Get all users with cohorts
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select(`
          *,
          cohort:cohorts(*)
        `)
        .order('created_at', { ascending: false })
        .limit(1000);

      if (usersError) throw usersError;

      // Get assignment counts for ALL users in ONE query
      const { data: assignmentCounts, error: countsError } = await supabase
        .from('user_bill_assignments')
        .select('user_id, status');

      if (countsError) throw countsError;

      // Group counts by user_id
      // Progress = in_progress + completed
      const progressByUser = (assignmentCounts || []).reduce((acc, assignment) => {
        if (!acc[assignment.user_id]) {
          acc[assignment.user_id] = { total: 0, completed: 0 };
        }
        acc[assignment.user_id].total++;
        // Only count in_progress and completed as "progress"
        if (assignment.status === 'in_progress' || assignment.status === 'completed') {
          acc[assignment.user_id].completed++;
        }
        return acc;
      }, {} as Record<string, { total: number; completed: number }>);

      // Combine users with their progress
      return (users || []).map(user => ({
        ...user,
        progress: progressByUser[user.id] || { total: 0, completed: 0 }
      })) as any; // Type assertion needed because we're adding progress property
    } catch (error) {
      console.error('Error getting users with progress:', error);
      throw new Error('Failed to get users with progress');
    }
  },

  /**
   * Get all assignments with user and bill information (admin only)
   * Optimized to fetch all data in 2 queries
   */
  async getAllAssignmentsWithUsers(): Promise<Array<{
    assignmentId: string;
    billId: string;
    userId: string;
    userName: string;
    userEmail: string;
  }>> {
    try {
      const supabase = createBrowserSupabaseClient();

      // Get all assignments
      const { data: assignments, error: assignmentsError } = await supabase
        .from('user_bill_assignments')
        .select('id, bill_id, user_id');

      if (assignmentsError) throw assignmentsError;

      // Get all users for mapping
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('id, name, email');

      if (usersError) throw usersError;

      // Create user map
      const userMap = new Map<string, { name: string; email: string }>();
      (users || []).forEach(u => {
        userMap.set(u.id, {
          name: u.name || u.email || 'Unknown',
          email: u.email || '',
        });
      });

      return (assignments || []).map(a => {
        const user = userMap.get(a.user_id);
        return {
          assignmentId: a.id,
          billId: a.bill_id,
          userId: a.user_id,
          userName: user?.name || 'Unknown',
          userEmail: user?.email || '',
        };
      });
    } catch (error) {
      console.error('Error getting all assignments:', error);
      throw new Error('Failed to get assignments');
    }
  }
};

