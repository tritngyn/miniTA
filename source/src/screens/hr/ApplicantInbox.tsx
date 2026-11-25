import { useMemo, useState } from 'react';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined';
import { HrShell } from '../../components/AppShell';
import { PageHeader } from '../../components/PageHeader';
import { Field } from '../../components/FormField';
import { StatusBadge } from '../../components/StatusBadge';
import { PipelineSummary } from '../../components/PipelineSummary';
import { formatShortDate, useDemo } from '../../data/store';
import { tokens } from '../../theme';
import type { ApplicationStatus } from '../../data/types';

type SortKey = 'newest' | 'oldest' | 'score';

const STATUS_OPTIONS: ApplicationStatus[] = ['Applied', 'Under Review', 'Shortlisted', 'Hired', 'Rejected'];

export function ApplicantInbox() {
  const { applications, jobs } = useDemo();
  const [searchParams] = useSearchParams();
  const emptyScenario = searchParams.get('state') === 'empty';

  const [jobFilter, setJobFilter] = useState<string>(
    emptyScenario ? 'JOB-PMM' : (searchParams.get('job') ?? 'all'),
  );
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sort, setSort] = useState<SortKey>('newest');
  const [search, setSearch] = useState('');
  const query = search.trim().toLowerCase();

  const filtered = useMemo(() => {
    const rows = applications.filter(
      (application) =>
        (jobFilter === 'all' || application.jobId === jobFilter) &&
        (statusFilter === 'all' || application.status === statusFilter) &&
        (application.candidateName.toLowerCase().includes(query) ||
          application.email.toLowerCase().includes(query)),
    );
    const byDate = (a: string, b: string) => a.localeCompare(b);
    return [...rows].sort((a, b) => {
      if (sort === 'newest') return byDate(b.appliedOn, a.appliedOn);
      if (sort === 'oldest') return byDate(a.appliedOn, b.appliedOn);
      return (b.matchScore ?? -1) - (a.matchScore ?? -1);
    });
  }, [applications, jobFilter, statusFilter, sort, query]);

  const filtersActive = query !== '' || jobFilter !== 'all' || statusFilter !== 'all' || sort !== 'newest';

  const clearFilters = () => {
    setSearch('');
    setJobFilter('all');
    setStatusFilter('all');
    setSort('newest');
  };

  return (
    <HrShell breadcrumb="Applicants">
      <PageHeader
        title="Applicant Inbox"
        description="Review candidate submissions for your jobs and open the ones that need a decision. Matching score is decision support only; it never changes a status."
      />

      <Box
        sx={{
          background: tokens.surface,
          border: `1px solid ${tokens.border}`,
          borderRadius: '10px',
          padding: '20px 20px 16px',
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'minmax(0, 1fr)',
              sm: 'repeat(2, minmax(0, 1fr))',
              lg: 'minmax(0, 1.35fr) minmax(0, 1.2fr) minmax(0, 1fr) minmax(0, 0.85fr)',
            },
            gap: '16px',
            alignItems: 'end',
          }}
        >
          <Field
            id="search-candidates"
            type="search"
            label="Search candidates"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            helperText="Search by name or email."
          />

          <Field
            id="filter-job"
            select
            label="Job"
            value={jobFilter}
            onChange={(event) => setJobFilter(event.target.value)}
            helperText="Filter by the role applied for."
          >
            <MenuItem value="all">All jobs</MenuItem>
            {jobs.map((job) => (
              <MenuItem key={job.id} value={job.id}>
                {job.title}
              </MenuItem>
            ))}
          </Field>

          <Field
            id="filter-status"
            select
            label="Application status"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            helperText="Filter by current stage."
          >
            <MenuItem value="all">Any status</MenuItem>
            {STATUS_OPTIONS.map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </Field>

          <Field
            id="filter-sort"
            select
            label="Sort by"
            value={sort}
            onChange={(event) => setSort(event.target.value as SortKey)}
            helperText="Order of the results."
          >
            <MenuItem value="newest">Newest first</MenuItem>
            <MenuItem value="oldest">Oldest first</MenuItem>
            <MenuItem value="score">Matching score</MenuItem>
          </Field>
        </Box>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            marginTop: 8,
          }}
        >
          <p aria-live="polite" style={{ margin: 0, fontSize: 13, color: tokens.textSecondary }}>
            Showing <strong className="tabular">{filtered.length}</strong> of{' '}
            <strong className="tabular">{applications.length}</strong> applications
          </p>
          {filtersActive ? (
            <button
              type="button"
              onClick={clearFilters}
              style={{
                border: 'none',
                background: 'none',
                padding: 0,
                fontSize: 13.5,
                fontWeight: 500,
                color: tokens.link,
                cursor: 'pointer',
                textDecoration: 'underline',
                textUnderlineOffset: 3,
              }}
            >
              Clear filters
            </button>
          ) : null}
        </div>

        <div style={{ marginTop: 6 }}>
          <PipelineSummary applications={filtered} />
        </div>
      </Box>

      {filtered.length === 0 ? (
        <Box
          sx={{
            marginTop: '24px',
            background: tokens.surface,
            border: `1px solid ${tokens.border}`,
            borderRadius: '10px',
            padding: '48px 32px',
            textAlign: 'center',
          }}
        >
          <InboxOutlinedIcon sx={{ fontSize: 32, color: tokens.textMuted }} />
          <h2 style={{ margin: '10px 0 6px', fontSize: 18, fontWeight: 600 }}>No applications match these filters</h2>
          <p style={{ margin: '0 auto 18px', maxWidth: 420, fontSize: 14.5, color: tokens.textSecondary }}>
            Try a different name or email, or choose another job or status.
          </p>
          <button
            type="button"
            onClick={clearFilters}
            style={{
              minHeight: 40,
              padding: '0 16px',
              borderRadius: 8,
              border: `1px solid ${tokens.borderStrong}`,
              background: tokens.surface,
              color: tokens.ink,
              font: 'inherit',
              fontSize: 14,
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Clear filters
          </button>
        </Box>
      ) : (
        <>
          <TableContainer
            sx={{
              marginTop: '24px',
              background: tokens.surface,
              border: `1px solid ${tokens.border}`,
              borderRadius: '10px',
            }}
          >
            <Table aria-label="Applications matching the current filters">
              <TableHead>
                <TableRow>
                  <TableCell>Candidate</TableCell>
                  <TableCell>Job</TableCell>
                  <TableCell align="right" sx={{ width: 150 }}>
                    Matching score
                  </TableCell>
                  <TableCell sx={{ width: 130 }}>Applied</TableCell>
                  <TableCell sx={{ width: 160 }}>Status</TableCell>
                  <TableCell align="right" sx={{ width: 96 }}>
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.map((application) => {
                  const job = jobs.find((item) => item.id === application.jobId);
                  return (
                    <TableRow key={application.id} hover>
                      <TableCell>
                        <div style={{ fontWeight: 500 }}>{application.candidateName}</div>
                        <div style={{ fontSize: 13, color: tokens.textMuted }}>{application.email}</div>
                      </TableCell>
                      <TableCell>
                        <div>{job?.title}</div>
                        <div style={{ fontSize: 13, color: tokens.textMuted }}>{job?.department}</div>
                      </TableCell>
                      <TableCell align="right">
                        {application.matchState === 'scored' && application.matchScore !== null ? (
                          <span className="tabular" style={{ fontWeight: 500 }}>
                            {application.matchScore}%
                          </span>
                        ) : (
                          <>
                            <div style={{ color: tokens.textMuted }}>N/A</div>
                            <div style={{ fontSize: 12.5, color: tokens.textMuted }}>Extraction failed</div>
                          </>
                        )}
                      </TableCell>
                      <TableCell className="tabular">{formatShortDate(application.appliedOn)}</TableCell>
                      <TableCell>
                        <StatusBadge status={application.status} />
                      </TableCell>
                      <TableCell align="right">
                        <RouterLink
                          to={`/screens/SCR-17?application=${application.id}`}
                          style={{ fontSize: 14, fontWeight: 500 }}
                          aria-label={`Review ${application.candidateName}'s application`}
                        >
                          Review
                        </RouterLink>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>

          <p style={{ margin: '10px 2px 0', fontSize: 12.5, color: tokens.textMuted }}>
            Matching scores support human review. A reviewer decides every application status change.
          </p>
        </>
      )}
    </HrShell>
  );
}
