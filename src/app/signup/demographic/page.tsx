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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { authService } from '@/backend/auth';
import ResponsiveAppBar from '@/components/ResponsiveAppBar';
import Footer from '@/components/Footer';
import "@fontsource/rubik";

interface DemographicFormData {
  ageRange: string;
  genderIdentity: string;
  educationLevel: string;
  employmentStatus: string;
  role: string;
}

interface SignupData {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  isGoogleUser: boolean;
}

export default function DemographicPage() {
  const [formData, setFormData] = useState<DemographicFormData>({
    ageRange: '',
    genderIdentity: '',
    educationLevel: '',
    employmentStatus: '',
    role: 'general',
  });
  const [signupData, setSignupData] = useState<SignupData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Get signup data from sessionStorage
    const storedData = sessionStorage.getItem('signupData');
    if (storedData) {
      setSignupData(JSON.parse(storedData));
    } else {
      // Check if user is authenticated (Google user)
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        // Google user - create signup data from authenticated user
        setSignupData({
          email: currentUser.email || '',
          firstName: currentUser.displayName?.split(' ')[0] || '',
          lastName: currentUser.displayName?.split(' ').slice(1).join(' ') || '',
          password: '',
          isGoogleUser: true,
        });
      } else {
        // If no signup data, redirect to account page
        router.push('/signup/account');
      }
    }
  }, [router]);

  const handleSelectChange = (field: keyof DemographicFormData) => (
    event: any
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
    if (error) setError(null);
  };

  const handlePrevious = () => {
    if (signupData?.isGoogleUser) {
      // Google users can't go back to account page, redirect to signup
      router.push('/signup');
    } else {
      router.push('/signup/account');
    }
  };

  const handleNext = async () => {
    if (!signupData) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Store all data for the review step
      const completeData = {
        ...signupData,
        demographic: formData,
      };
      sessionStorage.setItem('completeSignupData', JSON.stringify(completeData));
      
      // Navigate to review page
      router.push('/signup/review');
    } catch (err) {
      setError('Failed to proceed. Please try again.');
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
                  Tell us a bit about yourself (optional)
                </Typography>
              </Box>

              {/* Progress Bar */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ fontFamily: 'Rubik, sans-serif', mb: 1 }}>
                  Step 2 of 3: Demographic Information
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={66} 
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
                <FormControl fullWidth>
                  <InputLabel sx={{ fontFamily: 'Rubik, sans-serif' }}>Age Range</InputLabel>
                  <Select
                    value={formData.ageRange}
                    label="Age Range"
                    onChange={handleSelectChange('ageRange')}
                    sx={{ fontFamily: 'Rubik, sans-serif' }}
                  >
                    <MenuItem value="18-21">18-21</MenuItem>
                    <MenuItem value="22-25">22-25</MenuItem>
                    <MenuItem value="26-30">26-30</MenuItem>
                    <MenuItem value="31-40">31-40</MenuItem>
                    <MenuItem value="41-50">41-50</MenuItem>
                    <MenuItem value="51-60">51-60</MenuItem>
                    <MenuItem value="60+">60+</MenuItem>
                    <MenuItem value="prefer-not-to-say">Prefer not to say</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel sx={{ fontFamily: 'Rubik, sans-serif' }}>Gender Identity</InputLabel>
                  <Select
                    value={formData.genderIdentity}
                    label="Gender Identity"
                    onChange={handleSelectChange('genderIdentity')}
                    sx={{ fontFamily: 'Rubik, sans-serif' }}
                  >
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                    <MenuItem value="non-binary">Non-binary</MenuItem>
                    <MenuItem value="transgender">Transgender</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                    <MenuItem value="prefer-not-to-say">Prefer not to say</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel sx={{ fontFamily: 'Rubik, sans-serif' }}>Highest Level of Education</InputLabel>
                  <Select
                    value={formData.educationLevel}
                    label="Highest Level of Education"
                    onChange={handleSelectChange('educationLevel')}
                    sx={{ fontFamily: 'Rubik, sans-serif' }}
                  >
                    <MenuItem value="high-school">High School</MenuItem>
                    <MenuItem value="some-college">Some College</MenuItem>
                    <MenuItem value="associates">Associate's Degree</MenuItem>
                    <MenuItem value="bachelors">Bachelor's Degree</MenuItem>
                    <MenuItem value="masters">Master's Degree</MenuItem>
                    <MenuItem value="doctorate">Doctorate</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                    <MenuItem value="prefer-not-to-say">Prefer not to say</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel sx={{ fontFamily: 'Rubik, sans-serif' }}>Employment Status</InputLabel>
                  <Select
                    value={formData.employmentStatus}
                    label="Employment Status"
                    onChange={handleSelectChange('employmentStatus')}
                    sx={{ fontFamily: 'Rubik, sans-serif' }}
                  >
                    <MenuItem value="full-time-student">Full-time Student</MenuItem>
                    <MenuItem value="part-time-student">Part-time Student</MenuItem>
                    <MenuItem value="employed-full-time">Employed Full-time</MenuItem>
                    <MenuItem value="employed-part-time">Employed Part-time</MenuItem>
                    <MenuItem value="self-employed">Self-employed</MenuItem>
                    <MenuItem value="unemployed">Unemployed</MenuItem>
                    <MenuItem value="retired">Retired</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                    <MenuItem value="prefer-not-to-say">Prefer not to say</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel sx={{ fontFamily: 'Rubik, sans-serif' }}>Role</InputLabel>
                  <Select
                    value={formData.role}
                    label="Role"
                    onChange={handleSelectChange('role')}
                    sx={{ fontFamily: 'Rubik, sans-serif' }}
                  >
                    <MenuItem value="undergraduate">Undergraduate</MenuItem>
                    <MenuItem value="advanced">Advanced</MenuItem>
                    <MenuItem value="expert">Expert</MenuItem>
                    <MenuItem value="legislative_staff">Legislative Staff</MenuItem>
                    <MenuItem value="general">General</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              {/* Navigation */}
              <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
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
