"use client";
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Chip,
  Paper,
} from '@mui/material';
import { colors } from '@/app/theme/colors';
import { adminService } from '@/backend/admin';
import { assignmentService } from '@/backend/database';
import { UserWithStatistics, UserRole, UserBillAssignmentWithBill } from '@/types/database';

interface UserProfileDialogProps {
  open: boolean;
  onClose: () => void;
  user: UserWithStatistics;
  currentUserId: string;
  onUserUpdated: () => void;
}

export default function UserProfileDialog({
  open,
  onClose,
  user,
  currentUserId,
  onUserUpdated,
}: UserProfileDialogProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole>(user.role);
  const [bills, setBills] = useState<UserBillAssignmentWithBill[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open && user) {
      setSelectedRole(user.role);
      loadBills();
    }
  }, [open, user]);

  const loadBills = async () => {
    try {
      setLoading(true);
      const assignments = await assignmentService.getUserAssignments(user.id);
      setBills(assignments);
    } catch (error) {
      console.error('Error loading bills:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      if (selectedRole !== user.role) {
        await adminService.updateUserRole(currentUserId, user.id, selectedRole);
        onUserUpdated();
      }
      onClose();
    } catch (error: any) {
      console.error('Error saving user:', error);
      alert(error?.message || 'Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const roleOptions: UserRole[] = ['undergraduate', 'advanced', 'expert', 'legislative_staff', 'general', 'admin'];

  const assignedBills = bills.filter(b => b.status === 'assigned');
  const inProgressBills = bills.filter(b => b.status === 'in_progress');
  const completedBills = bills.filter(b => b.status === 'completed');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_progress':
        return colors.status.success;
      case 'assigned':
        return colors.neutral.gray200;
      case 'completed':
        return colors.neutral.gray200;
      default:
        return colors.neutral.gray200;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'in_progress':
        return 'In Progress';
      case 'assigned':
        return 'Assigned';
      case 'completed':
        return 'Completed';
      default:
        return status;
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
        <Box>
          <Typography variant="h6" component="div" sx={{ fontWeight: 600, color: colors.text.primary, fontSize: '1.5rem' }}>
            {user.name || 'User'}
          </Typography>
          <Typography variant="body2" sx={{ color: colors.text.secondary, mt: 0.5 }}>
            {user.cohort?.name || 'No cohort'} • {user.email}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2" sx={{ color: colors.text.primary, fontWeight: 500 }}>
            Role:
          </Typography>
          <FormControl sx={{ minWidth: 150 }}>
            <Select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as UserRole)}
              size="small" 
              sx={{
                backgroundColor: colors.background.white,
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: colors.border.light,
                },
              }}
            >
              {roleOptions.map((role) => (
                <MenuItem key={role} value={role}>
                  {role.charAt(0).toUpperCase() + role.slice(1).replace('_', ' ')}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: colors.text.primary,
            mb: 2,
          }}
        >
          Bills
        </Typography>

        <Box
          sx={{
            maxHeight: '400px',
            overflowY: 'auto',
            pr: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 1.5,
          }}
        >
          {loading ? (
            <Typography variant="body2" sx={{ color: colors.text.secondary }}>
              Loading bills...
            </Typography>
          ) : bills.length === 0 ? (
            <Typography variant="body2" sx={{ color: colors.text.secondary }}>
              No bills assigned
            </Typography>
          ) : (
            <>
              {inProgressBills.map((assignment) => (
                <Paper
                  key={assignment.id}
                  sx={{
                    p: 2,
                    backgroundColor: colors.background.main,
                    borderRadius: 1,
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: colors.text.primary }}>
                      {assignment.bill.state} {assignment.bill.bill_number}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: colors.text.secondary,
                        fontStyle: 'italic',
                        ml: 2,
                      }}
                    >
                      {getStatusLabel(assignment.status)}
                    </Typography>
                  </Box>
                </Paper>
              ))}

              {assignedBills.map((assignment) => (
                <Paper
                  key={assignment.id}
                  sx={{
                    p: 2,
                    backgroundColor: colors.neutral.gray100,
                    borderRadius: 1,
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: colors.text.primary }}>
                      {assignment.bill.state} {assignment.bill.bill_number}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: colors.text.secondary,
                        fontStyle: 'italic',
                        ml: 2,
                      }}
                    >
                      {getStatusLabel(assignment.status)}
                    </Typography>
                  </Box>
                </Paper>
              ))}

              {completedBills.map((assignment) => (
                <Paper
                  key={assignment.id}
                  sx={{
                    p: 2,
                    backgroundColor: colors.background.white,
                    border: `1px solid ${colors.border.light}`,
                    borderRadius: 1,
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: colors.text.primary }}>
                      {assignment.bill.state} {assignment.bill.bill_number}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: colors.text.secondary,
                        fontStyle: 'italic',
                        ml: 2,
                      }}
                    >
                      {getStatusLabel(assignment.status)}
                    </Typography>
                  </Box>
                </Paper>
              ))}
            </>
          )}
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
          onClick={handleSave}
          variant="contained"
          disabled={saving || selectedRole === user.role}
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
          {saving ? 'Saving...' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

