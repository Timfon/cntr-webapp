export interface SignupData {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  isGoogleUser: boolean;
  demographic?: {
    role: string;
    cohortId: string;
    cohortName?: string;
  };
}

/**
 * Get signup data from sessionStorage
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
  return null;
}

