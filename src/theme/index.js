import { createTheme } from '@mui/material/styles';

// DHL Brand Colors
const dhlColors = {
  primary: {
    main: '#D40511', // DHL Red
    light: '#FF1D2D',
    dark: '#A6040E',
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#FFCC00', // DHL Yellow
    light: '#FFD633',
    dark: '#CC9900',
    contrastText: '#000000',
  },
};

export const getTheme = (mode = 'light') => createTheme({
  palette: {
    mode,
    ...dhlColors,
    ...(mode === 'light'
      ? {
          // Light mode
          background: {
            default: '#f5f5f5',
            paper: '#ffffff',
          },
          text: {
            primary: '#333333',
            secondary: '#666666',
          },
          divider: '#e0e0e0',
        }
      : {
          // Dark mode
          background: {
            default: '#121212',
            paper: '#1e1e1e',
          },
          text: {
            primary: '#ffffff',
            secondary: '#b0b0b0',
          },
          divider: '#333333',
        }),
    success: {
      main: '#4CAF50',
      light: '#81C784',
      dark: '#388E3C',
    },
    warning: {
      main: '#FF9800',
      light: '#FFB74D',
      dark: '#F57C00',
    },
    error: {
      main: '#f44336',
      light: '#ef5350',
      dark: '#d32f2f',
    },
    info: {
      main: '#2196F3',
      light: '#64B5F6',
      dark: '#1976D2',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.43,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          padding: '8px 16px',
          fontWeight: 500,
        },
        containedPrimary: {
          backgroundColor: dhlColors.primary.main,
          '&:hover': {
            backgroundColor: dhlColors.primary.dark,
          },
        },
        containedSecondary: {
          backgroundColor: dhlColors.secondary.main,
          color: dhlColors.secondary.contrastText,
          '&:hover': {
            backgroundColor: dhlColors.secondary.dark,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: mode === 'light' 
            ? '0 2px 8px rgba(0,0,0,0.1)' 
            : '0 2px 8px rgba(0,0,0,0.4)',
          border: mode === 'light' ? '1px solid #e0e0e0' : '1px solid #333333',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          fontWeight: 500,
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: mode === 'light' ? '#f8f9fa' : '#2a2a2a',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
  spacing: 8,
});

// Backward compatibility
export const theme = getTheme('light');

export default theme;
