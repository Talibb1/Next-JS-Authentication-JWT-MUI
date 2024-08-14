"use client";

import React from 'react';
import { Box } from '@mui/material';
import { PuffLoader } from 'react-spinners';

const Loader: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <PuffLoader
        color="#1976d2" 
        size={160}      
        speedMultiplier={1.5} 
      />
    </Box>
  );
};

export default Loader;
