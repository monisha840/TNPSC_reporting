import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
import { CHARTS } from '../dashboard/lib/charts.mjs';

const OUT = path.join(__dirname, '..', 'TNPSC_MENTORS_CHARTS');
fs.mkdirSync(OUT, { recursive: true });

const index = [];
Object.entries(CHARTS).forEach(([name, c]) => {
  const svg = c.fn('file');
  fs.writeFileSync(path.join(OUT, name + '.svg'), svg, 'utf8');
  index.push({ name, title: c.title, bytes: Buffer.byteLength(svg) });
  console.log('  ' + name + '.svg  (' + Buffer.byteLength(svg) + ' bytes)');
});

const readme = [
  '# TNPSC_MENTORS_CHARTS',
  '',
  'Standalone SVG charts generated from the same read-only data model as the dashboard',
  'and the Markdown reports. Every chart is self-contained: no external fonts, no scripts,',
  'no network requests. Each carries a light and a dark palette and follows the viewer\'s',
  'system theme.',
  '',
  '| File | Chart |',
  '|---|---|',
  ...index.map(c => `| \`${c.name}.svg\` | ${c.title} |`),
  '',
  '**Source:** read-only production queries, read-only codebase inspection, a first-time-user',
  'walkthrough, and a public/external audit. No production code, database, configuration or',
  'deployment was modified to produce them.',
  '',
  'Regenerate with `node build/gen-charts.js` from the project root.',
  '',
].join('\n');
fs.writeFileSync(path.join(OUT, 'README.md'), readme, 'utf8');
console.log('\n' + index.length + ' charts + README written to TNPSC_MENTORS_CHARTS/');
