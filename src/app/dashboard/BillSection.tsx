import { Box, Typography, Grid } from '@mui/material';
import { colors } from '@/app/theme/colors';
import BillBox from './BillBox';
import { BillData } from './useDashboardData';

interface BillSectionProps {
  bills: BillData[];
  expandedBills: Set<string>;
  setExpandedBills: React.Dispatch<React.SetStateAction<Set<string>>>;
  onContinue: (billId: string) => void;
  onScoreBill: (billId: string) => void;
  onViewBill: (billId: string) => void;
}

export default function BillSection({
  bills,
  expandedBills,
  setExpandedBills,
  onContinue,
  onScoreBill,
  onViewBill,
}: BillSectionProps) {
  const inProgressBills = bills.filter((b) => b.status === 'inProgress');
  const assignedBills = bills.filter((b) => b.status === 'assigned');
  const scoredBills = bills.filter((b) => b.status === 'scored');

  if (bills.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6" sx={{ color: colors.text.secondary }}>
          No bills found
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: '1200px', mx: 'auto' }}>
      {inProgressBills.length > 0 && (
        <Grid container spacing={3} sx={{ mb: 5 }}>
          {inProgressBills.map((bill) => (
            <BillBox
              key={bill.id}
              bill={bill}
              isInProgress={true} 
              onContinue={onContinue}
              onScoreBill={onScoreBill}
              onViewBill={onViewBill}
              expandedBills={expandedBills}
              setExpandedBills={setExpandedBills}
            />
          ))}
        </Grid>
      )}

      {assignedBills.length > 0 && (
        <Box sx={{ mb: 5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ color: colors.text.primary, fontSize: '1.25rem' }}>
              Assigned
            </Typography>
          </Box>
          <Grid container spacing={3}>
            {assignedBills.map((bill) => (
              <BillBox
                key={bill.id}
                bill={bill}
                isInProgress={false}
                onContinue={onContinue}
                onScoreBill={onScoreBill}
                onViewBill={onViewBill}
                expandedBills={expandedBills}
                setExpandedBills={setExpandedBills}
              />
            ))}
          </Grid>
        </Box>
      )}

      {scoredBills.length > 0 && (
        <Box sx={{ mb: 5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ color: colors.text.primary, fontSize: '1.25rem' }}>
              Scored
            </Typography>
          </Box>
          <Grid container spacing={3}>
            {scoredBills.map((bill) => (
              <BillBox
                key={bill.id}
                bill={bill}
                isInProgress={false}
                onContinue={onContinue}
                onScoreBill={onScoreBill}
                onViewBill={onViewBill}
                expandedBills={expandedBills}
                setExpandedBills={setExpandedBills}
              />
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
}
