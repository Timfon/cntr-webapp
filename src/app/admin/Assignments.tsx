"use client";
import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
  Button,
  Chip,
  Paper,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { colors } from '@/app/theme/colors';
import { billService, assignmentService } from '@/backend/database';
import { adminService } from '@/backend/admin';
import { Bill, UserWithStatistics } from '@/types/database';
import AssignBillDialog from './AssignBillDialog';
import CreateAssignmentSection from './CreateAssignmentSection';
import StateFilter from '@/app/components/filters/StateFilter';
import DateRangeFilter from '@/app/components/filters/DateRangeFilter';

interface BillWithAssignee extends Bill {
  assignees: Array<{
    id: string;
    name: string;
    email: string;
    assignmentId: string;
  }>;
}

type BillFilterType = 'all' | 'assigned' | 'unassigned';

const BILLS_PER_PAGE = 10;

export default function Assignments() {
  const [bills, setBills] = useState<BillWithAssignee[]>([]);
  const [users, setUsers] = useState<UserWithStatistics[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(''); 
  const [activeSearchTerm, setActiveSearchTerm] = useState(''); 
  const [billFilter, setBillFilter] = useState<BillFilterType>('all');
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [assignedUserId, setAssignedUserId] = useState<string | null>(null);
  const [uniqueStates, setUniqueStates] = useState<string[]>([]);
  const [selectedBill, setSelectedBill] = useState<BillWithAssignee | null>(null);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const allUsersWithProgress = await adminService.getUsersWithProgress();
        setUsers(allUsersWithProgress);
      } catch (error) {
        console.error('Error loading users:', error);
      }
    };
    loadUsers();
  }, []);

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
    loadStates();
  }, []);

  const loadData = useCallback(async (page: number = 1) => {
    try {
      setLoading(true);
      
      const result = await adminService.getBillsWithAssignments({
        page,
        pageSize: BILLS_PER_PAGE,
        searchTerm: activeSearchTerm || undefined,
        state: selectedState || undefined,
        dateRange: startDate && endDate ? { start: startDate, end: endDate } : undefined,
        assignedUserId: assignedUserId || undefined,
        billFilter: billFilter,
      });

      setBills(result.bills as BillWithAssignee[]);
      setTotalPages(result.totalPages);
      setTotalCount(result.total);
    } catch (error) {
      console.error('Error loading assignments data:', error);
      setBills([]);
      setTotalPages(1);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [activeSearchTerm, selectedState, startDate, endDate, assignedUserId, billFilter]);

  useEffect(() => {
    loadData(currentPage);
  }, [currentPage, loadData]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeSearchTerm, selectedState, startDate, endDate, assignedUserId, billFilter]);

  const handleAssignBill = (bill: BillWithAssignee) => {
    setSelectedBill(bill);
    setAssignDialogOpen(true);
  };

  const handleCloseAssignDialog = () => {
    setAssignDialogOpen(false);
    setSelectedBill(null);
  };

  const handleAssignmentCreated = async () => {
    // Reload current page to refresh data
    await loadData(currentPage);
  };

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

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="body1" sx={{ color: colors.text.secondary }}>
          Loading bills...
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Bill Management Section */}
      <Card sx={{ backgroundColor: colors.background.white, boxShadow: '0px 1px 3px rgba(0,0,0,0.1)', mb: 3 }}>
        <CardContent>
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              mb: 3,
              mt: 2,
              flexWrap: 'wrap',
            }}
          >
            <TextField
              placeholder="Search bills (press Enter to search)"
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleSearchKeyPress}
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
                      onClick={handleClearSearch}
                      sx={{ color: colors.text.tertiary }}
                    >
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ) : null,
              }}
            />

            <Button
              variant="contained"
              onClick={handleSearchClick}
              sx={{
                backgroundColor: colors.primary,
                color: colors.text.white,
                '&:hover': {
                  backgroundColor: colors.primaryHover,
                },
              }}
            >
              Search
            </Button>

            <StateFilter
              selectedState={selectedState}
              onStateChange={setSelectedState}
              uniqueStates={uniqueStates}
              minWidth={150}
            />

            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Assigned User</InputLabel>
              <Select
                value={assignedUserId || ''}
                label="Assigned User"
                onChange={(e) => setAssignedUserId(e.target.value || null)}
                sx={{
                  backgroundColor: colors.background.white,
                }}
              >
                <MenuItem value="">All Users</MenuItem>
                {users.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.name || user.email}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <DateRangeFilter
              startDate={startDate}
              endDate={endDate}
              onDateRangeChange={handleDateRangeChange}
              onClear={handleDateRangeClear}
              minWidth={120}
            />

            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>All Bills</InputLabel>
              <Select
                value={billFilter}
                label="All Bills"
                onChange={(e) => setBillFilter(e.target.value as BillFilterType)}
                sx={{
                  backgroundColor: colors.background.white,
                }}
              >
                <MenuItem value="all">All Bills</MenuItem>
                <MenuItem value="assigned">Assigned</MenuItem>
                <MenuItem value="unassigned">Unassigned</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: colors.neutral.gray50 }}>
                  <TableCell sx={{ fontWeight: 600, color: colors.text.primary }}>
                    Bill
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: colors.text.primary }}>
                    Assignees
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: colors.text.primary }}>
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bills.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} sx={{ textAlign: 'center', py: 4 }}>
                      <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                        No bills found
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  bills.map((bill) => (
                    <TableRow key={bill.id} hover>
                      <TableCell>
                        <Box>
                          <Typography
                            variant="body2"
                            sx={{ color: colors.text.primary, fontWeight: 500 }}
                          >
                            {bill.title}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ color: colors.text.secondary, fontSize: '0.75rem' }}
                          >
                            {bill.state} {bill.bill_number}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          {bill.assignees.length > 0 ? (
                            <>
                              {bill.assignees.slice(0, 3).map((assignee) => (
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
                              {bill.assignees.length > 3 && (
                                <Chip
                                  label={`+${bill.assignees.length - 3} more`}
                                  size="small"
                                  sx={{
                                    backgroundColor: colors.neutral.gray200,
                                    color: colors.text.secondary,
                                    fontSize: '0.75rem',
                                  }}
                                />
                              )}
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
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="text"
                          size="small"
                          onClick={() => handleAssignBill(bill)}
                          sx={{
                            color: colors.primary,
                            textTransform: 'none',
                            fontWeight: 500,
                            '&:hover': {
                              backgroundColor: colors.primaryLighter,
                            },
                          }}
                        >
                          Assign Bill
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
              <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                Showing {((currentPage - 1) * BILLS_PER_PAGE) + 1}-{Math.min(currentPage * BILLS_PER_PAGE, totalCount)} of {totalCount}
              </Typography>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(_event, value) => setCurrentPage(value)}
                color="primary"
                sx={{
                  '& .MuiPaginationItem-root': {
                    color: colors.primary,
                  },
                  '& .Mui-selected': {
                    backgroundColor: colors.primary,
                    color: colors.text.white,
                    '&:hover': {
                      backgroundColor: colors.primaryHover,
                    },
                  },
                }}
              />
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Create New Assignment Section */}
      <CreateAssignmentSection users={users} bills={bills} onAssignmentCreated={handleAssignmentCreated} />

      {/* Assign Bill Dialog */}
      {selectedBill && (
        <AssignBillDialog
          open={assignDialogOpen}
          onClose={handleCloseAssignDialog}
          bill={selectedBill}
          users={users}
          onAssignmentCreated={handleAssignmentCreated}
        />
      )}
    </Box>
  );
}

