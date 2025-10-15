'use client';

import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Button,
  Typography,
  Alert,
} from '@mui/material';
import { backendAuth } from '@/backend/auth';
import ResponsiveAppBar from '@/components/ResponsiveAppBar';
import Footer from '@/components/Footer';
import "@fontsource/rubik";

export default function DebugPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const testGoogleAuth = async () => {
    setError(null);
    setSuccess(null);
    
    try {
      console.log('Testing Google authentication...');
      const result = await backendAuth.signInWithGoogle();
      
      if (result.success) {
        setSuccess(`Google auth successful! User: ${result.user?.email}`);
        console.log('Google auth result:', result);
      } else {
        setError(`Google auth failed: ${result.error}`);
        console.error('Google auth error:', result.error);
      }
    } catch (err) {
      setError(`Unexpected error: ${err.message}`);
      console.error('Unexpected error:', err);
    }
  };

  const testFirebaseConfig = () => {
    const config = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    };
    
    console.log('Firebase config:', config);
    
    const missing = Object.entries(config).filter(([key, value]) => !value);
    if (missing.length > 0) {
      setError(`Missing environment variables: ${missing.map(([key]) => key).join(', ')}`);
    } else {
      setSuccess('All Firebase environment variables are set');
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
          <Card sx={{ maxWidth: 600, width: '100%', mx: 2 }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h4" sx={{ 
                fontFamily: 'Rubik-Bold, sans-serif', 
                color: '#0C6431', 
                mb: 3,
                textAlign: 'center'
              }}>
                Firebase Debug Tool
              </Typography>
              
              <Typography variant="body1" sx={{ 
                fontFamily: 'Rubik, sans-serif', 
                color: '#666', 
                mb: 4,
                textAlign: 'center'
              }}>
                Use this to debug Firebase authentication issues.
              </Typography>

              {error && (
                <Alert severity="error" sx={{ mb: 2, fontFamily: 'Rubik, sans-serif' }}>
                  {error}
                </Alert>
              )}

              {success && (
                <Alert severity="success" sx={{ mb: 2, fontFamily: 'Rubik, sans-serif' }}>
                  {success}
                </Alert>
              )}

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  variant="outlined"
                  onClick={testFirebaseConfig}
                  sx={{
                    borderColor: '#0C6431',
                    color: '#0C6431',
                    fontFamily: 'Rubik, sans-serif',
                    py: 1.5,
                    '&:hover': {
                      borderColor: '#0A4F28',
                      backgroundColor: 'rgba(12, 100, 49, 0.04)',
                    }
                  }}
                >
                  Check Firebase Configuration
                </Button>

                <Button
                  variant="contained"
                  onClick={testGoogleAuth}
                  sx={{
                    backgroundColor: '#0C6431',
                    fontFamily: 'Rubik, sans-serif',
                    py: 1.5,
                    '&:hover': {
                      backgroundColor: '#0A4F28',
                    }
                  }}
                >
                  Test Google Authentication
                </Button>
              </Box>

              <Typography variant="body2" sx={{ 
                fontFamily: 'Rubik, sans-serif', 
                color: '#666', 
                mt: 3,
                textAlign: 'center',
                fontSize: '0.875rem'
              }}>
                Check the browser console for detailed error messages.
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>
      <Footer />
    </Box>
  );
}
