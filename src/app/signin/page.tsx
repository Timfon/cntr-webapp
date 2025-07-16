"use client";
import * as React from 'react';
import { Box, Typography, Link } from '@mui/material';
import NextLink from 'next/link';
import ResponsiveAppBar from '@/components/ResponsiveAppBar';
import Footer from '@/components/Footer';
import BrandingSignInPage from '@/components/BrandingSignInPage';
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

