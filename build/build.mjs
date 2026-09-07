/* Rebuilds the report deliverables from the app's data model, then validates. */
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const run = (f) => {
  console.log('\n> ' + f);
  execFileSync(process.execPath, [path.join(__dirname, f)], { stdio: 'inherit' });
};

['gen-charts.mjs', 'gen-md.mjs', 'gen-csv.mjs', 'validate.mjs'].forEach(run);
console.log('\nReport artefacts rebuilt.');
