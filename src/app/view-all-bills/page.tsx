"use client";
import { useState } from 'react';
import ResponsiveAppBar from '@/app/components/ResponsiveAppBar';
import Footer from '@/app/components/Footer';
import Loading from '@/app/components/Loading';
import StateFilter from '@/app/components/filters/StateFilter';
import DateRangeFilter from '@/app/components/filters/DateRangeFilter';
import BillTable from './BillTable';
import BillDetailsDialog from './BillDetailsDialog';
import { useViewAllBillsData } from './useViewAllBillsData';
import {
  Box,
  Container,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Card,
  CardContent,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { colors } from '@/app/theme/colors';
import { Bill } from '@/types/database';

export default function ViewAllBillsPage() {
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const {
    loading,
    bills,
    totalCount,
    totalPages,
    currentPage,
    searchTerm,
    setSearchTerm,
    selectedState,
    setSelectedState,
    startDate,
    endDate,
    uniqueStates,
    handleSearchKeyPress,
    handleSearchClick,
    handleClearSearch,
    handleDateRangeChange,
    handleDateRangeClear,
    handlePageChange,
  } = useViewAllBillsData();

  const handleViewBill = (bill: Bill) => {
    setSelectedBill(bill);
    setDialogOpen(true);
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
            <BillTable
              bills={bills}
              currentPage={currentPage}
              totalPages={totalPages}
              totalCount={totalCount}
              onPageChange={handlePageChange}
              onViewBill={handleViewBill}
            />
          </CardContent>
        </Card>
      </Container>

      {/* Bill Details Dialog */}
      <BillDetailsDialog
        bill={selectedBill}
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setSelectedBill(null);
        }}
      />

      <Footer />
    </Box>
  );
}

