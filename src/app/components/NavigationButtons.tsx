import React from 'react';
import { Box, Button } from '@mui/material';
import { sections } from '@/app/data/sections';
import { colors } from '@/app/theme/colors';

const NavigationButtons = ({ 
  currentSection, 
  onSectionChange, 
  onSubmit,
  onNext
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
          borderColor: colors.primary,
          color: colors.primary,
          minWidth: 110,
          '&:hover': {
            borderColor: colors.primaryDark,
            backgroundColor: colors.primaryLighter
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
            backgroundColor: colors.primary,
            minWidth: 110,
            width: 100,
            '&:hover': {
              backgroundColor: colors.primaryHover
            }
          }}
        >
          Submit
        </Button>
      ) : (
        <Button 
          variant="contained" 
          onClick={onNext}
          sx={{ 
            backgroundColor: colors.primary,
            minWidth: 110,
            width: 100,
            '&:hover': {
              backgroundColor: colors.primaryHover
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