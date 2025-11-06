import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { colors } from '@/app/theme/colors';

const Loading = () => (
  <Box
    sx={{
      minHeight: '100vh',
      bgcolor: colors.background.main,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <CircularProgress
      size={60}
      thickness={4.5}
      sx={{ color: colors.status.success, mb: 3 }}
    />
    <Typography
      variant="h5"
      sx={{
        color: colors.text.primary,
        fontWeight: 500,
        letterSpacing: 1,
        mb: 1.5,
      }}
    >
      Loading, please wait...
    </Typography>
  </Box>
);

export default Loading;
