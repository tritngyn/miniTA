import { useMemo, useState } from 'react';
import { Link as RouterLink, useNavigate, useSearchParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import MenuItem from '@mui/material/MenuItem';
import { HrShell } from '../../components/AppShell';
import { PageHeader, Section } from '../../components/PageHeader';
import { Field } from '../../components/FormField';
import { Callout } from '../../components/Callout';
import { Surface } from '../../components/Surface';
import { useDemo } from '../../data/store';
import { users } from '../../data/fixtures';
import { tokens } from '../../theme';

const DEPARTMENTS = ['Design', 'Engineering', 'Marketing', 'Operations', 'Sales'];
const EMPLOYMENT_TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship'];

export function JobForm() {
  const { jobs, getRubric, createJob, updateJob } = useDemo();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const mode = searchParams.get('state') === 'new' ? 'new' : 'edit';
  const emptyValidation = searchParams.get('state') === 'validation';

  const job = jobs.find((item) => item.id === (searchParams.get('job') ?? 'JOB-FE')) ?? jobs[0];
  const rubric = job ? getRubric(job.id) : undefined;

  const [form, setForm] = useState(() => ({
    title: mode === 'new' || emptyValidation ? '' : (job?.title ?? ''),
    department: mode === 'new' || emptyValidation ? 'Design' : (job?.department ?? 'Design'),
    employmentType: mode === 'new' || emptyValidation ? 'Full-time' : (job?.employmentType ?? 'Full-time'),
    location: mode === 'new' || emptyValidation ? '' : (job?.location ?? ''),
    description: mode === 'new' || emptyValidation ? '' : (job?.description ?? ''),
    hiringManagers: mode === 'new' || emptyValidation ? [] : (job?.hiringManagers ?? []),
  }));
  const [attempted, setAttempted] = useState(emptyValidation);
  const [saved, setSaved] = useState<string | null>(null);

  const titleError = form.title.trim() ? undefined : 'Enter a job title.';
  const descriptionError = form.description.trim() ? undefined : 'Paste the job description.';
  const errorCount = [titleError, descriptionError].filter(Boolean).length;

  const heading = mode === 'new' ? 'Create job posting' : 'Edit job posting';

  const isDirty = useMemo(() => {
    if (mode === 'new') return true;
    if (!job) return false;
    return (
      form.title !== job.title ||
      form.department !== job.department ||
      form.employmentType !== job.employmentType ||
      form.location !== job.location ||
      form.description !== job.description ||
      form.hiringManagers.join('|') !== job.hiringManagers.join('|')
    );
  }, [form, job, mode]);

  const save = () => {
    setAttempted(true);
    if (errorCount > 0) return;
    const input = {
      title: form.title.trim(),
      department: form.department,
      employmentType: form.employmentType,
      location: form.location.trim(),
      description: form.description.trim(),
      hiringManagers: form.hiringManagers,
    };
    if (mode === 'new' || !job) {
      const created = createJob(input);
      navigate(`/screens/SCR-07?job=${created.id}`);
      return;
    }
    updateJob(job.id, input);
    setSaved(
      job.status === 'Published'
        ? 'Changes saved. The published posting is updated.'
        : 'Draft saved. Publishing still requires one approved rubric.',
    );
  };

  return (
    <HrShell breadcrumb={<span>Job postings / {mode === 'new' ? 'New posting' : job?.title}</span>}>
      <PageHeader
        title={heading}
        description={
          mode === 'new'
            ? 'Draft the role first. You can publish it once an evaluation rubric is approved.'
            : job?.status === 'Published'
              ? 'Update the role details. Publishing needs an approved rubric; changes apply to the live posting.'
              : 'Update the role details. Publishing needs an approved rubric.'
        }
      />

      {saved ? (
        <div style={{ marginBottom: 20, maxWidth: 800 }}>
          <Callout variant="success" role="status">
            {saved}
          </Callout>
        </div>
      ) : null}

      {attempted && errorCount > 0 ? (
        <div style={{ marginBottom: 20, maxWidth: 800 }}>
          <Callout variant="error" role="alert" title={`Fix ${errorCount} ${errorCount === 1 ? 'field' : 'fields'} before saving`}>
            <ul style={{ margin: '4px 0 0', paddingLeft: 18 }}>
              {titleError ? <li>{titleError}</li> : null}
              {descriptionError ? <li>{descriptionError}</li> : null}
            </ul>
          </Callout>
        </div>
      ) : null}

      <Box component="form" noValidate sx={{ maxWidth: 800 }} onSubmit={(event) => event.preventDefault()}>
        <Section title="Job details" description="Shown on the job posting and in the applicant inbox." id="job-details">
          <div style={{ display: 'grid', gap: 16 }}>
            <Field
              id="job-title"
              label="Job title"
              required
              value={form.title}
              onChange={(event) => setForm({ ...form, title: event.target.value })}
              error={attempted && Boolean(titleError)}
              helperText={attempted ? titleError : 'For example: Software Engineer (Frontend).'}
            />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <Field
                id="job-department"
                select
                label="Department"
                value={form.department}
                onChange={(event) => setForm({ ...form, department: event.target.value })}
                helperText="Used for filters and reporting."
              >
                {DEPARTMENTS.map((department) => (
                  <MenuItem key={department} value={department}>
                    {department}
                  </MenuItem>
                ))}
              </Field>
              <Field
                id="job-employment-type"
                select
                label="Employment type"
                value={form.employmentType}
                onChange={(event) => setForm({ ...form, employmentType: event.target.value })}
                helperText="Candidates see this on the public page."
              >
                {EMPLOYMENT_TYPES.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Field>
            </div>
            <Field
              id="job-location"
              label="Location"
              value={form.location}
              onChange={(event) => setForm({ ...form, location: event.target.value })}
              helperText="Include the work mode, for example “Remote — EU time zones”."
            />
          </div>
        </Section>

        <Section
          title="Job description"
          description="The public description. The AI assistant only ever receives this text."
          id="job-description"
        >
          <Field
            id="job-description-input"
            label="Job description"
            required
            multiline
            minRows={8}
            value={form.description}
            onChange={(event) => setForm({ ...form, description: event.target.value })}
            error={attempted && Boolean(descriptionError)}
            helperText={
              attempted && descriptionError
                ? descriptionError
                : 'Include responsibilities, requirements and benefits. Markdown is not supported.'
            }
          />
        </Section>

        <Section
          title="Hiring managers"
          description="Assigned hiring managers can open shortlisted candidates for this job."
          id="job-managers"
        >
          <Surface padding="10px 14px">
            {users
              .filter((user) => user.role === 'Hiring Manager')
              .map((user) => (
                <FormControlLabel
                  key={user.email}
                  control={
                    <Checkbox
                      checked={form.hiringManagers.includes(user.name)}
                      onChange={(event) =>
                        setForm({
                          ...form,
                          hiringManagers: event.target.checked
                            ? [...form.hiringManagers, user.name]
                            : form.hiringManagers.filter((name) => name !== user.name),
                        })
                      }
                    />
                  }
                  label={<span style={{ fontSize: 14.5 }}>{user.name}</span>}
                />
              ))}
          </Surface>
        </Section>

        {mode === 'edit' && job ? (
          <Section title="Evaluation rubric" id="job-rubric">
            <Surface>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                <div>
                  <div style={{ fontSize: 14.5, fontWeight: 500 }}>{rubric ? job.title : 'No rubric yet'}</div>
                  <div style={{ fontSize: 13, color: tokens.textMuted }}>
                    {rubric
                      ? `${rubric.approvalState} · ${rubric.requiredSkills.length + rubric.preferredSkills.length} criteria · total weight ${
                          Object.values(rubric.weights).reduce((sum, value) => sum + value, 0)
                        }%`
                      : 'Publishing requires one approved rubric.'}
                  </div>
                </div>
                <Button variant="outlined" component={RouterLink} to={`/screens/SCR-08?job=${job.id}`}>
                  {rubric ? 'Edit rubric' : 'Create rubric'}
                </Button>
              </div>
            </Surface>
          </Section>
        ) : null}

        <div
          style={{
            display: 'flex',
            gap: 10,
            marginTop: 28,
            paddingTop: 20,
            borderTop: `1px solid ${tokens.border}`,
          }}
        >
          <Button variant="contained" onClick={save}>
            {mode === 'new' || job?.status !== 'Published' ? 'Save draft' : 'Save changes'}
          </Button>
          <Button variant="text" component={RouterLink} to="/screens/SCR-06" sx={{ color: tokens.textSecondary }}>
            Cancel
          </Button>
          {mode === 'edit' && job ? (
            <span style={{ marginLeft: 'auto', fontSize: 13, color: tokens.textMuted }}>
              {isDirty ? 'Unsaved changes' : 'All changes saved'}
            </span>
          ) : null}
        </div>
      </Box>
    </HrShell>
  );
}
