import { Box } from '@mui/material';
import { Bill } from '@/types/database';
import { colors } from '@/app/theme/colors';

interface BillInfoHeaderProps {
  billDetails: Bill | null;
  selectedBill: string | null;
}

export default function BillInfoHeader({ billDetails, selectedBill }: BillInfoHeaderProps) {
  return (
    <Box
      sx={{
        p: 1.5,
        mb: 2,
        borderRadius: 2,
        position: 'sticky',
        top: 30,
        backgroundColor: colors.background.white,
        fontWeight: 500,
        color: colors.text.primary,
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
        fontSize: '1rem',
        maxWidth: 300,
        whiteSpace: 'normal',
        wordBreak: 'break-word',
      }}
    >
      {billDetails ? (
        <>
          <Box sx={{ fontWeight: 600, mb: 0.5, fontSize: '0.85rem', color: colors.status.success }}>
            {billDetails.state} {billDetails.bill_number}
          </Box>
          <Box sx={{ fontSize: '0.9rem', color: colors.text.secondary }}>
            {selectedBill || 'No bill selected'}
          </Box>
        </>
      ) : (
        selectedBill || 'No bill selected'
      )}
    </Box>
  );
}
