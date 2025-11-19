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
  Button,
  Chip,
  Paper,
  Pagination,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { colors } from '@/app/theme/colors';
import { billService, assignmentService } from '@/backend/database';
import { adminService } from '@/backend/admin';
import { Bill, UserWithCohort } from '@/types/database';
import AssignBillDialog from './AssignBillDialog';
import CreateAssignmentSection from './CreateAssignmentSection';

interface BillWithAssignee extends Bill {
  assignee: {
    id: string;
    name: string;
    email: string;
  } | null;
  assignmentId: string | null;
}

type SearchByType = 'users' | 'title' | 'number' | 'year';
type BillFilterType = 'all' | 'assigned' | 'unassigned';

const BILLS_PER_PAGE = 10;

export default function Assignments() {
  const [bills, setBills] = useState<BillWithAssignee[]>([]);
  const [users, setUsers] = useState<UserWithCohort[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchBy, setSearchBy] = useState<SearchByType>('users');
  const [searchTerm, setSearchTerm] = useState('');
  const [billFilter, setBillFilter] = useState<BillFilterType>('all');
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const loadData = async () => {
    try {
      setLoading(true);
      const [allBills, allUsersWithProgress, allAssignments] = await Promise.all([
        billService.getAllBills(),
        adminService.getUsersWithProgress(),
        adminService.getAllAssignmentsWithUsers(),
      ]);

      // Create assignment map for quick lookup
      const assignmentMap = new Map<string, typeof allAssignments[0]>();
      allAssignments.forEach(a => {
        assignmentMap.set(a.billId, a);
      });

      // Combine bills with assignee info
      const billsWithAssignee: BillWithAssignee[] = allBills.map(bill => {
        const assignment = assignmentMap.get(bill.id);
        return {
          ...bill,
          assignee: assignment ? {
            id: assignment.userId,
            name: assignment.userName,
            email: assignment.userEmail,
          } : null,
          assignmentId: assignment?.assignmentId || null,
        };
      });

      setBills(billsWithAssignee);
      setUsers(allUsersWithProgress);
    } catch (error) {
      console.error('Error loading assignments data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredBills = useMemo(() => {
    return bills.filter((bill) => {
      // Filter by assigned/unassigned
      if (billFilter === 'assigned' && !bill.assignee) return false;
      if (billFilter === 'unassigned' && bill.assignee) return false;

      // Search filtering
      if (!searchTerm) return true;

      const searchLower = searchTerm.toLowerCase();

      switch (searchBy) {
        case 'users':
          if (bill.assignee) {
            return (
              bill.assignee.name.toLowerCase().includes(searchLower) ||
              bill.assignee.email.toLowerCase().includes(searchLower)
            );
          }
          return false;
        case 'title':
          return bill.title.toLowerCase().includes(searchLower);
        case 'number':
          // Search by full bill ID: "PA 352" or "PA SB293"
          const billId = `${bill.state} ${bill.bill_number}`.toLowerCase();
          return billId.includes(searchLower);
        case 'year':
          return bill.year.toString().includes(searchTerm);
        default:
          return true;
      }
    });
  }, [bills, searchBy, searchTerm, billFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredBills.length / BILLS_PER_PAGE);
  const startIndex = (currentPage - 1) * BILLS_PER_PAGE;
  const endIndex = startIndex + BILLS_PER_PAGE;
  const paginatedBills = filteredBills.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchBy, searchTerm, billFilter]);

  const handleAssignBill = (bill: Bill) => {
    setSelectedBill(bill);
    setAssignDialogOpen(true);
  };

  const handleCloseAssignDialog = () => {
    setAssignDialogOpen(false);
    setSelectedBill(null);
  };

  const handleAssignmentCreated = async () => {
    await loadData();
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
          <Typography
            variant="h6"
            sx={{
              color: colors.text.primary,
              fontWeight: 600,
              mb: 3,
            }}
          >
            Bill Management
          </Typography>

          <Box
            sx={{
              display: 'flex',
              gap: 2,
              mb: 3,
              flexWrap: 'wrap',
              alignItems: 'center',
            }}
          >
            <Typography variant="body2" sx={{ color: colors.text.primary, fontWeight: 500 }}>
              Search by:
            </Typography>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <Select
                value={searchBy}
                onChange={(e) => setSearchBy(e.target.value as SearchByType)}
                sx={{
                  backgroundColor: colors.background.white,
                }}
              >
                <MenuItem value="users">Users</MenuItem>
                <MenuItem value="title">Title</MenuItem>
                <MenuItem value="number">Number</MenuItem>
                <MenuItem value="year">Year</MenuItem>
              </Select>
            </FormControl>

            <TextField
              placeholder="Search"
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
                ) : (
                  <InputAdornment position="end">
                    <SearchIcon sx={{ color: colors.text.tertiary }} />
                  </InputAdornment>
                ),
              }}
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

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {paginatedBills.length === 0 ? (
              <Typography variant="body2" sx={{ color: colors.text.secondary, py: 4, textAlign: 'center' }}>
                No bills found
              </Typography>
            ) : (
              paginatedBills.map((bill) => (
                <Paper
                  key={bill.id}
                  sx={{
                    p: 2,
                    backgroundColor: bill.assignee ? colors.background.main : colors.neutral.gray100,
                    borderRadius: 1,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: colors.text.primary, mb: 0.5 }}>
                      {bill.title}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
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
                      {bill.assignee ? (
                        <Chip
                          label={bill.assignee.name}
                          size="small"
                          sx={{
                            backgroundColor: colors.sidebar.activeBackground,
                            color: colors.text.primary,
                            fontSize: '0.75rem',
                          }}
                        />
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
                  </Box>
                  {!bill.assignee && (
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => handleAssignBill(bill)}
                      sx={{
                        backgroundColor: colors.primary,
                        color: colors.text.white,
                        ml: 2,
                        '&:hover': {
                          backgroundColor: colors.primaryHover,
                        },
                      }}
                    >
                      Assign Bill
                    </Button>
                  )}
                </Paper>
              ))
            )}
          </Box>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
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

