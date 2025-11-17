import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';
import { colors } from '@/app/theme/colors';

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ConfirmStartDialog({ open, onClose, onConfirm }: ConfirmDialogProps) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Start Scoring Bill</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ color: colors.text.primary }}>
          Are you sure you want to start scoring this bill?
          <br />
          <br />
          <strong>Important:</strong> To score another bill, you must first complete
          this bill.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          sx={{
            backgroundColor: '#0C6431',
            '&:hover': { backgroundColor: '#094d26' },
          }}
        >
          Start Bill
        </Button>
      </DialogActions>
    </Dialog>
  );
}

interface AlertDialogProps {
  open: boolean;
  message: string;
  onClose: () => void;
}

export function AlertDialog({ open, message, onClose }: AlertDialogProps) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Notice</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ color: colors.text.primary }}>
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            backgroundColor: '#0C6431',
            '&:hover': { backgroundColor: '#094d26' },
          }}
        >
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
}
