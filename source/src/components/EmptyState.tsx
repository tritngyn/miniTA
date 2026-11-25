import type { SvgIconComponent } from '@mui/icons-material';
import type { ReactNode } from 'react';
import { tokens } from '../theme';

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  compact = false,
}: {
  icon: SvgIconComponent;
  title: string;
  description: ReactNode;
  action?: ReactNode;
  compact?: boolean;
}) {
  return (
    <div
      style={{
        background: tokens.surface,
        border: `1px solid ${tokens.border}`,
        borderRadius: 10,
        padding: compact ? '28px 24px' : '48px 32px',
        textAlign: 'center',
      }}
    >
      <Icon sx={{ fontSize: compact ? 26 : 32, color: tokens.textMuted }} />
      <h2 style={{ margin: '10px 0 6px', fontSize: 18, fontWeight: 600 }}>{title}</h2>
      <p style={{ margin: '0 auto 18px', maxWidth: 440, fontSize: 14.5, color: tokens.textSecondary }}>
        {description}
      </p>
      {action}
    </div>
  );
}
