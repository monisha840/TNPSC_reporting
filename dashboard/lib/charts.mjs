/*
 * SVG chart generation. One implementation, two output modes:
 *   mode 'file'   → standalone .svg with its own colour tokens + dark-mode block
 *   mode 'inline' → uses the dashboard's CSS custom properties, inherits the theme
 *
 * No external libraries. Nothing here reads or writes production data.
 */

import D from './data.mjs';

const esc = (s) => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

/* Colour tokens. Names match the dashboard's CSS variables so 'inline' mode
 * inherits light/dark automatically. */
const TOKENS = ['ink', 'muted', 'faint', 'grid', 'panel', 'surface', 'accent', 'danger', 'warn', 'good', 'neutral', 'accent2'];

const LIGHT = {
  ink: '#14181d', muted: '#5b6472', faint: '#8892a0', grid: '#e2e6ec',
  panel: '#f5f7fa', surface: '#ffffff',
  accent: '#2f5fd0', accent2: '#7b4fd0', danger: '#b42318', warn: '#b54708',
  good: '#067647', neutral: '#98a2b3',
};
const DARK = {
  ink: '#e8ecf2', muted: '#9aa4b4', faint: '#6f7987', grid: '#2a3138',
  panel: '#1a1f26', surface: '#12161b',
  accent: '#7ea6ff', accent2: '#b195f5', danger: '#f28b82', warn: '#e5a663',
  good: '#5fd4a0', neutral: '#6b7684',
};

function palette(mode) {
  if (mode === 'inline') {
    const p = {};
    TOKENS.forEach((t) => { p[t] = `var(--c-${t})`; });
    return p;
  }
  const p = {};
  TOKENS.forEach((t) => { p[t] = `var(--c-${t})`; });
  return p;
}

function styleBlock(mode) {
  if (mode === 'inline') return '';
  const light = TOKENS.map((t) => `--c-${t}:${LIGHT[t]}`).join(';');
  const dark = TOKENS.map((t) => `--c-${t}:${DARK[t]}`).join(';');
  return `<style>
    svg{--c-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;${light}}
    @media (prefers-color-scheme: dark){svg{${dark}}}
    text{font-family:var(--c-font,system-ui,sans-serif)}
  </style>`;
}

function svg(w, h, body, mode, title) {
  const bg = mode === 'file' ? `<rect width="${w}" height="${h}" fill="var(--c-surface)"/>` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${esc(title)}" font-family="ui-sans-serif,system-ui,-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif">${styleBlock(mode)}${bg}${body}</svg>`;
}

const T = (x, y, s, o = {}) =>
  `<text x="${x}" y="${y}" fill="${o.fill || 'var(--c-ink)'}" font-size="${o.size || 12}" font-weight="${o.weight || 400}" text-anchor="${o.anchor || 'start'}"${o.mono ? ' font-family="ui-monospace,SFMono-Regular,Menlo,Consolas,monospace"' : ''}${o.opacity ? ` opacity="${o.opacity}"` : ''}>${esc(s)}</text>`;

const R = (x, y, w, h, fill, o = {}) =>
  `<rect x="${x}" y="${y}" width="${Math.max(0, w)}" height="${Math.max(0, h)}" fill="${fill}"${o.rx ? ` rx="${o.rx}"` : ''}${o.stroke ? ` stroke="${o.stroke}"` : ''}${o.sw ? ` stroke-width="${o.sw}"` : ''}${o.dash ? ` stroke-dasharray="${o.dash}"` : ''}${o.opacity ? ` opacity="${o.opacity}"` : ''}/>`;

const L = (x1, y1, x2, y2, stroke, o = {}) =>
  `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="${o.sw || 1}"${o.dash ? ` stroke-dasharray="${o.dash}"` : ''}${o.opacity ? ` opacity="${o.opacity}"` : ''}/>`;

const heading = (title, sub, w) =>
  T(0, 18, title, { size: 15, weight: 700 }) +
  (sub ? T(0, 36, sub, { size: 11.5, fill: 'var(--c-muted)' }) : '');

/* ========================================================================= */
/* 1. CORE FUNNEL                                                            */
/* ========================================================================= */
function coreFunnel(mode) {
  const rows = [
    { label: 'Registered users',      n: 682, sub: 'profiles · 100%',                          c: 'accent' },
    { label: 'Started ≥1 test',       n: 345, sub: '50.6% of 682  ·  −337 users',              c: 'accent' },
    { label: 'Completed ≥1 test',     n: 286, sub: '82.9% of 345  ·  41.9% of 682  ·  −59',  c: 'accent' },
    { label: 'Returned on a 2nd day', n: 16,  sub: '5.6% of 286  ·  2.3% of 682  ·  −270',   c: 'warn' },
    { label: 'Reached checkout',      n: 11,  sub: '11 people / 21 attempts  ·  1.6% of 682',  c: 'warn', brk: true },
    { label: 'Paid',                  n: 1,   sub: '9.1% of 11 people  ·  4.8% of 21 attempts', c: 'danger' },
    { label: 'Externally acquired',   n: 0,   sub: '0.00% of 682  ·  the ₹899 was founder-generated', c: 'danger' },
  ];
  const W = 900, padL = 300, padR = 110, top = 96, rowH = 48, barH = 26;
  const H = top + rows.length * rowH + 82;
  const max = 682, avail = W - padL - padR;
  let b = heading('Core funnel — 682 registered users to 0 external customers', 'Every stage states its own denominator. Bars are linear; the smallest values are widened to stay visible.', W);

  rows.forEach((r, i) => {
    const y = top + i * rowH;
    const w = r.n === 0 ? 3 : Math.max(3, (r.n / max) * avail);
    if (r.brk) {
      b += L(0, y - 12, W, y - 12, 'var(--c-danger)', { sw: 1, dash: '3 4', opacity: 0.55 });
      b += R(240, y - 21, 520, 17, 'var(--c-surface)', {});
      b += T(248, y - 8, 'NO VALID DENOMINATOR ACROSS THIS BOUNDARY — pricing views are not instrumented', { size: 9.5, fill: 'var(--c-danger)', weight: 700 });
    }
    b += T(padL - 14, y + 13, r.label, { size: 12.5, weight: 600, anchor: 'end' });
    b += T(padL - 14, y + 28, r.sub, { size: 9.5, fill: 'var(--c-muted)', anchor: 'end' });
    b += R(padL, y, w, barH, `var(--c-${r.c})`, { rx: 2, opacity: r.n === 0 ? 0.35 : 0.9 });
    b += T(padL + w + 10, y + 18, String(r.n), { size: 14, weight: 700, mono: true });
  });

  const fy = top + rows.length * rowH + 14;
  b += L(0, fy, W, fy, 'var(--c-grid)', { sw: 1 });
  b += T(0, fy + 20, 'The 11 checkout users are NOT established as a subset of the 16 returners — no query has run the overlap.', { size: 10.5, fill: 'var(--c-muted)' });
  b += T(0, fy + 37, 'Returner counts are a FLOOR: daily_activity records only test submission and current-affairs completion.', { size: 10.5, fill: 'var(--c-muted)' });
  b += T(0, fy + 54, '[PROD] read-only SELECT, snapshot 5 Sep 2026 19:01 IST.', { size: 10.5, fill: 'var(--c-faint)' });
  return svg(W, H, b, mode, 'Core funnel from 682 registered users to 0 externally-acquired paying customers');
}

/* ========================================================================= */
/* 2. SIGNUPS BY MONTH                                                       */
/* ========================================================================= */
function signupsByMonth(mode) {
  const rows = D.SIGNUPS_MONTHLY;
  const W = 760, H = 400, padL = 56, padB = 96, top = 66;
  const plotH = H - padB - top, plotW = W - padL - 30;
  const max = 420, bw = 76, gap = (plotW - rows.length * bw) / (rows.length + 1);
  let b = heading('Signups by month — acquisition is growing', 'June and September are PARTIAL months (hatched). September covers 5–7 days of a 30-day month.', W);

  [0, 100, 200, 300, 400].forEach((v) => {
    const y = top + plotH - (v / max) * plotH;
    b += L(padL, y, W - 30, y, 'var(--c-grid)', { sw: 1 });
    b += T(padL - 10, y + 4, String(v), { size: 10.5, fill: 'var(--c-faint)', anchor: 'end', mono: true });
  });

  b += `<defs><pattern id="hatch" width="6" height="6" patternTransform="rotate(45)" patternUnits="userSpaceOnUse"><rect width="6" height="6" fill="var(--c-accent)" opacity="0.22"/><line x1="0" y1="0" x2="0" y2="6" stroke="var(--c-accent)" stroke-width="3" opacity="0.75"/></pattern></defs>`;

  rows.forEach((r, i) => {
    const x = padL + gap + i * (bw + gap);
    const h = (r.signups / max) * plotH;
    const y = top + plotH - h;
    b += R(x, y, bw, h, r.partial ? 'url(#hatch)' : 'var(--c-accent)', { rx: 3, opacity: r.partial ? 1 : 0.92 });
    b += T(x + bw / 2, y - 8, String(r.signups), { size: 14, weight: 700, anchor: 'middle', mono: true });
    b += T(x + bw / 2, top + plotH + 18, r.month.replace(' 2026', ''), { size: 11.5, weight: 600, anchor: 'middle' });
    b += T(x + bw / 2, top + plotH + 33, r.partial ? 'PARTIAL' : `${r.days} days`, { size: 9.5, anchor: 'middle', fill: r.partial ? 'var(--c-warn)' : 'var(--c-faint)', weight: r.partial ? 700 : 400 });
    b += T(x + bw / 2, top + plotH + 47, `${r.perDay}/day`, { size: 9.5, anchor: 'middle', fill: 'var(--c-muted)', mono: true });
  });

  const fy = top + plotH + 62;
  b += L(0, fy, W, fy, 'var(--c-grid)', { sw: 1 });
  b += T(0, fy + 18, 'July → August: +75.2% (396 / 226).   Last 30 days: 366 signups → 0 paying customers.', { size: 10.5, fill: 'var(--c-ink)' });
  b += T(0, fy + 33, 'Monthly totals sum to 686 against a 682 baseline — the two queries were run on different dates. See the reconciliation note.', { size: 10.5, fill: 'var(--c-muted)' });
  return svg(W, H, b, mode, 'Signups by month showing growth from 19 to 226 to 396');
}

/* ========================================================================= */
/* 3. ACTIVATION SPLIT                                                       */
/* ========================================================================= */
function activationSplit(mode) {
  const W = 760, H = 300;
  let b = heading('Activation — 49.4% of registered users never start a test', 'The largest absolute loss in the funnel: 337 people.', W);
  const top = 74, barH = 54, avail = W - 4;

  const seg = [
    { n: 286, label: 'Completed ≥1 test', c: 'accent', pct: '41.9%' },
    { n: 59,  label: 'Started, never completed', c: 'warn', pct: '8.7%' },
    { n: 337, label: 'NEVER started a test', c: 'danger', pct: '49.4%' },
  ];
  let x = 0;
  seg.forEach((s) => {
    const w = (s.n / 682) * avail;
    b += R(x, top, w - 2, barH, `var(--c-${s.c})`, { rx: 3, opacity: 0.9 });
    b += T(x + 10, top + 24, String(s.n), { size: 16, weight: 700, fill: 'var(--c-surface)', mono: true });
    b += T(x + 10, top + 42, s.pct, { size: 11, fill: 'var(--c-surface)', opacity: 0.9, mono: true });
    x += w;
  });
  let lx = 0;
  seg.forEach((s) => {
    const w = (s.n / 682) * avail;
    b += R(lx, top + barH + 14, 10, 10, `var(--c-${s.c})`, { rx: 2 });
    b += T(lx + 16, top + barH + 23, s.label, { size: 11, weight: 600 });
    lx += w;
  });

  const cards = [
    { v: '345 / 682', l: 'Started ≥1 test', s: '50.6%' },
    { v: '286 / 345', l: 'Completed, of those who started', s: '82.9% — once they start, they finish' },
    { v: '337 / 682', l: 'Never started', s: '49.4% — after a CONFIRMED-WORKING signup' },
  ];
  const cy = top + barH + 48, cw = (W - 24) / 3;
  cards.forEach((c, i) => {
    const cx = i * (cw + 12);
    b += R(cx, cy, cw, 76, 'var(--c-panel)', { rx: 6 });
    b += T(cx + 14, cy + 26, c.v, { size: 16, weight: 700, mono: true });
    b += T(cx + 14, cy + 45, c.l, { size: 10.5, weight: 600, fill: 'var(--c-muted)' });
    b += T(cx + 14, cy + 62, c.s, { size: 10, fill: 'var(--c-faint)' });
  });
  b += T(0, cy + 96, '[PROD] profiles vs test_sessions. Signup itself is verified working — this loss occurs AFTER a clean registration.', { size: 10.5, fill: 'var(--c-faint)' });
  return svg(W, H, b, mode, 'Activation split: 337 of 682 users never start a test');
}

/* ========================================================================= */
/* 4. RETENTION                                                              */
/* ========================================================================= */
function retention(mode) {
  const W = 760, H = 340;
  let b = heading('Retention — 94.4% of test-completers never come back', 'FLOOR, not a measurement: "active" counts only test submission and current-affairs completion.', W);
  const top = 76, barH = 46, avail = W;

  b += T(0, top - 8, 'Of 286 users who completed a test', { size: 11, weight: 600, fill: 'var(--c-muted)' });
  const wRet = (16 / 286) * avail;
  b += R(0, top, wRet, barH, 'var(--c-good)', { rx: 3 });
  b += R(wRet + 2, top, avail - wRet - 2, barH, 'var(--c-danger)', { rx: 3, opacity: 0.88 });
  b += T(wRet + 12, top + 22, '270 never returned', { size: 14, weight: 700, fill: 'var(--c-surface)' });
  b += T(wRet + 12, top + 39, '94.4% of 286', { size: 11, fill: 'var(--c-surface)', opacity: 0.9, mono: true });
  b += T(0, top + barH + 18, '16 returned (5.6% of 286)', { size: 11, weight: 600, fill: 'var(--c-good)' });

  const y2 = top + barH + 46;
  b += T(0, y2 - 6, 'Active-user windows, against all 682 registered users', { size: 11, weight: 600, fill: 'var(--c-muted)' });
  const win = [
    { n: 135, l: 'Active last 30 days', p: '19.8% of 682' },
    { n: 17,  l: 'Active last 7 days',  p: '2.5% of 682' },
    { n: 16,  l: 'Ever had 2+ active days', p: '2.3% of 682' },
    { n: 2,   l: 'Active today', p: '0.3% of 682' },
  ];
  win.forEach((w, i) => {
    const yy = y2 + 6 + i * 30;
    const bw = Math.max(3, (w.n / 682) * (avail - 300));
    b += T(190, yy + 13, w.l, { size: 11, anchor: 'end', weight: 600 });
    b += R(200, yy, bw, 18, 'var(--c-accent)', { rx: 2, opacity: 0.85 });
    b += T(200 + bw + 8, yy + 13, String(w.n), { size: 12, weight: 700, mono: true });
    b += T(200 + bw + 8 + String(w.n).length * 8 + 12, yy + 13, w.p, { size: 10.5, fill: 'var(--c-muted)', mono: true });
  });

  const fy = y2 + 6 + win.length * 30 + 14;
  b += L(0, fy, W, fy, 'var(--c-grid)', { sw: 1 });
  b += T(0, fy + 18, 'D1 / D3 / D7 / D14 / D30 cohort retention:  DATA NOT AVAILABLE — the query has not been run.', { size: 11, weight: 700, fill: 'var(--c-warn)' });
  b += T(0, fy + 34, 'Caveat: 366 of 682 users (53.7%) registered in the last 30 days, so part of the non-return is cohort immaturity, not churn.', { size: 10.5, fill: 'var(--c-muted)' });
  return svg(W, H, b, mode, 'Retention: 270 of 286 test-completers never returned');
}

/* ========================================================================= */
/* 5. PLAN DEMAND vs CONVERSION                                              */
/* ========================================================================= */
function planDemand(mode) {
  const rows = [
    { plan: 'Premium Prelims Kit', price: '₹1,699', att: 12, paid: 0 },
    { plan: 'Vettri Nichayam',     price: '₹899',   att: 4,  paid: 1 },
    { plan: 'Rank Booster G2',     price: '₹1,249', att: 3,  paid: 0 },
    { plan: 'Group 1 Mock Pack',   price: '₹399',   att: 2,  paid: 0 },
  ];
  const W = 760, H = 330, padL = 190, top = 76, rowH = 44;
  const avail = W - padL - 210, max = 12;
  let b = heading('Plan demand vs. conversion — the most wanted plan has never sold', '21 price-accepted checkout attempts across 4 ledger plan keys. Sample far too small for any rate to be meaningful.', W);

  rows.forEach((r, i) => {
    const y = top + i * rowH;
    const w = (r.att / max) * avail;
    b += T(padL - 12, y + 15, r.plan, { size: 12, weight: 600, anchor: 'end' });
    b += T(padL - 12, y + 29, r.price, { size: 10.5, anchor: 'end', fill: 'var(--c-muted)', mono: true });
    b += R(padL, y, w, 22, 'var(--c-accent)', { rx: 2, opacity: 0.85 });
    if (r.paid > 0) b += R(padL, y, (r.paid / max) * avail, 22, 'var(--c-good)', { rx: 2 });
    b += T(padL + w + 10, y + 16, `${r.att} attempts`, { size: 11.5, weight: 600, mono: true });
    b += T(padL + w + 100, y + 16, r.paid > 0 ? `${r.paid} paid` : '0 paid', { size: 11.5, weight: 700, fill: r.paid > 0 ? 'var(--c-good)' : 'var(--c-danger)', mono: true });
  });

  const fy = top + rows.length * rowH + 10;
  b += L(0, fy, W, fy, 'var(--c-grid)', { sw: 1 });
  b += T(0, fy + 20, 'Premium draws 57% of all purchase intent (12 of 21) at the highest price point — and has converted 0 times.', { size: 11, weight: 600 });
  b += T(0, fy + 37, 'The single Vettri sale was FOUNDER-GENERATED. Externally-acquired paying customers: 0.', { size: 11, fill: 'var(--c-danger)', weight: 600 });
  b += T(0, fy + 55, 'OBSERVATION, not fact: two explanations fit equally — price resistance at ₹1,699, or plan confusion driving users to', { size: 10.5, fill: 'var(--c-muted)' });
  b += T(0, fy + 70, 'the most prominent option and then stalling. Neither is proven. See Flaw #2.', { size: 10.5, fill: 'var(--c-muted)' });
  return svg(W, H, b, mode, 'Checkout attempts and conversions by plan');
}

/* ========================================================================= */
/* 6. REVENUE REALITY                                                        */
/* ========================================================================= */
function revenueReality(mode) {
  const W = 760, H = 300;
  let b = heading('Revenue reality — all-time vs. externally generated', 'Four payment records. Three are staff comps at ₹0. The fourth was founder-generated.', W);
  const top = 74;
  const cards = [
    { v: '₹899', l: 'All-time revenue', s: 'One transaction, one plan', c: 'accent' },
    { v: '₹0',   l: 'Externally-generated revenue', s: 'Nobody outside the building has paid', c: 'danger' },
    { v: '0',    l: 'Externally-acquired customers', s: '0.00% of 682 in 83 days', c: 'danger' },
  ];
  const cw = (W - 24) / 3;
  cards.forEach((c, i) => {
    const x = i * (cw + 12);
    b += R(x, top, cw, 92, 'var(--c-panel)', { rx: 8 });
    b += R(x, top, 4, 92, `var(--c-${c.c})`, { rx: 2 });
    b += T(x + 18, top + 40, c.v, { size: 28, weight: 700, fill: `var(--c-${c.c})`, mono: true });
    b += T(x + 18, top + 62, c.l, { size: 11.5, weight: 600 });
    b += T(x + 18, top + 79, c.s, { size: 10, fill: 'var(--c-muted)' });
  });

  const y2 = top + 116;
  b += T(0, y2, 'The four "paid" records, decomposed', { size: 11.5, weight: 700 });
  const seg = [
    { n: 3, l: 'Internal staff comps · ₹0', c: 'neutral' },
    { n: 1, l: 'Founder-generated · ₹899', c: 'warn' },
  ];
  let x = 0;
  const bw = W * 0.62;
  seg.forEach((s) => {
    const w = (s.n / 4) * bw;
    b += R(x, y2 + 12, w - 2, 34, `var(--c-${s.c})`, { rx: 3, opacity: 0.9 });
    b += T(x + 10, y2 + 34, `${s.n}`, { size: 15, weight: 700, fill: 'var(--c-surface)', mono: true });
    x += w;
  });
  b += R(x, y2 + 12, W - x, 34, 'var(--c-danger)', { rx: 3, opacity: 0.18, stroke: 'var(--c-danger)', sw: 1, dash: '4 3' });
  b += T(x + 10, y2 + 34, '0 external', { size: 12, weight: 700, fill: 'var(--c-danger)' });
  let lx = 0;
  seg.forEach((s) => {
    const w = (s.n / 4) * bw;
    b += R(lx, y2 + 56, 10, 10, `var(--c-${s.c})`, { rx: 2 });
    b += T(lx + 16, y2 + 65, s.l, { size: 10.5, weight: 600 });
    lx += w;
  });
  b += T(0, y2 + 92, 'ARPU ₹1.32 (899 / 682)  ·  ₹10.83/day (899 / 83)  ·  0 refunds  ·  0 failed payments  ·  0 coupon redemptions', { size: 10.5, fill: 'var(--c-muted)', mono: true });
  return svg(W, H, b, mode, 'Revenue: 899 rupees all-time, zero externally generated');
}

/* ========================================================================= */
/* 7. FEEDBACK RATINGS                                                       */
/* ========================================================================= */
function feedbackRatings(mode) {
  const W = 620, H = 300;
  let b = heading('Feedback — 6 ratings, 0 words, from 682 users', 'Average 4.33 from n = 6. Not statistically meaningful, and not actionable.', W);
  const top = 74, rowH = 30, padL = 46, avail = 260;
  D.FEEDBACK.distribution.forEach((d, i) => {
    const y = top + i * rowH;
    b += T(padL - 10, y + 15, `${d.stars}★`, { size: 12, anchor: 'end', weight: 600 });
    const w = d.count === 0 ? 0 : (d.count / 4) * avail;
    if (d.count === 0) {
      b += R(padL, y, 3, 20, 'var(--c-grid)', { rx: 1 });
    } else {
      b += R(padL, y, w, 20, d.stars >= 4 ? 'var(--c-accent)' : 'var(--c-danger)', { rx: 2, opacity: 0.88 });
    }
    b += T(padL + Math.max(w, 3) + 9, y + 15, String(d.count), { size: 12, weight: 700, mono: true });
  });
  const ax = padL + (4.33 / 4) * avail;
  b += L(ax, top - 6, ax, top + 5 * rowH - 6, 'var(--c-warn)', { sw: 1.5, dash: '4 3' });
  b += T(ax + 6, top - 10, 'avg 4.33', { size: 10.5, fill: 'var(--c-warn)', weight: 700, mono: true });

  const y2 = top + 5 * rowH + 12;
  b += L(0, y2, W, y2, 'var(--c-grid)', { sw: 1 });
  b += T(0, y2 + 20, 'Ratings received:  5, 4, 5, 5, 2, 5      (5 + 4 + 5 + 5 + 2 + 5) / 6 = 26 / 6 = 4.33', { size: 11, mono: true, weight: 600 });
  b += T(0, y2 + 40, 'Responses carrying written text:  0', { size: 12, weight: 700, fill: 'var(--c-danger)' });
  b += T(0, y2 + 57, 'Response rate 0.88% (6 / 682). The 2-completed-test gate alone excludes 396 users from ever seeing the prompt.', { size: 10.5, fill: 'var(--c-muted)' });
  return svg(W, H, b, mode, 'Feedback rating distribution: six responses, no written text');
}

/* ========================================================================= */
/* 8. PRIORITY MATRIX                                                        */
/* ========================================================================= */
function priorityMatrix(mode) {
  const W = 760, H = 560, padL = 70, padB = 90, top = 78;
  const plotW = W - padL - 30, plotH = H - top - padB;
  const x = (e) => padL + ((e - 0.5) / 5) * plotW;
  const y = (i) => top + plotH - ((i - 0.5) / 5) * plotH;
  let b = heading('Priority matrix — impact × effort', 'Both axes are 1–5 analyst estimates, not measurements. Flaw #8 is an OUTCOME and has no independent effort.', W);

  b += R(padL, top, plotW / 2, plotH / 2, 'var(--c-good)', { opacity: 0.06 });
  b += T(padL + 10, top + 18, 'HIGH IMPACT · LOW EFFORT — do first', { size: 10, fill: 'var(--c-good)', weight: 700 });
  b += T(padL + plotW / 2 + 10, top + 18, 'HIGH IMPACT · HIGH EFFORT — plan properly', { size: 10, fill: 'var(--c-muted)', weight: 700 });
  b += T(padL + 10, top + plotH - 8, 'LOW IMPACT · LOW EFFORT — quick wins', { size: 10, fill: 'var(--c-faint)', weight: 700 });

  for (let i = 1; i <= 5; i++) {
    b += L(padL, y(i), padL + plotW, y(i), 'var(--c-grid)', { sw: 1 });
    b += T(padL - 12, y(i) + 4, String(i), { size: 11, anchor: 'end', fill: 'var(--c-faint)', mono: true });
    b += L(x(i), top, x(i), top + plotH, 'var(--c-grid)', { sw: 1 });
    b += T(x(i), top + plotH + 18, String(i), { size: 11, anchor: 'middle', fill: 'var(--c-faint)', mono: true });
  }
  b += T(padL + plotW / 2, top + plotH + 40, 'EFFORT  →', { size: 11.5, anchor: 'middle', weight: 700, fill: 'var(--c-muted)' });
  b += `<text x="18" y="${top + plotH / 2}" fill="var(--c-muted)" font-size="11.5" font-weight="700" text-anchor="middle" transform="rotate(-90 18 ${top + plotH / 2})">IMPACT  →</text>`;

  const pColor = { P0: 'danger', P1: 'warn', P2: 'neutral' };
  const byId = {}; D.FLAWS.forEach((f) => { byId[f.id] = f; });
  const placed = [];
  D.MATRIX.forEach((m) => {
    const f = byId[m.id];
    const ex = m.effort === null ? 5.5 : m.effort;
    let cx = x(ex), cy = y(m.impact);
    let bump = 0;
    while (placed.some((p) => Math.abs(p.x - cx) < 26 && Math.abs(p.y - (cy + bump)) < 22)) bump += 24;
    cy += bump;
    placed.push({ x: cx, y: cy });
    const col = `var(--c-${pColor[f.priority]})`;
    if (m.effort === null) {
      b += `<circle cx="${cx}" cy="${cy}" r="15" fill="none" stroke="${col}" stroke-width="1.5" stroke-dasharray="3 3"/>`;
      b += T(cx, cy + 5, String(m.id), { size: 13, weight: 700, anchor: 'middle', fill: col, mono: true });
    } else {
      b += `<circle cx="${cx}" cy="${cy}" r="15" fill="${col}" opacity="0.9"/>`;
      b += T(cx, cy + 5, String(m.id), { size: 13, weight: 700, anchor: 'middle', fill: 'var(--c-surface)', mono: true });
    }
  });

  const ly = top + plotH + 56;
  [['P0', 'danger'], ['P1', 'warn'], ['P2', 'neutral']].forEach((p, i) => {
    b += `<circle cx="${12 + i * 90}" cy="${ly}" r="7" fill="var(--c-${p[1]})"/>`;
    b += T(24 + i * 90, ly + 4, p[0], { size: 11, weight: 700 });
  });
  b += `<circle cx="${12 + 3 * 90}" cy="${ly}" r="7" fill="none" stroke="var(--c-danger)" stroke-width="1.5" stroke-dasharray="3 3"/>`;
  b += T(24 + 3 * 90, ly + 4, 'Outcome — effort inherited', { size: 11, weight: 600, fill: 'var(--c-muted)' });
  return svg(W, H, b, mode, 'Priority matrix plotting all 14 flaws by impact and effort');
}

/* ========================================================================= */
/* 9. ROOT CAUSE TREE                                                        */
/* ========================================================================= */
function rootCauseTree(mode) {
  const W = 900;
  const branches = D.ROOT_TREE.children;
  const rowH = 26, headH = 34;
  let H = 130;
  branches.forEach((br) => { H += headH + br.children.length * rowH + 16; });
  H += 60;

  const sc = { FACT: 'good', OBSERVATION: 'warn', HYPOTHESIS: 'danger' };
  let b = heading('Root cause tree', 'Every node is labelled FACT, OBSERVATION or HYPOTHESIS. The certainty of a parent does not transfer to its children.', W);

  let y = 74;
  b += R(0, y, W, 42, 'var(--c-panel)', { rx: 6 });
  b += R(0, y, 4, 42, 'var(--c-danger)', { rx: 2 });
  b += T(16, y + 20, D.ROOT_TREE.label, { size: 15, weight: 700 });
  b += T(16, y + 35, D.ROOT_TREE.detail, { size: 10.5, fill: 'var(--c-muted)' });
  b += R(W - 52, y + 12, 44, 17, 'var(--c-good)', { rx: 3, opacity: 0.18 });
  b += T(W - 30, y + 24, 'FACT', { size: 9.5, weight: 700, anchor: 'middle', fill: 'var(--c-good)' });
  y += 56;

  branches.forEach((br) => {
    const trunkTop = y;
    b += T(28, y + 16, br.label, { size: 13, weight: 700 });
    b += T(28, y + 30, br.detail, { size: 10, fill: 'var(--c-muted)' });
    b += R(W - 52, y + 6, 44, 17, `var(--c-${sc[br.status]})`, { rx: 3, opacity: 0.18 });
    b += T(W - 30, y + 18, br.status, { size: 9, weight: 700, anchor: 'middle', fill: `var(--c-${sc[br.status]})` });
    y += headH + 6;
    br.children.forEach((c, i) => {
      b += L(40, y + 12, 56, y + 12, 'var(--c-grid)', { sw: 1.5 });
      b += T(64, y + 16, c.label, { size: 11.5, weight: 600 });
      b += R(268, y + 3, 78, 16, `var(--c-${sc[c.status]})`, { rx: 3, opacity: 0.16 });
      b += T(307, y + 15, c.status, { size: 8.5, weight: 700, anchor: 'middle', fill: `var(--c-${sc[c.status]})` });
      const d = c.detail.length > 88 ? c.detail.slice(0, 86) + '…' : c.detail;
      b += T(356, y + 16, d, { size: 9.5, fill: 'var(--c-muted)' });
      b += T(W - 8, y + 16, `#${c.flaw}`, { size: 10, weight: 700, anchor: 'end', fill: 'var(--c-accent)', mono: true });
      y += rowH;
    });
    b += L(40, trunkTop + 24, 40, y - rowH + 12, 'var(--c-grid)', { sw: 1.5 });
    y += 16;
  });

  b += L(0, y, W, y, 'var(--c-grid)', { sw: 1 });
  [['FACT', 'good', 'measured directly — a claim you can verify in one lookup'],
   ['OBSERVATION', 'warn', 'a real pattern; causality not established'],
   ['HYPOTHESIS', 'danger', 'plausible and evidence-linked, but unproven']].forEach((s, i) => {
    b += R(0, y + 14 + i * 18, 10, 10, `var(--c-${s[1]})`, { rx: 2 });
    b += T(16, y + 23 + i * 18, `${s[0]} — ${s[2]}`, { size: 10, fill: 'var(--c-muted)' });
  });
  return svg(W, H, b, mode, 'Root cause tree from low revenue through conversion, activation, retention and measurement gaps');
}

/* ========================================================================= */
/* 10. TRACKING COVERAGE                                                     */
/* ========================================================================= */
function trackingCoverage(mode) {
  const rows = D.TRACKING;
  const W = 900, top = 84, rowH = 26;
  const H = top + rows.length * rowH + 78;
  const c = { Yes: 'good', Partial: 'warn', No: 'danger', 'n/a': 'neutral' };
  let b = heading('Event tracking coverage', 'Green = reliable. Amber = fires but incomplete. Red = does not exist. Two funnel stages have no data source at all.', W);
  b += T(0, top - 10, 'EVENT', { size: 9.5, weight: 700, fill: 'var(--c-faint)' });
  b += T(320, top - 10, 'TRACKED', { size: 9.5, weight: 700, fill: 'var(--c-faint)', anchor: 'middle' });
  b += T(400, top - 10, 'RELIABLE', { size: 9.5, weight: 700, fill: 'var(--c-faint)', anchor: 'middle' });
  b += T(450, top - 10, 'PROBLEM', { size: 9.5, weight: 700, fill: 'var(--c-faint)' });

  rows.forEach((r, i) => {
    const y = top + i * rowH;
    if (i % 2 === 0) b += R(-6, y - 4, W + 12, rowH, 'var(--c-panel)', { rx: 2, opacity: 0.6 });
    const name = r.event.length > 42 ? r.event.slice(0, 40) + '…' : r.event;
    b += T(0, y + 13, name, { size: 10.5, weight: 600, mono: true });
    b += R(292, y + 1, 56, 16, `var(--c-${c[r.tracked] || 'neutral'})`, { rx: 3, opacity: 0.2 });
    b += T(320, y + 13, r.tracked, { size: 9, weight: 700, anchor: 'middle', fill: `var(--c-${c[r.tracked] || 'neutral'})` });
    b += R(372, y + 1, 56, 16, `var(--c-${c[r.reliable] || 'neutral'})`, { rx: 3, opacity: 0.2 });
    b += T(400, y + 13, r.reliable, { size: 9, weight: 700, anchor: 'middle', fill: `var(--c-${c[r.reliable] || 'neutral'})` });
    const p = r.problem === '—' ? '—' : (r.problem.length > 90 ? r.problem.slice(0, 88) + '…' : r.problem);
    b += T(450, y + 13, p, { size: 9.5, fill: r.problem === '—' ? 'var(--c-faint)' : 'var(--c-muted)' });
  });
  const fy = top + rows.length * rowH + 14;
  b += L(0, fy, W, fy, 'var(--c-grid)', { sw: 1 });
  b += T(0, fy + 20, 'The instrumentation that exists is well built — single, correct choke-points. It is INCOMPLETE, not sloppy.', { size: 10.5, weight: 600 });
  b += T(0, fy + 37, 'Ship pricing_viewed first: without it the checkout funnel stage has no denominator and Phase 1 cannot be evaluated.', { size: 10.5, fill: 'var(--c-danger)', weight: 600 });
  b += T(0, fy + 54, '[CODE] exhaustive call-site enumeration across the full src/ and server/ trees.', { size: 10, fill: 'var(--c-faint)' });
  return svg(W, H, b, mode, 'Event tracking coverage matrix');
}

/* ========================================================================= */
/* 11. JOURNEY LEAKAGE                                                       */
/* ========================================================================= */
function journeyLeaks(mode) {
  const rows = D.JOURNEY;
  const W = 900, top = 82, rowH = 30;
  const H = top + rows.length * rowH + 70;
  const leakColor = {
    'largest-absolute': 'danger', 'largest-proportional': 'danger', major: 'warn',
    unmeasured: 'accent2', unknown: 'neutral', minor: 'good', none: 'good',
    terminal: 'danger', 'unused-asset': 'warn',
  };
  const leakLabel = {
    'largest-absolute': 'LARGEST ABSOLUTE LEAK', 'largest-proportional': 'LARGEST PROPORTIONAL LEAK',
    major: 'MAJOR LEAK', unmeasured: 'UNMEASURED', unknown: 'UNMEASURABLE',
    minor: 'HEALTHY', none: 'HEALTHY — CLOSED', terminal: 'TERMINAL — ₹0 EXTERNAL', 'unused-asset': 'BUILT, UNUSED',
  };
  let b = heading('End-to-end journey — where it leaks', 'Fourteen stages from discovery to referral. Stages marked UNMEASURED cannot be quantified because the instrumentation does not exist.', W);

  rows.forEach((r, i) => {
    const y = top + i * rowH;
    if (i % 2 === 0) b += R(-6, y - 4, W + 12, rowH, 'var(--c-panel)', { rx: 2, opacity: 0.55 });
    const col = `var(--c-${leakColor[r.leak]})`;
    b += R(0, y + 2, 4, 18, col, { rx: 2 });
    b += T(14, y + 15, r.stage, { size: 11, weight: 700 });
    b += R(150, y + 2, 172, 17, col, { rx: 3, opacity: 0.18 });
    b += T(236, y + 14, leakLabel[r.leak], { size: 8.5, weight: 700, anchor: 'middle', fill: col });
    const m = r.metric.length > 74 ? r.metric.slice(0, 72) + '…' : r.metric;
    b += T(336, y + 15, m, { size: 9.5, fill: 'var(--c-muted)' });
    const fl = r.flaws.length ? r.flaws.map((f) => '#' + f).join(' ') : '—';
    b += T(W - 4, y + 15, fl, { size: 9.5, weight: 700, anchor: 'end', fill: r.flaws.length ? 'var(--c-accent)' : 'var(--c-faint)', mono: true });
  });
  const fy = top + rows.length * rowH + 12;
  b += L(0, fy, W, fy, 'var(--c-grid)', { sw: 1 });
  b += T(0, fy + 20, 'Largest absolute leak: signup → first test (337 users). Largest proportional leak: completion → return (94.4%).', { size: 10.5, weight: 600 });
  b += T(0, fy + 37, 'Signup and checkout are both CONFIRMED WORKING and are closed — do not spend engineering time on either.', { size: 10.5, fill: 'var(--c-good)', weight: 600 });
  return svg(W, H, b, mode, 'End-to-end user journey leakage map');
}

/* ========================================================================= */
/* 12. FLAWS BY PRIORITY                                                     */
/* ========================================================================= */
function flawsByPriority(mode) {
  const W = 620, H = 264;
  const counts = { P0: 0, P1: 0, P2: 0 };
  D.FLAWS.forEach((f) => { counts[f.priority]++; });
  let b = heading('The 14 major flaws by priority', 'Consolidated from 35 underlying findings. P3 technical debt is out of scope.', W);
  const top = 76, bw = 170, gap = 20;
  const col = { P0: 'danger', P1: 'warn', P2: 'neutral' };
  const desc = { P0: 'Fix immediately', P1: 'High impact', P2: 'Medium' };
  ['P0', 'P1', 'P2'].forEach((p, i) => {
    const x = i * (bw + gap);
    b += R(x, top, bw, 104, 'var(--c-panel)', { rx: 8 });
    b += R(x, top, 5, 104, `var(--c-${col[p]})`, { rx: 2 });
    b += T(x + 20, top + 52, String(counts[p]), { size: 40, weight: 700, fill: `var(--c-${col[p]})`, mono: true });
    b += T(x + 20, top + 74, p, { size: 15, weight: 700 });
    b += T(x + 20, top + 92, desc[p], { size: 10.5, fill: 'var(--c-muted)' });
    const ids = D.FLAWS.filter((f) => f.priority === p).map((f) => '#' + f.id).join(' ');
    b += T(x + 62, top + 52, ids, { size: 10, fill: 'var(--c-muted)', mono: true });
  });
  b += T(0, top + 134, 'Flaw #8 (weak monetization) is an OUTCOME with no independent fix — it moves when #1, #2, #3 and #9 move.', { size: 10.5, fill: 'var(--c-muted)' });
  b += T(0, top + 151, 'Priority note: Flaw #12 (attribution) was P1 in Stage 2 and P2 in the Final Verification. It is assigned P1 here', { size: 10.5, fill: 'var(--c-muted)' });
  b += T(0, top + 166, 'because acquisition is now confirmed growing. The source disagreement is disclosed, not silently resolved.', { size: 10.5, fill: 'var(--c-muted)' });
  return svg(W, H, b, mode, 'Fourteen flaws grouped by priority: four P0, seven P1, three P2');
}

const CHARTS = {
  '01-core-funnel': { fn: coreFunnel, title: 'Core funnel' },
  '02-signups-by-month': { fn: signupsByMonth, title: 'Signups by month' },
  '03-activation-split': { fn: activationSplit, title: 'Activation split' },
  '04-retention': { fn: retention, title: 'Retention' },
  '05-plan-demand': { fn: planDemand, title: 'Plan demand vs conversion' },
  '06-revenue-reality': { fn: revenueReality, title: 'Revenue reality' },
  '07-feedback-ratings': { fn: feedbackRatings, title: 'Feedback ratings' },
  '08-priority-matrix': { fn: priorityMatrix, title: 'Priority matrix' },
  '09-root-cause-tree': { fn: rootCauseTree, title: 'Root cause tree' },
  '10-tracking-coverage': { fn: trackingCoverage, title: 'Event tracking coverage' },
  '11-journey-leaks': { fn: journeyLeaks, title: 'Journey leakage map' },
  '12-flaws-by-priority': { fn: flawsByPriority, title: 'Flaws by priority' },
};

export { CHARTS, palette };
