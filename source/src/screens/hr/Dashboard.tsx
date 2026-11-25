import { useMemo, useState } from 'react';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import { HrShell } from '../../components/AppShell';
import { PageHeader, Section } from '../../components/PageHeader';
import { Field } from '../../components/FormField';
import { Surface } from '../../components/Surface';
import { Callout } from '../../components/Callout';
import { EmptyState } from '../../components/EmptyState';
import { useDemo } from '../../data/store';
import { statusStyle, tokens } from '../../theme';
import type { ApplicationStatus } from '../../data/types';

const STATUSES: ApplicationStatus[] = ['Applied', 'Under Review', 'Shortlisted', 'Hired', 'Rejected'];

const BUCKETS = [
  { label: '0–49%', min: 0, max: 49 },
  { label: '50–69%', min: 50, max: 69 },
  { label: '70–84%', min: 70, max: 84 },
  { label: '85–100%', min: 85, max: 100 },
];

export function Dashboard() {
  const { jobs, applications } = useDemo();
  const [searchParams] = useSearchParams();
  const scenario = searchParams.get('state');

  const [jobFilter, setJobFilter] = useState(scenario === 'empty' ? 'JOB-PMM' : 'all');
  const [failed, setFailed] = useState(scenario === 'error');

  const scoped = useMemo(
    () => applications.filter((application) => jobFilter === 'all' || application.jobId === jobFilter),
    [applications, jobFilter],
  );

  const counts = useMemo(
    () =>
      Object.fromEntries(
        STATUSES.map((status) => [status, scoped.filter((application) => application.status === status).length]),
      ) as Record<ApplicationStatus, number>,
    [scoped],
  );

  const scored = scoped.filter((application) => application.matchState === 'scored' && application.matchScore !== null);
  const averageScore = scored.length
    ? Math.round(scored.reduce((sum, application) => sum + (application.matchScore ?? 0), 0) / scored.length)
    : null;

  const buckets = BUCKETS.map((bucket) => ({
    ...bucket,
    count: scored.filter(
      (application) => (application.matchScore ?? 0) >= bucket.min && (application.matchScore ?? 0) <= bucket.max,
    ).length,
  }));
  const unscored = scoped.filter((application) => application.matchState === 'extraction-failed').length;
  const maxBucket = Math.max(1, ...buckets.map((bucket) => bucket.count), unscored);

  const visibleJobs = jobs.filter((job) => jobFilter === 'all' || job.id === jobFilter);

  return (
    <HrShell breadcrumb="Dashboard">
      <PageHeader
        title="Recruitment dashboard"
        description="Applications, review progress and matching distribution for the jobs you own. Every figure comes from the shared demo fixture."
        actions={
          <Button variant="outlined" component={RouterLink} to={`/screens/SCR-04${jobFilter === 'all' ? '' : `?job=${jobFilter}`}`}>
            Open applicant inbox
          </Button>
        }
      />

      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end', marginBottom: 20, flexWrap: 'wrap' }}>
        <Field
          id="dashboard-job"
          select
          label="Job"
          value={jobFilter}
          onChange={(event) => setJobFilter(event.target.value)}
          sx={{ width: 320 }}
        >
          <MenuItem value="all">All jobs</MenuItem>
          {jobs.map((job) => (
            <MenuItem key={job.id} value={job.id}>
              {job.title}
            </MenuItem>
          ))}
        </Field>
      </div>

      {failed ? (
        <div style={{ maxWidth: 720 }}>
          <Callout
            variant="error"
            role="alert"
            title="Dashboard data could not be loaded"
            action={
              <Button
                variant="outlined"
                size="small"
                onClick={() => setFailed(false)}
                sx={{ borderColor: tokens.danger, color: tokens.danger }}
              >
                Retry
              </Button>
            }
          >
            The metrics query failed. Nothing was changed; retry to load the numbers again.
          </Callout>
        </div>
      ) : scoped.length === 0 ? (
        <div style={{ marginTop: 8 }}>
          <EmptyState
            icon={AssessmentOutlinedIcon}
            title="No applications for this job yet"
            description="Counters stay at zero until the first candidate applies. Share the public link or pick another job."
            action={
              <Button variant="outlined" onClick={() => setJobFilter('all')}>
                Show all jobs
              </Button>
            }
          />
        </div>
      ) : (
        <>
          <Surface padding="16px 20px">
            <dl
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(6, minmax(0, 1fr))',
                gap: 16,
                margin: 0,
              }}
            >
              {[
                { label: 'Applications', value: scoped.length },
                { label: 'Under review', value: counts['Under Review'] },
                { label: 'Shortlisted', value: counts.Shortlisted },
                { label: 'Hired', value: counts.Hired },
                { label: 'Rejected', value: counts.Rejected },
                { label: 'Avg. matching score', value: averageScore === null ? 'N/A' : `${averageScore}%` },
              ].map((stat) => (
                <div key={stat.label}>
                  <dt style={{ fontSize: 12.5, color: tokens.textSecondary }}>{stat.label}</dt>
                  <dd className="tabular" style={{ margin: '2px 0 0', fontSize: 22, fontWeight: 600 }}>
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </Surface>

          <Section title="Applications by job and status" id="dashboard-by-job">
            <TableContainer
              sx={{
                background: tokens.surface,
                border: `1px solid ${tokens.border}`,
                borderRadius: '10px',
              }}
            >
              <Table aria-label="Applications by job and status">
                <TableHead>
                  <TableRow>
                    <TableCell>Job</TableCell>
                    {STATUSES.map((status) => (
                      <TableCell key={status} align="right">
                        {status}
                      </TableCell>
                    ))}
                    <TableCell align="right">Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {visibleJobs.map((job) => {
                    const rows = applications.filter((application) => application.jobId === job.id);
                    return (
                      <TableRow key={job.id}>
                        <TableCell>{job.title}</TableCell>
                        {STATUSES.map((status) => (
                          <TableCell key={status} align="right" className="tabular">
                            {rows.filter((application) => application.status === status).length}
                          </TableCell>
                        ))}
                        <TableCell align="right" className="tabular" sx={{ fontWeight: 600 }}>
                          {rows.length}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>All shown jobs</TableCell>
                    {STATUSES.map((status) => (
                      <TableCell key={status} align="right" className="tabular" sx={{ fontWeight: 600 }}>
                        {counts[status]}
                      </TableCell>
                    ))}
                    <TableCell align="right" className="tabular" sx={{ fontWeight: 600 }}>
                      {scoped.length}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Section>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginTop: 32 }}>
            <Section title="Matching score distribution" id="dashboard-scores">
              <Surface>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 10 }}>
                  {buckets.map((bucket) => (
                    <li key={bucket.label} style={{ display: 'grid', gridTemplateColumns: '70px 1fr 32px', gap: 10, alignItems: 'center' }}>
                      <span style={{ fontSize: 12.5, color: tokens.textSecondary }}>{bucket.label}</span>
                      <span aria-hidden style={{ height: 8, background: tokens.surfaceSunken, borderRadius: 999 }}>
                        <span
                          style={{
                            display: 'block',
                            height: 8,
                            width: `${(bucket.count / maxBucket) * 100}%`,
                            background: tokens.ink,
                            borderRadius: 999,
                          }}
                        />
                      </span>
                      <span className="tabular" style={{ fontSize: 13, textAlign: 'right' }}>
                        {bucket.count}
                      </span>
                    </li>
                  ))}
                  <li style={{ display: 'grid', gridTemplateColumns: '70px 1fr 32px', gap: 10, alignItems: 'center' }}>
                    <span style={{ fontSize: 12.5, color: tokens.textSecondary }}>N/A</span>
                    <span aria-hidden style={{ height: 8, background: tokens.surfaceSunken, borderRadius: 999 }}>
                      <span
                        style={{
                          display: 'block',
                          height: 8,
                          width: `${(unscored / maxBucket) * 100}%`,
                          background: tokens.textMuted,
                          borderRadius: 999,
                        }}
                      />
                    </span>
                    <span className="tabular" style={{ fontSize: 13, textAlign: 'right' }}>
                      {unscored}
                    </span>
                  </li>
                </ul>
                <p style={{ margin: '10px 0 0', fontSize: 12.5, color: tokens.textMuted }}>
                  N/A means the CV text could not be read. Scores are fixture values and support human review
                  only.
                </p>
              </Surface>
            </Section>

            <Section title="Pipeline conversion" id="dashboard-conversion">
              <Surface>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 10 }}>
                  {STATUSES.map((status) => {
                    const share = scoped.length ? Math.round((counts[status] / scoped.length) * 100) : 0;
                    return (
                      <li
                        key={status}
                        style={{ display: 'grid', gridTemplateColumns: '110px 1fr 80px', gap: 10, alignItems: 'center' }}
                      >
                        <span style={{ fontSize: 12.5, color: tokens.textSecondary }}>{status}</span>
                        <span aria-hidden style={{ height: 8, background: tokens.surfaceSunken, borderRadius: 999 }}>
                          <span
                            style={{
                              display: 'block',
                              height: 8,
                              width: `${share}%`,
                              background: tokens.ink,
                              borderRadius: 999,
                            }}
                          />
                        </span>
                        <span className="tabular" style={{ fontSize: 13, textAlign: 'right' }}>
                          {counts[status]} · {share}%
                        </span>
                      </li>
                    );
                  })}
                </ul>
                <p style={{ margin: '10px 0 0', fontSize: 12.5, color: tokens.textMuted }}>
                  Shares use the official status of every application in the current filter. Conversion is a
                  basic count, not a forecast.
                </p>
              </Surface>
            </Section>
          </div>
        </>
      )}
    </HrShell>
  );
}
