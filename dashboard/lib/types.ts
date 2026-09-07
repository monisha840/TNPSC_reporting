/**
 * Shape of the audit data model (`lib/data.mjs`).
 *
 * The data itself is authored as plain ESM object literals so the report
 * generators in `../build/` can consume it without a compile step. These types
 * are the contract the app relies on; `lib/data.ts` casts once at the boundary.
 */

export type EvidenceTag =
  | 'PROD' | 'CODE' | 'UX' | 'EXT' | 'FOUNDER' | 'DERIVED' | 'GAP'
  | string; /* some rows carry compound tags such as 'PROD + FOUNDER' */

export type Priority = 'P0' | 'P1' | 'P2';
export type ClaimStatus = 'FACT' | 'OBSERVATION' | 'HYPOTHESIS' | 'CONFIRMED' | 'OBSERVED' | 'CAUTION' | 'DATA GAP' | string;

export interface Audit {
  product: string; title: string; subtitle: string;
  periodStart: string; periodEnd: string; prodSnapshot: string; compiled: string;
  platformAgeDays: number; platformAgeNote: string; repo: string; surfaces: string[];
}

export interface BaselineMetric {
  key: string; label: string; value: string; raw: number;
  tag: EvidenceTag; source: string; note: string;
}

export interface SecondaryMetric { label: string; value: string; tag: EvidenceTag; note: string }

export interface FunnelStage {
  stage: string; count: number | null; display: string;
  ofPrev: string | null; ofTotal: string | null; drop: string | null;
  source: string; tag: EvidenceTag; confidence: string; note: string;
}

export interface MonthlySignups {
  month: string; signups: number; days: number | null;
  partial: boolean; perDay: string; note: string;
}

export interface Acquisition {
  last30Signups: number; last30Paid: number; last7Signups: number;
  last7PerDay: string; days8to30PerDay: string; share30d: string; headline: string;
  reconciliation: { title: string; body: string; status: string };
  trendCaveats: { label: string; text: string }[];
}

export interface Plan {
  plan: string; key: string; price: string; priceNum: number; duration: string;
  audience: string; features: string; tests: string; credits: string;
  rankBooster: string; vettri: string; mock: string; premium: string;
  attempts: number | null; paid: number | null; revenue: string | null;
  share: string | null; note?: string;
}

export interface EntitlementRule { rule: string; status: string; note: string }

export interface PaymentsReconciliation {
  title: string;
  rows: { label: string; value: string; tag: EvidenceTag }[];
  note: string;
  attemptTiming: { pattern: string; users: number; attempts: number; reading: string }[];
}

export interface RevenueRow { label: string; value: string; tag: EvidenceTag; note: string }

export interface CustomerSegment {
  segment: string; count: number | null; revenue: string | null;
  tag: EvidenceTag; note?: string;
}

export interface ConversionRate { basis: string; calc: string; rate: string }

export interface ActivationModel {
  registered: number; started: number; neverStarted: number;
  completed: number; startedNotCompleted: number;
  startRate: string; neverStartRate: string; completeRate: string; completionOfStarters: string;
  kpis: { name: string; current: string; calc: string; target: string }[];
}

export interface RetentionModel {
  completed: number; returned: number; neverReturned: number; registered: number;
  rates: { basis: string; calc: string; rate: string; note: string }[];
  cohorts: { label: string; value: string }[];
  caveats: string[];
}

export interface FeedbackModel {
  responses: number; ratings: number[];
  distribution: { stars: number; count: number }[];
  average: string; averageCalc: string; written: number;
  responseRate: string; responseRateCalc: string; notes: string[];
}

export interface TrackingRow {
  event: string; tracked: string; reliable: string; where: string; problem: string;
}

export interface MetricDefect { metric: string; where: string; defect: string; impact: string }

export interface ExternalRow { metric: string; value: string; tag: EvidenceTag; note: string }

export interface JourneyStage {
  stage: string; current: string; problem: string; evidence: string;
  metric: string; fix: string; flaws: number[]; leak: string;
}

export interface TreeLeaf { label: string; status: ClaimStatus; detail: string; flaw: number }
export interface TreeBranch { label: string; status: ClaimStatus; detail: string; children: TreeLeaf[] }
export interface RootTree { label: string; status: ClaimStatus; detail: string; children: TreeBranch[] }

export interface Phase {
  name: string; rationale: string;
  items: { n: number; flaw: number; title: string; why: string }[];
}

export interface KpiRow {
  metric: string; current: string; calc: string; target: string;
  targetType: 'DEFINITIONAL' | 'EXPERIMENT' | string;
  period: string; criteria: string; flaw: number;
}

export interface DataQuality {
  know: string[]; dontKnow: string[]; confirmed: string[]; hypotheses: string[];
  disproved: { claim: string; by: string }[];
  gaps: { gap: string; why: string; recoverable: string }[];
}

export interface EvidenceTagDef { tag: string; name: string; desc: string }
export interface MethodologySource { source: string; covers: string; access: string; limits: string }

/* ------------------------------------------------------------------ flaws */

export interface FlawEvidence { tag: EvidenceTag; text: string }
export interface FlawNumber { label: string; calc: string; value: string }
export interface FlawUnderlying { id: string; text: string; tag: EvidenceTag }

export interface FlawBriefMetric { label: string; value: string; sub?: string }

/** Condensed presentation of the A-Q content. Adds no facts of its own. */
export interface FlawBrief {
  /** Indices into `evidence` — the three strongest points shown in the dashboard. */
  evidencePick: number[];
  problem: string[];
  evidence: FlawEvidence[];
  why: string[];
  confirmed: string[];
  hypothesis: string[];
  metrics: FlawBriefMetric[];
  checked: FlawEvidence[];
  sources: string[];
}

export interface Flaw {
  id: number; title: string; priority: Priority; category: string; severity: string;
  evidenceStatus: string; rootCauseStatus: ClaimStatus; funnelStage: string;
  confidence: string; oneLiner: string;
  underlying: FlawUnderlying[];
  brief: FlawBrief;

  A_summary: string[];
  B_flaw: string[];
  C_why: string[];
  D_evidence: FlawEvidence[];
  E_howChecked: string[];
  F_numbers: FlawNumber[];
  G_affected: { count: string; pct: string; stage: string; note: string };
  H_rootCause: { confirmed: string[]; hypothesis: string[] };
  I_userImpact: string[];
  J_businessImpact: string[];
  K_devImpact: string[];
  L_fix: string[];
  M_implementation: string[];
  N_successMetric: string[];
  O_priority: Priority;
  P_confidence: string;
  Q_source: string[];
}

export interface MatrixPoint {
  id: number; impact: number; effort: number | null; effortLabel?: string; note: string;
}

export interface Traceability {
  note: string;
  verificationFindings: { id: string; text: string; flaw: number }[];
  outOfScope: { title: string; note: string; items: { id: string; text: string }[] };
  closed: { title: string; items: { item: string; why: string }[] };
}

export interface Diagnosis {
  headline: string; body: string[];
  keyContrast: { left: string; leftLabel: string; right: string; rightLabel: string };
  septemberWarning: string;
}

export interface Conclusion {
  title: string; summary: string[];
  questions: { q: string; a: string[] }[];
}

export interface HandoffBlock {
  flaw: number; priority: Priority; module: string; components: string; tables: string;
  current: string; problem: string; expected: string; events: string; data: string;
  acceptance: string[]; metric: string;
}

export interface PlanWindow { window: string; items: string[] }

export interface DataLimitation { limit: string; detail: string; from: string }
export interface AuditDocument { name: string; file: string; covers: string }

/* ------------------------------------------------------------------- fixes */

export type ExampleRowKind =
  | 'stat' | 'line' | 'muted' | 'label' | 'cta' | 'chip' | 'chips' | 'locked' | 'strike' | 'field';

export interface ExampleRow { kind: ExampleRowKind; text?: string; items?: string[] }

export type ExampleBlock =
  | { type: 'screen'; caption?: string; rows: ExampleRow[] }
  | { type: 'map'; pairs: [string, string][] }
  | { type: 'flow'; steps: string[] }
  | { type: 'list'; items: string[] };

export interface FixExample { caption?: string; blocks: ExampleBlock[] }

/** A proposal. Priority is not stored here — it is read from the connected flaw. */
export interface Fix {
  id: number;
  flaw: number;
  title: string;
  proposed: string;
  change: string[];
  /** Current state — confirmed findings only. */
  before: string[];
  /** Proposed state. */
  after: string[];
  example: FixExample;
  outcome: string[];
  caveat?: string;
  baseline?: string;
}

/* ---------------------------------------------------------------- the model */

export interface AuditData {
  AUDIT: Audit;
  BASELINE: BaselineMetric[];
  SECONDARY: SecondaryMetric[];
  FUNNEL: FunnelStage[];
  FUNNEL_CAVEATS: string[];
  SIGNUPS_MONTHLY: MonthlySignups[];
  ACQUISITION: Acquisition;
  PLANS: Plan[];
  ENTITLEMENT_OVERLAP: EntitlementRule[];
  PAYMENTS_RECONCILIATION: PaymentsReconciliation;
  REVENUE: RevenueRow[];
  CUSTOMER_SEGMENTATION: CustomerSegment[];
  CONVERSION_RATES: ConversionRate[];
  ACTIVATION: ActivationModel;
  RETENTION: RetentionModel;
  FEEDBACK: FeedbackModel;
  TRACKING: TrackingRow[];
  METRIC_DEFECTS: MetricDefect[];
  EXTERNAL: ExternalRow[];
  JOURNEY: JourneyStage[];
  ROOT_TREE: RootTree;
  PHASES: Phase[];
  PHASE_CAVEAT: string;
  KPI_MODEL: KpiRow[];
  DATA_QUALITY: DataQuality;
  EVIDENCE_TAGS: EvidenceTagDef[];
  METHODOLOGY_SOURCES: MethodologySource[];
  SAFETY: string[];
  DATA_LIMITATIONS: DataLimitation[];
  AUDIT_DOCUMENTS: AuditDocument[];
  FLAWS: Flaw[];
  MATRIX: MatrixPoint[];
  TRACEABILITY: Traceability;
  DIAGNOSIS: Diagnosis;
  CONCLUSION: Conclusion;
  HANDOFF: HandoffBlock[];
  PLAN_30_60_90: PlanWindow[];
  FIXES: Fix[];
  FIX_STATUS: { state: string; detail: string };
}
