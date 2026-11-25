import { NavLink } from 'react-router-dom';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import type { ReactNode } from 'react';
import { tokens } from '../theme';

const navItems = [
  { to: '/screens/SCR-21', label: 'Dashboard', icon: AssessmentOutlinedIcon },
  { to: '/screens/SCR-06', label: 'Job postings', icon: WorkOutlineIcon },
  { to: '/screens/SCR-04', label: 'Applicants', icon: BadgeOutlinedIcon },
];

interface HrShellProps {
  children: ReactNode;
  breadcrumb?: ReactNode;
  headerActions?: ReactNode;
  hiringManagerName?: string;
}

export function HrShell({ children, breadcrumb, headerActions, hiringManagerName }: HrShellProps) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: tokens.canvas }}>
      <aside
        style={{
          width: 236,
          flex: '0 0 236px',
          background: tokens.navy,
          borderRight: `1px solid ${tokens.navySoft}`,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          alignSelf: 'stretch',
        }}
      >
        <div style={{ padding: '22px 20px 18px' }}>
          <div style={{ fontSize: 17, fontWeight: 600, letterSpacing: '-0.01em', color: tokens.onNavy }}>miniTA</div>
          <div style={{ fontSize: 12.5, color: tokens.onNavyMuted, marginTop: 2 }}>Hiring workspace</div>
        </div>

        {!hiringManagerName && <nav aria-label="Main" style={{ padding: '0 12px', flex: 1 }}>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 2 }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className="rail-link"
                    style={({ isActive }) => ({
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      height: 42,
                      padding: '0 10px',
                      borderRadius: 8,
                      textDecoration: 'none',
                      fontSize: 15,
                      fontWeight: isActive ? 600 : 500,
                      color: isActive ? tokens.onNavy : tokens.onNavyMuted,
                      background: isActive ? tokens.navySoft : undefined,
                    })}
                  >
                    <Icon sx={{ fontSize: 20, color: 'inherit' }} />
                    {item.label}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>}

      </aside>

      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <header
          style={{
            height: 60,
            flex: '0 0 60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            padding: '0 32px',
            background: tokens.surface,
            borderBottom: `1px solid ${tokens.border}`,
          }}
        >
          <div style={{ fontSize: 13.5, color: tokens.textSecondary }}>{breadcrumb}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {headerActions}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span style={{ fontSize: 14, fontWeight: 500 }}>{hiringManagerName ?? 'Maya Chen'}</span>
              <span style={{ fontSize: 12.5, color: tokens.textMuted }}>{hiringManagerName ? 'Hiring Manager' : 'Recruiter'}</span>
            </div>
          </div>
        </header>

        <main style={{ flex: 1, padding: '32px 40px 48px' }}>
          <div style={{ maxWidth: 1160 }}>{children}</div>
        </main>
      </div>
    </div>
  );
}

export function CandidateShell({ children, breadcrumb }: { children: ReactNode; breadcrumb?: ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: tokens.canvas, display: 'flex', flexDirection: 'column' }}>
      <header
        className="site-header"
        style={{
          background: tokens.navy,
          borderBottom: `1px solid ${tokens.navySoft}`,
        }}
      >
        <div
          style={{
            maxWidth: 860,
            margin: '0 auto',
            padding: '0 24px',
            height: 60,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
          }}
        >
          <span style={{ fontSize: 17, fontWeight: 600, letterSpacing: '-0.01em', color: tokens.onNavy }}>miniTA</span>
          <span style={{ fontSize: 13.5, color: tokens.onNavyMuted }}>{breadcrumb ?? 'Candidate'}</span>
        </div>
      </header>

      <main style={{ flex: 1, width: '100%', maxWidth: 860, margin: '0 auto', padding: '36px 24px 64px' }}>
        {children}
      </main>

      <footer style={{ padding: '0 24px 28px' }}>
        <div
          style={{
            maxWidth: 860,
            margin: '0 auto',
            fontSize: 12.5,
            color: tokens.textMuted,
            borderTop: `1px solid ${tokens.border}`,
            paddingTop: 14,
          }}
        >
          Your application data is used only for this hiring process and is never published.
        </div>
      </footer>
    </div>
  );
}
