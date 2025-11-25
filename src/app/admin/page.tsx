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
import { useAuth } from '@/contexts/AuthContext';
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
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);

  React.useEffect(() => {
    const checkAdminAccess = async () => {
      if (authLoading) {
        return;
      }

      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const admin = await adminService.isAdmin(user.id);
        if (!admin) {
          router.push('/dashboard');
          return;
        }

        setIsAuthorized(true);
      } catch (error) {
        console.error('Error checking admin access:', error);
        router.push('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    checkAdminAccess();
  }, [user, authLoading, router]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  if (loading || authLoading) {
    return <Loading />;
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: colors.background.main }}>
      <ResponsiveAppBar />
      <Container maxWidth={false} sx={{ py: 4, px: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 0.2 }}>
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

