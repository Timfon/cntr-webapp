import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/backend/auth';
import { assignmentService } from '@/backend/database';
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
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
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

      const inProgressCount = billsData.filter(b => b.status === 'inProgress').length;
      const assignedCount = billsData.filter(b => b.status === 'assigned').length;
      const scoredCount = billsData.filter(b => b.status === 'scored').length;

      setStats({
        total: billsData.length,
        inProgress: inProgressCount,
        // Assigned includes both 'assigned' and 'inProgress' bills
        assigned: assignedCount + inProgressCount,
        scored: scoredCount,
      });
    } catch (err: any) {
      console.error('Error loading user bills:', err);
      setError(`Failed to load bills: ${err?.message || 'Unknown error'}.`);
      setBills([]);
      setStats({ total: 0, inProgress: 0, assigned: 0, scored: 0 });
    }
  };

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged(async (user) => {
      if (!user) {
        setLoading(false);
        router.push('/signin');
      } else {
        setCurrentUserId(user.id);
        const hasCompleted = await authService.hasCompletedProfile(user.id);
        if (!hasCompleted) {
          setLoading(false);
          router.push('/signup/account');
          return;
        }

        await loadUserBills(user.id);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

  const refreshBills = async () => {
    if (currentUserId) {
      await loadUserBills(currentUserId);
    }
  };

  return {
    loading,
    currentUserId,
    bills,
    stats,
    error,
    setError,
    refreshBills,
  };
}
