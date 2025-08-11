import React from 'react';
import { Box, Tooltip } from '@mui/material';
import InfoOutlineIcon from '@mui/icons-material/InfoOutline';
import { definitions } from '@/app/data/definitions';

const DefinedTerm = ({ term = '', children = null, definition = '' }) => {
  const finalDefinition = definition || definitions?.[term] || 'Definition not available';

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
      <Tooltip 
        title={
          <Box sx={{ fontFamily: 'Rubik, sans-serif' }}>
            <strong>Definition:</strong> {finalDefinition}
          </Box>
        }
        arrow
        placement="top"
        sx={{
          '& .MuiTooltip-tooltip': {
            backgroundColor: 'white',
            color: '#333',
            fontSize: '0.875rem',
            maxWidth: 400,
            padding: '12px 16px',
            borderRadius: '12px',
            fontFamily: 'Rubik, sans-serif',
            border: '1px solid #e0e0e0',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
            lineHeight: 1.5
          },
          '& .MuiTooltip-arrow': {
            color: 'white',
            '&::before': {
              border: '1px solid #e0e0e0'
            }
          }
        }}
      >
        <InfoOutlineIcon 
          sx={{ 
            fontSize: '1.1rem', 
            color: '#4CAF50', 
            cursor: 'help',
            position: 'relative',
            top: '3px',
            '&:hover': {
              color: '#2e7d32'
            }
          }} 
        />
      </Tooltip>
      {children}
    </span>
  );
};

export default DefinedTerm;