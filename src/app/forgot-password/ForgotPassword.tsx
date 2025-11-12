'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Link,
} from '@mui/material';
import NextLink from 'next/link';
import { authService } from '@/backend/auth';
import { colors } from '@/app/theme/colors';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await authService.sendPasswordReset(email.trim());
      if (result.success) {
        setSuccess('Check your inbox for a password reset link.');
        setEmail('');
      } else {
        setError(result.error || 'Failed to send reset email. Please try again.');
      }
    } catch (err) {
      console.error('Password reset error:', err);
      setError('Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#D9E8DF',
        px: 2,
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          backgroundColor: colors.background.white,
          p: 4,
          boxShadow: 3,
          width: '100%',
          maxWidth: 400,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <img src="/cntr_logo.png" alt="CNTR logo" style={{ height: 50 }} />
        </Box>

        <Typography
          variant="h4"
          sx={{
            textAlign: 'center',
            mb: 1,
            color: colors.primary,
          }}
        >
          Forgot Password
        </Typography>

        <Typography
          variant="body2"
          sx={{
            textAlign: 'center',
            mb: 3,
            color: colors.text.secondary,
          }}
        >
          Enter your email and we&apos;ll send you a link to reset your password.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <TextField
          fullWidth
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
            py: 1.5,
            backgroundColor: colors.primary,
            '&:hover': {
              backgroundColor: colors.primaryHover,
            },
          }}
        >
          {loading ? 'Sending...' : 'Send Reset Link'}
        </Button>

        <Typography variant="body2" sx={{ mt: 3, textAlign: 'center' }}>
          <Link component={NextLink} href="/signin" underline="hover" sx={{ fontWeight: 500 }}>
            Back to Sign In
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default ForgotPassword;

