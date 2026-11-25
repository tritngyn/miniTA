import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import type { ReactNode } from 'react';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: ReactNode;
  confirmLabel: string;
  onConfirm: () => void;
  onClose: () => void;
  destructive?: boolean;
  children?: ReactNode;
}

/** Confirmation step. MUI moves focus into the dialog and returns it on close. */
export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  onConfirm,
  onClose,
  destructive = false,
  children,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="confirm-title" maxWidth="xs" fullWidth>
      <DialogTitle id="confirm-title" sx={{ fontSize: 19, fontWeight: 600 }}>
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ fontSize: 14.5, color: 'text.secondary' }}>{description}</DialogContentText>
        {children}
      </DialogContent>
      <DialogActions sx={{ padding: '12px 20px 18px', gap: 1 }}>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          sx={
            destructive
              ? {
                  backgroundColor: 'error.main',
                  '&:hover': { backgroundColor: '#84211F' },
                }
              : undefined
          }
        >
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
