
import React from 'react';
import { Paper, TextField, Typography } from '@mui/material';

const NotesSection = ({ notes, currentSection, onNotesChange }) => {
  return (
    <Paper sx={{ p: 3, mt: 4, borderRadius: 3 }}>
      <Typography variant="h6" sx={{ 
        fontWeight: 'bold', 
        mb: 2,
        fontFamily: 'Rubik, sans-serif'
      }}>
        Notes
      </Typography>
      <TextField
        multiline
        rows={6}
        fullWidth
        placeholder="Add your notes here..."
        value={notes[currentSection] || ''}
        onChange={(e) => onNotesChange(currentSection, e.target.value)}
        sx={{
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'white',
            fontFamily: 'Rubik, sans-serif',
            borderRadius: 2
          },
          '& .MuiInputBase-input': {
            fontFamily: 'Rubik, sans-serif'
          }
        }}
      />
    </Paper>
  );
};

export default NotesSection;