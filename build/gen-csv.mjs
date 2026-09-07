import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
import D from '../dashboard/lib/data.mjs';

const ROOT = path.join(__dirname, '..');

/* Long/tidy format: one row per fact, so the file can be pivoted in any tool. */
const HEAD = ['dataset', 'metric', 'value', 'calculation', 'evidence', 'status', 'source', 'note'];
const rows = [];
const add = (dataset, metric, value, calculation, evidence, status, source, note) =>
  rows.push([dataset, metric, value, calculation || '', evidence || '', status || '', source || '', note || '']);

const q = (v) => {
  const s = String(v == null ? '' : v).replace(/\r?\n/g, ' ').trim();
  return /[",]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
};

/* ---- audit context ---- */
add('audit_context', 'Product', D.AUDIT.product, '', '', '', '', '');
add('audit_context', 'Audit period start', D.AUDIT.periodStart, '', '', '', '', '');
add('audit_context', 'Audit period end', D.AUDIT.periodEnd, '', '', '', '', '');
add('audit_context', 'Production snapshot', D.AUDIT.prodSnapshot, '', 'PROD', '', '', 'read-only SELECT');
add('audit_context', 'Compiled', D.AUDIT.compiled, '', '', '', '', '');
add('audit_context', 'Platform age (days)', D.AUDIT.platformAgeDays, '2026-06-14 to 2026-09-05', 'PROD', 'ACTUAL', '', D.AUDIT.platformAgeNote);

/* ---- baseline ---- */
D.BASELINE.forEach((b) => add('baseline', b.label, b.value, '', b.tag, 'PRODUCTION VERIFIED', b.source, b.note));
D.SECONDARY.forEach((s) => add('baseline_secondary', s.label, s.value, '', s.tag, 'PRODUCTION VERIFIED', '', s.note));

/* ---- funnel ---- */
D.FUNNEL.forEach((f) => add('funnel', f.stage, f.display, [f.ofPrev, f.ofTotal].filter(Boolean).join(' | '),
  f.tag, f.confidence, f.source, f.note));
D.FUNNEL_CAVEATS.forEach((cv, i) => add('funnel_caveat', 'Denominator rule ' + (i + 1), '', '', '', 'CAVEAT', '', cv));

/* ---- acquisition ---- */
D.SIGNUPS_MONTHLY.forEach((m) => add('signups_monthly', m.month, m.signups,
  m.days === null ? 'partial month, cut-off 5-7 Sep' : m.signups + ' / ' + m.days + ' days',
  'PROD', m.partial ? 'PARTIAL MONTH' : 'FULL MONTH', 'profiles.created_at', m.note + ' Per day: ' + m.perDay));
add('acquisition', 'Signups last 30 days', D.ACQUISITION.last30Signups, '', 'PROD', 'ACTUAL', 'profiles', '53.7% of the entire user base');
add('acquisition', 'New paying customers last 30 days', D.ACQUISITION.last30Paid, '0 / 366', 'PROD', 'ACTUAL', 'payments', '0.00% conversion');
add('acquisition', 'Signups last 7 days', D.ACQUISITION.last7Signups, '50 / 7 days = 7.1/day', 'PROD', 'ACTUAL', 'profiles', '');
add('acquisition', 'Signups with a known acquisition source', 0, '0 / 682', 'CODE', 'CONFIRMED', 'exhaustive schema search', 'No utm/referrer column exists. Historical attribution is permanently unrecoverable.');
add('acquisition', 'Monthly totals vs baseline reconciliation', '686 vs 682', '19+226+396+45 = 686', 'DERIVED', 'DATA GAP', '', D.ACQUISITION.reconciliation.body);
D.ACQUISITION.trendCaveats.forEach((t, i) => add('acquisition_reading', 'Trend note ' + (i + 1), '', '', '', t.label, '', t.text));

/* ---- activation ---- */
add('activation', 'Registered users', 682, '', 'PROD', 'ACTUAL', 'profiles', '');
add('activation', 'Started >=1 test', 345, '345 / 682 = 50.6%', 'PROD', 'ACTUAL', 'test_sessions', '');
add('activation', 'Never started a test', 337, '337 / 682 = 49.4%', 'PROD', 'ACTUAL', 'derived', 'Largest absolute loss in the funnel');
add('activation', 'Completed >=1 test', 286, '286 / 682 = 41.9%', 'PROD', 'ACTUAL', 'test_sessions', '');
add('activation', 'Completion rate among starters', '82.9%', '286 / 345', 'DERIVED', 'ACTUAL', '', 'Once a user starts, they usually finish');
add('activation', 'Started but never completed', 59, '59 / 345 = 17.1%', 'DERIVED', 'ACTUAL', '', '');
D.ACTIVATION.kpis.forEach((k) => add('activation_kpi', k.name, k.current, k.calc, '', 'KPI', '', 'Target: ' + k.target));

/* ---- retention ---- */
D.RETENTION.rates.forEach((r) => add('retention', r.basis, r.rate, r.calc, 'PROD', 'ACTUAL (FLOOR)', 'daily_activity', r.note));
D.RETENTION.cohorts.forEach((x) => add('retention_cohort', x.label, x.value, '', '', 'DATA GAP', 'query not run', ''));
D.RETENTION.caveats.forEach((cv, i) => add('retention_caveat', 'Caveat ' + (i + 1), '', '', '', 'CAVEAT', '', cv));

/* ---- monetization ---- */
D.REVENUE.forEach((r) => add('revenue', r.label, r.value, '', r.tag, '', '', r.note));
D.CUSTOMER_SEGMENTATION.forEach((s) => add('customer_segment', s.segment,
  s.count === null ? 'PENDING' : s.count, '', s.tag, s.count === null ? 'PENDING IDENTIFICATION' : 'ACTUAL',
  '', (s.revenue === null ? '' : 'Revenue: ' + s.revenue + '. ') + (s.note || '')));
D.CONVERSION_RATES.forEach((x) => add('conversion_rate', x.basis, x.rate, x.calc, 'DERIVED', 'ACTUAL', 'payments + profiles',
  'Sample too small for any rate to be statistically meaningful'));
D.PLANS.forEach((pl) => add('plan', pl.plan, pl.price,
  'attempts=' + (pl.attempts === null ? 'n/a' : pl.attempts) + ', paid=' + (pl.paid === null ? 'n/a' : pl.paid),
  'CODE+PROD', '', 'pricing constants + payments ledger',
  [pl.duration, pl.audience, pl.features, 'Credits: ' + pl.credits,
   'RankBooster: ' + pl.rankBooster, 'Vettri: ' + pl.vettri, 'Mock: ' + pl.mock,
   'Revenue: ' + (pl.revenue || 'n/a'), pl.note || ''].filter(Boolean).join(' | ')));
D.ENTITLEMENT_OVERLAP.forEach((e) => add('entitlement_overlap', e.rule, e.status, '', 'CODE', 'CONFIRMED', 'entitlement logic', e.note));
D.PAYMENTS_RECONCILIATION.rows.forEach((r) => add('payments_reconciliation', r.label, r.value, '', r.tag, 'ACTUAL', 'payments', ''));
D.PAYMENTS_RECONCILIATION.attemptTiming.forEach((a) => add('checkout_abandonment_pattern', a.pattern,
  a.users + ' users / ' + a.attempts + ' attempts', '', 'PROD', 'ACTUAL', 'payments.created_at', a.reading));

/* ---- feedback ---- */
add('feedback', 'Responses', D.FEEDBACK.responses, '6 / 682 = 0.88%', 'PROD', 'ACTUAL', 'app_feedback', '');
add('feedback', 'Average rating', D.FEEDBACK.average, D.FEEDBACK.averageCalc, 'PROD', 'ACTUAL', 'app_feedback', 'n = 6, not statistically meaningful');
add('feedback', 'Ratings received', D.FEEDBACK.ratings.join(' '), '', 'PROD', 'ACTUAL', 'app_feedback', '');
add('feedback', 'Responses with written text', D.FEEDBACK.written, '0 / 6', 'PROD', 'ACTUAL', 'app_feedback', 'The system holds zero words of user opinion');
D.FEEDBACK.distribution.forEach((d) => add('feedback_distribution', d.stars + ' star', d.count, '', 'PROD', 'ACTUAL', 'app_feedback', ''));
add('feedback', 'Clarity behavioural data', 'DATA NOT AVAILABLE', '', 'GAP', 'DATA GAP', 'no access in any stage', 'No behavioural inference in this report is drawn from Clarity');

/* ---- analytics ---- */
D.TRACKING.forEach((t) => add('tracking_coverage', t.event, 'tracked=' + t.tracked + ', reliable=' + t.reliable,
  '', 'CODE', t.reliable === 'Yes' ? 'OK' : 'GAP', t.where, t.problem));
D.METRIC_DEFECTS.forEach((m) => add('metric_defect', m.metric, 'DEFECT', '', 'CODE', 'CONFIRMED', m.where, m.defect + ' | Consequence: ' + m.impact));

/* ---- external ---- */
D.EXTERNAL.forEach((e) => add('external_audit', e.metric, e.value, '', e.tag, '', '', e.note));

/* ---- flaws ---- */
D.FLAWS.forEach((f) => add('flaw', '#' + f.id + ' ' + f.title, f.priority,
  'impact/effort: see matrix', f.evidenceStatus, f.rootCauseStatus,
  f.Q_source.join(' | '),
  ['Category: ' + f.category, 'Severity: ' + f.severity, 'Confidence: ' + f.confidence,
   'Funnel stage: ' + f.funnelStage, 'Diagnosis: ' + f.oneLiner].join(' | ')));
D.FLAWS.forEach((f) => f.underlying.forEach((u) => add('flaw_traceability', u.id, 'Flaw #' + f.id, '', u.tag, '', '', u.text)));
D.FLAWS.forEach((f) => f.F_numbers.forEach((n) => add('flaw_numbers', 'Flaw #' + f.id + ': ' + n.label, n.value, n.calc, '', '', '', f.title)));
D.MATRIX.forEach((m) => {
  const f = D.FLAWS.filter((x) => x.id === m.id)[0];
  add('priority_matrix', '#' + m.id + ' ' + f.title, f.priority,
    'impact=' + m.impact + ', effort=' + (m.effort === null ? m.effortLabel : m.effort),
    '', '', '', m.note);
});
D.TRACEABILITY.verificationFindings.forEach((v) => add('verification_finding', v.id, 'Flaw #' + v.flaw, '', '', '', '', v.text));
D.TRACEABILITY.outOfScope.items.forEach((i) => add('out_of_scope_p3', i.id, 'EXCLUDED', '', '', 'P3 — OUT OF SCOPE', '', i.text));
D.TRACEABILITY.closed.items.forEach((x) => add('closed_hypothesis', x.item, 'CLOSED', '', '', 'DISPROVED', '', x.why));

/* ---- journey ---- */
D.JOURNEY.forEach((j) => add('user_journey', j.stage, j.leak.toUpperCase().replace(/-/g, ' '), '', '', '', j.evidence,
  ['Current: ' + j.current, 'Problem: ' + j.problem, 'Metric: ' + j.metric, 'Fix: ' + j.fix,
   'Flaws: ' + (j.flaws.map((n) => '#' + n).join(' ') || 'none')].join(' | ')));

/* ---- root cause ---- */
add('root_cause', D.ROOT_TREE.label, D.ROOT_TREE.status, '', '', D.ROOT_TREE.status, '', D.ROOT_TREE.detail);
D.ROOT_TREE.children.forEach((b) => {
  add('root_cause', b.label, b.status, D.ROOT_TREE.label, '', b.status, '', b.detail);
  b.children.forEach((ch) => add('root_cause', ch.label, ch.status, b.label, '', ch.status, 'Flaw #' + ch.flaw, ch.detail));
});

/* ---- plan & KPIs ---- */
D.PHASES.forEach((ph) => ph.items.forEach((i) =>
  add('fix_sequence', ph.name, i.n, 'Flaw #' + i.flaw, '', '', '', i.title + ' | ' + i.why)));
D.KPI_MODEL.forEach((k) => add('kpi_model', k.metric, k.current, k.calc, '', k.targetType, 'Flaw #' + k.flaw,
  'Target: ' + k.target + ' | Period: ' + k.period + ' | Criteria: ' + k.criteria));
D.PLAN_30_60_90.forEach((w) => w.items.forEach((i, n) => add('plan_30_60_90', w.window, n + 1, '', '', '', '', i)));

/* ---- data quality ---- */
D.DATA_QUALITY.know.forEach((x, i) => add('data_quality', 'WHAT WE KNOW ' + (i + 1), '', '', '', 'KNOWN', '', x));
D.DATA_QUALITY.dontKnow.forEach((x, i) => add('data_quality', "WHAT WE DON'T KNOW " + (i + 1), '', '', '', 'UNKNOWN', '', x));
D.DATA_QUALITY.confirmed.forEach((x, i) => add('data_quality', 'CONFIRMED ' + (i + 1), '', '', '', 'CONFIRMED', '', x));
D.DATA_QUALITY.hypotheses.forEach((x, i) => add('data_quality', 'HYPOTHESIS ' + (i + 1), '', '', '', 'HYPOTHESIS', '', x));
D.DATA_QUALITY.disproved.forEach((x) => add('data_quality', 'DISPROVED: ' + x.claim, '', '', '', 'DISPROVED', '', x.by));
D.DATA_QUALITY.gaps.forEach((g) => add('data_gap', g.gap, g.recoverable, '', '', 'DATA GAP', '', g.why));

/* ---- methodology & safety ---- */
D.EVIDENCE_TAGS.forEach((e) => add('evidence_tag', e.tag, e.name, '', '', '', '', e.desc));
D.METHODOLOGY_SOURCES.forEach((s) => add('methodology_source', s.source, s.access, '', '', '', s.covers, 'Limits: ' + s.limits));
D.SAFETY.forEach((s, i) => add('production_safety', 'Assertion ' + (i + 1), 'TRUE', '', '', 'READ-ONLY', '', s));

const csv = '﻿' + [HEAD.join(',')].concat(rows.map((r) => r.map(q).join(','))).join('\r\n') + '\r\n';
fs.writeFileSync(path.join(ROOT, 'TNPSC_MENTORS_GROWTH_DATA.csv'), csv, 'utf8');

const datasets = {};
rows.forEach((r) => { datasets[r[0]] = (datasets[r[0]] || 0) + 1; });
console.log('TNPSC_MENTORS_GROWTH_DATA.csv written — ' + rows.length + ' rows across ' +
  Object.keys(datasets).length + ' datasets');
Object.entries(datasets).forEach(([k, v]) => console.log('    ' + k.padEnd(30) + v));
