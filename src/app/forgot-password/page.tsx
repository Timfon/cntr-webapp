'use client';

import * as React from 'react';
import { Box } from '@mui/material';
import ResponsiveAppBar from '@/app/components/ResponsiveAppBar';
import Footer from '@/app/components/Footer';
import ForgotPassword from '@/app/forgot-password/ForgotPassword';
import '@fontsource/rubik';

export default function ForgotPasswordPage() {
  return (
    <Box>
      <ResponsiveAppBar />
      <Box
        sx={{
          backgroundColor: '#D9E8DF',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ForgotPassword />
      </Box>
      <Footer />
    </Box>
  );
}


