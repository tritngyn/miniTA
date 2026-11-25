import { Link as RouterLink, useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import { HrShell } from '../components/AppShell';
import { PageHeader } from '../components/PageHeader';
import { manifest, screenById } from '../manifest';
import { tokens } from '../theme';

export function PlaceholderScreen() {
  const { screenId } = useParams();
  const screen = screenId ? screenById.get(screenId) : undefined;

  if (!screen) {
    return (
      <HrShell breadcrumb="Not found">
        <PageHeader title="Screen not found" description={`No screen with ID ${screenId ?? ''} exists in the manifest.`} />
        <RouterLink to="/gallery">Back to the review gallery</RouterLink>
      </HrShell>
    );
  }

  return (
    <HrShell breadcrumb="Prototype">
      <PageHeader
        title={`${screen.screenId} · ${screen.name}`}
        description="This screen is scheduled for the next prototype phase. Its audit note and open issues are recorded in the review gallery."
      />
      <Box
        sx={{
          maxWidth: 760,
          background: tokens.surface,
          border: `1px solid ${tokens.border}`,
          borderRadius: '10px',
          padding: '20px 22px',
        }}
      >
        <dl style={{ margin: 0, display: 'grid', gridTemplateColumns: '120px 1fr', gap: '8px 16px', fontSize: 14 }}>
          <dt style={{ color: tokens.textSecondary }}>Use case</dt>
          <dd style={{ margin: 0 }}>{screen.useCases.join(', ')}</dd>
          <dt style={{ color: tokens.textSecondary }}>Scenarios</dt>
          <dd style={{ margin: 0 }}>{screen.scenarios.join(', ')}</dd>
          <dt style={{ color: tokens.textSecondary }}>Open issues</dt>
          <dd style={{ margin: 0 }}>{screen.openIssues.length ? screen.openIssues.join(', ') : 'None recorded'}</dd>
          <dt style={{ color: tokens.textSecondary }}>Audit</dt>
          <dd style={{ margin: 0 }}>{screen.audit}</dd>
        </dl>
      </Box>
      <p style={{ marginTop: 20, fontSize: 14 }}>
        <RouterLink to="/gallery">Back to the review gallery</RouterLink>
        <span style={{ color: tokens.textMuted }}> · {manifest.screens.length} screens in the manifest</span>
      </p>
    </HrShell>
  );
}
