#!/usr/bin/env node
/**
 * Capture the standard screenshot set from the running prototype.
 *
 *   npm run shoot                      # all manifest screens marked "ready"
 *   npm run shoot -- --screen SCR-04   # one screen (repeatable / comma separated)
 *   npm run shoot -- --group candidate-mobile
 *
 * The script starts `vite preview` itself unless --url is given. Every capture
 * waits for fonts and layout, disables motion and records browser, viewport,
 * route and scenario in redesigned/docs/screenshot-run.json.
 */
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const manifest = JSON.parse(await fs.readFile(path.join(appRoot, 'screen-manifest.json'), 'utf8'));
const imagesRoot = path.resolve(appRoot, manifest.imagesRoot);

const VIEWPORTS = {
  'hr-desktop': { width: 1280, height: 800, deviceScaleFactor: 1 },
  'candidate-desktop': { width: 1280, height: 800, deviceScaleFactor: 1 },
  'candidate-mobile': { width: 390, height: 844, deviceScaleFactor: 2 },
};

const args = process.argv.slice(2);
const getArg = (name) => {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : undefined;
};

const evidenceMode = args.includes('--evidence');
const evidenceTargets = [
  { route: '/screens/SCR-01?state=loading', file: 'SCR-01_login-loading.png', group: 'hr-desktop' },
  { route: '/screens/SCR-04?state=empty', file: 'SCR-04_applicant-inbox-empty.png', group: 'hr-desktop' },
  { route: '/screens/SCR-05?state=validation', file: 'SCR-05_job-form-error.png', group: 'hr-desktop' },
  { route: '/screens/SCR-06?state=empty', file: 'SCR-06_job-list-empty.png', group: 'hr-desktop' },
  { route: '/screens/SCR-07?state=draft', file: 'SCR-07_job-detail-draft.png', group: 'hr-desktop' },
  { route: '/screens/SCR-07?state=closed', file: 'SCR-07_job-detail-closed.png', group: 'hr-desktop' },
  { route: '/screens/SCR-10?state=unavailable', file: 'SCR-10_ai-unavailable.png', group: 'hr-desktop' },
  { route: '/screens/SCR-10?state=invalid', file: 'SCR-10_ai-invalid-response.png', group: 'hr-desktop' },
  { route: '/screens/SCR-12?state=duplicate', file: 'SCR-12_application-duplicate.png', group: 'candidate-desktop' },
  { route: '/screens/SCR-12?state=duplicate', file: 'SCR-12_application-duplicate-mobile.png', group: 'candidate-mobile' },
  { route: '/screens/SCR-15?state=expired', file: 'SCR-15_status-expired.png', group: 'candidate-desktop' },
  { route: '/screens/SCR-16?state=invalid', file: 'SCR-16_link-invalid.png', group: 'candidate-desktop' },
  { route: '/screens/SCR-16?state=expired', file: 'SCR-16_link-expired-mobile.png', group: 'candidate-mobile' },
  { route: '/screens/SCR-17?state=extraction-failed', file: 'SCR-17_extraction-failed.png', group: 'hr-desktop' },
  { route: '/screens/SCR-19?state=incomplete', file: 'SCR-19_scorecard-error.png', group: 'hr-desktop' },
  { route: '/screens/SCR-19?state=hiring-manager', file: 'SCR-19_hiring-manager-scorecard.png', group: 'hr-desktop' },
  { route: '/screens/SCR-20?state=confirmed', file: 'SCR-20_status-confirmed.png', group: 'hr-desktop' },
  { route: '/screens/SCR-21?state=empty', file: 'SCR-21_dashboard-empty.png', group: 'hr-desktop' },
  { route: '/screens/SCR-21?state=error', file: 'SCR-21_dashboard-error.png', group: 'hr-desktop' },
  { route: '/screens/SCR-22?state=closed', file: 'SCR-22_public-job-closed.png', group: 'candidate-desktop' },
];

const screenFilter = getArg('--screen')
  ?.split(',')
  .map((value) => value.trim())
  .filter(Boolean);
const groupFilter = getArg('--group');
const externalUrl = getArg('--url');

if (screenFilter) {
  for (const screenId of screenFilter) {
    if (!manifest.screens.some((screen) => screen.screenId === screenId)) {
      console.error(`Unknown screen ID: ${screenId}`);
      process.exit(1);
    }
  }
}

const targets = evidenceMode
  ? evidenceTargets
      .filter((target) => !groupFilter || target.group === groupFilter)
      .filter((target) => !screenFilter || screenFilter.includes(target.file.split('_')[0]))
      .map((target) => ({ screen: { route: target.route, screenId: target.file.split('_')[0] }, group: target.group, evidence: target }))
  : manifest.screens
      .filter((screen) => screen.status === 'ready')
      .filter((screen) => !screenFilter || screenFilter.includes(screen.screenId))
      .flatMap((screen) =>
        screen.groups
          .filter((group) => !groupFilter || group === groupFilter)
          .filter((group) => screen.sources[group])
          .map((group) => ({ screen, group })),
      );

if (targets.length === 0) {
  console.error('No screens matched the filters.');
  process.exit(1);
}

async function waitForServer(url, timeoutMs = 30000) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {
      /* not up yet */
    }
    await new Promise((resolve) => setTimeout(resolve, 300));
  }
  throw new Error(`Preview server did not answer at ${url}`);
}

let server;
let baseUrl = externalUrl;
if (!baseUrl) {
  if (!existsSync(path.join(appRoot, 'dist', 'index.html'))) {
    console.error('dist/index.html is missing. Run `npm run build` first.');
    process.exit(1);
  }
  server = spawn(
    process.execPath,
    [path.join(appRoot, 'node_modules', 'vite', 'bin', 'vite.js'), 'preview', '--port', '4173', '--strictPort'],
    { cwd: appRoot, stdio: 'ignore' },
  );
  baseUrl = 'http://localhost:4173';
  await waitForServer(baseUrl);
}

async function launchBrowser() {
  try {
    return await chromium.launch();
  } catch {
    const channel = process.env.PLAYWRIGHT_CHANNEL || 'chrome';
    console.warn(`Bundled Chromium unavailable; using installed channel "${channel}".`);
    return await chromium.launch({ channel });
  }
}

const browser = await launchBrowser();
const browserVersion = browser.version();
const runAt = new Date().toISOString();
const log = [];

try {
  for (const { screen, group, evidence } of targets) {
    const viewport = VIEWPORTS[group];
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      deviceScaleFactor: viewport.deviceScaleFactor,
      reducedMotion: 'reduce',
      colorScheme: 'light',
      locale: 'en-GB',
      timezoneId: 'UTC',
    });
    const page = await context.newPage();

    const route = evidence
      ? `${evidence.route}${evidence.route.includes('?') ? '&' : '?'}shot=1`
      : `${screen.route}?shot=1`;
    await page.goto(`${baseUrl}${route}`, { waitUntil: 'networkidle' });
    await page.waitForSelector('html[data-app-ready="true"]');
    await page.evaluate(async () => {
      await document.fonts.ready;
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    });
    await page.addStyleTag({
      content: '*,*::before,*::after{animation:none!important;transition:none!important}',
    });
    await page.waitForTimeout(120);

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    if (overflow > 1) {
      console.warn(`  ! horizontal overflow of ${overflow}px at ${group}`);
    }

    const outputPath = evidence
      ? path.join(imagesRoot, 'redesigned', 'evidence', evidence.file)
      : path.join(imagesRoot, screen.outputs[group]);
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await page.screenshot({ path: outputPath, fullPage: true });

    const size = await page.evaluate(() => ({
      width: document.documentElement.scrollWidth,
      height: document.documentElement.scrollHeight,
    }));

    log.push({
      screenId: evidence ? evidence.file.split('_')[0] : screen.screenId,
      name: evidence ? evidence.file : screen.name,
      group,
      route,
      scenario: evidence ? (evidence.route.split('state=')[1] ?? 'default') : screen.defaultScenario,
      viewport: `${viewport.width}x${viewport.height}`,
      deviceScaleFactor: viewport.deviceScaleFactor,
      output: path.relative(imagesRoot, outputPath).replaceAll('\\', '/'),
      pixelWidth: size.width * viewport.deviceScaleFactor,
      pixelHeight: size.height * viewport.deviceScaleFactor,
      browser: `Chromium ${browserVersion}`,
      capturedAt: runAt,
      horizontalOverflowPx: Math.max(0, overflow),
    });

    console.log(`  ${screen.screenId} ${group.padEnd(18)} -> ${path.basename(outputPath)} (${size.width}x${size.height})`);
    await context.close();
  }
} finally {
  await browser.close();
  if (server) server.kill();
}

const logDir = path.join(imagesRoot, 'redesigned', 'docs');
await fs.mkdir(logDir, { recursive: true });
const logPath = path.join(logDir, evidenceMode ? 'evidence-run.json' : 'screenshot-run.json');
const previous = (screenFilter || groupFilter) && existsSync(logPath)
  ? JSON.parse(await fs.readFile(logPath, 'utf8')).screenshots
  : [];
const screenshots = [...new Map([...previous, ...log].map((shot) => [shot.output, shot])).values()];
await fs.writeFile(
  logPath,
  `${JSON.stringify(
    {
      generatedAt: runAt,
      baseUrl,
      browser: `Chromium ${browserVersion}`,
      manifestVersion: manifest.version,
      fixedClock: manifest.fixedClock,
      total: screenshots.length,
      screenshots,
    },
    null,
    2,
  )}\n`,
);

console.log(
  `
Captured ${log.length} screenshots. Log: redesigned/docs/${
    evidenceMode ? 'evidence-run.json' : 'screenshot-run.json'
  }`,
);
