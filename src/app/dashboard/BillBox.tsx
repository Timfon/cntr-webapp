import React from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
} from '@mui/material';
import { colors } from '@/app/theme/colors';
import { BillData } from './useDashboardData';

interface BillBoxProps {
  bill: BillData;
  isInProgress: boolean;
  onContinue: (billId: string) => void;
  onScoreBill: (billId: string) => void;
  onViewBill: (billId: string) => void;
  expandedBills: Set<string>;
  setExpandedBills: React.Dispatch<React.SetStateAction<Set<string>>>;
}

export default function BillBox({
  bill,
  isInProgress,
  onContinue,
  onScoreBill,
  onViewBill,
  expandedBills,
  setExpandedBills,
}: BillBoxProps) {
  const isExpanded = expandedBills.has(bill.id);
  const isLong = bill.description.length > 180;

  return (
    <Grid size={{ xs: 12, sm: 6, md: isInProgress ? 12 : 4 }}>
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'white',
          boxShadow: '0px 2px 8px rgba(0,0,0,0.1)',
          position: 'relative',
          transition: 'transform 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0px 4px 12px rgba(0,0,0,0.15)',
          },
        }}
      >
        <Box sx={{ position: 'absolute', top: 12, right: 12 }}>
          <Chip
            label={bill.status === 'inProgress' ? 'In Progress' : bill.status}
            size="small"
            sx={{
              backgroundColor: 'transparent',
              color: colors.text.secondary,
              border: `1px solid ${colors.border.light}`,
              textTransform: 'capitalize',
              fontWeight: 'bold',
              fontSize: '0.7rem',
              height: '24px',
              '& .MuiChip-label': {
                padding: '0 8px',
              },
            }}
          />
        </Box>
        <CardContent sx={{ flexGrow: 1, pt: 3, pb: 2 }}>
          <Typography
            variant="h6"
            sx={{
              color: colors.text.primary,
              mb: 1.5,
              pr: 8,
              fontSize: '1.1rem',
              lineHeight: 1.3,
            }}
          >
            {bill.name}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: colors.text.secondary,
              mb: 1.5,
              fontSize: '0.875rem',
            }}
          >
            {bill.date}
          </Typography>
          <Box>
            <Typography
              variant="body2"
              sx={{
                color: colors.text.tertiary,
                mb: isLong ? 0.5 : 1,
                fontSize: '0.875rem',
                lineHeight: 1.5,
                ...(isExpanded ? {} : {
                  display: '-webkit-box',
                  WebkitLineClamp: 4,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }),
              }}
            >
              {bill.description}
            </Typography>
            {isLong && (
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  setExpandedBills(prev => {
                    const next = new Set(prev);
                    if (isExpanded) {
                      next.delete(bill.id);
                    } else {
                      next.add(bill.id);
                    }
                    return next;
                  });
                }}
                sx={{
                  color: colors.primary,
                  fontSize: '0.875rem',
                  minWidth: 'auto',
                  padding: 0,
                  marginTop: '4px',
                  fontWeight: 'bold',
                  display: 'block',
                  '&:hover': {
                    backgroundColor: 'transparent',
                    textDecoration: 'underline',
                  },
                }}
              >
                {isExpanded ? 'See less' : 'See more'}
              </Button>
            )}
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 'auto' }}>
            <Button
              variant={bill.status === 'inProgress' ? 'contained' : 'outlined'}
              onClick={() => {
                if (bill.status === 'inProgress') {
                  onContinue(bill.id);
                } else if (bill.status === 'assigned') {
                  onScoreBill(bill.id);
                } else {
                  onViewBill(bill.id);
                }
              }}
              sx={{
                backgroundColor: bill.status === 'inProgress' ? colors.status.success : colors.background.white,
                color: bill.status === 'inProgress' ? colors.text.white : colors.text.secondary,
                borderColor: bill.status === 'inProgress' ? 'transparent' : colors.border.light,
                fontWeight: 'bold',
                py: 1,
                px: 2.5,
                textTransform: 'uppercase',
                fontSize: '0.75rem',
                minWidth: 'auto',
                '&:hover': {
                  backgroundColor: bill.status === 'inProgress' ? colors.status.successDark : colors.neutral.gray100,
                  borderColor: bill.status === 'inProgress' ? 'transparent' : colors.border.default,
                },
              }}
            >
              {bill.status === 'inProgress'
                ? 'Continue'
                : bill.status === 'assigned'
                ? 'Score Bill'
                : 'View Bill'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Grid>
  );
}

