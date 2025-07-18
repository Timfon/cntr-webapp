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
  Grid,
  Card,
  CardContent,
  Paper
} from '@mui/material';
import ResponsiveAppBar from './ResponsiveAppBar';
import { useRouter } from 'next/navigation';
import "@fontsource/rubik";
import MenuIcon from '@mui/icons-material/Menu';
import AdbIcon from '@mui/icons-material/Adb';

export default function Footer() {
  return (
    <Box sx={{ backgroundColor: '#07361B', color: 'white', py: 6 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar
                src="/cntr_logo.png"
                alt="Logo"
                sx={{ width: 40, height: 40, mr: 2 }}
              />
              <Typography
                variant="h6"
                sx={{
                  fontFamily: 'Rubik',
                  fontWeight: 'bold',
                }}
              >
                Center for Technological Responsibility, Reimagination, and Redesign (CNTR)
              </Typography>
            </Box>
            <Typography
              variant="body2"
              sx={{
                mb: 1,
                fontFamily: 'Rubik',
              }}
            >
              Brown University
            </Typography>
            <Typography
              variant="body2"
              sx={{
                mb: 1,
                fontFamily: 'Rubik',
              }}
            >
              Providence, RI 02912
            </Typography>
            <Typography
              variant="body2"
              sx={{
                mb: 1,
                fontFamily: 'Rubik',
              }}
            >
              401-863-1000
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontFamily: 'Rubik',
              }}
            >
               © Brown University 2025
            </Typography>

            
            
            
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}