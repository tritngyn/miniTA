import { useMemo, useState } from 'react';
import { Link as RouterLink, useNavigate, useSearchParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import AddIcon from '@mui/icons-material/Add';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import { HrShell } from '../../components/AppShell';
import { PageHeader } from '../../components/PageHeader';
import { Field } from '../../components/FormField';
import { JobStatusBadge } from '../../components/StatusBadge';
import { EmptyState } from '../../components/EmptyState';
import { formatShortDate, useDemo } from '../../data/store';
import { tokens } from '../../theme';

export function JobList() {
  const { jobs, applications } = useDemo();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const forceEmpty = searchParams.get('state') === 'empty';

  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');

  const departments = useMemo(() => [...new Set(jobs.map((job) => job.department))].sort(), [jobs]);

  const filtered = useMemo(
    () =>
      forceEmpty
        ? []
        : jobs.filter(
            (job) =>
              (statusFilter === 'all' || job.status === statusFilter) &&
              (departmentFilter === 'all' || job.department === departmentFilter),
          ),
    [jobs, statusFilter, departmentFilter, forceEmpty],
  );

  const clearFilters = () => {
    setStatusFilter('all');
    setDepartmentFilter('all');
    if (forceEmpty) navigate('/screens/SCR-06');
  };

  return (
    <HrShell breadcrumb="Job postings">
      <PageHeader
        title="Job postings"
        description="Drafts, published roles and closed listings. Publishing needs one approved evaluation rubric."
        actions={
          <Button variant="contained" startIcon={<AddIcon />} component={RouterLink} to="/screens/SCR-05?state=new">
            Create job posting
          </Button>
        }
      />

      <Box
        sx={{
          background: tokens.surface,
          border: `1px solid ${tokens.border}`,
          borderRadius: '10px',
          padding: '16px 20px',
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '220px 220px 1fr', gap: 16, alignItems: 'end' }}>
          <Field
            id="job-filter-status"
            select
            label="Status"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <MenuItem value="all">All statuses</MenuItem>
            <MenuItem value="Draft">Draft</MenuItem>
            <MenuItem value="Published">Published</MenuItem>
            <MenuItem value="Closed">Closed</MenuItem>
          </Field>
          <Field
            id="job-filter-department"
            select
            label="Department"
            value={departmentFilter}
            onChange={(event) => setDepartmentFilter(event.target.value)}
          >
            <MenuItem value="all">All departments</MenuItem>
            {departments.map((department) => (
              <MenuItem key={department} value={department}>
                {department}
              </MenuItem>
            ))}
          </Field>
          <p aria-live="polite" style={{ margin: '0 0 10px', fontSize: 13, color: tokens.textSecondary }}>
            Showing <strong className="tabular">{filtered.length}</strong> of{' '}
            <strong className="tabular">{jobs.length}</strong> postings
          </p>
        </div>
      </Box>

      {filtered.length === 0 ? (
        <div style={{ marginTop: 24 }}>
          <EmptyState
            icon={WorkOutlineIcon}
            title="No job postings match these filters"
            description="Change the filters, or create a new posting and save it as a draft."
            action={
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                <Button variant="outlined" onClick={clearFilters}>
                  Clear filters
                </Button>
                <Button variant="contained" component={RouterLink} to="/screens/SCR-05?state=new">
                  Create job posting
                </Button>
              </div>
            }
          />
        </div>
      ) : (
        <TableContainer
          sx={{
            marginTop: '24px',
            background: tokens.surface,
            border: `1px solid ${tokens.border}`,
            borderRadius: '10px',
          }}
        >
          <Table aria-label="Job postings">
            <TableHead>
              <TableRow>
                <TableCell>Job</TableCell>
                <TableCell sx={{ width: 130 }}>Status</TableCell>
                <TableCell sx={{ width: 140 }}>Type</TableCell>
                <TableCell sx={{ width: 220 }}>Location</TableCell>
                <TableCell align="right" sx={{ width: 130 }}>
                  Applications
                </TableCell>
                <TableCell sx={{ width: 120 }}>Updated</TableCell>
                <TableCell align="right" sx={{ width: 90 }}>
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((job) => {
                const count = applications.filter((application) => application.jobId === job.id).length;
                return (
                  <TableRow key={job.id} hover>
                    <TableCell>
                      <div style={{ fontWeight: 500 }}>{job.title}</div>
                      <div style={{ fontSize: 13, color: tokens.textMuted }}>{job.department}</div>
                    </TableCell>
                    <TableCell>
                      <JobStatusBadge status={job.status} />
                    </TableCell>
                    <TableCell>{job.employmentType}</TableCell>
                    <TableCell>{job.location}</TableCell>
                    <TableCell align="right" className="tabular">
                      {count}
                    </TableCell>
                    <TableCell className="tabular">{formatShortDate(job.updatedAt)}</TableCell>
                    <TableCell align="right">
                      <RouterLink
                        to={`/screens/SCR-07?job=${job.id}`}
                        style={{ fontSize: 14, fontWeight: 500 }}
                        aria-label={`Open ${job.title}`}
                      >
                        Open
                      </RouterLink>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </HrShell>
  );
}
