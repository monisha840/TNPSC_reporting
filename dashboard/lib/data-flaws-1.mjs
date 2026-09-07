/*
 * The 14 major flaws — part 1 (flaws 1–7).
 * Every flaw carries the full A–Q structure required by the brief.
 * `underlying` traces each consolidated flaw back to the original register IDs
 * so that no individual finding is silently lost.
 */

export default [

/* ======================================================================== */
{
  id: 1,
  title: 'Weak value proposition & conversion experience',
  priority: 'P0',
  category: 'Conversion',
  severity: 'Critical',
  evidenceStatus: 'CONFIRMED',
  rootCauseStatus: 'HYPOTHESIS',
  funnelStage: 'Value discovery → Pricing → Checkout → Payment',
  confidence: 'Medium',
  oneLiner: 'The product asks for money before it has shown anyone why the money is worth spending — and the screens that would do the persuading sit downstream of the paywall.',

  underlying: [
    { id: 'P0-1', text: 'The product asks for money before establishing value', tag: 'UX + PROD' },
    { id: 'P0-4', text: 'The value moment (Revision / Insights) is discovered late and by accident', tag: 'UX' },
    { id: 'P1-4', text: 'Premium upsell appears in every section, while purchase desire is zero', tag: 'UX' },
    { id: 'P2-5', text: 'No social proof anywhere on the landing or pricing surfaces', tag: 'CODE + EXT' },
  ],

  A_summary: [
    'TNPSC Mentors contains something genuinely persuasive. During the first-time walkthrough the tester completed two full tests and felt no desire to pay — then wandered, unprompted, into the Revision and Insights screens and said "I feel good."',
    'That is the value moment. It exists, it works, and almost nobody reaches it. The paywall, meanwhile, is everywhere: a premium prompt appears in essentially every section of the app, starting from the first session, before the user has any reason to want it.',
    'The result is a product that asks constantly and demonstrates rarely. 366 people signed up in the last 30 days and none of them paid.',
  ],

  B_flaw: [
    'The order of operations is inverted. A user is shown the price before they are shown the reason.',
    'The value moment is not on any path the product routes users through. Revision and Insights are reachable, but nothing takes a new user there — they are found by wandering.',
    'The upsell has no gating on desire. It appears in section after section regardless of whether the user has ever seen a result screen, completed a test, or shown any purchase signal.',
    'There is no trust signal at the moment of deciding: LandingPage.tsx and PricingCards.tsx were grepped in full and contain zero testimonials, ratings or user counts — while a competitor leads its pricing page with "10,000+ students".',
  ],

  C_why: [
    'This is the stage with a confirmed, absolute zero. Not a low rate — zero externally-acquired paying customers in 83 days.',
    'Acquisition is growing (19 → 226 → 396 signups by month). Every additional user acquired while this stage is broken is a user converted into nothing.',
    'It is also the cheapest possible thing to be wrong about: the value already exists and is already built. Nothing new has to be created — it has to be sequenced.',
  ],

  D_evidence: [
    { tag: 'PROD', text: '366 signups in the last 30 days → 0 new paying customers.' },
    { tag: 'PROD', text: '11 people reached a price-accepted checkout across 21 attempts; 1 completed, and that one was founder-generated. Externally-acquired paying customers: 0 of 682.' },
    { tag: 'PROD', text: 'One user returned to checkout 5 times across 59 days and never bought — sustained interest against an unresolved objection.' },
    { tag: 'UX',   text: '"I can\'t feel any urge to pay and get premium." — said after completing two full tests.' },
    { tag: 'UX',   text: '"after checking on the Revision, Insights section, I feel good" — reached only by wandering in unprompted, after the paywall had already been shown repeatedly.' },
    { tag: 'UX',   text: '"whichever section I visit, somewhere I can see the pop up for premium plan."' },
    { tag: 'CODE', text: 'LandingPage.tsx and PricingCards.tsx grepped in full for testimonial / rating / user-count language: zero matches.' },
    { tag: 'CODE', text: 'An app_feedback table already holds a 4.33 average and 682 real signups exist — there is honest social proof available and none of it is used.' },
    { tag: 'EXT',  text: 'Competitor TNPSC Master leads its public pricing page with "10,000+ students". Every competitor checked shows a proof-of-scale number.' },
    { tag: 'UX',   text: 'DISPROVED ALTERNATIVE: checkout was tested to the final payment step on a real device and works correctly. This was the leading hypothesis before the walkthrough and it failed — the problem is upstream of the payment screen.' },
  ],

  E_howChecked: [
    'Production SQL (read-only): counted registered users, checkout attempts by status, distinct checkout users, and paid records with non-zero amounts.',
    'Production SQL (read-only): counted signups in the trailing 30 days and paid records created in the same window.',
    'Source-code inspection: full-text grep of LandingPage.tsx and PricingCards.tsx for testimonial, rating, review, "students", "users" and count-style language.',
    'First-time-user walkthrough on a real device: signup → home → two complete tests → results → free exploration, with the tester narrating intent throughout.',
    'Checkout verification during the same walkthrough: driven to the final payment step to test the "checkout is broken" hypothesis directly.',
    'External inspection: competitor pricing pages checked for proof-of-scale claims.',
  ],

  F_numbers: [
    { label: 'Recent signups → new paying customers', calc: '366 → 0', value: '0.00%' },
    { label: 'Externally-acquired paying customers',  calc: '0 / 682', value: '0.00%' },
    { label: 'Checkout people → paid',                calc: '1 / 11',  value: '9.1% (and that 1 was founder-generated)' },
    { label: 'Checkout attempts → paid',              calc: '1 / 21',  value: '4.8%' },
    { label: 'Revenue-generating customers / all users', calc: '1 / 682', value: '0.15%' },
    { label: 'Social-proof elements on acquisition surfaces', calc: 'grep of LandingPage.tsx + PricingCards.tsx', value: '0' },
    { label: 'Users who reached the value moment',    calc: 'no feature-usage event exists', value: 'DATA NOT AVAILABLE' },
  ],

  G_affected: {
    count: '682 registered users; 366 of them in the last 30 days alone',
    pct: '100% of the user base is exposed to this ordering',
    stage: 'Value discovery → Pricing → Checkout',
    note: 'The measurable subset is the 11 people who reached checkout — those are the users who got far enough to be counted. How many of the other 671 ever saw a pricing screen is DATA NOT AVAILABLE, because pricing views are not instrumented.',
  },

  H_rootCause: {
    confirmed: [
      'No social proof exists on the acquisition or pricing surfaces. Code-confirmed by exhaustive grep.',
      'Nothing in the product routes a new user to Revision or Insights. Confirmed by walkthrough — the tester found them by wandering.',
      'Premium prompts are not gated on any purchase-intent or engagement signal.',
    ],
    hypothesis: [
      'That weak value communication is the binding constraint on conversion. This is the strongest available explanation and it is still a hypothesis: it rests on a walkthrough of n = 1 plus consistency with all three funnel losses. It is not independently verified.',
      'That reaching Revision/Insights earlier would raise conversion. Plausible and cheap to test; entirely untested.',
      'IMPORTANT: low conversion is a FACT. That value perception is its cause is a HYPOTHESIS. Do not let the certainty of the first transfer to the second.',
    ],
  },

  I_userImpact: [
    'The user completes a test, sees a result, and is asked to pay — having been shown a score but not an improvement path.',
    'They are asked again in the next section, and the next. The asking is the most consistent experience the product offers.',
    'If they do reach Revision or Insights, they find it valuable. Most never do.',
    'At the pricing screen there is nothing to reassure them that anyone else uses this product.',
  ],

  J_businessImpact: [
    'Lost conversion: measurable and total. 0 externally-acquired customers in 83 days; 0 from 366 signups in the last 30 days.',
    'Lost revenue: ₹0 externally generated against ₹899 all-time, all of it internal.',
    'Compounding cost: acquisition is growing. August delivered 396 signups into a funnel with a 0.00% external conversion rate.',
    'Goodwill cost: repeated upselling against zero desire spends trust that would be needed later, when the ask is finally justified. UNQUANTIFIED — no measurement of this exists.',
  ],

  K_devImpact: [
    'Routing and first-session flow — wherever the post-signup and post-result destinations are decided.',
    'Revision and Insights modules: currently reachable but not surfaced.',
    'The premium upsell component and its trigger conditions, which appear across essentially every section.',
    'LandingPage.tsx and PricingCards.tsx — the two files that currently carry no trust signal.',
    'Instrumentation: there is no feature-usage event on Revision/Insights, so the very behaviour this fix targets is currently invisible.',
  ],

  L_fix: [
    'Route the first session through the value moment. After the first completed test, take the user to Insights/Revision — not to an upsell.',
    'Gate the premium prompt on a signal: completed tests, a returning visit, or an explicit pricing visit. Stop showing it in every section by default.',
    'Put honest social proof on the landing and pricing surfaces. Two true numbers already exist: 682 registered aspirants and a 4.33 average rating from 6 responses. State them accurately, including the n, rather than inventing a rounder number.',
    'Instrument the value moment before changing it, so the change can be judged: fire an event when Revision and Insights are opened, and a pricing_viewed event on PricingCards.',
  ],

  M_implementation: [
    'This is a sequencing change, not new functionality. Everything needed already exists in the product.',
    'Decide the post-first-result destination in one place rather than per-section, so the "value before price" rule is enforceable and testable.',
    'The upsell trigger needs a condition object it does not currently have — minimally: has the user completed ≥1 test, and have they seen a result screen.',
    'Social proof should read from real data (the profiles count and the app_feedback average) rather than being hard-coded, so it cannot go stale or become false.',
    'DO NOT ship the routing change without the events. Without a pricing_viewed event the checkout stage has no denominator, and this fix will be unfalsifiable — see Flaw #13.',
    'NO PRODUCTION CHANGE IS MADE BY THIS DASHBOARD. This section describes what a developer should change; it does not change it.',
  ],

  N_successMetric: [
    'PRIMARY: externally-acquired paying customers > 0. Currently 0 of 682. This is the only success criterion that matters for Phase 1.',
    'SUPPORTING: pricing-view → checkout-start rate becomes measurable at all (it currently has no denominator).',
    'SUPPORTING: share of first sessions that reach Revision or Insights. Currently DATA NOT AVAILABLE.',
    'GUARDRAIL: the upsell change must not reduce checkout starts. Watch created-row volume against the 21-attempt baseline.',
    'No conversion-rate target is set. 21 checkout attempts and 1 sale is far too small a sample for any rate to be meaningful — BASELINE FIRST, TARGET TO BE SET AFTER EXPERIMENT.',
  ],

  O_priority: 'P0',
  P_confidence: 'Medium — the conversion facts are High confidence; the value-perception causal claim is Medium and rests on n = 1.',
  Q_source: ['Stage 1 external audit (social proof, competitor comparison)', 'Stage 2 codebase audit (grep of LandingPage.tsx / PricingCards.tsx)', 'Stage 3 production queries (payments, profiles)', 'First-time-user walkthrough', 'Final Growth Verification §1, §10, §12', 'Backlog register P0-1, P0-4, P1-4, P2-5'],
},

/* ======================================================================== */
{
  id: 2,
  title: 'Confusing monetization & pricing structure',
  priority: 'P0',
  category: 'Monetization',
  severity: 'Critical',
  evidenceStatus: 'CONFIRMED',
  rootCauseStatus: 'OBSERVATION',
  funnelStage: 'Pricing → Checkout',
  confidence: 'High',
  oneLiner: 'Five price points with genuinely non-obvious entitlement overlap, and a user was caught using the payment window itself to work out what the plans cost.',

  underlying: [
    { id: 'P0-2', text: 'The five plans are indistinguishable to a user; entitlement rules genuinely overlap', tag: 'UX + CODE + PROD' },
    { id: 'V-2',  text: 'premium_annual draws 57% of all purchase attempts and has converted zero times', tag: 'PROD' },
  ],

  A_summary: [
    'There are five paid price points. A user cannot tell them apart, and the entitlement rules behind them are genuinely intricate rather than merely badly explained.',
    'Premium includes Rank Booster. Vettri does not. The Mock Test Pack unlocks no test bank at all — it raises a daily credit allowance from 10 to 50. None of this is stated where a buyer would look.',
    'The strongest single piece of evidence is behavioural: one user opened two different plans\' checkout screens 12 seconds apart. They were using the payment window to discover what the plans cost, because the pricing screen did not tell them.',
  ],

  B_flaw: [
    'FIVE PRICE POINTS: ₹399 Mock Pack, ₹499 Vettri monthly, ₹899 Vettri full, ₹1,249 Rank Booster, ₹1,699 Premium.',
    'ENTITLEMENT OVERLAP (code-confirmed): Premium ⊇ Rank Booster, Premium ⊇ Vettri, but Vettri ⊉ Rank Booster, and Mock Pack ⊉ either.',
    'THE TRAP: a user who buys Rank Booster at ₹1,249 and then wants Vettri must buy again. A Premium buyer at ₹1,699 would have had both for ₹450 more. Nothing on the pricing screen says so.',
    'THE MISNOMER: "Group 1 Mock Test Pack" at ₹399 does not unlock mock exams. It grants a bigger credit drip. A buyer reasonably expects otherwise.',
    'NO DEFAULT: five options and no recommendation. The team already senses the problem — the app ships a VettriSuggestModal that downsells Premium-curious users to the cheaper plan, which is a mitigation, not a fix.',
  ],

  C_why: [
    'premium_annual attracts 57% of all purchase intent — more than every other plan combined — at the highest price point, and has converted zero times out of twelve attempts.',
    'Confusion at the pricing screen is the last controllable step before money. Everything upstream has already been paid for in acquisition effort.',
    'It is cheap to fix. Clarifying what each plan includes requires no pricing change, no plan removal and no new product.',
  ],

  D_evidence: [
    { tag: 'UX',   text: '"I can\'t differentiate what each plan does."' },
    { tag: 'PROD', text: 'User 9810aa5d opened two different plans\' checkouts 12 SECONDS APART. A second user shows an 11.7-second cross-plan span. That is comparison-shopping at the payment window.' },
    { tag: 'PROD', text: 'premium_annual: 12 checkout attempts (57% of all demand), 0 conversions, 12 of the 20 abandonments (60%).' },
    { tag: 'PROD', text: 'vettri_nichayam: 4 attempts, 1 conversion (founder-generated) — the only plan that has ever converted.' },
    { tag: 'PROD', text: 'rank_booster_g2: 3 attempts, 0 conversions. group1_mock_pack: 2 attempts, 0 conversions.' },
    { tag: 'CODE', text: 'Entitlement rules read directly: Premium is a superset of both Vettri and Rank Booster; Vettri excludes Rank Booster; Mock Pack grants 50 credits/day instead of 10 and unlocks no bank.' },
    { tag: 'CODE', text: 'VettriSuggestModal exists specifically to downsell Premium-curious users to Vettri — evidence the team already perceives the complexity.' },
    { tag: 'EXT',  text: 'No public pricing page exists, so a prospective buyer cannot study the plans outside the app or forward them to anyone.' },
  ],

  E_howChecked: [
    'Production SQL (read-only): grouped the payments ledger by plan key and status to produce attempts, conversions, abandonments and revenue per plan.',
    'Production SQL (read-only): examined the timestamps of created rows per user, which surfaced the 12-second and 11.7-second cross-plan spans.',
    'Source-code inspection: read the pricing constants and the entitlement/bundle-access logic to establish exactly what each plan unlocks.',
    'Source-code inspection: located VettriSuggestModal and read its trigger conditions.',
    'First-time-user walkthrough: the tester was asked to choose a plan and articulate the difference between them.',
  ],

  F_numbers: [
    { label: 'Paid price points',                     calc: '₹399 · ₹499 · ₹899 · ₹1,249 · ₹1,699', value: '5' },
    { label: 'Distinct plan keys in the payments ledger', calc: 'group1_mock_pack, vettri_nichayam, rank_booster_g2, premium_annual', value: '4 — the two Vettri variants appear to share one key (DATA GAP)' },
    { label: 'premium_annual share of purchase intent', calc: '12 / 21 attempts', value: '57%' },
    { label: 'premium_annual conversion',              calc: '0 / 12', value: '0%' },
    { label: 'premium_annual share of abandonments',   calc: '12 / 20', value: '60%' },
    { label: 'Shortest cross-plan checkout span',      calc: 'two created rows, same user, different plans', value: '12 seconds' },
    { label: 'Overall checkout conversion',            calc: '1 / 21 attempts', value: '4.8%' },
  ],

  G_affected: {
    count: '11 people / 21 price-accepted checkout attempts are the directly evidenced population',
    pct: '100% of anyone who reaches the pricing screen is exposed; the size of that population is unknown',
    stage: 'Pricing → Checkout',
    note: 'DATA GAP: pricing_viewed is not instrumented on PricingCards, so the number of users who saw the plans and left without starting a checkout is unknown. The 11 are the survivors, not the sample.',
  },

  H_rootCause: {
    confirmed: [
      'The entitlement overlap is real, not a communication artefact. It was read directly in the pricing and access-control code.',
      'No plan comparison surface exists that states what each plan includes relative to the others.',
      'No default or recommended plan is presented.',
    ],
    hypothesis: [
      'That plan confusion is what suppresses conversion. Supported by the walkthrough and by the 12-second cross-plan checkout, but not proven.',
      'COMPETING HYPOTHESIS: price resistance at ₹1,699 explains premium_annual\'s 0-for-12 just as well. These two explanations fit the data equally and cannot be separated without pricing-screen instrumentation or user interviews. Both are recorded; neither is chosen.',
    ],
  },

  I_userImpact: [
    'The user reads five plans and cannot state the difference between them.',
    'They open a checkout screen not to buy but to find out what a plan costs and includes.',
    'They open a second checkout screen 12 seconds later to compare.',
    'They buy neither.',
    'A buyer who does choose may pick a plan that excludes something they assumed was included — Vettri without Rank Booster, or a "Mock Test Pack" that unlocks no mock exams.',
  ],

  J_businessImpact: [
    'Lost conversion, concentrated on the highest-value product: 12 attempts at ₹1,699, zero sales.',
    'Scenario value of the abandoned attempts at list price: 12×₹1,699 + 3×₹1,249 + 3×₹899 + 2×₹399 = ₹27,630, roughly 31× all-time revenue. This is a measure of expressed intent, NOT lost revenue and NOT a forecast — most checkouts started anywhere are never completed.',
    'Support and refund risk from mis-set expectations, particularly around the Mock Pack name. UNQUANTIFIED — 0 refunds so far, but also almost no customers.',
  ],

  K_devImpact: [
    'The pricing constants and the entitlement / bundle-access logic — the two places where "what does this plan include" is actually decided.',
    'PricingCards and the individual plan cards (PremiumCard, VettriCard) — the presentation surface.',
    'VettriSuggestModal — an existing partial mitigation that should be reconsidered alongside a real comparison surface.',
    'The payments ledger plan key: the two Vettri price points appear to collapse into one key, which will make per-variant analysis impossible later.',
    'Instrumentation: no per-plan-card view or click event exists, so plan-level demand can only be reconstructed from checkout attempts — the very end of the process.',
  ],

  L_fix: [
    'Add a one-line differentiator to every plan stating who it is for and what it uniquely unlocks.',
    'Publish a plan comparison matrix showing inclusion and exclusion explicitly — particularly that Premium includes Rank Booster and Vettri does not.',
    'Rename or re-describe the Group 1 Mock Test Pack so its name matches what it grants.',
    'Present a default recommendation instead of five equal options.',
    'Instrument per-plan card views and clicks, plus a pricing_viewed event, so plan demand can be measured before the plans themselves are ever changed.',
    'DO NOT REMOVE OR RESTRUCTURE PLANS YET. With 21 attempts and 1 sale, redesigning the pricing architecture would be fitting to noise. Make the plans describable first, gather real per-plan funnel data, then decide.',
  ],

  M_implementation: [
    'The comparison matrix should be generated from the same entitlement source the access-control code uses. If it is hand-maintained it will drift, and the resulting mismatch is worse than the current silence.',
    'Splitting the Vettri ledger plan key into its two variants is a forward-looking change: existing rows cannot be retroactively disambiguated.',
    'Per-plan-card instrumentation should mirror the existing checkout_started pattern, which already has a clean single choke-point.',
    'Pricing changes are explicitly out of scope. There is no evidence that price is the binding constraint, because there have been no external conversions at any price.',
    'NO PRODUCTION CHANGE IS MADE BY THIS DASHBOARD.',
  ],

  N_successMetric: [
    'PRIMARY: premium_annual conversion > 0%. It is currently 0 of 12.',
    'SUPPORTING: cross-plan checkout opens within 60 seconds of each other fall toward zero — users should be comparing on the pricing screen, not at the payment window.',
    'SUPPORTING: per-plan view → checkout-start rates become measurable at all.',
    'DIAGNOSTIC: whether conversion improves without a price change would, for the first time, separate the plan-confusion hypothesis from the price-resistance hypothesis.',
    'No conversion-rate target is set — BASELINE FIRST, TARGET TO BE SET AFTER EXPERIMENT.',
  ],

  O_priority: 'P0',
  P_confidence: 'High — the entitlement overlap and the per-plan demand figures are directly measured. The causal link to non-conversion is an OBSERVATION, not a proven mechanism.',
  Q_source: ['Stage 2 codebase audit (pricing constants, entitlement rules, VettriSuggestModal)', 'Stage 3 production queries (payments grouped by plan and timestamp)', 'First-time-user walkthrough', 'Final Growth Verification §5, §6, §12', 'Backlog register P0-2'],
},

/* ======================================================================== */
{
  id: 3,
  title: 'Broken / expired promotional experience',
  priority: 'P0',
  category: 'Trust',
  severity: 'High',
  evidenceStatus: 'CONFIRMED',
  rootCauseStatus: 'CONFIRMED',
  funnelStage: 'Paid-ads landing → Pricing',
  confidence: 'High',
  oneLiner: 'The one page built specifically to convert paid traffic advertises an "offer valid till 31 Aug 2026" — and it was still live on 5 Sep.',

  underlying: [
    { id: 'P0-3', text: 'Expired offer live on the paid-ads landing page; the price does not auto-revert', tag: 'CODE + UX' },
  ],

  A_summary: [
    'The /rank-booster page — which the code itself labels as the Meta ad landing target — advertises Rank Booster at ₹1,249 down from an ₹1,800 MRP, as an "Independence Day offer valid till 31 Aug 2026".',
    'The offer expired on 31 August. It was confirmed still visible on 5 September, five days later.',
    'The pricing source comments that the price is not auto-reverting and must be updated by hand when the offer window closes. Nobody did.',
  ],

  B_flaw: [
    'A promotional deadline is hard-coded as display copy with no relationship to the current date.',
    'The discounted price is a hand-maintained constant with no expiry automation — the code says so in its own comment.',
    'There is no central promotional-expiry mechanism, so this failure mode is available to every future offer, not just this one.',
    'It sits on the single page most likely to receive paid traffic, which is the worst possible location for it.',
  ],

  C_why: [
    'A visibly expired deadline is a direct trust signal. It tells a first-time visitor that nobody is looking after this page — at the exact moment they are being asked for ₹1,249.',
    'It is on the paid-ads landing target, so any advertising spend is being pointed at it.',
    'It is the cheapest fix in this entire report: a constant and an expiry check.',
  ],

  D_evidence: [
    { tag: 'CODE', text: '/rank-booster advertises ₹1,249 (MRP ₹1,800) as an "Independence Day offer valid till 31 Aug 2026".' },
    { tag: 'CODE', text: 'The pricing source states in its own comment that the price is not auto-reverting and the constant must be updated by hand when the offer window ends.' },
    { tag: 'CODE', text: 'The same page is identified in code as the Meta ad landing target.' },
    { tag: 'UX',   text: 'Confirmed still visible on 5 Sep 2026 — five days after the stated expiry.' },
    { tag: 'PROD', text: 'rank_booster_g2: 3 checkout attempts, 0 conversions. Sample far too small to attribute to the stale offer — recorded as context, not as proof of harm.' },
  ],

  E_howChecked: [
    'Source-code inspection: read the /rank-booster landing page component and the server-side pricing constants, including the maintainer comment about manual reversion.',
    'Date comparison: the stated offer deadline (31 Aug 2026) against the audit date (5 Sep 2026).',
    'UX walkthrough: loaded the live page and confirmed the expired copy was still rendering.',
    'Production SQL (read-only): pulled rank_booster_g2 checkout attempts for context.',
  ],

  F_numbers: [
    { label: 'Offer expiry date',              calc: 'stated in page copy', value: '31 Aug 2026' },
    { label: 'Date confirmed still visible',   calc: 'UX walkthrough',      value: '5 Sep 2026' },
    { label: 'Days live past expiry',          calc: '31 Aug → 5 Sep',      value: '5 days at time of discovery, and counting' },
    { label: 'Advertised price / MRP',         calc: '₹1,249 from ₹1,800',  value: '31% claimed discount' },
    { label: 'Automated expiry checks in the promotional path', calc: 'code inspection', value: '0' },
    { label: 'Traffic exposed to the stale offer', calc: 'no server-side pageview store', value: 'DATA NOT AVAILABLE' },
  ],

  G_affected: {
    count: 'Every visitor to /rank-booster since 1 Sep 2026 — count unknown',
    pct: 'DATA NOT AVAILABLE — there is no server-side pageview store, so page traffic cannot be quantified',
    stage: 'Paid-ads landing → Pricing',
    note: 'This is one of the clearest cases in the report where the defect is certain and its blast radius is unmeasurable. That is itself a finding — see Flaw #13.',
  },

  H_rootCause: {
    confirmed: [
      'The promotional price and its deadline are hand-maintained constants with no expiry logic.',
      'No centralised promotional-expiry mechanism exists, so every offer depends on someone remembering.',
      'The deadline shown to users is static copy, not derived from any date comparison.',
    ],
    hypothesis: [
      'That the stale offer measurably suppressed Rank Booster conversion. With 3 attempts and 0 conversions the sample cannot support that claim. The trust argument stands on its own without it.',
    ],
  },

  I_userImpact: [
    'A visitor arrives from an advertisement and is shown a discount that expired days ago.',
    'The clearest available reading for that user is that the page is unmaintained — which is a poor introduction to a product asking for ₹1,249.',
    'If the price is honoured, the deadline was meaningless. If it is not honoured, the page is misleading. Neither is good.',
  ],

  J_businessImpact: [
    'Lost trust at the point of conversion, on the one page built to convert paid traffic.',
    'Wasted advertising spend, to whatever degree spend is pointed at this page — UNQUANTIFIED, because there is no attribution and no pageview store.',
    'Reputational and compliance exposure from advertising a time-limited price past its stated deadline. Noted as a risk, not assessed.',
  ],

  K_devImpact: [
    'The server-side pricing constants — the single place the discounted price and MRP live.',
    'The /rank-booster landing page component, which renders the deadline as copy.',
    'Any future promotional surface: the absence of a shared expiry mechanism is the actual defect, and it is not specific to this offer.',
  ],

  L_fix: [
    'Immediate: correct the current constant so the page shows a price and a claim that are both true today.',
    'Structural: centralise promotional configuration with a start and end timestamp, and have every promotional surface compare that window against now() at render time.',
    'Make expiry the default behaviour — when a window closes, the offer disappears and the price reverts without anyone taking action.',
    'Add a build-time or monitoring check that fails loudly when a promotional deadline is in the past.',
  ],

  M_implementation: [
    'The rule should be that promotional copy cannot state a date that is not derived from the same configuration that controls the price. Today the two are independent, which is exactly how they drifted apart.',
    'Reverting the price and removing the copy are two separate actions today. They must become one.',
    'This is genuinely trivial work. Its priority comes from certainty and from where it sits, not from its size.',
    'NO PRODUCTION CHANGE IS MADE BY THIS DASHBOARD.',
  ],

  N_successMetric: [
    'PRIMARY: zero expired offers displayed anywhere in production, verified by an automated check rather than by inspection. Currently 1.',
    'This is a DEFINITIONAL target, not an experimental one — correctness has an obviously correct value.',
    'SUPPORTING: /rank-booster page → checkout-start rate, once the page has a view event to measure against. Currently unmeasurable.',
  ],

  O_priority: 'P0',
  P_confidence: 'High — the expiry date, the current date, the code comment and the live page were each observed directly.',
  Q_source: ['Stage 2 codebase audit (pricing constants, /rank-booster component)', 'First-time-user walkthrough (5 Sep 2026)', 'Final Growth Verification §14 P0-3', 'Backlog register P0-3'],
},

/* ======================================================================== */
{
  id: 4,
  title: 'Poor first-time user experience',
  priority: 'P1',
  category: 'Activation',
  severity: 'High',
  evidenceStatus: 'OBSERVED',
  rootCauseStatus: 'OBSERVATION',
  funnelStage: 'Onboarding → First test',
  confidence: 'Medium',
  oneLiner: 'A new user lands in the app with no orientation, up to five modals competing for attention, and 3–4 taps between them and the only thing that delivers value.',

  underlying: [
    { id: 'P1-1', text: 'No orientation for a new user after signup', tag: 'UX + PROD' },
    { id: 'P1-2', text: '3–4 taps to reach a test', tag: 'UX' },
    { id: 'P1-3', text: 'Popup overload at first run — five competing entry modals', tag: 'UX + CODE' },
  ],

  A_summary: [
    'Signup works. That is established and closed. What happens immediately afterwards does not.',
    'The tester\'s first words on entering the app were: "When entered the application, I don\'t know what is so necessary and what should I do now."',
    'Before they could work it out, they were interrupted: "felt like there is too many pop up when entering the app." Code inspection confirms five separate modals can compete on entry — an onboarding tour, a starter-test prompt, a push-notification primer, a marathon free alert and an update prompt.',
    'And the thing they were supposed to reach was 3–4 taps away.',
  ],

  B_flaw: [
    'NO ORIENTATION: nothing tells a new user what this product is for them to do first.',
    'POPUP OVERLOAD: five modals can fire on entry, each asking for a decision before the user has done anything worth deciding about.',
    'NAVIGATION FRICTION: 3–4 taps sit between app entry and a started test — friction placed directly in front of the only action that delivers value.',
    'The three compound: the user does not know what to do, is interrupted while trying to work it out, and then has to navigate to find it.',
  ],

  C_why: [
    'The stage immediately downstream of this is the largest absolute loss in the funnel — 337 registered users never start a single test.',
    'These users are already acquired. They found the product, decided to try it, and completed a registration. They are the cheapest possible users to activate and they are being lost after the hard part.',
    'First-run experience is a one-shot resource. A user gets one first session.',
  ],

  D_evidence: [
    { tag: 'UX',   text: '"When entered the application, I don\'t know what is so necessary and what should I do now."' },
    { tag: 'UX',   text: '"felt like there is too many pop up when entering the app."' },
    { tag: 'UX',   text: '3–4 taps from entry to a started test, counted during the walkthrough.' },
    { tag: 'CODE', text: 'Five modals confirmed as able to compete on entry: onboarding tour, starter-test prompt, push primer, marathon free alert, update prompt.' },
    { tag: 'PROD', text: '337 of 682 registered users (49.4%) never start a test — the outcome this stage feeds.' },
    { tag: 'UX',   text: 'DISPROVED ALTERNATIVE: signup friction. Registration was verified working by both the walkthrough and the founder, so the 337 are dropping AFTER a clean signup — which points at orientation, not registration.' },
    { tag: 'CODE', text: 'No onboarding-completion event exists, so the drop-off inside this sequence cannot be located.' },
  ],

  E_howChecked: [
    'First-time-user walkthrough on a real device: a fresh account was created and the tester narrated their intent from the first screen onward.',
    'Tap counting: the number of interactions between app entry and a started test was counted directly.',
    'Source-code inspection: located every modal capable of firing on app entry and read their trigger conditions to confirm they can co-occur.',
    'Production SQL (read-only): counted distinct users in test_sessions against the profiles count to establish the 345 / 337 split.',
    'Elimination: signup was tested end-to-end and confirmed by the founder, removing registration as an explanation.',
  ],

  F_numbers: [
    { label: 'Modals able to fire on entry',      calc: 'code inspection', value: '5' },
    { label: 'Taps from entry to a started test', calc: 'walkthrough count', value: '3–4' },
    { label: 'Users who never start a test',      calc: '337 / 682', value: '49.4%' },
    { label: 'Users who do start',                calc: '345 / 682', value: '50.6%' },
    { label: 'Onboarding completion rate',        calc: 'no onboarding event exists', value: 'DATA NOT AVAILABLE' },
    { label: 'Drop-off point within first run',   calc: 'not instrumented', value: 'DATA NOT AVAILABLE' },
  ],

  G_affected: {
    count: 'All 682 registered users passed through this experience; 337 of them never started a test',
    pct: '49.4% of registrations end without a single test start',
    stage: 'Onboarding → First test',
    note: 'The 337 figure is FACT. Attributing all 337 to first-run experience specifically is NOT established — there is no onboarding instrumentation to locate where inside the sequence they leave.',
  },

  H_rootCause: {
    confirmed: [
      'Five modals can compete on app entry. Read directly in code.',
      '3–4 taps separate entry from a started test. Counted directly.',
      'No orientation step exists that establishes what the user should do first.',
      'Signup is NOT the cause — it is verified working.',
    ],
    hypothesis: [
      'That popup overload and tap count are what cause the 337 loss. The loss is fact; this specific attribution is a walkthrough-based observation of n = 1.',
      'That a single-question orientation followed by a one-tap test start would materially move activation. Plausible, cheap, and entirely untested.',
    ],
  },

  I_userImpact: [
    'The user finishes registering, arrives, and does not know what they are supposed to do.',
    'Modals interrupt them before they have formed an intention.',
    'They dismiss several things, then have to navigate to find the actual product.',
    'Roughly half of them never get there at all.',
  ],

  J_businessImpact: [
    'Lost activation: 337 acquired users produced no product usage whatsoever.',
    'The full acquisition cost of those users was paid and none of the value was collected. The actual cost is UNQUANTIFIED because there is no attribution or spend data.',
    'Downstream: a user who never starts a test can never complete one, never return, never see a value moment, and never convert. This stage gates everything after it.',
  ],

  K_devImpact: [
    'The post-signup routing decision and the app entry sequence.',
    'All five entry modals and their trigger conditions — currently independent, and therefore able to stack.',
    'The navigation path between the home surface and the test arena.',
    'Instrumentation: no onboarding-start or onboarding-complete event exists, so the interior of this funnel is invisible.',
  ],

  L_fix: [
    'Replace the entry sequence with one question and one action: which exam are you preparing for, then start this test.',
    'Introduce a modal queue or priority so that at most one thing asks for attention on first entry, and defer the rest — the push-notification primer in particular has no business appearing before the user has any reason to want notifications.',
    'Put a one-tap test start on the first screen a new user sees.',
    'Instrument the first-run sequence so the drop-off point can be located rather than inferred.',
  ],

  M_implementation: [
    'The modal stacking is the most mechanical part: five components independently decide to show themselves. They need a single arbiter that knows what has already been shown this session.',
    'The desired journey is: Signup → Choose exam → Start first test. The observed journey is: Signup → Landing/Home → Popup(s) → Navigation → Test. The gap between those two is the work.',
    'Instrument BEFORE redesigning. Without a first-run event sequence, any improvement will be attributable only to the aggregate activation rate, which moves slowly and is confounded by a fast-growing base.',
    'NO PRODUCTION CHANGE IS MADE BY THIS DASHBOARD.',
  ],

  N_successMetric: [
    'PRIMARY: signup → first-test-start rate, measured on weekly signup cohorts AFTER the change. Baseline 50.6% (345 / 682).',
    'Cohort measurement is essential here: 53.7% of the base registered in the last 30 days, so a blended lifetime figure will not move visibly even if the change works.',
    'SUPPORTING: median time from signup to first test start. Currently DATA NOT AVAILABLE.',
    'SUPPORTING: modals shown per first session falls to 1.',
    'No target rate is set — BASELINE FIRST, TARGET TO BE SET AFTER EXPERIMENT.',
  ],

  O_priority: 'P1',
  P_confidence: 'Medium — the modal count and tap count are directly observed and the 337 loss is measured, but the causal link between them rests on a walkthrough of n = 1 by a non-aspirant.',
  Q_source: ['First-time-user walkthrough', 'Stage 2 codebase audit (entry modal trigger conditions)', 'Stage 3 production queries (profiles vs test_sessions)', 'Final Growth Verification §14 P1-4, P1-6', 'Backlog register P1-1, P1-2, P1-3'],
},

/* ======================================================================== */
{
  id: 5,
  title: 'Weak activation',
  priority: 'P1',
  category: 'Activation',
  severity: 'Critical',
  evidenceStatus: 'CONFIRMED',
  rootCauseStatus: 'OBSERVATION',
  funnelStage: 'Signup → First test',
  confidence: 'High',
  oneLiner: '337 of 682 registered users — 49.4% — have never started a single test. This is the largest absolute loss anywhere in the funnel.',

  underlying: [
    { id: 'P1-1', text: 'Registration → first meaningful action is where half the base is lost', tag: 'PROD' },
  ],

  A_summary: [
    'Half of everyone who registers never uses the product.',
    '682 people signed up. 345 started a test. 337 did not. Of the 345 who started, 286 finished — so once a user begins, they usually complete. The failure is entirely at the moment of starting.',
    'This is not a signup problem. Registration was verified working by the walkthrough and confirmed by the founder. These 337 people completed a clean signup and then stopped.',
  ],

  B_flaw: [
    'There is no defined activation moment that the product drives users toward.',
    'The gap between "account created" and "first meaningful action" is unmanaged: nothing routes, nudges or reminds.',
    'Activation is not measured as a metric. There is no onboarding event, no time-to-first-test, and no cohorted activation rate — so the problem is only visible as a lifetime aggregate.',
    'Nothing recovers a user who signs up and does not start. No reminder, no re-engagement, no second chance.',
  ],

  C_why: [
    'Activation gates every downstream stage. A user who never starts a test cannot complete one, cannot return, cannot reach a value moment, and cannot convert. All 337 are permanently excluded from every metric below.',
    'These are the cheapest users in the business to convert into product usage. The acquisition work is already done and paid for.',
    'Acquisition is growing. 366 signups in the last 30 days means roughly 180 more users are being added to this loss every month at the current rate.',
  ],

  D_evidence: [
    { tag: 'PROD', text: '682 registered users (profiles).' },
    { tag: 'PROD', text: '345 users have at least one row in test_sessions — 50.6%.' },
    { tag: 'PROD', text: '337 users have none — 49.4%.' },
    { tag: 'PROD', text: '286 users completed at least one test — 41.9% of all users, and 82.9% of the 345 who started.' },
    { tag: 'PROD', text: '59 users started but never completed — 17.1% of starters. Small relative to the 337.' },
    { tag: 'UX',   text: '"When entered the application, I don\'t know what is so necessary and what should I do now."' },
    { tag: 'UX + FOUNDER', text: 'DISPROVED ALTERNATIVE: signup friction. Registration is verified working, so this loss occurs after a clean registration.' },
    { tag: 'CODE', text: 'No activation event, no time-to-first-test measurement, and no re-engagement mechanism exists for a user who signs up and stops.' },
  ],

  E_howChecked: [
    'Production SQL (read-only): count(*) from profiles for the denominator.',
    'Production SQL (read-only): count of distinct user_id in test_sessions for the numerator, and the same restricted to status = completed.',
    'Subtraction, with both denominators stated: 682 − 345 = 337 never started; 345 − 286 = 59 started but never completed.',
    'Elimination of the signup hypothesis via the walkthrough and founder confirmation.',
    'Source-code inspection: searched for any activation, onboarding-completion or re-engagement mechanism. None found.',
  ],

  F_numbers: [
    { label: 'Registered users',              calc: 'profiles',        value: '682' },
    { label: 'Started ≥1 test',               calc: '345 / 682',       value: '50.6%' },
    { label: 'NEVER started a test',          calc: '337 / 682',       value: '49.4%' },
    { label: 'Completed ≥1 test',             calc: '286 / 682',       value: '41.9%' },
    { label: 'Completion rate among starters', calc: '286 / 345',      value: '82.9%' },
    { label: 'Started but never completed',   calc: '59 / 345',        value: '17.1%' },
    { label: 'Median time signup → first test', calc: 'not computed',  value: 'DATA NOT AVAILABLE' },
    { label: 'Activation by signup cohort',   calc: 'not computed',    value: 'DATA NOT AVAILABLE' },
  ],

  G_affected: {
    count: '337 registered users',
    pct: '49.4% of all registrations (337 / 682)',
    stage: 'Signup → First test start',
    note: 'This is the largest absolute loss in the funnel. It is also the cleanest number in the report: two counts from two tables, no interpretation required.',
  },

  H_rootCause: {
    confirmed: [
      '337 users registered and never started a test. Directly counted.',
      'Signup is not the cause — it is verified working.',
      'No activation measurement, no time-to-first-test, and no re-engagement mechanism exists.',
    ],
    hypothesis: [
      'That first-run experience (Flaw #4) is the primary cause. Consistent with the walkthrough evidence, but not isolated — the drop-off point inside the first session is not instrumented.',
      'That some fraction of the 337 are simply very recent signups who have not returned yet. 53.7% of the base registered in the last 30 days, so this is a genuine confound and it has NOT been quantified. Cohorted activation would separate it; that query has not been run. DATA GAP.',
    ],
  },

  I_userImpact: [
    'The user registers, arrives, and leaves without using the product.',
    'Whatever brought them — a search, an ad, a friend, a Telegram link — produced nothing for them.',
    'Nothing follows up, so the decision is final.',
  ],

  J_businessImpact: [
    'Lost activation: 337 users, 49.4% of everything acquired.',
    'Every downstream loss is compounded by this one. The retention rate against all registered users (2.3%) is depressed partly because half the base was never in a position to return.',
    'Lost revenue: unquantifiable directly, since conversion is 0.00% for activated users too. But activation is a necessary precondition for any future conversion.',
  ],

  K_devImpact: [
    'Post-signup routing — the first screen decision.',
    'The test-arena entry path and its distance from that first screen.',
    'Instrumentation: activation needs to become a first-class metric with an event, a definition, and a cohorted report.',
    'A re-engagement path for signed-up-but-inactive users does not exist and would be new work.',
  ],

  L_fix: [
    'Define activation explicitly. The recommended definition is: first test STARTED, with first test COMPLETED tracked alongside it. Both are already derivable from test_sessions.',
    'Report both as cohorted rates by signup week, not as lifetime aggregates.',
    'Reduce the distance to that action to a single tap from the first post-signup screen (this is the same work as Flaw #4).',
    'Instrument time-to-first-test so the shape of the delay is visible — a user who starts on day 3 is a different problem from one who never starts.',
    'Consider a re-engagement path for signed-up-but-never-started users. FLAGGED AS A PRODUCT MECHANISM ONLY — no user is contacted as part of this audit.',
  ],

  M_implementation: [
    'The two KPIs are computable from data that already exists. This is a reporting build before it is a product build.',
    'Cohorting is not optional. With 53.7% of the base under 30 days old, a blended lifetime activation rate will barely move even if the product change works perfectly.',
    'Run the cohorted activation query BEFORE shipping any change, so there is a real before-picture rather than a single lifetime number.',
    'NO PRODUCTION CHANGE IS MADE BY THIS DASHBOARD.',
  ],

  N_successMetric: [
    'PRIMARY KPI: Signup → first test start %. Current 50.6% (345 / 682).',
    'SECONDARY KPI: Signup → first test completion %. Current 41.9% (286 / 682).',
    'Both measured on weekly signup cohorts at a fixed age (for example, 7 days after signup), so cohorts are compared like with like.',
    'SUPPORTING: median time from signup to first test start becomes measurable.',
    'No target rate is set — BASELINE FIRST, TARGET TO BE SET AFTER EXPERIMENT. A target chosen before the cohorted baseline exists would be an invented number.',
  ],

  O_priority: 'P1',
  P_confidence: 'High — the counts are direct and unambiguous. The causal attribution to first-run experience is Medium.',
  Q_source: ['Stage 3 production queries (profiles, test_sessions)', 'First-time-user walkthrough', 'Final Growth Verification §1, §9', 'Backlog register P1-1'],
},

/* ======================================================================== */
{
  id: 6,
  title: 'Poor retention & habit formation',
  priority: 'P1',
  category: 'Retention',
  severity: 'Critical',
  evidenceStatus: 'CONFIRMED',
  rootCauseStatus: 'OBSERVATION',
  funnelStage: 'Test completion → Return visit',
  confidence: 'High',
  oneLiner: '270 of 286 users who completed a test — 94.4% — never came back on a second day. Only 16 of 682 users have ever had two active days.',

  underlying: [
    { id: 'P1-6', text: 'Nothing brings users back', tag: 'PROD' },
    { id: 'P3-5', text: 'The habit loop ignores partial effort — streaks, XP and badges are written only by submit_test', tag: 'CODE' },
    { id: 'P2-12', text: 'daily_activity only logs test submissions, so every retention figure is a floor', tag: 'CODE' },
  ],

  A_summary: [
    'The single largest proportional loss in the funnel: 94.4% of users who completed a test never returned on another day.',
    '16 users out of 682 have ever had two active days. That is 2.3% of the base, or 5.6% of the users who actually completed a test.',
    'Two caveats matter, and both must travel with these numbers. First, "active" is defined narrowly — a user who logs in and reads materials without submitting a test is not counted at all, so these are floors. Second, 53.7% of the base registered within the last 30 days and has had limited time to return.',
    'Neither caveat rescues the figure. A 5.6% two-day rate among completers is very weak by any reading.',
  ],

  B_flaw: [
    'NO RETURN LOOP: nothing in the product creates a reason to open it tomorrow.',
    'PARTIAL EFFORT EARNS NOTHING: streaks, XP and badges are written exclusively by submit_test. A user who answers 20 questions and quits receives no reinforcement at all — precisely the user most in need of a reason to come back.',
    'MEASUREMENT IS TOO NARROW: daily_activity is written only by test submission and current-affairs completion, so the retention metric cannot see reading, browsing, revision or bookmarks.',
    'NO COHORT VIEW: D1/D3/D7/D14/D30 have never been computed, so it is unknown WHEN users leave — only that they do.',
  ],

  C_why: [
    'Retention is what makes acquisition worth paying for. Without it, a growing signup number produces a growing pile of single-session users — which is exactly the shape of this business today: 396 signups in August, 16 lifetime two-day users.',
    'Retention also gates conversion. A user needs repeated exposure to a product\'s value before paying for it, and 94.4% of completers get exactly one session.',
    'The habit machinery already exists — streaks, XP, badges, spaced repetition. It is built and it is being triggered by only one event.',
  ],

  D_evidence: [
    { tag: 'PROD', text: '286 users completed at least one test.' },
    { tag: 'PROD', text: '16 users have ever had 2+ distinct activity dates in daily_activity.' },
    { tag: 'PROD', text: '270 of 286 completers (94.4%) never returned on a second day.' },
    { tag: 'PROD', text: '16 / 682 = 2.3% of all registered users; 16 / 286 = 5.6% of test-completers. Both denominators shown because they answer different questions.' },
    { tag: 'PROD', text: 'Active last 30 days: 135 (19.8%). Active last 7 days: 17 (2.5%). The 7d/30d ratio is 12.6%.' },
    { tag: 'CODE', text: 'Streaks, XP and badges are written ONLY by submit_test. An abandoned or silently-killed session earns nothing, even if 20 questions were answered first.' },
    { tag: 'CODE', text: 'daily_activity is written only by test submission and current-affairs question completion. Logging in and reading materials does not register as activity.' },
    { tag: 'CODE', text: 'A spaced-repetition system (review_items) exists — real return-loop machinery that is not being used as a return loop.' },
    { tag: 'PROD', text: 'CONTEXT: 366 of 682 users (53.7%) registered within the last 30 days. A material share of the base has not had much opportunity to return.' },
  ],

  E_howChecked: [
    'Production SQL (read-only): counted users with 2+ distinct activity_date values in daily_activity.',
    'Production SQL (read-only): counted distinct users with a completed test session, giving the 286 denominator.',
    'Production SQL (read-only): counted distinct active users in trailing 7-day and 30-day windows.',
    'Source-code inspection: traced every writer of daily_activity and every writer of streak, XP and badge state, to establish exactly what counts as "active" and what earns reinforcement.',
    'Timezone validation: active-today and active-7d were recomputed under both UTC and IST and returned identical values (2 and 17), confirming the known timezone bug is not distorting these figures.',
    'Cohort retention (D1/D3/D7/D14/D30) was NOT computed — the query has not been run.',
  ],

  F_numbers: [
    { label: 'Test-completers who returned on a 2nd day', calc: '16 / 286', value: '5.6%' },
    { label: 'All registered users with 2+ active days',  calc: '16 / 682', value: '2.3%' },
    { label: 'Completers who NEVER returned',             calc: '270 / 286', value: '94.4%' },
    { label: 'Active in last 30 days',                    calc: '135 / 682', value: '19.8%' },
    { label: 'Active in last 7 days',                     calc: '17 / 682',  value: '2.5%' },
    { label: '7-day / 30-day active ratio',               calc: '17 / 135',  value: '12.6%' },
    { label: 'Base registered in the last 30 days',       calc: '366 / 682', value: '53.7% — the immaturity confound' },
    { label: 'D1 / D3 / D7 / D14 / D30 retention',        calc: 'query not run', value: 'DATA NOT AVAILABLE' },
  ],

  G_affected: {
    count: '270 test-completers who never returned; 666 of 682 users have never had two active days',
    pct: '94.4% of completers (270 / 286); 97.7% of all users (666 / 682)',
    stage: 'Test completion → Return visit',
    note: 'FLOOR, NOT MEASUREMENT. The true return rate is higher by an unknown margin because daily_activity cannot see non-test engagement. It is not plausible that the correction closes a gap this large, but the figure must not be described as "true retention" in any decision-making context.',
  },

  H_rootCause: {
    confirmed: [
      'Streaks, XP and badges are written only by submit_test — partial effort is not reinforced. Read directly in code.',
      'daily_activity records only test submission and current-affairs completion — the retention metric is structurally narrow.',
      'No cohorted retention measurement exists.',
      'The spaced-repetition system exists but is not used to drive returns.',
    ],
    hypothesis: [
      'That the absence of a return loop is the primary cause of the 94.4%. Consistent with the evidence; not isolated from alternatives.',
      'That rewarding partial effort would improve return rates. Structurally plausible — a user who quits mid-test currently receives zero acknowledgement — but entirely untested.',
      'That some share of the 94.4% is cohort immaturity rather than churn. Real and unquantified: 53.7% of the base is under 30 days old. Only cohorted retention can separate the two, and it has not been run. DATA GAP.',
    ],
  },

  I_userImpact: [
    'A user completes a test, sees a score, and is given no reason to come back tomorrow.',
    'A user who answers 20 questions and has to stop receives nothing — no streak credit, no XP, no acknowledgement that they tried. The system\'s response to a bad session is silence.',
    'Revision material is generated by the spaced-repetition system and never surfaced as a reason to return.',
  ],

  J_businessImpact: [
    'Lost retention: 270 completers, and 666 of 682 users who have never had a second active day.',
    'Lost conversion: repeated exposure is normally how a free user comes to value a paid tier. 94.4% of completers get one session, which makes the conversion problem in Flaw #1 substantially harder to solve.',
    'Acquisition efficiency: 396 signups in August against 16 lifetime two-day users means growth is not compounding into an engaged base.',
  ],

  K_devImpact: [
    'daily_activity writers — the definition of "active" itself.',
    'submit_test — currently the sole writer of streak, XP and badge state.',
    'The spaced-repetition module (review_items) — existing return-loop machinery that is not wired to any return prompt.',
    'Notification and messaging surfaces, which exist but are not used to bring users back.',
    'Reporting: a cohorted retention query needs to be written; the underlying data already exists.',
  ],

  L_fix: [
    'Broaden the definition of "active" so the metric reflects real engagement — logging in and studying materials should count. Do this FIRST, and re-baseline, or any subsequent improvement will be partly a measurement artefact.',
    'Reward partial effort: grant streak or XP credit for meaningful progress, not only for submission.',
    'Build one concrete reason to return tomorrow. The spaced-repetition system already produces exactly this content and it is not surfaced.',
    'Compute and report D1 / D3 / D7 / D14 / D30 by signup cohort. The data exists; only the query is missing.',
  ],

  M_implementation: [
    'The measurement change and the product change must be sequenced deliberately. Broadening "active" will increase the retention number on its own, with no product improvement whatsoever. Re-baseline before, and report both definitions during the transition, or the improvement will be uninterpretable.',
    'Rewarding partial effort touches the habit-loop write path, which currently has exactly one trigger. Adding a second writer needs care around double-counting when a partially-completed test is later submitted.',
    'Cohorted retention is a reporting build, not a product build — it needs no schema change.',
    'NO PRODUCTION CHANGE IS MADE BY THIS DASHBOARD.',
  ],

  N_successMetric: [
    'PRIMARY: D1, D3, D7, D14 and D30 retention exist as reported metrics. The first target is the existence of the measurement — no retention percentage target can responsibly be set before the curve has been seen once.',
    'SECONDARY: return rate among test-completers. Current 5.6% (16 / 286), against the narrow definition of active.',
    'GUARDRAIL: report the narrow and broadened definitions side by side for at least one full cycle, so the definitional lift is separated from the real one.',
    'BASELINE FIRST — TARGET TO BE SET AFTER EXPERIMENT.',
  ],

  O_priority: 'P1',
  P_confidence: 'High for the measured counts. Medium for the causal attribution and for how much of the loss is churn versus cohort immaturity.',
  Q_source: ['Stage 3 production queries (daily_activity, test_sessions)', 'Stage 2 codebase audit (habit-loop writers, daily_activity writers)', 'Final Growth Verification §7, §9', 'Backlog register P1-6, P2-12, and P3-5 (carried in: the brief requires partial-effort reinforcement under this flaw, and it is a retention mechanism rather than code debt)'],
},

/* ======================================================================== */
{
  id: 7,
  title: 'Weak content engagement & surfacing',
  priority: 'P1',
  category: 'Engagement',
  severity: 'Medium',
  evidenceStatus: 'OBSERVED',
  rootCauseStatus: 'OBSERVATION',
  funnelStage: 'Daily engagement → Return visit',
  confidence: 'Medium',
  oneLiner: 'Content that exists and would bring users back is broken, hidden or unexplained — including a broken image on the daily-return hook itself.',

  underlying: [
    { id: 'P1-5', text: 'Images not loading in Current Affairs', tag: 'UX' },
    { id: 'P1-7', text: 'Free tier under-communicated', tag: 'UX' },
    { id: 'P1-8', text: 'Kural of the Day has no prompt or surfacing', tag: 'UX' },
  ],

  A_summary: [
    'Three separate problems share one shape: content that already exists is not doing the work it could do.',
    'Current Affairs images do not load — a content defect sitting directly on the feature most suited to being a daily-return habit.',
    'The free tier is generous in breadth but under-communicated, so users do not realise what they already have.',
    'Kural of the Day exists as a feature and has nothing prompting anyone to look at it.',
    'None of these require building anything. All three are surfacing and repair.',
  ],

  B_flaw: [
    'CURRENT AFFAIRS IMAGES: observed not loading during the walkthrough. Current Affairs is the natural daily hook — it is dated, it renews, and it is exactly what a TNPSC aspirant would open every morning.',
    'FREE TIER UNDER-COMMUNICATED: "for free should be highlighted more." The free tier grants 50 signup credits plus 10/day, a free 200-question mock, and one free attempt per PYQ and CA topic. Very little of that is stated where a user would see it.',
    'KURAL OF THE DAY: an existing daily-content feature with no prompt, no notification and no placement that would cause anyone to encounter it.',
  ],

  C_why: [
    'Daily content is the cheapest available retention mechanism, and this product already has three sources of it: Current Affairs, Kural of the Day, and the spaced-repetition queue.',
    '94.4% of test-completers never return. Content that renews daily is the most direct answer to that, and it is currently broken or hidden.',
    'Under-communicating the free tier costs twice: users do not extract the value they are entitled to, and they cannot perceive what a paid tier would add.',
  ],

  D_evidence: [
    { tag: 'UX',   text: 'Images observed not loading in Current Affairs during the walkthrough.' },
    { tag: 'UX',   text: '"for free should be highlighted more."' },
    { tag: 'UX',   text: 'Kural of the Day surfacing raised unprompted during the walkthrough as an existing feature nobody would find.' },
    { tag: 'CODE', text: 'Free tier confirmed in code: 50 signup credits + 10/day (1 credit per question), 1 free 200-question mock ever, 1 free attempt per PYQ/CA topic, on-screen explanations.' },
    { tag: 'CODE', text: 'daily_activity is written by current-affairs question completion as well as test submission — so CA engagement is one of only two things that count as activity at all. A broken CA experience therefore suppresses the retention metric directly.' },
    { tag: 'PROD', text: 'No per-feature usage data exists for Current Affairs, Kural of the Day or Materials. How many users encounter them is DATA NOT AVAILABLE.' },
  ],

  E_howChecked: [
    'First-time-user walkthrough: navigated the Current Affairs section and observed the image loading failure directly.',
    'Walkthrough: the tester was asked what they got for free and could not fully state it.',
    'Source-code inspection: read the free-tier credit and entitlement rules to establish what is actually granted.',
    'Source-code inspection: confirmed that current-affairs completion is one of only two writers of daily_activity.',
    'Root cause of the image failure was NOT determined — no diagnosis of the asset pipeline, CDN or content-entry path was performed. DATA GAP.',
  ],

  F_numbers: [
    { label: 'Free tier: signup credits',        calc: 'code', value: '50, plus 10/day' },
    { label: 'Free tier: full mock exams',       calc: 'code', value: '1, ever' },
    { label: 'Free tier: attempts per topic',    calc: 'code', value: '1 per PYQ / CA topic' },
    { label: 'Current Affairs image failure',    calc: 'walkthrough observation', value: 'Observed — scope and cause unknown' },
    { label: 'Users affected by the image issue', calc: 'no per-feature usage data', value: 'DATA NOT AVAILABLE' },
    { label: 'Kural of the Day engagement',      calc: 'not instrumented', value: 'DATA NOT AVAILABLE' },
  ],

  G_affected: {
    count: 'Unknown — no per-feature usage instrumentation exists',
    pct: 'DATA NOT AVAILABLE',
    stage: 'Daily engagement → Return visit',
    note: 'The upper bound is everyone who opens Current Affairs; the lower bound is unknown because the failure was observed once, on one device, in one session. Reproduction scope was not established.',
  },

  H_rootCause: {
    confirmed: [
      'Current Affairs images failed to load in the observed session.',
      'The free tier\'s contents are not communicated on the surfaces where a user would look.',
      'Kural of the Day has no prompt, notification or placement driving traffic to it.',
    ],
    hypothesis: [
      'That the image failure is systemic rather than incidental. UNVERIFIED — observed once. It should be reproduced before it is prioritised as a widespread defect.',
      'That better free-tier communication would improve both engagement and eventual conversion. Untested.',
      'That surfacing daily content would improve return rates. Structurally plausible given that CA completion is one of only two activity writers; untested.',
    ],
  },

  I_userImpact: [
    'A user opens Current Affairs — the thing most likely to bring them back daily — and finds broken images. The product looks unfinished.',
    'A user does not know what they are entitled to for free, so they under-use it and cannot judge what paying would add.',
    'A feature built for daily engagement sits unvisited because nothing points to it.',
  ],

  J_businessImpact: [
    'Lost retention: the daily-return hook is degraded, and CA completion is one of only two events that count as activity.',
    'Lost activation: under-communicated free value reduces the chance a user finds a reason to start at all.',
    'Lost conversion: a user who cannot articulate what free gives them cannot articulate what paid would add.',
    'All three are UNQUANTIFIED. No per-feature usage data exists.',
  ],

  K_devImpact: [
    'The Current Affairs module and its image/asset pipeline — the failure needs diagnosis before it can be fixed.',
    'The Kural of the Day feature and whatever surface would prompt it (home placement, notification, or daily card).',
    'The free-tier communication surfaces: post-signup, home, and the pricing screen.',
    'Instrumentation: per-feature usage events do not exist for any content module.',
  ],

  L_fix: [
    'Diagnose and fix the Current Affairs image failure, and determine its scope — one broken item or a systemic pipeline problem.',
    'State the free tier plainly where a new user will see it: what they get, how much, and for how long.',
    'Give Kural of the Day a daily surface — a home card or a notification.',
    'Instrument content-module usage so that "nobody uses this feature" can be distinguished from "nobody can find this feature".',
  ],

  M_implementation: [
    'Reproduce the image failure before scoping the work. A single walkthrough observation is enough to justify investigation, not enough to justify a rebuild.',
    'Free-tier communication belongs next to the value moment, not on the pricing screen — a user needs to know what they have before they can evaluate what they lack.',
    'Content instrumentation should follow the existing event pattern rather than introducing a second analytics path.',
    'NO PRODUCTION CHANGE IS MADE BY THIS DASHBOARD.',
  ],

  N_successMetric: [
    'PRIMARY: zero broken images in Current Affairs, verified by an automated asset check rather than by inspection. DEFINITIONAL target.',
    'SUPPORTING: Current Affairs daily completion count becomes a reported metric — it already writes to daily_activity and is simply not reported.',
    'SUPPORTING: Kural of the Day view count exists at all. Currently DATA NOT AVAILABLE.',
    'SUPPORTING: share of new users who can state what the free tier includes — measurable only through the redesigned feedback instrument (Flaw #14).',
    'BASELINE FIRST — TARGET TO BE SET AFTER EXPERIMENT for every rate-based metric here.',
  ],

  O_priority: 'P1',
  P_confidence: 'Medium — the observations are direct but n = 1, and the scope of the image failure was never established.',
  Q_source: ['First-time-user walkthrough', 'Stage 2 codebase audit (free-tier entitlements, daily_activity writers)', 'Backlog register P1-5, P1-7, P1-8'],
},

];
