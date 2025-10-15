'use client';

import { useState, useEffect } from 'react';
import { backendAuth } from '@/backend/auth';
import { backendFirebase } from '@/backend/firebase';
import { UserProfile, UserRole } from '@/types/user';

export function useUserRole() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = backendAuth.onAuthStateChanged(async (user) => {
      try {
        setLoading(true);
        setError(null);

        if (user) {
          try {
            const profile = await backendFirebase.userRoles.getUserProfile(user.uid);
            setUserProfile(profile);
          } catch (error) {
            console.log('User profile not found, creating one with general role...');
            // Create profile for existing users who don't have one
            try {
              await backendFirebase.userRoles.createUserProfile(
                user.uid,
                user.email || '',
                user.displayName || undefined,
                'general'
              );
              // Get the newly created profile
              const newProfile = await backendFirebase.userRoles.getUserProfile(user.uid);
              setUserProfile(newProfile);
              console.log('Profile created successfully for existing user');
            } catch (createError) {
              console.error('Failed to create profile for existing user:', createError);
              setUserProfile(null);
            }
          }
        } else {
          setUserProfile(null);
        }
      } catch (err) {
        console.error('Error loading user profile:', err);
        setError('Failed to load user profile');
        setUserProfile(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return {
    userProfile,
    loading,
    error,
  };
}
