import type { Application, DemoUser, Job, MagicLink, Rubric } from './types';

/** Fixed clock for the demo: magic-link ageing and "today" are reproducible. */
export const FIXED_NOW = '2025-11-20T09:00:00.000Z';

export const CURRENT_USER = { name: 'Maya Chen', role: 'Recruiter' as const };
export const SCORECARD_DEMO_MANAGER = 'Marco Silva';
export function canDemoManagerReview(application: Application, job?: Job) {
  return application.status === 'Shortlisted' && Boolean(job?.hiringManagers.includes(SCORECARD_DEMO_MANAGER));
}

export const jobs: Job[] = [
  {
    id: 'JOB-UIX',
    title: 'UI/UX Designer',
    department: 'Design',
    employmentType: 'Full-time',
    location: 'Remote — UTC±3',
    description:
      'Design end-to-end flows for the hiring workspace, from first sketch to shipped interface. You will pair with engineers and recruiters to keep the product legible under real workload.',
    responsibilities: [
      'Own interaction and visual design for one product area',
      'Run usability sessions with recruiters and candidates',
      'Maintain the shared component library with engineering',
    ],
    requirements: [
      '3+ years designing product interfaces',
      'Portfolio with shipped, measurable work',
      'Working knowledge of accessibility (WCAG 2.2 AA)',
    ],
    status: 'Published',
    publicPath: '/jobs/ui-ux-designer',
    updatedAt: '2025-11-18',
    hiringManagers: ['Lena Fischer'],
  },
  {
    id: 'JOB-BE',
    title: 'Software Engineer (Backend)',
    department: 'Engineering',
    employmentType: 'Full-time',
    location: 'Hybrid — Berlin',
    description:
      'Build the services behind applications, CV processing and status tracking. The team runs a modular monolith on FastAPI and PostgreSQL.',
    responsibilities: [
      'Design and ship backend modules with tests',
      'Own data migrations and background processing',
      'Review code and pair with frontend engineers',
    ],
    requirements: [
      '4+ years with Python and relational databases',
      'Experience with async job processing',
      'Comfortable owning production incidents',
    ],
    status: 'Published',
    publicPath: '/jobs/software-engineer-backend',
    updatedAt: '2025-11-17',
    hiringManagers: ['Marco Silva'],
  },
  {
    id: 'JOB-FE',
    title: 'Software Engineer (Frontend)',
    department: 'Engineering',
    employmentType: 'Full-time',
    location: 'Remote — EU time zones',
    description:
      'Build and maintain responsive interfaces for candidates and recruiters. You will collaborate with design and backend teams on a React and TypeScript product.',
    responsibilities: [
      'Ship accessible React interfaces used daily by recruiters',
      'Work with design on component quality and states',
      'Keep the frontend build fast and the bundle small',
    ],
    requirements: [
      '3+ years building production React applications',
      'Strong TypeScript and CSS fundamentals',
      'Experience with automated accessibility checks',
    ],
    status: 'Published',
    publicPath: '/jobs/software-engineer-frontend',
    updatedAt: '2025-11-16',
    hiringManagers: ['Marco Silva'],
  },
  {
    id: 'JOB-PD',
    title: 'Product Designer',
    department: 'Design',
    employmentType: 'Full-time',
    location: 'Hybrid — Lisbon',
    description:
      'Shape the review workspace recruiters use every day. This posting is still a draft in the demo so the publish prerequisites can be reviewed.',
    responsibilities: ['Own one product area end to end', 'Pair with engineering on component quality'],
    requirements: ['3+ years designing product interfaces', 'Portfolio with shipped work'],
    status: 'Draft',
    publicPath: '/jobs/product-designer',
    updatedAt: '2025-11-19',
    hiringManagers: [],
  },
  {
    id: 'JOB-PMM',
    title: 'Product Marketing Manager',
    department: 'Marketing',
    employmentType: 'Contract',
    location: 'Remote — US time zones',
    description:
      'Position miniTA for mid-sized hiring teams. The role is closed for this demo so the empty inbox state can be reviewed.',
    responsibilities: ['Own launch messaging', 'Run customer interviews'],
    requirements: ['5+ years in B2B product marketing'],
    status: 'Closed',
    publicPath: '/jobs/product-marketing-manager',
    updatedAt: '2025-10-30',
    hiringManagers: [],
  },
];

export const rubrics: Rubric[] = [
  {
    id: 'RUB-FE',
    jobId: 'JOB-FE',
    origin: 'manual',
    approvalState: 'Approved',
    approvedAt: '2025-11-16',
    approvedBy: 'Maya Chen',
    minYears: '3',
    experienceNotes: '3+ years shipping React and TypeScript in production; component ownership.',
    requiredSkills: ['TypeScript', 'React', 'CSS'],
    preferredSkills: ['Design systems', 'Accessibility', 'Testing'],
    questions: [
      { id: 'Q-FE-1', prompt: 'Why are you interested in this role?', scoringNotes: '' },
      {
        id: 'Q-FE-2',
        prompt: 'Describe a project you are proud of.',
        scoringNotes: 'Look for scope, decisions and measurable outcome.',
      },
      {
        id: 'Q-FE-3',
        prompt: 'What makes you a strong fit?',
        scoringNotes: '',
      },
    ],
    weights: {
      'Required skills': 30,
      'Preferred skills': 20,
      Experience: 40,
      'Screening responses': 10,
    },
  },
  {
    id: 'RUB-UIX',
    jobId: 'JOB-UIX',
    origin: 'manual',
    approvalState: 'Approved',
    approvedAt: '2025-11-18',
    approvedBy: 'Maya Chen',
    minYears: '3',
    experienceNotes: 'Product design experience with shipped work and usability research.',
    requiredSkills: ['UX Research', 'Design Systems', 'Figma'],
    preferredSkills: ['Accessibility', 'Prototyping'],
    questions: [
      {
        id: 'Q-UIX-1',
        prompt: 'Walk us through a design decision you changed after user research.',
        scoringNotes: '',
      },
      { id: 'Q-UIX-2', prompt: 'How do you document accessibility in handoff?', scoringNotes: '' },
    ],
    weights: {
      'Required skills': 35,
      'Preferred skills': 15,
      Experience: 40,
      'Screening responses': 10,
    },
  },
  {
    id: 'RUB-BE',
    jobId: 'JOB-BE',
    origin: 'ai-draft',
    approvalState: 'Approved',
    approvedAt: '2025-11-17',
    approvedBy: 'Maya Chen',
    minYears: '4',
    experienceNotes: 'Backend services with relational data and async processing.',
    requiredSkills: ['Python', 'PostgreSQL', 'API design'],
    preferredSkills: ['FastAPI', 'Observability'],
    questions: [
      { id: 'Q-BE-1', prompt: 'Describe a production incident you owned.', scoringNotes: '' },
      { id: 'Q-BE-2', prompt: 'How do you decide what to test?', scoringNotes: '' },
    ],
    weights: {
      'Required skills': 30,
      'Preferred skills': 15,
      Experience: 45,
      'Screening responses': 10,
    },
  },
];

const aishaEvidence = [
  {
    quote: 'Led usability study across checkout funnel; task success +18%.',
    criterion: 'UX Research',
  },
  {
    quote: 'Built scalable design system components; UI build time −30%.',
    criterion: 'Design Systems',
  },
];

export const applications: Application[] = [
  {
    id: 'APP-1041',
    jobId: 'JOB-UIX',
    candidateName: 'Aisha Rahman',
    email: 'aisha.rahman@example.com',
    phone: '+44 7700 900 412',
    status: 'Under Review',
    appliedOn: '2025-11-16',
    statusUpdatedOn: '2025-11-18',
    matchScore: 86,
    matchState: 'scored',
    evidence: aishaEvidence,
    missing: ['Service Design', 'Metrics & Experimentation'],
    answers: [
      {
        question: 'Walk us through a design decision you changed after user research.',
        answer:
          'Our checkout study showed people abandoned at address entry, so we replaced the three-step form with a single reviewable page and re-tested it.',
      },
      {
        question: 'How do you document accessibility in handoff?',
        answer: 'Every component ships with focus order, keyboard notes and contrast values in the spec.',
      },
    ],
    cvFileName: 'aisha-rahman-cv.pdf',
    notes: [
      {
        id: 'NOTE-1',
        author: 'Maya Chen',
        createdAt: '2025-11-17',
        body: 'Phone screen: strong research background. Next step is a portfolio review.',
      },
    ],
    scorecard: null,
  },
  {
    id: 'APP-1042',
    jobId: 'JOB-BE',
    candidateName: 'Jordan Lee',
    email: 'jordan.lee@example.com',
    phone: '+1 555 013 2048',
    status: 'Under Review',
    appliedOn: '2025-11-14',
    statusUpdatedOn: '2025-11-18',
    matchScore: 72,
    matchState: 'scored',
    evidence: [
      {
        quote: 'Cut p95 latency on the billing API from 840 ms to 210 ms.',
        criterion: 'API design',
      },
      {
        quote: 'Migrated 40 million rows with zero downtime using batched backfills.',
        criterion: 'PostgreSQL',
      },
    ],
    missing: ['FastAPI', 'Observability'],
    answers: [
      {
        question: 'Describe a production incident you owned.',
        answer: 'A queue backlog blocked application processing; I added idempotent retries and a lag alert.',
      },
      {
        question: 'How do you decide what to test?',
        answer: 'I test boundaries and failure paths first, then the business rules that would cost most to get wrong.',
      },
    ],
    cvFileName: 'jordan-lee-cv.pdf',
    notes: [],
    scorecard: null,
  },
  {
    id: 'APP-1043',
    jobId: 'JOB-FE',
    candidateName: 'Minh Tran',
    email: 'minh.tran@example.com',
    phone: '+84 90 123 4567',
    status: 'Applied',
    appliedOn: '2025-11-12',
    statusUpdatedOn: '2025-11-12',
    matchScore: 91,
    matchState: 'scored',
    evidence: [
      { quote: 'Rebuilt the design system in TypeScript with 94% test coverage.', criterion: 'TypeScript' },
      { quote: 'Cut interaction latency by profiling React renders.', criterion: 'React' },
    ],
    missing: ['Testing'],
    answers: [
      {
        question: 'Why are you interested in this role?',
        answer: 'The product is used by people all day, so interface quality matters more than novelty.',
      },
      {
        question: 'Describe a project you are proud of.',
        answer: 'A design system migration across 120 screens with no visual regressions.',
      },
      {
        question: 'What makes you a strong fit?',
        answer: 'I combine frontend performance work with accessibility testing.',
      },
    ],
    cvFileName: 'minh-tran-cv.pdf',
    notes: [],
    scorecard: null,
  },
  {
    id: 'APP-1044',
    jobId: 'JOB-BE',
    candidateName: 'Sam Rivera',
    email: 'sam.rivera@example.com',
    phone: '+34 600 112 233',
    status: 'Rejected',
    appliedOn: '2025-11-09',
    statusUpdatedOn: '2025-11-11',
    matchScore: 48,
    matchState: 'scored',
    evidence: [{ quote: 'Built internal reporting tools in Python.', criterion: 'Python' }],
    missing: ['PostgreSQL', 'API design'],
    answers: [
      {
        question: 'Describe a production incident you owned.',
        answer: 'I coordinated a rollback for a failed reporting deployment.',
      },
      {
        question: 'How do you decide what to test?',
        answer: 'Coverage targets per module.',
      },
    ],
    cvFileName: 'sam-rivera-cv.pdf',
    notes: [
      {
        id: 'NOTE-2',
        author: 'Maya Chen',
        createdAt: '2025-11-11',
        body: 'Not enough backend depth for this level. Keep for the analyst pipeline.',
      },
    ],
    scorecard: null,
  },
  {
    id: 'APP-1045',
    jobId: 'JOB-UIX',
    candidateName: 'Priya Nair',
    email: 'priya.nair@example.com',
    phone: '+91 98200 11223',
    status: 'Applied',
    appliedOn: '2025-11-08',
    statusUpdatedOn: '2025-11-08',
    matchScore: null,
    matchState: 'extraction-failed',
    evidence: [],
    missing: [],
    answers: [
      {
        question: 'Walk us through a design decision you changed after user research.',
        answer: 'I redesigned onboarding after five interviews showed people missed the import step.',
      },
      {
        question: 'How do you document accessibility in handoff?',
        answer: 'I attach keyboard flows and contrast checks to each component.',
      },
    ],
    cvFileName: 'priya-nair-cv-scan.pdf',
    notes: [],
    scorecard: null,
  },
  {
    id: 'APP-1046',
    jobId: 'JOB-FE',
    candidateName: 'Daniel Okafor',
    email: 'daniel.okafor@example.com',
    phone: '+49 176 555 2211',
    status: 'Shortlisted',
    appliedOn: '2025-11-05',
    statusUpdatedOn: '2025-11-10',
    matchScore: 64,
    matchState: 'scored',
    evidence: [
      { quote: 'Introduced visual regression testing for the component library.', criterion: 'Testing' },
    ],
    missing: ['TypeScript', 'React'],
    answers: [
      {
        question: 'Why are you interested in this role?',
        answer: 'I want to work on a product where accessibility is a requirement, not a cleanup task.',
      },
      {
        question: 'Describe a project you are proud of.',
        answer: 'A form builder that non-technical staff could operate without support tickets.',
      },
      {
        question: 'What makes you a strong fit?',
        answer: 'Frontend testing and design collaboration.',
      },
    ],
    cvFileName: 'daniel-okafor-cv.pdf',
    notes: [],
    scorecard: null,
  },
];

const frontendRubric = rubrics.find((rubric) => rubric.jobId === 'JOB-FE')!;

/** Illustrative AI proposal. It is generated from the JD text only; nothing here
 *  is approved until a recruiter reviews and approves it. */
export const aiDraftForFrontend: Rubric = {
  ...structuredClone(frontendRubric),
  origin: 'ai-draft',
  approvalState: 'Draft',
  approvedAt: null,
  approvedBy: null,
  minYears: '3',
  experienceNotes: 'Three or more years building React and TypeScript interfaces in production.',
  requiredSkills: ['TypeScript', 'React', 'CSS Grid'],
  preferredSkills: ['Testing Library', 'Storybook'],
  questions: [
    {
      id: 'Q-AI-1',
      prompt: 'Which interface you shipped are you proudest of, and why?',
      scoringNotes: 'Look for the decision, the trade-off and the measured outcome.',
    },
    {
      id: 'Q-AI-2',
      prompt: 'How do you test a component before handing it to a recruiter?',
      scoringNotes: '',
    },
    {
      id: 'Q-AI-3',
      prompt: 'Describe an accessibility bug you fixed.',
      scoringNotes: '',
    },
  ],
  weights: {
    'Required skills': 25,
    'Preferred skills': 15,
    Experience: 45,
    'Screening responses': 15,
  },
};

export const users: DemoUser[] = [
  { name: 'Maya Chen', email: 'maya.chen@example.com', role: 'Recruiter' },
  { name: 'Lena Fischer', email: 'lena.fischer@example.com', role: 'Hiring Manager' },
  { name: 'Marco Silva', email: 'marco.silva@example.com', role: 'Hiring Manager' },
];

/** 72-hour links around the fixed clock (2025-11-20T09:00Z). */
export const magicLinks: MagicLink[] = [
  {
    applicationId: 'APP-1042',
    token: 'ml_3f9c2a71b8',
    issuedAt: '2025-11-19T10:00:00.000Z',
    expiresAt: '2025-11-22T10:00:00.000Z',
  },
  {
    applicationId: 'APP-1041',
    token: 'ml_7d21e4c9aa',
    issuedAt: '2025-11-15T09:00:00.000Z',
    expiresAt: '2025-11-18T09:00:00.000Z',
  },
];

export function magicLinkState(
  link: MagicLink,
  now: string = FIXED_NOW,
): 'valid' | 'expired' {
  return new Date(link.expiresAt).getTime() > new Date(now).getTime() ? 'valid' : 'expired';
}

export const candidateFixture = {
  name: 'Linh Pham',
  email: 'linh.pham@example.com',
  phone: '+84 91 220 3344',
};

export const activeStatuses = ['Applied', 'Under Review', 'Shortlisted'] as const;

export function rubricForJob(rubricList: Rubric[], jobId: string): Rubric | undefined {
  return rubricList.find((rubric) => rubric.jobId === jobId);
}

export function jobFor(jobList: Job[], jobId: string): Job | undefined {
  return jobList.find((job) => job.id === jobId);
}

export function totalWeight(rubric: Rubric): number {
  return Math.round(
    Object.values(rubric.weights).reduce((sum, value) => sum + (Number.isFinite(value) ? value : 0), 0) * 100,
  ) / 100;
}
