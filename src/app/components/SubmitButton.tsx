import React from 'react';
import {
  Box,
  Button
} from '@mui/material';
import { colors } from '@/app/theme/colors';

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
          backgroundColor: canSubmit ? colors.primary : colors.text.disabled,
          minWidth: 200,
          py: 1.5,
          fontSize: '1.1rem',
          '&:hover': {
            backgroundColor: canSubmit ? colors.primaryHover : colors.text.disabled
          }
        }}
      >
        Submit Responses
      </Button>
    </Box>
  );
};

export default SubmitButton;
