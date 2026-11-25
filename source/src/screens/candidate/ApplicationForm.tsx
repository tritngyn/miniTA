import { useEffect, useRef, useState } from 'react';
import { Link as RouterLink, useNavigate, useSearchParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import { CandidateShell } from '../../components/AppShell';
import { PageHeader } from '../../components/PageHeader';
import { Field } from '../../components/FormField';
import { Callout } from '../../components/Callout';
import { useDemo } from '../../data/store';
import { candidateFixture } from '../../data/fixtures';
import { tokens } from '../../theme';

const MAX_FILE_BYTES = 5 * 1024 * 1024;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

interface FormState {
  name: string;
  email: string;
  phone: string;
  answers: Record<string, string>;
  consent: boolean;
}

export function ApplicationForm({ forceError }: { forceError?: boolean } = {}) {
  const { jobs, getRubric, submitApplication } = useDemo();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const scenario = searchParams.get('state');
  const showErrors = forceError === true || scenario === 'error';
  const duplicateScenario = scenario === 'duplicate';
  const idPrefix = forceError ? 'scr13' : 'scr12';

  const job = jobs.find((item) => item.id === 'JOB-FE');
  const rubric = getRubric('JOB-FE');
  const questions = rubric?.questions ?? [];

  const [form, setForm] = useState<FormState>(() => ({
    name: showErrors ? '' : candidateFixture.name,
    email: showErrors ? 'linh.pham@' : duplicateScenario ? 'minh.tran@example.com' : candidateFixture.email,
    phone: showErrors ? '' : candidateFixture.phone,
    answers: Object.fromEntries(
      questions.map((question, index) => [
        question.id,
        showErrors
          ? index === 0
            ? 'I want to work on a product where interface quality matters.'
            : ''
          : index === 0
            ? 'I want to work on a product where interface quality matters more than novelty.'
            : index === 1
              ? 'A design system migration across 120 screens with no visual regressions.'
              : 'Frontend performance work plus accessibility testing.',
      ]),
    ),
    consent: duplicateScenario,
  }));

  const [fileName, setFileName] = useState<string | null>(duplicateScenario ? 'minh-tran-cv.pdf' : null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [attempted, setAttempted] = useState(showErrors);
  const [duplicateMessage, setDuplicateMessage] = useState<string | null>(
    duplicateScenario
      ? 'An active application for this job already uses this email address.'
      : null,
  );
  const [noticeOpen, setNoticeOpen] = useState(false);
  const summaryRef = useRef<HTMLDivElement>(null);

  const errors = {
    name: form.name.trim() ? undefined : 'Enter your full name.',
    email: !form.email.trim()
      ? 'Enter your email address.'
      : EMAIL_PATTERN.test(form.email.trim())
        ? undefined
        : 'Enter a complete email address, for example name@example.com.',
    phone: form.phone.trim() ? undefined : 'Enter a phone number with country code.',
    answers: questions.map((question, index) =>
      form.answers[question.id]?.trim()
        ? undefined
        : `Answer screening question ${index + 1} before submitting.`,
    ),
    file: fileName ? undefined : (fileError ?? 'Attach one PDF CV.'),
    consent: form.consent ? undefined : 'Confirm the privacy consent before submitting.',
  };

  const errorList = [
    errors.name,
    errors.email,
    errors.phone,
    ...errors.answers,
    errors.file,
    errors.consent,
  ].filter((message): message is string => Boolean(message));

  useEffect(() => {
    if (attempted && errorList.length > 0) {
      summaryRef.current?.focus();
    }
  }, [attempted, errorList.length]);

  const update = (patch: Partial<FormState>) => {
    setForm({ ...form, ...patch });
    setDuplicateMessage(null);
  };

  const handleFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setFileName(null);
      return;
    }
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setFileError('That file is not a PDF. Attach one PDF file with selectable text.');
      setFileName(null);
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      setFileError('That file is larger than 5 MB. Compress it and attach it again.');
      setFileName(null);
      return;
    }
    setFileError(null);
    setFileName(file.name);
  };

  const clearFile = () => {
    setFileName(null);
    setFileError(null);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setAttempted(true);
    if (errorList.length > 0 || !job) return;
    const result = submitApplication({
      jobId: job.id,
      candidateName: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      answers: questions.map((question) => ({
        question: question.prompt,
        answer: form.answers[question.id] ?? '',
      })),
      cvFileName: fileName ?? '',
      consent: form.consent,
    });
    if (!result.ok) {
      setDuplicateMessage(result.message);
      return;
    }
    navigate('/screens/SCR-14');
  };

  return (
    <CandidateShell breadcrumb="Application">
      <PageHeader
        title={job?.title ?? 'Application form'}
        description={`${job?.department} · ${job?.employmentType} · ${job?.location}`}
      />

      <div style={{ display: 'flex', alignItems: 'baseline', flexWrap: 'wrap', gap: '6px 16px', marginBottom: 8 }}>
        <RouterLink to="/screens/SCR-22" style={{ fontSize: 14 }}>
          Read the full job description
        </RouterLink>
        <span style={{ fontSize: 13.5, color: tokens.textSecondary }}>
          About 6 minutes. You can review everything before submitting.
        </span>
      </div>

      {duplicateMessage ? (
        <div style={{ marginTop: 20 }}>
          <Callout variant="error" role="alert" title="You already applied to this job">
            {duplicateMessage} Contact the hiring team if you need to update your details.
          </Callout>
        </div>
      ) : null}

      {attempted && errorList.length > 0 ? (
        <div style={{ marginTop: 20 }}>
          <div ref={summaryRef} tabIndex={-1} aria-live="assertive" style={{ outline: 'none' }}>
            <Callout
              variant="error"
              role="alert"
              title={`Fix ${errorList.length} ${errorList.length === 1 ? 'field' : 'fields'} before submitting`}
            >
              <ul style={{ margin: '4px 0 0', paddingLeft: 18 }}>
                {errorList.map((message, index) => (
                  <li key={`${message}-${index}`}>{message}</li>
                ))}
              </ul>
            </Callout>
          </div>
        </div>
      ) : null}

      <Box component="form" noValidate onSubmit={handleSubmit} sx={{ marginTop: '28px', maxWidth: 720 }}>
        <h2 style={{ margin: '0 0 4px', fontSize: 17, fontWeight: 600 }}>Contact details</h2>
        <p style={{ margin: '0 0 16px', fontSize: 14, color: tokens.textSecondary }}>
          We use these details to contact you about this application.
        </p>

        <div style={{ display: 'grid', gap: 16 }}>
          <Field
            id={`${idPrefix}-candidate-name`}
            label="Full name"
            required
            autoComplete="name"
            value={form.name}
            onChange={(event) => update({ name: event.target.value })}
            error={attempted && Boolean(errors.name)}
            helperText={attempted ? errors.name : 'As it appears on your CV.'}
          />
          <Field
            id={`${idPrefix}-candidate-email`}
            label="Email address"
            type="email"
            required
            autoComplete="email"
            value={form.email}
            onChange={(event) => update({ email: event.target.value })}
            error={attempted && Boolean(errors.email)}
            helperText={attempted ? errors.email : 'Your status link is sent here.'}
          />
          <Field
            id={`${idPrefix}-candidate-phone`}
            label="Phone number"
            type="tel"
            required
            autoComplete="tel"
            value={form.phone}
            onChange={(event) => update({ phone: event.target.value })}
            error={attempted && Boolean(errors.phone)}
            helperText={attempted ? errors.phone : 'Include the country code.'}
          />
        </div>

        <h2 style={{ margin: '32px 0 4px', fontSize: 17, fontWeight: 600 }}>Screening questions</h2>
        <p style={{ margin: '0 0 16px', fontSize: 14, color: tokens.textSecondary }}>
          The hiring team reads these answers with your CV. Two or three sentences is enough.
        </p>

        <div style={{ display: 'grid', gap: 16 }}>
          {questions.map((question, index) => (
            <Field
              key={question.id}
              id={`${idPrefix}-answer-${question.id}`}
              label={`${index + 1}. ${question.prompt}`}
              required
              multiline
              minRows={3}
              value={form.answers[question.id] ?? ''}
              onChange={(event) =>
                update({ answers: { ...form.answers, [question.id]: event.target.value } })
              }
              error={attempted && Boolean(errors.answers[index])}
              helperText={attempted ? errors.answers[index] : undefined}
            />
          ))}
        </div>

        <h2 style={{ margin: '32px 0 4px', fontSize: 17, fontWeight: 600 }}>CV / resume</h2>
        <p style={{ margin: '0 0 16px', fontSize: 14, color: tokens.textSecondary }}>
          One PDF with selectable text, up to 5 MB.
        </p>

        {fileName ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 12px',
              background: tokens.surface,
              border: `1px solid ${tokens.border}`,
              borderRadius: 8,
            }}
          >
            <DescriptionOutlinedIcon sx={{ fontSize: 20, color: tokens.textSecondary }} />
            <span style={{ fontSize: 14.5, flex: 1 }}>{fileName}</span>
            <IconButton size="small" aria-label={`Remove ${fileName}`} onClick={clearFile}>
              <CloseIcon sx={{ fontSize: 17 }} />
            </IconButton>
          </div>
        ) : null}

        <div style={{ marginTop: fileName ? 12 : 0 }}>
          <label
            htmlFor={`${idPrefix}-cv-file`}
            style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 6 }}
          >
            Upload CV (PDF)
            <span aria-hidden style={{ color: tokens.danger, marginLeft: 2 }}>
              *
            </span>
          </label>
          <input
            id={`${idPrefix}-cv-file`}
            name="cv"
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFile}
            aria-required="true"
            aria-invalid={attempted && Boolean(errors.file)}
            aria-describedby={
              fileError ? `${idPrefix}-cv-file-error` : `${idPrefix}-cv-file-helper`
            }
            className="file-input"
          />
          <p
            id={fileError ? `${idPrefix}-cv-file-error` : `${idPrefix}-cv-file-helper`}
            role={fileError ? 'alert' : undefined}
            style={{
              margin: '6px 0 0',
              fontSize: 13,
              color: fileError || (attempted && !fileName) ? tokens.danger : tokens.textMuted,
            }}
          >
            {fileError ??
              (attempted && !fileName
                ? 'Attach one PDF CV.'
                : 'Upload one PDF CV, up to 5 MB. Never shared outside the hiring team.')}
          </p>
        </div>

        <div style={{ marginTop: 24 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={form.consent}
                onChange={(event) => update({ consent: event.target.checked })}
                inputProps={{ 'aria-describedby': `${idPrefix}-consent-helper` }}
              />
            }
            label={<span style={{ fontSize: 14.5 }}>I consent to my data being processed for this application.</span>}
            sx={{ alignItems: 'flex-start', marginLeft: '0px' }}
          />
          <div id={`${idPrefix}-consent-helper`} style={{ marginLeft: 0 }}>
            {attempted && errors.consent ? (
              <span role="alert" style={{ fontSize: 13, color: tokens.danger }}>
                {errors.consent}
              </span>
            ) : (
              <button
                type="button"
                onClick={() => setNoticeOpen(!noticeOpen)}
                aria-expanded={noticeOpen}
                style={{
                  border: 'none',
                  background: 'none',
                  padding: 0,
                  marginLeft: 0,
                  fontSize: 13,
                  color: tokens.link,
                  textDecoration: 'underline',
                  textUnderlineOffset: 3,
                  cursor: 'pointer',
                }}
              >
                {noticeOpen ? 'Hide the privacy notice' : 'Read the privacy notice'}
              </button>
            )}
          </div>

          {noticeOpen ? (
            <div
              style={{
                marginTop: 12,
                padding: '12px 14px',
                border: `1px solid ${tokens.border}`,
                borderRadius: 8,
                background: tokens.surfaceSunken,
                fontSize: 13.5,
                lineHeight: 1.6,
                color: tokens.textSecondary,
              }}
            >
              Your answers, CV and contact details are stored for this hiring process and are visible only to
              the recruiter and assigned hiring managers. Your CV is never publicly accessible. Notes,
              scorecards and matching evidence stay internal. Ask the hiring team to delete your data at any
              time.
            </div>
          ) : null}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 32 }}>
          <Button type="submit" variant="contained" size="large" sx={{ minWidth: 200 }}>
            Submit application
          </Button>
          <RouterLink to="/screens/SCR-22" style={{ fontSize: 14 }}>
            Back to the job
          </RouterLink>
        </div>
      </Box>
    </CandidateShell>
  );
}
