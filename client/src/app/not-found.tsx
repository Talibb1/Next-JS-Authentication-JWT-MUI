"use client";

import React from 'react';
import { Container, Box, Typography, Button } from '@mui/material';
import Link from 'next/link';
// import { useRouter } from 'next/router';


interface ErrorPageProps {
  statusCode: number;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ statusCode }) => {



  return (
    <Container maxWidth="sm" style={{ paddingTop: '5rem', textAlign: 'center' }}>
      <Box
        sx={{
          bgcolor: 'background.paper',
          boxShadow: 1,
          borderRadius: 2,
          p: 5,
          textAlign: 'center',
        }}
      >
        <Typography variant="h1" component="h1" gutterBottom>
          {statusCode}
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          {statusCode === 404 ? 'Page Not Found' : 'An Unexpected Error Has Occurred'}
        </Typography>
        <Typography variant="body1" gutterBottom>
          {statusCode === 404
            ? 'The page you are looking for does not exist.'
            : 'Sorry for the inconvenience, please try again later.'}
        </Typography>
      <Link href={"/"} color="primary" >
          Go Back
        </Link>
      </Box>
    </Container>
  );
};

ErrorPage.getInitialProps = async ({ res, err }: { res: any; err: any }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default ErrorPage;
