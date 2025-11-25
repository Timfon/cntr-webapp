import { createBrowserSupabaseClient } from '@/lib/supabase/client';
import { User, UserRole, UserWithCohort, UserWithStatistics, Bill } from '@/types/database';
import {
  validateUUID,
  validateUserRole,
  ValidationError
} from '@/utils/validation';
import { statisticsService } from './statistics';

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
        .maybeSingle();

      if (error || !data) return false;
      return data.role === 'admin';
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  },

  /**
   * Get all users with cohorts and their assignment progress
   */
  async getUsersWithProgress(): Promise<UserWithStatistics[]> {
    try {
      const supabase = createBrowserSupabaseClient();

      // Get all users with cohorts and their statistics in one query
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select(`
          *,
          cohort:cohorts(*),
          statistics:user_statistics(*)
        `)
        .order('created_at', { ascending: false })
        .limit(1000);

      if (usersError) throw usersError;

      return (users || []) as UserWithStatistics[];
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
  },

  /**
   * Get bills with pagination, assignment status, and search filters
   */
  async getBillsWithAssignments(params: {
    page: number;
    pageSize: number;
    searchTerm?: string;
    state?: string;
    dateRange?: { start: string; end: string };
    assignedUserId?: string;
    billFilter?: 'all' | 'assigned' | 'unassigned';
  }): Promise<{
    bills: Array<Bill & {
      assignees: Array<{
        id: string;
        name: string;
        email: string;
        assignmentId: string;
      }>;
    }>;
    total: number;
    totalPages: number;
  }> {
    try {
      const { 
        page = 1, 
        pageSize = 10, 
        searchTerm, 
        state,
        dateRange,
        assignedUserId,
        billFilter = 'all' 
      } = params;
      const supabase = createBrowserSupabaseClient();
      const offset = (page - 1) * pageSize;

      let billsQuery = supabase
        .from('bills')
        .select('*', { count: 'exact' });

      // Handle search - search across all bill aspects (title, summary, bill_number, state, year)
      if (searchTerm) {
        const escapedSearch = searchTerm.replace(/[%_]/g, '\\$&');
        // Try to parse as year first
        const year = parseInt(escapedSearch);
        if (!isNaN(year) && year > 1900 && year < 2100) {
          // If it's a valid year, search by year OR other fields
          billsQuery = billsQuery.or(
            `year.eq.${year},title.ilike.%${escapedSearch}%,summary.ilike.%${escapedSearch}%,bill_number.ilike.%${escapedSearch}%,state.ilike.%${escapedSearch}%`
          );
        } else {
          // Search across title, summary, bill_number, and state
          billsQuery = billsQuery.or(
            `title.ilike.%${escapedSearch}%,summary.ilike.%${escapedSearch}%,bill_number.ilike.%${escapedSearch}%,state.ilike.%${escapedSearch}%`
          );
        }
      }

      // Handle state filter
      if (state) {
        billsQuery = billsQuery.eq('state', state);
      }

      // Handle date range filter
      if (dateRange?.start) {
        billsQuery = billsQuery.gte('version_date', dateRange.start);
      }
      if (dateRange?.end) {
        billsQuery = billsQuery.lte('version_date', dateRange.end);
      }

      // Handle assigned user filter
      if (assignedUserId) {
        // Get bill IDs assigned to this specific user
        const { data: assignments, error: assignmentsError } = await supabase
          .from('user_bill_assignments')
          .select('bill_id')
          .eq('user_id', assignedUserId);

        if (assignmentsError) throw assignmentsError;

        if (assignments && assignments.length > 0) {
          const billIds = assignments.map(a => a.bill_id);
          billsQuery = billsQuery.in('id', billIds);
        } else {
          // No assignments for this user, return empty
          return { bills: [], total: 0, totalPages: 0 };
        }
      }

      // Handle assigned/unassigned filter
      if (billFilter === 'assigned' || billFilter === 'unassigned') {
        // Get all bill IDs that have assignments
        const { data: allAssignments, error: assignmentsError } = await supabase
          .from('user_bill_assignments')
          .select('bill_id');

        if (assignmentsError) throw assignmentsError;

        const assignedBillIds = new Set((allAssignments || []).map(a => a.bill_id));

        if (billFilter === 'assigned') {
          // Only show bills that have assignments
          if (assignedBillIds.size > 0) {
            billsQuery = billsQuery.in('id', Array.from(assignedBillIds));
          } else {
            // No assigned bills, return empty
            return { bills: [], total: 0, totalPages: 0 };
          }
        } else if (billFilter === 'unassigned') {
          // Only show bills that don't have assignments
          // We'll need to get all bill IDs and filter
          const { data: allBills, error: allBillsError } = await supabase
            .from('bills')
            .select('id');

          if (allBillsError) throw allBillsError;

          const unassignedBillIds = (allBills || [])
            .map(b => b.id)
            .filter(id => !assignedBillIds.has(id));

          if (unassignedBillIds.length > 0) {
            billsQuery = billsQuery.in('id', unassignedBillIds);
          } else {
            // No unassigned bills, return empty
            return { bills: [], total: 0, totalPages: 0 };
          }
        }
      }

      // Apply pagination and ordering
      billsQuery = billsQuery
        .order('state', { ascending: true })
        .order('bill_number', { ascending: true })
        .range(offset, offset + pageSize - 1);

      const { data: bills, error: billsError, count } = await billsQuery;

      if (billsError) throw billsError;

      const total = count || 0;
      const totalPages = Math.ceil(total / pageSize);

      // Get assignments for the returned bills
      if (!bills || bills.length === 0) {
        return { bills: [], total, totalPages };
      }

      const billIds = bills.map(b => b.id);
      const { data: assignments, error: assignmentsError } = await supabase
        .from('user_bill_assignments')
        .select('id, bill_id, user_id')
        .in('bill_id', billIds);

      if (assignmentsError) throw assignmentsError;

      // Get users for the assignments
      const userIds = [...new Set((assignments || []).map(a => a.user_id))];
      let users: Array<{ id: string; name: string | null; email: string }> = [];

      if (userIds.length > 0) {
        const { data: usersData, error: usersError } = await supabase
          .from('users')
          .select('id, name, email')
          .in('id', userIds);

        if (usersError) throw usersError;
        users = usersData || [];
      }

      // Create user map
      const userMap = new Map<string, { name: string; email: string }>();
      users.forEach(u => {
        userMap.set(u.id, {
          name: u.name || u.email || 'Unknown',
          email: u.email || '',
        });
      });

      // Create assignment map by bill ID
      const assignmentsByBill = new Map<string, Array<{
        id: string;
        name: string;
        email: string;
        assignmentId: string;
      }>>();

      (assignments || []).forEach(a => {
        const user = userMap.get(a.user_id);
        if (user) {
          if (!assignmentsByBill.has(a.bill_id)) {
            assignmentsByBill.set(a.bill_id, []);
          }
          assignmentsByBill.get(a.bill_id)!.push({
            id: a.user_id,
            name: user.name,
            email: user.email,
            assignmentId: a.id,
          });
        }
      });

      // Combine bills with assignees
      const billsWithAssignees = bills.map(bill => ({
        ...bill,
        assignees: assignmentsByBill.get(bill.id) || [],
      }));

      return {
        bills: billsWithAssignees,
        total,
        totalPages,
      };
    } catch (error) {
      console.error('Error getting bills with assignments:', error);
      throw new Error('Failed to get bills with assignments');
    }
  }
};

