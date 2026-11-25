import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import Button from '@mui/material/Button';
import { CandidateShell } from '../../components/AppShell';
import { Callout } from '../../components/Callout';
import { Surface, DetailList } from '../../components/Surface';
import { StageRail } from '../../components/StageRail';
import { StatusBadge } from '../../components/StatusBadge';
import { magicLinkState } from '../../data/fixtures';
import { FIXED_NOW } from '../../data/fixtures';
import { formatDate, useDemo } from '../../data/store';
import { tokens } from '../../theme';

function formatTimestamp(iso: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC',
    timeZoneName: 'short',
  }).format(new Date(iso));
}

export function StatusPortal() {
  const { applications, jobs, magicLinks } = useDemo();
  const [searchParams] = useSearchParams();
  const scenario = searchParams.get('state');
  const requestedId = searchParams.get('application');

  const application =
    applications.find((item) => item.id === requestedId) ??
    applications.find((item) => item.id === 'APP-1042') ??
    applications[0];
  const job = jobs.find((item) => item.id === application.jobId);
  const link = magicLinks.find((item) => item.applicationId === application.id);
  const linkState =
    scenario === 'invalid'
      ? 'invalid'
      : scenario === 'expired'
        ? 'expired'
        : link
          ? magicLinkState(link)
          : 'expired';

  if (linkState !== 'valid') {
    return (
      <CandidateShell breadcrumb="Application status">
        <div style={{ maxWidth: 560 }}>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 600, letterSpacing: '-0.02em' }}>
            {linkState === 'invalid' ? 'This status link is not valid' : 'This status link has expired'}
          </h1>
          <p style={{ margin: '8px 0 18px', fontSize: 15, lineHeight: 1.6, color: tokens.textSecondary }}>
            {linkState === 'invalid'
              ? 'The link may be incomplete or was replaced by a newer one. Request a new link to see your status.'
              : 'Status links stay valid for 72 hours. Request a new link and we will email it to the address on your application.'}
          </p>
          <Callout variant="warning" role="status" title="Your application is not affected">
            The application itself stays in the hiring process. Only this link stopped working.
          </Callout>
          <div style={{ marginTop: 18 }}>
            <Button variant="contained" component={RouterLink} to={`/screens/SCR-16?state=${linkState}`}>
              Request a new link
            </Button>
          </div>
        </div>
      </CandidateShell>
    );
  }

  return (
    <CandidateShell breadcrumb="Application status">
      <div style={{ maxWidth: 720 }}>
        <p style={{ margin: 0, fontSize: 13, color: tokens.textSecondary }}>Application status</p>
        <h1 style={{ margin: '4px 0 6px', fontSize: 28, fontWeight: 600, letterSpacing: '-0.02em' }}>
          {job?.title}
        </h1>
        <p style={{ margin: '0 0 20px', fontSize: 14, color: tokens.textSecondary }}>
          {job?.department} · {job?.location} · Submitted {formatDate(application.appliedOn)}
        </p>

        <div
          style={{
            display: 'grid',
            gap: 20,
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            alignItems: 'start',
          }}
        >
          <Surface>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Official status</h2>
              <StatusBadge status={application.status} />
            </div>
            <p style={{ margin: '0 0 16px', fontSize: 13.5, color: tokens.textSecondary }}>
              Updated {formatDate(application.statusUpdatedOn)}. Only a recruiter can change this status.
            </p>
            <StageRail status={application.status} />
          </Surface>

          <Surface>
            <h2 style={{ margin: '0 0 10px', fontSize: 15, fontWeight: 600 }}>Submitted details</h2>
            <DetailList
              rows={[
                { label: 'Name', value: application.candidateName },
                { label: 'Email', value: application.email },
                { label: 'Phone', value: application.phone },
                { label: 'Answers', value: `${application.answers.length} screening answers` },
                { label: 'CV', value: application.cvFileName ? '1 PDF CV received' : 'No CV attached' },
              ]}
            />
          </Surface>
        </div>

        <div style={{ marginTop: 20 }}>
          <Surface>
            <h2 style={{ margin: '0 0 6px', fontSize: 15, fontWeight: 600 }}>Your answers</h2>
            <p style={{ margin: '0 0 12px', fontSize: 13, color: tokens.textMuted }}>
              Read-only copy of what you submitted.
            </p>
            <dl style={{ margin: 0, display: 'grid', gap: 12 }}>
              {application.answers.map((answer) => (
                <div key={answer.question}>
                  <dt style={{ fontSize: 13.5, fontWeight: 500 }}>{answer.question}</dt>
                  <dd style={{ margin: '2px 0 0', fontSize: 14, lineHeight: 1.6, color: tokens.textSecondary }}>
                    {answer.answer}
                  </dd>
                </div>
              ))}
            </dl>
          </Surface>
        </div>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '6px 12px',
            marginTop: 16,
            fontSize: 12.5,
            color: tokens.textMuted,
          }}
        >
          <span>This link expires {link ? formatTimestamp(link.expiresAt) : '72 hours after it was sent'}.</span>
          <RouterLink to={`/screens/SCR-16?state=expired`}>Link not working?</RouterLink>
        </div>

        <p style={{ marginTop: 16, fontSize: 12.5, color: tokens.textMuted }}>
          Internal notes, scorecards, recommendations and matching results are never shown here.
        </p>
      </div>
    </CandidateShell>
  );
}
