import CheckIcon from '@mui/icons-material/Check';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import type { ApplicationStatus } from '../data/types';
import { statusStyle, tokens } from '../theme';

const STEPS: ApplicationStatus[] = ['Applied', 'Under Review', 'Shortlisted', 'Hired', 'Rejected'];

/** Read-only stage list for the candidate status portal and the recruiter view. */
export function StageRail({ status }: { status: ApplicationStatus }) {
  const currentIndex = STEPS.indexOf(status);
  const terminal = status === 'Hired' || status === 'Rejected';

  return (
    <ol
      aria-label="Application stages"
      style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 8 }}
    >
      {STEPS.map((step, index) => {
        const isCurrent = step === status;
        const done = !isCurrent && !terminal && index < currentIndex;
        const style = statusStyle[step];
        return (
          <li
            key={step}
            aria-current={isCurrent ? 'step' : undefined}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              fontSize: 14.5,
              color: isCurrent ? style.fg : tokens.textSecondary,
              fontWeight: isCurrent ? 600 : 400,
            }}
          >
            <span
              aria-hidden
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 22,
                height: 22,
                borderRadius: 999,
                background: isCurrent ? style.bg : done ? tokens.successSoft : tokens.surfaceSunken,
                color: isCurrent ? style.fg : done ? tokens.success : tokens.textMuted,
              }}
            >
              {done ? <CheckIcon sx={{ fontSize: 15 }} /> : <RadioButtonUncheckedIcon sx={{ fontSize: 14 }} />}
            </span>
            <span>
              {step}
              {isCurrent ? ' — current stage' : ''}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
