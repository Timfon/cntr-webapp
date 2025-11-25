"use client";
import React, { useState } from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Popover,
  Box,
  Typography,
  TextField,
  Button,
} from '@mui/material';
import { colors } from '@/app/theme/colors';
import { formatDateRange } from '@/utils/formatters';

interface DateRangeFilterProps {
  startDate: string;
  endDate: string;
  onDateRangeChange: (start: string, end: string) => void;
  onClear?: () => void;
  minWidth?: number;
}

export default function DateRangeFilter({
  startDate,
  endDate,
  onDateRangeChange,
  onClear,
  minWidth = 120,
}: DateRangeFilterProps) {
  const [tempStartDate, setTempStartDate] = useState(startDate);
  const [tempEndDate, setTempEndDate] = useState(endDate);
  const [dateAnchorEl, setDateAnchorEl] = useState<HTMLElement | null>(null);
  const datePopupOpen = Boolean(dateAnchorEl);

  const handleDatePopupOpen = (e: React.MouseEvent<HTMLElement>) => {
    setTempStartDate(startDate);
    setTempEndDate(endDate);
    setDateAnchorEl(e.currentTarget);
  };

  const handleDateSearch = () => {
    onDateRangeChange(tempStartDate, tempEndDate);
    setDateAnchorEl(null);
  };

  const handleClose = () => {
    setDateAnchorEl(null);
  };

  const handleClear = () => {
    setTempStartDate('');
    setTempEndDate('');
    if (onClear) {
      onClear();
    } else {
      onDateRangeChange('', '');
    }
    setDateAnchorEl(null);
  };

  return (
    <>
      <FormControl size="small" sx={{ minWidth }}>
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

      <Popover
        open={datePopupOpen}
        anchorEl={dateAnchorEl}
        onClose={handleClose}
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
          <Typography
            variant="body1"
            sx={{ mb: 3, color: colors.text.primary, fontWeight: 'bold' }}
          >
            Filter by Date
          </Typography>

          {/* Start to End Date Section */}
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="body2"
              sx={{
                mb: 1.5,
                color: colors.text.secondary,
                fontWeight: 'medium',
              }}
            >
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

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button
              variant="outlined"
              onClick={handleClear}
              sx={{
                borderColor: colors.border.light,
                color: colors.text.secondary,
              }}
            >
              Clear
            </Button>
            <Button
              variant="contained"
              onClick={handleDateSearch}
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
    </>
  );
}

