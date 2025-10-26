'use client';

import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Button,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import ResponsiveAppBar from '@/app/components/ResponsiveAppBar';
import Footer from '@/app/components/Footer';
import "@fontsource/rubik";

export default function SignupSuccessPage() {
  const router = useRouter();

  const handleContinue = () => {
    router.push('/scorecard');
  };

  return (
    <Box>
      <ResponsiveAppBar />
      <Box sx={{ 
        backgroundColor: '#D9E8DF', 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column',
        py: 4
      }}>
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <Card sx={{ maxWidth: 500, width: '100%', mx: 2 }}>
            <CardContent sx={{ p: 4, textAlign: 'center' }}>
              {/* Header */}
              <Box sx={{ mb: 3 }}>
                <img
                  src="/cntr_logo.png"
                  alt="CNTR logo"
                  style={{ height: 50, marginBottom: 16 }}
                />
                <Typography variant="h4" sx={{ fontFamily: 'Rubik-Bold, sans-serif', color: '#0C6431', mb: 2 }}>
                  Account Created!
                </Typography>
                <Typography variant="body1" sx={{ fontFamily: 'Rubik, sans-serif', color: '#666', mb: 3 }}>
                  Your account has been successfully created. You can now begin scoring AI policy bills.
                </Typography>
              </Box>

              {/* Success Message */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="body1" sx={{ fontFamily: 'Rubik, sans-serif', color: '#0C6431', fontWeight: 'bold' }}>
                  Navigate to the dashboard to begin scoring bills.
                </Typography>
              </Box>

              {/* Continue Button */}
              <Button
                variant="contained"
                onClick={handleContinue}
                sx={{
                  backgroundColor: '#0C6431',
                  fontFamily: 'Rubik, sans-serif',
                  px: 4,
                  py: 1,
                  fontSize: '1.1rem',
                  '&:hover': {
                    backgroundColor: '#0A4F28',
                  }
                }}
              >
                Continue to Dashboard
              </Button>
            </CardContent>
          </Card>
        </Box>
      </Box>
      <Footer />
    </Box>
  );
}
