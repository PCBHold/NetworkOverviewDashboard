import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { Sun, Moon } from 'lucide-react';
import { useThemeMode } from '../../contexts/ThemeContext';

const ThemeToggle = () => {
  const { mode, toggleTheme } = useThemeMode();

  return (
    <Tooltip title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}>
      <IconButton
        onClick={toggleTheme}
        color="inherit"
        aria-label={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}
        sx={{
          ml: 1,
          '&:hover': {
            backgroundColor: 'action.hover',
          },
        }}
      >
        {mode === 'light' ? <Moon size={20} /> : <Sun size={20} />}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggle;
