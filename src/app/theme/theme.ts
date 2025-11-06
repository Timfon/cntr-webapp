import { createTheme } from '@mui/material/styles';
import { colors } from './colors';

export const theme = createTheme({
  palette: {
    primary: {
      main: colors.primary,
      dark: colors.primaryDark,
      light: colors.primaryLight,
    },
    text: {
      primary: colors.text.primary,
      secondary: colors.text.secondary,
      disabled: colors.text.disabled,
    },
    background: {
      default: colors.background.main,
      paper: colors.background.card,
    },
    error: {
      main: colors.status.error,
    },
    success: {
      main: colors.status.success,
    },
    warning: {
      main: colors.status.warning,
    },
    info: {
      main: colors.status.info,
    },
  },
  typography: {
    fontFamily: 'Rubik, sans-serif',
    h1: {
      fontFamily: 'Rubik-Bold, sans-serif',
      fontWeight: 'bold',
    },
    h2: {
      fontFamily: 'Rubik-Bold, sans-serif',
      fontWeight: 'bold',
    },
    h3: {
      fontFamily: 'Rubik-Bold, sans-serif',
      fontWeight: 'bold',
    },
    h4: {
      fontFamily: 'Rubik-Bold, sans-serif',
      fontWeight: 'bold',
    },
    h5: {
      fontFamily: 'Rubik-Bold, sans-serif',
      fontWeight: 'bold',
    },
    h6: {
      fontFamily: 'Rubik-Bold, sans-serif',
      fontWeight: 'bold',
    },
    body1: {
      fontFamily: 'Rubik, sans-serif',
    },
    body2: {
      fontFamily: 'Rubik, sans-serif',
    },
    button: {
      fontFamily: 'Rubik, sans-serif',
      textTransform: 'none', // Remove default uppercase
    },
  },
  shape: {
    borderRadius: 5, // Default border radius (MUI units)
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
        },
        contained: {
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          '&:hover': {
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          borderRadius: 0, // No border radius for navbar
        },
      },
    },
  },
});

