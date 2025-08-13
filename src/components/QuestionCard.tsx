import React from 'react';
import { 
  Box, Button, Paper, Typography, MenuItem, Select, Checkbox, FormControlLabel 
} from '@mui/material';
import { Flag, FlagOutlined } from '@mui/icons-material';

const QuestionCard = ({ 
  question, 
  answer, 
  flagged, 
  onAnswer, 
  onFlag 
}) => {
  const renderAnswerUI = () => {
    if (question.type === 'yesno') {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, gap: 2 }}>
          <Button
            variant={answer === 'yes' ? 'contained' : 'outlined'}
            onClick={() => onAnswer(question.id, 'yes')}
            sx={{
              backgroundColor: answer === 'yes' ? '#138B43' : 'transparent',
              color: answer === 'yes' ? 'white' : '#666',
              borderColor: '#ccc',
              borderRadius: 2,
              minWidth: 110,
              textTransform: 'none',
              fontFamily: 'Rubik, sans-serif',
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
              borderRadius: 2,
              minWidth: 110,
              textTransform: 'none',
              fontFamily: 'Rubik, sans-serif',
              fontSize: '1.0rem',
              '&:hover': {
                backgroundColor: answer === 'no' ? '#0f7a3a' : '#f5f5f5'
              }
            }}
          >
            No
          </Button>
        </Box>
      );
    }

    if (question.type === 'dropdown') {
  return (
    <Select
      value={answer || ''}
      onChange={(e) => onAnswer(question.id, e.target.value)}
      displayEmpty
      sx={{
        mt: 2,
        minWidth: 300, // wider select box
        maxWidth: '100%', // don't overflow container
        fontFamily: 'Rubik, sans-serif',
        whiteSpace: 'normal',
        wordBreak: 'break-word',
      }}
      MenuProps={{
        PaperProps: {
          sx: {
            maxWidth: 500, // cap dropdown width
            whiteSpace: 'normal',
            wordBreak: 'break-word',
          }
        }
      }}
    >
      <MenuItem value="" sx={{ fontFamily: 'Rubik, sans-serif', whiteSpace: 'normal', wordBreak: 'break-word' }}>
        Select an option
      </MenuItem>
      {question.options.map((opt, i) => (
        <MenuItem
          key={i}
          value={opt}
          sx={{
            fontFamily: 'Rubik, sans-serif',
            whiteSpace: 'normal',
            wordBreak: 'break-word'
          }}
        >
          {opt}
        </MenuItem>
      ))}
    </Select>
  );
}

    if (question.type === 'multiselect') {
      return (
        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
          {question.options.map((opt, i) => (
            <FormControlLabel
  key={i}
  control={
    <Checkbox
      sx={{ color: '#138B43', '&.Mui-checked': { color: '#138B43' } }}
      checked={answer?.includes(opt) || false}
      onChange={(e) => {
        let newAnswer = Array.isArray(answer) ? [...answer] : [];
        if (e.target.checked) {
          newAnswer.push(opt);
        } else {
          newAnswer = newAnswer.filter(item => item !== opt);
        }
        onAnswer(question.id, newAnswer);
      }}
    />
  }
  
  label={
    <Typography sx={{ fontFamily: 'Rubik, sans-serif', mt: 1}}>
      {opt}
    </Typography>
  }
  sx={{
    alignItems: 'flex-start',
  }}
/>
          ))}
        </Box>
      );
    }
  };

  return (
    <Paper key={question.id} sx={{ mb: 3, p: 3, borderRadius: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
        <Typography
          variant="body1"
          sx={{
            flex: 1,
            mr: 2,
            fontFamily: 'Rubik, sans-serif'
          }}
        >
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
      {renderAnswerUI()}
    </Paper>
  );
};

export default QuestionCard;