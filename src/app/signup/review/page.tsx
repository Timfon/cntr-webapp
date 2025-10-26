'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Button,
  Typography,
  LinearProgress,
  Alert,
  Divider,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { authService } from "@/backend/auth";
import { userService } from '@/backend/users';
import ResponsiveAppBar from '@/app/components/ResponsiveAppBar';
import Footer from '@/app/components/Footer';
import "@fontsource/rubik";

interface CompleteSignupData {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  isGoogleUser: boolean;
  demographic: {
    ageRange: string;
    genderIdentity: string;
    educationLevel: string;
    employmentStatus: string;
    role: string;
  };
}

export default function ReviewPage() {
  const [signupData, setSignupData] = useState<CompleteSignupData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Get complete signup data from sessionStorage
    const storedData = sessionStorage.getItem('completeSignupData');
    if (storedData) {
      setSignupData(JSON.parse(storedData));
    } else {
      // If no signup data, redirect to account page
      router.push('/signup/account');
    }
  }, [router]);

  const handlePrevious = () => {
    router.push('/signup/demographic');
  };

  const handleSubmit = async () => {
    if (!signupData) return;
    
    setLoading(true);
    setError(null);
    
    try {
      let userId: string;
      
      if (signupData.isGoogleUser) {
        // Google user - already authenticated
        const currentUser = authService.getCurrentUser();
        if (!currentUser) {
          setError('No authenticated user found. Please sign in again.');
          return;
        }
        userId = currentUser.uid;
      } else {
        // Email user - create account
        const result = await authService.signUpWithEmail(
          signupData.email,
          signupData.password,
          `${signupData.firstName} ${signupData.lastName}`
        );
        
        if (!result.success || !result.user) {
          setError(result.error || 'Failed to create account');
          return;
        }
        userId = result.user.uid;
      }
      
      // Create user profile with all information
      await userService.createUserProfile(
        userId,
        signupData.email,
        `${signupData.firstName} ${signupData.lastName}`,
        signupData.demographic.role as any,
        {
          firstName: signupData.firstName,
          lastName: signupData.lastName,
          ageRange: signupData.demographic.ageRange,
          genderIdentity: signupData.demographic.genderIdentity,
          educationLevel: signupData.demographic.educationLevel,
          employmentStatus: signupData.demographic.employmentStatus,
        }
      );
      
      // Clear session storage
      sessionStorage.removeItem('signupData');
      sessionStorage.removeItem('completeSignupData');
      
      // Navigate to success page
      router.push('/signup/success');
    } catch (err: any) {
      console.error('Signup error:', err);
      
      // Handle specific Firebase errors
      if (err?.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Please sign in instead.');
      } else if (err?.code === 'auth/weak-password') {
        setError('Password is too weak. Please choose a stronger password.');
      } else if (err?.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else {
        setError('Failed to create account. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!signupData) {
    return (
      <Box>
        <ResponsiveAppBar />
        <Box sx={{ backgroundColor: '#D9E8DF', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Typography>Loading...</Typography>
        </Box>
        <Footer />
      </Box>
    );
  }

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
          <Card sx={{ maxWidth: 600, width: '100%', mx: 2 }}>
            <CardContent sx={{ p: 4 }}>
              {/* Header */}
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <img
                  src="/cntr_logo.png"
                  alt="CNTR logo"
                  style={{ height: 50, marginBottom: 16 }}
                />
                <Typography variant="h4" sx={{ fontFamily: 'Rubik-Bold, sans-serif', color: '#0C6431', mb: 1 }}>
                  Sign Up
                </Typography>
                <Typography variant="body1" sx={{ fontFamily: 'Rubik, sans-serif', color: '#666' }}>
                  Review your information before creating your account
                </Typography>
              </Box>

              {/* Progress Bar */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ fontFamily: 'Rubik, sans-serif', mb: 1 }}>
                  Step 3 of 3: Review and Submit
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={100} 
                  sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    backgroundColor: '#E0E0E0',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: '#0C6431',
                    }
                  }} 
                />
              </Box>

              {/* Error Alert */}
              {error && (
                <Alert 
                  severity="error" 
                  sx={{ mb: 2, fontFamily: 'Rubik, sans-serif' }}
                  action={
                    error.includes('already registered') ? (
                      <Button
                        color="inherit"
                        size="small"
                        onClick={() => router.push('/signin')}
                        sx={{ fontFamily: 'Rubik, sans-serif', fontWeight: 'bold' }}
                      >
                        Sign In Instead
                      </Button>
                    ) : null
                  }
                >
                  {error}
                </Alert>
              )}

              {/* Review Information */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ fontFamily: 'Rubik-Bold, sans-serif', mb: 2, color: '#0C6431' }}>
                  Account Information
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                  <Typography sx={{ fontFamily: 'Rubik, sans-serif' }}>
                    <strong>Email:</strong> {signupData.email}
                  </Typography>
                  <Typography sx={{ fontFamily: 'Rubik, sans-serif' }}>
                    <strong>First Name:</strong> {signupData.firstName}
                  </Typography>
                  <Typography sx={{ fontFamily: 'Rubik, sans-serif' }}>
                    <strong>Last Name:</strong> {signupData.lastName}
                  </Typography>
                  <Typography sx={{ fontFamily: 'Rubik, sans-serif' }}>
                    <strong>Password:</strong> ••••••••
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Typography variant="h6" sx={{ fontFamily: 'Rubik-Bold, sans-serif', mb: 2, color: '#0C6431' }}>
                  Demographic Information
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography sx={{ fontFamily: 'Rubik, sans-serif' }}>
                    <strong>Role:</strong> {signupData.demographic.role
                      ? signupData.demographic.role
                          .split('_')
                          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                          .join(' ')
                      : 'Not specified'}
                  </Typography>
                </Box>
              </Box>

              {/* Navigation */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button
                  variant="outlined"
                  onClick={handlePrevious}
                  disabled={loading}
                  sx={{
                    borderColor: '#0C6431',
                    color: '#0C6431',
                    fontFamily: 'Rubik, sans-serif',
                    px: 4,
                    py: 1,
                    '&:hover': {
                      borderColor: '#0A4F28',
                      backgroundColor: 'rgba(12, 100, 49, 0.04)',
                    }
                  }}
                >
                  Previous
                </Button>
                
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={loading}
                  sx={{
                    backgroundColor: '#0C6431',
                    fontFamily: 'Rubik, sans-serif',
                    px: 4,
                    py: 1,
                    '&:hover': {
                      backgroundColor: '#0A4F28',
                    }
                  }}
                >
                  {loading ? 'Creating Account...' : 'Submit'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
      <Footer />
    </Box>
  );
}
