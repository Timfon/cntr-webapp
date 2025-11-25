import React from 'react';
import { Box, Tooltip } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { definitions } from '@/app/data/definitions';
import { colors } from '@/app/theme/colors';

const DefinedTerm = ({ term = '', children = null, definition = '' }) => {
  const finalDefinition = definition || definitions?.[term] || 'Definition not available';
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
      <Tooltip
        title={
          <Box sx={{ fontSize: '1rem', lineHeight: 1.6 }}>
            <strong>Definition:</strong> {finalDefinition}
          </Box>
        }

        arrow
        placement="top"
        slotProps={{
          tooltip: {
            sx: {
              backgroundColor: colors.background.white,
              color: colors.text.primary,
              fontSize: '1rem', 
              maxWidth: 500,
              padding: '16px 20px',
              borderRadius: '12px',
              border: `1px solid ${colors.border.light}`,
              boxShadow: '0 6px 24px rgba(0, 0, 0, 0.15)',
              lineHeight: 1.6
            }
          },
          arrow: {
            sx: {
              color: colors.background.white,
              '&::before': {
                border: `1px solid ${colors.border.light}`
              }
            }
          }
        }}
      >
        <InfoOutlinedIcon
          sx={{
            fontSize: '1.3rem',
            color: colors.status.success,
            cursor: 'help',
            position: 'relative',
            top: '3px',
            '&:hover': {
              color: colors.status.successDark
            }
          }}
        />
      </Tooltip>
      {children}
    </span>
  );
};
export default DefinedTerm;