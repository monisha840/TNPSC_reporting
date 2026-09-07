# TNPSC Mentors — Growth & Product Health Audit

> **EVERY ARTEFACT HERE WAS GENERATED USING READ-ONLY DATA.**
> **NO PRODUCTION CODE, DATABASE, CONFIGURATION OR DEPLOYMENT WAS MODIFIED.**

Internal analysis and planning artefacts for the TNPSC Mentors development team.

**Audit period:** 14 Jun 2026 → 5 Sep 2026
**Production snapshot:** 5 Sep 2026, 19:01 IST (read-only SELECT)
**Compiled:** 7 Sep 2026

---

## The finding, in one paragraph

682 registered users in 83 days. ₹899 of all-time revenue, and every rupee of it internally
generated — three of the four `paid` records are staff comps at ₹0 and the fourth was
founder-generated. **Externally-acquired paying customers: 0.** Acquisition is growing
(19 → 226 → 396 signups by month; 366 in the last 30 days) and none of those 366 people paid.
The bottleneck is conversion, activation and retention — not traffic. Checkout, signup, the
payment rail and frontend performance were each tested and eliminated as explanations.

---

## The dashboard

A Next.js application in [`dashboard/`](dashboard/) — four sections: Overview, User Funnel,
14 Flaws, Fixes.

```bash
cd dashboard
npm install
npm run dev          # http://localhost:3000
```

Deploys to Vercel as a static site (all 20 routes prerender; no server runtime, no environment
variables). Set **Root Directory = `dashboard`** in the Vercel project, or run
`npx vercel --cwd dashboard --prod`. See [`dashboard/README.md`](dashboard/README.md) for the
full developer guide.

> Before deploying: this contains real user counts, revenue figures and named product
> weaknesses. It ships `noindex` headers, but **noindex is not access control** — turn on Vercel
> Deployment Protection if the audience is the development team only.

---

## Deliverables

| Artefact | What it is |
|---|---|
| **[`dashboard/`](dashboard/)** | The Next.js dashboard application — the primary deliverable |
| **[`TNPSC_MENTORS_GROWTH_DASHBOARD.md`](TNPSC_MENTORS_GROWTH_DASHBOARD.md)** | The full report in Markdown — same content, same numbers |
| **[`TNPSC_MENTORS_DEVELOPER_HANDOFF.md`](TNPSC_MENTORS_DEVELOPER_HANDOFF.md)** | One block per flaw: module, components, tables, current vs expected behaviour, required events, acceptance criteria, success metric |
| **[`TNPSC_MENTORS_GROWTH_DATA.csv`](TNPSC_MENTORS_GROWTH_DATA.csv)** | Every figure in tidy long format — 521 rows, 42 datasets, each with its calculation and evidence tag |
| **[`TNPSC_MENTORS_CHARTS/`](TNPSC_MENTORS_CHARTS/)** | 12 standalone SVG charts, theme-aware, no scripts |
| [`build/`](build/) | Generators for the Markdown, CSV and chart exports |

Everything is generated from one data model — `dashboard/lib/data*.mjs` — so the app, the
reports, the CSV and the charts can never disagree with each other.

```bash
node build/build.mjs     # regenerate the .md / .csv / chart exports, then validate
```

### Source material (inputs, unchanged)

`TNPSC_Mentors_Stage_1_Audit.md` · `TNPSC_Mentors_Stage_2_Growth_Diagnosis.md` ·
`TNPSC_Mentors_Stage3_STATUS.md` · `TNPSC_Mentors_Stage3_READONLY_Query_Pack.sql` ·
`TNPSC_Mentors_Stage3_MANUAL_Queries.sql` · `TNPSC_Mentors_BACKLOG_REGISTER.md` ·
`TNPSC_Mentors_FINAL_GROWTH_VERIFICATION.md` · `TNPSC_Mentors_Data_Analytics_Growth_Audit.md`

---

## How to read it

The app has four sections: **Overview** (what is happening and how serious it is), **User
Funnel** (what the numbers show), **14 Flaws** (why we believe it is happening, with the
evidence) and **Fixes** (what we propose doing about it).

The full audit record — methodology, data limitations, priority matrix, developer handoff,
30/60/90 plan, the P3 register and the disproved hypotheses — remains in
`TNPSC_MENTORS_GROWTH_DASHBOARD.md` and `TNPSC_MENTORS_GROWTH_DATA.csv`. The dashboard is the
executive summary of it, deliberately kept short.

Everything in **Fixes** is a proposal at status `PLANNED / NOT IMPLEMENTED`. Nothing has been
built, and no TNPSC Mentors application code was accessed or changed. Implementation would
happen later, separately, in the application repository.

Every figure carries an evidence tag:

| Tag | Meaning |
|---|---|
| `[PROD]` | Measured directly in the production database via read-only SELECT |
| `[CODE]` | Read from a read-only clone of the application repository |
| `[UX]` | First-time-user walkthrough — **n = 1**, by a non-aspirant |
| `[EXT]` | Public HTTP, sitemap, search results, app-store search, social profiles |
| `[FOUNDER]` | Stated directly by the founder |
| `[DERIVED]` | Computed in this report; the calculation is always shown |
| `[GAP]` | Does not exist, or was unreachable. Never estimated. |

Claims are graded **FACT** (measured), **OBSERVATION** (a real pattern, causality not
established) or **HYPOTHESIS** (plausible, evidence-linked, unproven). The certainty of a parent
claim never transfers to its children: low conversion is a fact; its cause is not.

---

## Scope boundaries

This is a **reporting and planning** project. It does not fix anything, and nothing in it should
be applied to production without a developer reviewing and implementing it deliberately.

- No production code, database, configuration, RLS policy, analytics or deployment was modified.
- No `INSERT`, `UPDATE`, `DELETE`, `UPSERT`, `MERGE`, `ALTER`, `CREATE`, `DROP` or `TRUNCATE`
  was executed. No migrations were run.
- **No user was contacted** — including the 11 identifiable abandoned-checkout prospects.
- Where a figure was unavailable it is shown as `DATA NOT AVAILABLE`. No metric was estimated,
  interpolated or invented, and no improvement target was chosen before its baseline existed.
- **P3 technical debt is out of scope.** The six P3 items are listed in the flaw register so
  their absence is not mistaken for an oversight. One — partial-effort reinforcement (`P3-5`) —
  is carried into Flaw #6 and labelled as carried-in, because it is a retention mechanism rather
  than code debt.
- The dashboard is a separate application. It is not part of, and does not touch, the production
  TNPSC Mentors codebase.
