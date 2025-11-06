import { authService } from '@/backend/auth';

export interface SignupData {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  isGoogleUser: boolean;
  demographic?: {
    role: string;
    cohort: string;
  };
}

/**
 * Get signup data from sessionStorage or authenticated Google user
 * Returns SignupData with optional demographic field
 */
export function getSignupData(): SignupData | null {
  const storedData = sessionStorage.getItem('completeSignupData');
  if (storedData) {
    try {
      return JSON.parse(storedData);
    } catch (e) {
      console.error('Error parsing signup data:', e);
    }
  }

  const currentUser = authService.getCurrentUser();
  if (currentUser) {
    const providerData = currentUser.providerData || [];
    const hasGoogleProvider = providerData.some(provider => provider.providerId === 'google.com');
    
    if (hasGoogleProvider) {
      const displayName = currentUser.displayName || '';
      const nameParts = displayName.split(' ');
      return {
        email: currentUser.email || '',
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        password: '',
        isGoogleUser: true,
      };
    }
  }

  return null;
}

