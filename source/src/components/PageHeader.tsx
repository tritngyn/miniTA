import type { ReactNode } from 'react';
import { tokens } from '../theme';

interface PageHeaderProps {
  title: string;
  description?: ReactNode;
  meta?: ReactNode;
  actions?: ReactNode;
}

export function PageHeader({ title, description, meta, actions }: PageHeaderProps) {
  return (
    <header style={{ marginBottom: 24 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 24,
          flexWrap: 'wrap',
        }}
      >
        <div style={{ minWidth: 280 }}>
          <h1
            style={{
              margin: 0,
              fontSize: 'clamp(24px, 3.4vw, 28px)',
              lineHeight: 1.2,
              fontWeight: 600,
              letterSpacing: '-0.02em',
            }}>
            {title}
          </h1>
          {description ? (
            <p
              style={{
                margin: '8px 0 0',
                fontSize: 15,
                lineHeight: 1.55,
                color: tokens.textSecondary,
                maxWidth: 720,
              }}
            >
              {description}
            </p>
          ) : null}
          {meta ? <div style={{ marginTop: 12 }}>{meta}</div> : null}
        </div>
        {actions ? <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>{actions}</div> : null}
      </div>
    </header>
  );
}

export function Section({
  title,
  description,
  children,
  actions,
  id,
}: {
  title: string;
  description?: ReactNode;
  children: ReactNode;
  actions?: ReactNode;
  id?: string;
}) {
  return (
    <section aria-labelledby={id ? `${id}-heading` : undefined} style={{ marginTop: 32 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          gap: 16,
          marginBottom: 14,
        }}
      >
        <div>
          <h2
            id={id ? `${id}-heading` : undefined}
            style={{ margin: 0, fontSize: 17, lineHeight: 1.4, fontWeight: 600, letterSpacing: '-0.01em' }}
          >
            {title}
          </h2>
          {description ? (
            <p style={{ margin: '4px 0 0', fontSize: 14, color: tokens.textSecondary }}>{description}</p>
          ) : null}
        </div>
        {actions}
      </div>
      {children}
    </section>
  );
}
