import Box from '@mui/material/Box';
import type { ReactNode } from 'react';
import { tokens } from '../theme';

interface SurfaceProps {
  children: ReactNode;
  padding?: string;
  sx?: Record<string, unknown>;
}

/** White work surface with the standard hairline. */
export function Surface({ children, padding = '20px', sx }: SurfaceProps) {
  return (
    <Box
      sx={{
        background: tokens.surface,
        border: `1px solid ${tokens.border}`,
        borderRadius: '10px',
        padding,
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}

/** Two-column label/value rows used by detail screens. */
export function DetailList({ rows }: { rows: { label: string; value: ReactNode }[] }) {
  return (
    <dl style={{ margin: 0, display: 'grid', gap: '10px' }}>
      {rows.map((row) => (
        <div
          key={row.label}
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(120px, 160px) 1fr',
            gap: 12,
            alignItems: 'baseline',
          }}
        >
          <dt style={{ fontSize: 13.5, color: tokens.textSecondary }}>{row.label}</dt>
          <dd style={{ margin: 0, fontSize: 14.5, color: tokens.ink }}>{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}
