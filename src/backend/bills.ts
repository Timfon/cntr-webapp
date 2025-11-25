import { createBrowserSupabaseClient } from '@/lib/supabase/client';
import { Bill } from '@/types/database';
import {
  validateUUID,
  validateString,
  validateSearchString,
  validatePagination,
  validateOrderByColumn,
  validateDateString,
  ValidationError
} from '@/utils/validation';

// Allowed columns for sorting bills
const ALLOWED_BILL_COLUMNS = ['state', 'bill_number', 'title', 'version_date', 'created_at'];

/**
 * Handles all bill operations in database
 */
export const billService = {
  /**
   * Get bill by ID
   * Accessible to all authenticated users
   */
  async getBill(billId: string): Promise<Bill | null> {
    try {
      validateUUID(billId, 'billId');

      const supabase = createBrowserSupabaseClient();
      const { data, error } = await supabase
        .from('bills')
        .select('*')
        .eq('id', billId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        throw error;
      }
      return data as Bill;
    } catch (error) {
      if (error instanceof ValidationError) throw error;
      console.error('Error getting bill:', error);
      throw new Error('Failed to get bill');
    }
  },

  /**
   * Get bill by external_id (legacy support)
   * Accessible to all authenticated users
   */
  async getBillByExternalId(externalId: string): Promise<Bill | null> {
    try {
      validateString(externalId, 'externalId', { maxLength: 500 });

      const supabase = createBrowserSupabaseClient();
      const { data, error } = await supabase
        .from('bills')
        .select('*')
        .eq('external_id', externalId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        throw error;
      }
      return data as Bill;
    } catch (error) {
      if (error instanceof ValidationError) throw error;
      console.error('Error getting bill by external ID:', error);
      throw new Error('Failed to get bill');
    }
  },

  /**
   * Get bills with pagination, search, and filters
   * Accessible to all authenticated users
   */
  async getBills(options: {
    page?: number;
    pageSize?: number;
    search?: string;
    state?: string;
    dateRange?: { start: string; end: string };
    orderBy?: string;
    ascending?: boolean;
  } = {}): Promise<{ bills: Bill[]; total: number; hasMore: boolean }> {
    try {
      const supabase = createBrowserSupabaseClient();

      const { page: validPage, pageSize: validPageSize } = validatePagination(
        options.page,
        options.pageSize
      );

      const sanitizedSearch = validateSearchString(options.search || '');

      const validOrderBy = validateOrderByColumn(
        options.orderBy || 'state',
        ALLOWED_BILL_COLUMNS
      );

      if (options.state) {
        validateString(options.state, 'state', { maxLength: 50 });
      }

      if (options.dateRange?.start) {
        validateDateString(options.dateRange.start, 'dateRange.start');
      }
      if (options.dateRange?.end) {
        validateDateString(options.dateRange.end, 'dateRange.end');
      }

      const from = (validPage - 1) * validPageSize;
      const to = from + validPageSize - 1;

      let query = supabase.from('bills').select('*', { count: 'exact' });

      if (sanitizedSearch) {
        // Use parameterized-like approach by escaping special characters
        const escapedSearch = sanitizedSearch.replace(/[%_]/g, '\\$&');
        query = query.or(
          `title.ilike.%${escapedSearch}%,summary.ilike.%${escapedSearch}%,bill_number.ilike.%${escapedSearch}%`
        );
      }

      if (options.state) {
        query = query.eq('state', options.state);
      }

      if (options.dateRange?.start) {
        query = query.gte('version_date', options.dateRange.start);
      }
      if (options.dateRange?.end) {
        query = query.lte('version_date', options.dateRange.end);
      }

      query = query.order(validOrderBy, { ascending: options.ascending !== false });
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) {
        console.error('Error fetching bills:', error);
        throw error;
      }

      const total = count || 0;
      const hasMore = to < total - 1;

      return {
        bills: (data || []) as Bill[],
        total,
        hasMore
      };
    } catch (error: unknown) {
      if (error instanceof ValidationError) throw error;
      console.error('Error getting bills:', error);
      const err = error as { code?: string; message?: string };
      if (err?.code === 'PGRST301') {
        throw new Error('Permission denied: Check your Supabase RLS policies');
      }
      throw new Error(`Failed to get bills: ${err?.message || 'Unknown error'}`);
    }
  },

  /**
   * Get all bills (use with caution - prefer getBills with pagination)
   * Limited to 5000 bills
   */
  async getAllBills(): Promise<Bill[]> {
    try {
      const supabase = createBrowserSupabaseClient();
      const { data, error } = await supabase
        .from('bills')
        .select('*')
        .order('state', { ascending: true })
        .order('bill_number', { ascending: true })
        .limit(5000); // Safety limit

      if (error) throw error;
      return (data || []) as Bill[];
    } catch (error: unknown) {
      console.error('Error getting all bills:', error);
      const err = error as { message?: string };
      throw new Error(`Failed to get bills: ${err?.message || 'Unknown error'}`);
    }
  }
};
