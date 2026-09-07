/**
 * Typed entry point to the audit data model.
 *
 * `data.mjs` is plain ESM so that the report generators in `../build/` can read
 * the exact same objects the app renders — the dashboard, the Markdown reports,
 * the CSV and the SVG charts can therefore never disagree with one another.
 */
import raw from './data.mjs';
import type { AuditData, Flaw } from './types';

export const D = raw as unknown as AuditData;

export const flawById = (id: number): Flaw | undefined =>
  D.FLAWS.find((f) => f.id === id);

export const handoffByFlaw = (id: number) =>
  D.HANDOFF.find((h) => h.flaw === id);

export default D;
