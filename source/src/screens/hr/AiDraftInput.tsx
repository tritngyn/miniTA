import { useState } from 'react';
import { Link as RouterLink, useNavigate, useSearchParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { HrShell } from '../../components/AppShell';
import { PageHeader } from '../../components/PageHeader';
import { Field } from '../../components/FormField';
import { Callout } from '../../components/Callout';
import { Surface } from '../../components/Surface';
import { useDemo } from '../../data/store';
import { tokens } from '../../theme';

export function AiDraftInput() {
  const { jobs } = useDemo();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const scenario = searchParams.get('state');
  const job = jobs.find((item) => item.id === (searchParams.get('job') ?? 'JOB-FE')) ?? jobs[0];

  const [jd, setJd] = useState(job.description);
  const [attempted, setAttempted] = useState(false);
  const [busy, setBusy] = useState(scenario === 'loading');

  const jdError = jd.trim() ? undefined : 'Paste the job description before generating a draft.';

  const generate = () => {
    setAttempted(true);
    if (jdError) return;
    setBusy(true);
    setTimeout(() => navigate(`/screens/SCR-11?job=${job.id}`), 800);
  };

  return (
    <HrShell breadcrumb={<span>Job postings / {job.title} / AI rubric draft</span>}>
      <PageHeader
        title="Draft a rubric with the AI assistant"
        description="The assistant proposes criteria, weights and screening questions. Nothing is used for matching until a recruiter reviews and approves the proposal."
      />

      {scenario === 'unavailable' ? (
        <div style={{ marginBottom: 20, maxWidth: 760 }}>
          <Callout
            variant="error"
            role="alert"
            title="The assistant did not respond (timeout after 10 seconds)"
          >
            Nothing was saved. Draft the criteria manually or try again.
            <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
              <Button variant="contained" size="small" component={RouterLink} to={`/screens/SCR-08?job=${job.id}`}>
                Open the manual editor
              </Button>
              <Button variant="outlined" size="small" onClick={() => navigate(`/screens/SCR-10?job=${job.id}`)}>
                Try again
              </Button>
            </div>
          </Callout>
        </div>
      ) : null}

      {scenario === 'invalid' ? (
        <div style={{ marginBottom: 20, maxWidth: 760 }}>
          <Callout variant="warning" role="alert" title="The proposal could not be used">
            The response did not match the required format, so it was discarded. Configure the criteria
            manually.
            <div style={{ marginTop: 12 }}>
              <Button variant="contained" size="small" component={RouterLink} to={`/screens/SCR-08?job=${job.id}`}>
                Open the manual editor
              </Button>
            </div>
          </Callout>
        </div>
      ) : null}

      <Box component="form" noValidate onSubmit={(event) => event.preventDefault()} sx={{ maxWidth: 760 }}>
        <Surface padding="20px">
          <Callout variant="info">
            Only the job description and your instructions are sent. Candidate details, CVs and applications
            are never sent to the assistant.
          </Callout>

          <div style={{ marginTop: 16 }}>
            <Field
              id="ai-jd-input"
              label="Job description"
              required
              multiline
              minRows={10}
              value={jd}
              onChange={(event) => setJd(event.target.value)}
              error={attempted && Boolean(jdError)}
              helperText={
                attempted && jdError
                  ? jdError
                  : 'Include responsibilities and must-have qualifications; the proposal is only as specific as this text.'
              }
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 18 }}>
            <Button variant="contained" onClick={generate} disabled={busy}>
              {busy ? 'Generating draft…' : 'Generate draft'}
            </Button>
            <Button variant="outlined" component={RouterLink} to={`/screens/SCR-08?job=${job.id}`}>
              Write it manually
            </Button>
          </div>
          <p style={{ margin: '10px 2px 0', fontSize: 12.5, color: tokens.textMuted }}>
            Generation is simulated in this prototype; no AI service is called.
          </p>
        </Surface>
      </Box>
    </HrShell>
  );
}
