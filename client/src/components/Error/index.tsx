'use client';

import React from 'react';
import { Container, Box, Typography, Button } from '@mui/material';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        textAlign: 'center',
        padding: 3,
      }}
    >
      <Box
        sx={{
          width: '150px',
          height: '150px',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="feather feather-alert-triangle"
          style={{ width: '100%', height: '100%' }}
        >
          <path d="M10.29 3.86a1 1 0 0 1 1.42 0l8 8a1 1 0 0 1 .28.7v8a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-8a1 1 0 0 1 .28-.7l8-8z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12" y2="17" />
        </svg>
      </Box>
      <Typography variant="h4" gutterBottom>
        Something Went Wrong
      </Typography>
      <Typography variant="body1" color="textSecondary" gutterBottom>
        An unexpected error occurred. Please try again later.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => reset()}
        sx={{ mt: 2 }}
      >
        Try Again
      </Button>
    </Container>
  );
}
