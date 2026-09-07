/*
 * Combined data model for every generated deliverable.
 */

import * as M from './data-metrics.mjs';
import FLAWS_1 from './data-flaws-1.mjs';
import FLAWS_2 from './data-flaws-2.mjs';
import BRIEFS from './data-flaws-brief.mjs';
import { FIXES, FIX_STRATEGY, FIX_STATUS } from './data-fixes.mjs';

/* The A-Q audit content is authoritative and untouched. `brief` is a condensed
 * presentation of it, attached here so the source files stay byte-identical. */
const FLAWS = [...FLAWS_1, ...FLAWS_2].map((f) => ({ ...f, brief: BRIEFS[f.id] }));

/* ---------------------------------------------------------------------------
 * PRIORITY MATRIX — impact × effort placement for all 14 flaws
 * ------------------------------------------------------------------------- */

const MATRIX = [
  { id: 1,  impact: 5, effort: 4, note: 'Highest expected impact; effort is real because it is a sequencing change across the first session and the upsell trigger.' },
  { id: 2,  impact: 5, effort: 2, note: 'Copy, a comparison surface and a default recommendation. No pricing change.' },
  { id: 3,  impact: 3, effort: 1, note: 'A constant and an expiry check. The cheapest item in the report.' },
  { id: 4,  impact: 4, effort: 3, note: 'Modal arbitration plus a re-thought first screen.' },
  { id: 5,  impact: 5, effort: 3, note: 'Largest absolute loss in the funnel; the fix overlaps heavily with #4.' },
  { id: 6,  impact: 5, effort: 4, note: 'Largest proportional loss; requires a measurement change and a product change, carefully sequenced.' },
  { id: 7,  impact: 3, effort: 2, note: 'A bug fix and two surfacing changes.' },
  { id: 8,  impact: 5, effort: null, effortLabel: 'inherited', note: 'OUTCOME METRIC. No independent effort — it moves when #1, #2, #3 and #9 move. Plotted on impact only.' },
  { id: 9,  impact: 4, effort: 2, note: 'Recovery tracking, a coupon entry surface, and a recruitment problem that needs no code.' },
  { id: 10, impact: 4, effort: 4, note: 'High ceiling, long horizon, and explicitly not the current bottleneck.' },
  { id: 11, impact: 3, effort: 2, note: 'Effort estimate is conditional on the unanswered app-store question.' },
  { id: 12, impact: 4, effort: 2, note: 'Small build, permanently compounding value. Every day of delay is another day of unrecoverable history.' },
  { id: 13, impact: 4, effort: 3, note: 'Mostly trivial items plus one real piece of work (paid-format abandon beacon). Gates the evaluation of Phase 1.' },
  { id: 14, impact: 3, effort: 1, note: 'A form redesign and a gating change.' },
];

/* ---------------------------------------------------------------------------
 * TRACEABILITY — 35 underlying findings → 14 consolidated flaws
 * ------------------------------------------------------------------------- */

const TRACEABILITY = {
  note: 'The backlog register carries 28 non-P3 finding IDs (P0-1…P0-4, P1-1…P1-12, P2-1…P2-12). Seven further findings were established during the verification stage and are given V- identifiers here. Together they are the 35 underlying findings consolidated into the 14 major flaws below. Nothing has been dropped. P3-5 additionally appears inside Flaw #6 because the brief explicitly requires partial-effort reinforcement there, and it is a retention mechanism rather than code debt — it is labelled as carried-in throughout.',
  verificationFindings: [
    { id: 'V-1', text: 'Externally-acquired paying customers: 0 of 682. The single revenue-bearing record was founder-generated.', flaw: 8 },
    { id: 'V-2', text: 'premium_annual draws 57% of all purchase intent (12 of 21 attempts) and has converted zero times.', flaw: 2 },
    { id: 'V-3', text: 'Pricing views are not instrumented on PricingCards, so the checkout funnel stage has no denominator.', flaw: 13 },
    { id: 'V-4', text: 'No server-side visitor or pageview store exists — the funnel has no top.', flaw: 13 },
    { id: 'V-5', text: 'Microsoft Clarity behavioural data was inaccessible across all three audit stages.', flaw: 14 },
    { id: 'V-6', text: 'Zero written feedback — all six responses are ratings only.', flaw: 14 },
    { id: 'V-7', text: '366 signups in the last 30 days produced 0 new paying customers.', flaw: 8 },
  ],
  outOfScope: {
    title: 'P3 technical debt — EXPLICITLY OUT OF SCOPE',
    note: 'These six items are recorded in the backlog register and are deliberately excluded from this dashboard, per the brief. They are listed here only so that nobody mistakes their absence for an oversight. P3-5 is the single exception: it appears inside Flaw #6 because the brief requires it there.',
    items: [
      { id: 'P3-1', text: "superadmin_revoke_rank_booster() writes status='revoked', which the payments check constraint forbids. Will throw the first time it is used in a refund dispute." },
      { id: 'P3-2', text: 'Active-today timezone mismatch — real in code, currently harmless. Production returned identical UTC and IST values. Downgraded from the P0 assigned in Stage 2.' },
      { id: 'P3-3', text: 'passed_80_percent is misnamed — the enforced attendance gate is 25%.' },
      { id: 'P3-4', text: 'in_progress is dead schema — 0 rows; sessions are written already-final.' },
      { id: 'P3-5', text: 'Habit loop ignores partial effort. CARRIED IN to Flaw #6 at the brief\'s explicit request.' },
      { id: 'P3-6', text: 'README contradicts production reality (states Supabase Cloud; production is self-hosted).' },
    ],
  },
  closed: {
    title: 'CLOSED — disproved, do not spend effort here',
    items: [
      { item: 'Broken checkout', why: 'Tested to the final payment step on a real device — works correctly. This was the leading hypothesis going into Stage 3 and it failed.' },
      { item: 'Signup friction', why: 'Verified working by walkthrough and founder. The 337 activation loss occurs after a clean registration.' },
      { item: 'Payment infrastructure', why: 'Zero failed payments in 83 days. HMAC verification, idempotency and server-side re-fetch are sound.' },
      { item: 'Frontend performance', why: '~221 KB gzipped JS + 20 KB CSS, hashed and immutably cached. Measured directly.' },
      { item: 'Consent gating suppressing analytics', why: 'The banner was removed by product decision; trackers now fire for ~100% of web sessions.' },
      { item: '"The free tier is too generous"', why: 'Never supported by evidence. The walkthrough took two full tests and still felt no urge to upgrade — absent value perception, not excess generosity.' },
      { item: 'Paying users are 8× more engaged', why: 'RETRACTED. The comparison measured staff accounts building and testing the product.' },
    ],
  },
};

/* ---------------------------------------------------------------------------
 * EXECUTIVE DIAGNOSIS
 * ------------------------------------------------------------------------- */

const DIAGNOSIS = {
  headline: 'Acquisition is growing. Everything downstream of it is not.',
  body: [
    'The single most important thing to understand about this business is that the problem is NOT a lack of traffic.',
    'Signups grew every full month measured: 226 in July, 396 in August — the best month on record — and 366 in the last 30 days. Something in acquisition is working.',
    'In those same 30 days, zero of those 366 people paid anything.',
    'The bottleneck is conversion, activation and retention, in that order of certainty. Conversion is a confirmed zero: nobody outside the building has ever paid for this product. Activation loses 49.4% of everyone who registers. Retention loses 94.4% of everyone who completes a test.',
    'Every technical explanation that was available has been tested and disproved. Checkout works — it was driven to the final payment step on a real device. Payment infrastructure has recorded zero failures in 83 days. Signup works. Frontend performance is fine. The failure is not in the machinery.',
    'The single most diagnostic observation in the entire audit came from the walkthrough: after two completed tests the tester felt no desire to pay — but after reaching Revision and Insights, said "I feel good." The product does contain a persuasive value moment. It arrives late, by accident, and after the paywall has already been shown repeatedly.',
  ],
  keyContrast: { left: '366', leftLabel: 'new users in the last 30 days', right: '0', rightLabel: 'new paying customers' },
  septemberWarning: 'September shows 45 signups. That is 5–7 days of a 30-day month, NOT a collapse. Comparing a partial month to a full one is the most common way to misread this chart, and it would lead directly to the wrong decision — pouring effort into acquisition, which is the one part of this business that is already working.',
};

const CONCLUSION = {
  title: 'THE REAL BUSINESS PROBLEM',
  summary: [
    'Acquisition is growing. Activation is weak. Retention is extremely weak. Conversion is extremely weak. Value communication is weak. Pricing clarity is weak. Measurement is incomplete.',
    'In 83 days and 682 users, not one person discovered this product independently, valued it, and paid for it. That single sentence is the whole audit.',
    'It is not a technical failure. Every technical explanation was tested and eliminated. It is a sequencing failure: the product asks for money before it has shown anyone why the money is worth spending, and then does not give them a reason to come back and reconsider.',
  ],
  questions: [
    {
      q: 'WHY ARE USERS NOT PAYING?',
      a: [
        'FACT: they are not. 0 externally-acquired paying customers in 83 days; 0 from 366 signups in the last 30 days; 11 people accepted a price and 1 paid, and that one was internal.',
        'CONFIRMED CONTRIBUTORS: the plans are genuinely indistinguishable (entitlement overlap read directly in code); there is no social proof anywhere on the pricing surface; an expired offer sits on the paid-ads landing page.',
        'HYPOTHESIS, NOT FACT: that weak value communication is the binding constraint. It is the strongest available explanation, it is consistent with all three funnel losses, and it rests on a walkthrough of n = 1. It has not been independently verified.',
        'EXPLICITLY UNRESOLVED: whether premium_annual\'s 0-for-12 is caused by plan confusion or by price resistance at ₹1,699. The two fit the data equally well. Roughly ten user conversations would settle it, and the instrument to have them does not exist.',
      ],
    },
    {
      q: 'WHY ARE USERS NOT RETURNING?',
      a: [
        'FACT: 270 of 286 test-completers (94.4%) never came back on a second day. Only 16 of 682 users have ever had two active days.',
        'CONFIRMED CONTRIBUTOR: the habit loop reinforces only completion — streaks, XP and badges are written exclusively by submit_test, so a user who answers 20 questions and quits earns nothing.',
        'CONFIRMED CONTRIBUTOR: the daily-return hook is degraded — Current Affairs images do not load, and Kural of the Day has no prompt.',
        'CAVEAT THAT MUST TRAVEL WITH THE NUMBER: "active" is defined narrowly, so these are floors. And 53.7% of the base registered in the last 30 days, so some of the non-return is cohort immaturity rather than churn. Cohorted retention would separate them and it has not been run.',
      ],
    },
    {
      q: 'WHY ARE USERS NOT ACTIVATING?',
      a: [
        'FACT: 337 of 682 registered users (49.4%) never start a single test.',
        'CONFIRMED: it is not signup. Registration was verified working by both the walkthrough and the founder, so this loss occurs after a clean registration.',
        'OBSERVED: a new user arrives with no orientation, meets up to five competing modals, and is 3–4 taps from the only thing that delivers value.',
        'DATA GAP: no onboarding instrumentation exists, so the exact point of departure inside that first session cannot be located.',
      ],
    },
    {
      q: 'WHERE IS THE BIGGEST LEAK?',
      a: [
        'BY ABSOLUTE COUNT: signup → first test. 337 users, 49.4% of everything acquired.',
        'BY PROPORTION: test completion → return. 94.4% of completers.',
        'BY BUSINESS CONSEQUENCE: conversion. It is the only stage sitting at a confirmed absolute zero, and it is the stage the other two ultimately feed.',
        'These are three different questions with three different answers, and the fix sequence in this report follows business consequence first — because acquisition is growing, which means the cost of leaving conversion broken compounds daily.',
      ],
    },
    {
      q: 'WHAT SHOULD DEVELOPERS FIX FIRST?',
      a: [
        '1. The expired offer. Certain evidence, trivial effort, sitting on the paid-ads landing page right now.',
        '2. Plan clarity. Code-confirmed entitlement overlap, plus production evidence of a user comparison-shopping at the payment window 12 seconds apart.',
        '3. Value before paywall. Route the first session through Revision and Insights before any upsell.',
        'AND, ARGUABLY BEFORE ALL THREE: the pricing_viewed event. Without it, the checkout funnel stage has no denominator and none of the work above can be evaluated. It is listed in Phase 4 for narrative reasons; treat the phases as a dependency graph, not a queue.',
      ],
    },
    {
      q: 'WHAT SHOULD MARKETING NOT DO YET?',
      a: [
        'DO NOT SPEND ON ADS. There is no underperforming channel to fix — there is no channel that has ever produced a paying customer. Paid traffic into a funnel with 0.00% external conversion converts spend into nothing.',
        'DO NOT CHANGE PRICES. Zero external conversions means there is no evidence that price is the binding constraint. Cutting prices before establishing value forfeits margin without addressing the cause.',
        'DO NOT RESTRUCTURE THE PLANS — beyond making them describable. Redesigning a pricing architecture on 21 attempts and 1 sale would be fitting to noise.',
        'DO NOT PRIORITISE SEO YET. It is a genuine weakness and it is not the bottleneck. Acquisition is already growing without it.',
        'DO NOT REBUILD CHECKOUT. Verified working.',
        'DO NOT TOUCH FRONTEND PERFORMANCE. Measured, fine.',
        'DO NOT CITE THE ₹899 AS TRACTION. It was founder-generated. External revenue is ₹0.',
      ],
    },
  ],
};

/* ---------------------------------------------------------------------------
 * DEVELOPER HANDOFF
 * ------------------------------------------------------------------------- */

const HANDOFF = [
  {
    flaw: 1, priority: 'P0',
    module: 'First-session routing · Premium upsell · Landing & pricing surfaces',
    components: 'Post-signup and post-result routing · the premium upsell component and its triggers · Revision and Insights modules · LandingPage.tsx · PricingCards.tsx',
    tables: 'profiles (for an honest user count) · app_feedback (for an honest rating) · test_sessions (to know a user has completed a test)',
    current: 'The upsell appears in essentially every section from the first session onward. Revision and Insights are reachable but nothing routes users there. Neither the landing page nor the pricing cards contain any testimonial, rating or user count.',
    problem: 'The product asks for money before demonstrating value, and offers no trust signal at the moment of asking. 366 signups in 30 days produced 0 paying customers.',
    expected: 'After a first completed test the user is taken to Insights/Revision, not to an upsell. The upsell fires only once a purchase-intent or engagement condition is met. Landing and pricing surfaces state a real, sourced number.',
    events: 'value_moment_viewed (Revision, Insights) · pricing_viewed (from PricingCards) · upsell_shown with its trigger reason',
    data: 'A live count from profiles and a live average from app_feedback, so the social proof cannot go stale or become false.',
    acceptance: [
      'A new user completing their first test lands on Insights or Revision.',
      'The upsell does not render for a user with zero completed tests.',
      'Landing and pricing surfaces display a real number sourced from live data, with its n stated.',
      'value_moment_viewed and pricing_viewed fire and are visible in the analytics pipeline.',
    ],
    metric: 'Externally-acquired paying customers > 0 (currently 0). Supporting: pricing-view → checkout-start becomes computable.',
  },
  {
    flaw: 2, priority: 'P0',
    module: 'Pricing & entitlements',
    components: 'Server-side pricing constants · entitlement / bundle-access logic · PricingCards · PremiumCard · VettriCard · VettriSuggestModal',
    tables: "payments (notes->>'plan' — currently 4 distinct plan keys for 5 price points)",
    current: 'Five price points with genuinely overlapping entitlements. Premium ⊇ Rank Booster, Premium ⊇ Vettri, Vettri ⊉ Rank Booster, Mock Pack unlocks no bank at all. None of this is stated on the pricing screen. No default is recommended.',
    problem: 'Users cannot tell the plans apart. One opened two plans\' checkouts 12 seconds apart. premium_annual draws 57% of intent and has converted 0 of 12.',
    expected: 'Each plan carries a one-line differentiator. A comparison matrix states inclusions and exclusions explicitly, generated from the same entitlement source the access-control code uses. One plan is presented as the recommendation. The Mock Pack name matches what it grants.',
    events: 'pricing_viewed · plan_card_viewed (per plan) · plan_card_clicked (per plan) · checkout_started already exists and is correct',
    data: 'Per-plan view → click → checkout-start → paid funnel. Split the vettri_nichayam ledger key so the ₹499 and ₹899 variants are separable going forward.',
    acceptance: [
      'The comparison matrix is generated from the entitlement source, not hand-maintained.',
      'A user can state, from the pricing screen alone, whether Vettri includes Rank Booster.',
      'Per-plan view and click events fire.',
      'NO PRICE IS CHANGED and NO PLAN IS REMOVED as part of this work.',
    ],
    metric: 'premium_annual conversion > 0% (currently 0 of 12). Supporting: cross-plan checkout opens within 60 seconds fall toward zero.',
  },
  {
    flaw: 3, priority: 'P0',
    module: 'Promotional pricing',
    components: 'Server-side pricing constants · the /rank-booster landing page',
    tables: 'None — this is configuration, not data',
    current: 'Rank Booster is advertised at ₹1,249 from an ₹1,800 MRP as an "Independence Day offer valid till 31 Aug 2026". The offer expired; the price does not auto-revert; the code comment says the constant must be updated by hand. It was still live on 5 Sep.',
    problem: 'A visibly expired deadline on the one page built to convert paid traffic.',
    expected: 'Promotional configuration carries a start and end timestamp. Every promotional surface compares that window against now() at render time. When the window closes, the offer disappears and the price reverts with no human action.',
    events: 'rank_booster_landing_viewed, so the page finally has a denominator',
    data: 'None required.',
    acceptance: [
      'No offer whose end timestamp has passed renders anywhere.',
      'Promotional copy and promotional price derive from the same configuration object.',
      'An automated check fails loudly when a promotional deadline is in the past.',
    ],
    metric: 'Expired offers displayed in production = 0 (currently 1). DEFINITIONAL target.',
  },
  {
    flaw: 4, priority: 'P1',
    module: 'First-run experience',
    components: 'Post-signup routing · app entry sequence · the five entry modals (onboarding tour, starter-test prompt, push primer, marathon free alert, update prompt) · navigation to the test arena',
    tables: 'profiles · test_sessions',
    current: 'A new user lands with no orientation. Up to five modals can fire on entry, each deciding independently to show itself. The first test is 3–4 taps away.',
    problem: 'Interruption before intention. 337 of 682 users never start a test.',
    expected: 'One question (which exam?), then one action (start this test). A single arbiter decides what may be shown on first entry; everything else defers.',
    events: 'onboarding_started · onboarding_step_completed · onboarding_completed · first_test_started · modal_shown with its identity',
    data: 'Modals shown per first session. Taps to first test. Time from signup to first test start.',
    acceptance: [
      'At most one modal is shown on first entry.',
      'A test can be started in one tap from the first post-signup screen.',
      'The first-run sequence emits events at every step, so the departure point is locatable.',
    ],
    metric: 'Signup → first-test-start on weekly signup cohorts. Baseline 50.6% (345 / 682). Cohorted, never blended.',
  },
  {
    flaw: 5, priority: 'P1',
    module: 'Activation measurement & post-signup routing',
    components: 'Post-signup routing · test-arena entry path · reporting layer',
    tables: 'profiles (created_at) · test_sessions (started_at, status)',
    current: 'Activation is not defined, not measured and not reported. It is visible only as a lifetime aggregate derived by hand. There is no re-engagement path for a user who signs up and stops.',
    problem: '337 of 682 registered users (49.4%) never start a test — the largest absolute loss in the funnel.',
    expected: 'Activation is defined as first test STARTED, with first test COMPLETED tracked alongside. Both are reported as cohorted rates by signup week at a fixed cohort age. Time-to-first-test is measured.',
    events: 'first_test_started · first_test_completed (both as distinct one-time-per-user milestones)',
    data: 'min(test_sessions.started_at) − profiles.created_at per user. Cohorted activation by signup week.',
    acceptance: [
      'Activation is reported as a cohorted rate, not a lifetime blend.',
      'Median time from signup to first test start is reported.',
      'The cohorted baseline is captured BEFORE any product change ships.',
    ],
    metric: 'Signup → first test start % (currently 50.6%) and signup → first test completion % (currently 41.9%), both cohorted. BASELINE FIRST — no target until the cohorted baseline exists.',
  },
  {
    flaw: 6, priority: 'P1',
    module: 'Retention & habit loop',
    components: 'daily_activity writers · submit_test (sole writer of streak/XP/badge state) · the spaced-repetition module (review_items) · notification surfaces',
    tables: 'daily_activity · test_sessions · review_items · profiles',
    current: 'daily_activity is written only by test submission and current-affairs completion. Streaks, XP and badges are written only by submit_test — partial effort earns nothing. The spaced-repetition system generates return-worthy content and nothing surfaces it. No cohorted retention exists.',
    problem: '270 of 286 completers (94.4%) never return. 16 of 682 users have ever had two active days.',
    expected: '"Active" reflects real engagement including study sessions that do not end in a submission. Partial effort earns habit credit. The spaced-repetition queue drives a concrete reason to return. D1/D3/D7/D14/D30 are reported by signup cohort.',
    events: 'session_started · material_viewed · revision_completed · streak_credited with its trigger reason',
    data: 'Cohorted retention by signup week. Both the narrow and broadened active definitions, reported in parallel during the transition.',
    acceptance: [
      'D1/D3/D7/D14/D30 exist as reported metrics.',
      'Both active-user definitions are reported side by side for at least one full cycle.',
      'Partial effort produces habit credit without double-counting when the session is later submitted.',
    ],
    metric: 'The first target is the existence of the retention curve. Return rate among completers is currently 5.6% (16 / 286) under the narrow definition. BASELINE FIRST after re-definition.',
  },
  {
    flaw: 7, priority: 'P1',
    module: 'Content: Current Affairs · Kural of the Day · free-tier communication',
    components: 'Current Affairs module and its image/asset pipeline · Kural of the Day · post-signup and home surfaces · pricing screen',
    tables: 'daily_activity (current-affairs completion is one of only two activity writers)',
    current: 'Current Affairs images do not load. Kural of the Day has no prompt or placement. The free tier — 50 signup credits plus 10/day, one free 200-question mock, one free attempt per topic — is not stated where a user would see it.',
    problem: 'Content that would drive daily returns is broken or hidden, sitting directly on the retention hook.',
    expected: 'Current Affairs images load. Kural of the Day has a daily surface. The free tier is stated plainly to new users.',
    events: 'content_viewed per module (Current Affairs, Kural, Materials) · asset_load_failed',
    data: 'Per-module usage counts. Current Affairs daily completion, which already writes to daily_activity and is simply not reported.',
    acceptance: [
      'The image failure is reproduced, diagnosed and scoped BEFORE work is sized.',
      'An automated asset check catches broken content images.',
      'Free-tier contents appear on a surface a new user actually reaches.',
    ],
    metric: 'Broken images in Current Affairs = 0 (DEFINITIONAL). Current Affairs daily completion becomes a reported metric.',
  },
  {
    flaw: 8, priority: 'P0',
    module: 'Revenue reporting (outcome)',
    components: 'revenue_metrics.sql · the payments ledger',
    tables: 'payments',
    current: 'Four paid records: three staff comps at ₹0 and one founder-generated ₹899. Nothing in the schema distinguishes an internal comp from a real customer — that distinction lives in founder memory. premiumActive counts 1 of 5 plans. Comp grants write a synthetic order ID straight to paid and never produce a created row.',
    problem: '₹0 externally-generated revenue. Reported as "1 paying customer, ₹899", the situation reads as early traction. It is not.',
    expected: 'Externally-generated revenue is the headline figure. Internal and comp records are flagged in the data, not remembered.',
    events: 'None new — the payment events are correct.',
    data: 'An internal/comp flag on payment records. A per-plan revenue breakdown replacing or supplementing premiumActive.',
    acceptance: [
      'External revenue is computable by query, with no founder input required.',
      'premiumActive counts all five plans, or is replaced by a per-plan breakdown.',
      'Comp records are visibly distinguishable from purchases.',
    ],
    metric: 'Externally-acquired paying customers > 0 (currently 0). This flaw has NO independent fix — it moves when flaws 1, 2, 3 and 9 move.',
  },
  {
    flaw: 9, priority: 'P1',
    module: 'Checkout recovery · coupons & promoters',
    components: 'payments lifecycle (created rows have no terminal state) · coupon entry surface · promoter tracking (built, unused)',
    tables: 'payments (20 created rows from 11 users) · coupons',
    current: 'No cleanup, retry, reminder or follow-up exists for an incomplete payment order. The oldest has been unresolved for 79 days. The coupon system is complete and server-validated with per-promoter tracking, and has zero redemptions in 83 days. coupon_viewed is not tracked.',
    problem: '11 price-accepted, high-intent prospects with no recovery path, and an entire referral channel switched off.',
    expected: 'A created row reaches a defined terminal state. A recovery sequence exists and is tracked: reminder → retry → support / value clarification → recovery tracking. Coupon entry is discoverable.',
    events: 'checkout_abandoned · recovery_prompt_shown · recovery_completed · coupon_viewed',
    data: 'The recovery funnel: checkout → payment created → paid → unrecovered. The crossover query: did any of the 11 later convert?',
    acceptance: [
      'Recovery TRACKING ships before recovery ACTION, so the first campaign is measurable.',
      'Payment orders older than a defined threshold reach a terminal state.',
      'A user can find where to enter a coupon code.',
      'NO USER IS CONTACTED as part of this audit. Whether to contact the 11 is the founder\'s decision.',
    ],
    metric: 'Abandoned-checkout recovery rate becomes computable (currently it cannot be). Coupon redemptions > 0 (currently 0).',
  },
  {
    flaw: 10, priority: 'P2',
    module: 'SEO & public content',
    components: 'Rendering architecture (SPA, no per-route server output) · routing · sitemap generation · existing JSON-LD (already correct)',
    tables: 'None',
    current: '5 sitemap URLs — home plus 4 legal pages. Identical title and meta on every route. The 7 products named in the site\'s own structured data have no pages. Zero third-party mentions anywhere.',
    problem: 'No compounding organic discovery surface. Nothing is shareable as itself.',
    expected: 'An indexable landing page per named product, per-route metadata via prerendering or SSR, and topic pages built from content the app already produces.',
    events: 'Server-side pageview logging, so organic traffic is knowable at all.',
    data: 'Organic sessions and ranked queries — neither currently exists.',
    acceptance: [
      'Each of the 7 named products has its own indexable URL with unique metadata.',
      'A shared link unfurls with the correct title and description.',
      'SEQUENCING: this is Phase 5. It ships AFTER conversion and activation.',
    ],
    metric: 'Organic sessions and ranked query count — both currently DATA NOT AVAILABLE. Judge on sessions, never on page count.',
  },
  {
    flaw: 11, priority: 'P2',
    module: 'Public pricing page · app-store presence',
    components: 'A prerendered /pricing route (the SPA cannot serve one today) · the IAP product catalogue · native build configuration',
    tables: 'None',
    current: 'Pricing renders only inside the app shell — CONFIRMED. No app-store listing was found — UNCONFIRMED, and contradicted by real IAP product IDs in the codebase.',
    problem: 'A buyer cannot learn the price without registering. App-store discoverability is an open question that has been open since Stage 1.',
    expected: 'A public, prerendered, indexable /pricing route. A definite answer on app-store publication status.',
    events: 'public_pricing_viewed',
    data: 'App install count, if a listing exists.',
    acceptance: [
      'GET THE APP-STORE ANSWER FIRST. Do not build a submission plan for an app that may already be published, and do not state publicly that the app is absent.',
      'The pricing route is prerendered, not client-rendered, or it will be as invisible as everything else on the domain.',
      'Ship alongside the plan-clarity work in Flaw #2 — publishing a confusing plan structure more widely does not help.',
    ],
    metric: 'A public pricing URL exists, is indexed, and unfurls correctly (DEFINITIONAL). App-store status is a known fact rather than an open question (DEFINITIONAL).',
  },
  {
    flaw: 12, priority: 'P1',
    module: 'Acquisition attribution',
    components: 'Landing surface (capture before client routing strips the query string) · signup flow · handle_new_user() trigger path · client-side first-touch persistence',
    tables: 'profiles (needs the columns) · payments (needs source carried through)',
    current: 'No utm_source, utm_medium, utm_campaign, utm_content or referrer column exists anywhere in the schema. Confirmed by exhaustive search. 100% of 682 signups are unattributed.',
    problem: 'The best acquisition month on record — 396 signups in August — cannot be explained or deliberately repeated.',
    expected: 'First-touch and last-touch source captured separately, persisted across sessions, written to the profile at signup, and carried through to the payments row.',
    events: 'Attribution parameters attached to sign_up and to purchase.',
    data: 'utm_source, utm_medium, utm_campaign, utm_content, referrer, landing page, first-touch, last-touch.',
    acceptance: [
      'Capture happens on the landing surface, before routing strips the query string.',
      'First touch survives across sessions — a user landing from Instagram and registering two days later is attributed to Instagram, not to direct.',
      'Source is present on the payments row, so channel → revenue is joinable.',
      'NO ATTEMPT is made to reconstruct historical attribution. It is unrecoverable and any estimate would be fabrication.',
    ],
    metric: '100% of NEW signups carry a first-touch source (currently 0%). DEFINITIONAL. Historical attribution is an explicit non-target.',
  },
  {
    flaw: 13, priority: 'P1',
    module: 'Analytics & event instrumentation',
    components: 'authStore.ts (trackSignUp) · PricingCards (pricing_viewed) · MockQuizPage.tsx (abandon beacon) · revenue_metrics.sql (premiumActive) · daily_activity writers · bundleAccess() (plan lifecycle)',
    tables: 'test_sessions · daily_activity · payments · profiles',
    current: 'pricing_viewed does not fire from PricingCards. record_abandoned_test has one call site on the free engine only. trackSignUp fires on one of two auth paths. premiumActive counts 1 of 5 plans. daily_activity has two writers. No subscription lifecycle events. No server-side pageview store.',
    problem: 'The funnel has no top and no checkout denominator, paid-format abandonment is invisible, and the founder\'s paid figure understates reality.',
    expected: 'Every funnel stage has a numerator and a denominator. All four paid formats log abandonment. Both auth paths fire a signup event. premiumActive covers all five plans. Plan lifecycle is written as events.',
    events: 'pricing_viewed · sign_up (Google path) · test_abandoned (Mock, Vettri, Rank Booster, Test Series) · subscription_renewed / expired / cancelled · server-side pageview',
    data: 'A complete funnel with valid denominators at every stage.',
    acceptance: [
      'SHIP pricing_viewed FIRST — it gates the evaluation of all of Phase 1.',
      'New events follow the existing single-choke-point pattern; no second analytics path is introduced.',
      'Broadening the active definition is accompanied by parallel reporting of both definitions for one full cycle.',
      'The paid-format abandon beacon is the only non-trivial item — those screens have no exit affordance today.',
    ],
    metric: 'Paid formats logging abandonment 4 of 4 (currently 0). Auth paths firing signup 2 of 2 (currently 1). premiumActive 5 of 5 plans (currently 1). All DEFINITIONAL.',
  },
  {
    flaw: 14, priority: 'P2',
    module: 'Customer feedback',
    components: 'FeedbackModal and its gating (client and server) · app_feedback schema · new prompt surfaces at abandonment moments · Clarity GTM configuration (outside the repository)',
    tables: 'app_feedback (6 rows, 0 with text)',
    current: 'The prompt appears once, home screen only, after 2 completed tests, non-admins only, then is suppressed 3 months. The 2-test gate alone excludes 396 of 682 users. The instrument collects a rating and no text.',
    problem: '6 ratings and 0 words from 682 users. There is no qualitative user data in the system at all.',
    expected: 'The instrument collects a rating plus "What did you like?" and "What should we improve?", with "Why didn\'t you upgrade?" asked of users who reached pricing or abandoned checkout. Prompts reach the abandonment populations, not only the engaged ones.',
    events: 'feedback_prompt_shown · feedback_submitted with response type',
    data: 'Free-text responses. Feedback segmented by funnel stage, so the never-activated and never-returned populations are reachable.',
    acceptance: [
      'Free text is captured and has a reading path, or it will accumulate unread.',
      'Gating is relaxed enough to reach non-activated users without recreating the popup-overload problem in Flaw #4.',
      'Any social proof drawn from ratings states its n honestly.',
      'NO USER IS CONTACTED as part of this audit.',
    ],
    metric: 'Responses carrying written text > 0 (currently 0). DEFINITIONAL. Response rate (0.88%) is secondary to text capture.',
  },
];

/* ---------------------------------------------------------------------------
 * 30 / 60 / 90
 * ------------------------------------------------------------------------- */

const PLAN_30_60_90 = [
  {
    window: 'Days 1–30 — establish value and make the funnel measurable',
    items: [
      'Ship Flaw #3 (expired offer) — trivial, certain, and live on the ads landing page right now.',
      'Ship Flaw #2 (plan clarity) — one-line differentiators, a comparison matrix generated from the entitlement source, and a default recommendation. No price changes.',
      'Ship Flaw #1 (value before paywall) — route the first session through Revision/Insights and gate the upsell on a real signal.',
      'Ship pricing_viewed from PricingCards (part of Flaw #13). Without it none of the above can be evaluated.',
      'Run the four outstanding read-only queries: cohorted retention, engagement distribution, the abandoner crossover, and the role breakdown.',
      'Get the two pending founder answers: app-store publication status, and identifiers for the internal customer and founder-side referral.',
      'DECISION FOR THE FOUNDER, NOT AN AUDIT ACTION: whether to ask the 11 abandoned-checkout users what stopped them. It is the fastest available route to separating plan confusion from price resistance. No user has been contacted by this audit.',
    ],
  },
  {
    window: 'Days 31–60 — activation and return',
    items: [
      'Ship Flaw #4 (first-run experience) and Flaw #5 (activation measurement), which overlap heavily.',
      'Ship Flaw #7 (Current Affairs images, free-tier communication, Kural surfacing).',
      'Ship Flaw #6 measurement first: broaden the active definition, re-baseline, and report both definitions in parallel.',
      'Ship Flaw #12 (attribution capture) so that any future acquisition effort is measurable. Every day of delay is another day of permanently unrecoverable history.',
      'Ship the remaining Flaw #13 items: Google signup tracking, paid-format abandon beacon, premiumActive across all five plans.',
      'Ship Flaw #9 recovery TRACKING (not yet recovery action) and make coupon entry discoverable.',
    ],
  },
  {
    window: 'Days 61–90 — only if external conversion has moved off zero',
    items: [
      'GATE: if externally-acquired paying customers is still 0, do not proceed to acquisition scale. Return to Phase 1 with the instrumentation that now exists and diagnose properly.',
      'Ship Flaw #6 product changes: the return loop and partial-effort reinforcement.',
      'Ship Flaw #14 (feedback redesign) and obtain Clarity access.',
      'Ship Flaw #11 (public pricing page) and, conditional on the founder\'s answer, app-store work.',
      'Begin Flaw #10 (SEO landing pages) — the longest-horizon item, deliberately last.',
      'Re-run this entire verification against a real paying cohort, and finally test the activation-threshold hypothesis that has been untestable throughout.',
    ],
  },
];

export default {
  ...M,

  FLAWS, MATRIX, TRACEABILITY, DIAGNOSIS, CONCLUSION, HANDOFF, PLAN_30_60_90,
  FIXES, FIX_STRATEGY, FIX_STATUS,
};
