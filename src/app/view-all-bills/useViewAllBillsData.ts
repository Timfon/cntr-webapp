import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { billService } from '@/backend/database';
import { Bill } from '@/types/database';

const BILLS_PER_PAGE = 30;

export interface UseViewAllBillsDataReturn {
  loading: boolean;
  bills: Bill[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  activeSearchTerm: string;
  setActiveSearchTerm: (term: string) => void;
  selectedState: string | null;
  setSelectedState: (state: string | null) => void;
  startDate: string;
  setStartDate: (date: string) => void;
  endDate: string;
  setEndDate: (date: string) => void;
  uniqueStates: string[];
  handleSearchKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  handleSearchClick: () => void;
  handleClearSearch: () => void;
  handleDateRangeChange: (start: string, end: string) => void;
  handleDateRangeClear: () => void;
  handlePageChange: (_: unknown, value: number) => void;
}

export function useViewAllBillsData(): UseViewAllBillsDataReturn {
  const { loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [bills, setBills] = useState<Bill[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSearchTerm, setActiveSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [uniqueStates, setUniqueStates] = useState<string[]>([]);

  // Load unique states once on mount
  useEffect(() => {
    const loadStates = async () => {
      try {
        const result = await billService.getBills({ page: 1, pageSize: 1000 });
        const states = [...new Set(result.bills.map(b => b.state))].sort();
        setUniqueStates(states);
      } catch (error) {
        console.error('Error loading states:', error);
      }
    };
    if (!authLoading) {
      loadStates();
    }
  }, [authLoading]);

  // Load bills with server-side pagination
  const loadBills = useCallback(async (page: number = 1) => {
    try {
      setLoading(true);
      
      const result = await billService.getBills({
        page,
        pageSize: BILLS_PER_PAGE,
        search: activeSearchTerm || undefined,
        state: selectedState || undefined,
        dateRange: startDate && endDate ? { start: startDate, end: endDate } : undefined,
        orderBy: 'version_date',
        ascending: false, // Newest first
      });

      setBills(result.bills);
      setTotalCount(result.total);
      setTotalPages(Math.ceil(result.total / BILLS_PER_PAGE));
    } catch (error) {
      console.error('Error loading bills:', error);
      setBills([]);
      setTotalCount(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [activeSearchTerm, selectedState, startDate, endDate]);

  useEffect(() => {
    if (authLoading) return;
    loadBills(currentPage);
  }, [currentPage, loadBills, authLoading]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeSearchTerm, selectedState, startDate, endDate]);

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setActiveSearchTerm(searchTerm);
    }
  };

  const handleSearchClick = () => {
    setActiveSearchTerm(searchTerm);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setActiveSearchTerm('');
  };

  const handleDateRangeChange = (start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);
  };

  const handleDateRangeClear = () => {
    setStartDate('');
    setEndDate('');
  };

  const handlePageChange = (_: unknown, value: number) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return {
    loading,
    bills,
    totalCount,
    totalPages,
    currentPage,
    setCurrentPage,
    searchTerm,
    setSearchTerm,
    activeSearchTerm,
    setActiveSearchTerm,
    selectedState,
    setSelectedState,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    uniqueStates,
    handleSearchKeyPress,
    handleSearchClick,
    handleClearSearch,
    handleDateRangeChange,
    handleDateRangeClear,
    handlePageChange,
  };
}

