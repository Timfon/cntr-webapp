"use client";
import * as React from 'react';
import { Box, Typography, Link } from '@mui/material';
import ResponsiveAppBar from '@/components/ResponsiveAppBar';
import Footer from '@/components/Footer';
import "@fontsource/rubik";
import BrandingSignUpPage from '@/components/BrandingSignUpPage';

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
