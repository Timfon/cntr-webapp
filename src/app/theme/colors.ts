/**
 * Centralized color constants for the CNTR AISLE portal
 * All color values should be defined here and imported where needed
 */

export const colors = {
  primary: '#0C6431',
  primaryDark: '#094d26',
  primaryHover: '#094d26',
  primaryLight: 'rgba(12, 100, 49, 0.1)',
  primaryLighter: 'rgba(12, 100, 49, 0.04)',

  background: {
    main: '#F6FBF7',
    signup: '#D9E8DF',
    light: '#D9E8DF',
    card: '#ffffff',
    white: '#ffffff',
  },

  text: {
    primary: '#333333',
    secondary: '#666',
    tertiary: '#999',
    disabled: '#ccc',
    white: '#ffffff',
  },

  status: {
    success: '#4CAF50',
    successDark: '#45a049',
    error: '#d32f2f',
    warning: '#ff9800',
    info: '#2196F3',
  },

  border: {
    default: '#ccc',
    light: '#e0e0e0',
    lighter: '#eeeeee',
  },

  neutral: {
    gray50: '#fafafa',
    gray100: '#f5f5f5',
    gray200: '#e0e0e0',
    gray300: '#cccccc',
  },

  sidebar: {
    activeBackground: '#CEE7BD',
    activeText: '#1b5e20',
  },
} as const;

