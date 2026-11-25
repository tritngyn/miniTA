import type { Application, ApplicationStatus } from '../data/types';
import { tokens } from '../theme';

const ORDER: ApplicationStatus[] = ['Applied', 'Under Review', 'Shortlisted', 'Hired', 'Rejected'];

const LABELS: Record<ApplicationStatus, string> = {
  Applied: 'Applied',
  'Under Review': 'Under review',
  Shortlisted: 'Shortlisted',
  Hired: 'Hired',
  Rejected: 'Rejected',
};

/** Compact pipeline strip: the counts behind the current filter, not a chart. */
export function PipelineSummary({ applications }: { applications: Application[] }) {
  const counts = ORDER.map((status) => ({
    status,
    count: applications.filter((application) => application.status === status).length,
  }));

  return (
    <dl
      aria-label="Applications by status in the current filter"
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'baseline',
        gap: '4px 18px',
        margin: 0,
        padding: '10px 0 0',
        borderTop: `1px solid ${tokens.border}`,
        fontSize: 13,
        color: tokens.textSecondary,
      }}
    >
      {counts.map(({ status, count }) => (
        <div key={status} style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
          <dt>{LABELS[status]}</dt>
          <dd
            className="tabular"
            style={{ margin: 0, fontWeight: 600, fontSize: 14, color: tokens.ink }}
          >
            {count}
          </dd>
        </div>
      ))}
    </dl>
  );
}
