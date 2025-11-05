"use client";
import React, { useState } from 'react';
import {
  Drawer,
  Box,
  Typography,
  TextField,
  IconButton,
  Divider,
  Chip,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  Paper,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import { glossary, GlossaryTerm, searchGlossary } from '@/app/data/glossary';

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
            borderBottom: '1px solid #e0e0e0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#F6FBF7',
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontFamily: 'Rubik-Bold',
              color: '#0C6431',
              fontWeight: 'bold',
            }}
          >
            Glossary
          </Typography>
        </Box>

        {/* Search Bar */}
        <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
          <TextField
            fullWidth
            placeholder="Search for terms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#666' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'white',
                fontFamily: 'Rubik',
                '&:hover fieldset': {
                  borderColor: '#0C6431',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#0C6431',
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
                fontFamily: 'Rubik',
                color: '#999',
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
                  backgroundColor: 'white',
                  borderRadius: 2,
                  boxShadow: '0px 1px 3px rgba(0,0,0,0.1)',
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: 'Rubik-Bold',
                    color: '#000000',
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
                    fontFamily: 'Rubik',
                    color: '#333',
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
                      fontFamily: 'Rubik-Medium',
                      color: '#666',
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
                          backgroundColor: '#E8F5E9',
                          color: '#2e7d32',
                          fontFamily: 'Rubik',
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

