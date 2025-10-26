"use client";
import * as React from 'react';
import { Box, Typography, Link } from '@mui/material';
import ResponsiveAppBar from '@/app/components/ResponsiveAppBar';
import Footer from '@/app/components/Footer';
import "@fontsource/rubik";
import BrandingSignUpPage from '@/app/components/BrandingSignUpPage';

export default function SignUp() {
  return (
    <Box>
      <ResponsiveAppBar />
      <Box sx={{ backgroundColor: '#D9E8DF', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', py: 8 }}>
        <BrandingSignUpPage />
      </Box>
      <Footer />
    </Box>
  );
}
