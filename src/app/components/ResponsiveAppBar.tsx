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
import { useRouter } from 'next/navigation';
import "@fontsource/rubik";
import MenuIcon from '@mui/icons-material/Menu';
import { colors } from '@/app/theme/colors';
import { adminService } from '@/backend/admin';
import { useAuth } from '@/contexts/AuthContext';

const pages = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "View All Bills", href: "/view-all-bills" },
  { name: "Our Team", href: "/our-team" },
];

export default function ResponsiveAppBar() {
  const { user, signOut } = useAuth();
  const [isAdmin, setIsAdmin] = React.useState(false);
  const router = useRouter();

  const settings = user
  ? [
      { label: user.email || 'User', onClick: () => {} },
      {
        label: 'Settings',
        onClick: () => router.push('/settings'),
      },
      {
        label: 'Logout',
        onClick: async () => {
          await signOut();
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

  // Check if user is admin
  React.useEffect(() => {
    const checkAdmin = async () => {
      if (user) {
        const admin = await adminService.isAdmin(user.id);
        setIsAdmin(admin);
      } else {
        setIsAdmin(false);
      }
    };

    checkAdmin();
  }, [user]);

  return (
    <AppBar position="static" elevation={0} sx={{ backgroundColor: colors.background.white, boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ display: { xs: "none", md: "flex" }, mr: 2 }}>
            <Link
              href="/"
              style={{
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
              }}
            >
              <img
                src="/cntr_logo.png"
                alt="CNTR logo"
                style={{ height: 50 }}
              />
            </Link>
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
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
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: "block", md: "none" } }}
            >
              {isAdmin && (
                <MenuItem
                  onClick={() => {
                    handleCloseNavMenu();
                    router.push("/admin");
                  }}
                >
                  <Typography sx={{ textAlign: "center" }}>
                    Admin Dashboard
                  </Typography>
                </MenuItem>
              )}
              {pages.map((page) => (
                <MenuItem
                  key={page.name}
                  onClick={() => {
                    handleCloseNavMenu();
                    router.push(page.href);
                  }}
                >
                  <Typography sx={{ textAlign: "center" }}>
                    {page.name}
                  </Typography>
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
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: colors.primary,
              textDecoration: "none",
            }}
          >
            LOGO
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Link
                key={page.name}
                href={page.href}
                style={{ textDecoration: "none" }}
              >
                <Button
                  onClick={handleCloseNavMenu}
                  sx={{
                    my: 2,
                    color: colors.primary,
                    display: "block",
                    mx: 1.5,
                  }}
                >
                  {page.name}
                </Button>
              </Link>
            ))}
            {isAdmin && (
              <Link href="/admin" style={{ textDecoration: "none" }}>
                <Button
                  onClick={handleCloseNavMenu}
                  sx={{
                    my: 2,
                    color: colors.primary,
                    display: "block",
                    mx: 1.5,
                  }}
                >
                  Admin Dashboard
                </Button>
              </Link>
            )}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton
                onClick={handleOpenUserMenu}
                sx={{ p: 0, width: 40, height: 40 }}
              >
                <Avatar
                  alt="User"
                  src="/user_icon.png"
                  sx={{ width: 30, height: 30 }}
                />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
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
                  <Typography sx={{ textAlign: "center" }}>
                    {setting.label}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}