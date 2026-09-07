import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
import D from '../dashboard/lib/data.mjs';

const ROOT = path.join(__dirname, '..');

/* Escape pipes so table cells never break the row. */
const c = (s) => String(s == null ? '' : s).replace(/\|/g, '\\|').replace(/\n+/g, ' ').trim();
const tbl = (cols, rows) =>
  '| ' + cols.join(' | ') + ' |\n|' + cols.map(() => '---').join('|') + '|\n' +
  rows.map((r) => '| ' + r.map(c).join(' | ') + ' |').join('\n') + '\n';
const list = (items) => items.map((i) => '- ' + String(i).replace(/\n+/g, ' ')).join('\n') + '\n';
const nlist = (items) => items.map((i, n) => (n + 1) + '. ' + String(i).replace(/\n+/g, ' ')).join('\n') + '\n';

const SAFETY_BANNER =
`> **THIS REPORT WAS GENERATED USING READ-ONLY DATA.**
> **NO PRODUCTION CODE, DATABASE, CONFIGURATION OR DEPLOYMENT WAS MODIFIED.**
`;

/* ========================================================================= */
/* 1. GROWTH DASHBOARD                                                       */
/* ========================================================================= */
function growthDashboard() {
  const L = [];
  const p = (s) => L.push(s);

  p('# TNPSC Mentors — Growth & Product Health Dashboard');
  p('');
  p(SAFETY_BANNER);
  p(`**Audit period:** ${D.AUDIT.periodStart} → ${D.AUDIT.periodEnd}`);
  p(`**Production snapshot:** ${D.AUDIT.prodSnapshot}`);
  p(`**Compiled:** ${D.AUDIT.compiled}`);
  p(`**Sources:** Stage 1 external audit · Stage 2 codebase & schema audit · Stage 3 production database (read-only SELECT) · first-time-user walkthrough · latest acquisition verification · latest feedback verification · founder-provided context`);
  p('');
  p('**Companion files:** `TNPSC_MENTORS_DASHBOARD.html` (interactive) · `TNPSC_MENTORS_DEVELOPER_HANDOFF.md` · `TNPSC_MENTORS_GROWTH_DATA.csv` · `TNPSC_MENTORS_CHARTS/`');
  p('');
  p('---');
  p('');

  /* -- Contents -- */
  p('## Contents');
  p('');
  p(list([
    '[1. Executive overview](#1-executive-overview)',
    '[2. What is actually happening](#2-what-is-actually-happening)',
    '[3. Core funnel](#3-core-funnel)',
    '[4. Activation](#4-activation)',
    '[5. Retention](#5-retention)',
    '[6. Monetization](#6-monetization)',
    '[7. Acquisition](#7-acquisition)',
    '[8. Analytics health](#8-analytics-health)',
    '[9. Customer feedback](#9-customer-feedback)',
    '[10. The 14 major flaws](#10-the-14-major-flaws)',
    '[11. Complete user journey](#11-complete-user-journey)',
    '[12. Root cause tree](#12-root-cause-tree)',
    '[13. Priority matrix](#13-priority-matrix)',
    '[14. What to fix first](#14-what-to-fix-first)',
    '[15. Before → after KPI model](#15-before--after-kpi-model)',
    '[16. 30 / 60 / 90 day plan](#16-30--60--90-day-plan)',
    '[17. Data sources & methodology](#17-data-sources--methodology)',
    '[18. Data quality](#18-data-quality)',
    '[19. The real business problem](#19-the-real-business-problem)',
  ]));
  p('---');
  p('');

  /* -- 1 Overview -- */
  p('## 1. Executive overview');
  p('');
  p('**682 registered users. 83 days. ₹899 of all-time revenue — and every rupee of it internally generated. Externally-acquired paying customers: 0. In the last 30 days, 366 people signed up and none of them paid anything.**');
  p('');
  p('### Current verified baseline — PRODUCTION VERIFIED');
  p('');
  p(tbl(['Metric', 'Value', 'Evidence', 'Source', 'What it means'],
    D.BASELINE.map((b) => [b.label, `**${b.value}**`, b.tag, '`' + b.source + '`', b.note])));
  p('### Last 30 days');
  p('');
  p(tbl(['Metric', 'Value'], [
    ['Signups, last 30 days', `**${D.ACQUISITION.last30Signups}**`],
    ['New paying customers from them', `**${D.ACQUISITION.last30Paid}**`],
    ['Signups, last 7 days', `**${D.ACQUISITION.last7Signups}**`],
  ]));
  p('### Secondary production figures');
  p('');
  p(tbl(['Metric', 'Value', 'What it actually means'],
    D.SECONDARY.map((s) => [s.label, s.value, s.note])));
  p('---');
  p('');

  /* -- 2 Diagnosis -- */
  p('## 2. What is actually happening');
  p('');
  p(`**${D.DIAGNOSIS.headline}**`);
  p('');
  D.DIAGNOSIS.body.forEach((b) => { p(b); p(''); });
  p('```');
  p(`${D.DIAGNOSIS.keyContrast.left} ${D.DIAGNOSIS.keyContrast.leftLabel}`);
  p('        ↓');
  p(`${D.DIAGNOSIS.keyContrast.right} ${D.DIAGNOSIS.keyContrast.rightLabel}`);
  p('```');
  p('');
  p('### Signup trajectory');
  p('');
  p('```');
  D.SIGNUPS_MONTHLY.forEach((m) => {
    const bar = '█'.repeat(Math.max(1, Math.round(m.signups / 10)));
    p(`${m.month.replace(' 2026', '').padEnd(10)} ${String(m.signups).padStart(4)}  ${bar}${m.partial ? '  ← PARTIAL' : ''}`);
  });
  p('```');
  p('');
  p(tbl(['Month', 'Signups', 'Days', 'Per day', 'Note'],
    D.SIGNUPS_MONTHLY.map((m) => [m.month + (m.partial ? ' **(PARTIAL)**' : ''), m.signups, m.days === null ? '5–7' : m.days, m.perDay, m.note])));
  p(`> **September is a partial month.** ${D.DIAGNOSIS.septemberWarning}`);
  p('');
  p(`> **${D.ACQUISITION.reconciliation.title}**`);
  p(`> ${D.ACQUISITION.reconciliation.body}`);
  p(`> **${D.ACQUISITION.reconciliation.status}**`);
  p('');
  p('### How to read the trend');
  p('');
  p(tbl(['Label', 'Statement'], D.ACQUISITION.trendCaveats.map((t) => [`**${t.label}**`, t.text])));
  p('---');
  p('');

  /* -- 3 Funnel -- */
  p('## 3. Core funnel');
  p('');
  p('```');
  p('682   Registered users');
  p(' ↓    −337');
  p('345   Started ≥1 test              50.6% of 682');
  p(' ↓    −59');
  p('286   Completed ≥1 test            82.9% of 345 · 41.9% of 682');
  p(' ↓    −270');
  p(' 16   Returned on a 2nd day        5.6% of 286 · 2.3% of 682   [FLOOR]');
  p('');
  p('      ✗ PRICING VIEWED — DATA NOT AVAILABLE (not instrumented)');
  p('      ✗ NO VALID DENOMINATOR ACROSS THIS BOUNDARY');
  p('');
  p(' 11   Reached checkout             11 people / 21 attempts · 1.6% of 682');
  p(' ↓    −20 attempts');
  p('  1   Paid                         9.1% of 11 people · 4.8% of 21 attempts');
  p(' ↓    −1 (founder-generated)');
  p('  0   EXTERNALLY-ACQUIRED PAID     0.00% of 682');
  p('```');
  p('');
  p(tbl(['Stage', 'Count', 'Of previous', 'Of 682', 'Drop', 'Source', 'Confidence'],
    D.FUNNEL.map((f) => [f.stage, f.display, f.ofPrev || '—', f.ofTotal || '—', f.drop || '—', f.source, f.confidence])));
  p('### Denominator rules — read before quoting any percentage');
  p('');
  p(list(D.FUNNEL_CAVEATS));
  p('### Per-stage notes');
  p('');
  p(tbl(['Stage', 'Note'], D.FUNNEL.map((f) => [f.stage, f.note])));
  p('---');
  p('');

  /* -- 4 Activation -- */
  p('## 4. Activation');
  p('');
  p('**337 of 682 registered users — 49.4% — have never started a single test.** This is the largest absolute loss anywhere in the funnel, and it happens after a signup that is confirmed working.');
  p('');
  p('```');
  p('682 registered');
  p('345 started       50.6%');
  p('337 did NOT start 49.4%   ← 337 / 682 = 49.4%');
  p('286 completed     41.9% of 682 · 82.9% of the 345 who started');
  p('```');
  p('');
  p('> **Disproved — do not spend effort here.** Signup friction was the obvious explanation and it is wrong. Registration was verified working end-to-end by the walkthrough and confirmed by the founder. All 337 of these users completed a clean registration and then stopped, which points squarely at orientation rather than at the signup form.');
  p('');
  p('### Recommended KPIs');
  p('');
  p(tbl(['KPI', 'Current', 'Calculation', 'Target'],
    D.ACTIVATION.kpis.map((k) => [k.name, k.current, '`' + k.calc + '`', k.target])));
  p('Both rates must be measured on **weekly signup cohorts**, never as a lifetime blend — 53.7% of the base registered in the last 30 days, so a blended figure will not move visibly even if the product change works.');
  p('');
  p('---');
  p('');

  /* -- 5 Retention -- */
  p('## 5. Retention');
  p('');
  p('**270 of 286 test-completers — 94.4% — never came back on a second day. Only 16 of 682 users have ever had two active days.**');
  p('');
  p(tbl(['Basis', 'Calculation', 'Rate', 'Reading'],
    D.RETENTION.rates.map((r) => [r.basis, '`' + r.calc + '`', `**${r.rate}**`, r.note])));
  p('### Cohort retention');
  p('');
  p(tbl(['Cohort day', 'Value'], D.RETENTION.cohorts.map((x) => [x.label, `**${x.value}**`])));
  p('The query has not been run. The underlying data exists in `daily_activity` and `profiles` — this is a reporting gap, not a data gap, and it is the single cheapest way to separate real churn from cohort immaturity.');
  p('');
  p('### Caveats that must travel with every number above');
  p('');
  p(list(D.RETENTION.caveats));
  p('---');
  p('');

  /* -- 6 Monetization -- */
  p('## 6. Monetization');
  p('');
  p('### Revenue');
  p('');
  p(tbl(['Metric', 'Value', 'Evidence', 'Note'],
    D.REVENUE.map((r) => [r.label, `**${r.value}**`, r.tag, r.note])));
  p('### Internal vs. external customers');
  p('');
  p(tbl(['Segment', 'Count', 'Revenue', 'Evidence', 'Note'],
    D.CUSTOMER_SEGMENTATION.map((s) => [s.segment,
      s.count === null ? 'PENDING' : s.count, s.revenue === null ? 'PENDING' : s.revenue, s.tag, s.note || ''])));
  p('### Conversion, every way it can honestly be expressed');
  p('');
  p(tbl(['Basis', 'Calculation', 'Rate'],
    D.CONVERSION_RATES.map((x) => [x.basis, '`' + x.calc + '`', `**${x.rate}**`])));
  p('With 21 checkout attempts and 1 conversion, **no per-plan or overall rate is statistically meaningful**. These are demand signals, not rates.');
  p('');
  p('### Plan comparison matrix');
  p('');
  p(tbl(['Plan', 'Price', 'Duration', 'Target audience', 'Features / included tests', 'Credits', 'Rank Booster', 'Vettri', 'Mock', 'Attempts', 'Paid', 'Revenue'],
    D.PLANS.map((x) => [x.plan, x.price, x.duration, x.audience, x.features + (x.tests ? ' · ' + x.tests : ''),
      x.credits, x.rankBooster, x.vettri, x.mock,
      x.attempts === null ? '—' : x.attempts, x.paid === null ? '—' : x.paid, x.revenue || '—'])));
  p('The catalogue has **5 paid price points** but the payments ledger records **4 distinct plan keys** — the two Vettri variants appear to share one key, so their split cannot be recovered. **[DATA GAP]**');
  p('');
  D.PLANS.filter((x) => x.note).forEach((x) => p(`- **${x.plan}** — ${x.note}`));
  p('');
  p('### Where the plans overlap');
  p('');
  p(tbl(['Entitlement rule', 'Status', 'Why it confuses a buyer'],
    D.ENTITLEMENT_OVERLAP.map((e) => ['`' + e.rule + '`', `**${e.status}**`, e.note])));
  p('> **Do not restructure the plans yet.** Redesigning a pricing architecture on 21 attempts and 1 sale would be fitting to noise. Make the plans *describable* first, instrument per-plan demand, then decide. And do not change prices: with zero external conversions at any price point there is no evidence that price is the binding constraint.');
  p('');
  p(`### ${D.PAYMENTS_RECONCILIATION.title}`);
  p('');
  p(tbl(['Figure', 'Value', 'Evidence'],
    D.PAYMENTS_RECONCILIATION.rows.map((r) => [r.label, `**${r.value}**`, r.tag])));
  p(D.PAYMENTS_RECONCILIATION.note);
  p('');
  p('### Checkout abandonment — attempt timing');
  p('');
  p(tbl(['Pattern', 'Users', 'Attempts', 'Reading'],
    D.PAYMENTS_RECONCILIATION.attemptTiming.map((a) => [a.pattern, a.users, a.attempts, a.reading])));
  p('### Payment recovery funnel');
  p('');
  p('```');
  p('Checkout reached      11 people');
  p('        ↓');
  p('Payment created       21 attempts   (20 abandoned + 1 completed)');
  p('        ↓');
  p('Paid                   1            founder-generated');
  p('        ↓');
  p('UNRECOVERED           20 attempts / 11 people   ← NO MECHANISM EXISTS');
  p('```');
  p('');
  p('No cleanup, retry, reminder or follow-up exists. The oldest unresolved attempt is 79 days old. **No user has been or will be contacted as part of this audit.**');
  p('');
  p('---');
  p('');

  /* -- 7 Acquisition -- */
  p('## 7. Acquisition');
  p('');
  p('The one part of this business that is demonstrably working — and nobody can say why, because no acquisition source has ever been captured.');
  p('');
  p(tbl(['Metric', 'Value', 'Note'], [
    ['Signups, last 30 days', '**366**', '53.7% of the entire user base'],
    ['Paying customers from them', '**0**', '0.00% conversion'],
    ['Signups, last 7 days', '**50**', '7.1 per day'],
    ['August signups', '**396**', 'Best month on record · +75.2% over July'],
    ['Signups with a known source', '**0**', 'No attribution column exists anywhere in the schema'],
  ]));
  p('### External discoverability');
  p('');
  p(tbl(['Metric', 'Value', 'Evidence', 'Note'],
    D.EXTERNAL.map((e) => [e.metric, e.value, e.tag, e.note])));
  p('> **Sequencing — deliberately counterintuitive.** Organic discoverability is a genuine weakness and it is **not** the current bottleneck. Acquisition is growing without it. Directing more traffic into a funnel with 0.00% external conversion converts effort into nothing. SEO is Phase 5 in this plan for exactly that reason.');
  p('');
  p('---');
  p('');

  /* -- 8 Analytics -- */
  p('## 8. Analytics health');
  p('');
  p('The instrumentation that exists is well built — single, correct choke-points. It is **incomplete, not sloppy.** But the gaps are load-bearing: several conclusions in this audit are labelled hypothesis purely because the data to test them does not exist.');
  p('');
  p('> **The most urgent gap.** `pricing_viewed` does not fire from the in-app pricing screen. That means the checkout stage of the funnel has **no denominator**, and the entire Phase 1 conversion effort would be **unfalsifiable** if it shipped today. Ship this event first, regardless of its position in the plan.');
  p('');
  p('### Tracking coverage matrix');
  p('');
  p(tbl(['Event', 'Tracked?', 'Reliable?', 'Where', 'Problem'],
    D.TRACKING.map((t) => ['`' + t.event + '`', t.tracked, t.reliable, t.where, t.problem])));
  p('### Metric definition defects');
  p('');
  p(tbl(['Metric', 'Where', 'Defect', 'Consequence'],
    D.METRIC_DEFECTS.map((m) => ['`' + m.metric + '`', '`' + m.where + '`', m.defect, m.impact])));
  p('### Existing vs. required');
  p('');
  p('**Existing and reliable**');
  p('');
  p(list(D.TRACKING.filter((t) => t.reliable === 'Yes').map((t) => '`' + t.event + '` — ' + t.where)));
  p('**Required and missing or broken**');
  p('');
  p(list(D.TRACKING.filter((t) => t.reliable !== 'Yes').map((t) => '`' + t.event + '` — ' + t.problem)));
  p('---');
  p('');

  /* -- 9 Feedback -- */
  p('## 9. Customer feedback');
  p('');
  p(`**${D.FEEDBACK.responses} star ratings from 682 users, averaging ${D.FEEDBACK.average} — and not one word of written text.**`);
  p('');
  p('```');
  p('Ratings received:   ' + D.FEEDBACK.ratings.join(', '));
  p('Average:            ' + D.FEEDBACK.averageCalc);
  p('Written feedback:   0');
  p('Response rate:      6 / 682 = 0.88%');
  p('```');
  p('');
  p(tbl(['Rating', 'Count'], D.FEEDBACK.distribution.map((d) => [d.stars + '★', d.count])));
  p('### Why 4.33 is not actionable');
  p('');
  p(list(D.FEEDBACK.notes));
  p('```');
  p('Rating  →  no reason  →  no qualitative insight');
  p('```');
  p('');
  p('### Recommended feedback design');
  p('');
  p(list([
    'Rating (keep it — it works)',
    '+ "What did you like?"',
    '+ "What should we improve?"',
    '+ "Why didn\'t you upgrade?" — asked of users who reached pricing or abandoned a checkout',
    'Relax the gating so non-activated and non-returning users can be reached at all',
    'Prompt at the abandonment moments, not only at the engaged ones',
  ]));
  p('> **Microsoft Clarity — DATA NOT AVAILABLE.** No access at any point across Stages 1, 2 or 3. Clarity is loaded as a GTM container tag rather than called from the codebase, so even its firing rules live outside the repository. **No behavioural inference anywhere in this report is drawn from Clarity.**');
  p('');
  p('---');
  p('');

  /* -- 10 Flaws -- */
  p('## 10. The 14 major flaws');
  p('');
  p(D.TRACEABILITY.note);
  p('');
  p('### Overview');
  p('');
  p(tbl(['#', 'Title', 'Priority', 'Category', 'Severity', 'Evidence', 'Root cause', 'Confidence', 'Funnel stage', 'One-line diagnosis'],
    D.FLAWS.map((f) => [f.id, `**${f.title}**`, f.priority, f.category, f.severity, f.evidenceStatus,
      f.rootCauseStatus, f.confidence.split(' ')[0], f.funnelStage, f.oneLiner])));
  p('### Traceability — 35 underlying findings → 14 flaws');
  p('');
  p(tbl(['Flaw', 'ID', 'Underlying finding', 'Evidence'],
    D.FLAWS.reduce((acc, f) => acc.concat(f.underlying.map((u, i) =>
      [i === 0 ? `**#${f.id} ${f.title}**` : '', '`' + u.id + '`', u.text, u.tag])), [])));
  p(`### ${D.TRACEABILITY.outOfScope.title}`);
  p('');
  p(D.TRACEABILITY.outOfScope.note);
  p('');
  p(tbl(['ID', 'Item'], D.TRACEABILITY.outOfScope.items.map((i) => ['`' + i.id + '`', i.text])));
  p(`### ${D.TRACEABILITY.closed.title}`);
  p('');
  p(tbl(['Hypothesis', 'Why it is closed'], D.TRACEABILITY.closed.items.map((x) => ['~~' + x.item + '~~', x.why])));
  p('---');
  p('');

  /* -- Flaw detail pages -- */
  D.FLAWS.forEach((f) => {
    p('<a id="flaw-' + f.id + '"></a>');
    p('');
    p('---');
    p('');
    p(`# FLAW #${f.id} — ${f.title}`);
    p('');
    p(tbl(['Priority', 'Category', 'Severity', 'Evidence status', 'Root cause status', 'Confidence', 'Affected funnel stage'],
      [[f.priority, f.category, f.severity, f.evidenceStatus, f.rootCauseStatus, f.confidence.split(' ')[0], f.funnelStage]]));
    p(`> ${f.oneLiner}`);
    p('');
    p('### A. Executive summary');
    p('');
    f.A_summary.forEach((s) => { p(s); p(''); });
    p('### B. What is the flaw?');
    p('');
    p(list(f.B_flaw));
    p('### C. Why does it matter?');
    p('');
    p(list(f.C_why));
    p('### D. Evidence');
    p('');
    p(tbl(['Source', 'Evidence'], f.D_evidence.map((e) => ['**[' + e.tag + ']**', e.text])));
    p('### E. How did we check?');
    p('');
    p(list(f.E_howChecked));
    p('### F. Numbers');
    p('');
    p(tbl(['Metric', 'Calculation', 'Value'], f.F_numbers.map((n) => [n.label, '`' + n.calc + '`', `**${n.value}**`])));
    p('### G. Affected users');
    p('');
    p(tbl(['Dimension', 'Value'], [
      ['Number affected', f.G_affected.count],
      ['Percentage affected', f.G_affected.pct],
      ['Funnel stage affected', f.G_affected.stage],
      ['Note', f.G_affected.note],
    ]));
    p('### H. Root cause');
    p('');
    p('**CONFIRMED root cause**');
    p('');
    p(list(f.H_rootCause.confirmed));
    p('**HYPOTHESIS — unproven**');
    p('');
    p(list(f.H_rootCause.hypothesis));
    p('### I. User impact');
    p('');
    p(list(f.I_userImpact));
    p('### J. Business impact');
    p('');
    p(list(f.J_businessImpact));
    p('### K. Developer impact');
    p('');
    p(list(f.K_devImpact));
    p('### L. Recommended fix');
    p('');
    p(list(f.L_fix));
    p('### M. Implementation direction');
    p('');
    p(list(f.M_implementation));
    p('> **Scope boundary.** This report is a reporting and planning artefact. No production code, database, configuration or deployment has been modified. This section describes what a developer should change; it does not change it.');
    p('');
    p('### N. Success metric');
    p('');
    p(list(f.N_successMetric));
    p('### O. Priority');
    p('');
    p(`**${f.O_priority}**`);
    p('');
    p('### P. Confidence');
    p('');
    p(f.P_confidence);
    p('');
    p('### Q. Source');
    p('');
    p(list(f.Q_source));
  });

  p('---');
  p('');

  /* -- 11 Journey -- */
  p('## 11. Complete user journey');
  p('');
  p('```');
  p(D.JOURNEY.map((j) => j.stage).join('\n  ↓\n'));
  p('```');
  p('');
  p(tbl(['Stage', 'Current state', 'Problem', 'Evidence', 'Metric', 'Fix', 'Leak', 'Flaws'],
    D.JOURNEY.map((j) => [j.stage, j.current, j.problem, j.evidence, j.metric, j.fix,
      j.leak.toUpperCase().replace(/-/g, ' '), j.flaws.map((n) => '#' + n).join(' ') || '—'])));
  p('**Largest absolute leak:** signup → first test (337 users). **Largest proportional leak:** completion → return (94.4%). **Signup and checkout are both CONFIRMED WORKING and are closed** — do not spend engineering time on either.');
  p('');
  p('---');
  p('');

  /* -- 12 Root cause tree -- */
  p('## 12. Root cause tree');
  p('');
  p('```');
  p(`${D.ROOT_TREE.label}   [${D.ROOT_TREE.status}]`);
  D.ROOT_TREE.children.forEach((b, bi) => {
    const lastB = bi === D.ROOT_TREE.children.length - 1;
    p(`${lastB ? '└──' : '├──'} ${b.label}   [${b.status}]`);
    b.children.forEach((ch, ci) => {
      const lastC = ci === b.children.length - 1;
      const pre = lastB ? '    ' : '│   ';
      p(`${pre}${lastC ? '└──' : '├──'} ${ch.label}   [${ch.status}]  → Flaw #${ch.flaw}`);
    });
    if (!lastB) p('│');
  });
  p('```');
  p('');
  p(tbl(['Branch', 'Node', 'Status', 'Detail', 'Flaw'],
    D.ROOT_TREE.children.reduce((acc, b) => acc.concat(b.children.map((ch, i) =>
      [i === 0 ? `**${b.label}**` : '', ch.label, ch.status, ch.detail, '#' + ch.flaw])), [])));
  p('**FACT** — measured directly in production or read directly in source code. **OBSERVATION** — a real pattern; causality not established. **HYPOTHESIS** — plausible, evidence-linked, unproven.');
  p('');
  p('---');
  p('');

  /* -- 13 Matrix -- */
  p('## 13. Priority matrix');
  p('');
  const byId = {}; D.FLAWS.forEach((f) => { byId[f.id] = f; });
  p(tbl(['#', 'Flaw', 'Priority', 'Impact (1–5)', 'Effort (1–5)', 'Category', 'Confidence', 'Placement note'],
    D.MATRIX.slice().sort((a, b) => {
      const pa = byId[a.id].priority, pb = byId[b.id].priority;
      if (pa !== pb) return pa < pb ? -1 : 1;
      return (b.impact - b.effort) - (a.impact - a.effort);
    }).map((m) => {
      const f = byId[m.id];
      return [f.id, f.title, f.priority, m.impact, m.effort === null ? m.effortLabel : m.effort,
        f.category, f.confidence.split(' ')[0], m.note];
    })));
  p('Impact and effort are 1–5 analyst estimates, **not measurements**.');
  p('');
  ['P0', 'P1', 'P2'].forEach((pr) => {
    const l = D.FLAWS.filter((f) => f.priority === pr);
    p(`### ${pr} — ${l.length} flaws`);
    p('');
    p(list(l.map((f) => `**#${f.id} ${f.title}** — ${f.oneLiner}`)));
  });
  p('**P3 technical debt is out of scope** and is listed in section 10 for completeness only.');
  p('');
  p('---');
  p('');

  /* -- 14 Fix first -- */
  p('## 14. What to fix first');
  p('');
  p(`> **Sequencing caveat.** ${D.PHASE_CAVEAT}`);
  p('');
  D.PHASES.forEach((ph) => {
    p(`### ${ph.name}`);
    p('');
    p(`*${ph.rationale}*`);
    p('');
    ph.items.forEach((i) => {
      p(`${i.n}. **${i.title}** — Flaw #${i.flaw} (${byId[i.flaw].priority})`);
      p(`   ${i.why}`);
    });
    p('');
  });
  p('---');
  p('');

  /* -- 15 KPI model -- */
  p('## 15. Before → after KPI model');
  p('');
  p('> **No target number has been invented.** Targets are one of two kinds. **DEFINITIONAL** targets have an obviously correct value — zero expired offers, all five plans counted, all four paid formats logging abandonment, 100% of new signups carrying a source. **EXPERIMENT** targets are marked `BASELINE FIRST — TARGET TO BE SET AFTER EXPERIMENT`, because choosing a number before the baseline exists would be fabrication.');
  p('');
  p(tbl(['Metric', 'Current', 'Calculation', 'Target', 'Type', 'Measurement period', 'Success criteria', 'Flaw'],
    D.KPI_MODEL.map((k) => [k.metric, k.current, '`' + k.calc + '`', k.target, k.targetType, k.period, k.criteria, '#' + k.flaw])));
  p('---');
  p('');

  /* -- 16 30/60/90 -- */
  p('## 16. 30 / 60 / 90 day plan');
  p('');
  D.PLAN_30_60_90.forEach((w) => {
    p(`### ${w.window}`);
    p('');
    p(list(w.items));
  });
  p('### What NOT to do yet');
  p('');
  p(list(D.CONCLUSION.questions[5].a));
  p('---');
  p('');

  /* -- 17 Methodology -- */
  p('## 17. Data sources & methodology');
  p('');
  p('### Production safety');
  p('');
  p(list(D.SAFETY));
  p('### Evidence tags');
  p('');
  p(tbl(['Tag', 'Source', 'What it means'], D.EVIDENCE_TAGS.map((e) => ['`[' + e.tag + ']`', e.name, e.desc])));
  p('### Sources, coverage and limits');
  p('');
  p(tbl(['Source', 'Covers', 'Access', 'Limits'],
    D.METHODOLOGY_SOURCES.map((s) => [s.source, s.covers, s.access, s.limits])));
  p('### Metric-by-metric source');
  p('');
  p(tbl(['Metric', 'Value', 'Evidence', 'Query / source'],
    D.BASELINE.map((b) => [b.label, b.value, b.tag, '`' + b.source + '`'])
      .concat(D.SECONDARY.map((s) => [s.label, s.value, s.tag, s.note]))));
  p('---');
  p('');

  /* -- 18 Data quality -- */
  p('## 18. Data quality');
  p('');
  p('### WHAT WE KNOW');
  p('');
  p(list(D.DATA_QUALITY.know));
  p('### WHAT WE DON\'T KNOW');
  p('');
  p(list(D.DATA_QUALITY.dontKnow));
  p('### WHAT IS CONFIRMED');
  p('');
  p(nlist(D.DATA_QUALITY.confirmed));
  p('### WHAT IS A HYPOTHESIS');
  p('');
  p(nlist(D.DATA_QUALITY.hypotheses));
  p('### WHAT WAS DISPROVED');
  p('');
  p(tbl(['Claim', 'Disproved by'], D.DATA_QUALITY.disproved.map((d) => ['~~' + d.claim + '~~', d.by])));
  p('### DATA GAPS');
  p('');
  p(tbl(['Gap', 'Why', 'Recoverable?'], D.DATA_QUALITY.gaps.map((g) => [g.gap, g.why, g.recoverable])));
  p('---');
  p('');

  /* -- 19 Conclusion -- */
  p('## 19. The real business problem');
  p('');
  D.CONCLUSION.summary.forEach((s) => { p(s); p(''); });
  D.CONCLUSION.questions.forEach((q) => {
    p(`### ${q.q}`);
    p('');
    p(list(q.a));
  });
  p('---');
  p('');
  p('## Final statement');
  p('');
  p('**REPORT/DASHBOARD GENERATED USING READ-ONLY DATA. NO PRODUCTION CODE, DATABASE, CONFIGURATION OR DEPLOYMENT WAS MODIFIED.**');
  p('');
  p('*Internal analysis artefact for the TNPSC Mentors development team. Not deployed and not for public distribution.*');
  p('');

  return L.join('\n');
}

/* ========================================================================= */
/* 2. DEVELOPER HANDOFF                                                      */
/* ========================================================================= */
function developerHandoff() {
  const L = [];
  const p = (s) => L.push(s);
  const byId = {}; D.FLAWS.forEach((f) => { byId[f.id] = f; });

  p('# TNPSC Mentors — Developer Handoff');
  p('');
  p(SAFETY_BANNER);
  p('This document is written so a developer can understand and scope each issue **without reading the full audit**. Every block states what exists today, what should exist, what must be instrumented, and how the change will be judged.');
  p('');
  p(`**Audit period:** ${D.AUDIT.periodStart} → ${D.AUDIT.periodEnd} · **Compiled:** ${D.AUDIT.compiled}`);
  p('');
  p('> **DO NOT IMPLEMENT FROM THIS DOCUMENT DIRECTLY.** It is a reporting and planning artefact. No production code, database, configuration, analytics or deployment was modified to produce it, and none should be modified by it. These blocks describe work to schedule, review and implement deliberately.');
  p('');
  p('---');
  p('');

  p('## Baseline every metric below is measured against');
  p('');
  p(tbl(['Metric', 'Value'], D.BASELINE.map((b) => [b.label, `**${b.value}**`])));
  p('---');
  p('');

  p('## Build order');
  p('');
  D.PHASES.forEach((ph) => {
    p(`### ${ph.name}`);
    p('');
    p(`*${ph.rationale}*`);
    p('');
    p(tbl(['#', 'Work item', 'Flaw', 'Priority', 'Why here'],
      ph.items.map((i) => [i.n, i.title, '#' + i.flaw, byId[i.flaw].priority, i.why])));
  });
  p(`> **Sequencing caveat.** ${D.PHASE_CAVEAT}`);
  p('');
  p('---');
  p('');

  p('## Handoff blocks');
  p('');
  D.HANDOFF.forEach((h) => {
    const f = byId[h.flaw];
    p(`### Flaw #${h.flaw} — ${f.title}  \`${h.priority}\``);
    p('');
    p(tbl(['Field', 'Detail'], [
      ['**Feature / module**', h.module],
      ['**Relevant components**', '`' + h.components + '`'],
      ['**Tables / data**', '`' + h.tables + '`'],
      ['**Current behaviour**', h.current],
      ['**Problem**', h.problem],
      ['**Expected behaviour**', h.expected],
      ['**Analytics events required**', '`' + h.events + '`'],
      ['**Database data required**', h.data],
      ['**Success metric**', h.metric],
    ]));
    p('**Acceptance criteria**');
    p('');
    p(h.acceptance.map((a) => '- [ ] ' + a).join('\n'));
    p('');
    p(`*Full analysis: see Flaw #${h.flaw} in \`TNPSC_MENTORS_GROWTH_DASHBOARD.md\`.*`);
    p('');
    p('---');
    p('');
  });

  p('## Instrumentation checklist — the events that gate everything else');
  p('');
  p(tbl(['Event', 'Status today', 'Why it matters'],
    D.TRACKING.filter((t) => t.reliable !== 'Yes').map((t) => ['`' + t.event + '`', t.tracked, t.problem])));
  p('> **Ship `pricing_viewed` first.** Without it the checkout stage of the funnel has no denominator, and the entire Phase 1 conversion effort would be unfalsifiable.');
  p('');
  p('---');
  p('');

  p('## Metric definition defects to correct');
  p('');
  p(tbl(['Metric', 'Where', 'Defect', 'Consequence'],
    D.METRIC_DEFECTS.map((m) => ['`' + m.metric + '`', '`' + m.where + '`', m.defect, m.impact])));
  p('---');
  p('');

  p('## Closed — do not spend engineering time here');
  p('');
  p(tbl(['Hypothesis', 'Why it is closed'], D.TRACEABILITY.closed.items.map((x) => ['~~' + x.item + '~~', x.why])));
  p('---');
  p('');

  p('## Success metrics, consolidated');
  p('');
  p(tbl(['Metric', 'Current', 'Target', 'Type', 'Flaw'],
    D.KPI_MODEL.map((k) => [k.metric, k.current, k.target, k.targetType, '#' + k.flaw])));
  p('---');
  p('');
  p('**REPORT/DASHBOARD GENERATED USING READ-ONLY DATA. NO PRODUCTION CODE, DATABASE, CONFIGURATION OR DEPLOYMENT WAS MODIFIED.**');
  p('');

  return L.join('\n');
}

fs.writeFileSync(path.join(ROOT, 'TNPSC_MENTORS_GROWTH_DASHBOARD.md'), growthDashboard(), 'utf8');
fs.writeFileSync(path.join(ROOT, 'TNPSC_MENTORS_DEVELOPER_HANDOFF.md'), developerHandoff(), 'utf8');
console.log('TNPSC_MENTORS_GROWTH_DASHBOARD.md written');
console.log('TNPSC_MENTORS_DEVELOPER_HANDOFF.md written');
