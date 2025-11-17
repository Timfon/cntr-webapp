import { Box, TextField, InputAdornment, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { colors } from '@/app/theme/colors';
import { FilterType } from '@/types/dashboard';

interface DashboardFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

export default function DashboardFilters({
  searchTerm,
  onSearchChange,
  filter,
  onFilterChange,
}: DashboardFiltersProps) {
  const filters: FilterType[] = ['all', 'inProgress', 'assigned', 'scored'];

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        mb: 4,
        flexWrap: 'wrap',
        maxWidth: '1200px',
        mx: 'auto',
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
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'white',
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
      <Box sx={{ display: 'flex', gap: 1 }}>
        {filters.map((f) => (
          <Button
            key={f}
            variant={filter === f ? 'contained' : 'outlined'}
            onClick={() => onFilterChange(f)}
            sx={{
              backgroundColor: filter === f ? colors.primary : 'transparent',
              color: filter === f ? colors.text.white : colors.primary,
              borderColor: colors.primary,
              textTransform: 'capitalize',
              '&:hover': {
                backgroundColor:
                  filter === f ? colors.primaryHover : colors.primaryLight,
              },
            }}
          >
            {f === 'inProgress' ? 'In Progress' : f}
          </Button>
        ))}
      </Box>
    </Box>
  );
}
