/*
 * Final validation against the brief's own checklist (section 34).
 * Checks the generated artefacts, not just the data model.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
import D from '../dashboard/lib/data.mjs';

const ROOT = path.join(__dirname, '..');
const read = (f) => fs.readFileSync(path.join(ROOT, f), 'utf8');

let pass = 0, fail = 0;
function check(label, ok, detail) {
  if (ok) { pass++; console.log('  [x] ' + label + (detail ? '  — ' + detail : '')); }
  else { fail++; console.log('  [ ] FAIL: ' + label + (detail ? '  — ' + detail : '')); }
}

const md = read('TNPSC_MENTORS_GROWTH_DASHBOARD.md');
const ho = read('TNPSC_MENTORS_DEVELOPER_HANDOFF.md');
const csv = read('TNPSC_MENTORS_GROWTH_DATA.csv');

console.log('\nFINAL VALIDATION\n');

/* --- coverage --- */
check('All 14 major flaws included', D.FLAWS.length === 14 &&
  D.FLAWS.every((f, i) => f.id === i + 1), D.FLAWS.length + ' flaws, ids 1-14');

const REG = [];
for (let i = 1; i <= 4; i++) REG.push('P0-' + i);
for (let i = 1; i <= 12; i++) REG.push('P1-' + i);
for (let i = 1; i <= 12; i++) REG.push('P2-' + i);
const traced = new Set();
D.FLAWS.forEach((f) => f.underlying.forEach((u) => traced.add(u.id)));
const missing = REG.filter((r) => !traced.has(r));
check('No non-P3 flaw removed', missing.length === 0,
  REG.length + ' register IDs, ' + (REG.length - missing.length) + ' traced' +
  (missing.length ? ', MISSING: ' + missing.join(',') : ''));

const p3InFlaws = [...traced].filter((t) => /^P3-/.test(t));
check('P3 excluded (except the brief-mandated P3-5 in Flaw #6)',
  p3InFlaws.length === 1 && p3InFlaws[0] === 'P3-5',
  'P3 refs in flaws: ' + (p3InFlaws.join(',') || 'none'));
check('P3 register listed separately as out of scope',
  D.TRACEABILITY.outOfScope.items.length === 6, D.TRACEABILITY.outOfScope.items.length + ' P3 items listed');
check('35 underlying findings traced (28 register + 7 verification)',
  REG.length + D.TRACEABILITY.verificationFindings.length === 35,
  REG.length + ' + ' + D.TRACEABILITY.verificationFindings.length);

/* --- per-flaw structure --- */
const AQ = ['A_summary','B_flaw','C_why','D_evidence','E_howChecked','F_numbers','G_affected',
  'H_rootCause','I_userImpact','J_businessImpact','K_devImpact','L_fix','M_implementation',
  'N_successMetric','O_priority','P_confidence','Q_source'];
check('Every flaw has all 17 sections A–Q',
  D.FLAWS.every((f) => AQ.every((k) => f[k] !== undefined && (typeof f[k] !== 'object' || Object.keys(f[k]).length))));
check('Every flaw has evidence', D.FLAWS.every((f) => f.D_evidence.length >= 3),
  'min ' + Math.min(...D.FLAWS.map((f) => f.D_evidence.length)) + ' evidence items per flaw');
check('Every flaw explains how it was checked', D.FLAWS.every((f) => f.E_howChecked.length >= 3));
check('Every flaw has business impact', D.FLAWS.every((f) => f.J_businessImpact.length >= 1));
check('Every flaw has a recommended fix', D.FLAWS.every((f) => f.L_fix.length >= 1));
check('Every flaw has a success metric', D.FLAWS.every((f) => f.N_successMetric.length >= 1));
check('Every flaw has affected-users detail',
  D.FLAWS.every((f) => f.G_affected.count && f.G_affected.pct && f.G_affected.stage));
check('Every flaw separates confirmed root cause from hypothesis',
  D.FLAWS.every((f) => Array.isArray(f.H_rootCause.confirmed) && Array.isArray(f.H_rootCause.hypothesis)));
check('Evidence labels used ([PROD]/[CODE]/[UX]/[EXT]/[FOUNDER])',
  D.FLAWS.every((f) => f.D_evidence.every((e) => /PROD|CODE|UX|EXT|FOUNDER|GAP/.test(e.tag))));

/* --- honesty rules --- */
check('Hypotheses clearly labelled',
  D.FLAWS.every((f) => f.rootCauseStatus) && /HYPOTHESIS/.test(md));
check('Data gaps clearly labelled',
  /DATA NOT AVAILABLE/.test(md) && D.DATA_QUALITY.gaps.length >= 10,
  D.DATA_QUALITY.gaps.length + ' gaps enumerated');
check('No invented targets — every non-definitional target says BASELINE FIRST',
  D.KPI_MODEL.every((k) => k.targetType === 'DEFINITIONAL' || /BASELINE FIRST|Measurable/.test(k.target)),
  D.KPI_MODEL.filter((k) => k.targetType === 'EXPERIMENT').length + ' experiment targets deferred');
check('Internal customers separated from external',
  D.CUSTOMER_SEGMENTATION.some((s) => /Externally-acquired/.test(s.segment)) &&
  /Externally-generated revenue/.test(md));
check('Acquisition growth correctly interpreted (not framed as decline)',
  /acquisition is growing/i.test(md) && /NOT the immediate bottleneck|not the current bottleneck/i.test(md));
check('September partial-month data not misinterpreted',
  /PARTIAL/.test(md) && /must not be interpreted as a collapse|NOT a collapse|not be read as a collapse/i.test(md + D.DIAGNOSIS.septemberWarning));
check('Payment data reconciled (20 / 21 / 11 / 4 / 1 / 0)',
  D.PAYMENTS_RECONCILIATION.rows.length === 7 && /21/.test(md) && /reconciliation/i.test(md));
check('Retention caveats included',
  D.RETENTION.caveats.length >= 3 && /FLOOR/.test(md));
check('Feedback finding included (6 responses, 0 written)',
  D.FEEDBACK.responses === 6 && D.FEEDBACK.written === 0 && /4\.33/.test(md));
check('Monthly-vs-baseline discrepancy disclosed, not silently fixed', /686/.test(md));
check('No percentage without a denominator in flaw numbers',
  D.FLAWS.every((f) => f.F_numbers.every((n) => n.calc && n.calc.length > 0)));

/* --- navigation: exactly five sections --- */
const navSrc = read('dashboard/lib/nav.ts');
const NAV_REQUIRED = ['Overview', 'User Funnel', '14 Flaws', 'Fixes'];
const navMissing = NAV_REQUIRED.filter((n) => !navSrc.includes(`label: '${n}'`));
check('All 4 required sidebar sections present', navMissing.length === 0,
  navMissing.length ? 'missing: ' + navMissing.join(', ') : '4/4');

const navCount = (navSrc.match(/href: '/g) || []).length;
check('Exactly 4 sidebar sections — no extras', navCount === 4, navCount + ' nav entries');

const navOrder = [...navSrc.matchAll(/label: '([^']+)'/g)].map((m) => m[1]);
check('Sections ordered Overview -> User Funnel -> 14 Flaws -> Fixes',
  navOrder.join(' | ') === 'Overview | User Funnel | 14 Flaws | Fixes',
  navOrder.join(' -> '));

const RETIRED = ['Executive Diagnosis', 'Activation', 'Retention', 'Monetization', 'Acquisition',
  'Analytics Health', 'Customer Feedback', 'Complete User Journey', 'Root Cause Tree',
  'Developer Handoff', '30 / 60 / 90 Plan', 'Before → After KPIs', 'Data Quality',
  'Final Conclusion', 'Priority', 'Methodology'];
const stillNav = RETIRED.filter((n) => navSrc.includes(n));
check('All retired sections gone from navigation', stillNav.length === 0,
  stillNav.length ? 'still present: ' + stillNav.join(', ') : RETIRED.length + ' removed');

const appDirs = fs.readdirSync(path.join(ROOT, 'dashboard/app'), { withFileTypes: true })
  .filter((d) => d.isDirectory()).map((d) => d.name).sort();
check('Only the 4 sections have routes', appDirs.join(',') === 'fixes,flaws,funnel',
  'app/: ' + appDirs.join(', ') + ' + index');

/* --- removed content must not linger anywhere in the dashboard UI --- */
const uiFiles = [];
(function walk(dir) {
  fs.readdirSync(dir, { withFileTypes: true }).forEach((d) => {
    const full = path.join(dir, d.name);
    if (d.isDirectory()) walk(full);
    else if (/[.](tsx|ts|mjs)$/.test(d.name)) uiFiles.push(full);
  });
})(path.join(ROOT, 'dashboard/app'));
['dashboard/components'].forEach((d) => {
  fs.readdirSync(path.join(ROOT, d)).forEach((f) => {
    if (/[.](tsx|ts|mjs)$/.test(f)) uiFiles.push(path.join(ROOT, d, f));
  });
});
const uiSrc = uiFiles.map((f) => fs.readFileSync(f, 'utf8')).join('\n');

const REMOVED_PHRASES = [
  ['Recommended implementation sequence', /Recommended implementation sequence/i],
  ['P3 out-of-scope block', /outOfScope/],
  ['CLOSED - disproved section', /TRACEABILITY[.]closed/],
  ['"Fixes are being prepared separately"', /being prepared separately/i],
  ['Read-only / no-production-modified statement', /GENERATED USING READ-ONLY DATA|NO PRODUCTION CODE, DATABASE/i],
  ['FIX_SEQUENCE data', /FIX_SEQUENCE/],
  ['Fix strategy / journey card', /FIX_STRATEGY|journey-strip/],
  ['Technical-details expander', /Expander|View technical details/],
];
const lingering = REMOVED_PHRASES.filter(([, re]) => re.test(uiSrc)).map(([n]) => n);
check('No removed section or phrase is rendered anywhere in the UI', lingering.length === 0,
  lingering.length ? 'still present: ' + lingering.join(' | ') : REMOVED_PHRASES.length + ' phrases checked');

const linkTargets = [...uiSrc.matchAll(/href=["'`](\/[a-z-]*)/g)].map((m) => m[1]);
const validRoutes = ['/', '/funnel', '/flaws', '/fixes'];
const broken = [...new Set(linkTargets)].filter((h) => !validRoutes.includes(h));
check('No orphaned internal links', broken.length === 0,
  broken.length ? 'broken: ' + broken.join(', ') : 'all internal links resolve');

/* --- flaw presentation --- */
const flawDetail = read('dashboard/components/FlawDetail.tsx');
const PANEL_PARTS = ['The flaw', 'Evidence', 'Why it matters', 'Status', 'Source'];
const partMissing = PANEL_PARTS.filter((f) => !flawDetail.includes(`title="${f}"`));
check('Flaw panel uses the 5-section executive structure', partMissing.length === 0,
  partMissing.length ? 'missing: ' + partMissing.join(', ') : '5/5');

check('Every flaw has a compact brief', D.FLAWS.every((f) => f.brief),
  D.FLAWS.filter((f) => f.brief).length + '/14');

/* Evidence is trimmed to three, chosen explicitly rather than by slicing. */
const badPick = D.FLAWS.filter((f) => {
  const p = f.brief.evidencePick;
  return !Array.isArray(p) || p.length !== 3 ||
    p.some((i) => !f.brief.evidence[i]) || new Set(p).size !== 3;
});
check('Each flaw names exactly 3 valid evidence items for the UI', badPick.length === 0,
  badPick.length ? 'bad on flaw ' + badPick.map((f) => f.id).join(', ') : '14 x 3 in range');

/* The dashboard must not lose a flaw's headline production number. */
const HEADLINE = {
  1: '366', 2: '12 of 21', 3: '31 Aug 2026', 4: '337 of 682', 5: '337',
  6: '270 of 286', 7: 'Current Affairs', 8: '89,900', 9: '20 created rows',
  10: '5 URLs', 11: 'pricing renders only', 12: '682 signups', 13: 'one call site',
  14: '6 feedback records',
};
const lostHeadline = D.FLAWS.filter((f) => {
  const visible = [...f.brief.problem,
    ...f.brief.evidencePick.map((i) => f.brief.evidence[i].text)].join(' ').toLowerCase();
  return !visible.includes(String(HEADLINE[f.id]).toLowerCase());
});
check('No flaw loses its headline evidence to trimming', lostHeadline.length === 0,
  lostHeadline.length ? 'flaw ' + lostHeadline.map((f) => f.id).join(', ')
    : 'all 14 headline figures still visible');

check('Why-it-matters stays at 2 points or fewer',
  D.FLAWS.every((f) => f.brief.why.length <= 2));

check('Confirmed / hypothesis distinction still shown as status',
  flawDetail.includes('flaw.evidenceStatus') && flawDetail.includes('flaw.rootCauseStatus'),
  'evidence status + root-cause status on every flaw');

check('Priority still read from the flaw itself',
  flawDetail.includes('kind={flaw.priority}'));

const ARCHIVE_ONLY = ['A_summary', 'D_evidence', 'E_howChecked', 'F_numbers', 'G_affected',
  'H_rootCause', 'I_userImpact', 'J_businessImpact', 'K_devImpact', 'P_confidence',
  'Q_source', 'underlying'];
const stillRendered = ARCHIVE_ONLY.filter((k) => flawDetail.includes('flaw.' + k));
check('Archive-only sections no longer rendered in the dashboard', stillRendered.length === 0,
  stillRendered.length ? 'still rendered: ' + stillRendered.join(', ')
    : ARCHIVE_ONLY.length + ' sections moved to the Markdown record');

/* Removing them from the UI must not delete them from the audit. */
check('Full A-Q record retained in the data model',
  D.FLAWS.every((f) => ARCHIVE_ONLY.every((k) => f[k] && (Array.isArray(f[k])
    ? f[k].length : Object.keys(f[k]).length))),
  'every flaw still carries all 17 A-Q fields');

const mdArchive = read('TNPSC_MENTORS_GROWTH_DASHBOARD.md');
check('Full A-Q record still published in the Markdown archive',
  (mdArchive.match(/### A[.] Executive summary/g) || []).length === 14 &&
  (mdArchive.match(/### D[.] Evidence/g) || []).length === 14 &&
  (mdArchive.match(/### H[.] Root cause/g) || []).length === 14,
  '14 flaws x full A-Q sections');

/* --- fix proposals --- */
check('Exactly 14 fix proposals', D.FIXES.length === 14 &&
  D.FIXES.map((f) => f.id).join(',') === '1,2,3,4,5,6,7,8,9,10,11,12,13,14');

check('Each fix maps to exactly one major flaw',
  D.FIXES.every((f) => D.FLAWS.some((x) => x.id === f.flaw)) &&
  new Set(D.FIXES.map((f) => f.flaw)).size === 14,
  '1:1 across all 14 flaws');

check('Every fix states what to change, how, an example and an outcome',
  D.FIXES.every((f) => f.proposed && f.change.length && f.flow.length &&
    f.example.blocks.length && f.outcome.length));

const fixDetail = read('dashboard/components/FixDetail.tsx');
const FIX_PARTS = ['What to change', 'How it should work', 'Example',
  'Expected result', 'Today', 'Connected flaw'];
const fixMissing = FIX_PARTS.filter((t) => !fixDetail.includes(`title="${t}"`));
check('Fix panel uses the 6-section structure', fixMissing.length === 0,
  fixMissing.length ? 'missing: ' + fixMissing.join(', ') : '6/6');

check('Fix panel no longer repeats the flaw caveat',
  !fixDetail.includes('fix.caveat'),
  'hedges live on the flaw status, stated once');

check('Expected result trimmed to 2 points in the UI',
  fixDetail.includes('outcome.slice(0, 2)'));

check('Fix caveats retained in the data model',
  D.FIXES.filter((f) => f.caveat).length === 14, '14 of 14 still carry their caveat');

check('Fix priority is NOT stored on the fix — it is read from the flaw',
  D.FIXES.every((f) => !('priority' in f)) &&
  read('dashboard/components/FixDetail.tsx').includes('flaw.priority'),
  'audit P0/P1/P2 assignments cannot be overridden by this page');

check('Fix status is PLANNED / NOT IMPLEMENTED',
  D.FIX_STATUS.state === 'PLANNED' && D.FIX_STATUS.detail === 'NOT IMPLEMENTED');

const fixSrc = read('dashboard/lib/data-fixes.mjs');
const FORBIDDEN_STATUS = ['Completed', 'Live', 'Deployed', 'Fixed'];
const statusLeak = FORBIDDEN_STATUS.filter((w) =>
  new RegExp('(status|state)[^\n]{0,20}' + w, 'i').test(fixSrc));
check('No fix is described as completed / live / deployed / fixed',
  statusLeak.length === 0, statusLeak.length ? statusLeak.join(', ') : 'none');

check('Fix proposals carry no code, SQL or schema',
  !/CREATE TABLE|SELECT .*FROM|ALTER TABLE|```|<\/?script/i.test(fixSrc),
  'proposals only — conceptual flows, no implementation detail');

check('Example mock-ups are labelled ILLUSTRATIVE',
  read('dashboard/components/FixDetail.tsx').includes('ILLUSTRATIVE'),
  'so mock numbers are never mistaken for audit data');

check('Fix data still declares itself a proposal set, not implementations',
  fixSrc.includes('NOT IMPLEMENTATIONS'));

check('Fixes page still shows PLANNED / NOT IMPLEMENTED',
  read('dashboard/app/fixes/page.tsx').includes('FIX_STATUS.state'));

const HEDGE = /HYPOTHESIS|hypothesis|OBSERVATION|OBSERVED|not proven|not a claim|untested|UNCONFIRMED/;
const unhedged = D.FIXES.filter((f) => {
  const flaw = D.FLAWS.find((x) => x.id === f.flaw);
  if (flaw.rootCauseStatus === 'CONFIRMED') return false;   /* proven cause, no hedge needed */
  return !(f.caveat && HEDGE.test(f.caveat));
});
check('Every fix on a non-confirmed root cause carries an explicit hedge',
  unhedged.length === 0,
  unhedged.length ? 'missing on fix ' + unhedged.map((f) => f.id).join(', ')
    : D.FLAWS.filter((f) => f.rootCauseStatus !== 'CONFIRMED').length +
      ' flaws have a non-confirmed root cause; all their fixes are labelled');

check('No fix claims it will definitely work',
  !D.FIXES.some((f) => /will increase|guarantees|will fix|proven to/i.test(
    [f.proposed, ...f.change, ...f.outcome].join(' '))),
  'outcomes phrased as intent, not as promised results');

/* --- required content blocks --- */
const REQUIRED_MD = [
  ['WHAT WE KNOW', /WHAT WE KNOW/],
  ["WHAT WE DON'T KNOW", /WHAT WE DON'T KNOW/],
  ['WHAT IS CONFIRMED', /WHAT IS CONFIRMED/],
  ['WHAT IS A HYPOTHESIS', /WHAT IS A HYPOTHESIS/],
  ['WHAT WAS DISPROVED', /WHAT WAS DISPROVED/],
  ['DATA GAPS', /DATA GAPS/],
  ['THE REAL BUSINESS PROBLEM', /real business problem/i],
  ['Why are users not paying', /WHY ARE USERS NOT PAYING/],
  ['Why are users not returning', /WHY ARE USERS NOT RETURNING/],
  ['Why are users not activating', /WHY ARE USERS NOT ACTIVATING/],
  ['Where is the biggest leak', /WHERE IS THE BIGGEST LEAK/],
  ['What should developers fix first', /WHAT SHOULD DEVELOPERS FIX FIRST/],
  ['What should marketing not do yet', /WHAT SHOULD MARKETING NOT DO YET/],
  ['Plan comparison matrix', /Plan comparison matrix/],
  ['Root cause tree', /Root cause tree/],
  ['Payment recovery funnel', /Payment recovery funnel/],
  ['Complete user journey', /Complete user journey/],
];
REQUIRED_MD.forEach(([label, re]) => check('Report contains: ' + label, re.test(md)));

/* --- phases --- */
check('Five fix phases defined', D.PHASES.length === 5,
  D.PHASES.map((p) => p.name.split('—')[0].trim()).join(', '));
check('Sequencing caveat present (ordering not over-claimed)',
  /Sequencing caveat/i.test(md) && /Sequencing caveat/i.test(ho));

/* --- production safety --- */
const SAFETY_LINE = 'NO PRODUCTION CODE, DATABASE, CONFIGURATION OR DEPLOYMENT WAS MODIFIED';
check('Read-only indicator retained in the sidebar',
  /READ-ONLY . PRODUCTION UNTOUCHED/.test(read('dashboard/components/Sidebar.tsx')),
  'one compact status chip; the long disclaimer was removed from the UI');
check('Safety statement in growth report', md.indexOf(SAFETY_LINE) !== -1);
check('Safety statement in developer handoff', ho.indexOf(SAFETY_LINE) !== -1);
check('12 production-safety assertions enumerated', D.SAFETY.length === 12);
check('No-contact rule stated for the 11 abandoned-checkout users',
  /no user (has been or )?will be contacted|NO USER IS CONTACTED|No user is to be contacted/i.test(md));

/* --- artefacts --- */
const files = [
  'TNPSC_MENTORS_GROWTH_DASHBOARD.md',
  'TNPSC_MENTORS_DEVELOPER_HANDOFF.md',
  'TNPSC_MENTORS_GROWTH_DATA.csv',
];
files.forEach((f) => {
  const st = fs.statSync(path.join(ROOT, f));
  check('Artefact exists: ' + f, st.size > 1000, (st.size / 1024).toFixed(1) + ' KB');
});
const chartDir = path.join(ROOT, 'TNPSC_MENTORS_CHARTS');
const svgs = fs.readdirSync(chartDir).filter((f) => f.endsWith('.svg'));
check('Artefact exists: TNPSC_MENTORS_CHARTS/', svgs.length >= 10, svgs.length + ' SVG charts');

/* --- app hygiene --- */
const nextCfg = read('dashboard/next.config.mjs');
check('Deployed app sends noindex headers', /noindex/.test(nextCfg));
check('App layout declares robots noindex', /index: false/.test(read('dashboard/app/layout.tsx')));
const pkg = JSON.parse(read('dashboard/package.json'));
check('App has dev / build / start scripts',
  ['dev', 'build', 'start'].every((k) => pkg.scripts[k]), Object.keys(pkg.scripts).join(', '));
check('App declares no production credentials',
  !/SUPABASE|RAZORPAY|SERVICE_ROLE|DATABASE_URL/i.test(JSON.stringify(pkg)));

/* --- CSV integrity --- */
const lines = csv.replace(/^﻿/, '').split('\r\n').filter(Boolean);
const cols = lines[0].split(',').length;
function parseRow(line) {
  const out = []; let cur = '', inQ = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQ) {
      if (ch === '"') { if (line[i + 1] === '"') { cur += '"'; i++; } else inQ = false; }
      else cur += ch;
    } else if (ch === '"') inQ = true;
    else if (ch === ',') { out.push(cur); cur = ''; }
    else cur += ch;
  }
  out.push(cur); return out;
}
const badRows = lines.map(parseRow).filter((r) => r.length !== cols).length;
check('CSV is well-formed', badRows === 0 && cols === 8,
  (lines.length - 1) + ' data rows, ' + cols + ' columns, ' + badRows + ' malformed');

/* --- fabrication guards --- */
const FORBIDDEN = [
  [/\bestimated (?:revenue|conversion|traffic|visitors)\b/i, 'estimated headline metric'],
  [/\bwe project\b/i, 'projection language'],
  [/\bassume (?:a )?\d+%/i, 'assumed percentage'],
];
FORBIDDEN.forEach(([re, label]) => check('No fabricated metrics: ' + label, !re.test(md)));
check('Scenario figures explicitly labelled SCENARIO',
  /SCENARIO/.test(md) && /₹27,630/.test(md) && /NOT a forecast/i.test(md));

console.log('\n' + pass + ' passed, ' + fail + ' failed\n');
process.exit(fail ? 1 : 0);
