import { useState } from 'react';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import Button from '@mui/material/Button';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import MenuItem from '@mui/material/MenuItem';
import { ApplicantHeader } from '../../components/ApplicantHeader';
import { HrShell } from '../../components/AppShell';
import { Surface } from '../../components/Surface';
import { Field } from '../../components/FormField';
import { Callout } from '../../components/Callout';
import { formatDate, useDemo } from '../../data/store';
import { canDemoManagerReview, SCORECARD_DEMO_MANAGER } from '../../data/fixtures';
import { HIRING_RECOMMENDATIONS, type Application, type HiringRecommendation, type Job } from '../../data/types';
import { tokens } from '../../theme';

/** Illustrative criteria and scale: the approved scorecard rubric is still OPEN. */
export const SCORECARD_CRITERIA = [
  {
    id: 'communication',
    label: 'Communication & clarity',
    hint: 'Explains decisions and trade-offs clearly in writing and conversation.',
  },
  {
    id: 'craft',
    label: 'Craft & quality',
    hint: 'Ships work that holds up: correct, consistent and tested.',
  },
  {
    id: 'collaboration',
    label: 'Collaboration',
    hint: 'Works with design, engineering and recruiters without losing context.',
  },
  {
    id: 'ownership',
    label: 'Ownership & initiative',
    hint: 'Follows problems through and raises risks before they become blockers.',
  },
] as const;

const SCALE = [
  { value: '1', label: 'Needs improvement' },
  { value: '2', label: 'Below' },
  { value: '3', label: 'Meets' },
  { value: '4', label: 'Exceeds' },
  { value: '5', label: 'Outstanding' },
] as const;

export function Scorecard() {
  const { applications, jobs } = useDemo();
  const [searchParams] = useSearchParams();
  const state = searchParams.get('state');
  const isHiringManager = state === 'hiring-manager';
  const application =
    applications.find((item) => item.id === (searchParams.get('application') ?? (isHiringManager ? 'APP-1046' : 'APP-1041'))) ??
    (isHiringManager ? undefined : applications.find((item) => item.id === 'APP-1041') ?? applications[0]);
  const job = jobs.find((item) => item.id === application?.jobId);
  if (!application || (isHiringManager && !canDemoManagerReview(application, job))) {
    return (
      <HrShell breadcrumb="Scorecard" hiringManagerName={isHiringManager ? SCORECARD_DEMO_MANAGER : undefined}>
        <Callout variant="warning" title="Scorecard unavailable">
          Hiring Managers can review shortlisted applicants for their assigned jobs.
        </Callout>
      </HrShell>
    );
  }

  return (
    <ScorecardForm
      key={`${application.id}:${state ?? ''}`}
      application={application}
      job={job}
      isHiringManager={isHiringManager}
      incomplete={state === 'incomplete'}
    />
  );
}

function ScorecardForm({ application, job, isHiringManager, incomplete }: {
  application: Application;
  job?: Job;
  isHiringManager: boolean;
  incomplete: boolean;
}) {
  const { saveScorecard } = useDemo();
  const saved = isHiringManager ? application.hiringManagerScorecard : application.scorecard;

  const [ratings, setRatings] = useState<Record<string, string>>(() => {
    return Object.fromEntries(Object.entries(saved?.ratings ?? {}).map(([key, value]) => [key, String(value)]));
  });
  const [comments, setComments] = useState(saved?.comments ?? '');
  const [recommendation, setRecommendation] = useState<HiringRecommendation | ''>(
    isHiringManager ? application.hiringManagerScorecard?.recommendation ?? '' : '',
  );
  const [attempted, setAttempted] = useState(incomplete);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  const missing = SCORECARD_CRITERIA.filter((criterion) => !ratings[criterion.id]);
  const missingComments = isHiringManager && !comments.trim();
  const missingRecommendation = isHiringManager && !recommendation;
  const hasError = missing.length > 0 || missingComments || missingRecommendation;

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    setAttempted(true);
    setSavedMessage(null);
    if (hasError) return;
    saveScorecard(
      application.id,
      Object.fromEntries(Object.entries(ratings).map(([key, value]) => [key, Number(value)])),
      comments.trim(),
      isHiringManager && recommendation ? recommendation : undefined,
    );
    setSavedMessage('Scorecard saved. The application status is unchanged.');
  };

  return (
    <ApplicantHeader application={application} job={job} active="scorecard" hiringManagerName={isHiringManager ? SCORECARD_DEMO_MANAGER : undefined}>
      <div style={{ maxWidth: 820 }}>
        <p style={{ margin: '0 0 6px', fontSize: 14.5, color: tokens.textSecondary }}>
          Rate each criterion from 1 to 5. Saving a scorecard does not change the application status.
        </p>
        <p style={{ margin: '0 0 18px', fontSize: 12.5, color: tokens.textMuted }}>
          Criteria and the 1–5 scale are illustrative for this prototype; the approved scorecard rubric is
          still open.
        </p>

        {savedMessage ? (
          <div style={{ marginBottom: 18 }}>
            <Callout variant="success" role="status" title="Scorecard saved">
              {savedMessage}{' '}
              {!isHiringManager && <RouterLink to={`/screens/SCR-17?application=${application.id}`}>Back to the applicant</RouterLink>}
            </Callout>
          </div>
        ) : null}

        {attempted && hasError ? (
          <div style={{ marginBottom: 18 }}>
            <Callout variant="error" role="alert" title={isHiringManager ? 'Complete the required fields' : `Rate ${missing.length} more ${missing.length === 1 ? 'criterion' : 'criteria'}`}>
              <ul style={{ margin: '4px 0 0', paddingLeft: 18 }}>
                {missing.map((criterion) => (
                  <li key={criterion.id}>{criterion.label}</li>
                ))}
                {missingComments && <li>Enter supporting comments.</li>}
                {missingRecommendation && <li>Choose one recommendation.</li>}
              </ul>
            </Callout>
          </div>
        ) : null}

        <form noValidate onSubmit={submit}>
          {isHiringManager && (
            <div style={{ display: 'grid', gap: 14, marginBottom: 18 }}>
              <Field
                id="scorecard-recommendation"
                label="Recommendation"
                select
                required
                value={recommendation}
                onChange={(event) => setRecommendation(event.target.value as HiringRecommendation)}
                error={attempted && missingRecommendation}
                helperText={attempted && missingRecommendation ? 'Choose one recommendation.' : 'Choose one recommendation for this applicant.'}
              >
                {HIRING_RECOMMENDATIONS.map((option) => <MenuItem key={option} value={option}>{option}</MenuItem>)}
              </Field>
              <Field
                id="scorecard-comments"
                label="Supporting comments"
                required
                multiline
                minRows={2}
                value={comments}
                onChange={(event) => setComments(event.target.value)}
                error={attempted && missingComments}
                helperText={attempted && missingComments ? 'Enter supporting comments.' : 'Explain the ratings and recommendation.'}
              />
            </div>
          )}
          <div style={{ display: 'grid', gap: 14 }}>
            {SCORECARD_CRITERIA.map((criterion) => (
              <Surface key={criterion.id} padding="16px 18px">
                <fieldset
                  style={{ border: 'none', margin: 0, padding: 0 }}
                  aria-describedby={`${criterion.id}-hint`}
                >
                  <legend style={{ fontSize: 14.5, fontWeight: 600, padding: 0 }}>{criterion.label}</legend>
                  <p id={`${criterion.id}-hint`} style={{ margin: '4px 0 10px', fontSize: 12.5, color: tokens.textMuted }}>
                    {criterion.hint}
                  </p>
                  <RadioGroup
                    row
                    name={`rating-${criterion.id}`}
                    value={ratings[criterion.id] ?? ''}
                    onChange={(event) =>
                      setRatings({ ...ratings, [criterion.id]: event.target.value })
                    }
                    sx={{ gap: '2px 10px' }}
                  >
                    {SCALE.map((option) => (
                      <FormControlLabel
                        key={option.value}
                        value={option.value}
                        control={<Radio size="small" />}
                        label={
                          <span style={{ fontSize: 13.5 }}>
                            <strong className="tabular">{option.value}</strong> {option.label}
                          </span>
                        }
                        sx={{ marginRight: 0 }}
                      />
                    ))}
                  </RadioGroup>
                  {attempted && !ratings[criterion.id] ? (
                    <p role="alert" style={{ margin: '6px 0 0', fontSize: 13, color: tokens.danger }}>
                      Choose a rating for this criterion.
                    </p>
                  ) : null}
                </fieldset>
              </Surface>
            ))}
          </div>

          {!isHiringManager && <div style={{ marginTop: 18 }}>
            <Field
              id="scorecard-comments"
              label="Supporting comments (optional)"
              multiline
              minRows={3}
              value={comments}
              onChange={(event) => setComments(event.target.value)}
              helperText="Examples and context that explain the ratings."
            />
          </div>}

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginTop: 20,
              paddingTop: 18,
              borderTop: `1px solid ${tokens.border}`,
            }}
          >
            <Button type="submit" variant="contained">
              Save scorecard
            </Button>
            <span style={{ fontSize: 12.5, color: tokens.textMuted }}>
              {saved
                ? `Last saved ${formatDate(saved.savedAt)}`
                : 'Not saved yet'}
            </span>
          </div>
        </form>
      </div>
    </ApplicantHeader>
  );
}
