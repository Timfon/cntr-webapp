import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Chip
} from '@mui/material';

interface ScoringSummaryProps {
  completedSections: number;
  totalSections: number;
  answeredQuestions: number;
  totalQuestions: number;
  flaggedQuestions: number;
  sectionsWithNotes: number;
}

const ScoringSummary: React.FC<ScoringSummaryProps> = ({
  completedSections,
  totalSections,
  answeredQuestions,
  totalQuestions,
  flaggedQuestions,
  sectionsWithNotes
}) => {
  return (
    <Box>
      <Typography
        variant="h5"
        sx={{
          fontWeight: "bold",
          mb: 2,
          fontFamily: "Rubik-Bold, sans-serif",
          color: "#333333"
        }}
      >
        Scoring Summary
      </Typography>

      <Paper
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 3,
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)"
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography sx={{ fontFamily: 'Rubik, sans-serif', fontWeight: 500 }}>
              Total Sections Completed:
            </Typography>
            <Chip 
              label={`${completedSections} of ${totalSections}`} 
              color={completedSections === totalSections ? "success" : "default" as any}
              sx={{ fontFamily: 'Rubik, sans-serif' }}
            />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography sx={{ fontFamily: 'Rubik, sans-serif', fontWeight: 500 }}>
              Questions Answered:
            </Typography>
            <Chip 
              label={`${answeredQuestions} of ${totalQuestions}`} 
              color={answeredQuestions === totalQuestions ? "success" : "default" as any}
              sx={{ fontFamily: 'Rubik, sans-serif' }}
            />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography sx={{ fontFamily: 'Rubik, sans-serif', fontWeight: 500 }}>
              Questions Flagged:
            </Typography>
            <Chip 
              label={flaggedQuestions} 
              color={flaggedQuestions === 0 ? "success" : "warning"}
              sx={{ fontFamily: 'Rubik, sans-serif' }}
            />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography sx={{ fontFamily: 'Rubik, sans-serif', fontWeight: 500 }}>
              Notes Added:
            </Typography>
            <Chip 
              label={sectionsWithNotes} 
              color="info"
              sx={{ fontFamily: 'Rubik, sans-serif' }}
            />
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default ScoringSummary;
