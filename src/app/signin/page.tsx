"use client";
import * as React from 'react';
import { Box } from '@mui/material';
import ResponsiveAppBar from '@/app/components/ResponsiveAppBar';
import Footer from '@/app/components/Footer';
import BrandingSignInPage from '@/app/components/BrandingSignInPage';
import "@fontsource/rubik";

export default function SignIn() {
  return (
    <Box>
      <ResponsiveAppBar />
      <Box sx={{ backgroundColor: '#D9E8DF', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <BrandingSignInPage />
        </Box>
      </Box>
      <Footer />
    </Box>
  );
}

