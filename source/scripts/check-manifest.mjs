#!/usr/bin/env node
/**
 * Completeness check: every manifest screen must have one output image per group,
 * and the standard set must match the frozen source basenames and the expected
 * 22 screen IDs / 28 images.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const manifest = JSON.parse(await fs.readFile(path.join(appRoot, 'screen-manifest.json'), 'utf8'));
const imagesRoot = path.resolve(appRoot, manifest.imagesRoot);

const expectedIds = Array.from({ length: 22 }, (_, index) => `SCR-${String(index + 1).padStart(2, '0')}`);
const problems = [];
const rows = [];

const ids = manifest.screens.map((screen) => screen.screenId);
for (const id of expectedIds) {
  if (!ids.includes(id)) problems.push(`Missing screen ID ${id}`);
}
if (ids.length !== 22) problems.push(`Manifest has ${ids.length} screen IDs, expected 22`);
if (new Set(ids).size !== ids.length) problems.push('Duplicate screen IDs in manifest');

const outputs = [];
for (const screen of manifest.screens) {
  for (const group of screen.groups) {
    const source = screen.sources[group];
    const output = screen.outputs[group];
    if (!source || !output) {
      problems.push(`${screen.screenId} (${group}) has no source/output path`);
      continue;
    }
    const sourceName = path.basename(source);
    const outputName = path.basename(output);
    if (sourceName !== outputName) {
      problems.push(`${screen.screenId} (${group}) output name ${outputName} does not match source ${sourceName}`);
    }
    try {
      await fs.access(path.join(imagesRoot, source));
    } catch {
      problems.push(`Source image missing: ${source}`);
    }
    try {
      const stat = await fs.stat(path.join(imagesRoot, output));
      if (stat.size === 0) problems.push(`Output image is empty: ${output}`);
      rows.push({ screenId: screen.screenId, group, output, status: 'present' });
    } catch {
      rows.push({ screenId: screen.screenId, group, output, status: 'missing' });
      if (screen.status === 'ready') problems.push(`Ready screen has no capture: ${output}`);
    }
    outputs.push(output);
  }
}

if (outputs.length !== 28) problems.push(`Manifest describes ${outputs.length} standard images, expected 28`);

const readyIds = manifest.screens.filter((screen) => screen.status === 'ready').map((screen) => screen.screenId);

console.log(`Manifest: ${manifest.screens.length} screens, ${outputs.length} standard images`);
console.log(`Ready: ${readyIds.length ? readyIds.join(', ') : 'none'}`);
console.log(`Present: ${rows.filter((row) => row.status === 'present').length}, missing: ${rows.filter((row) => row.status === 'missing').length}`);

if (problems.length > 0) {
  console.error('\nProblems:');
  for (const problem of problems) console.error(` - ${problem}`);
  if (readyIds.length > 0) process.exit(1);
  console.log('\n(Planned screens are allowed to be missing during P1.)');
} else {
  console.log('\nAll 22 screen IDs and 28 images accounted for.');
}
