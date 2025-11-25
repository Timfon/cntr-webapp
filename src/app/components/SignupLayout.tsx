'use client';

import React from 'react';
import { Box, Card, CardContent, Typography, LinearProgress, Alert, Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import ResponsiveAppBar from './ResponsiveAppBar';
import Footer from './Footer';
import { colors } from '@/app/theme/colors';

interface SignupLayoutProps {
  children: React.ReactNode;
  step: 1 | 2 | 3;
  stepTitle: string;
  subtitle: string;
  error?: string | null;
  loading?: boolean;
  onPrevious?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  previousLabel?: string;
  showPrevious?: boolean;
  maxWidth?: number;
}

export default function SignupLayout({
  children,
  step,
  stepTitle,
  subtitle,
  error,
  loading = false,
  onPrevious,
  onNext,
  nextLabel = 'Next',
  previousLabel = 'Previous',
  showPrevious = true,
  maxWidth = 500,
}: SignupLayoutProps) {
  const router = useRouter();
  const progress = (step / 3) * 100;

  return (
    <Box>
      <ResponsiveAppBar />
      <Box
        sx={{
          backgroundColor: colors.background.light,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          py: 4,
        }}
      >
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Card sx={{ maxWidth, width: '100%', mx: 2 }}>
            <CardContent sx={{ p: 4 }}>
              {/* Header */}
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <img
                  src="/cntr_logo.png"
                  alt="CNTR logo"
                  style={{ height: 50, marginBottom: 16 }}
                />
                <Typography variant="h4" sx={{ color: colors.primary, mb: 1 }}>
                  Sign Up
                </Typography>
                <Typography variant="body1" sx={{ color: colors.text.secondary }}>
                  {subtitle}
                </Typography>
              </Box>

              {/* Progress Bar */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Step {step} of 3: {stepTitle}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={progress}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: colors.border.light,
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: colors.primary,
                    },
                  }}
                />
              </Box>

              {/* Error Alert */}
              {error && (
                <Alert
                  severity="error"
                  sx={{ mb: 2 }}
                  action={
                    error.includes('already registered') ? (
                      <Button
                        color="inherit"
                        size="small"
                        onClick={() => router.push('/signin')}
                        sx={{ fontWeight: 'bold' }}
                      >
                        Sign In Instead
                      </Button>
                    ) : null
                  }
                >
                  {error}
                </Alert>
              )}

              {/* Content */}
              {children}

              {/* Navigation */}
              <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
                {showPrevious && onPrevious ? (
                  <Button
                    variant="outlined"
                    onClick={onPrevious}
                    disabled={loading}
                    sx={{
                      borderColor: colors.primary,
                      color: colors.primary,
                      px: 4,
                      py: 1,
                      '&:hover': {
                        borderColor: colors.primaryDark,
                        backgroundColor: colors.primaryLighter,
                      },
                    }}
                  >
                    {previousLabel}
                  </Button>
                ) : (
                  <Box />
                )}

                {onNext && (
                  <Button
                    variant="contained"
                    onClick={onNext}
                    disabled={loading}
                    sx={{
                      backgroundColor: colors.primary,
                      px: 4,
                      py: 1,
                      '&:hover': {
                        backgroundColor: colors.primaryDark,
                      },
                    }}
                  >
                    {loading ? 'Processing...' : nextLabel}
                  </Button>
                )}
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
      <Footer />
    </Box>
  );
}
