"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Container, Typography, Tabs, Tab } from '@mui/material';
import ResponsiveAppBar from '@/app/components/ResponsiveAppBar';
import Footer from '@/app/components/Footer';
import Loading from '@/app/components/Loading';
import { colors } from '@/app/theme/colors';
import UserManagement from './UserManagement';
import Assignments from './Assignments';
import { authService } from '@/backend/auth';
import { adminService } from '@/backend/admin';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);

  React.useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        const user = await authService.getCurrentUser();
        if (!user) {
          router.push('/signin');
          return;
        }

        const admin = await adminService.isAdmin(user.id);
        if (!admin) {
          router.push('/dashboard');
          return;
        }

        setIsAuthorized(true);
      } catch (error) {
        console.error('Error checking admin access:', error);
        router.push('/signin');
      } finally {
        setLoading(false);
      }
    };

    checkAdminAccess();
  }, [router]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  if (loading) {
    return <Loading />;
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: colors.background.main }}>
      <ResponsiveAppBar />
      <Container maxWidth={false} sx={{ py: 4, px: 4 }}>
        <Typography
          variant="h4"
          sx={{
            color: colors.text.primary,
            fontWeight: 'bold',
            mb: 1,
          }}
        >
          Admin Dashboard
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: colors.text.secondary,
            mb: 4,
          }}
        >
          Manage users and assignments
        </Typography>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 500,
                color: colors.text.secondary,
                '&.Mui-selected': {
                  color: colors.primary,
                  fontWeight: 600,
                },
              },
              '& .MuiTabs-indicator': {
                backgroundColor: colors.primary,
              },
            }}
          >
            <Tab label="User Management" />
            <Tab label="Assignments" />
          </Tabs>
        </Box>

        <TabPanel value={currentTab} index={0}>
          <UserManagement />
        </TabPanel>

        <TabPanel value={currentTab} index={1}>
          <Assignments />
        </TabPanel>
      </Container>
      <Footer />
    </Box>
  );
}

