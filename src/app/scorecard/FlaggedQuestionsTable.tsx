import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button
} from '@mui/material';
import { Flag } from '@mui/icons-material';
import { colors } from '@/app/theme/colors';

interface FlaggedQuestion {
  section: string;
  question: string;
  response: string;
  sectionId: string;
  questionId: string;
}

interface FlaggedQuestionsTableProps {
  flaggedQuestions: FlaggedQuestion[];
  onNavigateToQuestion: (sectionId: string, questionId: string) => void;
}

const FlaggedQuestionsTable: React.FC<FlaggedQuestionsTableProps> = ({
  flaggedQuestions,
  onNavigateToQuestion
}) => {
  if (flaggedQuestions.length === 0) {
    return null;
  }

  const handleNavigateToQuestion = (sectionId: string, questionId: string) => {
    onNavigateToQuestion(sectionId, questionId);
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Flag sx={{ mr: 1, color: colors.status.error }} />
        <Typography
          variant="h5"
          sx={{
            color: colors.text.primary
          }}
        >
          Flagged Questions
        </Typography>
      </Box>
      <Typography
        variant="body2"
        sx={{
          mb: 2,
          color: colors.text.secondary
        }}
      >
        These were marked by you for further review:
      </Typography>

      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: colors.neutral.gray100 }}>
              <TableCell sx={{ fontWeight: 600 }}>Section</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Question</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Response</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {flaggedQuestions.map((item, index) => (
              <TableRow 
                key={index}
                hover
                sx={{ cursor: 'pointer' }}
                onClick={() => handleNavigateToQuestion(item.sectionId, item.questionId)}
              >
                <TableCell>{item.section}</TableCell>
                <TableCell>{item.question}</TableCell>
                <TableCell>{item.response?.toUpperCase()}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{
                      borderColor: colors.border.default,
                      color: colors.text.secondary
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNavigateToQuestion(item.sectionId, item.questionId);
                    }}
                  >
                    Navigate to Section
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default FlaggedQuestionsTable;
