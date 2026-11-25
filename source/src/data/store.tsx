import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import {
  CURRENT_USER,
  FIXED_NOW,
  activeStatuses,
  canDemoManagerReview,
  applications as seedApplications,
  jobs as seedJobs,
  magicLinks as seedMagicLinks,
  rubrics as seedRubrics,
} from './fixtures';
import { HIRING_RECOMMENDATIONS, type Application, type ApplicationStatus, type HiringRecommendation, type Job, type MagicLink, type Rubric } from './types';

interface SubmitInput {
  jobId: string;
  candidateName: string;
  email: string;
  phone: string;
  answers: { question: string; answer: string }[];
  cvFileName: string;
  consent: boolean;
}

type SubmitResult =
  | { ok: true; application: Application }
  | { ok: false; code: 'duplicate' | 'missing-consent'; message: string };

interface DemoState {
  jobs: Job[];
  applications: Application[];
  rubrics: Rubric[];
  magicLinks: MagicLink[];
}

interface JobInput {
  title: string;
  department: string;
  employmentType: string;
  location: string;
  description: string;
  hiringManagers: string[];
}

interface DemoContextValue extends DemoState {
  currentUser: typeof CURRENT_USER;
  reset: () => void;
  getJob: (jobId: string) => Job | undefined;
  getRubric: (jobId: string) => Rubric | undefined;
  saveRubricDraft: (rubric: Rubric) => void;
  approveRubric: (rubric: Rubric) => void;
  submitApplication: (input: SubmitInput) => SubmitResult;
  getApplication: (applicationId: string) => Application | undefined;
  createJob: (input: JobInput) => Job;
  updateJob: (jobId: string, input: JobInput) => void;
  publishJob: (jobId: string) => { ok: true } | { ok: false; code: 'missing-rubric' };
  closeJob: (jobId: string) => void;
  requestReplacementLink: (email: string) => { ok: true };
  updateStatus: (applicationId: string, status: ApplicationStatus) => void;
  addNote: (applicationId: string, body: string) => void;
  saveScorecard: (applicationId: string, ratings: Record<string, number>, comments: string, recommendation?: HiringRecommendation) => void;
}

const seed = (): DemoState => ({
  jobs: structuredClone(seedJobs),
  applications: structuredClone(seedApplications),
  rubrics: structuredClone(seedRubrics),
  magicLinks: structuredClone(seedMagicLinks),
});

const DemoContext = createContext<DemoContextValue | null>(null);

const today = FIXED_NOW.slice(0, 10);

export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DemoState>(seed);

  const reset = useCallback(() => setState(seed()), []);

  const getJob = useCallback((jobId: string) => state.jobs.find((job) => job.id === jobId), [state.jobs]);

  const getRubric = useCallback(
    (jobId: string) => state.rubrics.find((rubric) => rubric.jobId === jobId),
    [state.rubrics],
  );

  const saveRubricDraft = useCallback((rubric: Rubric) => {
    setState((current) => ({
      ...current,
      rubrics: current.rubrics.some((item) => item.id === rubric.id)
        ? current.rubrics.map((item) => (item.id === rubric.id ? rubric : item))
        : [...current.rubrics, rubric],
    }));
  }, []);

  const approveRubric = useCallback((rubric: Rubric) => {
    const approved: Rubric = {
      ...rubric,
      approvalState: 'Approved',
      approvedAt: today,
      approvedBy: CURRENT_USER.name,
    };
    setState((current) => ({
      ...current,
      rubrics: [
        ...current.rubrics.filter((item) => item.jobId !== approved.jobId),
        approved,
      ],
    }));
  }, []);

  const submitApplication = useCallback(
    (input: SubmitInput): SubmitResult => {
      const hasActive = state.applications.some(
        (application) =>
          application.jobId === input.jobId &&
          application.email.trim().toLowerCase() === input.email.trim().toLowerCase() &&
          (activeStatuses as readonly string[]).includes(application.status),
      );
      if (!input.consent) {
        return {
          ok: false,
          code: 'missing-consent',
          message: 'Confirm the privacy consent before submitting.',
        };
      }
      if (hasActive) {
        return {
          ok: false,
          code: 'duplicate',
          message: 'This email already has an active application for this job.',
        };
      }
      const application: Application = {
        id: `APP-${1047 + state.applications.length}`,
        jobId: input.jobId,
        candidateName: input.candidateName,
        email: input.email,
        phone: input.phone,
        status: 'Applied',
        appliedOn: today,
        statusUpdatedOn: today,
        matchScore: null,
        matchState: 'extraction-failed',
        evidence: [],
        missing: [],
        answers: input.answers,
        cvFileName: input.cvFileName,
        notes: [],
        scorecard: null,
      };
      setState((current) => ({ ...current, applications: [application, ...current.applications] }));
      return { ok: true, application };
    },
    [state.applications],
  );

  const updateStatus = useCallback((applicationId: string, status: ApplicationStatus) => {
    setState((current) => ({
      ...current,
      applications: current.applications.map((application) =>
        application.id === applicationId ? { ...application, status } : application,
      ),
    }));
  }, []);

  const getApplication = useCallback(
    (applicationId: string) => state.applications.find((application) => application.id === applicationId),
    [state.applications],
  );

  const createJob = useCallback(
    (input: JobInput): Job => {
      const job: Job = {
        id: `JOB-${100 + state.jobs.length + 1}`,
        ...input,
        responsibilities: [],
        requirements: [],
        status: 'Draft',
        publicPath: `/jobs/${input.title.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
        updatedAt: FIXED_NOW.slice(0, 10),
      };
      setState((current) => ({ ...current, jobs: [job, ...current.jobs] }));
      return job;
    },
    [state.jobs.length],
  );

  const updateJob = useCallback((jobId: string, input: JobInput) => {
    setState((current) => ({
      ...current,
      jobs: current.jobs.map((job) =>
        job.id === jobId ? { ...job, ...input, updatedAt: FIXED_NOW.slice(0, 10) } : job,
      ),
    }));
  }, []);

  const publishJob = useCallback(
    (jobId: string): { ok: true } | { ok: false; code: 'missing-rubric' } => {
      const approvedRubric = state.rubrics.find(
        (rubric) => rubric.jobId === jobId && rubric.approvalState === 'Approved',
      );
      if (!approvedRubric) return { ok: false, code: 'missing-rubric' };
      setState((current) => ({
        ...current,
        jobs: current.jobs.map((job) =>
          job.id === jobId ? { ...job, status: 'Published', updatedAt: FIXED_NOW.slice(0, 10) } : job,
        ),
      }));
      return { ok: true };
    },
    [state.rubrics],
  );

  const closeJob = useCallback((jobId: string) => {
    setState((current) => ({
      ...current,
      jobs: current.jobs.map((job) =>
        job.id === jobId ? { ...job, status: 'Closed', updatedAt: FIXED_NOW.slice(0, 10) } : job,
      ),
    }));
  }, []);

  const requestReplacementLink = useCallback((email: string): { ok: true } => {
    const normalised = email.trim().toLowerCase();
    setState((current) => {
      const application = current.applications.find(
        (item) =>
          item.email.toLowerCase() === normalised &&
          (activeStatuses as readonly string[]).includes(item.status),
      );
      if (!application) return current;
      const issuedAt = FIXED_NOW;
      const expiresAt = new Date(new Date(FIXED_NOW).getTime() + 72 * 60 * 60 * 1000).toISOString();
      const token = `ml_${Math.abs(hashString(`${application.id}${issuedAt}`)).toString(36).slice(0, 10)}`;
      return {
        ...current,
        magicLinks: [
          ...current.magicLinks.filter((link) => link.applicationId !== application.id),
          { applicationId: application.id, token, issuedAt, expiresAt },
        ],
      };
    });
    // Never reveal whether the email matched an application.
    return { ok: true };
  }, []);

  const addNote = useCallback((applicationId: string, body: string) => {
    setState((current) => ({
      ...current,
      applications: current.applications.map((application) =>
        application.id === applicationId
          ? {
              ...application,
              notes: [
                {
                  id: `NOTE-${application.notes.length + 10}`,
                  author: CURRENT_USER.name,
                  createdAt: today,
                  body,
                },
                ...application.notes,
              ],
            }
          : application,
      ),
    }));
  }, []);

  const saveScorecard = useCallback(
    (applicationId: string, ratings: Record<string, number>, comments: string, recommendation?: HiringRecommendation) => {
      setState((current) => ({
        ...current,
        applications: current.applications.map((application) => {
          if (application.id !== applicationId) return application;
          const scorecard = { savedAt: FIXED_NOW, ratings, comments };
          if (recommendation === undefined) return { ...application, scorecard };
          const job = current.jobs.find((item) => item.id === application.jobId);
          if (!canDemoManagerReview(application, job) || !comments.trim() || !HIRING_RECOMMENDATIONS.includes(recommendation)) return application;
          return { ...application, hiringManagerScorecard: { ...scorecard, recommendation } };
        }),
      }));
    },
    [],
  );

  const value = useMemo<DemoContextValue>(
    () => ({
      ...state,
      currentUser: CURRENT_USER,
      reset,
      getJob,
      getRubric,
      saveRubricDraft,
      approveRubric,
      submitApplication,
      getApplication,
      createJob,
      updateJob,
      publishJob,
      closeJob,
      requestReplacementLink,
      updateStatus,
      addNote,
      saveScorecard,
    }),
    [
      state,
      reset,
      getJob,
      getRubric,
      saveRubricDraft,
      approveRubric,
      submitApplication,
      getApplication,
      createJob,
      updateJob,
      publishJob,
      closeJob,
      requestReplacementLink,
      updateStatus,
      addNote,
      saveScorecard,
    ],
  );

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo(): DemoContextValue {
  const context = useContext(DemoContext);
  if (!context) {
    throw new Error('useDemo must be used inside DemoProvider');
  }
  return context;
}

/** Deterministic display date, e.g. "2025-11-16" -> "16 Nov 2025". */
export function formatDate(iso: string): string {
  const date = new Date(`${iso.slice(0, 10)}T00:00:00Z`);
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

export function formatShortDate(iso: string): string {
  const date = new Date(`${iso.slice(0, 10)}T00:00:00Z`);
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    timeZone: 'UTC',
  }).format(date);
}

function hashString(value: string): number {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) | 0;
  }
  return hash;
}
