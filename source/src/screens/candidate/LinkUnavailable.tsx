import { useState } from 'react';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { CandidateShell } from '../../components/AppShell';
import { Field } from '../../components/FormField';
import { Callout } from '../../components/Callout';
import { Surface } from '../../components/Surface';
import { useDemo } from '../../data/store';
import { tokens } from '../../theme';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function LinkUnavailable() {
  const { requestReplacementLink } = useDemo();
  const [searchParams] = useSearchParams();
  const reason = searchParams.get('state') === 'invalid' ? 'invalid' : 'expired';

  const [email, setEmail] = useState('');
  const [attempted, setAttempted] = useState(false);
  const [sent, setSent] = useState(false);

  const emailError = !email.trim()
    ? 'Enter the email address you applied with.'
    : !EMAIL_PATTERN.test(email.trim())
      ? 'Enter a complete email address, for example name@example.com.'
      : undefined;

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    setAttempted(true);
    if (emailError) return;
    requestReplacementLink(email);
    setSent(true);
  };

  return (
    <CandidateShell breadcrumb="Status link">
      <div style={{ maxWidth: 560 }}>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 600, letterSpacing: '-0.02em' }}>
          {reason === 'invalid' ? 'This status link is not valid' : 'This status link has expired'}
        </h1>
        <p style={{ margin: '8px 0 18px', fontSize: 15, lineHeight: 1.6, color: tokens.textSecondary }}>
          {reason === 'invalid'
            ? 'The link may be incomplete or was replaced by a newer one. Enter your email address to request a new link.'
            : 'Status links stay valid for 72 hours. Enter the email address you applied with to request a new link.'}
        </p>

        <Callout variant="info" title="Your application is unaffected">
          Requesting a new link does not create a new application or change your status.
        </Callout>

        <Surface sx={{ marginTop: '18px' }}>
          {sent ? (
            <div role="status">
              <h2 style={{ margin: '0 0 6px', fontSize: 16, fontWeight: 600 }}>Check your email</h2>
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.65, color: tokens.textSecondary }}>
                If an active application matches {email.trim()}, a new status link is on its way. It expires
                72 hours after it is sent. Nothing else changes.
              </p>
            </div>
          ) : (
            <Box component="form" noValidate onSubmit={submit}>
              <Field
                id="replacement-email"
                label="Email address on your application"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                error={attempted && Boolean(emailError)}
                helperText={attempted ? emailError : 'We only send a link for an active application.'}
              />
              <Button type="submit" variant="contained" sx={{ marginTop: '16px' }}>
                Send a new link
              </Button>
              <p style={{ margin: '10px 2px 0', fontSize: 12.5, color: tokens.textMuted }}>
                For your security we do not confirm whether an email address is registered.
              </p>
            </Box>
          )}
        </Surface>

        <p style={{ marginTop: 18, fontSize: 13 }}>
          <RouterLink to="/screens/SCR-22">Read the job description</RouterLink>
        </p>
      </div>
    </CandidateShell>
  );
}
