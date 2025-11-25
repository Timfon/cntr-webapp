"use client";
import React, { useState } from 'react';
import {
  Drawer,
  Box,
  Typography,
  TextField,
  Divider,
  Chip,
  InputAdornment,
  Paper,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { glossary, searchGlossary } from '@/app/data/glossary';
import { colors } from '@/app/theme/colors';

interface GlossaryPanelProps {
  open: boolean;
  onClose: () => void;
}

export default function GlossaryPanel({ open, onClose }: GlossaryPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTerms = searchQuery ? searchGlossary(searchQuery) : glossary;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      variant="persistent"
      transitionDuration={500}
      sx={{
        '& .MuiBackdrop-root': {
          display: 'none',
        },
        '& .MuiDrawer-paper': {
          width: { xs: '100%', sm: 320 },
          maxWidth: '90vw',
          boxShadow: '-4px 0 24px rgba(0, 0, 0, 0.15)',
          position: 'fixed',
          height: '100vh',
          top: 0,
          right: open ? 0 : -320,
          transition: 'right 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        },
      }}
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box
          sx={{
            p: 3,
            pt: 2,
            borderBottom: `1px solid ${colors.border.light}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: colors.background.main,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              color: colors.primary,
              fontWeight: 'bold',
            }}
          >
            Glossary
          </Typography>
        </Box>

        {/* Search Bar */}
        <Box sx={{ p: 2, borderBottom: `1px solid ${colors.border.light}` }}>
          <TextField
            fullWidth
            placeholder="Search for terms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: colors.text.secondary }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: colors.background.white,
                '&:hover fieldset': {
                  borderColor: colors.primary,
                },
                '&.Mui-focused fieldset': {
                  borderColor: colors.primary,
                },
              },
            }}
          />
        </Box>

        {/* Terms List with Definitions */}
        <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
          {filteredTerms.length === 0 ? (
            <Typography
              sx={{
                color: colors.text.tertiary,
                textAlign: 'center',
                mt: 4,
              }}
            >
              No terms found
            </Typography>
          ) : (
            filteredTerms.map((term, index) => (
              <Paper
                key={index}
                sx={{
                  p: 2.5,
                  mb: 2,
                  backgroundColor: colors.background.white,
                  borderRadius: 2,
                  boxShadow: '0px 1px 3px rgba(0,0,0,0.1)',
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color: colors.text.primary,
                    fontWeight: 'bold',
                    mb: 1.5,
                    fontSize: '1.1rem',
                  }}
                >
                  {term.term}
                </Typography>

                <Divider sx={{ mb: 1.5 }} />

                <Typography
                  variant="body2"
                  sx={{
                    color: colors.text.primary,
                    mb: 1.5,
                    lineHeight: 1.6,
                  }}
                >
                  {term.definition}
                </Typography>

                <Box>
                  <Typography
                    variant="caption"
                    sx={{
                      color: colors.text.secondary,
                      mb: 0.5,
                      display: 'block',
                    }}
                  >
                    Potential relevant categories:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {term.categories.map((cat, idx) => (
                      <Chip
                        key={idx}
                        label={cat}
                        size="small"
                        sx={{
                          backgroundColor: colors.primaryLight,
                          color: colors.primaryDark,
                          fontSize: '0.75rem',
                          height: '24px',
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              </Paper>
            ))
          )}
        </Box>
      </Box>
    </Drawer>
  );
}

