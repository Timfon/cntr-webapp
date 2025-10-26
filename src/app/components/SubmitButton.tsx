import React from 'react';
import {
  Box,
  Button
} from '@mui/material';

interface SubmitButtonProps {
  canSubmit: boolean;
  onSubmit: () => void;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({
  canSubmit,
  onSubmit
}) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
      <Button
        variant="contained"
        onClick={onSubmit}
        disabled={!canSubmit}
        sx={{
          backgroundColor: canSubmit ? '#2e7d32' : '#ccc',
          fontFamily: 'Rubik, sans-serif',
          borderRadius: 2,
          textTransform: 'none',
          minWidth: 200,
          py: 1.5,
          fontSize: '1.1rem',
          '&:hover': {
            backgroundColor: canSubmit ? '#1b5e20' : '#ccc'
          }
        }}
      >
        Submit Responses
      </Button>
    </Box>
  );
};

export default SubmitButton;
