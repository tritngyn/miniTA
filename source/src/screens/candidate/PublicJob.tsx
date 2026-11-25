import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import Button from '@mui/material/Button';
import { CandidateShell } from '../../components/AppShell';
import { Callout } from '../../components/Callout';
import { useDemo } from '../../data/store';
import { formatDate } from '../../data/store';
import { tokens } from '../../theme';

export function PublicJob() {
  const { jobs } = useDemo();
  const [searchParams] = useSearchParams();
  const scenario = searchParams.get('state');

  const job =
    jobs.find((item) => item.id === (scenario === 'closed' ? 'JOB-PMM' : 'JOB-FE')) ??
    jobs.find((item) => item.status === 'Published') ??
    jobs[0];
  const closed = job.status !== 'Published';

  return (
    <CandidateShell breadcrumb="Job description">
      <div style={{ maxWidth: 720 }}>
        <h1 style={{ margin: 0, fontSize: 30, fontWeight: 600, letterSpacing: '-0.02em' }}>{job.title}</h1>
        <p style={{ margin: '8px 0 4px', fontSize: 14.5, color: tokens.textSecondary }}>
          {job.department} · {job.employmentType} · {job.location}
        </p>
        <p style={{ margin: '0 0 20px', fontSize: 13, color: tokens.textMuted }}>
          Posted {formatDate(job.updatedAt)}
        </p>

        {closed ? (
          <div style={{ marginBottom: 20 }}>
            <Callout variant="warning" role="status" title="This job is closed">
              Applications are no longer accepted for this role. The description stays online for reference.
            </Callout>
          </div>
        ) : null}

        <section aria-labelledby="about-role" style={{ marginBottom: 24 }}>
          <h2 id="about-role" style={{ margin: '0 0 8px', fontSize: 17, fontWeight: 600 }}>
            About the role
          </h2>
          <p style={{ margin: 0, fontSize: 15, lineHeight: 1.7, color: tokens.textSecondary }}>{job.description}</p>
        </section>

        {job.responsibilities.length ? (
          <section aria-labelledby="responsibilities" style={{ marginBottom: 24 }}>
            <h2 id="responsibilities" style={{ margin: '0 0 8px', fontSize: 17, fontWeight: 600 }}>
              Responsibilities
            </h2>
            <ul style={{ margin: 0, paddingLeft: 20, fontSize: 15, lineHeight: 1.75, color: tokens.textSecondary }}>
              {job.responsibilities.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        ) : null}

        {job.requirements.length ? (
          <section aria-labelledby="requirements" style={{ marginBottom: 24 }}>
            <h2 id="requirements" style={{ margin: '0 0 8px', fontSize: 17, fontWeight: 600 }}>
              Requirements
            </h2>
            <ul style={{ margin: 0, paddingLeft: 20, fontSize: 15, lineHeight: 1.75, color: tokens.textSecondary }}>
              {job.requirements.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        ) : null}

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            paddingTop: 18,
            borderTop: `1px solid ${tokens.border}`,
          }}
        >
          {closed ? (
            <Button variant="contained" disabled>
              Apply
            </Button>
          ) : (
            <Button variant="contained" component={RouterLink} to="/screens/SCR-12">
              Apply for this job
            </Button>
          )}
          <span style={{ fontSize: 13, color: tokens.textSecondary }}>
            {closed
              ? 'Closed for applications'
              : 'About 6 minutes · one PDF CV, up to 5 MB · status updates by email'}
          </span>
        </div>
      </div>
    </CandidateShell>
  );
}
