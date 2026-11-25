#!/usr/bin/env node
/**
 * Capture the public homepage for review:
 *   redesigned/evidence/HOME_product-introduction-desktop.png  (1280x800, DPR 1)
 *   redesigned/evidence/HOME_product-introduction-mobile.png   (390x844, DPR 2)
 * Full page, fonts settled, below-fold images loaded, motion disabled.
 * Log: redesigned/docs/homepage-run.json
 */
import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const imagesRoot = path.resolve(appRoot, '..', 'miniTA-screen-images');
const baseUrl = process.env.HOME_BASE_URL || 'http://localhost:4173';
const channel = process.env.PLAYWRIGHT_CHANNEL || 'chrome';

const shots = [
  { file: 'HOME_product-introduction-desktop.png', width: 1280, height: 800, dpr: 1, label: 'desktop' },
  { file: 'HOME_product-introduction-mobile.png', width: 390, height: 844, dpr: 2, label: 'mobile' },
];

let server;
if (!process.env.HOME_BASE_URL) {
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
}

const browser = await chromium.launch({ channel });
const runAt = new Date().toISOString();
const log = [];

try {
  for (const shot of shots) {
    const page = await browser.newPage({
      viewport: { width: shot.width, height: shot.height },
      deviceScaleFactor: shot.dpr,
      reducedMotion: 'reduce',
      colorScheme: 'light',
    });
    await page.goto(`${baseUrl}/`, { waitUntil: 'networkidle' });
    await page.waitForSelector('html[data-app-ready="true"]');
    await page.evaluate(async () => {
      await document.fonts.ready;
      for (let y = 0; y < document.body.scrollHeight; y += 600) {
        window.scrollTo(0, y);
        await new Promise((resolve) => setTimeout(resolve, 60));
      }
      window.scrollTo(0, 0);
      await new Promise((resolve) => setTimeout(resolve, 250));
    });
    await page.waitForFunction(() => [...document.images].every((image) => image.complete && image.naturalWidth > 0));
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    if (overflow > 1) console.warn(`  ! horizontal overflow of ${overflow}px at ${shot.label}`);

    const outputPath = path.join(imagesRoot, 'redesigned', 'evidence', shot.file);
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await page.screenshot({ path: outputPath, fullPage: true });
    const size = await page.evaluate(() => ({
      width: document.documentElement.scrollWidth,
      height: document.documentElement.scrollHeight,
    }));
    const images = await page.evaluate(() =>
      [...document.images].map((image) => ({
        src: image.currentSrc.split('/').pop(),
        width: image.naturalWidth,
        height: image.naturalHeight,
        alt: image.alt,
      })),
    );
    log.push({
      route: '/',
      label: shot.label,
      viewport: `${shot.width}x${shot.height}`,
      deviceScaleFactor: shot.dpr,
      pixelWidth: size.width * shot.dpr,
      pixelHeight: size.height * shot.dpr,
      output: path.relative(imagesRoot, outputPath).replaceAll('\\', '/'),
      overflowPx: Math.max(0, overflow),
      images,
      browser: `Chromium ${browser.version()} (${channel})`,
      capturedAt: runAt,
    });
    console.log(`  ${shot.label} -> ${shot.file} (${size.width}x${size.height})`);
    await page.close();
  }
} finally {
  await browser.close();
  if (server) server.kill();
}

const actualLogPath = path.join(imagesRoot, 'redesigned', 'docs', 'homepage-run.json');
await fs.mkdir(path.dirname(actualLogPath), { recursive: true });
await fs.writeFile(
  actualLogPath,
  `${JSON.stringify({ generatedAt: runAt, baseUrl, channel, screenshots: log }, null, 2)}\n`,
);
console.log(`\nCaptured ${log.length} homepage screenshots. Log: redesigned/docs/homepage-run.json`);
