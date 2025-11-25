'use client';

import * as React from 'react';
import { useState } from 'react';
import { authService } from "@/backend/auth";
import { useRouter } from 'next/navigation';

import { 
  Typography, 
  Link, 
  Card, 
  CardContent, 
  TextField,
  Button, 
  Box,
  Alert,
  Divider 
} from '@mui/material';
import NextLink from 'next/link';
import "@fontsource/rubik";
import { colors } from '@/app/theme/colors';

const BRANDING = {
  logo: (
    <img
      src="/cntr_logo.png"
      alt="CNTR logo"
      style={{ height: 50 }}
    />
  ),
  title: 'CNTR AISLE',
  description: 'Sign in to your account',
};

export default function BrandingSignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);

    try {
      // triggers a redirect to Google OAuth
      const result = await authService.signInWithGoogle();
      if (!result.success) {
        setError(result.error || 'Google sign-in failed');
        setLoading(false);
      }
      // On success, OAuth callback will handle redirect
    } catch (err) {
      setError('Google sign-in failed');
      setLoading(false);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await authService.signInWithEmail(email, password);
      if (result.success) {
        // Force a hard reload to ensure middleware runs
        window.location.href = '/dashboard';
      } else {
        setError(result.error || 'Sign-in failed. Please try again');
      }
    } catch (err: any) {
      console.error('Sign-in error:', err);
      setError('Sign-in failed. Please try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ maxWidth: 400, width: '100%', mx: 2 }}>
      <CardContent sx={{ p: 4, textAlign: 'center' }}>
        {/* Logo */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          {BRANDING.logo}
        </Box>
        
        {/* Title */}
        <Typography variant="h4" sx={{ 
          color: colors.primary, 
          mb: 1,
          mt: 2 
        }}>
          {BRANDING.title}
        </Typography>
        
        {/* Description */}
        <Typography variant="body1" sx={{ 
          color: colors.text.secondary, 
          mb: 3 
        }}>
          {BRANDING.description}
        </Typography>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 2, textAlign: 'left' }}>
            {error}
          </Alert>
        )}

        {/* Sign In Options */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Google Sign In */}
          <Button
            fullWidth
            variant="outlined"
            onClick={handleGoogleSignIn}
            disabled={loading}
            startIcon={
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.64 9.20454C17.64 8.56636 17.5827 7.95272 17.4764 7.36363H9V10.845H13.8436C13.635 11.97 13.0009 12.9231 12.0477 13.5613V15.8195H14.9564C16.6582 14.2527 17.64 11.9454 17.64 9.20454Z" fill="#4285F4"/>
                <path d="M9 18C11.43 18 13.4673 17.1941 14.9564 15.8195L12.0477 13.5613C11.2418 14.1013 10.2109 14.4204 9 14.4204C6.65591 14.4204 4.67182 12.8372 3.96409 10.71H0.957273V13.0418C2.43818 15.9831 5.48182 18 9 18Z" fill="#34A853"/>
                <path d="M3.96409 10.71C3.78409 10.17 3.68182 9.59318 3.68182 9C3.68182 8.40682 3.78409 7.83 3.96409 7.29V4.95818H0.957273C0.347727 6.17318 0 7.54772 0 9C0 10.4523 0.347727 11.8268 0.957273 13.0418L3.96409 10.71Z" fill="#FBBC05"/>
                <path d="M9 3.57955C10.3214 3.57955 11.5077 4.03364 12.4405 4.92545L15.0218 2.34409C13.4632 0.891818 11.4259 0 9 0C5.48182 0 2.43818 2.01682 0.957273 4.95818L3.96409 7.29C4.67182 5.16273 6.65591 3.57955 9 3.57955Z" fill="#EA4335"/>
              </svg>
            }
            sx={{
              mb: 2,
              py: 1.5,
              fontSize: '0.95rem',
              borderColor: '#dadce0',
              color: '#3c4043',
              backgroundColor: 'white',
              '&:hover': {
                borderColor: '#dadce0',
                backgroundColor: '#f8f9fa',
                boxShadow: '0 1px 2px 0 rgba(60,64,67,.30), 0 1px 3px 1px rgba(60,64,67,.15)',
              },
              '&:disabled': {
                backgroundColor: '#f1f3f4',
                color: '#3c4043',
                opacity: 0.6,
              }
            }}
          >
            Sign in with Google
          </Button>

          {/* Divider */}
          <Box sx={{ display: 'flex', alignItems: 'center', my: 1 }}>
            <Divider sx={{ flex: 1 }} />
            <Typography variant="body2" sx={{ 
              color: colors.text.secondary, 
              px: 2 
            }}>
              or
            </Typography>
            <Divider sx={{ flex: 1 }} />
          </Box>

          {/* Email Sign In Form */}
          <form onSubmit={handleEmailSignIn}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              sx={{ mb: 3 }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                backgroundColor: colors.primary,
                py: 1.5,
                '&:hover': {
                  backgroundColor: colors.primaryHover,
                }
              }}
            >
              Sign In with Email
            </Button>
          </form>
        </Box>

        {/* Sign Up Link */}
        <Typography variant="body2" sx={{ 
          mt: 3,
          color: colors.text.secondary
        }}>
          Don't have an account?{' '}
          <Link 
            component={NextLink} 
            href="/signup"
            sx={{ 
              color: colors.primary,
              textDecoration: 'none',
              fontWeight: 500,
              '&:hover': { textDecoration: 'underline' }
            }}
          >
            Sign up here
          </Link>
        </Typography>
        <Typography variant="body2" sx={{ 
          mt: 2,
          color: colors.text.secondary
        }}>
          <Link 
            component={NextLink} 
            href="/forgot-password"
            sx={{ 
              color: colors.primary,
              textDecoration: 'none',
              fontWeight: 500,
              '&:hover': { textDecoration: 'underline' }
            }}
          >
            Forgot your password?
          </Link>
        </Typography>
      </CardContent>
    </Card>
  );
}
