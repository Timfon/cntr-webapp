import * as React from 'react';
import { auth } from '@/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { authService } from "@/backend/auth";
import { useRouter } from 'next/navigation';
import { Typography, Link, TextField, Button, Box, Alert } from '@mui/material';
import NextLink from 'next/link';

export default function BrandingSignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const hasCompleted = await authService.hasCompletedProfile(user.uid);
        if (hasCompleted) {
          router.push('/dashboard');
        }
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await authService.signInWithGoogle();
      console.log('Google sign-in result:', result);
      if (result.success) {
        console.log('Google sign-in success:', result.user);
        if (result.isNewUser) {
          await sessionStorage.setItem('completeSignupData', JSON.stringify({
            email: result.user.email || '',
            firstName: result.user.displayName?.split(' ')[0] || '',
            lastName: result.user.displayName?.split(' ').slice(1).join(' ') || '',
            password: '',
            isGoogleUser: true,
          }));
          router.push('/signup/account');
        } else {
          router.push('/dashboard');
        }
      } else {
        setError(result.error || 'Google sign-in failed');
      }
    } catch (err) {
      setError('Google sign-in failed');
    } finally {
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
        router.push('/dashboard');  
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
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#D9E8DF",
        px: 2,
      }}
    >
      <Box
        sx={{
          backgroundColor: "white",
          p: 4,
          boxShadow: 3,
          width: "100%",
          maxWidth: 400,
        }}
      >
        {/* Logo */}
        <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
          <img src="/cntr_logo.png" alt="CNTR logo" style={{ height: 50 }} />
        </Box>

        {/* Title */}
        <Typography
          variant="h4"
          sx={{
            textAlign: "center",
            mb: 3,
            color: "#0C6431",
          }}
        >
          Sign in to CNTR AISLE
        </Typography>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Google Sign In Button */}
        <Button
          fullWidth
          variant="outlined"
          onClick={handleGoogleSignIn}
          disabled={loading}
          startIcon={
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M17.64 9.20454C17.64 8.56636 17.5827 7.95272 17.4764 7.36363H9V10.845H13.8436C13.635 11.97 13.0009 12.9231 12.0477 13.5613V15.8195H14.9564C16.6582 14.2527 17.64 11.9454 17.64 9.20454Z"
                fill="#4285F4"
              />
              <path
                d="M9 18C11.43 18 13.4673 17.1941 14.9564 15.8195L12.0477 13.5613C11.2418 14.1013 10.2109 14.4204 9 14.4204C6.65591 14.4204 4.67182 12.8372 3.96409 10.71H0.957273V13.0418C2.43818 15.9831 5.48182 18 9 18Z"
                fill="#34A853"
              />
              <path
                d="M3.96409 10.71C3.78409 10.17 3.68182 9.59318 3.68182 9C3.68182 8.40682 3.78409 7.83 3.96409 7.29V4.95818H0.957273C0.347727 6.17318 0 7.54772 0 9C0 10.4523 0.347727 11.8268 0.957273 13.0418L3.96409 10.71Z"
                fill="#FBBC05"
              />
              <path
                d="M9 3.57955C10.3214 3.57955 11.5077 4.03364 12.4405 4.92545L15.0218 2.34409C13.4632 0.891818 11.4259 0 9 0C5.48182 0 2.43818 2.01682 0.957273 4.95818L3.96409 7.29C4.67182 5.16273 6.65591 3.57955 9 3.57955Z"
                fill="#EA4335"
              />
            </svg>
          }
          sx={{
            mb: 2,
            py: 1.5,
            borderColor: "#0C6431",
            color: "#0C6431",
            "&:hover": {
              borderColor: "#0A4F28",
              backgroundColor: "rgba(12, 100, 49, 0.04)",
            },
          }}
        >
          Sign In
        </Button>

        {/* Divider */}
        <Box sx={{ display: "flex", alignItems: "center", my: 2 }}>
          <Box sx={{ flex: 1, height: 1, backgroundColor: "#e0e0e0" }} />
          <Typography variant="body2" sx={{ mx: 2, color: "#666" }}>
            or
          </Typography>
          <Box sx={{ flex: 1, height: 1, backgroundColor: "#e0e0e0" }} />
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
              py: 1.5,
              backgroundColor: "#0C6431",
              "&:hover": {
                backgroundColor: "#0A4F28",
              },
            }}
          >
            Sign In
          </Button>
        </form>

        {/* Sign Up Link */}
        <Typography variant="body2" sx={{ mt: 3, textAlign: "center" }}>
          Don't have an account?{" "}
          <Link
            component={NextLink}
            href="/signup"
            underline="hover"
            sx={{ fontWeight: 500 }}
          >
            Sign up here
          </Link>
        </Typography>
        <Typography variant="body2" sx={{ mt: 3, textAlign: "center" }}>
          <Link
            component={NextLink}
            href="/forgot-password"
            underline="hover"
            sx={{ fontWeight: 500 }}
          >
            Forgot your password?
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}
