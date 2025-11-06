import React from 'react';
import { 
  Box, Button, Paper, Typography, MenuItem, Select, Checkbox, FormControlLabel 
} from '@mui/material';
import { Flag, FlagOutlined } from '@mui/icons-material';
import { colors } from '@/app/theme/colors';

const QuestionCard = ({ 
  id,
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
              backgroundColor: answer === 'yes' ? colors.primary : 'transparent',
              color: answer === 'yes' ? colors.text.white : colors.text.secondary,
              borderColor: colors.border.default,
              minWidth: 110,
              fontSize: '1.0rem',
              '&:hover': {
                backgroundColor: answer === 'yes' ? colors.primaryHover : colors.neutral.gray100
              }
            }}
          >
            Yes
          </Button>
          <Button
            variant={answer === 'no' ? 'contained' : 'outlined'}
            onClick={() => onAnswer(question.id, 'no')}
            sx={{
              backgroundColor: answer === 'no' ? colors.primary : 'transparent',
              color: answer === 'no' ? colors.text.white : colors.text.secondary,
              borderColor: colors.border.default,
              minWidth: 110,
              fontSize: '1.0rem',
              '&:hover': {
                backgroundColor: answer === 'no' ? colors.primaryHover : colors.neutral.gray100
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
          <MenuItem value="" sx={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>
            Select an option
          </MenuItem>
          {question.options.map((opt, i) => (
            <MenuItem
              key={i}
              value={opt}
              sx={{
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
                  sx={{ color: colors.primary, '&.Mui-checked': { color: colors.primary } }}
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
                <Typography sx={{ mt: 1}}>
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

    return null;
  };
  
  return (
    <Paper id={id} key={question.id} sx={{ mb: 3, p: 3, borderRadius: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
        <Typography
          variant="body1"
          sx={{
            flex: 1,
            mr: 2,
          }}
        >
          <strong>{question.id}.</strong> {question.text}
        </Typography>
        <Button
          onClick={() => onFlag(question.id)}
          sx={{
            minWidth: 'auto',
            p: 0.5,
            color: flagged ? colors.status.error : colors.text.secondary,
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