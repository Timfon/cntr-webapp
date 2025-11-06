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
import { colors } from '@/app/theme/colors';

interface UnansweredQuestion {
  section: string;
  question: string;
  sectionId: string;
  questionId: string;
}

interface UnansweredQuestionsTableProps {
  unansweredQuestions: UnansweredQuestion[];
  onNavigateToQuestion: (sectionId: string, questionId: string) => void;
}

const UnansweredQuestionsTable: React.FC<UnansweredQuestionsTableProps> = ({
  unansweredQuestions,
  onNavigateToQuestion
}) => {
  if (unansweredQuestions.length === 0) {
    return null;
  }

  const handleNavigateToQuestion = (sectionId: string, questionId: string) => {
    onNavigateToQuestion(sectionId, questionId);
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Typography
        variant="h5"
        sx={{
          mb: 2,
          color: colors.text.primary,
        }}
      >
        Unanswered Questions
      </Typography>
      <Typography
        variant="body2"
        sx={{
          mb: 2,
          color: colors.text.secondary,
        }}
      >
        These questions still need to be answered:
      </Typography>

      <TableContainer
        component={Paper}
        sx={{ borderRadius: 3, boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: colors.neutral.gray100 }}>
              <TableCell sx={{ fontWeight: 600 }}>
                Section
              </TableCell>
              <TableCell sx={{ fontWeight: 600 }}>
                Question
              </TableCell>
              <TableCell sx={{ fontWeight: 600 }}>
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {unansweredQuestions.map((item, index) => (
              <TableRow
                key={index}
                hover
                sx={{ cursor: "pointer" }}
                onClick={() =>
                  handleNavigateToQuestion(item.sectionId, item.questionId)
                }
              >
                <TableCell>
                  {item.section}
                </TableCell>
                <TableCell>
                  {item.questionId}.{" "} 
                  {item.question}
                </TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{
                      borderColor: colors.border.default,
                      color: colors.text.secondary,
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

export default UnansweredQuestionsTable;
