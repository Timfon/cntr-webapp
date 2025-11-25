"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { billService } from '@/backend/database';
import ResponsiveAppBar from '@/app/components/ResponsiveAppBar';
import Footer from '@/app/components/Footer';
import Loading from '@/app/components/Loading';
import StateFilter from '@/app/components/filters/StateFilter';
import DateRangeFilter from '@/app/components/filters/DateRangeFilter';
import {
  Box,
  Typography,
  Container,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  InputAdornment,
  IconButton,
  Card,
  CardContent,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { Bill } from '@/types/database';
import { colors } from '@/app/theme/colors';
import { formatDate } from '@/utils/formatters';

const BILLS_PER_PAGE = 30;

export default function ViewAllBillsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [bills, setBills] = useState<Bill[]>([]);
  const [searchTerm, setSearchTerm] = useState(''); 
  const [activeSearchTerm, setActiveSearchTerm] = useState(''); 
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [uniqueStates, setUniqueStates] = useState<string[]>([]);

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
    if (!authLoading) {
      loadStates();
    }
  }, [authLoading]);

  // Load bills with server-side pagination
  useEffect(() => {
    const loadBills = async (page: number = 1) => {
      try {
        setLoading(true);
        
        const result = await billService.getBills({
          page,
          pageSize: BILLS_PER_PAGE,
          search: activeSearchTerm || undefined,
          state: selectedState || undefined,
          dateRange: startDate && endDate ? { start: startDate, end: endDate } : undefined,
          orderBy: 'version_date',
          ascending: false, // Newest first
        });

        setBills(result.bills);
        setTotalCount(result.total);
        setTotalPages(Math.ceil(result.total / BILLS_PER_PAGE));
      } catch (error) {
        console.error('Error loading bills:', error);
        setBills([]);
        setTotalCount(0);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    if (authLoading) return;
    loadBills(currentPage);
  }, [currentPage, activeSearchTerm, selectedState, startDate, endDate, authLoading]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeSearchTerm, selectedState, startDate, endDate]);

  const handlePageChange = (_: unknown, value: number) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatBillId = (bill: Bill) => `${bill.state} ${bill.bill_number || ''}`;

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
    return <Loading />;
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: colors.background.main }}>
      <ResponsiveAppBar />
      <Container maxWidth={false} sx={{ py: 6, px: 4 }}>
        <Card sx={{ backgroundColor: colors.background.white, boxShadow: '0px 1px 3px rgba(0,0,0,0.1)' }}>
          <CardContent>
            {/* Search and Filter Bar */}
            <Box sx={{ display: 'flex', gap: 2, mb: 4, mt: 2, flexWrap: 'wrap' }}>
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
            minWidth={120}
          />
          <DateRangeFilter
            startDate={startDate}
            endDate={endDate}
            onDateRangeChange={handleDateRangeChange}
            onClear={handleDateRangeClear}
            minWidth={120}
          />
        </Box>


            {/* Bills Table */}
            <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: colors.neutral.gray50 }}>
                  <TableCell sx={{ fontWeight: 600, color: colors.text.primary }}>
                    Bill
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: colors.text.primary }}>
                    Date
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
                            {bill.title || 'N/A'}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ color: colors.text.secondary, fontSize: '0.75rem' }}
                          >
                            {formatBillId(bill)}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{ color: colors.text.primary }}
                        >
                          {formatDate(bill.version_date)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="text"
                          size="small"
                          onClick={() => {
                            setSelectedBill(bill);
                            setDialogOpen(true);
                          }}
                          sx={{
                            color: colors.primary,
                            textTransform: 'none',
                            fontWeight: 500,
                            '&:hover': {
                              backgroundColor: colors.primaryLighter,
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
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 4 }}>
              <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                Showing {((currentPage - 1) * BILLS_PER_PAGE) + 1}-{Math.min(currentPage * BILLS_PER_PAGE, totalCount)} of {totalCount}
              </Typography>
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
          </CardContent>
        </Card>
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

