"use client";

import React, { useEffect, useState } from 'react';
import { Box, Container } from '@mui/material';
import UserCard from "./UserCard"
import { useGetUserQuery } from '@/lib/services/auth';

export default function MainCard() {
  const { data: response } = useGetUserQuery();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState({ name: '', email: '', role: '' });

  useEffect(() => {
    if (response?.user) {
      const user = response.user;
      setIsAuthenticated(user.is_auth);
      setUserData({ name: user.name, email: user.email, role: user.roles[0] });
    }
  }, [response]);

  return (
    <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
      <Box>
        {isAuthenticated ? (
          <UserCard name={userData.name} email={userData.email} role={userData.role} />
        ) : (
          <p>User not authenticated</p>
        )}
      </Box>
    </Container>
  );
}
