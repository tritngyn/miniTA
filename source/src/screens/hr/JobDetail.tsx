import { useState } from 'react';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { HrShell } from '../../components/AppShell';
import { PageHeader, Section } from '../../components/PageHeader';
import { Callout } from '../../components/Callout';
import { Surface, DetailList } from '../../components/Surface';
import { JobStatusBadge } from '../../components/StatusBadge';
import { PipelineSummary } from '../../components/PipelineSummary';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { formatDate, useDemo } from '../../data/store';
import { tokens } from '../../theme';

export function JobDetail() {
  const { jobs, applications, getRubric, publishJob, closeJob } = useDemo();
  const [searchParams] = useSearchParams();
  const scenario = searchParams.get('state');
  const requestedId = searchParams.get('job');

  const job =
    jobs.find((item) => item.id === requestedId) ??
    jobs.find((item) => item.id === (scenario === 'draft' ? 'JOB-PD' : scenario === 'closed' ? 'JOB-PMM' : 'JOB-FE')) ??
    jobs[0];

  const rubric = getRubric(job.id);
  const jobApplications = applications.filter((application) => application.jobId === job.id);

  const [notice, setNotice] = useState<{ tone: 'success' | 'error' | 'info'; message: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [closeOpen, setCloseOpen] = useState(false);

  const publicUrl = `https://jobs.minita.example${job.publicPath}`;

  const handlePublish = () => {
    const result = publishJob(job.id);
    if (!result.ok) {
      setNotice({
        tone: 'error',
        message: 'Publishing needs exactly one approved evaluation rubric. Approve a rubric, then publish.',
      });
      return;
    }
    setNotice({ tone: 'success', message: 'Job published. The public application link is active.' });
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      setNotice({ tone: 'success', message: 'Public link copied.' });
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setNotice({ tone: 'info', message: 'Copy is not available in this browser. Select the link and copy it.' });
    }
  };

  return (
    <HrShell breadcrumb={<span>Job postings / {job.title}</span>}>
      <PageHeader
        title={job.title}
        description={`${job.department} · ${job.employmentType} · ${job.location}`}
        meta={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: tokens.textSecondary }}>
            <JobStatusBadge status={job.status} />
            <span>Updated {formatDate(job.updatedAt)}</span>
          </div>
        }
        actions={
          <>
            <Button variant="outlined" component={RouterLink} to={`/screens/SCR-05?job=${job.id}`}>
              Edit
            </Button>
            {job.status === 'Draft' ? (
              <Button variant="contained" onClick={handlePublish}>
                Publish job
              </Button>
            ) : null}
            {job.status === 'Published' ? (
              <Button variant="outlined" onClick={() => setCloseOpen(true)}>
                Close job
              </Button>
            ) : null}
          </>
        }
      />

      {notice ? (
        <div style={{ marginBottom: 20, maxWidth: 900 }}>
          <Callout
            variant={notice.tone === 'info' ? 'info' : notice.tone}
            role={notice.tone === 'error' ? 'alert' : 'status'}
          >
            {notice.message}
          </Callout>
        </div>
      ) : null}

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 360px', gap: 20, alignItems: 'start' }}>
        <div style={{ display: 'grid', gap: 20 }}>
          <Section title="Job information" id="job-info">
            <Surface>
              <DetailList
                rows={[
                  { label: 'Department', value: job.department },
                  { label: 'Employment type', value: job.employmentType },
                  { label: 'Location', value: job.location },
                  {
                    label: 'Hiring managers',
                    value: job.hiringManagers.length ? job.hiringManagers.join(', ') : 'None assigned',
                  },
                ]}
              />
              <div style={{ marginTop: 16, paddingTop: 14, borderTop: `1px solid ${tokens.border}` }}>
                <h3 style={{ margin: '0 0 6px', fontSize: 14, fontWeight: 600 }}>Description</h3>
                <p style={{ margin: 0, fontSize: 14, lineHeight: 1.65, color: tokens.textSecondary }}>
                  {job.description}
                </p>
              </div>
            </Surface>
          </Section>

          <Section title="Applications for this job" id="job-applications">
            <Surface>
              {jobApplications.length === 0 ? (
                <p style={{ margin: 0, fontSize: 14, color: tokens.textSecondary }}>
                  No applications yet. Share the public link once the job is published.
                </p>
              ) : (
                <>
                  <p style={{ margin: '0 0 10px', fontSize: 14, color: tokens.textSecondary }}>
                    <strong className="tabular" style={{ color: tokens.ink }}>
                      {jobApplications.length}
                    </strong>{' '}
                    applications ·{' '}
                    <RouterLink to={`/screens/SCR-04?job=${job.id}`}>Open in the applicant inbox</RouterLink>
                  </p>
                  <PipelineSummary applications={jobApplications} />
                </>
              )}
            </Surface>
          </Section>
        </div>

        <div style={{ display: 'grid', gap: 20 }}>
          <Section title="Status and public link" id="job-publish">
            <Surface>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <span style={{ fontSize: 13.5, color: tokens.textSecondary }}>Posting status</span>
                <JobStatusBadge status={job.status} />
              </div>

              <div style={{ fontSize: 13.5, color: tokens.textSecondary, marginBottom: 6 }}>Public job link</div>
              <div
                aria-label="Public job link"
                style={{
                  minHeight: 44,
                  display: 'flex',
                  alignItems: 'center',
                  padding: '10px 12px',
                  border: `1px solid ${tokens.borderStrong}`,
                  borderRadius: 8,
                  background: job.status === 'Published' ? tokens.surface : tokens.surfaceSunken,
                  color: job.status === 'Published' ? tokens.ink : tokens.textSecondary,
                  fontSize: 13,
                  lineHeight: 1.5,
                  wordBreak: 'break-all',
                }}
              >
                {job.status === 'Published' ? publicUrl : 'Available after publishing'}
              </div>
              <p style={{ margin: '6px 0 0', fontSize: 12.5, color: tokens.textMuted }}>
                {job.status === 'Published'
                  ? 'The link is active while the job is published.'
                  : job.status === 'Draft'
                    ? 'The link becomes active when you publish.'
                    : 'Closed jobs stop accepting applications.'}
              </p>

              <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
                <Button
                  variant="outlined"
                  onClick={handleCopy}
                  disabled={job.status !== 'Published'}
                  aria-describedby="copy-link-help"
                >
                  {copied ? 'Copied' : 'Copy link'}
                </Button>
                {job.status === 'Draft' ? (
                  <Button variant="contained" onClick={handlePublish}>
                    Publish
                  </Button>
                ) : null}
              </div>
              <p id="copy-link-help" style={{ margin: '8px 0 0', fontSize: 12.5, color: tokens.textMuted }}>
                {job.status === 'Draft'
                  ? 'Publishing requires one approved rubric.'
                  : job.status === 'Published'
                    ? 'Share this link with candidates while the job is open.'
                    : 'This job is closed; the link no longer accepts applications.'}
              </p>
            </Surface>
          </Section>

          <Section title="Evaluation rubric" id="job-rubric-summary">
            <Surface>
              {rubric ? (
                <>
                  <div style={{ fontSize: 14.5, fontWeight: 500 }}>{job.title}</div>
                  <div style={{ fontSize: 13, color: tokens.textMuted, marginTop: 2 }}>
                    {rubric.approvalState}
                    {rubric.approvedAt ? ` · ${formatDate(rubric.approvedAt)}` : ''} ·{' '}
                    {rubric.requiredSkills.length + rubric.preferredSkills.length} criteria
                  </div>
                  <div style={{ marginTop: 12 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      component={RouterLink}
                      to={`/screens/SCR-08?job=${job.id}`}
                    >
                      Edit rubric
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <p style={{ margin: '0 0 12px', fontSize: 14, color: tokens.textSecondary }}>
                    No rubric yet. Publishing stays blocked until one rubric is approved.
                  </p>
                  <Button variant="outlined" size="small" component={RouterLink} to={`/screens/SCR-08?job=${job.id}`}>
                    Create rubric
                  </Button>
                </>
              )}
            </Surface>
          </Section>
        </div>
      </div>

      <ConfirmDialog
        open={closeOpen}
        title="Close this job?"
        description={`“${job.title}” will stop accepting new applications. Existing applications stay available for review, and the public link will no longer accept submissions.`}
        confirmLabel="Close job"
        destructive
        onClose={() => setCloseOpen(false)}
        onConfirm={() => {
          closeJob(job.id);
          setCloseOpen(false);
          setNotice({ tone: 'success', message: 'Job closed. The public link no longer accepts applications.' });
        }}
      />
    </HrShell>
  );
}
