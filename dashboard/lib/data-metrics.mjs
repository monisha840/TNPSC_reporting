/*
 * TNPSC MENTORS — Growth & Product Health Dashboard
 * Single source of truth: production baseline, funnel, acquisition, plans,
 * journey, KPI model, methodology, data quality.
 *
 * READ-ONLY ANALYSIS ARTEFACT. Nothing here writes to, or is derived from a
 * write against, any production system. Every figure carries an evidence tag.
 *
 * Evidence tags: PROD | CODE | UX | EXT | FOUNDER | DERIVED | GAP
 */

const AUDIT = {
  product: 'TNPSC Mentors',
  title: 'Growth & Product Health Dashboard',
  subtitle: 'Developer-facing analytics & growth report',
  periodStart: '14 Jun 2026',
  periodEnd: '5 Sep 2026',
  prodSnapshot: '5 Sep 2026, 19:01 IST (read-only SELECT)',
  compiled: '7 Sep 2026',
  platformAgeDays: 83,
  platformAgeNote: '83 days measured 2026-06-14 → 2026-09-05, the timestamped production snapshot. The acquisition-trend query extends slightly past that date; see the reconciliation note.',
  repo: 'github.com/riyazlive04/TNPSC-Academy (React/Vite SPA + Express API + Supabase/Postgres)',
  surfaces: ['tnpscmentors.in', 'app.tnpscmentors.in', '/superadmin'],
};

/* ---------------------------------------------------------------------------
 * 1. PRODUCTION VERIFIED BASELINE
 * ------------------------------------------------------------------------- */

const BASELINE = [
  { key: 'registered',   label: 'Registered users',        value: '682',  raw: 682,  tag: 'PROD', source: 'profiles — count(*)', note: 'Every account row ever created. No soft-delete column exists, so nothing is ever pruned. Includes staff accounts.' },
  { key: 'started',      label: 'Started ≥1 test',         value: '345',  raw: 345,  tag: 'PROD', source: 'test_sessions — distinct user_id', note: '50.6% of 682.' },
  { key: 'completed',    label: 'Completed ≥1 test',       value: '286',  raw: 286,  tag: 'PROD', source: "test_sessions status='completed' — distinct user_id", note: '41.9% of 682; 82.9% of the 345 who started.' },
  { key: 'returned',     label: 'Returned on a second day', value: '16',  raw: 16,   tag: 'PROD', source: 'daily_activity — users with ≥2 distinct activity_date', note: 'FLOOR, not a measurement — daily_activity is written only by test submission and current-affairs completion.' },
  { key: 'checkoutUsers', label: 'Checkout users',         value: '11',   raw: 11,   tag: 'PROD', source: 'payments — distinct user_id on created rows', note: 'Price-accepted purchase attempts: a created row is written server-side only after a confirmation dialog showing plan and final price.' },
  { key: 'checkoutAttempts', label: 'Checkout attempts',   value: '20',   raw: 20,   tag: 'PROD', source: "payments status='created', never completed", note: '20 abandoned attempts. Adding the 1 completed payment gives 21 total price-accepted attempts — see the payments reconciliation.' },
  { key: 'payingCustomers', label: 'Genuine paying customers', value: '1', raw: 1,   tag: 'PROD', source: 'payments — non-zero amount, status=paid', note: 'Founder-generated, not acquired. Externally-acquired paying customers = 0 (founder-confirmed).' },
  { key: 'revenue',      label: 'All-time revenue',        value: '₹899', raw: 899,  tag: 'PROD', source: 'payments — sum(amount) = 89,900 paise', note: 'Externally-generated revenue = ₹0.' },
  { key: 'failedPayments', label: 'Failed payments',       value: '0',    raw: 0,    tag: 'PROD', source: "payments status='failed'", note: 'Zero in 83 days. Razorpay integration is sound — this is not a payment-infrastructure problem.' },
  { key: 'coupons',      label: 'Coupon redemptions',      value: '0',    raw: 0,    tag: 'PROD', source: 'payments — used_coupon across every plan', note: 'The coupon and promoter system is fully built, including per-promoter tracking, and has never been used once.' },
  { key: 'feedback',     label: 'Feedback responses',      value: '6',    raw: 6,    tag: 'PROD', source: 'app_feedback — count(*)', note: '0.88% of 682 users. All six are star ratings; none carries written text.' },
];

const SECONDARY = [
  { label: 'Active today',            value: '2',      tag: 'PROD', note: 'Identical under UTC and IST — the Stage 2 timezone bug is real in code but is not currently distorting this figure.' },
  { label: 'Active last 7 days',      value: '17',     tag: 'PROD', note: 'Identical under UTC and IST. 2.5% of 682.' },
  { label: 'Active last 30 days',     value: '135',    tag: 'PROD', note: '19.8% of 682. The 30d→7d ratio is 12.6%.' },
  { label: 'Tests completed',         value: '462',    tag: 'PROD', note: 'Terminal sessions, any score, any category.' },
  { label: 'Tests abandoned',         value: '161',    tag: 'PROD', note: 'Free practice engine ONLY. Paid formats structurally cannot produce this status.' },
  { label: 'Tests in progress',       value: '0',      tag: 'PROD', note: 'Dead schema — sessions are written already-final.' },
  { label: 'Questions in bank',       value: '49,916', tag: 'PROD', note: 'Unfiltered by the questions.active soft-hide flag the student sampler actually uses — overstates the live pool.' },
  { label: 'Average rating',          value: '4.33',   tag: 'PROD', note: 'n = 6. Not statistically meaningful.' },
  { label: 'Payment records = paid',  value: '4',      tag: 'PROD', note: '3 staff comps at ₹0 + 1 founder-generated ₹899.' },
];

/* ---------------------------------------------------------------------------
 * 2. CORE FUNNEL — every stage carries its own denominator
 * ------------------------------------------------------------------------- */

const FUNNEL = [
  {
    stage: 'Visitors',
    count: null, display: 'DATA NOT AVAILABLE',
    ofPrev: null, ofTotal: null, drop: null,
    source: 'GA4/GTM only — no server-side pageview store exists',
    tag: 'GAP',
    confidence: 'DATA NOT AVAILABLE',
    note: 'Top-of-funnel volume is unrecoverable for every historical period. The funnel below therefore starts at signup and has no true acquisition denominator.',
  },
  {
    stage: 'Signup completed',
    count: 682, display: '682',
    ofPrev: null, ofTotal: '100%', drop: null,
    source: 'profiles', tag: 'PROD', confidence: 'ACTUAL',
    note: 'Signup itself is confirmed working — verified end-to-end during the walkthrough and by the founder. Every loss below happens after a clean registration.',
  },
  {
    stage: 'Started ≥1 test',
    count: 345, display: '345',
    ofPrev: '50.6% of 682', ofTotal: '50.6%', drop: '−337',
    source: 'test_sessions', tag: 'PROD', confidence: 'ACTUAL',
    note: 'The largest absolute loss in the funnel: 337 registered users never start a single test.',
  },
  {
    stage: 'Completed ≥1 test',
    count: 286, display: '286',
    ofPrev: '82.9% of 345', ofTotal: '41.9%', drop: '−59',
    source: 'test_sessions', tag: 'PROD', confidence: 'ACTUAL',
    note: 'Once a user starts, they usually finish. Test-taking itself is not the problem.',
  },
  {
    stage: 'Returned on a 2nd day',
    count: 16, display: '16',
    ofPrev: '5.6% of 286', ofTotal: '2.3%', drop: '−270',
    source: 'daily_activity', tag: 'PROD', confidence: 'ACTUAL (FLOOR)',
    note: 'Largest proportional loss: 94.4%. This is a floor — a user who logs in and reads materials without submitting a test is not counted as active at all.',
  },
  {
    stage: 'Pricing viewed',
    count: null, display: 'DATA NOT AVAILABLE',
    ofPrev: null, ofTotal: null, drop: null,
    source: 'not instrumented on the in-app PricingCards screen', tag: 'GAP',
    confidence: 'DATA NOT AVAILABLE',
    note: 'The single most damaging measurement gap in the funnel: the checkout stage below has no denominator. It is unknown how many of the 682 ever saw a plan.',
  },
  {
    stage: 'Checkout started',
    count: 11, display: '11 people / 21 attempts',
    ofPrev: null, ofTotal: '1.6% of 682', drop: null,
    source: 'payments.created', tag: 'PROD', confidence: 'ACTUAL',
    note: 'CANNOT be expressed as a percentage of the previous stage. The 11 checkout users are not known to be a subset of the 16 returners — no query has established the overlap. Nor is there a pricing-view denominator.',
  },
  {
    stage: 'Payment completed',
    count: 1, display: '1',
    ofPrev: '9.1% of 11 people · 4.8% of 21 attempts', ofTotal: '0.15% of 682', drop: '−20 attempts',
    source: 'payments.paid', tag: 'PROD', confidence: 'ACTUAL',
    note: 'One transaction, one plan, one buyer.',
  },
  {
    stage: 'Externally-acquired paid',
    count: 0, display: '0',
    ofPrev: '0% of 1', ofTotal: '0.00% of 682', drop: '−1',
    source: 'founder-confirmed', tag: 'FOUNDER', confidence: 'ACTUAL',
    note: 'The single revenue-bearing record was founder-generated. In 83 days, nobody has discovered this product independently, valued it, and paid for it.',
  },
];

const FUNNEL_CAVEATS = [
  'The funnel has no top. Visitor and pricing-view counts do not exist, so no stage above signup and no stage immediately above checkout can be expressed as a conversion rate.',
  'Stages 2–5 (682 → 345 → 286 → 16) share a valid nested denominator: each population is a strict subset of the one above it, measured in the same tables.',
  'Stage 7 (checkout) breaks the chain. The 11 checkout users are NOT established as a subset of the 16 returners. Any "16 → 11" arrow would be an invented relationship.',
  'Returner counts are a floor. daily_activity is written only by test submission and current-affairs question completion.',
  '53.7% of the registered base (366 of 682) signed up within the last 30 days, so a material share of the 682 has had limited time to return at all. Retention percentages measured against the full base understate the mature-cohort rate by an unknown margin.',
];

/* ---------------------------------------------------------------------------
 * 3. ACQUISITION
 * ------------------------------------------------------------------------- */

const SIGNUPS_MONTHLY = [
  { month: 'June 2026',      signups: 19,  days: 17, partial: true,  perDay: '1.1', note: 'Partial month — the platform\'s first signup is 14 Jun 2026, so June covers 17 days, not 30.' },
  { month: 'July 2026',      signups: 226, days: 31, partial: false, perDay: '7.3', note: 'First full month. 6.5× June\'s daily rate.' },
  { month: 'August 2026',    signups: 396, days: 31, partial: false, perDay: '12.8', note: 'Best month on record. +75.2% over July (396 / 226).' },
  { month: 'September 2026', signups: 45,  days: null, partial: true, perDay: '6.4 – 9.0', note: 'PARTIAL MONTH. The exact query cut-off date is not recorded (5–7 Sep), so the implied daily rate is a range, not a point. This is NOT a collapse — it is 5–7 days of a 30-day month.' },
];

const ACQUISITION = {
  last30Signups: 366,
  last30Paid: 0,
  last7Signups: 50,
  last7PerDay: '7.1',
  days8to30PerDay: '13.7',
  share30d: '53.7%',
  headline: '366 new users in the last 30 days → 0 new paying customers.',
  reconciliation: {
    title: 'Reconciliation: monthly totals vs. the 682 baseline',
    body: 'The monthly breakdown sums to 686 (19 + 226 + 396 + 45), against a stated registered-user baseline of 682. The 4-user difference is consistent with the two queries having been run on different dates — the baseline snapshot is timestamped 5 Sep 2026 19:01 IST, while the acquisition query extends to the latest available production date. The exact run timestamp of the monthly query is NOT recorded.',
    status: 'DATA GAP — minor. It does not affect any conclusion in this report: every conclusion drawn from the monthly series is about shape and direction, not about the fourth significant figure. No figure has been adjusted to force the totals to agree.',
  },
  trendCaveats: [
    { label: 'FACT', text: 'Acquisition grew every full month measured: 19 (17 days) → 226 → 396. August is the best month on record.' },
    { label: 'FACT', text: '366 users signed up in the last 30 days and none of them paid.' },
    { label: 'CAUTION', text: 'September\'s 45 signups cover 5–7 days of a 30-day month. Reading it as a decline is a partial-period error. September must not be compared to a full month.' },
    { label: 'OBSERVATION', text: 'Derived from the two windows (assuming both end on the same date): the last 7 days ran at 7.1 signups/day, while days 8–30 ran at 13.7/day. A single 7-day window is not a trend and this is well inside normal weekly variation for a base this size.' },
    { label: 'DATA GAP', text: 'No weekly time series was supplied, so the 7-day observation above cannot be confirmed or dismissed. A week-by-week signup query is the cheapest way to close it.' },
    { label: 'DATA GAP', text: 'Source attribution is absent for every one of these signups. It is not known whether August\'s 396 came from Instagram, Telegram, YouTube, referral, organic or direct — see Flaw #12.' },
  ],
};

/* ---------------------------------------------------------------------------
 * 4. MONETIZATION
 * ------------------------------------------------------------------------- */

const PLANS = [
  {
    plan: 'Starter (Free)', key: 'free', price: '₹0', priceNum: 0, duration: 'Forever',
    audience: 'Everyone — the acquisition tier',
    features: '50 signup credits + 10/day (1 credit per question), on-screen explanations',
    tests: '1 free attempt per PYQ / CA topic', credits: '50 + 10/day',
    rankBooster: 'No', vettri: 'No', mock: '1 free 200-Q mock, ever', premium: 'No',
    attempts: null, paid: null, revenue: null, share: null,
  },
  {
    plan: 'Group 1 Mock Test Pack', key: 'group1_mock_pack', price: '₹399', priceNum: 399, duration: '80 days',
    audience: 'Group 1 aspirants',
    features: 'A bigger credit drip — NOT unlimited access',
    tests: 'No additional test bank', credits: '50/day (vs 10)',
    rankBooster: 'No', vettri: 'No', mock: 'Credit-metered only', premium: 'No',
    attempts: 2, paid: 0, revenue: '₹0', share: '10%',
  },
  {
    plan: 'Vettri Nichayam (monthly)', key: 'vettri_nichayam', price: '₹499', priceNum: 499, duration: '30 days',
    audience: 'Test-marathon users',
    features: 'Full Vettri / Test-Marathon bank',
    tests: 'Vettri bank', credits: 'Unlimited within Vettri',
    rankBooster: 'No', vettri: 'Yes', mock: 'No', premium: 'No',
    attempts: null, paid: null, revenue: null, share: null,
    note: 'The payments ledger records a single vettri_nichayam plan key. Whether the 4 recorded attempts split across the ₹499 monthly and ₹899 full variants is NOT established — DATA GAP.',
  },
  {
    plan: 'Vettri Nichayam (full)', key: 'vettri_nichayam_full', price: '₹899', priceNum: 899, duration: '60 days',
    audience: 'Test-marathon users, better per-day rate',
    features: 'Full Vettri / Test-Marathon bank',
    tests: 'Vettri bank', credits: 'Unlimited within Vettri',
    rankBooster: 'No', vettri: 'Yes', mock: 'No', premium: 'No',
    attempts: 4, paid: 1, revenue: '₹899', share: '19%',
    note: 'The only plan that has ever converted — and that sale was founder-generated.',
  },
  {
    plan: 'Rank Booster (Group 2 / 2A)', key: 'rank_booster_g2', price: '₹1,249', priceNum: 1249, duration: '90 days',
    audience: 'Group 2 / 2A aspirants',
    features: '23-test Group II/IIA series — a separate product from Vettri',
    tests: '23-test series', credits: 'Unlimited',
    rankBooster: 'Yes', vettri: 'No', mock: 'No', premium: 'No',
    attempts: 3, paid: 0, revenue: '₹0', share: '14%',
    note: 'MRP ₹1,800. Advertised as an "Independence Day offer valid till 31 Aug 2026" — expired, and still live. See Flaw #3.',
  },
  {
    plan: 'Premium Prelims Kit', key: 'premium_annual', price: '₹1,699', priceNum: 1699, duration: '180 days',
    audience: 'All prelims aspirants — the superset',
    features: 'Superset: Vettri-equivalent access AND Rank Booster included free',
    tests: 'Everything', credits: 'Unlimited',
    rankBooster: 'Yes (free)', vettri: 'Yes', mock: 'Yes', premium: 'Yes',
    attempts: 12, paid: 0, revenue: '₹0', share: '57%',
    note: 'Draws 57% of all purchase intent at the highest price point, and has converted zero times. 12 of the 20 abandonments (60%).',
  },
];

const ENTITLEMENT_OVERLAP = [
  { rule: 'Premium ⊇ Rank Booster', status: 'Overlap', note: 'Buying Premium gets Rank Booster free. A user who buys Rank Booster (₹1,249) then wants Vettri must buy again; a Premium buyer (₹1,699) would have had both for ₹450 more. Nothing on the pricing screen says so.' },
  { rule: 'Premium ⊇ Vettri', status: 'Overlap', note: 'Same superset relationship, also unstated.' },
  { rule: 'Vettri ⊉ Rank Booster', status: 'Trap', note: 'The most expensive non-Premium plan does NOT include the other most expensive non-Premium plan. This is the single least guessable rule in the catalogue.' },
  { rule: 'Mock Pack ⊉ Vettri, ⊉ Rank Booster', status: 'Trap', note: 'The ₹399 "Mock Test Pack" unlocks no test bank at all — it raises the daily credit grant from 10 to 50. A buyer reasonably expects mock exams.' },
  { rule: 'Vettri monthly vs. full', status: 'Ambiguous', note: '₹499/30d vs ₹899/60d — the same product at two rates. The ledger appears to collapse both into one plan key.' },
];

const PAYMENTS_RECONCILIATION = {
  title: 'Payments reconciliation — how 20, 21, 11, 4 and 1 fit together',
  rows: [
    { label: 'payments rows with status = created, never completed', value: '20', tag: 'PROD' },
    { label: 'Distinct users behind those 20 rows',                  value: '11', tag: 'PROD' },
    { label: 'Completed payment records (status = paid)',            value: '4',  tag: 'PROD' },
    { label: '— of which internal staff comps at ₹0 (founder-confirmed)', value: '3', tag: 'FOUNDER' },
    { label: '— of which revenue-bearing (₹899, founder-generated)',  value: '1',  tag: 'PROD + FOUNDER' },
    { label: 'Total price-accepted checkout attempts (20 abandoned + 1 completed)', value: '21', tag: 'DERIVED' },
    { label: 'Externally-acquired paying customers',                 value: '0',  tag: 'FOUNDER' },
  ],
  note: 'The 3 staff comps do NOT appear as checkout attempts: comp grants write a synthetic order ID directly to paid and never generate a created row (code-confirmed). This is why 20 + 1 = 21 attempts, not 24. The brief\'s headline "checkout attempts: 20" counts the abandoned rows; both figures are correct and are shown separately throughout.',
  attemptTiming: [
    { pattern: 'Repeat within seconds (12s and 11.7s spans)', users: 2, attempts: 4, reading: 'Comparison-shopping at the payment window. One user opened premium_annual then vettri_nichayam 12 seconds apart — using the checkout screen to discover what the plans cost, because the pricing screen did not say. Originally read as a technical failure signature; reinterpreted after checkout was verified working.' },
    { pattern: 'Repeat across days/weeks (59d, 16d, 13d spans)', users: 3, attempts: 10, reading: 'Sustained interest with an unresolved objection. One user returned 5 times across 59 days and never bought.' },
    { pattern: 'Single attempt, never returned', users: 6, attempts: 6, reading: 'One look, no return.' },
  ],
};

const REVENUE = [
  { label: 'All-time revenue',            value: '₹899',   tag: 'PROD',    note: '89,900 paise. One transaction.' },
  { label: 'Externally-generated revenue', value: '₹0',    tag: 'FOUNDER', note: 'The only revenue-bearing record was founder-generated.' },
  { label: 'Revenue per day',             value: '₹10.83', tag: 'DERIVED', note: '₹899 / 83 days.' },
  { label: 'ARPU (all registered users)', value: '₹1.32',  tag: 'DERIVED', note: '₹899 / 682.' },
  { label: 'AOV',                         value: '₹899',   tag: 'DERIVED', note: 'Single transaction — AOV and revenue are the same number.' },
  { label: 'Annualised run-rate',         value: '≈ ₹3,953', tag: 'DERIVED', note: '₹899 / 83 × 365. SCENARIO — arithmetic on a single transaction, not a forecast.' },
  { label: 'Refunds',                     value: '0',      tag: 'PROD',    note: '' },
  { label: 'Failed payments',             value: '0',      tag: 'PROD',    note: 'In 83 days. The payment rail works.' },
  { label: 'Coupon-attributed revenue',   value: '₹0',     tag: 'PROD',    note: 'Zero redemptions in 83 days.' },
  { label: 'Revenue concentration',       value: '100%',   tag: 'DERIVED', note: 'One plan, one transaction, one internally-generated buyer.' },
];

const CUSTOMER_SEGMENTATION = [
  { segment: 'Total records marked paid',            count: 4, revenue: '₹899', tag: 'PROD' },
  { segment: 'Internal staff comps (₹0)',            count: 3, revenue: '₹0',   tag: 'FOUNDER', note: 'Founder-confirmed team members. Recorded as premium_annual with ₹0 revenue.' },
  { segment: 'Founder-generated customer',           count: 1, revenue: '₹899', tag: 'FOUNDER', note: 'Arithmetic on aggregates: exactly one payment record carries a non-zero amount, and the founder states the single paying customer was generated internally — so that record is necessarily the one. No attempt has been made to guess which user ID it is.' },
  { segment: 'Founder-side referral',                count: null, revenue: null, tag: 'GAP', note: 'PENDING IDENTIFICATION — identifiers not yet supplied by the founder.' },
  { segment: 'Externally-acquired paying customers', count: 0, revenue: '₹0',   tag: 'FOUNDER', note: 'The headline metric of this audit.' },
];

const CONVERSION_RATES = [
  { basis: 'All paid records / all users',            calc: '4 / 682',  rate: '0.59%' },
  { basis: 'Revenue-generating / all users',          calc: '1 / 682',  rate: '0.15%' },
  { basis: 'Externally acquired / all users',         calc: '0 / 682',  rate: '0.00%' },
  { basis: 'Paid / checkout people',                  calc: '1 / 11',   rate: '9.1%' },
  { basis: 'Paid / checkout attempts',                calc: '1 / 21',   rate: '4.8%' },
  { basis: 'Paid / last-30-day signups',              calc: '0 / 366',  rate: '0.00%' },
];

/* ---------------------------------------------------------------------------
 * 5. ACTIVATION & RETENTION
 * ------------------------------------------------------------------------- */

const ACTIVATION = {
  registered: 682, started: 345, neverStarted: 337, completed: 286, startedNotCompleted: 59,
  startRate: '50.6%', neverStartRate: '49.4%', completeRate: '41.9%', completionOfStarters: '82.9%',
  kpis: [
    { name: 'Signup → first test start',      current: '50.6%', calc: '345 / 682', target: 'BASELINE FIRST — TARGET TO BE SET AFTER EXPERIMENT' },
    { name: 'Signup → first test completion', current: '41.9%', calc: '286 / 682', target: 'BASELINE FIRST — TARGET TO BE SET AFTER EXPERIMENT' },
    { name: 'Median time signup → first test start', current: 'DATA NOT AVAILABLE', calc: 'requires min(test_sessions.started_at) − profiles.created_at per user', target: 'Instrument, then baseline' },
  ],
};

const RETENTION = {
  completed: 286, returned: 16, neverReturned: 270, registered: 682,
  rates: [
    { basis: 'Returners / test-completers', calc: '16 / 286', rate: '5.6%',  note: 'The honest activation-conditioned rate: of users who actually completed a test, 5.6% came back on another day.' },
    { basis: 'Returners / all registered',  calc: '16 / 682', rate: '2.3%',  note: 'The whole-base rate. Lower, because it includes 337 users who never started a test and so were never in a position to return.' },
    { basis: 'Never returned / completers', calc: '270 / 286', rate: '94.4%', note: 'The largest proportional loss anywhere in the funnel.' },
    { basis: 'Active last 30 days',         calc: '135 / 682', rate: '19.8%', note: '' },
    { basis: 'Active last 7 days',          calc: '17 / 682',  rate: '2.5%',  note: '' },
    { basis: '7-day / 30-day active ratio', calc: '17 / 135',  rate: '12.6%', note: 'A decay signal — but also consistent with a fast-growing base where recent joiners have not yet had time to return.' },
  ],
  cohorts: [
    { label: 'D1',  value: 'DATA NOT AVAILABLE' },
    { label: 'D3',  value: 'DATA NOT AVAILABLE' },
    { label: 'D7',  value: 'DATA NOT AVAILABLE' },
    { label: 'D14', value: 'DATA NOT AVAILABLE' },
    { label: 'D30', value: 'DATA NOT AVAILABLE' },
  ],
  caveats: [
    'daily_activity is written ONLY by test submission and current-affairs question completion. A user who logs in, browses materials, reads the CA magazine or reviews bookmarks — but submits no test — is not counted as active at all. Every retention figure here is a FLOOR, not a measurement.',
    '53.7% of the base (366 of 682) registered in the last 30 days. Some of the "never returned" population has simply not had much time yet. Cohorted retention (D1/D3/D7/D14/D30 by signup week) is the only honest way to separate churn from immaturity, and it has not been run.',
    '83 days is a short window. Some apparent decay is normal cohort maturation.',
    'The habit loop reinforces only completion. Streaks, XP and badges are written exclusively by submit_test — a user who answers 20 questions and quits earns nothing.',
  ],
};

/* ---------------------------------------------------------------------------
 * 6. FEEDBACK
 * ------------------------------------------------------------------------- */

const FEEDBACK = {
  responses: 6,
  ratings: [5, 4, 5, 5, 2, 5],
  distribution: [
    { stars: 5, count: 4 }, { stars: 4, count: 1 }, { stars: 3, count: 0 },
    { stars: 2, count: 1 }, { stars: 1, count: 0 },
  ],
  average: '4.33',
  averageCalc: '(5 + 4 + 5 + 5 + 2 + 5) / 6 = 26 / 6 = 4.33',
  written: 0,
  responseRate: '0.88%',
  responseRateCalc: '6 / 682',
  notes: [
    'All six responses are star ratings. NOT ONE carries written text — there is no qualitative user data in the entire system.',
    'A 4.33 average from 6 responses tells you nothing actionable: it identifies no feature, no friction, and no reason not to upgrade.',
    'One 2-star rating exists. It is 1 of 6 responses. No rate should be computed from that — the sample is far too small, and there is no accompanying text explaining it.',
    'The prompt is deliberately rare by design: it appears once, only on the home screen, only after 2 completed tests, only for non-admins, then is suppressed for 3 months per user — enforced client AND server side.',
  ],
};

/* ---------------------------------------------------------------------------
 * 7. ANALYTICS HEALTH — tracking coverage matrix
 * ------------------------------------------------------------------------- */

const TRACKING = [
  { event: 'page_view',            tracked: 'Yes',     reliable: 'Yes',     where: 'GA4/GTM — every SPA route change, web + native split handled correctly', problem: '—' },
  { event: 'sign_up',              tracked: 'Partial', reliable: 'No',      where: 'trackSignUp() — authStore.ts', problem: 'ONE call site: the password/WhatsApp-OTP path. A Google-created account fires only trackLogin("google") and is indistinguishable from a returning user. Every signup number in GA4/Meta undercounts by however many people use Google.' },
  { event: 'login',                tracked: 'Yes',     reliable: 'Yes',     where: 'authStore.ts', problem: '—' },
  { event: 'start_test',           tracked: 'Yes',     reliable: 'Yes',     where: 'quiz engine', problem: '—' },
  { event: 'submit_test',          tracked: 'Yes',     reliable: 'Yes',     where: 'submit_test RPC', problem: '—' },
  { event: 'view_result',          tracked: 'Yes',     reliable: 'Yes',     where: 'Result page', problem: '—' },
  { event: 'test_abandoned',       tracked: 'Partial', reliable: 'No',      where: 'record_abandoned_test() — one call site, free practice engine only', problem: 'Mock, Vettri, Rank Booster and Test Series have no exit button and no abandon call. A rage-quit on content someone PAID for leaves zero trace. The reported 161 abandonments cover only the free engine.' },
  { event: 'pricing_viewed',       tracked: 'Partial', reliable: 'No',      where: 'trackViewContent — Register page load and /rank-booster landing only', problem: 'NOT confirmed to fire from the in-app PricingCards screen. This is why the checkout stage of the funnel has no denominator.' },
  { event: 'checkout_started',     tracked: 'Yes',     reliable: 'Yes',     where: 'PremiumCard, VettriCard, useMockPackPurchase, useRankBoosterPurchase', problem: '—' },
  { event: 'payment_success / failed', tracked: 'Yes', reliable: 'Yes',     where: 'razorpay.ts / IAP flow — single choke-point', problem: '—' },
  { event: 'purchase',             tracked: 'Yes',     reliable: 'Yes',     where: 'razorpay.ts', problem: '—' },
  { event: 'coupon_applied',       tracked: 'Yes',     reliable: 'Yes',     where: 'server-validated', problem: 'coupon_viewed is not tracked separately, so it is impossible to tell whether nobody looks for a code or nobody can find one.' },
  { event: 'subscription_renewed / expired / cancelled', tracked: 'No', reliable: 'n/a', where: 'not found in code', problem: 'Plan expiry is computed on read via bundleAccess(), never written as an event. Renewal and churn are therefore unmeasurable.' },
  { event: 'utm_source / medium / campaign / referrer', tracked: 'No', reliable: 'n/a', where: 'nowhere — no column exists in the schema', problem: 'Exhaustive schema search returned one non-match. Historical channel attribution is unrecoverable for every past period.' },
  { event: 'Server-side pageview / visitor count', tracked: 'No', reliable: 'n/a', where: 'no store exists', problem: 'The funnel has no top. Visitor volume is knowable only through GA4, which cannot be joined to who actually paid.' },
];

const METRIC_DEFECTS = [
  { metric: 'premiumActive', where: 'revenue_metrics.sql', defect: "Filters notes->>'plan' = 'premium_annual' only — 1 of 5 plans. Vettri, Rank Booster and Mock Pack customers do not count toward the founder's own headline paid figure.", impact: 'The business reads smaller to its own founder than it is. Currently masked by there being almost no customers; becomes actively misleading the moment conversion moves.' },
  { metric: 'Active today / Active 7d', where: 'get_platform_metrics()', defect: "Filters daily_activity with a bare current_date (UTC session clock) while every write stamps activity_date in IST.", impact: 'Real in code. NOT currently distorting anything: production returned identical values under UTC and IST (2 and 17). Downgraded from the P0 assigned in Stage 2 to P3.' },
  { metric: '"Active" itself', where: 'daily_activity', defect: 'Written only by test submission and current-affairs completion. Reading materials, browsing, reviewing bookmarks — none of it counts.', impact: 'Every engagement and retention number in this report is a floor.' },
  { metric: 'Tests abandoned (161)', where: 'test_sessions.status', defect: 'Only the free practice engine can ever write this status.', impact: 'Cannot answer "do paying customers finish what they bought."' },
  { metric: 'Total questions (49,916)', where: 'questions', defect: 'Unfiltered by the questions.active soft-hide flag the student-facing sampler actually applies.', impact: 'Overstates the live servable question pool by an unknown amount.' },
  { metric: 'passed_80_percent', where: 'test_sessions column name', defect: 'The enforced attendance gate is 25%, not 80%. The name is historical.', impact: 'Anyone reading this column will misinterpret it. Registered P3 — out of scope for this dashboard, listed here for completeness.' },
];

/* ---------------------------------------------------------------------------
 * 8. DISCOVERABILITY (EXTERNAL)
 * ------------------------------------------------------------------------- */

const EXTERNAL = [
  { metric: 'URLs in sitemap.xml',                      value: '5',  tag: 'EXT', note: 'Home + /privacy + /guidelines + /payment-policy + /refund-policy. The 7 products named in the site\'s own JSON-LD have no pages of their own.' },
  { metric: 'Third-party mentions / reviews for the brand', value: '0', tag: 'EXT', note: 'Brand name + "reviews" / "pricing" / "complaint" returns nothing about this site anywhere. The same searches surface pricing pages and comparison articles for half a dozen competitors.' },
  { metric: 'Competing TNPSC apps outranking it',       value: '7',  tag: 'EXT', note: 'Testbook, Entri, Nithra, KalviApp, Yukthi, Aram, TNPSC Master.' },
  { metric: 'Search result for "TNPSC group 2 test series"', value: 'Absent', tag: 'UX', note: 'Veranda Race 1st, TNPSC Master 2nd. TNPSC Mentors does not appear.' },
  { metric: 'Instagram followers',                      value: '581', tag: 'EXT', note: 'Bio positions the brand well and links to Telegram — the right instinct for this audience. A seed, not yet a funnel.' },
  { metric: 'App-store listings found',                 value: '0',  tag: 'EXT', note: 'UNCONFIRMED ABSENCE — a search did not find a listing. The codebase contains real IAP product IDs (com.tnpscmentor.app.premium90), which implies at least store registration. Awaiting founder confirmation.' },
  { metric: 'Per-route <title> / meta description',     value: 'Identical on every route', tag: 'EXT', note: 'Pure client-rendered SPA with no per-route server output. Every link shared on WhatsApp or Telegram unfurls as the generic homepage card.' },
  { metric: 'Public indexable pricing page',            value: 'None', tag: 'EXT', note: 'Pricing renders only inside the app shell — it cannot rank in search and cannot be forwarded.' },
  { metric: 'Social proof on landing / pricing',        value: 'None', tag: 'CODE', note: 'LandingPage.tsx and PricingCards.tsx grepped in full: zero testimonials, ratings or user counts. Competitor TNPSC Master leads with "10,000+ students".' },
  { metric: 'Frontend bundle',                          value: '~221 KB gz JS + 20 KB CSS', tag: 'EXT', note: 'GOOD. Hashed, cached 1yr immutable. Performance is NOT a problem — do not spend engineering time here.' },
  { metric: 'robots.txt architecture',                  value: 'Correct', tag: 'EXT', note: 'GOOD. Marketing site indexable, logged-in app noindexed. The judgment is sound; there is simply almost nothing behind it to index.' },
  { metric: 'Structured data (JSON-LD)',                value: 'Present', tag: 'EXT', note: 'GOOD. Clean EducationalOrganization + FAQPage schema, bilingual inLanguage tags. Mostly wasted, because there is one page for it to describe.' },
];

/* ---------------------------------------------------------------------------
 * 9. COMPLETE USER JOURNEY
 * ------------------------------------------------------------------------- */

const JOURNEY = [
  { stage: 'DISCOVERY', current: 'Almost entirely non-organic. 5 sitemap URLs, zero third-party mentions, no app-store listing found, brand absent from the category\'s primary search.', problem: 'No compounding discovery surface exists. Every acquired user arrives through a channel nobody can name.', evidence: '[EXT] 5 URLs · 0 mentions · 7 rivals ranking · [CODE] no UTM column anywhere', metric: 'DATA NOT AVAILABLE — no visitor store, no attribution', fix: 'Per-product indexable landing pages; capture first-touch source at signup.', flaws: [10, 11, 12], leak: 'unknown' },
  { stage: 'LANDING', current: 'One client-rendered page carrying 7 keyword intents. Identical title/meta on every route. No social proof.', problem: 'Nothing is shareable as itself, and there is no proof-of-scale at the moment of first impression.', evidence: '[EXT] identical <title> on 4 sampled routes · [CODE] zero testimonial/rating/user-count text in LandingPage.tsx', metric: 'DATA NOT AVAILABLE — landing-page views not stored server-side', fix: 'Per-route SSR/prerendered meta; state a real number (682 aspirants already practising).', flaws: [1, 10, 11], leak: 'unknown' },
  { stage: 'SIGNUP', current: 'Works cleanly. Confirmed end-to-end by walkthrough and by the founder.', problem: 'None. This stage is CLOSED — do not spend effort here.', evidence: '[UX][FOUNDER] verified working · [PROD] 682 accounts created', metric: '682 signups · 366 in the last 30 days · 50 in the last 7', fix: 'Only instrumentation: fire trackSignUp() on the Google path too.', flaws: [13], leak: 'none' },
  { stage: 'ONBOARDING', current: 'Signup lands the user in an app with no orientation. Up to five modals compete on entry: onboarding tour, starter-test prompt, push primer, marathon free alert, update prompt.', problem: 'The user does not know what to do next, and is asked to dismiss things before they have done anything.', evidence: '[UX] "When entered the application, I don\'t know what is so necessary and what should I do now" · "felt like there is too many pop up when entering the app" · [CODE] 5 competing entry modals', metric: 'DATA NOT AVAILABLE — no onboarding-completion event', fix: 'One question (which exam?), then one action (start this test). Sequence or suppress every other modal.', flaws: [4, 5], leak: 'major' },
  { stage: 'FIRST TEST', current: '3–4 taps from entry to a test. 345 of 682 users ever reach one.', problem: 'THE LARGEST ABSOLUTE LEAK. 337 registered users never start a single test.', evidence: '[PROD] 345 / 682 started · [UX] tap count measured during walkthrough', metric: '50.6% start rate (345 / 682) · 49.4% never start', fix: 'One-tap first test from the post-signup screen.', flaws: [4, 5], leak: 'largest-absolute' },
  { stage: 'RESULT', current: 'Works. 286 of the 345 starters complete (82.9%).', problem: 'Not the bottleneck. Once a user starts, they usually finish.', evidence: '[PROD] 286 / 345', metric: '82.9% completion among starters', fix: 'None required.', flaws: [], leak: 'minor' },
  { stage: 'REPEAT USE', current: '16 of 682 users have ever had two active days.', problem: 'THE LARGEST PROPORTIONAL LEAK. 270 of 286 completers never come back.', evidence: '[PROD] 16 users with ≥2 activity dates · [CODE] streaks/XP/badges written only by submit_test', metric: '5.6% of completers (16 / 286) · 2.3% of all users (16 / 682) — FLOOR', fix: 'A reason to return tomorrow; reward partial effort, not only completion.', flaws: [6, 7], leak: 'largest-proportional' },
  { stage: 'VALUE DISCOVERY', current: 'Revision and Insights — the screens that actually persuade — are reached late, by accident, and by almost nobody.', problem: 'The persuasive moment sits downstream of the paywall instead of upstream of it.', evidence: '[UX] "after checking on the Revision, Insights section, I feel good" — reached only after wandering in unprompted, and after two tests had already produced no desire to pay', metric: 'DATA NOT AVAILABLE — no feature-usage event on Revision/Insights', fix: 'Route the first session through the value moment before any upsell.', flaws: [1, 7], leak: 'major' },
  { stage: 'PRICING', current: 'Five price points across four ledger plan keys, with genuinely non-obvious entitlement overlap. No public page. No social proof.', problem: 'The user cannot tell the plans apart, and there is no view event, so nobody knows how many even get here.', evidence: '[UX] "I can\'t differentiate what each plan does" · [CODE] Premium ⊇ Rank Booster, Vettri ⊉ Rank Booster, Mock Pack unlocks neither · [PROD] two plans\' checkouts opened 12 seconds apart', metric: 'DATA NOT AVAILABLE — pricing_viewed not instrumented on PricingCards', fix: 'One-line differentiator per plan, a default recommendation, and a pricing_viewed event.', flaws: [1, 2, 11, 13], leak: 'unmeasured' },
  { stage: 'CHECKOUT', current: 'Works. Verified to the final payment step on a real device. 11 people, 21 price-accepted attempts.', problem: 'Not a defect — a demand problem. 20 of 21 attempts are abandoned and nothing follows up.', evidence: '[UX] tested to the final payment step — works · [PROD] 20 created rows, oldest unresolved 79 days', metric: '11 people · 21 attempts · 1 completed (9.1% of people, 4.8% of attempts)', fix: 'Do not rebuild checkout. Build recovery.', flaws: [2, 9], leak: 'major' },
  { stage: 'PAYMENT', current: 'Razorpay with HMAC verification, idempotency and server-side re-fetch. Zero failures in 83 days.', problem: 'None technically. Commercially: 1 transaction, ₹899, founder-generated.', evidence: '[PROD] 0 failed payments · [PROD] 4 paid records, 3 staff comps at ₹0', metric: '₹899 all-time · ₹0 externally generated', fix: 'None to the rail. Everything upstream.', flaws: [8], leak: 'terminal' },
  { stage: 'RETENTION', current: 'No post-purchase loop exists to observe, because there is no paying cohort to retain.', problem: 'Renewal and expiry are computed on read, never written as events — churn would be unmeasurable even if there were customers.', evidence: '[CODE] no subscription_renewed / expired / cancelled event exists', metric: 'DATA NOT AVAILABLE', fix: 'Write plan lifecycle events now, so the first real cohort is measurable from day one.', flaws: [6, 13], leak: 'unmeasured' },
  { stage: 'REFERRAL', current: 'A complete coupon and promoter system, including per-promoter revenue tracking, fully built and never used once.', problem: 'There is no discoverable path to a coupon code inside the product.', evidence: '[PROD] 0 redemptions in 83 days · [UX] "Where to get the coupon codes"', metric: '0 redemptions · 0 coupon-attributed revenue', fix: 'Surface the code entry, then recruit promoters. This is a recruitment problem, not a build.', flaws: [9], leak: 'unused-asset' },
];

/* ---------------------------------------------------------------------------
 * 10. ROOT CAUSE TREE
 * ------------------------------------------------------------------------- */

const ROOT_TREE = {
  label: 'LOW REVENUE', status: 'FACT', detail: '₹899 all-time · ₹0 externally generated · 0 external customers in 83 days',
  children: [
    {
      label: 'Low conversion', status: 'FACT', detail: '11 people reached checkout, 1 bought (founder-generated). 366 signups in 30 days → 0 paid.',
      children: [
        { label: 'Weak value perception', status: 'HYPOTHESIS', detail: 'Strongest available explanation. Supported by walkthrough (n=1) and consistent with all three funnel losses — not independently verified.', flaw: 1 },
        { label: 'Pricing complexity',    status: 'OBSERVATION', detail: 'Entitlement overlap is code-confirmed FACT. That it suppresses conversion is an observation supported by the 12-second cross-plan checkout.', flaw: 2 },
        { label: 'Weak trust',            status: 'FACT', detail: 'Zero testimonials, ratings or user counts anywhere on the acquisition or pricing surfaces.', flaw: 1 },
        { label: 'Expired offer',         status: 'FACT', detail: 'Offer expired 31 Aug 2026, still visible 5 Sep on the dedicated paid-ads landing page.', flaw: 3 },
        { label: 'Price resistance at ₹1,699', status: 'HYPOTHESIS', detail: 'Competes with pricing complexity as the explanation for premium_annual\'s 0/12. The two fit the data equally well and are not separable without instrumentation or interviews.', flaw: 2 },
      ],
    },
    {
      label: 'Low activation', status: 'FACT', detail: '337 of 682 registered users (49.4%) never start a single test.',
      children: [
        { label: 'Poor orientation',   status: 'OBSERVATION', detail: '"I don\'t know what is so necessary and what should I do now." Walkthrough n=1; the 337 outcome is FACT.', flaw: 4 },
        { label: 'Navigation friction', status: 'OBSERVATION', detail: '3–4 taps between entry and the only thing that delivers value.', flaw: 4 },
        { label: 'Popup overload',     status: 'OBSERVATION', detail: 'Five competing entry modals confirmed in code; the felt experience is walkthrough evidence.', flaw: 4 },
      ],
    },
    {
      label: 'Low retention', status: 'FACT', detail: '270 of 286 completers (94.4%) never returned. 16 of 682 have ever had two active days.',
      children: [
        { label: 'Weak habit loop',              status: 'OBSERVATION', detail: 'Nothing in the product creates a reason to open it tomorrow.', flaw: 6 },
        { label: 'Poor content surfacing',       status: 'OBSERVATION', detail: 'Current Affairs images not loading; Kural of the Day has no prompt; the free tier is under-communicated.', flaw: 7 },
        { label: 'Partial effort not reinforced', status: 'FACT', detail: 'Streaks, XP and badges are written exclusively by submit_test. Answer 20 questions and quit, earn nothing. (Registered P3-5; carried in because it is a retention mechanism, not code debt.)', flaw: 6 },
      ],
    },
    {
      label: 'Measurement gaps', status: 'FACT', detail: 'Several conclusions above cannot currently be confirmed or refuted, because the data to do so does not exist.',
      children: [
        { label: 'Attribution',        status: 'FACT', detail: 'No utm_source / medium / campaign / referrer column exists anywhere in the schema.', flaw: 12 },
        { label: 'Event tracking',     status: 'FACT', detail: 'Paid-format abandonment cannot be logged; Google signups are not counted as signups; pricing views are not instrumented.', flaw: 13 },
        { label: 'Feedback',           status: 'FACT', detail: '6 ratings, 0 words, from 682 users. No qualitative signal exists in the system at all.', flaw: 14 },
        { label: 'Incomplete funnel',  status: 'FACT', detail: 'No visitor store and no pricing-view event — the funnel has neither a top nor a valid checkout denominator.', flaw: 13 },
      ],
    },
  ],
};

/* ---------------------------------------------------------------------------
 * 11. PRIORITY / PHASES / KPI MODEL
 * ------------------------------------------------------------------------- */

const PHASES = [
  {
    name: 'PHASE 1 — CONVERSION FOUNDATION',
    rationale: 'Conversion is the stage with a confirmed zero. Acquisition is confirmed growing, so every day this stage stays broken converts more traffic into nothing.',
    items: [
      { n: 1, flaw: 3, title: 'Retire the expired promotional offer and make expiry automatic', why: 'Certain evidence, trivial effort, actively working against live ad traffic right now.' },
      { n: 2, flaw: 2, title: 'Make the plans distinguishable in five seconds', why: 'Code-confirmed entitlement overlap plus direct production evidence of comparison-shopping at the payment window.' },
      { n: 3, flaw: 1, title: 'Deliver the value moment before the first upsell', why: 'Highest expected impact, lowest certainty about mechanism. Ships with instrumentation so it can be judged.' },
    ],
  },
  {
    name: 'PHASE 2 — ACTIVATION',
    rationale: '337 users is the largest absolute loss in the funnel, and it sits immediately after a signup step that is confirmed working.',
    items: [
      { n: 4, flaw: 4, title: 'Rebuild the first-run experience: one question, one action', why: 'Sequence the five competing entry modals; cut the tap count to the first test.' },
      { n: 5, flaw: 5, title: 'Instrument and move signup → first-test-start', why: 'The metric this phase is judged on. Baseline 50.6%.' },
      { n: 6, flaw: 7, title: 'Fix Current Affairs images and surface the free tier and Kural of the Day', why: 'A content defect sits directly on the daily-return hook.' },
    ],
  },
  {
    name: 'PHASE 3 — RETENTION',
    rationale: '94.4% of completers never return. Fixing conversion without fixing this converts a growing base into a growing pile of one-session users.',
    items: [
      { n: 7, flaw: 6, title: 'Build a return loop, and reward partial effort', why: 'Currently the habit system reinforces only completed tests.' },
      { n: 8, flaw: 9, title: 'Turn on checkout recovery and make coupon codes discoverable', why: '11 warm, price-accepted prospects and an entire promoter system sitting unused.' },
    ],
  },
  {
    name: 'PHASE 4 — MEASUREMENT',
    rationale: 'SEQUENCING CAVEAT: this phase is numbered fourth but items 9 and 10 arguably belong at position zero. Without a pricing-view event you cannot measure whether Phase 1 worked, and without attribution you cannot tell which channel produced any improvement. Treat the numbering as a dependency graph, not a queue.',
    items: [
      { n: 9,  flaw: 13, title: 'Close the event-tracking gaps', why: 'Pricing views, paid-format abandonment, Google signups, plan lifecycle events, premiumActive across all five plans.' },
      { n: 10, flaw: 12, title: 'Capture acquisition attribution at signup', why: 'Persist first-touch and last-touch source through signup → payment.' },
      { n: 11, flaw: 14, title: 'Redesign the feedback instrument to collect reasons, not only scores', why: '6 ratings and 0 words is not a satisfaction measurement.' },
    ],
  },
  {
    name: 'PHASE 5 — ACQUISITION SCALE',
    rationale: 'Deliberately last. Acquisition is the one part of this business that is already working. Scaling traffic into a funnel with 0.00% external conversion converts spend into nothing.',
    items: [
      { n: 12, flaw: 10, title: 'Build the organic discovery surface', why: 'Per-product indexable landing pages, per-route metadata, topic content.' },
      { n: 13, flaw: 11, title: 'Make the product and its price publicly visible', why: 'A rankable, forwardable pricing page; confirm and complete app-store presence.' },
    ],
  },
];

const PHASE_CAVEAT = 'Within-phase ordering is by effort and evidence confidence, not by proven causal sequence. The evidence supports the PHASE ordering (conversion is the confirmed zero; activation is the largest absolute loss; acquisition is already working). It does not support a claim that item 4 must ship before item 5. Do not treat the numbers as a proven critical path.';

const KPI_MODEL = [
  { metric: 'Externally-acquired paying customers', current: '0', calc: '0 / 682', target: '> 0', targetType: 'DEFINITIONAL', period: 'Continuous', criteria: 'One person who was not staff, not the founder, and not a founder-side referral pays real money. This is the single success criterion for the entire Phase 1 effort.', flaw: 8 },
  { metric: 'Expired offers visible in production', current: '1 (Rank Booster, expired 31 Aug 2026)', calc: 'manual + automated expiry check', target: '0', targetType: 'DEFINITIONAL', period: 'Continuous', criteria: 'No offer whose deadline has passed is rendered anywhere. Enforced by an expiry check, not by a person remembering.', flaw: 3 },
  { metric: 'Signup → first test start', current: '50.6%', calc: '345 / 682', target: 'BASELINE FIRST — TARGET TO BE SET AFTER EXPERIMENT', targetType: 'EXPERIMENT', period: 'Weekly cohort, 30 days post-change', criteria: 'Measured on signup cohorts AFTER the change ships, never against the lifetime blended figure — the base is growing too fast for a blended number to move visibly.', flaw: 5 },
  { metric: 'Signup → first test completion', current: '41.9%', calc: '286 / 682', target: 'BASELINE FIRST — TARGET TO BE SET AFTER EXPERIMENT', targetType: 'EXPERIMENT', period: 'Weekly cohort, 30 days post-change', criteria: 'Same cohorting rule.', flaw: 5 },
  { metric: 'D1 / D3 / D7 / D14 / D30 retention', current: 'DATA NOT AVAILABLE', calc: 'requires cohorted daily_activity by signup week', target: 'Instrumented and reported weekly', targetType: 'DEFINITIONAL', period: 'From first report', criteria: 'The target is the existence of the measurement. No retention percentage target can be responsibly set before the curve has been seen once.', flaw: 6 },
  { metric: 'Return rate (2+ active days, completers)', current: '5.6%', calc: '16 / 286', target: 'BASELINE FIRST — TARGET TO BE SET AFTER EXPERIMENT', targetType: 'EXPERIMENT', period: '30-day cohort', criteria: 'Must be re-baselined against a broadened "active" definition first — the current figure is a floor, so any improvement would be partly a measurement artefact.', flaw: 6 },
  { metric: 'Pricing-view → checkout-start rate', current: 'UNMEASURABLE — no pricing_viewed event', calc: 'n/a', target: 'Measurable', targetType: 'DEFINITIONAL', period: 'From instrumentation', criteria: 'The checkout stage of the funnel acquires a denominator. Until then, no conversion claim about the pricing screen can be evaluated.', flaw: 13 },
  { metric: 'Paid formats logging abandonment', current: '0 of 4', calc: 'Mock, Vettri, Rank Booster, Test Series', target: '4 of 4', targetType: 'DEFINITIONAL', period: 'From instrumentation', criteria: 'A quit inside paid content produces a row. Precondition for ever answering "do paying customers finish what they bought".', flaw: 13 },
  { metric: 'premiumActive plan coverage', current: '1 of 5 plans', calc: "revenue_metrics.sql filters plan = 'premium_annual'", target: '5 of 5', targetType: 'DEFINITIONAL', period: 'Immediate', criteria: "The founder's headline paid-user figure counts every paying customer.", flaw: 13 },
  { metric: 'Signups carrying an acquisition source', current: '0%', calc: '0 / 682 — no column exists', target: '100% of NEW signups', targetType: 'DEFINITIONAL', period: 'From instrumentation', criteria: 'Every new profile row carries first-touch source, medium, campaign, referrer and landing page, and that source survives through to the payments row. Historical attribution is unrecoverable and is not part of this target.', flaw: 12 },
  { metric: 'Coupon redemptions', current: '0', calc: '0 in 83 days', target: 'BASELINE FIRST — TARGET TO BE SET AFTER EXPERIMENT', targetType: 'EXPERIMENT', period: '30 days after the code path is discoverable', criteria: 'Split the metric: (a) can users find where to enter a code, (b) do promoters exist to hand codes out. Today both are zero and they are being measured as one number.', flaw: 9 },
  { metric: 'Abandoned-checkout recovery rate', current: 'UNMEASURABLE — no recovery mechanism exists', calc: 'n/a', target: 'Measurable, then BASELINE FIRST', targetType: 'EXPERIMENT', period: '30 days after recovery ships', criteria: 'A recovered payment is attributable to the recovery mechanism. NOTE: recovery is a product mechanism. No user is to be contacted as part of this audit.', flaw: 9 },
  { metric: 'Feedback response rate', current: '0.88%', calc: '6 / 682', target: 'BASELINE FIRST — TARGET TO BE SET AFTER EXPERIMENT', targetType: 'EXPERIMENT', period: '30 days after the prompt is redesigned', criteria: 'Response rate alone is not the goal — see the next row.', flaw: 14 },
  { metric: 'Feedback responses carrying written text', current: '0', calc: '0 / 6', target: '> 0', targetType: 'DEFINITIONAL', period: '30 days after redesign', criteria: 'At least one free-text answer explaining a rating. Today the system contains zero words of user opinion.', flaw: 14 },
  { metric: 'Indexable product pages', current: '5 sitemap URLs (home + 4 legal)', calc: 'sitemap.xml', target: 'BASELINE FIRST — TARGET TO BE SET AFTER EXPERIMENT', targetType: 'EXPERIMENT', period: '90 days after publication', criteria: 'Judge on organic sessions and ranked queries, not on page count. Page count is an output, not an outcome.', flaw: 10 },
];

/* ---------------------------------------------------------------------------
 * 12. DATA QUALITY
 * ------------------------------------------------------------------------- */

const DATA_QUALITY = {
  know: [
    'Exactly how many people registered, started a test, completed a test, returned, reached checkout and paid — all from direct read-only SELECTs against production.',
    'That acquisition grew every full month measured: 226 in July, 396 in August, and 366 in the last 30 days.',
    'That zero of those 366 recent signups paid anything.',
    'That the payment rail works: 0 failures in 83 days, HMAC verification, idempotency and a server-side re-fetch before crediting.',
    'That signup works: verified by walkthrough and by the founder.',
    'That checkout works: tested to the final payment step on a real device.',
    'That the five-plan entitlement overlap is real, because it was read directly in the pricing and entitlement code.',
    'That the promotional offer on the paid-ads landing page expired on 31 Aug 2026 and was still visible on 5 Sep.',
    'That no acquisition-source column exists anywhere in the schema.',
    'That three of the four paid records are staff comps, and the fourth was founder-generated.',
  ],
  dontKnow: [
    'How many visitors the site gets, or ever got. There is no server-side pageview store.',
    'Where any user came from. No UTM, medium, campaign or referrer data exists for any historical period — this is unrecoverable, not merely unqueried.',
    'How many of the 682 ever saw a pricing screen. pricing_viewed is not instrumented on PricingCards.',
    'What retention actually looks like by cohort. D1/D3/D7/D14/D30 have not been run.',
    'Whether the 11 checkout users overlap with the 16 returners.',
    'Whether any of the 11 abandoners later converted.',
    'Why users abandon paid tests — paid formats cannot log abandonment at all.',
    'What users think. Six star ratings and zero words.',
    'Anything from Microsoft Clarity — no access at any point across all three stages.',
    'Whether the app is actually published on the Play Store or App Store.',
    'How many of the 682 accounts are team accounts (beyond the 3 confirmed comps).',
    'The exact run date of the acquisition-trend query, which is why the monthly totals sum to 686 against a 682 baseline.',
  ],
  confirmed: [
    '0 externally-acquired paying customers in 83 days.',
    '337 of 682 registered users (49.4%) never start a test.',
    '270 of 286 test-completers (94.4%) never return on a second day.',
    '20 abandoned checkouts from 11 people; the oldest unresolved for 79 days; no recovery mechanism of any kind exists.',
    '0 coupon redemptions in 83 days, against a fully-built promoter system.',
    'No acquisition attribution exists anywhere in the schema.',
    'An expired offer is live on the dedicated paid-ads landing page.',
    'Paid test formats cannot log abandonment.',
    'premium_annual draws 57% of all purchase attempts and has converted zero times.',
    'Acquisition grew month over month: 19 (17 days) → 226 → 396.',
    'Streaks, XP and badges are written only by submit_test — partial effort earns nothing.',
    'Zero social proof exists on the landing or pricing surfaces.',
  ],
  hypotheses: [
    'That value is not established before the paywall is shown. This is the STRONGEST available explanation for non-payment, and it is still a hypothesis: it rests on a walkthrough of n = 1 plus consistency with all three funnel losses. It has not been independently verified.',
    'That plan indistinguishability suppresses conversion. Supported by the walkthrough and by one user opening two plans\' checkouts 12 seconds apart. Not proven.',
    'That price resistance at ₹1,699 explains premium_annual\'s 0-for-12. Competes directly with the hypothesis above; the two fit the data equally well and cannot be separated without instrumentation or user interviews.',
    'That popup overload and tap count materially suppress activation. The 337 outcome is fact; attributing it to these specific causes is not.',
    'That the free tier being under-communicated costs conversion. Walkthrough observation only.',
  ],
  disproved: [
    { claim: 'Checkout is broken', by: 'Walkthrough tested it to the final payment step on a real device. It works. This was the leading hypothesis going into Stage 3 and it failed.' },
    { claim: 'Payment infrastructure is failing', by: '0 failed payments in 83 days.' },
    { claim: 'Signup friction causes the drop-off', by: 'Signup verified working by walkthrough and founder. The 337 loss occurs AFTER a clean registration — which is exactly what makes it an orientation problem.' },
    { claim: 'Frontend performance is a cause', by: '~221 KB gzipped JS, hashed and immutably cached. Measured directly.' },
    { claim: 'Consent gating suppresses analytics', by: 'The banner was removed by product decision; trackers now fire for ~100% of web sessions. Stage 1\'s concern no longer applies.' },
    { claim: 'The free tier is too generous', by: 'The walkthrough completed two full tests and still felt no urge to upgrade. That is absent value perception, not excess generosity.' },
    { claim: 'The Active-Today timezone bug is urgent', by: 'Production returned identical values under UTC and IST (2 and 17). Real in code, currently harmless. Downgraded from P0 to P3.' },
    { claim: 'Paying users are 8× more engaged than non-payers', by: 'RETRACTED. That comparison measured staff accounts building and testing the product. It is an artifact of internal usage, not buyer behaviour, and must not be cited.' },
  ],
  gaps: [
    { gap: 'Visitor / top-of-funnel volume', why: 'No server-side pageview store', recoverable: 'Only prospectively' },
    { gap: 'Historical channel attribution', why: 'No UTM/referrer column has ever existed', recoverable: 'NO — permanently unrecoverable' },
    { gap: 'Pricing-page view counts', why: 'Not instrumented on PricingCards', recoverable: 'Only prospectively' },
    { gap: 'Paid-format abandonment', why: 'record_abandoned_test is wired to the free engine only', recoverable: 'Only prospectively' },
    { gap: 'D1/D3/D7/D14/D30 cohort retention', why: 'Query not yet run', recoverable: 'YES — data exists, run the query' },
    { gap: 'Engagement distribution (is there an engaged core?)', why: 'Query not yet run', recoverable: 'YES' },
    { gap: 'Whether any of the 11 abandoners later converted', why: 'Query not yet run', recoverable: 'YES' },
    { gap: 'Overlap between the 11 checkout users and the 16 returners', why: 'Query not yet run', recoverable: 'YES' },
    { gap: 'Team/staff account count within the 682', why: 'Role-breakdown query not yet run', recoverable: 'YES' },
    { gap: 'Weekly signup time series', why: 'Only monthly totals supplied', recoverable: 'YES' },
    { gap: 'Qualitative user opinion', why: '6 ratings, 0 written responses', recoverable: 'Only prospectively, after the feedback instrument is redesigned' },
    { gap: 'Clarity behavioural data (scroll depth, rage clicks, quick-backs, device split)', why: 'No access in any stage', recoverable: 'YES — needs a login' },
    { gap: 'App-store publication status', why: 'Awaiting founder answer', recoverable: 'YES — one answer' },
    { gap: 'Identifiers for the internal customer and founder-side referral', why: 'Awaiting founder', recoverable: 'YES' },
    { gap: 'Exact run date of the acquisition-trend query', why: 'Not recorded; monthly totals sum to 686 vs a 682 baseline', recoverable: 'YES — re-run with a timestamp' },
  ],
};

/* ---------------------------------------------------------------------------
 * 13. METHODOLOGY
 * ------------------------------------------------------------------------- */

/* ---------------------------------------------------------------------------
 * 12b. DATA LIMITATIONS + AUDIT DOCUMENTS
 * Consolidated from caveats already recorded elsewhere in this model. Every
 * entry cites the finding it is drawn from — no new caveat is introduced.
 * ------------------------------------------------------------------------- */

const DATA_LIMITATIONS = [
  {
    limit: 'Registered users are profiles, not active users',
    detail: 'The 682 figure counts every account row ever created. There is no soft-delete or account-status column, so nothing is ever pruned, and staff accounts are included.',
    from: 'Baseline — profiles',
  },
  {
    limit: 'daily_activity is a narrow measure of "active"',
    detail: 'It is written only by test submission and current-affairs question completion. A user who logs in and reads materials, reviews bookmarks or browses is not counted as active at all. Every retention and engagement figure in this audit is therefore a FLOOR, not a measurement.',
    from: 'Flaw #6, Flaw #13',
  },
  {
    limit: 'Payment rows must be read by their lifecycle semantics',
    detail: 'A created row is written server-side only after a confirmation dialog showing the plan and final price, so it evidences checkout intent at an accepted price. But a created row that is never completed has NO defined terminal state in the schema. Describing all 20 as confirmed user abandonment is an interpretation, not something the lifecycle establishes — one person also accounts for 5 of them.',
    from: 'Flaw #9 — payments ledger',
  },
  {
    limit: 'Acquisition attribution does not exist',
    detail: 'No utm_source, utm_medium, utm_campaign, utm_content or referrer column exists anywhere in the schema. Channel performance cannot be reconstructed for any historical period, and this is permanently unrecoverable rather than merely unqueried.',
    from: 'Flaw #12',
  },
  {
    limit: 'Feedback is ratings without reasons',
    detail: 'All six responses are star ratings. None carries written text, so there is no qualitative user data anywhere in the system.',
    from: 'Flaw #14',
  },
  {
    limit: 'Several dashboard metrics are defined more narrowly than their names suggest',
    detail: 'premiumActive counts 1 of 5 plans; the 161 abandonment figure covers the free practice engine only; the 49,916 question count is unfiltered by the active flag the student sampler applies.',
    from: 'Flaw #13 — metric definition defects',
  },
  {
    limit: 'The funnel has no top and no checkout denominator',
    detail: 'There is no server-side pageview store and pricing views are not instrumented, so visitor volume is unknown and the checkout stage cannot be expressed as a conversion rate.',
    from: 'Flaw #13',
  },
  {
    limit: 'A material share of the base is very recent',
    detail: '366 of 682 users (53.7%) registered within the last 30 days, so part of the observed non-return is cohort immaturity rather than churn. Cohorted retention would separate the two and has not been run.',
    from: 'Flaw #6',
  },
  {
    limit: 'The walkthrough is n = 1',
    detail: 'The first-time-user session was conducted once, by a non-aspirant. It is strong evidence that a friction exists and no evidence at all about how common it is. Exam-category comprehension findings should be discounted entirely.',
    from: 'Methodology — UX',
  },
  {
    limit: 'Microsoft Clarity was never accessible',
    detail: 'No access at any point across the three audit stages. No behavioural inference anywhere in this audit is drawn from Clarity.',
    from: 'Methodology — Clarity',
  },
  {
    limit: 'Hypotheses stay labelled as hypotheses',
    detail: 'Low conversion is a FACT. That weak value communication causes it is a HYPOTHESIS. The certainty of a parent claim never transfers to its children, and no hypothesis in this audit has been promoted to a finding.',
    from: 'Audit convention',
  },
];

const AUDIT_DOCUMENTS = [
  {
    name: 'Stage 1 — External Audit',
    file: 'TNPSC_Mentors_Stage_1_Audit.md',
    covers: 'Public HTTP and HTML layer, sitemap, per-route metadata, SEO surface, app-store presence, social reach, competitive set, bundle size.',
  },
  {
    name: 'Stage 2 — Growth Diagnosis',
    file: 'TNPSC_Mentors_Stage_2_Growth_Diagnosis.md',
    covers: 'Read-only codebase and schema audit: entitlement rules, pricing constants, event instrumentation call sites, metric definitions, habit-loop writers, feedback-prompt gating.',
  },
  {
    name: 'Stage 3 — Status & read-only query pack',
    file: 'TNPSC_Mentors_Stage3_STATUS.md · TNPSC_Mentors_Stage3_READONLY_Query_Pack.sql · TNPSC_Mentors_Stage3_MANUAL_Queries.sql',
    covers: 'The SELECT-only query set used against production, and the access verification performed before any query was run.',
  },
  {
    name: 'Consolidated backlog register',
    file: 'TNPSC_Mentors_BACKLOG_REGISTER.md',
    covers: 'The original P0/P1/P2/P3 finding IDs that the 14 major flaws consolidate, plus the closed and disproved hypotheses.',
  },
  {
    name: 'Final growth verification',
    file: 'TNPSC_Mentors_FINAL_GROWTH_VERIFICATION.md',
    covers: 'Production baseline, plan-wise funnel, payment abandonment reconciliation, internal-customer adjustment, root-cause ranking, data gaps and confidence limits.',
  },
  {
    name: 'Original audit brief',
    file: 'TNPSC_Mentors_Data_Analytics_Growth_Audit.md',
    covers: 'The scope, analyst role and evidence-grading rules this audit was conducted under.',
  },
];

const EVIDENCE_TAGS = [
  { tag: 'PROD',    name: 'Production database', desc: 'Measured directly in the production Postgres database through read-only SELECT statements. No write of any kind was issued.' },
  { tag: 'CODE',    name: 'Source code / schema', desc: 'Read from a read-only clone of the application repository, including the src/, server/ and supabase/ trees.' },
  { tag: 'UX',      name: 'First-time-user walkthrough', desc: 'A single guided session on a real device by a non-aspirant tester. n = 1. Strong for finding friction, weak for measuring how common it is.' },
  { tag: 'EXT',     name: 'External / public audit', desc: 'Public HTTP, sitemap, robots.txt, page source, search results, app-store search and social profiles. Nothing required a login.' },
  { tag: 'FOUNDER', name: 'Founder-confirmed', desc: 'Stated directly by the founder — used for facts only they can supply, such as which accounts are staff.' },
  { tag: 'DERIVED', name: 'Derived arithmetic', desc: 'Computed in this report from tagged figures above. The calculation is always shown alongside the result.' },
  { tag: 'GAP',     name: 'Data not available', desc: 'The figure does not exist, or exists somewhere this audit could not reach. Never estimated, never filled in.' },
];

const METHODOLOGY_SOURCES = [
  { source: 'Production database (read-only)', covers: 'All baseline counts, funnel stages, payments ledger, plan-wise demand, retention counts, feedback ratings, acquisition trend', access: 'Read-only SELECT, snapshot 5 Sep 2026 19:01 IST + a later acquisition query', limits: 'No writes were issued at any point. Some queries (cohort retention, engagement distribution, abandoner crossover) have not been run.' },
  { source: 'Codebase (read-only clone)', covers: 'Entitlement rules, pricing constants, event instrumentation, schema search, metric definitions, habit-loop writers, feedback-prompt gating', access: 'Full src/, server/, supabase/ trees', limits: 'The clone reflects a point in time; production may have moved since.' },
  { source: 'First-time-user walkthrough', covers: 'Orientation, tap counts, popup load, plan comprehension, value moment, coupon discoverability, Current Affairs images, checkout verification', access: 'One guided session, real device', limits: 'n = 1, conducted by a non-aspirant. Exam-category comprehension findings should be explicitly discounted. Strong for existence, useless for prevalence.' },
  { source: 'External / public audit', covers: 'Sitemap, per-route metadata, search visibility, competitor set, app-store search, social reach, bundle size, robots.txt, structured data', access: 'Public HTTP only', limits: 'A search that does not find a listing is not proof the listing does not exist.' },
  { source: 'Founder-provided context', covers: 'Which paid accounts are staff; that the single revenue-bearing customer was internally generated', access: 'Direct statement', limits: 'Identifiers for the internal customer and the founder-side referral are still pending.' },
  { source: 'Microsoft Clarity', covers: 'NOTHING — no access at any point across Stages 1, 2 or 3', access: 'None', limits: 'Clarity is loaded as a GTM container tag rather than called from the codebase, so even its firing rules live outside the repository. No behavioural inference anywhere in this report is drawn from Clarity.' },
];

const SAFETY = [
  'No production code was modified.',
  'No production database was modified.',
  'No INSERT, UPDATE, DELETE, UPSERT, MERGE, ALTER, CREATE, DROP or TRUNCATE was executed.',
  'No tables, views or functions were created in production.',
  'No migrations were run.',
  'No RLS policy was changed.',
  'No Supabase, Razorpay, analytics or Clarity configuration was changed.',
  'No user, payment or coupon record was touched.',
  'No message, email or WhatsApp was sent to any user — including the 11 abandoned-checkout prospects.',
  'Nothing was deployed.',
  'Every calculation in this dashboard was performed locally from read-only query output.',
  'Where a figure was unavailable it is shown as DATA NOT AVAILABLE. No metric was estimated, interpolated or invented.',
];

export { AUDIT, BASELINE, SECONDARY, FUNNEL, FUNNEL_CAVEATS, SIGNUPS_MONTHLY, ACQUISITION, PLANS, ENTITLEMENT_OVERLAP, PAYMENTS_RECONCILIATION, REVENUE, CUSTOMER_SEGMENTATION, CONVERSION_RATES, ACTIVATION, RETENTION, FEEDBACK, TRACKING, METRIC_DEFECTS, EXTERNAL, JOURNEY, ROOT_TREE, PHASES, PHASE_CAVEAT, KPI_MODEL, DATA_QUALITY, EVIDENCE_TAGS, METHODOLOGY_SOURCES, SAFETY, DATA_LIMITATIONS, AUDIT_DOCUMENTS };
