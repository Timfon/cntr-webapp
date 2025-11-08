"use client";
import * as React from 'react';
import { 
  AppBar, 
  Box, 
  Toolbar, 
  IconButton, 
  Typography, 
  Menu, 
  Container, 
  Avatar, 
  Button, 
  Tooltip, 
  MenuItem,
} from '@mui/material';
import Link from 'next/link';
import { User } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';

import { useRouter } from 'next/navigation';
import "@fontsource/rubik";
import MenuIcon from '@mui/icons-material/Menu';
import { auth } from '@/firebase';
import { authService } from "@/backend/auth";
import { colors } from '@/app/theme/colors';

const pages = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Our Team', href: '/our-team' },
];

export default function ResponsiveAppBar() {
  const [user, setUser] = React.useState<User | null>(null);
  const router = useRouter();
  const settings = user
  ? [
      { label: user.email, onClick: () => {} },
      {
        label: 'Logout',
        onClick: async () => {
          try {
            const result = await authService.signOut();
            if (result.success) {
              router.push('/signin');
            } else {
              console.error("Error signing out:", result.error);
            }
          } catch (error) {
            console.error("Error signing out:", error);
          }
        },
      },
    ]
  : [
      {
        label: 'Sign In',
        onClick: () => router.push('/signin'),
      },
    ];

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };


React.useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
    setUser(firebaseUser);
  });

  return () => unsubscribe();
}, []);

  return (
    <AppBar position="static" sx={{ backgroundColor: colors.background.white }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Avatar 
            src="/cntr_logo.png"
            alt="Logo"
            sx={{ 
              display: { xs: 'none', md: 'flex' }, 
              mr: 2,
              
              width: 50,
              height: 50
            }} 
          />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 5,
              display: { xs: 'none', md: 'flex' },
              fontFamily: "Rubik-ExtraBold",
              fontWeight: '900',
              fontSize: '2.0rem',
              // letterSpacing: '.1rem',
              color: colors.primary,
              textDecoration: 'none',
            }}
          >
            CNTR AISLE
          </Typography>
          
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
              {pages.map((page) => (
  <MenuItem key={page.name} onClick={handleCloseNavMenu}>
    <Typography sx={{ textAlign: 'center' }}>{page.name}</Typography>
  </MenuItem>
))}
            </Menu>
          </Box>

          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: colors.primary,
              textDecoration: 'none',
            }}
          >
            LOGO
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
  {pages.map((page) => (
    <Link key={page.name} href={page.href} style={{ textDecoration: 'none' }}>
      <Button
        onClick={handleCloseNavMenu}
        sx={{
          my: 2,
          color: colors.primary,
          display: 'block',
          mx: 1.5,
        }}
      >
        {page.name}
      </Button>
    </Link>
  ))}
</Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, width: 40, height: 40 }}>
                <Avatar alt="User" src="/user_icon.png" sx={{width: 30, height: 30}}/>
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
  <MenuItem 
    key={setting.label} 
    onClick={() => {
      handleCloseUserMenu();
      setting.onClick();
    }}
  >
    <Typography sx={{ textAlign: 'center' }}>{setting.label}</Typography>
  </MenuItem>
))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}