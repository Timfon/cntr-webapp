import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { sections } from '@/app/data/sections';
import { getSectionWarnings } from '@/app/scorecard/scoreCardUtils';

const ScorecardSidebar = ({ 
  currentSection, 
  onSectionChange, 
  answers, 
  flags 
}) => {
  return (
    <Paper sx={{ 
      position: 'fixed',
      left: 24,
      top: 120,
      width: 300,
      height: 'calc(100vh - 250px)',
      backgroundColor: 'white',
      borderRadius: 3,
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      overflow: 'hidden',
      zIndex: 1000
    }}>
      <Box sx={{ mt: 2, overflowY: 'auto', height: 'calc(100% - 60px)' }}>
        {sections.map((section) => (
          <Box
            key={section.id}
            sx={{
              pl: 2.5,
              pr: 2,
              py: 2.5,
              cursor: 'pointer',
              backgroundColor: currentSection === section.id ? '#CEE7BD' : 'transparent',
              borderRadius: '12px',
              margin: '5px 19px',
              position: 'relative',
              overflow: 'hidden',
              '&:hover': {
                backgroundColor: currentSection === section.id ? '#CEE7BD' : 'rgba(0, 0, 0, 0.02)',
              },
              '&:active': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)'
              },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'all 0.15s ease-out'
            }}
            onClick={() => {
              onSectionChange(section.id);
              window.scrollTo({ top: 0, behavior: 'instant' });
            }}
          >
            <Typography 
              variant="body2" 
              sx={{ 
                fontSize: '0.9rem',
                fontWeight: 500,
                fontFamily: 'Rubik-Medium, sans-serif',
                color: currentSection === section.id ? '#1b5e20' : 'inherit'
              }}
            >
              {section.name}
            </Typography>
            {getSectionWarnings(section.id, answers, flags) && (
              <ErrorOutlineIcon sx={{ color: 'black', fontSize: '1.5rem' }} />
            )}
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

export default ScorecardSidebar;