import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import type { ReactNode } from 'react';
import { tokens } from '../theme';

type Variant = 'info' | 'warning' | 'error' | 'success';

const tint = (color: string, percent: number) => `color-mix(in srgb, ${color} ${percent}%, white)`;

const styles: Record<Variant, { bg: string; fg: string; border: string; icon: typeof InfoOutlinedIcon }> = {
  info: {
    bg: tokens.accentSoft,
    fg: tokens.selectedInk,
    border: tint(tokens.accent, 32),
    icon: InfoOutlinedIcon,
  },
  warning: {
    bg: tokens.warnSoft,
    fg: tokens.warn,
    border: tint(tokens.warn, 30),
    icon: WarningAmberOutlinedIcon,
  },
  error: {
    bg: tokens.dangerSoft,
    fg: tokens.danger,
    border: tint(tokens.danger, 28),
    icon: ErrorOutlineOutlinedIcon,
  },
  success: {
    bg: tokens.successSoft,
    fg: tokens.success,
    border: tint(tokens.success, 30),
    icon: CheckCircleOutlineIcon,
  },
};

export function Callout({
  variant = 'info',
  title,
  children,
  action,
  role,
}: {
  variant?: Variant;
  title?: ReactNode;
  children?: ReactNode;
  action?: ReactNode;
  role?: 'alert' | 'status';
}) {
  const style = styles[variant];
  const Icon = style.icon;
  return (
    <div
      role={role}
      style={{
        display: 'flex',
        gap: 12,
        alignItems: 'flex-start',
        padding: '12px 14px',
        borderRadius: 8,
        background: style.bg,
        border: `1px solid ${style.border}`,
        color: style.fg,
      }}
    >
      <Icon sx={{ fontSize: 20, color: 'inherit', mt: '2px', flex: '0 0 auto' }} />
      <div style={{ fontSize: 14, lineHeight: 1.55 }}>
        {title ? <div style={{ fontWeight: 600, marginBottom: children ? 2 : 0 }}>{title}</div> : null}
        {children}
      </div>
      {action ? <div style={{ marginLeft: 'auto' }}>{action}</div> : null}
    </div>
  );
}
