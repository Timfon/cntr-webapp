import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const Loading = () => (
  <Box
    sx={{
      minHeight: '100vh',
      bgcolor: '#F6FBF7',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Rubik, sans-serif',
    }}
  >
    <CircularProgress
      size={60}
      thickness={4.5}
      sx={{ color: '#4CAF50', mb: 3 }}
    />
    <Typography
      variant="h5"
      sx={{
        color: '#333333',
        fontWeight: 500,
        fontFamily: 'Rubik, sans-serif',
        letterSpacing: 1,
        mb: 1.5,
      }}
    >
      Loading, please wait...
    </Typography>
  </Box>
);

export default Loading;
