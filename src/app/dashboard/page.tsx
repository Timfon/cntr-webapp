"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Container } from '@mui/material';
import { assignmentService, draftService } from '@/backend/database';
import ResponsiveAppBar from '@/app/components/ResponsiveAppBar';
import Footer from '@/app/components/Footer';
import Loading from '@/app/components/Loading';
import { colors } from '@/app/theme/colors';
import { useDashboardData } from './useDashboardData';
import DashboardStats from './DashboardStats';
import DashboardFilters from './DashboardFilters';
import BillSection from './BillSection';
import { ConfirmStartDialog, AlertDialog } from './DashboardDialogs';
import { FilterType } from '@/types/dashboard';

export default function DashboardPage() {
  const router = useRouter();
  const {
    loading,
    currentUserId,
    bills,
    stats,
    error,
    setError,
    refreshBills,
  } = useDashboardData();

  const [filter, setFilter] = useState<FilterType>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    billId: '',
    assignmentId: '',
  });
  const [alertMessage, setAlertMessage] = useState('');
  const [expandedBills, setExpandedBills] = useState<Set<string>>(new Set());

  const filteredBills = bills.filter((bill) => {
    const matchesFilter = filter === 'all' || bill.status === filter;
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      bill.name.toLowerCase().includes(searchLower) ||
      bill.description.toLowerCase().includes(searchLower) ||
      bill.billIdentifier.toLowerCase().includes(searchLower);
    return matchesFilter && matchesSearch;
  });

  const handleContinue = (billId: string) => {
    router.push(`/scorecard?bill=${encodeURIComponent(billId)}`);
  };

  const handleScoreBill = async (billId: string) => {
    try {
      if (!currentUserId) {
        return;
      }

      const inProgressAssignment = await assignmentService.getUserInProgressAssignment(currentUserId);
      if (inProgressAssignment) {
        setAlertMessage('You already have a bill in progress. Please complete it before starting another one.');
        return;
      }

      const billData = bills.find(b => b.id === billId);
      setConfirmDialog({
        open: true,
        billId,
        assignmentId: billData?.assignmentId || '',
      });
    } catch (err) {
      setAlertMessage('Failed to start bill. Please try again.');
    }
  };

  const confirmStartBill = async () => {
    try {
      if (!currentUserId) {
        return;
      }

      const { billId, assignmentId } = confirmDialog;

      if (assignmentId) {
        await assignmentService.updateAssignmentStatus(currentUserId, assignmentId, 'in_progress');
        await draftService.saveDraft(currentUserId, billId, assignmentId, {
          answers: {},
          flags: {},
          currentSection: 'general'
        });
      }

      setConfirmDialog({ open: false, billId: '', assignmentId: '' });
      await refreshBills();
      router.push(`/scorecard?bill=${encodeURIComponent(billId)}`);
    } catch (err) {
      setAlertMessage('Failed to start bill. Please try again.');
    }
  };

  const handleViewBill = async (billId: string) => {
    try {
      if (!currentUserId) {
        return;
      }

      const assignments = await assignmentService.getUserAssignments(currentUserId, 'completed');
      const assignment = assignments.find(a => a.bill_id === billId);

      if (!assignment) {
        setAlertMessage('Submission not found for this bill.');
        return;
      }

      router.push(`/scorecard/view-submission?bill=${encodeURIComponent(billId)}`);
    } catch (err) {
      setAlertMessage('Failed to load submission. Please try again.');
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: colors.background.main }}>
      <ResponsiveAppBar />
      <Container maxWidth={false} sx={{ py: 4, px: 4 }}>
        <DashboardFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filter={filter}
          onFilterChange={setFilter}
        />
        <DashboardStats stats={stats} />
        <BillSection
          bills={filteredBills}
          expandedBills={expandedBills}
          setExpandedBills={setExpandedBills}
          onContinue={handleContinue}
          onScoreBill={handleScoreBill}
          onViewBill={handleViewBill}
        />
      </Container>

      <ConfirmStartDialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, billId: '', assignmentId: '' })}
        onConfirm={confirmStartBill}
      />

      <AlertDialog
        open={!!alertMessage || !!error}
        message={alertMessage || error || ''}
        onClose={() => {
          setAlertMessage('');
          setError(null);
        }}
      />

      <Footer />
    </Box>
  );
}
