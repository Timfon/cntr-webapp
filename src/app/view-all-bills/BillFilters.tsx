import { useState } from 'react';
import {
  Box,
  TextField,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { colors } from '@/app/theme/colors';
import StateFilter from '@/app/components/filters/StateFilter';
import DateRangeFilter from '@/app/components/filters/DateRangeFilter';

interface BillFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedState: string | null;
  onStateChange: (value: string | null) => void;
  startDate: string;
  endDate: string;
  onDateRangeChange: (start: string, end: string) => void;
  uniqueStates: string[];
}

export default function BillFilters({
  searchTerm,
  onSearchChange,
  selectedState,
  onStateChange,
  startDate,
  endDate,
  onDateRangeChange,
  uniqueStates,
}: BillFiltersProps) {
  const handleDateRangeClear = () => {
    onDateRangeChange('', '');
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          gap: 2,
          mb: 4,
          flexWrap: "wrap",
          maxWidth: "1200px",
          mx: "auto",
        }}
      >
        <TextField
          placeholder="Search bills"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          sx={{
            flexGrow: 1,
            minWidth: "200px",
            "& .MuiOutlinedInput-root": {
              backgroundColor: colors.background.white,
            },
          }}
          InputProps={{
            startAdornment: (
              <SearchIcon sx={{ color: colors.text.secondary, mr: 1 }} />
            ),
          }}
        />
        <StateFilter
          selectedState={selectedState}
          onStateChange={onStateChange}
          uniqueStates={uniqueStates}
          minWidth={120}
        />
        <DateRangeFilter
          startDate={startDate}
          endDate={endDate}
          onDateRangeChange={onDateRangeChange}
          onClear={handleDateRangeClear}
          minWidth={120}
        />
      </Box>
    </>
  );
}
