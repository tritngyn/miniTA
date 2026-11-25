import raw from '../screen-manifest.json';

export type GroupKey = 'hr-desktop' | 'candidate-desktop' | 'candidate-mobile';

export interface ManifestScreen {
  screenId: string;
  name: string;
  useCases: string[];
  groups: GroupKey[];
  route: string;
  defaultScenario: string;
  scenarios: string[];
  sources: Partial<Record<GroupKey, string>>;
  outputs: Partial<Record<GroupKey, string>>;
  status: 'ready' | 'planned';
  openIssues: string[];
  audit: string;
}

interface ManifestFile {
  version: number;
  fixedClock: string;
  imagesRoot: string;
  notes: string;
  screens: ManifestScreen[];
}

export const manifest = raw as unknown as ManifestFile;

export const screenById = new Map(manifest.screens.map((screen) => [screen.screenId, screen]));

export const groupLabels: Record<string, string> = {
  'hr-desktop': 'HR workspace — desktop 1280 × 800',
  'candidate-desktop': 'Candidate — desktop 1280 × 800',
  'candidate-mobile': 'Candidate — mobile 390 × 844 (DPR 2)',
};
