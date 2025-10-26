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
import { Notes } from '@mui/icons-material';

interface NoteItem {
  section: string;
  question: string;
  notes: string;
  response: string;
  sectionId: string;
  questionId: string;
}

interface NotesTableProps {
  notesData: NoteItem[];
  onNavigateToQuestion: (sectionId: string, questionId: string) => void;
}

const NotesTable: React.FC<NotesTableProps> = ({
  notesData,
  onNavigateToQuestion
}) => {
  if (notesData.length === 0) {
    return null;
  }

  const handleNavigateToQuestion = (sectionId: string, questionId: string) => {
    onNavigateToQuestion(sectionId, questionId);
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Notes sx={{ mr: 1, color: '#2196F3' }} />
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            fontFamily: "Rubik-Bold, sans-serif",
            color: "#333333"
          }}
        >
          Your Notes
        </Typography>
      </Box>
      <Typography
        variant="body2"
        sx={{
          mb: 2,
          fontFamily: "Rubik, sans-serif",
          color: "#666"
        }}
      >
        You added custom notes on the following sections:
      </Typography>

      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell sx={{ fontFamily: 'Rubik, sans-serif', fontWeight: 600 }}>Section</TableCell>
              <TableCell sx={{ fontFamily: 'Rubik, sans-serif', fontWeight: 600 }}>Notes</TableCell>
              <TableCell sx={{ fontFamily: 'Rubik, sans-serif', fontWeight: 600 }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {notesData.map((item, index) => (
              <TableRow 
                key={index}
                hover
                sx={{ cursor: 'pointer' }}
                onClick={() => handleNavigateToQuestion(item.sectionId, item.questionId)}
              >
                <TableCell sx={{ fontFamily: 'Rubik, sans-serif' }}>{item.section}</TableCell>
                <TableCell sx={{ fontFamily: 'Rubik, sans-serif' }}>{item.notes}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{
                      fontFamily: 'Rubik, sans-serif',
                      textTransform: 'none',
                      borderColor: '#ccc',
                      color: '#666'
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

export default NotesTable;
