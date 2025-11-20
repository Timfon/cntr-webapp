"use client";
import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { billService } from '@/backend/database';
import ResponsiveAppBar from '@/app/components/ResponsiveAppBar';
import Footer from '@/app/components/Footer';
import Loading from '@/app/components/Loading';
import {
  Box,
  Typography,
  Container,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Popover,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Bill } from '@/types/database';
import { colors } from '@/app/theme/colors';

const BILLS_PER_PAGE = 30;

export default function ViewAllBillsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [bills, setBills] = useState<Bill[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [tempStartDate, setTempStartDate] = useState<string>('');
  const [tempEndDate, setTempEndDate] = useState<string>('');
  const [datePopupOpen, setDatePopupOpen] = useState(false);
  const [dateAnchorEl, setDateAnchorEl] = useState<HTMLElement | null>(null);
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
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

      // Initialize date range to full range
      const validDates = allBills
        .map(bill => new Date(bill.version_date || 0).getTime())
        .filter(time => !isNaN(time) && time > 0);

      if (validDates.length > 0) {
        const minStr = new Date(Math.min(...validDates)).toISOString().split('T')[0];
        const maxStr = new Date(Math.max(...validDates)).toISOString().split('T')[0];
        setStartDate(minStr);
        setEndDate(maxStr);
        setTempStartDate(minStr);
        setTempEndDate(maxStr);
      }
    } catch (error) {
      console.error('Error loading bills:', error);
      setBills([]);
    }
  };

  // Filter and sort bills
  const filteredBills = useMemo(() => {
    let filtered = bills.filter(bill => {
      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const billId = `${bill.state} ${bill.bill_number || ''}`.toLowerCase();
        const title = (bill.title || '').toLowerCase();
        const summary = (bill.summary || '').toLowerCase();
        if (!billId.includes(searchLower) && !title.includes(searchLower) && !summary.includes(searchLower)) {
          return false;
        }
      }

      // State filter
      if (selectedState && bill.state !== selectedState) return false;

      // Date range filter
      if (startDate && endDate) {
        const billTime = new Date(bill.version_date || 0).getTime();
        const startTime = new Date(startDate).setHours(0, 0, 0, 0);
        const endTime = new Date(endDate).setHours(23, 59, 59, 999);
        if (isNaN(billTime) || billTime < startTime || billTime > endTime) return false;
      }

      return true;
    });

    // Sort by newest first
    filtered.sort((a, b) => {
      const dateA = new Date(a.version_date || 0).getTime();
      const dateB = new Date( b.version_date || 0).getTime();
      return dateB - dateA;
    });

    return filtered;
  }, [bills, searchTerm, selectedState, startDate, endDate]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedState, startDate, endDate]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredBills.length / BILLS_PER_PAGE);
  const currentBills = filteredBills.slice(
    (currentPage - 1) * BILLS_PER_PAGE,
    currentPage * BILLS_PER_PAGE
  );

  const handlePageChange = (_: unknown, value: number) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatBillId = (bill: Bill) => `${bill.state} ${bill.bill_number || ''}`;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? dateString : date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
  };

  const formatDateRangeDisplay = () => {
    if (!startDate || !endDate) return 'Select Date Range';
    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  };

  const handleSearch = () => {
    setStartDate(tempStartDate);
    setEndDate(tempEndDate);
    setDatePopupOpen(false);
    setDateAnchorEl(null);
  };

  const handleDatePopupOpen = (e: React.MouseEvent<HTMLElement>) => {
    setTempStartDate(startDate);
    setTempEndDate(endDate);
    setDateAnchorEl(e.currentTarget);
    setDatePopupOpen(true);
  };


  if (loading || authLoading) {
    return <Loading />;
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: colors.background.main }}>
      <ResponsiveAppBar />
      <Container maxWidth={false} sx={{ py: 6, px: 4 }}>
        {/* Search and Filter Bar */}
        <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap', maxWidth: '1200px', mx: 'auto' }}>
          <TextField
            placeholder="Search bills"
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
              startAdornment: <SearchIcon sx={{ color: colors.text.secondary, mr: 1 }} />,
            }}
          />
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>State</InputLabel>
            <Select
              value={selectedState || ''}
              label="State"
              onChange={(e) => setSelectedState(e.target.value || null)}
              sx={{ backgroundColor: colors.background.white }}
            >
              <MenuItem value="">All States</MenuItem>
              {[...new Set(bills.map(b => b.state))].sort().map(state => (
                <MenuItem key={state} value={state}>{state}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Date</InputLabel>
            <Select
              value={formatDateRangeDisplay()}
              label="Date"
              onClick={handleDatePopupOpen}
              sx={{ backgroundColor: colors.background.white }}
              open={false}
              renderValue={() => formatDateRangeDisplay()}
            >
              <MenuItem value="">Select Date Range</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Date Popup - Attached to Date field */}
        <Popover
          open={datePopupOpen}
          anchorEl={dateAnchorEl}
          onClose={() => {
            setDatePopupOpen(false);
            setDateAnchorEl(null);
          }}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          sx={{
            mt: 0.5,
          }}
        >
          <Box 
            sx={{ 
              width: '400px',
              p: 3, 
              backgroundColor: colors.background.white, 
            }}
          >
            <Typography variant="body1" sx={{ mb: 3, color: colors.text.primary, fontWeight: 'bold' }}>
              Filter by Date
            </Typography>
            
            {/* Start to End Date Section */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ mb: 1.5, color: colors.text.secondary, fontWeight: 'medium' }}>
                Start to End
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  type="date"
                  label="Start Date"
                  value={tempStartDate}
                  onChange={(e) => setTempStartDate(e.target.value)}
                  size="small"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  sx={{
                    flex: 1,
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: colors.background.white,
                    },
                  }}
                />
                <TextField
                  type="date"
                  label="End Date"
                  value={tempEndDate}
                  onChange={(e) => setTempEndDate(e.target.value)}
                  size="small"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  sx={{
                    flex: 1,
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: colors.background.white,
                    },
                  }}
                />
              </Box>
            </Box>

            {/* Search Button */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                onClick={handleSearch}
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
            </Box>
          </Box>
        </Popover>

        {/* Bills Table */}
        <Box sx={{ maxWidth: '1200px', mx: 'auto', mt: 2 }}>
          <TableContainer 
            component={Paper} 
            sx={{ 
              backgroundColor: colors.background.white, 
              boxShadow: '0px 2px 8px rgba(0,0,0,0.1)',
              borderRadius: 2,
              overflow: 'hidden',
            }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: colors.neutral.gray100 }}>
                  <TableCell sx={{ fontWeight: 'bold', color: colors.text.primary, fontSize: '0.95rem', py: 2 }}>
                    Bill ID
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: colors.text.primary, fontSize: '0.95rem', py: 2 }}>
                    Date
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: colors.text.primary, fontSize: '0.95rem', py: 2 }}>
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentBills.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} sx={{ textAlign: 'center', py: 4 }}>
                      <Typography sx={{ color: colors.text.secondary }}>No bills found</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  currentBills.map((bill) => (
                    <TableRow
                      key={bill.id}
                      sx={{
                        '&:hover': {
                          backgroundColor: colors.neutral.gray50,
                        },
                      }}
                    >
                      <TableCell sx={{
                        fontWeight: 'bold',
                        color: colors.text.primary,
                        fontSize: '1.05rem',
                        py: 2,
                      }}>
                        {formatBillId(bill)}
                      </TableCell>
                      <TableCell sx={{
                        color: colors.text.primary,
                        fontSize: '0.95rem',
                        py: 2,
                      }}>
                        {formatDate(bill.version_date)}
                      </TableCell>
                      <TableCell sx={{ py: 2 }}>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => {
                            setSelectedBill(bill);
                            setDialogOpen(true);
                          }}
                          sx={{
                            borderColor: colors.primary,
                            color: colors.primary,
                            fontWeight: 500,
                            '&:hover': {
                              borderColor: colors.primaryHover,
                              backgroundColor: colors.primaryLight,
                            },
                          }}
                        >
                          View Bill
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          
          {/* Pagination */}
          {filteredBills.length > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                sx={{
                  '& .MuiPaginationItem-root': {
                    color: colors.text.primary,
                    '&.Mui-selected': {
                      backgroundColor: colors.primary,
                      color: colors.text.white,
                      '&:hover': {
                        backgroundColor: colors.primaryHover,
                      },
                    },
                    '&:hover': {
                      backgroundColor: colors.primaryLight,
                    },
                  },
                }}
              />
            </Box>
          )}
        </Box>

      </Container>

      {/* Bill Details Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 'bold', pb: 1, color: colors.text.primary }}>
          {selectedBill ? formatBillId(selectedBill) : 'Bill Details'}
        </DialogTitle>
        <DialogContent>
          {selectedBill && (
            <Box sx={{ pt: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5, color: colors.text.secondary }}>
                Bill ID
              </Typography>
              <Typography variant="body1" sx={{ mb: 2, color: colors.text.primary }}>
                {formatBillId(selectedBill)}
              </Typography>

              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5, color: colors.text.secondary }}>
                Title
              </Typography>
              <Typography variant="body1" sx={{ mb: 2, color: colors.text.primary }}>
                {selectedBill.title || 'N/A'}
              </Typography>

              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5, color: colors.text.secondary }}>
                Summary
              </Typography>
              <Typography variant="body1" sx={{ mb: 2, whiteSpace: 'pre-wrap', color: colors.text.primary }}>
                {selectedBill.summary || 'No summary available'}
              </Typography>

              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5, color: colors.text.secondary }}>
                Version Date
              </Typography>
              <Typography variant="body1" sx={{ mb: 2, color: colors.text.primary }}>
                {formatDate(selectedBill.version_date)}
              </Typography>

              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5, color: colors.text.secondary }}>
                State
              </Typography>
              <Typography variant="body1" sx={{ mb: 2, color: colors.text.primary }}>
                {selectedBill.state || 'N/A'}
              </Typography>

              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5, color: colors.text.secondary }}>
                Year
              </Typography>
              <Typography variant="body1" sx={{ mb: 2, color: colors.text.primary }}>
                {selectedBill.year || 'N/A'}
              </Typography>

              {selectedBill.url && (
                <>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5, color: colors.text.secondary }}>
                    URL
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2, color: colors.text.primary }}>
                    <a
                      href={selectedBill.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: colors.primary, textDecoration: 'underline' }}
                    >
                      {selectedBill.url}
                    </a>
                  </Typography>
                </>
              )}

              {selectedBill.body && (
                <>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5, color: colors.text.secondary }}>
                    Body
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2, color: colors.text.primary }}>
                    {selectedBill.body}
                  </Typography>
                </>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} sx={{ color: colors.primary }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Footer />
    </Box>
  );
}

