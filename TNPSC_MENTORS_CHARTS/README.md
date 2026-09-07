# TNPSC_MENTORS_CHARTS

Standalone SVG charts generated from the same read-only data model as the dashboard
and the Markdown reports. Every chart is self-contained: no external fonts, no scripts,
no network requests. Each carries a light and a dark palette and follows the viewer's
system theme.

| File | Chart |
|---|---|
| `01-core-funnel.svg` | Core funnel |
| `02-signups-by-month.svg` | Signups by month |
| `03-activation-split.svg` | Activation split |
| `04-retention.svg` | Retention |
| `05-plan-demand.svg` | Plan demand vs conversion |
| `06-revenue-reality.svg` | Revenue reality |
| `07-feedback-ratings.svg` | Feedback ratings |
| `08-priority-matrix.svg` | Priority matrix |
| `09-root-cause-tree.svg` | Root cause tree |
| `10-tracking-coverage.svg` | Event tracking coverage |
| `11-journey-leaks.svg` | Journey leakage map |
| `12-flaws-by-priority.svg` | Flaws by priority |

**Source:** read-only production queries, read-only codebase inspection, a first-time-user
walkthrough, and a public/external audit. No production code, database, configuration or
deployment was modified to produce them.

Regenerate with `node build/gen-charts.js` from the project root.
