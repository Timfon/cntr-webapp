"use client";
import React, { useState, useMemo } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
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

interface AssignBillDialogProps {
  open: boolean;
  onClose: () => void;
  bill: BillWithAssignee;
  users: UserWithCohort[];
  onAssignmentCreated: () => void;
}
// UPDATE CURRENT COHORT WHENEVER SEMESTER CHANGES
const CURRENT_COHORT = 'Fall 2025';
const MAX_ASSIGNEES_PER_BILL = 3;

export default function AssignBillDialog({
  open,
  onClose,
  bill,
  users,
  onAssignmentCreated,
}: AssignBillDialogProps) {
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [assigning, setAssigning] = useState(false);
  const [userSearchValue, setUserSearchValue] = useState<string>('');

  // Filter users to only current cohort
  const currentCohortUsers = useMemo(() => {
    return users.filter(user => user.cohort?.name === CURRENT_COHORT);
  }, [users]);

  // Format user for display: "Name"
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

  const handleAssign = async () => {
    if (!selectedUserId) return;

    // Check if bill already has max assignees
    if (bill.assignees.length >= MAX_ASSIGNEES_PER_BILL) {
      alert(`This bill already has ${MAX_ASSIGNEES_PER_BILL} assignees. Maximum is ${MAX_ASSIGNEES_PER_BILL}.`);
      return;
    }

    // Check if user is already assigned to this bill
    if (bill.assignees.some(a => a.id === selectedUserId)) {
      alert('This user is already assigned to this bill.');
      return;
    }

    try {
      setAssigning(true);
      await assignmentService.createAssignment(selectedUserId, bill.id);
      onAssignmentCreated();
      onClose();
      setSelectedUserId('');
      setUserSearchValue('');
    } catch (error: any) {
      console.error('Error assigning bill:', error);
      alert(error?.message || 'Failed to assign bill');
    } finally {
      setAssigning(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 600, color: colors.text.primary, fontSize: '1.5rem' }}>
          {bill.title}
        </Typography>
        <Box sx={{ mt: 1, display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
          <Typography
            variant="body2"
            component="span"
            sx={{
              color: colors.primary,
              textDecoration: 'underline',
              fontWeight: 500,
            }}
          >
            {bill.state} {bill.bill_number}
          </Typography>
          {bill.assignees.length > 0 ? (
            <>
              {bill.assignees.map((assignee) => (
                <Chip
                  key={assignee.id}
                  label={assignee.name}
                  size="small"
                  sx={{
                    backgroundColor: colors.sidebar.activeBackground,
                    color: colors.text.primary,
                    fontSize: '0.75rem',
                  }}
                />
              ))}
              <Chip
                label={`${bill.assignees.length}/${MAX_ASSIGNEES_PER_BILL}`}
                size="small"
                sx={{
                  backgroundColor: colors.neutral.gray200,
                  color: colors.text.secondary,
                  fontSize: '0.75rem',
                }}
              />
            </>
          ) : (
            <Chip
              label="No Assignee"
              size="small"
              sx={{
                backgroundColor: colors.neutral.gray200,
                color: colors.text.secondary,
                fontSize: '0.75rem',
              }}
            />
          )}
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2" sx={{ color: colors.text.primary, fontWeight: 500 }}>
            Assign bill to:
          </Typography>
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
            sx={{ flexGrow: 1, minWidth: 200 }}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Type user name"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: colors.sidebar.activeBackground,
                    border: `1px solid ${colors.primary}`,
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: colors.primary,
                    },
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
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={onClose}
          sx={{
            color: colors.text.secondary,
            borderColor: colors.border.light,
            '&:hover': {
              borderColor: colors.border.default,
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleAssign}
          variant="contained"
          disabled={!selectedUserId || assigning}
          sx={{
            backgroundColor: colors.primary,
            '&:hover': {
              backgroundColor: colors.primaryHover,
            },
            '&:disabled': {
              backgroundColor: colors.neutral.gray300,
            },
          }}
        >
          {assigning ? 'Assigning...' : 'Assign Bill'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

