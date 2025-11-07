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
  background: {
    default: '#f5f5f5',
    paper: '#ffffff',
  },
  text: {
    primary: '#333333',
    secondary: '#666666',
  },
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
};

export const theme = createTheme({
  palette: dhlColors,
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      color: dhlColors.text.primary,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      color: dhlColors.text.primary,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
      color: dhlColors.text.primary,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
      color: dhlColors.text.primary,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
      color: dhlColors.text.primary,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
      color: dhlColors.text.primary,
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
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          border: '1px solid #e0e0e0',
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
          backgroundColor: '#f8f9fa',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
          color: dhlColors.text.primary,
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

export default theme;