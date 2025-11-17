import { useState } from 'react';
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Popover,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { colors } from '@/app/theme/colors';
import { formatDateRange } from '@/utils/formatters';

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
  const [tempStartDate, setTempStartDate] = useState(startDate);
  const [tempEndDate, setTempEndDate] = useState(endDate);
  const [dateAnchorEl, setDateAnchorEl] = useState<HTMLElement | null>(null);

  const handleDatePopupOpen = (e: React.MouseEvent<HTMLElement>) => {
    setTempStartDate(startDate);
    setTempEndDate(endDate);
    setDateAnchorEl(e.currentTarget);
  };

  const handleSearch = () => {
    onDateRangeChange(tempStartDate, tempEndDate);
    setDateAnchorEl(null);
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
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>State</InputLabel>
          <Select
            value={selectedState || ""}
            label="State"
            onChange={(e) => onStateChange(e.target.value || null)}
            sx={{ backgroundColor: colors.background.white }}
          >
            <MenuItem value="">All States</MenuItem>
            {uniqueStates.map((state) => (
              <MenuItem key={state} value={state}>
                {state}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Date</InputLabel>
          <Select
            value={formatDateRange(startDate, endDate)}
            label="Date"
            onClick={handleDatePopupOpen}
            sx={{ backgroundColor: colors.background.white }}
            open={false}
            renderValue={() => formatDateRange(startDate, endDate)}
          >
            <MenuItem value="">Select Date Range</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Popover
        open={Boolean(dateAnchorEl)}
        anchorEl={dateAnchorEl}
        onClose={() => setDateAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        sx={{ mt: 0.5 }}
      >
        <Box
          sx={{
            width: "400px",
            p: 3,
            backgroundColor: colors.background.white,
          }}
        >
          <Typography
            variant="body1"
            sx={{ mb: 3, color: colors.text.primary, fontWeight: "bold" }}
          >
            Filter by Date
          </Typography>
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="body2"
              sx={{
                mb: 1.5,
                color: colors.text.secondary,
                fontWeight: "medium",
              }}
            >
              Start to End
            </Typography>
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                type="date"
                label="Start Date"
                value={tempStartDate}
                onChange={(e) => setTempStartDate(e.target.value)}
                size="small"
                InputLabelProps={{ shrink: true }}
                sx={{
                  flex: 1,
                  "& .MuiOutlinedInput-root": {
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
                InputLabelProps={{ shrink: true }}
                sx={{
                  flex: 1,
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: colors.background.white,
                  },
                }}
              />
            </Box>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="contained"
              onClick={handleSearch}
              sx={{
                backgroundColor: colors.primary,
                color: colors.text.white,
                "&:hover": { backgroundColor: colors.primaryHover },
              }}
            >
              Search
            </Button>
          </Box>
        </Box>
      </Popover>
    </>
  );
}
