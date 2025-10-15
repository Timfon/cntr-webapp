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
import { backendAuth } from '@/backend/auth';
import { backendFirebase } from '@/backend/firebase';
import ResponsiveAppBar from '@/components/ResponsiveAppBar';
import Footer from '@/components/Footer';
import "@fontsource/rubik";

interface DemographicFormData {
  ageRange: string;
  genderIdentity: string;
  educationLevel: string;
  employmentStatus: string;
}

export default function GoogleDemographicPage() {
  const [formData, setFormData] = useState<DemographicFormData>({
    ageRange: '',
    genderIdentity: '',
    educationLevel: '',
    employmentStatus: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSelectChange = (field: keyof DemographicFormData) => (
    event: any
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
    if (error) setError(null);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const currentUser = backendAuth.getCurrentUser();
      if (!currentUser) {
        setError('No authenticated user found. Please sign in again.');
        return;
      }

      // Create user profile with demographic information
      await backendFirebase.userRoles.createUserProfile(
        currentUser.uid,
        currentUser.email || '',
        currentUser.displayName || undefined,
        'general',
        {
          ageRange: formData.ageRange,
          genderIdentity: formData.genderIdentity,
          educationLevel: formData.educationLevel,
          employmentStatus: formData.employmentStatus,
        }
      );
      
      // Navigate to success page
      router.push('/signup/success');
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to save information. Please try again.');
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
                  Welcome to CNTR AISLE
                </Typography>
                <Typography variant="body1" sx={{ fontFamily: 'Rubik, sans-serif', color: '#666' }}>
                  Tell us a bit about yourself to complete your profile
                </Typography>
              </Box>

              {/* Progress Bar */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ fontFamily: 'Rubik, sans-serif', mb: 1 }}>
                  Complete Your Profile
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
              </Box>

              {/* Submit Button */}
              <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
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
                  {loading ? 'Saving...' : 'Complete Profile'}
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
