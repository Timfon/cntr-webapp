import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { authService } from '@/backend/auth';
import { assignmentService, statisticsService } from '@/backend/database';
import { UserBillAssignmentWithBill } from '@/types/database';

export interface BillData {
  id: string;
  assignmentId: string;
  name: string;
  date: string;
  description: string;
  status: 'inProgress' | 'assigned' | 'scored';
  billIdentifier: string;
}

export interface DashboardStats {
  total: number;
  assigned: number;
  scored: number;
  inProgress: number;
}

export function useDashboardData() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [bills, setBills] = useState<BillData[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    total: 0,
    assigned: 0,
    scored: 0,
    inProgress: 0,
  });
  const [error, setError] = useState<string | null>(null);

  const loadUserBills = async (uid: string) => {
    try {
      const assignments = await assignmentService.getUserAssignments(uid);
      const billsData: BillData[] = [];

      const createBillData = (
        assignment: UserBillAssignmentWithBill,
        status: 'inProgress' | 'assigned' | 'scored'
      ): BillData => {
        const bill = assignment.bill;
        const billIdShort = `${bill.state} ${bill.bill_number || ''}`;
        return {
          id: bill.id,
          assignmentId: assignment.id,
          name: billIdShort,
          date: bill.version_date || '',
          description: bill.summary || bill.title || 'No description available',
          status,
          billIdentifier: billIdShort,
        };
      };

      assignments.forEach((assignment) => {
        let status: 'inProgress' | 'assigned' | 'scored';
        if (assignment.status === 'in_progress') {
          status = 'inProgress';
        } else if (assignment.status === 'completed') {
          status = 'scored';
        } else {
          status = 'assigned';
        }
        billsData.push(createBillData(assignment, status));
      });

      setBills(billsData);

      const userStats = await statisticsService.getUserStatistics(uid);

      if (userStats) {
        setStats({
          total: userStats.total_bills_assigned,
          inProgress: userStats.bills_in_progress,
          assigned: userStats.bills_not_started + userStats.bills_in_progress,
          scored: userStats.bills_completed,
        });
      } else {
        // Fallback if no statistics exist (no assignments yet)
        setStats({
          total: 0,
          inProgress: 0,
          assigned: 0,
          scored: 0,
        });
      }
    } catch (err: any) {
      console.error('Error loading user bills:', err);
      setError(`Failed to load bills: ${err?.message || 'Unknown error'}.`);
      setBills([]);
      setStats({ total: 0, inProgress: 0, assigned: 0, scored: 0 });
    }
  };

  useEffect(() => {
    const initializeDashboard = async () => {
      if (authLoading) {
        return;
      }

      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const hasCompleted = await authService.hasCompletedProfile(user.id);
        if (!hasCompleted) {
          setLoading(false);
          router.push('/signup/account');
          return;
        }

        await loadUserBills(user.id);
      } catch (err) {
        console.error('Error initializing dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    initializeDashboard();
  }, [user, authLoading, router]);

  const refreshBills = async () => {
    if (user) {
      await loadUserBills(user.id);
    }
  };

  return {
    loading: loading || authLoading,
    currentUserId: user?.id || null,
    bills,
    stats,
    error,
    setError,
    refreshBills,
  };
}
