import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
} from '@mui/material';
import { Bill } from '@/types/database';
import { colors } from '@/app/theme/colors';
import { formatBillId, formatDate } from '@/utils/formatters';

interface BillDetailsDialogProps {
  bill: Bill | null;
  open: boolean;
  onClose: () => void;
}

export default function BillDetailsDialog({ bill, open, onClose }: BillDetailsDialogProps) {

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ fontWeight: 'bold', pb: 1, color: colors.text.primary }}>
        {bill ? formatBillId(bill) : 'Bill Details'}
      </DialogTitle>
      <DialogContent>
        {bill && (
          <Box sx={{ pt: 2 }}>
            <DetailField label="Bill ID" value={formatBillId(bill)} />
            <DetailField label="Title" value={bill.title || 'N/A'} />
            <DetailField label="Summary" value={bill.summary || 'No summary available'} multiline />
            <DetailField label="Version Date" value={formatDate(bill.version_date)} />
            <DetailField label="State" value={bill.state || 'N/A'} />
            <DetailField label="Year" value={String(bill.year || 'N/A')} />
            {bill.url && (
              <DetailField
                label="URL"
                value={
                  <a
                    href={bill.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: colors.primary, textDecoration: 'underline' }}
                  >
                    {bill.url}
                  </a>
                }
              />
            )}
            {bill.body && <DetailField label="Body" value={bill.body} />}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{ color: colors.primary }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function DetailField({
  label,
  value,
  multiline = false,
}: {
  label: string;
  value: React.ReactNode;
  multiline?: boolean;
}) {
  return (
    <>
      <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5, color: colors.text.secondary }}>
        {label}
      </Typography>
      <Typography
        variant="body1"
        sx={{
          mb: 2,
          color: colors.text.primary,
          ...(multiline && { whiteSpace: 'pre-wrap' }),
        }}
      >
        {value}
      </Typography>
    </>
  );
}
