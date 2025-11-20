import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { billService } from '@/backend/database';
import { Bill } from '@/types/database';

export interface ViewAllBillsState {
  loading: boolean;
  bills: Bill[];
  searchTerm: string;
  selectedState: string | null;
  startDate: string;
  endDate: string;
  currentPage: number;
}

export function useViewAllBillsData() {
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [bills, setBills] = useState<Bill[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const initialize = async () => {
      if (authLoading) {
        return;
      }

      if (!user) {
        setLoading(false);
        return;
      }

      await loadBills();
      setLoading(false);
    };

    initialize();
  }, [user, authLoading]);

  const loadBills = async () => {
    try {
      const allBills = await billService.getAllBills();
      setBills(allBills);

      const validDates = allBills
        .map(bill => new Date(bill.version_date || 0).getTime())
        .filter(time => !isNaN(time) && time > 0);

      if (validDates.length > 0) {
        const minStr = new Date(Math.min(...validDates)).toISOString().split('T')[0];
        const maxStr = new Date(Math.max(...validDates)).toISOString().split('T')[0];
        setStartDate(minStr);
        setEndDate(maxStr);
      }
    } catch (error) {
      console.error('Error loading bills:', error);
      setBills([]);
    }
  };

  const filteredBills = useMemo(() => {
    let filtered = bills.filter(bill => {
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const billId = `${bill.state} ${bill.bill_number || ''}`.toLowerCase();
        const title = (bill.title || '').toLowerCase();
        const summary = (bill.summary || '').toLowerCase();
        if (!billId.includes(searchLower) && !title.includes(searchLower) && !summary.includes(searchLower)) {
          return false;
        }
      }

      if (selectedState && bill.state !== selectedState) return false;

      if (startDate && endDate) {
        const billTime = new Date(bill.version_date || 0).getTime();
        const startTime = new Date(startDate).setHours(0, 0, 0, 0);
        const endTime = new Date(endDate).setHours(23, 59, 59, 999);
        if (isNaN(billTime) || billTime < startTime || billTime > endTime) return false;
      }

      return true;
    });

    filtered.sort((a, b) => {
      const dateA = new Date(a.version_date || 0).getTime();
      const dateB = new Date(b.version_date || 0).getTime();
      return dateB - dateA;
    });

    return filtered;
  }, [bills, searchTerm, selectedState, startDate, endDate]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedState, startDate, endDate]);

  const uniqueStates = useMemo(() => {
    return [...new Set(bills.map(b => b.state))].sort();
  }, [bills]);

  return {
    loading: loading || authLoading,
    bills,
    filteredBills,
    uniqueStates,
    searchTerm,
    setSearchTerm,
    selectedState,
    setSelectedState,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    currentPage,
    setCurrentPage,
  };
}
