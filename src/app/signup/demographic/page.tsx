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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { authService } from '@/backend/auth';
import ResponsiveAppBar from '@/app/components/ResponsiveAppBar';
import Footer from '@/app/components/Footer';
import "@fontsource/rubik";
import { UserRole } from '@/types/user';
import { getSignupData } from '../signupUtils';

interface DemographicFormData {
  role: UserRole;
  cohort: string;
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
    role: 'general',
    cohort: '',
  });
  const [signupData, setSignupData] = useState<SignupData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const data = getSignupData();
    if (data) {
      setSignupData(data);
      if (data.demographic) {
        setFormData({
          role: (data.demographic.role || 'general') as UserRole,
          cohort: data.demographic.cohort || '',
        });
      }
    } else {
      router.push('/signup/account');
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
      router.push('/signup/account');
  };

  const handleNext = async () => {
    if (!signupData) return;
    
    if (!formData.cohort) {
      setError('Please select a cohort');
      return;
    }
    
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
                  <InputLabel sx={{ fontFamily: 'Rubik, sans-serif' }}>Role</InputLabel>
                  <Select
                    defaultValue="general"
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

                <FormControl fullWidth required>
                  <InputLabel sx={{ fontFamily: 'Rubik, sans-serif' }}>Cohort</InputLabel>
                  <Select
                    value={formData.cohort}
                    label="Cohort"
                    onChange={handleSelectChange('cohort')}
                    sx={{ fontFamily: 'Rubik, sans-serif' }}
                  >
                    <MenuItem value="fall-2025">Fall 2025</MenuItem>
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
