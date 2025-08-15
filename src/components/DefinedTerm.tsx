import React from 'react';
import { Box, Tooltip } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { definitions } from '@/app/data/definitions';

const DefinedTerm = ({ term = '', children = null, definition = '' }) => {
  const finalDefinition = definition || definitions?.[term] || 'Definition not available';
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
      <Tooltip
        title={
          <Box sx={{ fontFamily: 'Rubik, sans-serif', fontSize: '1rem', lineHeight: 1.6 }}>
            <strong>Definition:</strong> {finalDefinition}
          </Box>
        }

        arrow
        placement="top"
        slotProps={{
          tooltip: {
            sx: {
              backgroundColor: 'white',
              color: '#333',
              fontSize: '1rem', 
              maxWidth: 500,
              padding: '16px 20px',
              borderRadius: '12px',
              fontFamily: 'Rubik, sans-serif',
              border: '1px solid #e0e0e0',
              boxShadow: '0 6px 24px rgba(0, 0, 0, 0.15)',
              lineHeight: 1.6
            }
          },
          arrow: {
            sx: {
              color: 'white',
              '&::before': {
                border: '1px solid #e0e0e0'
              }
            }
          }
        }}
      >
        <InfoOutlinedIcon
          sx={{
            fontSize: '1.3rem',
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