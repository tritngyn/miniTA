export type JobStatus = 'Draft' | 'Published' | 'Closed';

export type ApplicationStatus = 'Applied' | 'Under Review' | 'Shortlisted' | 'Hired' | 'Rejected';

export type CriterionGroup = 'Required skills' | 'Preferred skills' | 'Experience' | 'Screening responses';

export interface Job {
  id: string;
  title: string;
  department: string;
  employmentType: string;
  location: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  status: JobStatus;
  publicPath: string;
  updatedAt: string;
  hiringManagers: string[];
}

export interface ScreeningQuestion {
  id: string;
  prompt: string;
  scoringNotes: string;
}

export interface Rubric {
  id: string;
  jobId: string;
  origin: 'manual' | 'ai-draft';
  approvalState: 'Draft' | 'Approved';
  approvedAt: string | null;
  approvedBy: string | null;
  minYears: string;
  experienceNotes: string;
  requiredSkills: string[];
  preferredSkills: string[];
  questions: ScreeningQuestion[];
  weights: Record<CriterionGroup, number>;
}

export interface Evidence {
  quote: string;
  criterion: string;
}

export type MatchState = 'scored' | 'extraction-failed';

export interface MagicLink {
  applicationId: string;
  token: string;
  issuedAt: string;
  expiresAt: string;
}

export interface DemoUser {
  name: string;
  email: string;
  role: 'Recruiter' | 'Hiring Manager';
}

export const HIRING_RECOMMENDATIONS = ['Recommend Hire', 'Do Not Hire', 'Need Discussion'] as const;
export type HiringRecommendation = (typeof HIRING_RECOMMENDATIONS)[number];

export interface Application {
  id: string;
  jobId: string;
  candidateName: string;
  email: string;
  phone: string;
  status: ApplicationStatus;
  appliedOn: string;
  statusUpdatedOn: string;
  matchScore: number | null;
  matchState: MatchState;
  evidence: Evidence[];
  missing: string[];
  answers: { question: string; answer: string }[];
  cvFileName: string | null;
  notes: { id: string; author: string; createdAt: string; body: string }[];
  scorecard: { savedAt: string; ratings: Record<string, number>; comments: string } | null;
  hiringManagerScorecard?: NonNullable<Application['scorecard']> & { recommendation: HiringRecommendation };
}

export const CRITERION_GROUPS: CriterionGroup[] = [
  'Required skills',
  'Preferred skills',
  'Experience',
  'Screening responses',
];
