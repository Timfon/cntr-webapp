"use client";
import React from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { colors } from '@/app/theme/colors';

interface StateFilterProps {
  selectedState: string | null;
  onStateChange: (state: string | null) => void;
  uniqueStates: string[];
  minWidth?: number;
}

export default function StateFilter({
  selectedState,
  onStateChange,
  uniqueStates,
  minWidth = 150,
}: StateFilterProps) {
  return (
    <FormControl size="small" sx={{ minWidth }}>
      <InputLabel>State</InputLabel>
      <Select
        value={selectedState || ''}
        label="State"
        onChange={(e) => onStateChange(e.target.value || null)}
        sx={{
          backgroundColor: colors.background.white,
        }}
      >
        <MenuItem value="">All States</MenuItem>
        {uniqueStates.map((state) => (
          <MenuItem key={state} value={state}>
            {state}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

