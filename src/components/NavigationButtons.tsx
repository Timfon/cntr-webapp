import React from 'react';
import { Box, Button } from '@mui/material';
import { sections } from '@/app/data/sections';

const NavigationButtons = ({ 
  currentSection, 
  onSectionChange, 
  onSubmit 
}) => {
  const currentIndex = sections.findIndex(s => s.id === currentSection);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
      <Button
        variant="outlined"
        onClick={() => {
          if (currentIndex > 0) {
            const prevSectionId = sections[currentIndex - 1].id;
            onSectionChange(prevSectionId);
            window.scrollTo({ top: 0, behavior: 'instant' });
          }
        }}
        disabled={currentIndex === 0}
        sx={{ 
          color: '#666',
          borderColor: '#ccc',
          textTransform: 'none',
          minWidth: 110,
          fontFamily: 'Rubik, sans-serif',
          borderRadius: 2,
          '&:hover': {
            backgroundColor: '#f5f5f5'
          }
        }}
      >
        Previous
      </Button>
      {currentSection === 'submit' ? (
        <Button
          variant="contained"
          onClick={onSubmit}
          sx={{
            backgroundColor: '#2e7d32',
            fontFamily: 'Rubik, sans-serif',
            borderRadius: 2,
            textTransform: 'none',
            minWidth: 110,
            width: 100,
            '&:hover': {
              backgroundColor: '#1b5e20'
            }
          }}
        >
          Submit
        </Button>
      ) : (
        <Button 
          variant="contained" 
          onClick={() => {
            if (currentIndex < sections.length - 1) {
              const nextSectionId = sections[currentIndex + 1].id;
              onSectionChange(nextSectionId);
              window.scrollTo({ top: 0, behavior: 'instant' });
            }
          }}
          sx={{ 
            backgroundColor: '#2e7d32',
            fontFamily: 'Rubik, sans-serif',
            borderRadius: 2,
            minWidth: 110,
            textTransform: 'none',
            width: 100,
            '&:hover': {
              backgroundColor: '#1b5e20'
            }
          }}
        >
          Next
        </Button>
      )}
    </Box>
  );
};

export default NavigationButtons;