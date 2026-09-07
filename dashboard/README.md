# TNPSC Mentors — Growth & Product Health Dashboard

A Next.js application presenting the read-only growth and product audit of TNPSC Mentors.
Built to be handed to the development team as the working reference for what to fix and why.

> **This is a reporting artefact.** It connects to no production system, holds no credentials,
> and makes no network calls at runtime. Every figure it displays was obtained through read-only
> analysis. **No production code, database, configuration or deployment was modified.**

---

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
```

| Script | What it does |
|---|---|
| `npm run dev` | Development server with hot reload |
| `npm run build` | Production build — prerenders all 20 routes as static HTML |
| `npm start` | Serves the production build |
| `npm run typecheck` | `tsc --noEmit` |

Requires Node 18.18+.

---

## Deploy to Vercel

Every route is statically prerendered, so this deploys as a static site — no server runtime,
no environment variables, nothing to configure.

**Option A — Git integration (recommended).** Import the repository, then in
*Project Settings → General* set:

```
Root Directory:  dashboard
```

Vercel detects Next.js and everything else is default.

**Option B — CLI.**

```bash
npx vercel --cwd dashboard          # preview
npx vercel --cwd dashboard --prod   # production
```

### Before you deploy

This dashboard contains real user counts, revenue figures and named product weaknesses.
`vercel.json` and `next.config.mjs` both send `X-Robots-Tag: noindex, nofollow`, so it will not
be indexed — but **noindex is not access control**. If the audience is the development team
only, turn on Vercel Authentication (*Project Settings → Deployment Protection*) so a Vercel
login is required to view it.

---

## Structure

Four top-level sections, one route each, plus a page per flaw.

```
app/
  page.tsx               01  Overview      — diagnosis, six verified metrics, top findings
  funnel/                02  User Funnel   — 682 → 1, with denominators and caveats
  flaws/                 03  14 Flaws      — accordion; each row expands to the evidence panel
  flaws/[id]/            ..  one shareable page per flaw
  fixes/                 04  Fixes         — 14 fix PROPOSALS, one per flaw
  layout.tsx             sidebar, topbar, footer, theme boot
components/
  ui.tsx                 Badge, Callout, Card, DataTable, Metric, Value…
  Sidebar.tsx            client — five sections + READ-ONLY status
  Topbar.tsx             client — breadcrumb, theme toggle, print
  FlawList.tsx           client — flaw accordion shell only
  FixList.tsx            client — fix accordion shell only
  Expander.tsx           client — technical-details toggle
  FlawDetail.tsx         server — the eight-part brief + full A–Q technical details
  FixDetail.tsx          server — a fix proposal panel
lib/
  data.mjs               ← the single source of truth
  data-metrics.mjs       baseline, funnel, acquisition, plans, limitations, methodology
  data-flaws-1.mjs       flaws 1–7   — full A–Q audit record
  data-flaws-2.mjs       flaws 8–14  — full A–Q audit record
  data-flaws-brief.mjs   condensed briefs for the main view (adds no facts)
  data-fixes.mjs         14 fix proposals + strategy + recommended sequence
  charts.mjs             SVG generation — build-time only, used by ../build/gen-charts.mjs
  types.ts               the data contract the app relies on
  data.ts                typed entry point
  nav.ts                 the five sections
```

Only five components are client-side. Everything else is a server component, which is why
all 20 routes prerender to static HTML — the flaw panels are in the HTML even when collapsed,
so browser find-in-page and printing reach the whole audit.

### The flaw panel — two layers

**Main view** is an eight-part executive brief, 226–275 visible words per flaw, so a reader can
answer *what is wrong, what proves it, why it matters, what is confirmed vs hypothesis, how
serious is it* in under 30 seconds:

```
1 The problem        ≤ 3 sentences
2 Evidence           ≤ 4 bullets, each [SOURCE] → fact
3 Why it matters     ≤ 2 bullets
4 Root cause         ≤ 3 confirmed + ≤ 2 hypothesis, visually separated
5 Impact             ≤ 4 metric chips
6 How we checked     ≤ 4 bullets
7 Audit status       evidence · root cause · confidence · priority
8 Source             short source names only
```

**Technical details** sits behind a `+ View technical details` expander and carries the complete
A–Q audit record: full executive summary, all evidence items, every underlying finding ID, full
methodology, detailed calculations, affected users and caveats, full root-cause statements, user
and business impact, affected product areas, full confidence statement and full source
references. The children are server-rendered and merely hidden, so browser find-in-page and
printing reach them whether or not the panel has been opened.

The brief lives in `lib/data-flaws-brief.mjs`, which **adds no facts** — every sentence is
condensed from the A–Q content in `data-flaws-1.mjs` / `data-flaws-2.mjs`, and those two files
are unmodified. Priority, confidence, evidence status and root-cause status are always read from
the flaw itself, never from the brief.

Recommended fixes, implementation direction and success metrics are deliberately **not**
rendered anywhere — they are being prepared as a separate exercise. That content is untouched in
`lib/data-flaws-*.mjs` and still appears in the generated Markdown and CSV deliverables.

### The Fixes section

`04 — Fixes` carries one proposal per flaw: what should change, how it should work, a worked
example, the expected outcome, today's measured baseline, and a caveat where the causal claim is
not proven.

Three rules keep it honest and are enforced by `../build/validate.mjs`:

- **Priority is never stored on a fix.** It is read from the connected flaw, so the audit's
  P0/P1/P2 assignments cannot be overridden from this page.
- **Every example is labelled `ILLUSTRATIVE`.** Mock-up numbers like "72 / 100" are proposed
  screens, not measurements. Real figures appear only under *Today*, quoted from the audit model.
- **Status is always `PLANNED / NOT IMPLEMENTED`.** Nothing may be described as completed, live,
  deployed or fixed, and no fix may claim it will definitely work.

Nothing in this section has been built. No TNPSC Mentors application repository was accessed to
write it.

## Changing the content

**All content lives in `lib/data-*.mjs`.** Components contain no copy and no numbers.

The same modules are read by the report generators in `../build/`, so the app, the Markdown
reports, the CSV and the SVG charts are generated from one model and cannot drift apart.
After editing the data:

```bash
node ../build/build.mjs     # regenerates the .md, .csv and chart exports, then validates
```

`../build/validate.mjs` runs 97 checks derived from the audit brief — the sidebar has exactly
five sections, every flaw carries its full evidence set and an eight-part brief within its
density caps, every register finding is traced, every percentage carries its denominator, no
improvement target was invented, priorities and confidence levels are unchanged, P3 items are
not reintroduced as flaws, and the production-safety statement is present.

### House rules for the data

These are what make the report trustworthy. Keep them.

- Every figure carries an evidence tag: `PROD`, `CODE`, `UX`, `EXT`, `FOUNDER`, `DERIVED` or `GAP`.
- Every percentage carries its calculation, e.g. `337 / 682`.
- Claims are graded `FACT` / `OBSERVATION` / `HYPOTHESIS`. A parent's certainty never transfers
  to its children — low conversion is a fact, its cause is not.
- Unknown means `DATA NOT AVAILABLE`. Never estimate, never interpolate.
- No improvement target is set before its baseline exists. Use
  `BASELINE FIRST — TARGET TO BE SET AFTER EXPERIMENT`.

---

## Charts

`lib/charts.mjs` emits SVG strings with no charting library and no runtime dependency. The app
itself renders no charts — the funnel is plain CSS, which is lighter, responsive and prints
cleanly. The module is build-time only: `../build/gen-charts.mjs` uses it to write the twelve
standalone exports in `../TNPSC_MENTORS_CHARTS/`.

---

## Accessibility & printing

Light and dark themes follow the OS by default and the choice persists in `localStorage`.
There is a skip link, the active nav item carries `aria-current`, and each flaw row exposes
`aria-expanded` / `aria-controls`. **Print / PDF** in the top bar prints the current page with
the chrome removed — on the 14 Flaws page every panel prints expanded, collapsed or not.

---

## Dependencies

`next`, `react`, `react-dom` — and TypeScript types in dev. Nothing else. No UI kit, no chart
library, no analytics, no fonts fetched at runtime.
