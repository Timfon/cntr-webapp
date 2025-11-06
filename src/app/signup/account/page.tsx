'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  LinearProgress,
  Alert,
  Link,
} from '@mui/material';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import ResponsiveAppBar from '@/app/components/ResponsiveAppBar';
import Footer from '@/app/components/Footer';
import "@fontsource/rubik";
import { getSignupData } from '../signupUtils';

interface AccountInfoFormData {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
}

export default function AccountInfoPage() {
  const [formData, setFormData] = useState<AccountInfoFormData>({
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isGoogleUser, setIsGoogleUser] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const signupData = getSignupData();
    const shouldAutoFill = signupData?.isGoogleUser || signupData?.demographic;
    
    if (shouldAutoFill && signupData) {
      setIsGoogleUser(signupData.isGoogleUser);
      setFormData({
        email: signupData.email,
        firstName: signupData.firstName,
        lastName: signupData.lastName,
        password: signupData.isGoogleUser ? '' : signupData.password || '',
        confirmPassword: signupData.isGoogleUser ? '' : signupData.password || '',
      });
    }
  }, []);

  const handleInputChange = (field: keyof AccountInfoFormData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
    if (error) setError(null);
  };

  const validateForm = (): boolean => {
    if (!formData.email || !formData.firstName || !formData.lastName) {
      setError('Please fill in all required fields');
      return false;
    }
    
    // Password validation only required for non-Google users
    if (!isGoogleUser) {
      if (!formData.password) {
        setError('Please enter a password');
        return false;
      }
      
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return false;
      }
      
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters long');
        return false;
      }
    }
    
    return true;
  };

  const handleNext = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const existingData = sessionStorage.getItem('completeSignupData');
      const baseData = existingData ? JSON.parse(existingData) : {};
      
      sessionStorage.setItem('completeSignupData', JSON.stringify({
        ...baseData,
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        password: isGoogleUser ? '' : formData.password,
        isGoogleUser: isGoogleUser,
      }));
      
      // Navigate to demographic page
      router.push('/signup/demographic');
    } catch (err) {
      setError('Failed to proceed. Please try again.');
    } finally {
      setLoading(false);
    }
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
                  {isGoogleUser 
                    ? 'Review and confirm your account information' 
                    : 'Create your account to begin scoring AI policy'}
                </Typography>
              </Box>

              {/* Progress Bar */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ fontFamily: 'Rubik, sans-serif', mb: 1 }}>
                  Step 1 of 3: Account Information
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={33} 
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
                <Alert severity="error" sx={{ mb: 2, fontFamily: 'Rubik, sans-serif' }}>
                  {error}
                </Alert>
              )}

              {/* Form Fields */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  disabled={isGoogleUser}
                  fullWidth
                  required
                  sx={{ fontFamily: 'Rubik, sans-serif' }}
                />
                
                <TextField
                  label="First Name"
                  value={formData.firstName}
                  onChange={handleInputChange('firstName')}
                  fullWidth
                  required
                  sx={{ fontFamily: 'Rubik, sans-serif' }}
                />
                
                <TextField
                  label="Last Name"
                  value={formData.lastName}
                  onChange={handleInputChange('lastName')}
                  fullWidth
                  required
                  sx={{ fontFamily: 'Rubik, sans-serif' }}
                />
                
                {!isGoogleUser && (
                  <>
                    <TextField
                      label="Password"
                      type="password"
                      value={formData.password}
                      onChange={handleInputChange('password')}
                      fullWidth
                      required
                      sx={{ fontFamily: 'Rubik, sans-serif' }}
                    />
                    
                    <TextField
                      label="Confirm Password"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange('confirmPassword')}
                      fullWidth
                      required
                      sx={{ fontFamily: 'Rubik, sans-serif' }}
                    />
                  </>
                )}
              </Box>

              {/* Navigation */}
              <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link 
                  component={NextLink} 
                  href="/signin" 
                  sx={{ 
                    fontFamily: 'Rubik, sans-serif',
                    color: '#0C6431',
                    textDecoration: 'none',
                    '&:hover': { textDecoration: 'underline' }
                  }}
                >
                  Already have an account? Sign in here
                </Link>
                
                <Button
                  variant="contained"
                  onClick={handleNext}
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
                  {loading ? 'Processing...' : 'Next'}
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
