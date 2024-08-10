// components/Loader.tsx

import React from 'react';
import { CircularProgress, Box, useTheme } from '@mui/material';

const Loader: React.FC = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <CircularProgress
        sx={{
          color: theme.palette.primary.main,
        }}
        size={60} // Size of the loader
        thickness={4} // Thickness of the loader circle
      />
    </Box>
  );
};

export default Loader;
