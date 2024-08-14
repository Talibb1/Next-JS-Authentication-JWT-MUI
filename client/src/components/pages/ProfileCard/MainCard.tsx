"use client";

import React, { useEffect, useState } from 'react';
import { Box, Container, Typography } from '@mui/material';
import { useGetUserQuery } from '@/lib/services/api';
import UserCard from './UserCard';

export default function MainCard() {
  const { data: response } = useGetUserQuery();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState({ name: '', email: '', role: '', picture: '' });

  useEffect(() => {
    if (response?.user) {
      const user = (response as any).user;
      setIsAuthenticated(user.is_auth);
      setUserData({ 
        name: user.name, 
        email: user.email, 
        role: user.roles[0],
        picture: user.picture || 'assets/avatar_12.jpg' // Default picture if not available
      });
    }
  }, [response]);

  return (
    <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
      <Box>
        {isAuthenticated ? (
          
          <UserCard 
            name={userData.name} 
            email={userData.email} 
            role={userData.role}
            picture={userData.picture} 
          />
        ) : (
          <Typography variant="h6" align="center">User not authenticated</Typography>
        )}
      </Box>
    </Container>
  );
}