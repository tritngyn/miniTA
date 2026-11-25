#!/usr/bin/env node
/**
 * Accessibility evidence for the built prototype (P1.1, navy + teal theme).
 *  - axe-core (WCAG 2.0/2.1/2.2 A/AA) on P1 screens at 1280, 1024, 390 and 360px
 *  - measured contrast for text pairs (4.5:1) and UI boundaries (3:1)
 *  - a keyboard trace recording the focus indicator of the first stops
 *  - interaction states: selected nav, nav hover, primary button hover/active,
 *    link hover and the invalid-field border
 *
 * Output: miniTA-screen-images/redesigned/docs/a11y-run.json
 */
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const manifest = JSON.parse(await fs.readFile(path.join(appRoot, 'screen-manifest.json'), 'utf8'));
const imagesRoot = path.resolve(appRoot, manifest.imagesRoot);

const textPairs = [
  ['Body text on canvas', '#0F172A', '#F3F7F8'],
  ['Body text on surface', '#0F172A', '#FFFFFF'],
  ['Secondary text on surface', '#526477', '#FFFFFF'],
  ['Secondary text on canvas', '#526477', '#F3F7F8'],
  ['Table head text on sunken surface', '#526477', '#EAF1F4'],
  ['Muted helper text on surface', '#5F7283', '#FFFFFF'],
  ['Muted helper text on canvas', '#5F7283', '#F3F7F8'],
  ['Link on surface', '#1D4ED8', '#FFFFFF'],
  ['Link on canvas', '#1D4ED8', '#F3F7F8'],
  ['Link hover on surface', '#1E40AF', '#FFFFFF'],
  ['White on primary button', '#FFFFFF', '#2563EB'],
  ['White on primary hover', '#FFFFFF', '#1D4ED8'],
  ['Body text on navy', '#F8FAFC', '#0F172A'],
  ['Muted text on navy', '#CBD5E1', '#0F172A'],
  ['Selected nav label on navy soft', '#F8FAFC', '#1E293B'],
  ['Muted text on navy soft', '#CBD5E1', '#1E293B'],
  ['Error text on surface', '#A12825', '#FFFFFF'],
  ['Error callout text', '#A12825', '#FBECEB'],
  ['Warning callout text', '#7A4D00', '#FFF1D6'],
  ['Info callout text', '#1E40AF', '#DBEAFE'],
  ['Success callout text', '#25633B', '#E7F3EA'],
  ['Status Applied', '#475569', '#E8EEF2'],
  ['Status Under Review', '#7A4D00', '#FFF1D6'],
  ['Status Shortlisted', '#4338A3', '#EEEBFF'],
  ['Status Hired', '#25633B', '#E7F3EA'],
  ['Status Rejected', '#A12825', '#FBECEB'],
  ['Tooltip text on navy', '#F8FAFC', '#0F172A'],
];

const uiPairs = [
  ['Control border on surface (1.4.11)', '#748899', '#FFFFFF', 3],
  ['Control border on canvas (1.4.11)', '#748899', '#F3F7F8', 3],
  ['Control border on sunken surface (1.4.11)', '#748899', '#EAF1F4', 3],
  ['Focus ring on surface (1.4.11)', '#2563EB', '#FFFFFF', 3],
  ['Primary button on surface (1.4.11)', '#2563EB', '#FFFFFF', 3],
  ['Nav marker on navy soft (1.4.11)', '#3B82F6', '#1E293B', 3],
  ['Focus ring on navy (1.4.11)', '#3B82F6', '#0F172A', 3],
];

const VIEWPORTS = {
  desktop: { width: 1280, height: 800, deviceScaleFactor: 1 },
  laptop: { width: 1024, height: 800, deviceScaleFactor: 1 },
  mobile: { width: 390, height: 844, deviceScaleFactor: 2 },
  narrow: { width: 360, height: 800, deviceScaleFactor: 2 },
};

const routes = [
  { route: '/', label: 'HOME product introduction', viewport: 'desktop', states: true },
  { route: '/', label: 'HOME product introduction', viewport: 'laptop' },
  { route: '/', label: 'HOME product introduction', viewport: 'mobile' },
  { route: '/', label: 'HOME product introduction', viewport: 'narrow' },
  { route: '/gallery', label: 'GALLERY review tool', viewport: 'desktop' },
  { route: '/gallery', label: 'GALLERY review tool', viewport: 'laptop' },
  { route: '/gallery', label: 'GALLERY review tool', viewport: 'mobile' },
  { route: '/gallery', label: 'GALLERY review tool', viewport: 'narrow' },
  { route: '/screens/SCR-01', label: 'SCR-01 Login', viewport: 'desktop' },
  { route: '/screens/SCR-02', label: 'SCR-02 Login error', viewport: 'desktop' },
  { route: '/screens/SCR-03', label: 'SCR-03 Access denied', viewport: 'desktop' },
  { route: '/screens/SCR-04', label: 'SCR-04 Applicant Inbox', viewport: 'desktop', states: true },
  { route: '/screens/SCR-04', label: 'SCR-04 Applicant Inbox', viewport: 'laptop' },
  { route: '/screens/SCR-04?state=empty', label: 'SCR-04 empty state', viewport: 'desktop' },
  { route: '/screens/SCR-05', label: 'SCR-05 Job form', viewport: 'desktop' },
  { route: '/screens/SCR-05', label: 'SCR-05 Job form', viewport: 'laptop' },
  { route: '/screens/SCR-05?state=validation', label: 'SCR-05 Job form error', viewport: 'desktop' },
  { route: '/screens/SCR-06', label: 'SCR-06 Job list', viewport: 'desktop' },
  { route: '/screens/SCR-06', label: 'SCR-06 Job list', viewport: 'laptop' },
  { route: '/screens/SCR-06?state=empty', label: 'SCR-06 empty state', viewport: 'desktop' },
  { route: '/screens/SCR-07', label: 'SCR-07 Job detail', viewport: 'desktop' },
  { route: '/screens/SCR-07', label: 'SCR-07 Job detail', viewport: 'laptop' },
  { route: '/screens/SCR-07?state=draft', label: 'SCR-07 draft job', viewport: 'desktop' },
  { route: '/screens/SCR-07?state=closed', label: 'SCR-07 closed job', viewport: 'desktop' },
  { route: '/screens/SCR-08', label: 'SCR-08 Rubric builder', viewport: 'desktop', states: true },
  { route: '/screens/SCR-08', label: 'SCR-08 Rubric builder', viewport: 'laptop' },
  { route: '/screens/SCR-09', label: 'SCR-09 Rubric error', viewport: 'desktop' },
  { route: '/screens/SCR-10', label: 'SCR-10 AI JD input', viewport: 'desktop' },
  { route: '/screens/SCR-10?state=unavailable', label: 'SCR-10 AI unavailable', viewport: 'desktop' },
  { route: '/screens/SCR-11', label: 'SCR-11 AI draft review', viewport: 'desktop' },
  { route: '/screens/SCR-12', label: 'SCR-12 Application form', viewport: 'desktop' },
  { route: '/screens/SCR-12', label: 'SCR-12 Application form', viewport: 'mobile' },
  { route: '/screens/SCR-12', label: 'SCR-12 Application form', viewport: 'narrow' },
  { route: '/screens/SCR-13', label: 'SCR-13 Application form error', viewport: 'desktop', states: true },
  { route: '/screens/SCR-13', label: 'SCR-13 Application form error', viewport: 'mobile' },
  { route: '/screens/SCR-14', label: 'SCR-14 Application submitted', viewport: 'desktop' },
  { route: '/screens/SCR-14', label: 'SCR-14 Application submitted', viewport: 'mobile' },
  { route: '/screens/SCR-15', label: 'SCR-15 Status portal', viewport: 'desktop' },
  { route: '/screens/SCR-15', label: 'SCR-15 Status portal', viewport: 'mobile' },
  { route: '/screens/SCR-15?state=expired', label: 'SCR-15 expired link', viewport: 'desktop' },
  { route: '/screens/SCR-16', label: 'SCR-16 Link unavailable', viewport: 'desktop' },
  { route: '/screens/SCR-16', label: 'SCR-16 Link unavailable', viewport: 'mobile' },
  { route: '/screens/SCR-16', label: 'SCR-16 Link unavailable', viewport: 'narrow' },
  { route: '/screens/SCR-17', label: 'SCR-17 Applicant detail', viewport: 'desktop' },
  { route: '/screens/SCR-17', label: 'SCR-17 Applicant detail', viewport: 'laptop' },
  { route: '/screens/SCR-17?state=extraction-failed', label: 'SCR-17 extraction failed', viewport: 'desktop' },
  { route: '/screens/SCR-18', label: 'SCR-18 Internal notes', viewport: 'desktop' },
  { route: '/screens/SCR-19', label: 'SCR-19 Scorecard', viewport: 'desktop' },
  { route: '/screens/SCR-19?state=incomplete', label: 'SCR-19 Scorecard error', viewport: 'desktop' },
  { route: '/screens/SCR-20', label: 'SCR-20 Status update', viewport: 'desktop' },
  { route: '/screens/SCR-21', label: 'SCR-21 Dashboard', viewport: 'desktop' },
  { route: '/screens/SCR-21', label: 'SCR-21 Dashboard', viewport: 'laptop' },
  { route: '/screens/SCR-21?state=empty', label: 'SCR-21 Dashboard empty', viewport: 'desktop' },
  { route: '/screens/SCR-22', label: 'SCR-22 Public job', viewport: 'desktop' },
  { route: '/screens/SCR-22', label: 'SCR-22 Public job', viewport: 'mobile' },
  { route: '/screens/SCR-22', label: 'SCR-22 Public job', viewport: 'narrow' },
];

function luminance(hex) {
  const value = hex.replace('#', '');
  const channels = [0, 2, 4].map((offset) => Number.parseInt(value.slice(offset, offset + 2), 16) / 255);
  const [r, g, b] = channels.map((channel) =>
    channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4,
  );
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(fg, bg) {
  const [lighter, darker] = [luminance(fg), luminance(bg)].sort((a, b) => b - a);
  return Math.round(((lighter + 0.05) / (darker + 0.05)) * 100) / 100;
}

const contrastResults = textPairs.map(([label, fg, bg]) => {
  const ratio = contrast(fg, bg);
  return { kind: 'text', label, foreground: fg, background: bg, ratio, min: 4.5, pass: ratio >= 4.5 };
});
const uiResults = uiPairs.map(([label, fg, bg, min]) => {
  const ratio = contrast(fg, bg);
  return { kind: 'ui', label, foreground: fg, background: bg, ratio, min, pass: ratio >= min };
});

async function readColors(page, selector, properties) {
  return page.evaluate(
    ({ selector: target, properties: props }) => {
      const element = document.querySelector(target);
      if (!element) return null;
      const style = getComputedStyle(element);
      return Object.fromEntries(props.map((prop) => [prop, style[prop]]));
    },
    { selector, properties },
  );
}

async function collectStates(page, route) {
  const states = {};

  if (route.state === 'nav' || true) {
    states.navSelected = await readColors(page, 'nav a[aria-current="page"]', [
      'backgroundColor',
      'color',
    ]);
  }

  const navTarget = page.locator('nav a:not([aria-current="page"])').first();
  if (await navTarget.count()) {
    const before = await navTarget.evaluate((element) => getComputedStyle(element).backgroundColor);
    await navTarget.hover();
    await page.waitForTimeout(420);
    const after = await navTarget.evaluate((element) => getComputedStyle(element).backgroundColor);
    states.navHover = { before, after, changed: before !== after };
    await page.mouse.move(0, 0);
  }

  if (route.includes('/SCR-08') || route.includes('/SCR-09')) {
    const primary = page.getByRole('button', { name: 'Approve rubric' });
    if (await primary.count()) {
      const rest = await primary.evaluate((element) => getComputedStyle(element).backgroundColor);
      const disabled = await primary.isDisabled();
      states.primaryButton = { rest, disabled };
      if (!disabled) {
        await primary.hover();
        await page.waitForTimeout(420);
        const hover = await primary.evaluate((element) => getComputedStyle(element).backgroundColor);
        await page.mouse.down();
        await page.waitForTimeout(320);
        const active = await primary.evaluate((element) => getComputedStyle(element).backgroundColor);
        await page.mouse.up();
        states.primaryButton.hover = hover;
        states.primaryButton.active = active;
        states.primaryButton.hoverChanged = rest !== hover;
        states.primaryButton.activeChanged = hover !== active;
      }
    }
  }

  if (route.includes('/SCR-04') && !route.includes('empty')) {
    const link = page.locator('table a').first();
    if (await link.count()) {
      const rest = await link.evaluate((element) => getComputedStyle(element).color);
      await link.hover();
      await page.waitForTimeout(420);
      const hover = await link.evaluate((element) => getComputedStyle(element).color);
      states.link = { rest, hover, hoverChanged: rest !== hover };
    }
  }

  if (route.includes('/SCR-13')) {
    states.invalidField = await page.evaluate(() => {
      const fieldset = document.querySelector('.Mui-error fieldset, .MuiOutlinedInput-root.Mui-error fieldset');
      return fieldset ? getComputedStyle(fieldset).borderColor : null;
    });
  }

  if (route.includes('/SCR-12') || route.includes('/SCR-13') || route.includes('/SCR-08')) {
    states.controlBorder = await page.evaluate(() => {
      const root = document.querySelector('.MuiOutlinedInput-root');
      const fieldset = root?.querySelector('fieldset');
      if (!root || !fieldset) return null;
      return {
        border: getComputedStyle(fieldset).borderColor,
        background: getComputedStyle(root).backgroundColor,
        borderWidth: getComputedStyle(fieldset).borderWidth,
      };
    });
  }

  return states;
}

let server;
const baseUrl = 'http://localhost:4173';
if (!existsSync(path.join(appRoot, 'dist', 'index.html'))) {
  console.error('dist/index.html is missing. Run `npm run build` first.');
  process.exit(1);
}
server = spawn(
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
const runAt = new Date().toISOString();
const results = [];
const colorChecks = [];

try {
  for (const target of routes) {
    const viewport = VIEWPORTS[target.viewport];
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      deviceScaleFactor: viewport.deviceScaleFactor,
      reducedMotion: 'reduce',
    });
    const page = await context.newPage();
    await page.goto(`${baseUrl}${target.route}`, { waitUntil: 'networkidle' });
    await page.waitForSelector('html[data-app-ready="true"]');
    await page.evaluate(() => document.fonts.ready);

    const axe = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();

    const tabTrace = [];
    for (let index = 0; index < 12; index += 1) {
      await page.keyboard.press('Tab');
      tabTrace.push(
        await page.evaluate(() => {
          const element = document.activeElement;
          if (!element) return null;
          const style = getComputedStyle(element);
          const hasRing = (node) => {
            if (!node) return false;
            const nodeStyle = getComputedStyle(node);
            return nodeStyle.outlineStyle === 'solid' && Number.parseFloat(nodeStyle.outlineWidth) >= 2;
          };
          let cursor = element;
          let outlineVisible = false;
          for (let depth = 0; depth < 4 && cursor; depth += 1) {
            if (hasRing(cursor)) {
              outlineVisible = true;
              break;
            }
            cursor = cursor.parentElement;
          }
          const fieldset = element.closest('.MuiInputBase-root')?.querySelector('fieldset');
          const borderFocus = fieldset ? getComputedStyle(fieldset).borderColor === 'rgb(37, 99, 235)' : false;
          return {
            tag: element.tagName.toLowerCase(),
            label:
              element.getAttribute('aria-label') ||
              element.getAttribute('name') ||
              element.textContent?.trim().slice(0, 48) ||
              '',
            indicator: outlineVisible ? 'outline' : borderFocus ? 'border' : 'none',
            focusRingColor: outlineVisible ? style.outlineColor : fieldset ? getComputedStyle(fieldset).borderColor : '',
          };
        }),
      );
    }

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    const states = target.states ? await collectStates(page, target.route) : undefined;

    const violations = axe.violations.map((violation) => ({
      id: violation.id,
      impact: violation.impact,
      help: violation.help,
      nodes: violation.nodes.map((node) => node.target.join(' ')).slice(0, 5),
    }));

    const counted = tabTrace.filter((stop) => stop && stop.tag !== 'body');
    const visible = counted.filter((stop) => stop.indicator !== 'none');

    results.push({
      ...target,
      violations,
      tabTrace,
      overflowPx: Math.max(0, overflow),
      states,
    });

    const serious = violations.filter((violation) => ['serious', 'critical'].includes(violation.impact));
    console.log(
      `${target.label} (${target.viewport}): ${violations.length} violation(s), ${serious.length} serious · ${visible.length}/${counted.length} focus · overflow ${Math.max(0, overflow)}px`,
    );
    for (const violation of serious) {
      console.log(`   - ${violation.id} (${violation.impact}): ${violation.help}`);
    }
    await context.close();
  }

  // Computed colours for the refreshed navy + blue theme. These assert the
  // rendered values, not only the token table.

  const checkColor = async (label, route, viewportName, fn) => {
    const viewport = VIEWPORTS[viewportName];
    const colorContext = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      deviceScaleFactor: 1,
      reducedMotion: 'reduce',
    });
    const colorPage = await colorContext.newPage();
    await colorPage.goto(`${baseUrl}${route}`, { waitUntil: 'networkidle' });
    await colorPage.waitForSelector('html[data-app-ready="true"]');
    await colorPage.evaluate(() => document.fonts.ready);
    try {
      const result = await fn(colorPage);
      colorChecks.push({ label, route, ...result });
    } catch (error) {
      colorChecks.push({ label, route, pass: false, error: String(error).slice(0, 180) });
    }
    await colorContext.close();
  };

  await checkColor('SCR-04 selected nav', '/screens/SCR-04', 'desktop', async (colorPage) => {
    const values = await colorPage.evaluate(() => {
      const element = document.querySelector('nav a[aria-current="page"]');
      const style = getComputedStyle(element);
      return {
        background: style.backgroundColor,
        color: style.color,
        marker: getComputedStyle(element, '::before').backgroundColor,
      };
    });
    return {
      actual: values,
      expected: { background: 'rgb(30, 41, 59)', color: 'rgb(248, 250, 252)', marker: 'rgb(59, 130, 246)' },
      pass:
        values.background === 'rgb(30, 41, 59)' &&
        values.color === 'rgb(248, 250, 252)' &&
        values.marker === 'rgb(59, 130, 246)',
    };
  });

  await checkColor('SCR-04 link colour', '/screens/SCR-04', 'desktop', async (colorPage) => {
    const values = await colorPage.evaluate(() => ({
      color: getComputedStyle(document.querySelector('table a')).color,
    }));
    return {
      actual: values,
      expected: { color: 'rgb(29, 78, 216)' },
      pass: values.color === 'rgb(29, 78, 216)',
    };
  });

  await checkColor('SCR-08 primary button states', '/screens/SCR-08', 'desktop', async (colorPage) => {
    const button = colorPage.getByRole('button', { name: 'Approve rubric' });
    const read = () => button.evaluate((element) => getComputedStyle(element).backgroundColor);
    let disabledBg = null;
    if (await button.isDisabled()) {
      disabledBg = await read();
      await colorPage.locator('#scr08-rubric-name').fill('Software Engineer (Frontend) — theme check');
      await colorPage.waitForFunction(() => {
        const target = [...document.querySelectorAll('button')].find(
          (element) => element.textContent?.trim() === 'Approve rubric',
        );
        return Boolean(target && !target.disabled);
      });
      await colorPage.waitForTimeout(450);
    }
    const rest = await read();
    await button.hover();
    await colorPage.waitForTimeout(420);
    const hover = await read();
    await colorPage.mouse.down();
    await colorPage.waitForTimeout(320);
    const active = await read();
    await colorPage.mouse.up();
    const actual = { rest, hover, active, disabledBg };
    return {
      actual,
      expected: {
        rest: 'rgb(37, 99, 235)',
        hover: 'rgb(29, 78, 216)',
        active: 'rgb(30, 64, 175)',
        disabledBg: 'rgb(232, 238, 242)',
      },
      pass:
        rest === 'rgb(37, 99, 235)' &&
        hover === 'rgb(29, 78, 216)' &&
        active === 'rgb(30, 64, 175)' &&
        (disabledBg === null || disabledBg === 'rgb(232, 238, 242)'),
    };
  });

  await checkColor('Homepage navy zones, teal dot, illustration', '/', 'desktop', async (colorPage) => {
    const values = await colorPage.evaluate(() => {
      const image = document.querySelector('.home-figure img');
      return {
        hero: getComputedStyle(document.querySelector('.home-hero')).backgroundColor,
        footer: getComputedStyle(document.querySelector('.home-footer')).backgroundColor,
        marker: getComputedStyle(document.querySelector('.home-note'), '::before').backgroundColor,
        illustration: Boolean(image && image.complete && image.naturalWidth > 0),
      };
    });
    return {
      actual: values,
      expected: {
        hero: 'rgb(15, 23, 42)',
        footer: 'rgb(15, 23, 42)',
        marker: 'rgb(20, 184, 166)',
        illustration: true,
      },
      pass:
        values.hero === 'rgb(15, 23, 42)' &&
        values.footer === 'rgb(15, 23, 42)' &&
        values.marker === 'rgb(20, 184, 166)' &&
        values.illustration,
    };
  });

  await checkColor('Auth header and primary button', '/screens/SCR-01', 'desktop', async (colorPage) => {
    const values = await colorPage.evaluate(() => ({
      header: getComputedStyle(document.querySelector('.site-header')).backgroundColor,
      button: getComputedStyle(document.querySelector('.MuiButton-containedPrimary')).backgroundColor,
    }));
    return {
      actual: values,
      expected: { header: 'rgb(15, 23, 42)', button: 'rgb(37, 99, 235)' },
      pass: values.header === 'rgb(15, 23, 42)' && values.button === 'rgb(37, 99, 235)',
    };
  });

  await checkColor('Candidate header and submit button', '/screens/SCR-12', 'mobile', async (colorPage) => {
    const values = await colorPage.evaluate(() => ({
      header: getComputedStyle(document.querySelector('.site-header')).backgroundColor,
      button: getComputedStyle(document.querySelector('.MuiButton-containedPrimary')).backgroundColor,
    }));
    return {
      actual: values,
      expected: { header: 'rgb(15, 23, 42)', button: 'rgb(37, 99, 235)' },
      pass: values.header === 'rgb(15, 23, 42)' && values.button === 'rgb(37, 99, 235)',
    };
  });

  await checkColor('Gallery header navy', '/gallery', 'desktop', async (colorPage) => {
    const values = await colorPage.evaluate(() => ({
      header: getComputedStyle(document.querySelector('.site-header')).backgroundColor,
    }));
    return {
      actual: values,
      expected: { header: 'rgb(15, 23, 42)' },
      pass: values.header === 'rgb(15, 23, 42)',
    };
  });

  await checkColor('Invalid field keeps the red border', '/screens/SCR-13', 'desktop', async (colorPage) => {
    const values = await colorPage.evaluate(() => {
      const fieldset = document.querySelector('.MuiOutlinedInput-root.Mui-error fieldset');
      return { border: fieldset ? getComputedStyle(fieldset).borderColor : null };
    });
    return {
      actual: values,
      expected: { border: 'rgb(161, 40, 37)' },
      pass: values.border === 'rgb(161, 40, 37)',
    };
  });

  await checkColor('Homepage secondary CTA border on navy', '/', 'desktop', async (colorPage) => {
    const values = await colorPage.evaluate(() => {
      const link = [...document.querySelectorAll('.home-hero a')].find((element) =>
        element.textContent?.includes('See how it works'),
      );
      return { border: getComputedStyle(link).borderColor };
    });
    const [r, g, b, alpha = 1] = (values.border.match(/[\d.]+/g) ?? []).map(Number);
    const bg = [15, 23, 42];
    const composite = [
      r * alpha + bg[0] * (1 - alpha),
      g * alpha + bg[1] * (1 - alpha),
      b * alpha + bg[2] * (1 - alpha),
    ];
    const toHex = (channels) =>
      `#${channels.map((value) => Math.round(value).toString(16).padStart(2, '0')).join('')}`;
    const ratio = contrast(toHex(composite), '#0F172A');
    return {
      actual: { border: values.border, ratio },
      expected: { min: 3 },
      pass: ratio >= 3,
    };
  });
} finally {

  await browser.close();
  if (server) server.kill();
}

const failingText = contrastResults.filter((entry) => !entry.pass);
const failingUi = uiResults.filter((entry) => !entry.pass);
const seriousTotal = results.reduce(
  (sum, result) => sum + result.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact)).length,
  0,
);
const overflowRoutes = results.filter((result) => result.overflowPx > 1);

const measuredBorders = results
  .map((result) => ({ route: result.label, viewport: result.viewport, ...(result.states?.controlBorder ?? {}) }))
  .filter((entry) => entry.border && entry.background);
const borderChecks = measuredBorders.map((entry) => {
  const toHex = (rgb) => {
    const parts = rgb.match(/\d+/g)?.slice(0, 3).map(Number) ?? [];
    return `#${parts.map((value) => value.toString(16).padStart(2, '0')).join('')}`.toUpperCase();
  };
  const ratio = contrast(toHex(entry.border), toHex(entry.background));
  return { ...entry, ratio, min: 3, pass: ratio >= 3 };
});

const logDir = path.join(imagesRoot, 'redesigned', 'docs');
await fs.mkdir(logDir, { recursive: true });
await fs.writeFile(
  path.join(logDir, 'a11y-run.json'),
  `${JSON.stringify(
    {
      generatedAt: runAt,
      theme: 'navy + blue (theme refresh 2026-11-24)',
      browser: `Chromium ${browser.version()}`,
      baseUrl,
      contrast: [...contrastResults, ...uiResults],
      measuredControlBorders: borderChecks,
      colorChecks,
      routes: results,
      notPassed: [
        ...failingText.map((entry) => `${entry.label}: ${entry.ratio}:1 (needs ${entry.min}:1)`),
        ...failingUi.map((entry) => `${entry.label}: ${entry.ratio}:1 (needs ${entry.min}:1)`),
      ],
      notVerified: [
        'Edge was smoke-tested for the public pages; axe was run in Chrome only.',
        'Real authentication, PDF extraction, email delivery and AI calls do not exist in the prototype.',
        'Hover/active colours were read from computed styles in Chrome only.',
        'Screen-reader announcement order was not tested with a screen reader.',
      ],
    },
    null,
    2,
  )}\n`,
);

console.log(`\nText contrast: ${contrastResults.length - failingText.length}/${contrastResults.length} pass 4.5:1`);
for (const entry of failingText) console.log(`   FAIL ${entry.label}: ${entry.ratio}:1`);
console.log(`UI contrast: ${uiResults.length - failingUi.length}/${uiResults.length} pass 3:1`);
for (const entry of borderChecks) {
  console.log(`   measured control border ${entry.route} (${entry.viewport}): ${entry.ratio}:1 ${entry.pass ? 'pass' : 'FAIL'}`);
}
for (const entry of failingUi) console.log(`   REVIEW ${entry.label}: ${entry.ratio}:1`);
const failedColors = colorChecks.filter((check) => !check.pass);
console.log(`Computed colour checks: ${colorChecks.length - failedColors.length}/${colorChecks.length} pass`);
for (const check of failedColors) console.log(`   FAIL ${check.label}: ${JSON.stringify(check.actual ?? check.error)}`);
console.log(`Serious/critical axe findings: ${seriousTotal}`);
console.log(`Horizontal overflow: ${overflowRoutes.length} route(s)`);
for (const result of overflowRoutes) console.log(`   ${result.label} (${result.viewport}): ${result.overflowPx}px`);
console.log('Report: redesigned/docs/a11y-run.json');

if (failingText.length > 0 || seriousTotal > 0 || overflowRoutes.length > 0 || failedColors.length > 0) process.exit(1);
