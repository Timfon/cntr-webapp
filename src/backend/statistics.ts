import { createBrowserSupabaseClient } from '@/lib/supabase/client';
import { BillAssignmentOverview, UserStatistics } from '@/types/database';
import { validateUUID, ValidationError } from '@/utils/validation';

/**
 * Statistics Service
 * Handles queries to auto-maintained statistics tables
 * Note: These tables are automatically updated by database triggers,
 * so this service is read-only.
 */
export const statisticsService = {
  /**
   * Get statistics for a specific user
   * @param userId - User ID to get statistics for
   * @returns User statistics or null if no assignments exist
   */
  async getUserStatistics(userId: string): Promise<UserStatistics | null> {
    try {
      validateUUID(userId, 'userId');

      const supabase = createBrowserSupabaseClient();
      const { data, error } = await supabase
        .from('user_statistics')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;
      return data as UserStatistics | null;
    } catch (error) {
      if (error instanceof ValidationError) throw error;
      console.error('Error getting user statistics:', error);
      throw new Error('Failed to get user statistics');
    }
  },

  /**
   * Get statistics for multiple users (bulk query)
   * @param userIds - Array of user IDs
   * @returns Map of userId to statistics
   */
  async getBulkUserStatistics(userIds: string[]): Promise<Map<string, UserStatistics>> {
    try {
      userIds.forEach(id => validateUUID(id, 'userId'));

      const supabase = createBrowserSupabaseClient();
      const { data, error } = await supabase
        .from('user_statistics')
        .select('*')
        .in('user_id', userIds);

      if (error) throw error;

      const statisticsMap = new Map<string, UserStatistics>();
      (data || []).forEach((stat: UserStatistics) => {
        statisticsMap.set(stat.user_id, stat);
      });

      return statisticsMap;
    } catch (error) {
      if (error instanceof ValidationError) throw error;
      console.error('Error getting bulk user statistics:', error);
      throw new Error('Failed to get bulk user statistics');
    }
  },

  /**
   * Get all user statistics (admin only - for dashboard)
   * @returns Array of all user statistics
   */
  async getAllUserStatistics(): Promise<UserStatistics[]> {
    try {
      const supabase = createBrowserSupabaseClient();
      const { data, error } = await supabase
        .from('user_statistics')
        .select('*')
        .order('total_bills_assigned', { ascending: false });

      if (error) throw error;
      return (data || []) as UserStatistics[];
    } catch (error) {
      console.error('Error getting all user statistics:', error);
      throw new Error('Failed to get all user statistics');
    }
  },

  /**
   * Get assignment overview for a specific bill
   * @param billId - Bill ID to get overview for
   * @returns Bill assignment overview or null if no assignments exist
   */
  async getBillOverview(billId: string): Promise<BillAssignmentOverview | null> {
    try {
      validateUUID(billId, 'billId');

      const supabase = createBrowserSupabaseClient();
      const { data, error } = await supabase
        .from('bill_assignment_overview')
        .select('*')
        .eq('bill_id', billId)
        .maybeSingle();

      if (error) throw error;
      return data as BillAssignmentOverview | null;
    } catch (error) {
      if (error instanceof ValidationError) throw error;
      console.error('Error getting bill overview:', error);
      throw new Error('Failed to get bill overview');
    }
  },

  /**
   * Get assignment overview for multiple bills (bulk query)
   * @param billIds - Array of bill IDs
   * @returns Map of billId to overview
   */
  async getBulkBillOverview(billIds: string[]): Promise<Map<string, BillAssignmentOverview>> {
    try {
      billIds.forEach(id => validateUUID(id, 'billId'));

      const supabase = createBrowserSupabaseClient();
      const { data, error } = await supabase
        .from('bill_assignment_overview')
        .select('*')
        .in('bill_id', billIds);

      if (error) throw error;

      const overviewMap = new Map<string, BillAssignmentOverview>();
      (data || []).forEach((overview: BillAssignmentOverview) => {
        overviewMap.set(overview.bill_id, overview);
      });

      return overviewMap;
    } catch (error) {
      if (error instanceof ValidationError) throw error;
      console.error('Error getting bulk bill overview:', error);
      throw new Error('Failed to get bulk bill overview');
    }
  },

  /**
   * Get all bill overviews (admin only - for dashboard)
   * @returns Array of all bill assignment overviews
   */
  async getAllBillOverviews(): Promise<BillAssignmentOverview[]> {
    try {
      const supabase = createBrowserSupabaseClient();
      const { data, error } = await supabase
        .from('bill_assignment_overview')
        .select('*')
        .order('total_assigned', { ascending: false });

      if (error) throw error;
      return (data || []) as BillAssignmentOverview[];
    } catch (error) {
      console.error('Error getting all bill overviews:', error);
      throw new Error('Failed to get all bill overviews');
    }
  },

  /**
   * Get aggregate statistics across all users
   * Useful for admin dashboard summary
   */
  async getAggregateStatistics(): Promise<{
    totalUsers: number;
    totalAssignments: number;
    totalInProgress: number;
    totalCompleted: number;
    totalNotStarted: number;
  }> {
    try {
      const supabase = createBrowserSupabaseClient();
      const { data, error } = await supabase
        .from('user_statistics')
        .select('*');

      if (error) throw error;

      const stats = (data || []).reduce(
        (acc, userStat: UserStatistics) => {
          acc.totalUsers++;
          acc.totalAssignments += userStat.total_bills_assigned;
          acc.totalInProgress += userStat.bills_in_progress;
          acc.totalCompleted += userStat.bills_completed;
          acc.totalNotStarted += userStat.bills_not_started;
          return acc;
        },
        {
          totalUsers: 0,
          totalAssignments: 0,
          totalInProgress: 0,
          totalCompleted: 0,
          totalNotStarted: 0,
        }
      );

      return stats;
    } catch (error) {
      console.error('Error getting aggregate statistics:', error);
      throw new Error('Failed to get aggregate statistics');
    }
  },
};
