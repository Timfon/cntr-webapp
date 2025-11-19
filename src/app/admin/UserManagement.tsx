"use client";
import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Paper,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { colors } from '@/app/theme/colors';
import { adminService } from '@/backend/admin';
import { UserWithCohort, UserRole, Cohort } from '@/types/database';
import { authService } from '@/backend/auth';
import UserProfileDialog from './UserProfileDialog';

interface UserWithProgress extends UserWithCohort {
  progress: {
    total: number;
    completed: number;
  };
}

export default function UserManagement() {
  const [users, setUsers] = useState<UserWithProgress[]>([]);
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [cohortFilter, setCohortFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<UserWithProgress | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const user = await authService.getCurrentUser();
        if (!user) return;
        setCurrentUserId(user.id);

        const usersWithProgress = await adminService.getUsersWithProgress();

        // Extract unique cohorts from users instead of separate query
        const uniqueCohorts = usersWithProgress
          .filter(u => u.cohort)
          .reduce((acc, u) => {
            if (!acc.find(c => c.id === u.cohort!.id)) {
              acc.push(u.cohort!);
            }
            return acc;
          }, [] as Cohort[]);

        setUsers(usersWithProgress as UserWithProgress[]);
        setCohorts(uniqueCohorts);
      } catch (error) {
        console.error('Error loading user management data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      
      const matchesCohort =
        cohortFilter === 'all' ||
        (cohortFilter === 'none' && !user.cohort_id) ||
        user.cohort_id === cohortFilter;

      return matchesSearch && matchesRole && matchesCohort;
    });
  }, [users, searchTerm, roleFilter, cohortFilter]);

  const handleViewProfile = (user: UserWithProgress) => {
    setSelectedUser(user);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedUser(null);
  };

  const handleUserUpdated = async () => {
    // Reload users after update
    try {
      const usersWithProgress = await adminService.getUsersWithProgress();
      setUsers(usersWithProgress as UserWithProgress[]);
    } catch (error) {
      console.error('Error reloading users:', error);
    }
  };

  const roleOptions: UserRole[] = ['undergraduate', 'advanced', 'expert', 'legislative_staff', 'general', 'admin'];

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="body1" sx={{ color: colors.text.secondary }}>
          Loading users...
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
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
            User Management
          </Typography>

          <Box
            sx={{
              display: 'flex',
              gap: 2,
              mb: 3,
              flexWrap: 'wrap',
            }}
          >
            <TextField
              placeholder="Search users"
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{
                flexGrow: 1,
                minWidth: '200px',
                '& .MuiOutlinedInput-root': {
                  backgroundColor: colors.background.white,
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: colors.text.tertiary }} />
                  </InputAdornment>
                ),
                endAdornment: searchTerm ? (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => setSearchTerm('')}
                      sx={{ color: colors.text.tertiary }}
                    >
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ) : null,
              }}
            />

            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>All Roles</InputLabel>
              <Select
                value={roleFilter}
                label="All Roles"
                onChange={(e) => setRoleFilter(e.target.value)}
                sx={{
                  backgroundColor: colors.background.white,
                }}
              >
                <MenuItem value="all">All Roles</MenuItem>
                {roleOptions.map((role) => (
                  <MenuItem key={role} value={role}>
                    {role.charAt(0).toUpperCase() + role.slice(1).replace('_', ' ')}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>All Cohorts</InputLabel>
              <Select
                value={cohortFilter}
                label="All Cohorts"
                onChange={(e) => setCohortFilter(e.target.value)}
                sx={{
                  backgroundColor: colors.background.white,
                }}
              >
                <MenuItem value="all">All Cohorts</MenuItem>
                <MenuItem value="none">No Cohort</MenuItem>
                {cohorts.map((cohort) => (
                  <MenuItem key={cohort.id} value={cohort.id}>
                    {cohort.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: colors.neutral.gray50 }}>
                  <TableCell sx={{ fontWeight: 600, color: colors.text.primary }}>
                    Name
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: colors.text.primary }}>
                    Role
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: colors.text.primary }}>
                    Cohort
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: colors.text.primary }}>
                    Progress
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: colors.text.primary }}>
                    View
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} sx={{ textAlign: 'center', py: 4 }}>
                      <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                        No users found
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id} hover>
                      <TableCell>
                        <Box>
                          <Typography
                            variant="body2"
                            sx={{ color: colors.text.primary, fontWeight: 500 }}
                          >
                            {user.name || 'No name'}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ color: colors.text.secondary, fontSize: '0.75rem' }}
                          >
                            {user.email}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={user.role.charAt(0).toUpperCase() + user.role.slice(1).replace('_', ' ')}
                          size="small"
                          sx={{
                            backgroundColor: colors.primaryLighter,
                            color: colors.primary,
                            fontWeight: 500,
                            fontSize: '0.75rem',
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                          {user.cohort?.name || '—'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                          {user.progress.completed}/{user.progress.total} bills
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="text"
                          size="small"
                          onClick={() => handleViewProfile(user)}
                          sx={{
                            color: colors.primary,
                            textTransform: 'none',
                            fontWeight: 500,
                            '&:hover': {
                              backgroundColor: colors.primaryLighter,
                            },
                          }}
                        >
                          View Profile
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {selectedUser && currentUserId && (
        <UserProfileDialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          user={selectedUser}
          currentUserId={currentUserId}
          onUserUpdated={handleUserUpdated}
        />
      )}
    </Box>
  );
}

