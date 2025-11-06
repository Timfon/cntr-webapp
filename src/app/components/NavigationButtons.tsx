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
          color: colors.text.secondary,
          borderColor: colors.border.default,
          minWidth: 110,
          '&:hover': {
            backgroundColor: colors.neutral.gray100
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
            backgroundColor: colors.status.success,
            minWidth: 110,
            width: 100,
            '&:hover': {
              backgroundColor: colors.status.successDark
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
            backgroundColor: colors.status.success,
            minWidth: 110,
            width: 100,
            '&:hover': {
              backgroundColor: colors.status.successDark
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