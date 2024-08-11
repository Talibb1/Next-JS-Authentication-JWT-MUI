'use client';

import React from 'react';
import  Box from '@mui/material/Box';
import  Container from '@mui/material/Container';
import  Typography from '@mui/material/Typography';
import  Button from '@mui/material/Button';
import  CssBaseline from '@mui/material/CssBaseline';
import  SvgIcon from '@mui/material/SvgIcon';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

// Example of using an inline SVG as an icon
const ErrorIcon = (props: any) => (
  <SvgIcon {...props}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
  </SvgIcon>
);

const GlobalError: React.FC<GlobalErrorProps> = ({ error, reset }) => {
  return (
 <>
 <CssBaseline />
 <Container maxWidth="sm">
   <Box
     display="flex"
     flexDirection="column"
     justifyContent="center"
     alignItems="center"
     minHeight="100vh"
   >
     <ErrorIcon color="error" sx={{ fontSize: 60, marginBottom: 2 }} />
     <Typography variant="h4" component="h2" gutterBottom>
       Something went wrong!
     </Typography>
     <Typography variant="body1" color="textSecondary" paragraph>
       {error.message || 'An unexpected error occurred. Please try again.'}
     </Typography>
     <Button variant="contained" color="primary" onClick={reset}>
       Try again
     </Button>
   </Box>
 </Container>
 </>
  );
};

export default GlobalError;
