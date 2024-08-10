"use client";

import React, { useEffect, useState, useMemo } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Link from 'next/link';
import UserMenu from './UserMenu';
import { useRouter } from 'next/navigation';
import { useGetUserQuery, useLogoutUserMutation } from '@/lib/services/api';

const Layout: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userData, setUserData] = useState<{ name: string, email: string, role: string } | null>(null);
  const router = useRouter();
  const { data: response } = useGetUserQuery();
  const [logoutUser] = useLogoutUserMutation();

  useEffect(() => {
    if (response?.user) {
      const user = response.user;
      setIsAuthenticated(user.is_auth);
      setUserData({ name: user.name, email: user.email, role: user.roles[0] });
    }
  }, [response]);

  const settings = useMemo(() => {
    return ['Profile', 'Account', userData?.role === 'admin' ? 'Dashboard' : null, 'Logout'].filter(Boolean) as string[];
  }, [userData?.role]);

  const handleLogout = async () => {
    try {
      await logoutUser().unwrap();
      setIsAuthenticated(false);
      setUserData(null);
      router.push('/Login');
    } catch (error) {
      console.error('Failed to logout', error);
    }
  };

  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            MyApp
          </Typography>
          <Button color="inherit" component={Link} href="/">
            Home
          </Button>
          <Button color="inherit" component={Link} href="/images">
            About
          </Button>
          <Button color="inherit" component={Link} href="/list">
            Contact
          </Button>

          {!isAuthenticated ? (
            <>
              <Button color="inherit" component={Link} href="/Login">
                Login
              </Button>
              <Button color="inherit" component={Link} href="/Signup">
                Signup
              </Button>
            </>
          ) : (
            <>
              <Typography variant="body1" component="div" sx={{ flexGrow: 0, marginRight: 2 }}>
                {userData?.name}
              </Typography>
              <UserMenu
                settings={settings}
                anchorElUser={anchorElUser}
                handleOpenUserMenu={handleOpenUserMenu}
                handleCloseUserMenu={handleCloseUserMenu}
                handleLogout={handleLogout}
              />
            </>
          )}
        </Toolbar>
      </AppBar>
      {/* <main>{children}</main> */}
    </>
  );
};

export default Layout;
