import { useState } from 'react';
import { Link as RouterLink, useNavigate, useSearchParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Avatar from '@mui/material/Avatar';
import { Field } from '../../components/FormField';
import { Callout } from '../../components/Callout';
import { users } from '../../data/fixtures';
import { tokens } from '../../theme';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: tokens.canvas, display: 'flex', flexDirection: 'column' }}>
      <header className="site-header" style={{ background: tokens.navy, borderBottom: `1px solid ${tokens.navySoft}` }}>
        <div
          style={{
            maxWidth: 1100,
            margin: '0 auto',
            padding: '0 24px',
            height: 60,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span style={{ fontSize: 17, fontWeight: 600, letterSpacing: '-0.01em', color: tokens.onNavy }}>miniTA</span>
          <span style={{ fontSize: 13.5, color: tokens.onNavyMuted }}>Internal workspace</span>
        </div>
      </header>
      <main style={{ flex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '64px 24px' }}>
        {children}
      </main>
      <footer style={{ padding: '0 24px 28px', textAlign: 'center', fontSize: 12.5, color: tokens.textMuted }}>
        Authorized users only. Contact your administrator if you need access.
      </footer>
    </div>
  );
}

export function LoginScreen({ forcedError = false, forceLoading = false }: { forcedError?: boolean; forceLoading?: boolean }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState(forcedError ? users[0].email : '');
  const [password, setPassword] = useState(forcedError ? 'demo-password' : '');
  const [attempted, setAttempted] = useState(false);
  const [busy, setBusy] = useState(forceLoading || searchParams.get('state') === 'loading');

  const emailError = !email.trim()
    ? 'Enter your work email address.'
    : !EMAIL_PATTERN.test(email.trim())
      ? 'Enter a complete email address, for example name@company.com.'
      : undefined;
  const passwordError = password ? undefined : 'Enter your password.';
  const showBanner = forcedError;
  const invalid = Boolean(emailError || passwordError);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    setAttempted(true);
    if (invalid) return;
    const known = users.some((user) => user.email.toLowerCase() === email.trim().toLowerCase());
    if (!known) {
      navigate('/screens/SCR-02');
      return;
    }
    navigate('/screens/SCR-06');
  };

  return (
    <AuthLayout>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 600, letterSpacing: '-0.02em' }}>Sign in to miniTA</h1>
        <p style={{ margin: '8px 0 22px', fontSize: 14.5, color: tokens.textSecondary }}>
          Use your work account to manage job postings and applicant reviews.
        </p>

        {showBanner ? (
          <div style={{ marginBottom: 18 }}>
            <Callout variant="error" role="alert" title="Email or password is incorrect">
              Check your details and try again. Your account is not locked by this demo.
            </Callout>
          </div>
        ) : null}

        <Box
          component="form"
          noValidate
          onSubmit={submit}
          aria-busy={busy}
          sx={{
            background: tokens.surface,
            border: `1px solid ${tokens.border}`,
            borderRadius: '10px',
            padding: '22px 22px 20px',
          }}
        >
          <div style={{ display: 'grid', gap: 16 }}>
            <Field
              id="login-email"
              label="Work email"
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              error={attempted && Boolean(emailError)}
              helperText={attempted ? emailError : undefined}
            />
            <Field
              id="login-password"
              label="Password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              error={attempted && Boolean(passwordError)}
              helperText={attempted ? passwordError : undefined}
            />
          </div>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={busy}
            sx={{ marginTop: '20px' }}
          >
            {busy ? 'Signing in…' : 'Sign in'}
          </Button>
          <p style={{ margin: '12px 0 0', fontSize: 12.5, color: tokens.textMuted }}>
            Sessions last 30 minutes of inactivity. This prototype has no real authentication.
          </p>
        </Box>

        <p style={{ marginTop: 16, fontSize: 13, color: tokens.textSecondary }}>
          Candidate? Open the application link you received instead of signing in.
        </p>
      </div>
    </AuthLayout>
  );
}

export function AccessDeniedScreen() {
  const user = users[1];
  return (
    <AuthLayout>
      <div style={{ width: '100%', maxWidth: 520 }}>
        <div
          style={{
            background: tokens.surface,
            border: `1px solid ${tokens.border}`,
            borderRadius: 10,
            padding: '24px 24px 22px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
            <Avatar sx={{ width: 36, height: 36, bgcolor: tokens.surfaceSunken, color: tokens.ink }}>
              <LockOutlinedIcon sx={{ fontSize: 19 }} />
            </Avatar>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{user.name}</div>
              <div style={{ fontSize: 12.5, color: tokens.textMuted }}>
                {user.email} · {user.role}
              </div>
            </div>
          </div>

          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 600, letterSpacing: '-0.02em' }}>Access denied</h1>
          <p style={{ margin: '8px 0 0', fontSize: 14.5, lineHeight: 1.6, color: tokens.textSecondary }}>
            Your account does not have access to the page you requested. Sign out and use an account with the
            required role, or ask your administrator for access.
          </p>

          <div
            style={{
              marginTop: 16,
              padding: '10px 12px',
              borderRadius: 8,
              background: tokens.surfaceSunken,
              fontSize: 13,
              color: tokens.textSecondary,
            }}
          >
            Requested page: Job postings (internal). Access attempts are logged in production.
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
            <Button variant="contained" component={RouterLink} to="/screens/SCR-01">
              Sign out
            </Button>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
