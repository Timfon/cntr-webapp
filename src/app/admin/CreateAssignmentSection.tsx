"use client";
import React, { useState, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Autocomplete,
  TextField,
} from '@mui/material';
import { colors } from '@/app/theme/colors';
import { assignmentService } from '@/backend/database';
import { Bill, UserWithCohort } from '@/types/database';

interface BillWithAssignee extends Bill {
  assignees: Array<{
    id: string;
    name: string;
    email: string;
    assignmentId: string;
  }>;
}

interface CreateAssignmentSectionProps {
  users: UserWithCohort[];
  bills: BillWithAssignee[];
  onAssignmentCreated: () => void;
}

export default function CreateAssignmentSection({
  users,
  bills,
  onAssignmentCreated,
}: CreateAssignmentSectionProps) {
  const [selectedBillId, setSelectedBillId] = useState<string>('');
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [creating, setCreating] = useState(false);
  const [billSearchValue, setBillSearchValue] = useState<string>('');
  const [userSearchValue, setUserSearchValue] = useState<string>('');
// UPDATE CURRENT COHORT WHENEVER SEMESTER CHANGES
  const CURRENT_COHORT = 'Fall 2025';

  // All bills are available for assignment
  const availableBills = bills;

  // Filter users to only current cohort
  const currentCohortUsers = useMemo(() => {
    return users.filter(user => user.cohort?.name === CURRENT_COHORT);
  }, [users]);

  // Format bill for display: "PA SB293"
  const formatBillId = (bill: Bill) => `${bill.state} ${bill.bill_number}`;

  // Filter bills based on search input
  const filteredBills = useMemo(() => {
    if (!billSearchValue) return availableBills;
    
    const searchLower = billSearchValue.toLowerCase().trim();
    return availableBills.filter(bill => {
      const billId = formatBillId(bill).toLowerCase();
      return billId.includes(searchLower);
    });
  }, [availableBills, billSearchValue]);

  // Format user for display: "Name" or "Email"
  const formatUser = (user: UserWithCohort) => user.name || user.email || 'Unknown';

  // Filter users based on search input
  const filteredUsers = useMemo(() => {
    if (!userSearchValue) return currentCohortUsers;
    
    const searchLower = userSearchValue.toLowerCase().trim();
    return currentCohortUsers.filter(user => {
      const name = (user.name || '').toLowerCase();
      return name.includes(searchLower);
    });
  }, [currentCohortUsers, userSearchValue]);

  const handleCreateAssignment = async () => {
    if (!selectedBillId || !selectedUserId) {
      alert('Please select both a bill and a user');
      return;
    }

    // Check if user is already assigned to this bill
    const selectedBill = bills.find(b => b.id === selectedBillId);
    if (selectedBill && selectedBill.assignees.some(a => a.id === selectedUserId)) {
      alert('This user is already assigned to this bill.');
      return;
    }

    try {
      setCreating(true);
      await assignmentService.createAssignment(selectedUserId, selectedBillId);
      onAssignmentCreated();
      setSelectedBillId('');
      setSelectedUserId('');
      setBillSearchValue('');
      setUserSearchValue('');
    } catch (error: any) {
      console.error('Error creating assignment:', error);
      alert(error?.message || 'Failed to create assignment');
    } finally {
      setCreating(false);
    }
  };

  return (
    <Card sx={{ backgroundColor: colors.background.white, boxShadow: '0px 1px 3px rgba(0,0,0,0.1)' }}>
      <CardContent>
        <Typography
          variant="h6"
          sx={{
            color: colors.text.primary,
            fontWeight: 600,
            mb: 3,
          }}
        >
          Create New Assignment
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Autocomplete
            freeSolo
            options={filteredBills}
            getOptionLabel={(option) => {
              if (typeof option === 'string') return option;
              return formatBillId(option);
            }}
            inputValue={billSearchValue}
            onInputChange={(_event, newInputValue) => {
              setBillSearchValue(newInputValue);
            }}
            onChange={(_event, newValue) => {
              if (newValue && typeof newValue !== 'string') {
                setSelectedBillId(newValue.id);
                setBillSearchValue(formatBillId(newValue));
              } else if (typeof newValue === 'string' && newValue.trim()) {
                // Try to find bill by typed ID
                const foundBill = availableBills.find(bill => 
                  formatBillId(bill).toLowerCase() === newValue.toLowerCase().trim()
                );
                if (foundBill) {
                  setSelectedBillId(foundBill.id);
                } else {
                  setSelectedBillId('');
                }
              } else {
                setSelectedBillId('');
                setBillSearchValue('');
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Bill"
                placeholder="Type bill ID"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: colors.background.white,
                  },
                }}
              />
            )}
            renderOption={(props, option) => (
              <Box component="li" {...props} key={option.id}>
                <Typography variant="body2">
                  {formatBillId(option)}
                </Typography>
              </Box>
            )}
          />

          <Autocomplete
            freeSolo
            options={filteredUsers}
            getOptionLabel={(option) => {
              if (typeof option === 'string') return option;
              return formatUser(option);
            }}
            inputValue={userSearchValue}
            onInputChange={(_event, newInputValue) => {
              setUserSearchValue(newInputValue);
            }}
            onChange={(_event, newValue) => {
              if (newValue && typeof newValue !== 'string') {
                setSelectedUserId(newValue.id);
                setUserSearchValue(formatUser(newValue));
              } else if (typeof newValue === 'string' && newValue.trim()) {
                // Try to find user by typed name
                const searchLower = newValue.toLowerCase().trim();
                const foundUser = currentCohortUsers.find(user => {
                  const name = (user.name || '').toLowerCase();
                  return name === searchLower;
                });
                if (foundUser) {
                  setSelectedUserId(foundUser.id);
                  setUserSearchValue(formatUser(foundUser));
                } else {
                  setSelectedUserId('');
                }
              } else {
                setSelectedUserId('');
                setUserSearchValue('');
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Assign To"
                placeholder="Type user name"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: colors.background.white,
                  },
                }}
              />
            )}
            renderOption={(props, option) => (
              <Box component="li" {...props} key={option.id}>
                <Typography variant="body2">
                  {formatUser(option)}
                </Typography>
              </Box>
            )}
          />

          <Button
            variant="contained"
            onClick={handleCreateAssignment}
            disabled={!selectedBillId || !selectedUserId || creating}
            sx={{
              backgroundColor: colors.primary,
              color: colors.text.white,
              py: 1.5,
              '&:hover': {
                backgroundColor: colors.primaryHover,
              },
              '&:disabled': {
                backgroundColor: colors.neutral.gray300,
              },
            }}
          >
            {creating ? 'Creating...' : 'Create Assignment'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

