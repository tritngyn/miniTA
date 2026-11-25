import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { PageHeader } from '../components/PageHeader';
import { useDemo } from '../data/store';
import { groupLabels, manifest } from '../manifest';
import { tokens } from '../theme';

const groups = ['hr-desktop', 'candidate-desktop', 'candidate-mobile'] as const;

const openIssues = [
  {
    id: 'ISSUE-01',
    label: 'PDF scan handling',
    note: 'PA2 rejects non-selectable PDFs (UC-04 E1) but also routes scanned files to manual review (UC-04 A1). The prototype states the selectable-text rule and keeps both branches OUT of the flow; the scan policy is still OPEN and no PDF is parsed.',
  },
  {
    id: 'ISSUE-02',
    label: 'Email failure recovery',
    note: 'Confirmation and replacement emails are simulated; nothing is sent. A delivery-failure recovery path is still OPEN and is not shown as a decided flow.',
  },
  {
    id: 'ISSUE-03',
    label: 'Hiring Manager rights',
    note: 'SCR-19 includes a Hiring Manager scenario for shortlisted applicants on assigned jobs, with required comments and one recommendation. Access outside that scorecard is tracked separately.',
  },
  {
    id: 'ISSUE-04',
    label: 'Matching basis',
    note: 'Scores are fixture values presented as decision support; no criterion-level basis or confidence label is claimed. The matching method is still OPEN.',
  },
  {
    id: 'OPEN — rating scale',
    label: 'Scorecard criteria and 1–5 scale',
    note: 'Illustrative only; the screen says so. The approved scorecard criteria and rating scale are not decided.',
  },
  {
    id: 'OPEN — Q-A1',
    label: 'Allowed official status transitions',
    note: 'Every status can be chosen and is recorded; no transition graph, reason field or notification is asserted.',
  },
  {
    id: 'DEMO — email and links',
    label: 'Simulated email, fixed clock',
    note: 'No email is sent. Magic links are fixture strings validated against a fixed clock (2025-11-20T09:00Z) and expire after 72 hours.',
  },
];

export function Gallery() {
  const { reset, applications } = useDemo();

  return (
    <div style={{ minHeight: '100vh', background: tokens.canvas }}>
      <header
        className="site-header"
        style={{ background: tokens.navy, borderBottom: `1px solid ${tokens.navySoft}` }}
      >
        <div
          style={{
            maxWidth: 1180,
            margin: '0 auto',
            padding: '0 32px',
            height: 60,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
          }}
        >
          <RouterLink
            to="/"
            style={{ color: tokens.onNavy, fontSize: 17, fontWeight: 600, textDecoration: 'none' }}
            aria-label="miniTA home"
          >
            miniTA
          </RouterLink>
          <span style={{ fontSize: 13.5, color: tokens.onNavyMuted }}>Internal review tool</span>
        </div>
      </header>
      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '32px 32px 64px' }}>
        <PageHeader
          title="Prototype review gallery"
          description="Every manifest screen, its scenarios and the audit notes behind the redesign. This page is for review only and never appears in the 28 standard screenshots."
          meta={
            <span style={{ fontSize: 13, color: tokens.textSecondary }}>
              {manifest.screens.length} screens · {applications.length} fixture applications · fixed clock{' '}
              {manifest.fixedClock.slice(0, 10)}
            </span>
          }
          actions={
            <Button variant="outlined" startIcon={<RestartAltIcon />} onClick={reset}>
              Reset demo data
            </Button>
          }
        />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
            gap: 16,
            marginBottom: 28,
          }}
        >
          {groups.map((group) => {
            const screens = manifest.screens.filter((screen) => screen.groups.includes(group));
            return (
              <Box
                key={group}
                sx={{
                  background: tokens.surface,
                  border: `1px solid ${tokens.border}`,
                  borderRadius: '10px',
                  padding: '14px 16px',
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 600, color: tokens.textSecondary }}>{groupLabels[group]}</div>
                <div className="tabular" style={{ fontSize: 24, fontWeight: 600, marginTop: 4 }}>
                  {screens.length}
                </div>
                <div style={{ fontSize: 12.5, color: tokens.textMuted }}>standard screenshots</div>
              </Box>
            );
          })}
        </div>

        {groups.map((group) => {
          const screens = manifest.screens.filter((screen) => screen.groups.includes(group));
          return (
            <section key={group} style={{ marginBottom: 32 }}>
              <h2 style={{ margin: '0 0 10px', fontSize: 17, fontWeight: 600 }}>{groupLabels[group]}</h2>
              <Box
                sx={{
                  background: tokens.surface,
                  border: `1px solid ${tokens.border}`,
                  borderRadius: '10px',
                  overflow: 'hidden',
                }}
              >
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                  <thead>
                    <tr style={{ background: tokens.surfaceSunken, textAlign: 'left' }}>
                      <th style={{ padding: '10px 14px', fontSize: 12.5, color: tokens.textSecondary, width: 90 }}>ID</th>
                      <th style={{ padding: '10px 14px', fontSize: 12.5, color: tokens.textSecondary }}>Screen</th>
                      <th style={{ padding: '10px 14px', fontSize: 12.5, color: tokens.textSecondary, width: 90 }}>UC</th>
                      <th style={{ padding: '10px 14px', fontSize: 12.5, color: tokens.textSecondary, width: 90 }}>Status</th>
                      <th style={{ padding: '10px 14px', fontSize: 12.5, color: tokens.textSecondary, width: 260 }}>
                        Scenarios
                      </th>
                      <th style={{ padding: '10px 14px', fontSize: 12.5, color: tokens.textSecondary, width: 220 }}>
                        Open
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {screens.map((screen) => (
                      <tr key={`${screen.screenId}-${group}`} style={{ borderTop: `1px solid ${tokens.border}` }}>
                        <td className="tabular" style={{ padding: '10px 14px', fontWeight: 500 }}>
                          {screen.screenId}
                        </td>
                        <td style={{ padding: '10px 14px' }}>{screen.name}</td>
                        <td style={{ padding: '10px 14px', color: tokens.textSecondary, fontSize: 13 }}>
                          {screen.useCases.join(', ')}
                        </td>
                        <td style={{ padding: '10px 14px' }}>
                          <span
                            style={{
                              display: 'inline-flex',
                              padding: '2px 8px',
                              borderRadius: 999,
                              fontSize: 12,
                              fontWeight: 600,
                              background: screen.status === 'ready' ? tokens.successSoft : tokens.neutralSoft,
                              color: screen.status === 'ready' ? tokens.success : tokens.neutralInk,
                            }}
                          >
                            {screen.status === 'ready' ? 'Ready' : 'Planned'}
                          </span>
                        </td>
                        <td style={{ padding: '10px 14px' }}>
                          {screen.status === 'ready' ? (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                              {screen.scenarios.map((scenario) => (
                                <RouterLink
                                  key={scenario}
                                  to={`${screen.route}${scenario === 'default' ? '' : `?state=${scenario}`}`}
                                  style={{ fontSize: 13 }}
                                >
                                  {scenario}
                                </RouterLink>
                              ))}
                            </div>
                          ) : (
                            <span style={{ fontSize: 13, color: tokens.textMuted }}>Built in P2</span>
                          )}
                        </td>
                        <td style={{ padding: '10px 14px', fontSize: 12.5, color: tokens.textSecondary }}>
                          {screen.openIssues.length ? screen.openIssues.join(', ') : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Box>
            </section>
          );
        })}

        <section>
          <h2 style={{ margin: '0 0 10px', fontSize: 17, fontWeight: 600 }}>Open issues and demo assumptions</h2>
          <div style={{ display: 'grid', gap: 10 }}>
            {openIssues.map((issue) => (
              <Box
                key={issue.id}
                sx={{
                  background: tokens.surface,
                  border: `1px solid ${tokens.border}`,
                  borderRadius: '10px',
                  padding: '12px 16px',
                }}
              >
                <div style={{ fontSize: 13.5, fontWeight: 600 }}>
                  {issue.id} · {issue.label}
                </div>
                <p style={{ margin: '2px 0 0', fontSize: 13.5, lineHeight: 1.55, color: tokens.textSecondary }}>
                  {issue.note}
                </p>
              </Box>
            ))}
          </div>
        </section>

        <p style={{ marginTop: 28, fontSize: 12.5, color: tokens.textMuted }}>
          Fixtures are shared across every screen. Use “Reset demo data” after trying actions. Screenshot the
          standard set from the app root with <code>npm run shoot</code>.
        </p>
      </div>
    </div>
  );
}
