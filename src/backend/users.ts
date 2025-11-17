import { createBrowserSupabaseClient } from '@/lib/supabase/client';
import { User, UserRole } from '@/types/database';
import {
  validateUUID,
  validateEmail,
  validateString,
  validateUserRole,
  ValidationError
} from '@/utils/validation';

/**
 * User Management Service
 * Handles all user operations including profiles and roles
 */
export const userService = {
  /**
   * Create user profile
   */
  async createUser(userData: {
    id: string;
    email: string;
    name: string;
    role?: UserRole;
    cohort_id?: string;
  }): Promise<void> {
    try {
      // Validate inputs
      validateUUID(userData.id, 'id');
      validateEmail(userData.email);
      validateString(userData.name, 'name', { minLength: 1, maxLength: 200 });
      if (userData.role) {
        validateUserRole(userData.role);
      }
      if (userData.cohort_id) {
        validateUUID(userData.cohort_id, 'cohort_id');
      }

      const supabase = createBrowserSupabaseClient();
      const { error } = await supabase.from('users').insert({
        id: userData.id,
        email: userData.email,
        name: userData.name,
        role: userData.role || 'general',
        cohort_id: userData.cohort_id || null
      });

      if (error) {
        console.error('Supabase error creating user:', error.message, error.code, error.details);
        throw error;
      }
    } catch (error: unknown) {
      if (error instanceof ValidationError) throw error;
      const err = error as { message?: string };
      console.error('Error creating user:', err?.message || error);
      throw new Error(`Failed to create user: ${err?.message || 'Unknown error'}`);
    }
  },

  /**
   * Get user by ID
   */
  async getUser(userId: string): Promise<User | null> {
    try {
      validateUUID(userId, 'userId');

      const supabase = createBrowserSupabaseClient();
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        throw error;
      }
      return data as User;
    } catch (error) {
      if (error instanceof ValidationError) throw error;
      console.error('Error getting user:', error);
      throw new Error('Failed to get user');
    }
  },

  /**
   * Update user profile (users can only update their own profile)
   * Note: Role changes to 'admin' are blocked for security
   * @param currentUserId - ID of the user making the request
   * @param userId - ID of the user to update
   * @param updates - Fields to update
   */
  async updateUser(
    currentUserId: string,
    userId: string,
    updates: Partial<Pick<User, 'name' | 'role' | 'cohort_id'>>
  ): Promise<void> {
    try {
      // Validate inputs
      validateUUID(currentUserId, 'currentUserId');
      validateUUID(userId, 'userId');

      // Authorization: Users can only update their own profile
      if (currentUserId !== userId) {
        throw new Error('Not authorized to update another user\'s profile');
      }

      // Security: Prevent role escalation to admin
      if (updates.role === 'admin') {
        throw new Error('Cannot set role to admin');
      }

      // Validate update fields
      if (updates.name !== undefined && updates.name !== null) {
        validateString(updates.name, 'name', { minLength: 1, maxLength: 200 });
      }
      if (updates.role !== undefined) {
        validateUserRole(updates.role);
      }
      if (updates.cohort_id !== undefined && updates.cohort_id !== null) {
        validateUUID(updates.cohort_id, 'cohort_id');
      }

      const supabase = createBrowserSupabaseClient();
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId)
        .select();

      if (error) {
        console.error('Supabase error updating user:', error.message, error.code, error.details);
        if (
          error.code === '42501' ||
          error.code === 'PGRST301' ||
          error.message?.includes('permission denied') ||
          error.message?.includes('row-level security')
        ) {
          throw new Error('Permission denied: Please check Row Level Security policies.');
        }
        throw error;
      }

      if (!data || data.length === 0) {
        throw new Error('Update failed: No rows were updated.');
      }
    } catch (error: unknown) {
      if (error instanceof ValidationError) throw error;
      const err = error as { message?: string };
      console.error('Error updating user:', error);
      if (err?.message && !err.message.includes('Failed to update user')) {
        throw error;
      }
      throw new Error(`Failed to update user: ${err?.message || 'Unknown error'}`);
    }
  },

  /**
   * Get all users (admin only - relies on RLS)
   * Limited to 1000 users for safety
   */
  async getAllUsers(): Promise<User[]> {
    try {
      const supabase = createBrowserSupabaseClient();
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1000); // Safety limit

      if (error) throw error;
      return (data || []) as User[];
    } catch (error) {
      console.error('Error getting all users:', error);
      throw new Error('Failed to get users');
    }
  },

  /**
   * Get users by role
   */
  async getUsersByRole(role: UserRole): Promise<User[]> {
    try {
      validateUserRole(role);

      const supabase = createBrowserSupabaseClient();
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('role', role)
        .order('created_at', { ascending: false })
        .limit(1000); // Safety limit

      if (error) throw error;
      return (data || []) as User[];
    } catch (error) {
      if (error instanceof ValidationError) throw error;
      console.error('Error getting users by role:', error);
      throw new Error('Failed to get users');
    }
  }
};
