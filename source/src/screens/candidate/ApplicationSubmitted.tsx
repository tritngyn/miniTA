import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import Button from '@mui/material/Button';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { CandidateShell } from '../../components/AppShell';
import { Callout } from '../../components/Callout';
import { Surface, DetailList } from '../../components/Surface';
import { formatDate, useDemo } from '../../data/store';
import { tokens } from '../../theme';

export function ApplicationSubmitted() {
  const { applications, jobs } = useDemo();
  const [searchParams] = useSearchParams();
  const requestedId = searchParams.get('application');

  const application =
    applications.find((item) => item.id === requestedId) ??
    applications.find((item) => item.jobId === 'JOB-FE' && item.candidateName === 'Minh Tran') ??
    applications[0];
  const job = jobs.find((item) => item.id === application.jobId);

  const scenario = searchParams.get('state');

  return (
    <CandidateShell breadcrumb="Application received">
      <div style={{ maxWidth: 640 }}>
        <CheckCircleOutlineIcon sx={{ fontSize: 34, color: tokens.success }} />
        <h1 style={{ margin: '10px 0 6px', fontSize: 28, fontWeight: 600, letterSpacing: '-0.02em' }}>
          Application received
        </h1>
        <p style={{ margin: '0 0 20px', fontSize: 15.5, lineHeight: 1.6, color: tokens.textSecondary }}>
          Thanks, {application.candidateName}. We sent a status link to{' '}
          <strong style={{ color: tokens.ink }}>{application.email}</strong>. It stays valid for 72 hours.
        </p>

        {scenario === 'email-failed' ? (
          <div style={{ marginBottom: 18 }}>
            <Callout variant="warning" role="status" title="Confirmation email not sent in this run">
              The application was stored, but email delivery failed in this simulation. The recovery path for
              a failed email is not decided in the prototype.
            </Callout>
          </div>
        ) : null}

        <Surface>
          <DetailList
            rows={[
              { label: 'Role', value: job ? `${job.title} · ${job.department}` : 'Role' },
              { label: 'Reference', value: <span className="tabular">{application.id}</span> },
              { label: 'Submitted', value: formatDate(application.appliedOn) },
              { label: 'Current status', value: 'Applied' },
            ]}
          />

          <div style={{ marginTop: 16, paddingTop: 14, borderTop: `1px solid ${tokens.border}` }}>
            <h2 style={{ margin: '0 0 8px', fontSize: 15, fontWeight: 600 }}>What happens next</h2>
            <ol style={{ margin: 0, paddingLeft: 18, fontSize: 14, lineHeight: 1.7, color: tokens.textSecondary }}>
              <li>A recruiter reviews your CV and screening answers.</li>
              <li>Your official status changes only when a recruiter updates it.</li>
              <li>Open the link in your email to see your current status at any time.</li>
            </ol>
          </div>
        </Surface>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 20 }}>
          <Button variant="outlined" component={RouterLink} to="/screens/SCR-22">
            Read the job description
          </Button>
        </div>

        <p style={{ marginTop: 16, fontSize: 12.5, color: tokens.textMuted }}>
          Only your submitted details and official status are shown through the link. Internal notes,
          scorecards and matching results are never shared with candidates.
        </p>
      </div>
    </CandidateShell>
  );
}
