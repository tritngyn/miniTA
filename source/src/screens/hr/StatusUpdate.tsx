import { useEffect, useRef, useState } from 'react';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import Button from '@mui/material/Button';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { ApplicantHeader } from '../../components/ApplicantHeader';
import { Section } from '../../components/PageHeader';
import { Surface } from '../../components/Surface';
import { Callout } from '../../components/Callout';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { formatDate, useDemo } from '../../data/store';
import { tokens } from '../../theme';
import type { ApplicationStatus } from '../../data/types';

const OPTIONS: { value: ApplicationStatus; description: string }[] = [
  { value: 'Applied', description: 'The application was received. No review has started.' },
  { value: 'Under Review', description: 'A recruiter is reviewing the application.' },
  { value: 'Shortlisted', description: 'The candidate moves forward to interviews.' },
  { value: 'Hired', description: 'The candidate accepted an offer. Terminal status.' },
  { value: 'Rejected', description: 'The candidate is not moving forward. Terminal status.' },
];

export function StatusUpdate() {
  const { applications, jobs, updateStatus } = useDemo();
  const [searchParams] = useSearchParams();
  const application =
    applications.find((item) => item.id === searchParams.get('application')) ??
    applications.find((item) => item.id === 'APP-1041') ??
    applications[0];
  const job = jobs.find((item) => item.id === application.jobId);
  const scenario = searchParams.get('state');

  const [selected, setSelected] = useState<ApplicationStatus>(
    scenario === 'confirmed' ? 'Shortlisted' : application.status,
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const applied = useRef(false);

  useEffect(() => {
    if (scenario === 'confirmed' && !applied.current && application.status !== 'Shortlisted') {
      applied.current = true;
      updateStatus(application.id, 'Shortlisted');
      setMessage('Status updated to Shortlisted. The candidate sees the new status on their status page.');
    }
  }, [scenario, application.id, application.status, updateStatus]);

  const confirm = () => {
    updateStatus(application.id, selected);
    setDialogOpen(false);
    setMessage(`Status updated to ${selected}. Internal notes, scorecards and matching results stay internal.`);
  };

  return (
    <ApplicantHeader application={application} job={job} active="status">
      <div style={{ maxWidth: 760 }}>
        <p style={{ margin: '0 0 18px', fontSize: 14.5, color: tokens.textSecondary }}>
          The official status is what the candidate sees. Updating it is a separate action from saving a
          scorecard, and a scorecard is never required to change it.
        </p>

        {message ? (
          <div style={{ marginBottom: 18 }}>
            <Callout variant="success" role="status" title="Status saved">
              {message} <RouterLink to={`/screens/SCR-17?application=${application.id}`}>Back to the applicant</RouterLink>
            </Callout>
          </div>
        ) : null}

        <Section
          title="Official status"
          description={`Currently ${application.status}, updated ${formatDate(application.statusUpdatedOn)}. Choose one new status.`}
          id="new-status"
        >
          <Surface>
            <RadioGroup
              aria-label="New application status"
              name="new-status"
              value={selected}
              onChange={(event) => setSelected(event.target.value as ApplicationStatus)}
            >
              {OPTIONS.map((option) => (
                <FormControlLabel
                  key={option.value}
                  value={option.value}
                  disabled={application.status === option.value}
                  control={<Radio size="small" />}
                  label={
                    <span>
                      <span style={{ fontSize: 14.5, fontWeight: 500 }}>{option.value}</span>
                      <span style={{ display: 'block', fontSize: 12.5, color: tokens.textMuted }}>
                        {option.description}
                        {application.status === option.value ? ' Current status.' : ''}
                      </span>
                    </span>
                  }
                  sx={{ alignItems: 'flex-start', marginBottom: '6px' }}
                />
              ))}
            </RadioGroup>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 16 }}>
              <Button
                variant="contained"
                onClick={() => setDialogOpen(true)}
                disabled={selected === application.status}
              >
                Update status
              </Button>
              <span style={{ fontSize: 12.5, color: tokens.textMuted }}>
                A confirmation step follows; nothing changes until you confirm.
              </span>
            </div>
          </Surface>
        </Section>
      </div>

      <ConfirmDialog
        open={dialogOpen}
        title={`Change status to ${selected}?`}
        description={`The candidate will see “${selected}” as their official status. Internal notes, scorecards and matching results remain hidden.`}
        confirmLabel="Confirm change"
        onClose={() => setDialogOpen(false)}
        onConfirm={confirm}
      />
    </ApplicantHeader>
  );
}
