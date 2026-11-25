import { Link as RouterLink } from 'react-router-dom';
import Button from '@mui/material/Button';
import { HrShell } from './AppShell';
import { PageHeader } from './PageHeader';
import { StatusBadge } from './StatusBadge';
import { formatDate } from '../data/store';
import type { Application, Job } from '../data/types';
import { tokens } from '../theme';

type Active = 'detail' | 'notes' | 'scorecard' | 'status';

export function ApplicantHeader({
  application,
  job,
  active,
  hiringManagerName,
  children,
}: {
  application: Application;
  job?: Job;
  active: Active;
  hiringManagerName?: string;
  children: React.ReactNode;
}) {
  const base = `/screens/SCR-17?application=${application.id}`;
  return (
    <HrShell breadcrumb={<span>{hiringManagerName ? 'Scorecard' : 'Applicants'} / {application.candidateName}</span>} hiringManagerName={hiringManagerName}>
      <PageHeader
        title={application.candidateName}
        description={`${job?.title ?? 'Role'} · ${job?.department ?? ''} · Applied ${formatDate(application.appliedOn)}`}
        meta={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: tokens.textSecondary }}>
            <StatusBadge status={application.status} />
            <span>Status updated {formatDate(application.statusUpdatedOn)}</span>
          </div>
        }
        actions={
          !hiringManagerName && <>
            {active === 'notes' || active === 'scorecard' || active === 'status' ? (
              <Button variant="text" component={RouterLink} to={base} sx={{ color: tokens.textSecondary }}>
                Back to applicant
              </Button>
            ) : null}
            {active !== 'notes' ? (
              <Button
                variant="outlined"
                component={RouterLink}
                to={`/screens/SCR-18?application=${application.id}`}
              >
                Notes
              </Button>
            ) : null}
            {active !== 'scorecard' ? (
              <Button
                variant="outlined"
                component={RouterLink}
                to={`/screens/SCR-19?application=${application.id}`}
              >
                Scorecard
              </Button>
            ) : null}
            {active !== 'status' ? (
              <Button
                variant="contained"
                component={RouterLink}
                to={`/screens/SCR-20?application=${application.id}`}
              >
                Update status
              </Button>
            ) : null}
          </>
        }
      />
      {children}
    </HrShell>
  );
}
