import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import HourglassEmptyOutlinedIcon from '@mui/icons-material/HourglassEmptyOutlined';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import type { SvgIconComponent } from '@mui/icons-material';
import { statusStyle, tokens } from '../theme';
import type { ApplicationStatus } from '../data/types';

const icons: Record<ApplicationStatus, SvgIconComponent> = {
  Applied: RadioButtonUncheckedIcon,
  'Under Review': HourglassEmptyOutlinedIcon,
  Shortlisted: StarOutlineIcon,
  Hired: CheckCircleOutlineIcon,
  Rejected: BlockOutlinedIcon,
};

export function StatusBadge({ status }: { status: ApplicationStatus }) {
  const Icon = icons[status];
  const style = statusStyle[status];
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '4px 10px 4px 8px',
        borderRadius: 999,
        background: style.bg,
        color: style.fg,
        fontSize: 12.5,
        fontWeight: 600,
        lineHeight: 1.4,
        whiteSpace: 'nowrap',
      }}
    >
      <Icon sx={{ fontSize: 15, color: 'inherit' }} />
      {status}
    </span>
  );
}

export function JobStatusBadge({ status }: { status: 'Draft' | 'Published' | 'Closed' }) {
  const map = {
    Draft: { bg: tokens.neutralSoft, fg: tokens.neutralInk },
    Published: { bg: tokens.successSoft, fg: tokens.success },
    Closed: { bg: tokens.surfaceSunken, fg: tokens.textSecondary },
  } as const;
  const style = map[status];
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '3px 9px',
        borderRadius: 999,
        background: style.bg,
        color: style.fg,
        fontSize: 12.5,
        fontWeight: 600,
        lineHeight: 1.4,
      }}
    >
      {status}
    </span>
  );
}
