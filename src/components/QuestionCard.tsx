import React from 'react';
import { Box, Button, Paper, Typography } from '@mui/material';
import { Flag, FlagOutlined } from '@mui/icons-material';

const QuestionCard = ({ 
  question, 
  answer, 
  flagged, 
  onAnswer, 
  onFlag 
}) => {
  return (
    <Paper key={question.id} sx={{ mb: 3, p: 3, borderRadius: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
        <Typography variant="body1" sx={{ 
          flex: 1, 
          mr: 2,
          fontFamily: 'Rubik, sans-serif'
        }}>
          <strong>{question.id}.</strong> {question.text}
        </Typography>
        <Button
          onClick={() => onFlag(question.id)}
          sx={{ 
            minWidth: 'auto', 
            p: 0.5,
            color: flagged ? '#d32f2f' : '#666',
            borderRadius: 2
          }}
        >
          {flagged ? <Flag /> : <FlagOutlined />}
        </Button>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, gap: 2 }}>
        <Button
          variant={answer === 'yes' ? 'contained' : 'outlined'}
          onClick={() => onAnswer(question.id, 'yes')}
          sx={{
            backgroundColor: answer === 'yes' ? '#138B43' : 'transparent',
            color: answer === 'yes' ? 'white' : '#666',
            borderColor: '#ccc',
            fontFamily: 'Rubik, sans-serif',
            borderRadius: 2,
            minWidth: 110,
            textTransform: 'none',
            fontSize: '1.0rem',
            '&:hover': {
              backgroundColor: answer === 'yes' ? '#0f7a3a' : '#f5f5f5'
            }
          }}
        >
          Yes
        </Button>
        <Button
          variant={answer === 'no' ? 'contained' : 'outlined'}
          onClick={() => onAnswer(question.id, 'no')}
          sx={{
            backgroundColor: answer === 'no' ? '#138B43' : 'transparent',
            color: answer === 'no' ? 'white' : '#666',
            borderColor: '#ccc',
            minWidth: 110,
            textTransform: 'none',
            fontFamily: 'Rubik, sans-serif',
            borderRadius: 2,
            fontSize: '1.0rem',
            '&:hover': {
              backgroundColor: answer === 'no' ? '#0f7a3a' : '#f5f5f5'
            }
          }}
        >
          No
        </Button>
      </Box>
    </Paper>
  );
};

export default QuestionCard;