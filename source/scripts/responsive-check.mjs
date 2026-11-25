#!/usr/bin/env node
/**
 * Responsive sweep for the theme refresh: every business route at the sizes
 * required by the plan, plus auth and candidate widths. Checks horizontal
 * overflow, that the shell/header is present, and that primary controls are
 * not clipped. Axe/contrast details live in scripts/a11y-check.mjs.
 *
 * Output: miniTA-screen-images/redesigned/docs/responsive-run.json
 */
import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const imagesRoot = path.resolve(appRoot, '..', 'miniTA-screen-images');
const baseUrl = 'http://localhost:4173';

const HR_ROUTES = [
  ['SCR-04', '/screens/SCR-04'], ['SCR-05', '/screens/SCR-05'], ['SCR-06', '/screens/SCR-06'],
  ['SCR-07', '/screens/SCR-07'], ['SCR-08', '/screens/SCR-08'], ['SCR-09', '/screens/SCR-09'],
  ['SCR-10', '/screens/SCR-10'], ['SCR-11', '/screens/SCR-11'], ['SCR-17', '/screens/SCR-17'],
  ['SCR-18', '/screens/SCR-18'], ['SCR-19', '/screens/SCR-19'], ['SCR-20', '/screens/SCR-20'],
  ['SCR-21', '/screens/SCR-21'],
];
const AUTH_ROUTES = [
  ['SCR-01', '/screens/SCR-01'], ['SCR-02', '/screens/SCR-02'], ['SCR-03', '/screens/SCR-03'],
];
const CANDIDATE_ROUTES = [
  ['SCR-12', '/screens/SCR-12'], ['SCR-13', '/screens/SCR-13'], ['SCR-14', '/screens/SCR-14'],
  ['SCR-15', '/screens/SCR-15'], ['SCR-16', '/screens/SCR-16'], ['SCR-22', '/screens/SCR-22'],
];

const CASES = [
  ...HR_ROUTES.flatMap(([id, route]) => [1280, 1024].map((width) => ({ id, route, width, height: 800, dpr: 1 }))),
  ...AUTH_ROUTES.flatMap(([id, route]) => [1280, 1024, 390, 360].map((width) => ({ id, route, width, height: width < 500 ? 844 : 800, dpr: width < 500 ? 2 : 1 }))),
  ...CANDIDATE_ROUTES.flatMap(([id, route]) => [1280, 1024, 390, 360].map((width) => ({ id, route, width, height: width < 500 ? 844 : 800, dpr: width < 500 ? 2 : 1 }))),
];

const server = spawn(
  process.execPath,
  [path.join(appRoot, 'node_modules', 'vite', 'bin', 'vite.js'), 'preview', '--port', '4173', '--strictPort'],
  { cwd: appRoot, stdio: 'ignore' },
);
const startedAt = Date.now();
for (;;) {
  try {
    const response = await fetch(baseUrl);
    if (response.ok) break;
  } catch {
    /* wait */
  }
  if (Date.now() - startedAt > 30000) throw new Error('Preview server did not start');
  await new Promise((resolve) => setTimeout(resolve, 250));
}

const browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL || 'chrome' });
const results = [];
try {
  for (const testCase of CASES) {
    const context = await browser.newContext({
      viewport: { width: testCase.width, height: testCase.height },
      deviceScaleFactor: testCase.dpr,
      reducedMotion: 'reduce',
    });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', (error) => errors.push(String(error)));
    await page.goto(`${baseUrl}${testCase.route}`, { waitUntil: 'networkidle' });
    await page.waitForSelector('html[data-app-ready="true"]');

    const metrics = await page.evaluate(() => {
      const overflow = document.documentElement.scrollWidth - document.documentElement.clientWidth;
      const controls = [...document.querySelectorAll('button, a')].filter((element) => {
        const style = getComputedStyle(element);
        return style.display !== 'none' && style.visibility !== 'hidden' && element.offsetParent !== null;
      });
      const outside = controls.filter((element) => {
        const box = element.getBoundingClientRect();
        return box.width > 0 && (box.right > window.innerWidth + 1 || box.left < -1);
      });
      return {
        overflow,
        clippedControls: outside.length,
        shell: Boolean(document.querySelector('aside, header.site-header, .home-hero')),
      };
    });

    const pass = metrics.overflow <= 1 && metrics.clippedControls === 0 && metrics.shell && errors.length === 0;
    results.push({ ...testCase, ...metrics, consoleErrors: errors.length, pass });
    if (!pass) {
      console.log(
        `FAIL ${testCase.id} ${testCase.width}px: overflow ${metrics.overflow}, clipped ${metrics.clippedControls}, shell ${metrics.shell}, errors ${errors.length}`,
      );
    }
    await context.close();
  }
} finally {
  await browser.close();
  server.kill();
}

const failures = results.filter((result) => !result.pass);
const logDir = path.join(imagesRoot, 'redesigned', 'docs');
await fs.mkdir(logDir, { recursive: true });
await fs.writeFile(
  path.join(logDir, 'responsive-run.json'),
  `${JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      browser: `Chromium ${browser.version()} (${channelLabel()})`,
      note: 'Chrome responsive sweep; axe/contrast/keyboard evidence is in a11y-run.json.',
      total: results.length,
      passed: results.length - failures.length,
      failed: failures.length,
      results,
    },
    null,
    2,
  )}\n`,
);

function channelLabel() {
  return process.env.PLAYWRIGHT_CHANNEL || 'chrome';
}

console.log(`${results.length - failures.length}/${results.length} responsive checks passed.`);
if (failures.length > 0) process.exit(1);
