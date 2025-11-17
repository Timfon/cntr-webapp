import { createBrowserSupabaseClient } from '@/lib/supabase/client';
import { Cohort } from '@/types/database';

/**
 * Cohort Management Service
 */
export const cohortService = {
  /**
   * Get all cohorts
   */
  async getAllCohorts(): Promise<Cohort[]> {
    try {
      const supabase = createBrowserSupabaseClient();
      const { data, error } = await supabase
        .from('cohorts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []) as Cohort[];
    } catch (error) {
      console.error('Error getting cohorts:', error);
      throw new Error('Failed to get cohorts');
    }
  },

  /**
   * Get cohort by ID
   */
  async getCohort(cohortId: string): Promise<Cohort | null> {
    try {
      const supabase = createBrowserSupabaseClient();
      const { data, error } = await supabase
        .from('cohorts')
        .select('*')
        .eq('id', cohortId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        throw error;
      }
      return data as Cohort;
    } catch (error) {
      console.error('Error getting cohort:', error);
      throw new Error('Failed to get cohort');
    }
  },

  /**
   * Get cohort by name
   */
  async getCohortByName(name: string): Promise<Cohort | null> {
    try {
      const supabase = createBrowserSupabaseClient();
      const { data, error } = await supabase
        .from('cohorts')
        .select('*')
        .eq('name', name)
        .maybeSingle();

      if (error) throw error;
      return data as Cohort | null;
    } catch (error) {
      console.error('Error getting cohort by name:', error);
      throw new Error('Failed to get cohort');
    }
  },

  /**
   * Create a new cohort (admin only)
   */
  async createCohort(cohortData: {
    name: string;
    description?: string;
    start_date?: string;
    end_date?: string;
  }): Promise<string> {
    try {
      const supabase = createBrowserSupabaseClient();
      const { data, error } = await supabase
        .from('cohorts')
        .insert({
          name: cohortData.name,
          description: cohortData.description || null,
          start_date: cohortData.start_date || null,
          end_date: cohortData.end_date || null,
        })
        .select('id')
        .single();

      if (error) throw error;
      return data.id;
    } catch (error) {
      console.error('Error creating cohort:', error);
      throw new Error('Failed to create cohort');
    }
  },

  /**
   * Get users in a cohort
   */
  async getCohortUsers(cohortId: string) {
    try {
      const supabase = createBrowserSupabaseClient();
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('cohort_id', cohortId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting cohort users:', error);
      throw new Error('Failed to get cohort users');
    }
  }
};
