import * as React from 'react';
import { AppProvider } from '@toolpad/core/AppProvider';
import { SignInPage, type AuthProvider } from '@toolpad/core/SignInPage';
import { useTheme } from '@mui/material/styles';
import { auth } from '@/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth'; // Removed GoogleAuthProvider and signInWithPopup

import { Typography, Link } from '@mui/material';
import NextLink from 'next/link';
import "@fontsource/rubik";

// ❌ Removed Google from the provider list
const providers = [
  { id: 'credentials', name: 'Email and Password' },
];

// ✅ Branding object stays the same
const BRANDING = {
  logo: (
    <img
      src="/cntr_logo.png"
      alt="CNTR logo"
      style={{ height: 50 }}
    />
  ),
  title: 'CNTR AISLE',
  description: 'Create an account to begin scoring AI policy.',

};

export default function BrandingSignInPage() {
  const theme = useTheme();

  const customTheme = {
    ...theme,
    typography: {
      ...theme.typography,
      fontFamily: 'Rubik, sans-serif',
      h1: { ...theme.typography.h1, fontFamily: 'Rubik-Bold, sans-serif' },
      h2: { ...theme.typography.h2, fontFamily: 'Rubik-Bold, sans-serif' },
      h3: { ...theme.typography.h3, fontFamily: 'Rubik-Bold, sans-serif' },
      h4: { ...theme.typography.h4, fontFamily: 'Rubik-Bold, sans-serif' },
      h5: { ...theme.typography.h5, fontFamily: 'Rubik-Bold, sans-serif' },
      h6: { ...theme.typography.h6, fontFamily: 'Rubik-Bold, sans-serif' },
      body1: { ...theme.typography.body1, fontFamily: 'Rubik, sans-serif' },
      body2: { ...theme.typography.body2, fontFamily: 'Rubik, sans-serif' },
      button: { ...theme.typography.button, fontFamily: 'Rubik, sans-serif' },
    },
  };

  return (
    <AppProvider branding={BRANDING} theme={customTheme}>
      <SignInPage
        // signIn={signIn}
        providers={providers}
        slotProps={{ emailField: { autoFocus: false }, form: { noValidate: true } }}
        sx={{ mt: -25, mb: -18 }} // Keep or adjust spacing as needed
      />
      {/* ✅ Changed text to sign-up prompt */}
      <Typography variant="body2" sx={{ fontFamily: 'Rubik, sans-serif' }}>
        Don’t have an account?{' '}
        <Link component={NextLink} href="/signup" underline="hover" sx={{ fontWeight: 500 }}>
          Sign up here
        </Link>
      </Typography>
    </AppProvider>
  );
}
