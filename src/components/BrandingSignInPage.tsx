import * as React from 'react';
import { AppProvider } from '@toolpad/core/AppProvider';
import { SignInPage, type AuthProvider } from '@toolpad/core/SignInPage';
import { useTheme } from '@mui/material/styles';
import { auth } from '@/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect } from 'react';
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  GithubAuthProvider,
} from 'firebase/auth';
import { useRouter } from 'next/navigation';

import { Typography, Link } from '@mui/material';
import NextLink from 'next/link';
import '@fontsource/rubik';

const providers = [
  { id: 'google', name: 'Google' },
  { id: 'github', name: 'GitHub' },
  { id: 'facebook', name: 'Facebook' },
  { id: 'twitter', name: 'Twitter' },
  { id: 'linkedin', name: 'LinkedIn' },
];

// preview-start
const BRANDING = {
  logo: (
    <img
      src="/cntr_logo.png"
      alt="CNTR logo"
      style={{ height: 50 }}
    />
  ),
  title: 'CNTR AISLE',
};
// preview-end

export default function BrandingSignInPage() {

  useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("User is signed in:", user);
    } else {
      console.log("No user is signed in.");
    }
  });

  return () => unsubscribe(); // cleanup listener
}, []);
  const theme = useTheme();
  const router = useRouter();

  const signIn = async (provider: AuthProvider, formData?: any, callbackUrl?: string) => {
  if (provider.id === 'google') {
    const googleProvider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log('Google sign-in success:', result.user);
      router.push('/scorecard');
      return { type: 'CredentialsSignin' }; // Return AuthResponse
    } catch (error) {
      console.error('Google sign-in error:', error);
      return { error: 'Google sign-in failed' }; // Return error response
    }
  } else if (provider.id === 'credentials') {
    const email = prompt('Enter your email:');
    const password = prompt('Enter your password:');
    if (!email || !password) {
      console.warn('Email or password is empty.');
      return { error: 'Email or password is empty' };
    }
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log('Email sign-in success:', result.user);
      router.push('/scorecard');
      return { type: 'CredentialsSignin' };
    } catch (error) {
      console.error('Email sign-in error:', error);
      return { error: 'Email sign-in failed' };
    }
  } else {
    console.warn('Unknown provider:', provider.id);
    return { error: 'Unknown provider' };
  }
};

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
        signIn={signIn}
        providers={providers}
        slotProps={{ emailField: { autoFocus: false }, form: { noValidate: true } }}
        sx={{ mt: -25, mb: -18 }}
      />
    </AppProvider>
  );
}
