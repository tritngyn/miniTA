import { useMemo, useState } from 'react';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import { HrShell } from '../../components/AppShell';
import { PageHeader } from '../../components/PageHeader';
import { Section } from '../../components/PageHeader';
import { Field } from '../../components/FormField';
import { Callout } from '../../components/Callout';
import { formatDate, useDemo } from '../../data/store';
import { FIXED_NOW } from '../../data/fixtures';
import { CRITERION_GROUPS, type CriterionGroup, type Rubric } from '../../data/types';
import { tokens } from '../../theme';

type WeightForm = Record<CriterionGroup, string>;

const emptyWeightError = 'Enter a positive percentage.';
const totalError = 'Weights must total exactly 100%.';

function toWeightForm(rubric: Rubric): WeightForm {
  return {
    'Required skills': String(rubric.weights['Required skills']),
    'Preferred skills': String(rubric.weights['Preferred skills']),
    Experience: String(rubric.weights.Experience),
    'Screening responses': String(rubric.weights['Screening responses']),
  };
}

interface RubricBuilderProps {
  forceState?: 'error';
  initialRubric?: Rubric;
  aiReview?: boolean;
  idPrefix?: string;
  heading?: string;
}

export function RubricBuilder({ forceState, initialRubric, aiReview = false, idPrefix, heading }: RubricBuilderProps = {}) {
  const { jobs, getRubric, saveRubricDraft, approveRubric } = useDemo();
  const [searchParams] = useSearchParams();
  const initialError = forceState === 'error' || searchParams.get('state') === 'error';
  const aiDraft = aiReview || searchParams.get('origin') === 'ai-draft';
  const fieldPrefix: string = idPrefix ?? (forceState === 'error' ? 'scr09' : aiReview ? 'scr11' : 'scr08');

  const jobId = searchParams.get('job') ?? initialRubric?.jobId ?? 'JOB-FE';
  const job = jobs.find((item) => item.id === jobId) ?? jobs[0];

  const blankRubric: Rubric = {
    id: `RUB-${job.id}`,
    jobId: job.id,
    origin: 'manual',
    approvalState: 'Draft',
    approvedAt: null,
    approvedBy: null,
    minYears: '',
    experienceNotes: '',
    requiredSkills: [],
    preferredSkills: [],
    questions: [{ id: 'Q-NEW-1', prompt: '', scoringNotes: '' }],
    weights: {
      'Required skills': 30,
      'Preferred skills': 20,
      Experience: 40,
      'Screening responses': 10,
    },
  };

  const rubric = initialRubric ?? getRubric(job.id) ?? blankRubric;

  const [requiredSkills, setRequiredSkills] = useState<string[]>(rubric.requiredSkills);
  const [preferredSkills, setPreferredSkills] = useState<string[]>(rubric.preferredSkills);
  const [skillDraft, setSkillDraft] = useState({ required: '', preferred: '' });
  const [minYears, setMinYears] = useState(rubric.minYears);
  const [experienceNotes, setExperienceNotes] = useState(rubric.experienceNotes);
  const [questions, setQuestions] = useState(rubric.questions);
  const [weights, setWeights] = useState<WeightForm>(() => {
    const base = toWeightForm(rubric);
    return initialError ? { ...base, 'Screening responses': '0' } : base;
  });

  const [attempted, setAttempted] = useState(initialError);
  const [approvalState, setApprovalState] = useState<Rubric['approvalState']>(
    initialError ? 'Draft' : rubric.approvalState,
  );
  const [approvedAt, setApprovedAt] = useState<string | null>(
    initialError ? null : rubric.approvedAt,
  );
  const [editedApproved, setEditedApproved] = useState(false);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  const markEdited = () => {
    setSavedMessage(null);
    if (approvalState === 'Approved') setEditedApproved(true);
  };

  const weightNumbers = useMemo(() => {
    const parsed = {} as Record<CriterionGroup, number>;
    CRITERION_GROUPS.forEach((group) => {
      parsed[group] = Number.parseFloat(weights[group]);
    });
    return parsed;
  }, [weights]);

  const total = useMemo(
    () =>
      Math.round(
        CRITERION_GROUPS.reduce((sum, group) => sum + (Number.isFinite(weightNumbers[group]) ? weightNumbers[group] : 0), 0) * 100,
      ) / 100,
    [weightNumbers],
  );

  const weightErrors = useMemo(() => {
    const errors: Record<CriterionGroup, string | undefined> = {
      'Required skills': undefined,
      'Preferred skills': undefined,
      Experience: undefined,
      'Screening responses': undefined,
    };
    CRITERION_GROUPS.forEach((group) => {
      const value = weightNumbers[group];
      if (!Number.isFinite(value) || value <= 0) {
        errors[group] = emptyWeightError;
      } else if (value > 100) {
        errors[group] = 'A single weight cannot exceed 100%.';
      }
    });
    return errors;
  }, [weightNumbers]);

  const skillsError = requiredSkills.length === 0 ? 'Add at least one required skill.' : undefined;
  const questionErrors = questions.map((question) =>
    question.prompt.trim() ? undefined : 'Enter the screening question.',
  );
  const hasQuestionError = questionErrors.some(Boolean);
  const hasWeightError = CRITERION_GROUPS.some((group) => weightErrors[group]) || total !== 100;
  const weightsValid = !hasWeightError;
  const weightsMessage = weightsValid
    ? 'Weights valid'
    : CRITERION_GROUPS.some((group) => weightErrors[group])
      ? 'Each weight must be a positive number.'
      : `Total must equal 100% (currently ${total}%).`;

  const errorCount = [
    Boolean(skillsError),
    hasQuestionError,
    hasWeightError,
  ].filter(Boolean).length;

  const buildRubric = (approvalState: Rubric['approvalState']): Rubric => ({
    ...rubric,
    origin: aiDraft ? 'ai-draft' : rubric.origin,
    approvalState,
    requiredSkills,
    preferredSkills,
    minYears,
    experienceNotes,
    questions,
    weights: {
      'Required skills': weightNumbers['Required skills'],
      'Preferred skills': weightNumbers['Preferred skills'],
      Experience: weightNumbers.Experience,
      'Screening responses': weightNumbers['Screening responses'],
    },
  });

  const handleSaveDraft = () => {
    saveRubricDraft(buildRubric('Draft'));
    setApprovalState('Draft');
    setApprovedAt(null);
    setEditedApproved(false);
    setSavedMessage('Draft saved. It cannot be used for matching until a recruiter approves it.');
  };

  const handleApprove = () => {
    setAttempted(true);
    if (errorCount > 0) return;
    approveRubric(buildRubric('Approved'));
    setApprovalState('Approved');
    setApprovedAt(new Date(FIXED_NOW).toISOString().slice(0, 10));
    setEditedApproved(false);
    setSavedMessage('Rubric approved. New applications will be scored against these criteria.');
  };

  const addSkill = (group: 'required' | 'preferred') => {
    const value = skillDraft[group].trim();
    if (!value) return;
    if (group === 'required') {
      if (!requiredSkills.includes(value)) setRequiredSkills([...requiredSkills, value]);
    } else if (!preferredSkills.includes(value)) {
      setPreferredSkills([...preferredSkills, value]);
    }
    setSkillDraft({ ...skillDraft, [group]: '' });
    markEdited();
  };

  const removeSkill = (group: 'required' | 'preferred', skill: string) => {
    if (group === 'required') setRequiredSkills(requiredSkills.filter((item) => item !== skill));
    else setPreferredSkills(preferredSkills.filter((item) => item !== skill));
    markEdited();
  };

  const updateQuestion = (index: number, patch: Partial<(typeof questions)[number]>) => {
    setQuestions(questions.map((question, position) => (position === index ? { ...question, ...patch } : question)));
    markEdited();
  };

  const updateWeight = (group: CriterionGroup, value: string) => {
    setWeights({ ...weights, [group]: value });
    markEdited();
  };

  const statusLabel = editedApproved
    ? 'Changes require re-approval'
    : approvalState === 'Approved'
      ? 'Approved'
      : 'Draft';

  const skillGroups: { key: 'required' | 'preferred'; title: string; description: string; values: string[] }[] = [
    {
      key: 'required',
      title: 'Required skills',
      description: 'Every candidate is scored on these. Missing skills reduce the matching score.',
      values: requiredSkills,
    },
    {
      key: 'preferred',
      title: 'Preferred skills',
      description: 'Bonus evidence. Missing skills are listed but weigh less.',
      values: preferredSkills,
    },
  ];

  return (
    <HrShell breadcrumb={<span>Job postings / {job.title} / Evaluation rubric</span>}>
      <PageHeader
        title={heading ?? 'Evaluation rubric'}
        description="Criteria and weights used to score candidates for this job. Weights must be positive and total 100% before approval."
        meta={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: tokens.textSecondary }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '3px 9px',
                borderRadius: 999,
                background: editedApproved
                  ? tokens.warnSoft
                  : approvalState === 'Approved'
                    ? tokens.successSoft
                    : tokens.neutralSoft,
                color: editedApproved
                  ? tokens.warn
                  : approvalState === 'Approved'
                    ? tokens.success
                    : tokens.neutralInk,
                fontWeight: 600,
                fontSize: 12.5,
              }}
            >
              {statusLabel}
            </span>
            <span>
              {approvalState === 'Approved' && approvedAt
                ? `${formatDate(approvedAt)} · ${rubric.approvedBy ?? 'Maya Chen'}`
                : 'Not used for matching until approved'}
            </span>
          </div>
        }
        actions={
          <Button
            variant="outlined"
            startIcon={<AutoAwesomeOutlinedIcon />}
            component={RouterLink}
            to={`/screens/SCR-10?job=${job.id}`}
          >
            Draft with AI assistant
          </Button>
        }
      />

      {aiDraft ? (
        <div style={{ marginBottom: 20, maxWidth: 780 }}>
          <Callout variant="warning" title="AI draft — not used for matching until you approve it">
            Review every field and edit the weights before approving. The assistant received only the job
            description.
          </Callout>
        </div>
      ) : null}

      {editedApproved ? (
        <div style={{ marginBottom: 20, maxWidth: 780 }}>
          <Callout variant="warning" title="This rubric is approved">
            Saving changes resets it to Draft; candidates are not scored until you approve it again.
          </Callout>
        </div>
      ) : null}

      {savedMessage ? (
        <div style={{ marginBottom: 20, maxWidth: 780 }}>
          <Callout variant="success" role="status">
            {savedMessage}
          </Callout>
        </div>
      ) : null}

      {attempted && errorCount > 0 ? (
        <div style={{ marginBottom: 20, maxWidth: 780 }}>
          <Callout variant="error" role="alert" title={`Fix ${errorCount} ${errorCount === 1 ? 'issue' : 'issues'} before approving`}>
            <ul style={{ margin: '4px 0 0', paddingLeft: 18 }}>
              {skillsError ? <li>{skillsError}</li> : null}
              {hasWeightError ? <li>{hasWeightError ? `Weights total ${total}%; they must total exactly 100% with positive values.` : ''}</li> : null}
              {hasQuestionError ? <li>Every screening question needs a prompt.</li> : null}
            </ul>
          </Callout>
        </div>
      ) : null}

      <Box component="form" noValidate sx={{ maxWidth: 780 }} onSubmit={(event) => event.preventDefault()}>
        {skillGroups.map((group) => (
          <Section key={group.key} title={group.title} description={group.description} id={`rubric-${group.key}`}>
            {group.values.length > 0 ? (
              <ul
                aria-label={`${group.title} list`}
                style={{ listStyle: 'none', display: 'flex', flexWrap: 'wrap', gap: 8, margin: '0 0 14px', padding: 0 }}
              >
                {group.values.map((skill) => (
                  <li key={skill}>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                        padding: '4px 4px 4px 10px',
                        borderRadius: 999,
                        background: tokens.surface,
                        border: `1px solid ${tokens.border}`,
                        fontSize: 13.5,
                      }}
                    >
                      {skill}
                      <IconButton
                        size="small"
                        aria-label={`Remove ${skill}`}
                        onClick={() => removeSkill(group.key, skill)}
                        sx={{ padding: '2px' }}
                      >
                        <CloseIcon sx={{ fontSize: 15 }} />
                      </IconButton>
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ margin: '0 0 12px', fontSize: 14, color: tokens.textMuted }}>No skills added yet.</p>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 10, alignItems: 'start' }}>
              <Field
                id={`${fieldPrefix}-${group.key}-skill`}
                label={`Add a ${group.key} skill`}
                placeholder={group.key === 'required' ? 'e.g. TypeScript' : 'e.g. Design systems'}
                value={skillDraft[group.key]}
                onChange={(event) => setSkillDraft({ ...skillDraft, [group.key]: event.target.value })}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    addSkill(group.key);
                  }
                }}
                error={attempted && group.key === 'required' && Boolean(skillsError)}
                helperText={attempted && group.key === 'required' ? skillsError : 'Press Enter to add.'}
              />
              <Button
                variant="outlined"
                onClick={() => addSkill(group.key)}
                startIcon={<AddIcon />}
                sx={{ marginTop: '24px' }}
              >
                Add
              </Button>
            </div>
          </Section>
        ))}

        <Section title="Experience criteria" id="rubric-experience">
          <div style={{ display: 'grid', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: 16 }}>
              <Field
                id={`${fieldPrefix}-rubric-min-years`}
                label="Minimum years"
                type="number"
                inputProps={{ min: 0, step: 1 }}
                value={minYears}
                onChange={(event) => {
                  setMinYears(event.target.value);
                  markEdited();
                }}
                helperText="Optional."
              />
              <Field
                id={`${fieldPrefix}-rubric-experience-notes`}
                label="Relevant experience"
                value={experienceNotes}
                onChange={(event) => {
                  setExperienceNotes(event.target.value);
                  markEdited();
                }}
                helperText="One sentence; used as a matching criterion."
              />
            </div>
          </div>
        </Section>

        <Section
          title="Scoring weights"
          description="Each group is a percentage of the matching score. Positive values, total exactly 100%."
          id="rubric-weights"
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {CRITERION_GROUPS.map((group) => (
              <Field
                key={group}
                id={`${fieldPrefix}-weight-${group.replace(/\s+/g, '-').toLowerCase()}`}
                label={group}
                type="number"
                value={weights[group]}
                onChange={(event) => updateWeight(group, event.target.value)}
                error={attempted && Boolean(weightErrors[group])}
                helperText={attempted ? weightErrors[group] : undefined}
                InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }}
                inputProps={{ min: 1, max: 100, step: 1 }}
              />
            ))}
          </div>

          <div
            role="status"
            aria-live="polite"
            style={{
              marginTop: 14,
              padding: '10px 12px',
              borderRadius: 8,
              border: `1px solid color-mix(in srgb, ${
                weightsValid ? tokens.success : tokens.danger
              } 28%, white)`,
              background: weightsValid ? tokens.successSoft : tokens.dangerSoft,
              color: weightsValid ? tokens.success : tokens.danger,
              fontSize: 14,
              display: 'flex',
              justifyContent: 'space-between',
              gap: 12,
            }}
          >
            <span>
              Total weight: <strong className="tabular">{total}%</strong>
            </span>
            <span>{weightsMessage}</span>
          </div>
        </Section>

        <Section
          title="Screening questions"
          description="Answered by every candidate. The Screening responses weight scores the answers."
          id="rubric-questions"
        >
          <div style={{ display: 'grid', gap: 12 }}>
            {questions.map((question, index) => (
              <Box
                key={question.id}
                sx={{
                  background: tokens.surface,
                  border: `1px solid ${tokens.border}`,
                  borderRadius: '10px',
                  padding: '14px 16px 16px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 10,
                  }}
                >
                  <span style={{ fontSize: 13.5, fontWeight: 600, color: tokens.textSecondary }}>
                    Question {index + 1}
                  </span>
                  <IconButton
                    size="small"
                    aria-label={`Remove question ${index + 1}`}
                    onClick={() => {
                      setQuestions(questions.filter((_, position) => position !== index));
                      markEdited();
                    }}
                  >
                    <CloseIcon sx={{ fontSize: 17 }} />
                  </IconButton>
                </div>
                <div style={{ display: 'grid', gap: 12 }}>
                  <Field
                    id={`${fieldPrefix}-question-${index}`}
                    label="Screening question"
                    required
                    multiline
                    minRows={2}
                    value={question.prompt}
                    onChange={(event) => updateQuestion(index, { prompt: event.target.value })}
                    error={attempted && Boolean(questionErrors[index])}
                    helperText={attempted ? questionErrors[index] : 'Candidate answers are stored with the application.'}
                  />
                  <Field
                    id={`${fieldPrefix}-question-notes-${index}`}
                    label="Scoring notes (optional)"
                    value={question.scoringNotes}
                    onChange={(event) => updateQuestion(index, { scoringNotes: event.target.value })}
                    helperText="Visible to recruiters only."
                  />
                </div>
              </Box>
            ))}
          </div>

          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            sx={{ marginTop: '12px' }}
            onClick={() => {
              setQuestions([
                ...questions,
                { id: `Q-NEW-${questions.length + 1}`, prompt: '', scoringNotes: '' },
              ]);
              markEdited();
            }}
          >
            Add question
          </Button>
        </Section>

        <div
          style={{
            display: 'flex',
            gap: 10,
            marginTop: 28,
            paddingTop: 20,
            borderTop: `1px solid ${tokens.border}`,
          }}
        >
          <Button
            variant="contained"
            onClick={handleApprove}
            disabled={approvalState === 'Approved' && !editedApproved}
          >
            Approve rubric
          </Button>
          <Button variant="outlined" onClick={handleSaveDraft}>
            Save draft
          </Button>
          <Button
            variant="text"
            component={RouterLink}
            to={`/screens/SCR-07?job=${job.id}`}
            sx={{ color: tokens.textSecondary }}
          >
            Cancel
          </Button>
        </div>

        <p style={{ margin: '10px 2px 0', fontSize: 12.5, color: tokens.textMuted }}>
          {approvalState === 'Approved' && !editedApproved
            ? 'This rubric is already approved. Edit a field to start a new approval.'
            : 'Approving validates every field and stores the rubric; weights alone do not make the rubric valid.'}
        </p>
      </Box>
    </HrShell>
  );
}
