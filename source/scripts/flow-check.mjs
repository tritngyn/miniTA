#!/usr/bin/env node
/**
 * Functional checks for the P2 flows. Each case starts from a fresh page load, so the
 * in-memory fixture is reset and the result is reproducible.
 *
 * Output: miniTA-screen-images/redesigned/docs/flow-run.json
 */
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { magicLinkState } from '../src/data/fixtures.ts';

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const manifest = JSON.parse(await fs.readFile(path.join(appRoot, 'screen-manifest.json'), 'utf8'));
const imagesRoot = path.resolve(appRoot, manifest.imagesRoot);
const baseUrl = 'http://localhost:4173';

const results = [];
function record(name, ok, detail = '') {
  results.push({ name, ok, detail });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`);
}

async function check(name, fn) {
  try {
    await fn();
    record(name, true);
  } catch (error) {
    record(name, false, String(error).split('\n')[0].slice(0, 220));
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

// 72-hour boundary is pure fixture logic and can be checked without a browser.
const link = { applicationId: 'test', token: 't', issuedAt: '2025-11-19T10:00:00.000Z', expiresAt: '2025-11-22T10:00:00.000Z' };
await check('magic link: valid 1ms before 72h, expired exactly at 72h', async () => {
  assert(magicLinkState(link, '2025-11-22T09:59:59.999Z') === 'valid', 'expected valid just before expiry');
  assert(magicLinkState(link, '2025-11-22T10:00:00.000Z') === 'expired', 'expected expired at the boundary');
  assert(magicLinkState(link, '2025-11-22T10:00:00.001Z') === 'expired', 'expected expired after the boundary');
});

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
const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await context.newPage();
const consoleErrors = [];
page.on('pageerror', (error) => consoleErrors.push(String(error)));
page.on('console', (message) => {
  if (message.type() === 'error' && !message.text().includes('404')) consoleErrors.push(message.text());
});

async function open(route) {
  await page.goto(`${baseUrl}${route}`, { waitUntil: 'networkidle' });
  await page.waitForSelector('html[data-app-ready="true"]');
}

async function fillByLabel(label, value) {
  await page.getByLabel(label, { exact: false }).first().fill(value);
}

/** Client-side navigation that keeps the in-memory demo store. */
async function spaGo(route) {
  await page.evaluate((target) => {
    window.history.pushState({}, '', target);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }, route);
  await page.waitForTimeout(200);
}

try {
  await check('login: empty submit shows field errors', async () => {
    await open('/screens/SCR-01');
    await page.getByRole('button', { name: 'Sign in', exact: true }).click();
    await page.getByText('Enter your work email address.').waitFor();
    await page.getByText('Enter your password.').waitFor();
  });

  await check('login: unknown account reaches the error screen', async () => {
    await open('/screens/SCR-01');
    await fillByLabel('Work email', 'nobody@example.com');
    await fillByLabel('Password', 'secret-demo');
    await page.getByRole('button', { name: 'Sign in', exact: true }).click();
    await page.waitForURL('**/screens/SCR-02');
    await page.getByText('Email or password is incorrect').waitFor();
  });

  await check('login: known account reaches the job list', async () => {
    await open('/screens/SCR-02');
    await fillByLabel('Work email', 'maya.chen@example.com');
    await fillByLabel('Password', 'secret-demo');
    await page.getByRole('button', { name: 'Sign in', exact: true }).click();
    await page.waitForURL('**/screens/SCR-06');
  });

  await check('login: loading state disables the submit button', async () => {
    await open('/screens/SCR-01?state=loading');
    const button = page.getByRole('button', { name: 'Signing in…' });
    assert(await button.isDisabled(), 'expected the button to be disabled while signing in');
    assert((await page.locator('form[aria-busy="true"]').count()) === 1, 'expected aria-busy on the form');
  });

  await check('access denied: sign out returns to login', async () => {
    await open('/screens/SCR-03');
    await page.getByText('Your account does not have access').waitFor();
    await page.getByRole('link', { name: 'Sign out' }).click();
    await page.waitForURL('**/screens/SCR-01');
  });

  await check('job form: validation blocks saving, then saves', async () => {
    await open('/screens/SCR-05?state=validation');
    await page.getByText('Fix 2 fields before saving').waitFor();
    await page.locator('#job-title').fill('Staff Frontend Engineer');
    await page.locator('#job-description-input').fill('Own the recruiter workspace frontend and its design system.');
    await page.getByRole('button', { name: 'Save changes' }).click();
    await page.getByText('Changes saved. The published posting is updated.').waitFor();
  });

  await check('job form: creating a draft navigates to the new posting', async () => {
    await open('/screens/SCR-05?state=new');
    await page.locator('#job-title').fill('Data Analyst');
    await page.locator('#job-description-input').fill('Build reporting for the hiring team.');
    await page.getByRole('button', { name: 'Save draft' }).click();
    await page.waitForURL(/\/screens\/SCR-07\?job=JOB-/);
    await page.getByRole('heading', { name: 'Data Analyst' }).waitFor();
  });

  await check('job list: empty state offers a way out', async () => {
    await open('/screens/SCR-06?state=empty');
    await page.getByText('No job postings match these filters').waitFor();
    await page.getByRole('button', { name: 'Clear filters' }).click();
    assert((await page.locator('tbody tr').count()) > 0, 'expected jobs after clearing filters');
  });

  await check('job detail: publishing a draft without a rubric is blocked', async () => {
    await open('/screens/SCR-07?state=draft');
    await page.getByText('Available after publishing').waitFor();
    await page.getByRole('button', { name: 'Publish job' }).click();
    await page.getByText('Publishing needs exactly one approved evaluation rubric').waitFor();
  });

  await check('job detail: create rubric, approve, publish, public link appears', async () => {
    await open('/screens/SCR-07?state=draft');
    await page.getByRole('link', { name: 'Create rubric' }).click();
    await page.waitForURL(/SCR-08\?job=JOB-PD/);
    await fillByLabel('Add a required skill', 'Figma');
    await page.keyboard.press('Enter');
    await page.locator('#scr08-question-0').fill('Describe a product you designed end to end.');
    await page.getByRole('button', { name: 'Approve rubric' }).click();
    await page.getByText('Rubric approved').waitFor();
    await page.getByRole('link', { name: 'Cancel' }).click();
    await page.waitForURL(/SCR-07\?job=JOB-PD/);
    await page.getByRole('button', { name: 'Publish job' }).click();
    await page.getByText('Job published. The public application link is active.').waitFor();
    await page.getByText('https://jobs.minita.example/jobs/product-designer').waitFor();
  });

  await check('rubric: zero, negative and missing weights are rejected; 100% is valid', async () => {
    await open('/screens/SCR-08');
    const screening = page.getByLabel('Screening responses').first();
    await screening.fill('0');
    await page.getByText('Each weight must be a positive number.').waitFor();
    await screening.fill('-5');
    await page.getByText('Each weight must be a positive number.').waitFor();
    await screening.fill('');
    await page.getByText('Each weight must be a positive number.').waitFor();
    await screening.fill('10');
    await page.getByText('Weights valid').waitFor();
    await page.getByText('Total weight:').waitFor();
  });

  await check('rubric: approved rubric cannot be re-approved until edited', async () => {
    await open('/screens/SCR-08');
    const approve = page.getByRole('button', { name: 'Approve rubric' });
    assert(await approve.isDisabled(), 'expected Approve to be disabled for an unchanged approved rubric');
    assert(await page.getByLabel('Rubric name').count() === 0, 'expected no separate rubric name');
    await page.getByLabel('Relevant experience').fill('Two years of frontend experience.');
    await page.getByText('This rubric is approved').waitFor();
    assert(await approve.isEnabled(), 'expected Approve after editing');
    await approve.click();
    await page.getByText('Rubric approved').waitFor();
  });

  await check('rubric error screen shows summary and field errors', async () => {
    await open('/screens/SCR-09');
    await page.getByText('Fix 1 issue before approving').waitFor();
    await page.getByText('Enter a positive percentage.').waitFor();
    await page.getByText('Weights total 90%').waitFor();
  });

  await check('AI draft: timeout and invalid response both offer the manual path', async () => {
    await open('/screens/SCR-10?state=unavailable');
    await page.getByText('The assistant did not respond').waitFor();
    await page.getByRole('link', { name: 'Open the manual editor' }).waitFor();
    await open('/screens/SCR-10?state=invalid');
    await page.getByText('The proposal could not be used').waitFor();
  });

  await check('AI draft: generate opens the structured draft review', async () => {
    await open('/screens/SCR-10');
    await page.getByRole('button', { name: 'Generate draft' }).click();
    await page.waitForURL('**/screens/SCR-11**');
    await page.getByText('AI draft — not used for matching until you approve it').waitFor();
    await page.getByText('Weights valid').waitFor();
    await page.getByRole('button', { name: 'Approve rubric' }).click();
    await page.getByText('Rubric approved').waitFor();
  });

  await check('application: missing fields focus the error summary', async () => {
    await open('/screens/SCR-12');
    await page.getByRole('button', { name: 'Submit application' }).click();
    await page.getByText('Fix 2 fields before submitting').waitFor();
    const focusIsSummary = await page.evaluate(() => document.activeElement?.getAttribute('tabindex') === '-1');
    assert(focusIsSummary, 'expected focus to move to the error summary');
  });

  await check('application: invalid file types are rejected', async () => {
    await open('/screens/SCR-12');
    await page.setInputFiles('#scr12-cv-file', {
      name: 'cv.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('not a pdf'),
    });
    await page.getByText('That file is not a PDF').waitFor();
  });

  await check('application: files over 5 MB are rejected', async () => {
    await open('/screens/SCR-12');
    await page.setInputFiles('#scr12-cv-file', {
      name: 'cv.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.alloc(5 * 1024 * 1024 + 1, 1),
    });
    await page.getByText('That file is larger than 5 MB').waitFor();
  });

  await check('application: missing consent blocks submission', async () => {
    await open('/screens/SCR-12');
    await fillByLabel('Full name', 'Linh Pham');
    await fillByLabel('Email address', 'linh.pham@example.com');
    await fillByLabel('Phone number', '+84 91 220 3344');
    const answers = page.locator('textarea[id^="scr12-answer-"]');
    for (let index = 0; index < (await answers.count()); index += 1) {
      await answers.nth(index).fill('A complete answer for the screening question.');
    }
    await page.setInputFiles('#scr12-cv-file', {
      name: 'linh-pham-cv.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('%PDF-1.4 demo'),
    });
    await page.getByRole('button', { name: 'Submit application' }).click();
    await page.getByText('Confirm the privacy consent before submitting.').first().waitFor();
  });

  await check('application: valid submission reaches the confirmation', async () => {
    await open('/screens/SCR-12');
    await fillByLabel('Full name', 'Linh Pham');
    await fillByLabel('Email address', 'linh.pham@example.com');
    await fillByLabel('Phone number', '+84 91 220 3344');
    const answers = page.locator('textarea[id^="scr12-answer-"]');
    for (let index = 0; index < (await answers.count()); index += 1) {
      await answers.nth(index).fill('A complete answer for the screening question.');
    }
    await page.setInputFiles('#scr12-cv-file', {
      name: 'linh-pham-cv.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('%PDF-1.4 demo'),
    });
    await page.getByRole('checkbox').check();
    await page.getByRole('button', { name: 'Submit application' }).click();
    await page.waitForURL('**/screens/SCR-14');
    await page.getByRole('heading', { name: 'Application received' }).waitFor();
  });

  await check('application: duplicate submission shows the duplicate notice', async () => {
    await open('/screens/SCR-12?state=duplicate');
    await page.getByText('You already applied to this job').waitFor();
    await page.getByRole('button', { name: 'Submit application' }).click();
    await page.getByText('You already applied to this job').waitFor();
  });

  await check('status portal: valid link shows only official data', async () => {
    await open('/screens/SCR-15');
    await page.getByText('Official status').waitFor();
    const body = await page.locator('body').innerText();
    assert(!body.includes('Phone screen: strong research background'), 'internal note leaked');
    assert(!body.includes('Communication & clarity'), 'scorecard criteria leaked');
    assert(!body.includes('matching score'), 'matching score leaked');
  });

  await check('status portal: expired and invalid links are refused', async () => {
    await open('/screens/SCR-15?state=expired');
    await page.getByText('This status link has expired').waitFor();
    await open('/screens/SCR-15?state=invalid');
    await page.getByText('This status link is not valid').waitFor();
  });

  await check('replacement link: unknown and known emails get identical copy', async () => {
    await open('/screens/SCR-16?state=expired');
    await fillByLabel('Email address on your application', 'nobody@example.com');
    await page.getByRole('button', { name: 'Send a new link' }).click();
    const unknown = await page.getByText('If an active application matches').innerText();
    await open('/screens/SCR-16?state=expired');
    await fillByLabel('Email address on your application', 'jordan.lee@example.com');
    await page.getByRole('button', { name: 'Send a new link' }).click();
    const known = await page.getByText('If an active application matches').innerText();
    assert(unknown.includes('If an active application matches'), 'unknown email copy missing');
    assert(known.includes('jordan.lee@example.com'), 'known email copy should echo the submitted address');
    assert(!unknown.includes('jordan'), 'unknown email response must not reveal registrations');
  });

  await check('applicant detail: extraction failure shows no score', async () => {
    await open('/screens/SCR-17?state=extraction-failed');
    await page.getByText('Matching score not available').waitFor();
  });

  await check('notes: adding a note keeps the official status', async () => {
    await open('/screens/SCR-18?application=APP-1042');
    await page.locator('#note-input').fill('Strong systems answer; schedule a pairing session.');
    await page.getByRole('button', { name: 'Add note' }).click();
    await page.getByText('Note saved. The official status is unchanged.').waitFor();
    await page.getByText('Strong systems answer; schedule a pairing session.').waitFor();
    await page.getByText('Under Review').first().waitFor();
  });

  await check('scorecard: incomplete save is blocked, valid save keeps the status', async () => {
    await open('/screens/SCR-19?application=APP-1042');
    await page.getByRole('button', { name: 'Save scorecard' }).click();
    await page.getByText('Rate 4 more criteria').waitFor();
    const groups = page.locator('fieldset:has(input[type="radio"])');
    for (let index = 0; index < (await groups.count()); index += 1) {
      await groups.nth(index).locator('input[value="4"]').check();
    }
    await page.getByLabel('Supporting comments (optional)').fill('Strong backend depth and clear incident ownership.');
    await page.getByRole('button', { name: 'Save scorecard' }).click();
    await page.getByText('Scorecard saved. The application status is unchanged.').waitFor();
    await page.getByText('Under Review').first().waitFor();
  });

  await check('Hiring Manager scorecard requires comments and one recommendation on an assigned shortlisted application', async () => {
    await open('/screens/SCR-19?state=hiring-manager');
    await page.getByRole('heading', { name: 'Daniel Okafor' }).waitFor();
    assert(await page.getByRole('link', { name: 'Update status' }).count() === 0, 'status action exposed');
    const save = page.getByRole('button', { name: 'Save scorecard' });
    for (const group of await page.locator('fieldset:has(input[type="radio"])').all()) {
      await group.locator('input[value="4"]').check();
    }
    const comments = page.getByRole('textbox', { name: /Supporting comments/ });
    await comments.fill('   ');
    await save.click();
    await page.getByText('Enter supporting comments.', { exact: true }).first().waitFor();
    await page.getByText('Choose one recommendation.', { exact: true }).first().waitFor();
    await comments.fill('Discuss the testing evidence in the debrief.');
    await save.click();
    assert(await page.getByText('Scorecard saved', { exact: true }).count() === 0, 'saved with no recommendation');
    await page.getByRole('combobox', { name: /Recommendation/ }).click();
    assert(await page.getByRole('option').count() === 3, 'expected exactly three options');
    await page.getByRole('option', { name: 'Need Discussion' }).click();
    await save.click();
    await page.getByText('Scorecard saved. The application status is unchanged.').waitFor();
    await page.getByText('Shortlisted', { exact: true }).waitFor();
    await spaGo('/screens/SCR-19?state=hiring-manager&application=APP-1042');
    await page.getByText('Scorecard unavailable').waitFor();
    await spaGo('/screens/SCR-19?application=APP-1046');
    assert(await page.getByLabel('Supporting comments (optional)').inputValue() === '', 'Hiring Manager comments appeared in the Recruiter scorecard');
    await spaGo('/screens/SCR-19?state=hiring-manager');
    assert(await comments.inputValue() === 'Discuss the testing evidence in the debrief.', 'Hiring Manager comments did not persist');
    assert(await page.getByRole('combobox', { name: /Recommendation/ }).textContent() === 'Need Discussion', 'recommendation did not persist');
  });

  await check('status update: dialog, Escape returns focus, confirm updates the portal', async () => {
    await open('/screens/SCR-20?application=APP-1042');
    const trigger = page.getByRole('button', { name: 'Update status' }).last();
    const hired = page.getByRole('radio', { name: /Hired/ });
    await hired.check();
    await trigger.click();
    await page.getByRole('dialog').waitFor();
    await page.keyboard.press('Escape');
    await page.getByRole('dialog').waitFor({ state: 'hidden' });
    const focusReturns = await trigger.evaluate((element) => document.activeElement === element);
    assert(focusReturns, 'expected focus to return to the trigger');
    await trigger.click();
    await page.getByRole('button', { name: 'Confirm change' }).click();
    await page.getByText('Status updated to Hired').waitFor();
    await spaGo('/screens/SCR-15?application=APP-1042');
    await page.getByText('Hired — current stage').waitFor();
  });

  await check('dashboard: error retry and empty state', async () => {
    await open('/screens/SCR-21?state=error');
    await page.getByText('Dashboard data could not be loaded').waitFor();
    await page.getByRole('button', { name: 'Retry' }).click();
    await page.getByText('Applications by job and status').waitFor();
    await open('/screens/SCR-21?state=empty');
    await page.getByText('No applications for this job yet').waitFor();
  });

  await check('dashboard: totals match the fixture', async () => {
    await open('/screens/SCR-21');
    const summary = page.locator('dl').first();
    const text = await summary.innerText();
    assert(text.includes('Applications\n6'), `unexpected application total: ${text.replace(/\n/g, ' ')}`);
    await page.getByText('All shown jobs').waitFor();
  });

  await check('candidate pages run at 390px without horizontal overflow', async () => {
    const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
    const mobilePage = await mobile.newPage();
    for (const route of ['/screens/SCR-12', '/screens/SCR-13', '/screens/SCR-14', '/screens/SCR-15', '/screens/SCR-16', '/screens/SCR-22']) {
      await mobilePage.goto(`${baseUrl}${route}`, { waitUntil: 'networkidle' });
      await mobilePage.waitForSelector('html[data-app-ready="true"]');
      const overflow = await mobilePage.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      assert(overflow <= 1, `${route} overflows by ${overflow}px`);
    }
    await mobile.close();
  });

  await check('keyboard: last controls of the application form show focus', async () => {
    await open('/screens/SCR-12');
    for (let index = 0; index < 40; index += 1) {
      await page.keyboard.press('Tab');
      const isSubmit = await page.evaluate(
        () => document.activeElement?.textContent?.trim() === 'Submit application',
      );
      if (isSubmit) break;
    }
    const submitFocus = await page.evaluate(() => {
      const element = document.activeElement;
      if (!element) return null;
      let cursor = element;
      for (let depth = 0; depth < 4 && cursor; depth += 1) {
        const style = getComputedStyle(cursor);
        if (style.outlineStyle === 'solid' && Number.parseFloat(style.outlineWidth) >= 2) return style.outlineColor;
        cursor = cursor.parentElement;
      }
      return null;
    });
    assert(submitFocus !== null, 'expected a visible focus ring on the submit button');
  });

  await check('homepage: hero, features, steps and images render', async () => {
    await open('/');
    await page.getByRole('heading', { level: 1, name: /Recruiting for small teams/ }).waitFor();
    await page.getByText('Interactive prototype · Sample data').first().waitFor();
    assert((await page.locator('h2').count()) === 2, 'expected two section headings');
    assert((await page.locator('h3').count()) === 6, 'expected three feature blocks and three steps');
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 600) {
        window.scrollTo(0, y);
        await new Promise((resolve) => setTimeout(resolve, 60));
      }
    });
    await page.waitForFunction(() => [...document.images].every((image) => image.complete && image.naturalWidth > 0));
    const images = await page.evaluate(() =>
      [...document.images].map((image) => ({ alt: image.alt, ok: image.complete && image.naturalWidth > 0 })),
    );
    assert(images.length === 5, 'expected five homepage images');
    assert(images.every((image) => image.ok), 'every homepage image must load');
    assert(images.every((image) => image.alt.length > 10), 'every homepage image needs descriptive alt text');
  });

  await check('homepage: CTAs, anchors and sample-job link lead to the right routes', async () => {
    await open('/');
    await page.getByRole('link', { name: 'Explore demo' }).first().click();
    await page.waitForURL('**/gallery');
    await open('/');
    await page.getByRole('link', { name: 'Sign in', exact: true }).first().click();
    await page.waitForURL('**/screens/SCR-01');
    await open('/');
    await page.getByRole('link', { name: 'View sample job' }).click();
    await page.waitForURL('**/screens/SCR-22');
    await open('/');
    await page.getByRole('link', { name: 'See how it works' }).click();
    assert(await page.evaluate(() => location.hash === '#how-it-works'), 'anchor did not update the hash');
    assert(await page.locator('#how-it-works').isVisible(), 'anchor target is not visible');
  });

  await check('homepage: mobile layout has no overflow and keeps links usable', async () => {
    const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
    const mobilePage = await mobile.newPage();
    await mobilePage.goto(`${baseUrl}/`, { waitUntil: 'networkidle' });
    await mobilePage.waitForSelector('html[data-app-ready="true"]');
    const overflow = await mobilePage.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    assert(overflow <= 1, `homepage overflows by ${overflow}px at 390px`);
    const signInBox = await mobilePage.getByRole('link', { name: 'Sign in', exact: true }).first().boundingBox();
    assert(signInBox && signInBox.x + signInBox.width <= 390, 'Sign in leaves the viewport');
    await mobile.close();
  });

  await check('no console errors during the run', async () => {
    assert(consoleErrors.length === 0, consoleErrors.slice(0, 3).join(' | '));
  });
} finally {
  await browser.close();
  server.kill();
}

const failed = results.filter((result) => !result.ok);
const logDir = path.join(imagesRoot, 'redesigned', 'docs');
await fs.mkdir(logDir, { recursive: true });
await fs.writeFile(
  path.join(logDir, 'flow-run.json'),
  `${JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      browser: 'Chromium (installed Chrome channel)',
      baseUrl,
      total: results.length,
      passed: results.length - failed.length,
      failed: failed.length,
      results,
      consoleErrors,
    },
    null,
    2,
  )}\n`,
);

console.log(`\n${results.length - failed.length}/${results.length} flow checks passed.`);
if (failed.length > 0) {
  console.log('Failures:');
  for (const failure of failed) console.log(` - ${failure.name}: ${failure.detail}`);
  process.exit(1);
}
