/*
 * The 14 major flaws — part 2 (flaws 8–14).
 */

export default [

/* ======================================================================== */
{
  id: 8,
  title: 'Extremely weak monetization performance',
  priority: 'P0',
  category: 'Monetization',
  severity: 'Critical',
  evidenceStatus: 'CONFIRMED',
  rootCauseStatus: 'CONFIRMED',
  funnelStage: 'Payment (outcome)',
  confidence: 'High',
  oneLiner: '682 users, 83 days, ₹899 of all-time revenue — and every rupee of it internally generated. Externally-acquired revenue is ₹0.',

  underlying: [
    { id: 'P1-9',  text: 'One real customer in 83 days; ₹899 all-time revenue', tag: 'PROD' },
    { id: 'P1-10', text: 'Three "premium" accounts are staff comps at ₹0, not customers', tag: 'FOUNDER + PROD' },
    { id: 'V-1',   text: 'Externally-acquired paying customers: 0 of 682', tag: 'FOUNDER + PROD' },
    { id: 'V-7',   text: '366 signups in the last 30 days produced 0 new paying customers', tag: 'PROD' },
  ],

  A_summary: [
    'This flaw is the scoreboard. It has no independent fix — it is the measured outcome of Flaws #1, #2, #3 and #9, and it will move only when they do.',
    'Four payment records exist. Three are internal staff comps at ₹0, confirmed by the founder. The fourth carries the only money in the system — ₹899 — and it was founder-generated.',
    'Externally-generated revenue is therefore ₹0, and the ₹899 cannot be treated as evidence of product-market fit. It is evidence that the payment pipeline works end to end, which is a genuine engineering result and not a commercial one.',
    'In the last 30 days, 366 people signed up and none of them paid anything.',
  ],

  B_flaw: [
    'Zero externally-acquired paying customers across the platform\'s entire 83-day life.',
    'Revenue is concentrated to a single point: one plan, one transaction, one internally-generated buyer.',
    'The dashboard the founder reads makes this harder to see, not easier: premiumActive counts only 1 of the 5 plans (see Flaw #13), and nothing in the system distinguishes an internal comp from a real customer.',
    'There is no external-revenue metric anywhere. All-time revenue and externally-generated revenue are different numbers with a ratio of ₹899 to ₹0, and only the first is reported.',
  ],

  C_why: [
    'It is the business outcome every other flaw feeds into.',
    'Distinguishing internal from external revenue is not accounting pedantry: a founder looking at "1 paying customer, ₹899" may reasonably read early traction. The correct reading is that nobody outside the building has ever paid.',
    'It sets the success criterion for everything else. Externally-acquired paying customers moving from 0 to 1 is a larger event for this business than any percentage improvement anywhere else in the funnel.',
  ],

  D_evidence: [
    { tag: 'PROD',    text: '4 payment records with status = paid.' },
    { tag: 'FOUNDER', text: '3 of those 4 are internal staff accounts, comped at ₹0. Founder-confirmed.' },
    { tag: 'PROD',    text: 'Exactly one payment record carries a non-zero amount: 89,900 paise = ₹899.' },
    { tag: 'FOUNDER', text: 'The founder states the single paying customer was internally generated. Since only one record carries money, that record is necessarily the one — this is arithmetic on aggregates, not identification of a user.' },
    { tag: 'PROD',    text: '366 signups in the trailing 30 days → 0 new paying customers.' },
    { tag: 'PROD',    text: '0 failed payments and 0 refunds in 83 days. The rail is not the problem.' },
    { tag: 'PROD',    text: '0 coupon redemptions in 83 days.' },
    { tag: 'PROD',    text: 'Only vettri_nichayam has ever converted. premium_annual, rank_booster_g2 and group1_mock_pack are all 0.' },
    { tag: 'PROD',    text: 'RETRACTED FINDING: an earlier comparison showed paying users with ~8× the engagement of non-payers. That was an artifact of staff accounts building and testing the product. It measured internal activity, not buyer behaviour, and must not be cited.' },
  ],

  E_howChecked: [
    'Production SQL (read-only): counted payments by status and summed amounts, in paise.',
    'Production SQL (read-only): grouped paid records by plan key to establish which plans have ever converted.',
    'Production SQL (read-only): counted signups and paid records in the trailing 30-day window.',
    'Founder confirmation: which paid accounts are staff, and that the single revenue-bearing customer was internally generated.',
    'Derived arithmetic, shown in full: 4 paid records − 3 staff comps = 1 revenue-bearing record; 1 founder-generated = 0 externally acquired.',
    'The earlier paying-vs-non-paying behavioural comparison was re-examined against the staff-account finding and formally retracted.',
  ],

  F_numbers: [
    { label: 'All-time revenue',                  calc: '89,900 paise', value: '₹899' },
    { label: 'Externally-generated revenue',      calc: '₹899 − ₹899 internal', value: '₹0' },
    { label: 'Paid records',                      calc: 'payments status=paid', value: '4' },
    { label: 'Internal staff comps',              calc: 'founder-confirmed', value: '3 (₹0)' },
    { label: 'Revenue-bearing customers',         calc: 'non-zero amount', value: '1 (founder-generated)' },
    { label: 'Externally-acquired customers',     calc: '0 / 682', value: '0.00%' },
    { label: 'Overall conversion (all paid records)', calc: '4 / 682', value: '0.59%' },
    { label: 'Revenue-generating conversion',     calc: '1 / 682', value: '0.15%' },
    { label: 'Last-30-day conversion',            calc: '0 / 366', value: '0.00%' },
    { label: 'Revenue per day',                   calc: '₹899 / 83 days', value: '₹10.83' },
    { label: 'ARPU',                              calc: '₹899 / 682', value: '₹1.32' },
    { label: 'Annualised run-rate',               calc: '₹899 / 83 × 365', value: '≈ ₹3,953 — SCENARIO, arithmetic on one transaction' },
  ],

  G_affected: {
    count: '682 registered users, of whom 0 have been converted externally',
    pct: '0.00% external conversion',
    stage: 'Payment — the terminal stage',
    note: 'The affected population here is the business itself. Every acquired user is affected in the sense that none of them has been monetised.',
  },

  H_rootCause: {
    confirmed: [
      'This flaw has no independent root cause. It is the arithmetic outcome of Flaws #1 (value), #2 (pricing clarity), #3 (trust) and #9 (recovery).',
      'The payment infrastructure is NOT a cause: 0 failures, 0 refunds, HMAC verification, idempotency, and a server-side re-fetch before crediting.',
      'Checkout is NOT a cause: verified working to the final payment step on a real device.',
      'Price is NOT established as a cause: with zero external conversions at any price point, there is no evidence that price is the binding constraint.',
    ],
    hypothesis: [
      'That the binding constraint is value perception rather than price. This is the strongest available reading and remains a hypothesis — see Flaw #1.',
    ],
  },

  I_userImpact: [
    'For users, nothing is broken. They can pay if they want to; the flow works.',
    'The impact is that 682 people have used a product and, with one internal exception, none of them found a reason to pay for it.',
  ],

  J_businessImpact: [
    'Lost revenue: total. ₹0 externally generated in 83 days.',
    'Lost validation: without a single external customer, willingness to pay is untested at every price point.',
    'Blocked analysis: the activation-threshold hypothesis — that completing N tests predicts conversion — CANNOT be tested, because there is no externally-acquired paying population to compare against. Any pricing or gating decision justified by that hypothesis would be unsupported.',
    'Misreading risk: reported as "1 paying customer, ₹899", the situation looks like early traction. It is not.',
  ],

  K_devImpact: [
    'The payments ledger, which is sound and needs no change.',
    'revenue_metrics.sql — where premiumActive counts 1 of 5 plans, understating any future paid cohort (Flaw #13).',
    'A missing distinction: nothing in the schema separates an internal comp from a real customer. That distinction is currently maintained by founder memory alone.',
    'Comp grants write a synthetic order ID directly to paid and never produce a created row, so they silently do not appear as checkout attempts — worth knowing before anyone builds a conversion report on this table.',
  ],

  L_fix: [
    'This flaw is not fixed directly. Ship Flaws #1, #2, #3 and #9.',
    'Add an explicit internal/comp flag to payment records so external revenue is computable without founder memory.',
    'Report externally-generated revenue as the headline figure, with all-time revenue secondary.',
    'Fix premiumActive to count all five plans before any real paid cohort exists, so the first customers are not undercounted from day one.',
  ],

  M_implementation: [
    'The internal/comp distinction should be a column, not a convention. Today it lives in one person\'s knowledge and would be lost the moment the team grows.',
    'Do not change prices. Zero external conversions means there is no evidence price is the binding constraint, and cutting prices before establishing value would forfeit margin without addressing the cause.',
    'Do not restructure plans yet, beyond making them describable — see Flaw #2.',
    'NO PRODUCTION CHANGE IS MADE BY THIS DASHBOARD.',
  ],

  N_successMetric: [
    'PRIMARY: externally-acquired paying customers > 0. Currently 0. This is the single most important number in the entire audit.',
    'SECONDARY: externally-generated revenue > ₹0. Currently ₹0.',
    'SUPPORTING: at least two distinct plans have converted at least once, which would begin to indicate the catalogue is legible.',
    'No revenue target is set. A revenue forecast built on one internally-generated transaction would be fabrication — BASELINE FIRST, TARGET TO BE SET AFTER EXPERIMENT.',
  ],

  O_priority: 'P0',
  P_confidence: 'High — every figure is a direct production count, and the internal/external split is founder-confirmed.',
  Q_source: ['Stage 3 production queries (payments)', 'Founder confirmation (staff comps, internal customer)', 'Final Growth Verification §1, §4, §10, §11', 'Backlog register P1-9, P1-10'],
},

/* ======================================================================== */
{
  id: 9,
  title: 'Unused conversion & recovery mechanisms',
  priority: 'P1',
  category: 'Monetization',
  severity: 'High',
  evidenceStatus: 'CONFIRMED',
  rootCauseStatus: 'CONFIRMED',
  funnelStage: 'Checkout → Payment → Recovery',
  confidence: 'High',
  oneLiner: '11 people accepted a price and did not pay, the oldest 79 days ago — and nothing follows up. A complete coupon and promoter system sits fully built and has never been used once.',

  underlying: [
    { id: 'P1-11', text: 'Zero coupon redemptions in 83 days; no discoverable path to a code', tag: 'PROD + UX' },
    { id: 'P1-12', text: '20 abandoned orders from 11 identifiable people, with no recovery mechanism of any kind', tag: 'PROD' },
  ],

  A_summary: [
    'Two fully-built systems are producing nothing.',
    'The first is checkout recovery, which does not exist. 20 payment orders sit at status "created" from 11 distinct people, spanning 18 Jun to 5 Sep. No cleanup, retry, reminder or follow-up exists. The oldest has been unresolved for 79 days.',
    'The second is the coupon and promoter system, which is complete — including per-promoter revenue tracking — and has been redeemed zero times in 83 days. The walkthrough found why: "Where to get the coupon codes." There is no discoverable path to one.',
    'These 11 people are the highest-intent prospects the business has ever had. A created row is written server-side only after a confirmation dialog showing the plan and the final price, so every one of them accepted a price and then stopped.',
  ],

  B_flaw: [
    'NO RECOVERY: there is no mechanism of any kind for a payment order that is created and never completed. No cleanup job, no retry prompt, no reminder, no support outreach, no tracking of whether recovery ever happens.',
    'NO COUPON PATH: the coupon system works and is server-validated. Nothing in the product tells a user where a code comes from or where to enter it.',
    'NO CROSSOVER ANALYSIS: whether any of the 11 later converted has not been queried. It is knowable and has not been looked at.',
    'NO ABANDONMENT SIGNAL: the created row is the only trace. There is no event marking that a user reached the payment screen and left, so recovery could not be triggered even if a mechanism existed.',
  ],

  C_why: [
    'These are the warmest prospects in the business. Everyone else in the funnel has an unknown level of intent; these 11 demonstrated it by accepting a price.',
    'One of them returned five times across 59 days and never bought — sustained interest against an objection nobody has ever asked about.',
    'The coupon system represents completed engineering work producing zero return. Switching it on is a recruitment problem, not a build.',
  ],

  D_evidence: [
    { tag: 'PROD', text: '20 payment rows at status = created, never completed.' },
    { tag: 'PROD', text: '11 distinct users behind those 20 rows. Attempts per user: 5, 3, 2, 2, 2, 1, 1, 1, 1, 1, 1.' },
    { tag: 'PROD', text: 'First attempt 18 Jun 2026 — four days after the platform\'s first-ever signup. Last attempt 5 Sep 2026, the day of the audit.' },
    { tag: 'PROD', text: 'Oldest unresolved attempt: 79 days.' },
    { tag: 'PROD', text: 'One user returned to checkout 5 times across 59 days without buying. Three users show multi-day repeat patterns (59d, 16d, 13d spans, 10 attempts total).' },
    { tag: 'PROD', text: 'Two users show cross-plan repeats within seconds (12s and 11.7s) — comparison-shopping, not technical failure. See Flaw #2.' },
    { tag: 'PROD', text: 'Six users made a single attempt and never returned.' },
    { tag: 'PROD', text: '0 coupon redemptions across every plan in 83 days.' },
    { tag: 'UX',   text: '"Where to get the coupon codes" — there is no discoverable path to a code inside the product.' },
    { tag: 'CODE', text: 'The coupon system is complete and server-validated, including per-promoter redemption tracking (topPromoters is a live computed field).' },
    { tag: 'CODE', text: 'coupon_applied is tracked; coupon_viewed is not — so it is impossible to distinguish "nobody looks for a code" from "nobody can find where to enter one".' },
  ],

  E_howChecked: [
    'Production SQL (read-only): selected payment rows at status = created with no corresponding paid record, grouped by user and by plan.',
    'Production SQL (read-only): examined created_at timestamps per user to derive the attempt-timing patterns and the 79-day age of the oldest unresolved attempt.',
    'Production SQL (read-only): summed used_coupon across every plan, returning 0.',
    'Source-code inspection: searched for any cleanup job, retry path, reminder or recovery mechanism attached to created payment rows. None exists.',
    'Source-code inspection: read the coupon validation and promoter-tracking implementation to confirm the system is complete and functional.',
    'First-time-user walkthrough: the tester attempted to find a coupon code and could not.',
    'NOT CHECKED: whether any of the 11 later converted. The crossover query has not been run — DATA GAP.',
  ],

  F_numbers: [
    { label: 'Abandoned payment orders',        calc: 'status=created, never completed', value: '20' },
    { label: 'Distinct people behind them',     calc: 'distinct user_id', value: '11' },
    { label: 'Attempts per person',             calc: 'distribution', value: '5, 3, 2, 2, 2, 1, 1, 1, 1, 1, 1' },
    { label: 'Oldest unresolved attempt',       calc: '18 Jun → 5 Sep', value: '79 days' },
    { label: 'Recovery mechanisms in existence', calc: 'code inspection', value: '0' },
    { label: 'Coupon redemptions in 83 days',   calc: 'used_coupon across all plans', value: '0' },
    { label: 'Coupon-attributed revenue',       calc: '0 redemptions', value: '₹0' },
    { label: 'Scenario value of abandoned attempts at list price', calc: '12×₹1,699 + 3×₹1,249 + 3×₹899 + 2×₹399', value: '₹27,630 — SCENARIO ONLY, roughly 31× all-time revenue. This is expressed intent, NOT lost revenue and NOT a forecast.' },
    { label: 'Did any of the 11 later convert?', calc: 'query not run', value: 'DATA NOT AVAILABLE' },
  ],

  G_affected: {
    count: '11 identifiable high-intent people; the entire referral and promoter channel',
    pct: '11 of 682 users (1.6%) reached a price-accepted checkout; 20 of 21 attempts (95.2%) were abandoned with no follow-up',
    stage: 'Checkout → Payment → Recovery',
    note: 'The 11 are individually identifiable in the database. NO USER HAS BEEN OR WILL BE CONTACTED AS PART OF THIS AUDIT. Recovery is described here strictly as a product mechanism to be built.',
  },

  H_rootCause: {
    confirmed: [
      'No recovery mechanism exists. Confirmed by code inspection — there is no cleanup job, no retry, no reminder, no follow-up.',
      'No discoverable path to a coupon code exists in the product. Confirmed by walkthrough.',
      'The coupon infrastructure itself works and is server-validated — this is not a broken feature, it is an unused one.',
      'coupon_viewed is not instrumented, so the two possible causes of zero redemptions cannot be separated.',
    ],
    hypothesis: [
      'That the 11 abandoners had a resolvable objection. Supported by the repeat-attempt patterns — a user returning 5 times across 59 days is not disinterested — but the objection itself is unknown.',
      'That zero redemptions is a distribution problem (no promoters recruited) rather than a discoverability problem (no path to enter a code). Both are likely true simultaneously; neither has been isolated.',
    ],
  },

  I_userImpact: [
    'A user decides to buy, confirms the plan and the price, reaches the payment screen, and stops. Nothing ever asks why, offers help, or reminds them.',
    'A user hears about a discount and cannot find anywhere to enter a code.',
    'A user returns to the checkout screen five times over two months, still unresolved.',
  ],

  J_businessImpact: [
    'Lost conversion, concentrated in the highest-intent segment available.',
    'The entire referral and word-of-mouth channel is inert. For an audience that clusters physically — coaching centres, library reading rooms, town study groups — this is the cheapest acquisition channel there is, and it is switched off.',
    'Lost diagnostic value: the 11 abandoners are the fastest available route to resolving the plan-confusion versus price-resistance question in Flaw #2. Asking them is a business decision for the founder to make, not an audit action.',
  ],

  K_devImpact: [
    'The payments ledger and the lifecycle of created rows, which currently have no terminal handling.',
    'The coupon entry surface — where a user would enter a code, which they cannot find.',
    'The promoter tracking system, which is built and reporting on zero data.',
    'Instrumentation: coupon_viewed, and an explicit checkout-abandoned signal, neither of which exists.',
  ],

  L_fix: [
    'RECOVERY FUNNEL — build it as a measurable sequence: Checkout started → Payment created → Paid → Unrecovered. Today only the first three states exist and the fourth is silent.',
    'Add a recovery mechanism, staged: an in-product reminder for a user who returns, a retry path from an incomplete order, a support or value-clarification touchpoint, and recovery tracking so the mechanism can be judged.',
    'Make the coupon path discoverable: put code entry where a buyer will see it, and explain where codes come from.',
    'Recruit promoters. The tracking is already built — this is a recruitment problem, not an engineering one.',
    'Instrument coupon_viewed so zero redemptions can be diagnosed rather than guessed at.',
    'Run the crossover query: did any of the 11 later convert? It is a single read-only SELECT and it changes how this flaw should be read.',
  ],

  M_implementation: [
    'Order matters: build recovery TRACKING before recovery ACTION, or the first recovery campaign will be unmeasurable.',
    'A created row that is never completed currently has no terminal state. Deciding what that state is — expired, abandoned, superseded — is a prerequisite for any recovery logic.',
    'Coupon discoverability and promoter recruitment are separable and should be measured separately, since they fail for different reasons.',
    'EXPLICIT SCOPE BOUNDARY: this audit does not contact users. The 11 abandoners are identifiable in the database and no outreach of any kind has been performed or is recommended as an audit action. Whether to contact them is the founder\'s decision.',
    'NO PRODUCTION CHANGE IS MADE BY THIS DASHBOARD.',
  ],

  N_successMetric: [
    'PRIMARY: abandoned-checkout recovery rate exists as a measurable metric. It currently cannot be computed because no recovery mechanism exists.',
    'SECONDARY: coupon redemptions > 0. Currently 0 in 83 days.',
    'SUPPORTING: coupon_viewed instrumented, so redemption failure can be attributed to discoverability or to distribution.',
    'SUPPORTING: payment orders older than N days have a defined terminal state rather than sitting at created indefinitely. DEFINITIONAL target.',
    'BASELINE FIRST — TARGET TO BE SET AFTER EXPERIMENT for every rate here.',
  ],

  O_priority: 'P1',
  P_confidence: 'High — the abandonment counts, timings and zero redemptions are direct production measurements, and the absence of a recovery mechanism was confirmed by code inspection.',
  Q_source: ['Stage 3 production queries (payments created rows, timestamps, used_coupon)', 'Stage 2 codebase audit (coupon system, promoter tracking, absence of recovery)', 'First-time-user walkthrough', 'Final Growth Verification §6, §11', 'Backlog register P1-11, P1-12'],
},

/* ======================================================================== */
{
  id: 10,
  title: 'Weak organic discoverability',
  priority: 'P2',
  category: 'Acquisition',
  severity: 'Medium',
  evidenceStatus: 'CONFIRMED',
  rootCauseStatus: 'CONFIRMED',
  funnelStage: 'Discovery',
  confidence: 'High',
  oneLiner: 'Five URLs in the sitemap, zero third-party mentions anywhere, and absent from the category\'s primary search — a genuine weakness, but NOT the current bottleneck.',

  underlying: [
    { id: 'P2-1', text: 'Invisible in search; zero third-party mentions or reviews for the brand', tag: 'EXT + UX' },
    { id: 'P2-2', text: 'Sitemap contains 5 URLs — home plus 4 legal pages', tag: 'EXT' },
    { id: 'P2-3', text: 'Identical title and meta description on every route', tag: 'EXT' },
  ],

  A_summary: [
    'There is almost no organic path to this product. The sitemap lists five URLs: the homepage and four legal pages. The seven products named in the site\'s own structured data have no pages of their own.',
    'A search for "TNPSC group 2 test series" returns Veranda Race first and TNPSC Master second. TNPSC Mentors does not appear. Searching the brand name plus "reviews", "pricing" or "complaint" returns nothing about this site at all.',
    'Every route returns the same title and meta description, because the site is a pure client-rendered SPA with no per-route server output. Any link shared on WhatsApp or Telegram — the two channels this audience actually uses — unfurls as the generic homepage.',
    'IMPORTANT CONTEXT: this is a genuine weakness and it is NOT the immediate bottleneck. Acquisition is growing — 226 signups in July, 396 in August, 366 in the last 30 days. Whatever channels are working are working without organic search.',
  ],

  B_flaw: [
    'FIVE INDEXABLE URLS: home, /privacy, /guidelines, /payment-policy, /refund-policy. Seven distinct product intents compete for one homepage.',
    'NO PER-ROUTE METADATA: identical title and description on every route sampled. Link previews are wrong everywhere.',
    'ZERO THIRD-PARTY FOOTPRINT: no reviews, comparisons, forum threads or citations exist for the brand anywhere. The same searches return rich results for half a dozen competitors.',
    'NOTHING IS SHAREABLE AS ITSELF: a student cannot forward "here is the Group 2 test series" — only "here is the homepage".',
    'The foundation is actually good and unused: clean EducationalOrganization and FAQPage JSON-LD, bilingual inLanguage tags, and a correctly-engineered robots.txt that indexes the marketing site and noindexes the logged-in app. There is simply almost nothing behind it to index.',
  ],

  C_why: [
    'Organic search is the only acquisition channel that compounds without ongoing spend, and it is currently at zero.',
    'It is also the only channel that captures intent at the moment it exists — a student searching "TNPSC previous year questions" is further down the funnel than anyone reached through social.',
    'BUT: it is explicitly NOT the current bottleneck. Acquisition is growing without it. Fixing discovery while conversion sits at 0.00% would deliver more users into a funnel that monetises none of them.',
  ],

  D_evidence: [
    { tag: 'EXT', text: 'curl of /sitemap.xml: 5 URLs total — home + /privacy + /guidelines + /payment-policy + /refund-policy.' },
    { tag: 'EXT', text: 'The site\'s own JSON-LD names 7 distinct products (Group 2, English test, Tamil test, PYQ, PYQ-with-explanation, daily current affairs, general test series). None has its own URL.' },
    { tag: 'EXT', text: 'Identical <title> and meta description confirmed across 4 sampled routes.' },
    { tag: 'EXT', text: 'Web search for the brand name plus "reviews" / "pricing" / "complaint": zero results about this site.' },
    { tag: 'UX',  text: 'Search for "TNPSC group 2 test series": Veranda Race 1st, TNPSC Master 2nd, TNPSC Mentors absent.' },
    { tag: 'EXT', text: '7 competing TNPSC apps rank on these keywords: Testbook, Entri, Nithra, KalviApp, Yukthi, Aram, TNPSC Master.' },
    { tag: 'EXT', text: 'GOOD: robots.txt is correctly engineered — marketing site indexable, logged-in app noindexed. GOOD: clean structured data already in place.' },
    { tag: 'PROD', text: 'COUNTERWEIGHT: acquisition is growing without organic search. 19 (17 days) → 226 → 396 signups by month; 366 in the last 30 days.' },
  ],

  E_howChecked: [
    'External inspection: curl of /sitemap.xml and a direct count of the URLs returned.',
    'External inspection: curl of the title tag and meta description across four routes, compared for uniqueness.',
    'External inspection: read the site\'s JSON-LD structured data and enumerated the products it names.',
    'Search-engine inspection: searched the category\'s primary commercial query and recorded the ranking set.',
    'Search-engine inspection: searched the brand name with review, pricing and complaint modifiers.',
    'External inspection: read robots.txt including its own maintainer comments.',
    'Production SQL (read-only): the monthly signup trend, used here as a counterweight to prevent this flaw being over-prioritised.',
  ],

  F_numbers: [
    { label: 'URLs in sitemap.xml',                  calc: 'direct count', value: '5' },
    { label: 'Products named in the site\'s own structured data', calc: 'JSON-LD', value: '7' },
    { label: 'Products with their own URL',          calc: '5 URLs, 4 of them legal', value: '0' },
    { label: 'Third-party mentions or reviews',      calc: 'web search', value: '0' },
    { label: 'Competing apps ranking on these keywords', calc: 'search results', value: '7' },
    { label: 'Routes with unique title/meta',        calc: '4 sampled', value: '0' },
    { label: 'Organic sessions',                     calc: 'no server-side pageview store; no attribution', value: 'DATA NOT AVAILABLE' },
  ],

  G_affected: {
    count: 'Everyone who searches for this category and does not find this product — unmeasurable',
    pct: 'DATA NOT AVAILABLE — there is no visitor store and no channel attribution',
    stage: 'Discovery',
    note: 'This flaw affects users the product never acquires, which is precisely why it cannot be measured from inside the product. Its size is unknown.',
  },

  H_rootCause: {
    confirmed: [
      'The site is a pure client-rendered SPA with no per-route server output, so no route can carry its own metadata.',
      'No product landing pages exist, so seven keyword intents compete for one homepage.',
      'No third-party citation footprint exists.',
    ],
    hypothesis: [
      'That building product landing pages would produce meaningful organic acquisition. Reasonable — every competitor does it — but unproven for this brand, and the payoff horizon is months.',
      'That improved discoverability is worth doing BEFORE conversion is fixed. This report explicitly argues against that reading: acquisition is already growing and conversion is at zero.',
    ],
  },

  I_userImpact: [
    'A student searching for exactly what this product offers never finds it.',
    'A student who wants to share it can only share a homepage link, which unfurls identically no matter what they meant to send.',
    'A student researching the brand finds no reviews, no comparisons and no third-party discussion, which for a paid product is itself a trust signal.',
  ],

  J_businessImpact: [
    'Lost acquisition of the highest-intent traffic available. UNQUANTIFIED — there is no visitor store and no attribution.',
    'Total dependence on channels that require continuous effort or spend, with no compounding asset accumulating.',
    'Sharing friction inside the audience\'s primary distribution channels, WhatsApp and Telegram.',
    'DELIBERATE COUNTERWEIGHT: acquisition is currently growing. This is a missed opportunity, not an active leak.',
  ],

  K_devImpact: [
    'Rendering architecture — per-route metadata requires SSR, prerendering or static generation for the marketing surface.',
    'Routing and the sitemap generation path.',
    'Content: product landing pages are a content build as much as an engineering one.',
    'The existing JSON-LD is already correct and would attach to new pages without rework.',
  ],

  L_fix: [
    'Ship an indexable landing page for each of the seven products the site\'s own structured data already names.',
    'Add per-route titles and meta descriptions via prerendering or SSR so shared links unfurl correctly.',
    'Add topic and syllabus pages — subject-wise PYQ writeups, per-group syllabus pages, daily current-affairs content — reusing content that is already produced for the app.',
    'SEQUENCING: do this in Phase 5, after conversion and activation. Directing more traffic into a funnel with 0.00% external conversion converts effort into nothing.',
  ],

  M_implementation: [
    'The marketing surface and the app shell have different rendering needs. The app is correctly noindexed already; only the marketing surface requires server-rendered metadata.',
    'Content for the topic pages already exists — daily current affairs and the exam schedules are produced for the app anyway. This is a publishing problem more than a writing one.',
    'Judge this work on organic sessions and ranked queries, never on page count. Page count is an output.',
    'NO PRODUCTION CHANGE IS MADE BY THIS DASHBOARD.',
  ],

  N_successMetric: [
    'PRIMARY: organic sessions, and the number of queries the site ranks for. Both currently DATA NOT AVAILABLE — the measurement must exist before the target can.',
    'SUPPORTING: routes with unique title and meta description. Currently 0 of 4 sampled. DEFINITIONAL target: all of them.',
    'SUPPORTING: indexable product pages. Currently 0 of 7 named products.',
    'BASELINE FIRST — TARGET TO BE SET AFTER EXPERIMENT. SEO outcomes have a 90-day-plus horizon and no responsible target can be set at this stage.',
  ],

  O_priority: 'P2',
  P_confidence: 'High — every finding here was directly observed over public HTTP. The priority assignment is a judgment call, explicitly justified by the confirmed acquisition growth.',
  Q_source: ['Stage 1 external audit (sitemap, metadata, search, competitors, robots.txt, structured data)', 'First-time-user walkthrough (search visibility)', 'Stage 3 production queries (signup trend, used as counterweight)', 'Backlog register P2-1, P2-2, P2-3'],
},

/* ======================================================================== */
{
  id: 11,
  title: 'Poor public product & commercial visibility',
  priority: 'P2',
  category: 'Acquisition',
  severity: 'Medium',
  evidenceStatus: 'CONFIRMED (pricing) · DATA GAP (app stores)',
  rootCauseStatus: 'CONFIRMED',
  funnelStage: 'Discovery → Landing',
  confidence: 'Medium',
  oneLiner: 'The price cannot be seen without signing up, and no app-store listing was found — though absence of a search result is not proof of absence.',

  underlying: [
    { id: 'P2-4', text: 'No public, indexable pricing page — pricing renders only inside the app shell', tag: 'EXT' },
    { id: 'P2-6', text: 'No app-store presence found, despite real IAP product IDs in the codebase', tag: 'EXT + CODE' },
  ],

  A_summary: [
    'A prospective buyer cannot find out what this product costs without creating an account.',
    'Pricing renders only inside the app shell. There is no /pricing route that can rank in search, be forwarded on WhatsApp, or be read by someone deciding whether to sign up at all. Every competitor checked has one.',
    'Separately, no app-store listing was found for "TNPSC Mentors" on either store — while the codebase contains real in-app-purchase product IDs such as com.tnpscmentor.app.premium90, which implies at least store registration.',
    'THESE TWO FINDINGS HAVE DIFFERENT EVIDENCE STRENGTH, and must not be presented as equally certain. The pricing-page absence is CONFIRMED by direct inspection. The app-store absence is UNCONFIRMED — a search did not find a listing, which is not the same as establishing that none exists.',
  ],

  B_flaw: [
    'NO PUBLIC PRICING PAGE (CONFIRMED): pricing is behind the app shell. It cannot rank, cannot be shared, and cannot be evaluated before signup.',
    'NO APP-STORE LISTING FOUND (UNCONFIRMED): searches on both stores returned no listing under the brand name. The codebase contains real IAP product IDs and native Capacitor targets for Android and iOS, including App Tracking Transparency handling and Android 16 edge-to-edge support — genuine mobile engineering that is not visibly converting into installs.',
    'The two compound: a user who cannot find the app in a store and cannot find the price on the web has no way to evaluate the product without committing to an account.',
  ],

  C_why: [
    'Price is a primary qualification signal. Requiring a signup to see it filters out exactly the users who are comparing options — which is most of them.',
    'Every competitor checked has a public pricing page, and TNPSC Master leads its own with "10,000+ students".',
    'App-store search is an acquisition channel every serious competitor already owns. Testbook runs two separate TNPSC apps.',
    'The mobile engineering is already done. If the listing genuinely does not exist, this is unusually high-leverage: publish what has already been built.',
  ],

  D_evidence: [
    { tag: 'EXT',  text: 'CONFIRMED: pricing renders only inside the app shell. No /pricing route appears in the sitemap and none is publicly reachable.' },
    { tag: 'EXT',  text: 'CONFIRMED: /payment-policy and /refund-policy exist publicly, so paid plans are evidently live — but the price itself is not visible anywhere public.' },
    { tag: 'EXT',  text: 'CONFIRMED: TNPSC Master publishes a public pricing page (₹299/3mo, ₹449/6mo, ₹599/12mo) with a proof-of-scale claim on it.' },
    { tag: 'EXT',  text: 'UNCONFIRMED: Google Play and App Store searches for "TNPSC Mentors" / "tnpscmentors" returned no listing. THIS IS A NEGATIVE SEARCH RESULT, NOT A CONFIRMED ABSENCE.' },
    { tag: 'CODE', text: 'The codebase contains real IAP product IDs (com.tnpscmentor.app.premium90 and others) tied to store product identifiers. These only function if the app is at least registered in App Store Connect / Play Console.' },
    { tag: 'CODE', text: 'Proper Capacitor targets for Android and iOS, with App Tracking Transparency and Android 16 edge-to-edge handling implemented. This is real, non-trivial mobile work.' },
    { tag: 'EXT',  text: 'Competitors with app-store presence on these keywords: Testbook (two separate TNPSC apps), Entri, Nithra, KalviApp, Yukthi, Aram.' },
    { tag: 'GAP',  text: 'PENDING FOUNDER ANSWER: is the app published today, under what name, and with what install count? This question has been open since Stage 1 and remains unanswered.' },
  ],

  E_howChecked: [
    'External inspection: attempted to reach a public pricing URL and checked the sitemap for one.',
    'External inspection: confirmed that payment and refund policy pages exist publicly, establishing that paid plans are live.',
    'External inspection: searched Google Play and the App Store for the brand name and domain.',
    'Source-code inspection: located the IAP product catalogue and the native platform configuration.',
    'Competitor inspection: checked competitor pricing pages for public visibility and proof-of-scale claims.',
    'THE APP-STORE QUESTION WAS NOT RESOLVED. It was escalated to the founder in Stage 1 and again in the Final Verification, and no answer has been received. It is recorded as a DATA GAP, not as a finding.',
  ],

  F_numbers: [
    { label: 'Public, indexable pricing pages',       calc: 'sitemap + direct check', value: '0 — CONFIRMED' },
    { label: 'App-store listings found',              calc: 'store search', value: '0 found — UNCONFIRMED ABSENCE' },
    { label: 'IAP product IDs present in the codebase', calc: 'code inspection', value: 'Real store product IDs present' },
    { label: 'Competitors with public pricing',       calc: 'competitor set', value: 'All checked' },
    { label: 'App install count',                     calc: 'no listing located; founder not yet answered', value: 'DATA NOT AVAILABLE' },
  ],

  G_affected: {
    count: 'Every prospective buyer who wants to know the price before registering — unmeasurable',
    pct: 'DATA NOT AVAILABLE',
    stage: 'Discovery → Landing',
    note: 'As with Flaw #10, this affects users the product never acquires and therefore cannot be measured from inside the product.',
  },

  H_rootCause: {
    confirmed: [
      'Pricing is rendered only inside the authenticated app shell. There is no public route for it.',
      'The SPA architecture provides no per-route server output, so even a /pricing route would need prerendering to be indexable.',
    ],
    hypothesis: [
      'That the app is genuinely unpublished. NOT ESTABLISHED. The evidence supports only that a search did not find a listing. The IAP product IDs point the other way.',
      'That a public pricing page would improve conversion or acquisition. Reasonable by competitor analogy; untested here.',
    ],
  },

  I_userImpact: [
    'A user evaluating options cannot compare this product on price without creating an account.',
    'A user who wants to send the price to someone — a parent, a study group — cannot.',
    'A user searching the app stores, where much of this audience discovers study apps, may not find the product at all.',
  ],

  J_businessImpact: [
    'Lost acquisition from price-comparison traffic, which is high-intent by definition. UNQUANTIFIED.',
    'Lost app-store discovery — IF the app is genuinely unlisted. Conditional on an unanswered question.',
    'Real mobile engineering investment producing no visible install channel. Conditional on the same question.',
  ],

  K_devImpact: [
    'A prerendered or server-rendered /pricing route, which the current SPA architecture does not support without a build change.',
    'The IAP product catalogue and native build configuration, which already exist.',
    'Store listing assets — ASO copy, bilingual screenshots — which are a content build, not an engineering one.',
  ],

  L_fix: [
    'Ship a public, prerendered /pricing route that can rank in search and be forwarded.',
    'FIRST: get a direct answer on app-store publication status. This single answer determines whether the store work is "publish the existing build" or "nothing to do".',
    'If unpublished: submit the existing Capacitor build under an exact-match brand name, with keyword-rich descriptions and bilingual screenshots.',
    'If published: the finding changes from "no listing" to "listing not discoverable", which is a different problem with a different fix (ASO), and this flaw should be re-scoped accordingly.',
  ],

  M_implementation: [
    'DO NOT ACT ON THE APP-STORE FINDING UNTIL IT IS CONFIRMED. Building a store-submission plan for an app that is already published would be waste, and stating publicly that the app is absent would be wrong.',
    'The pricing page must be prerendered, not client-rendered, or it will be as invisible as everything else on the domain.',
    'The public pricing page and the plan clarity work in Flaw #2 should ship together — publishing a confusing plan structure more widely does not help.',
    'NO PRODUCTION CHANGE IS MADE BY THIS DASHBOARD.',
  ],

  N_successMetric: [
    'PRIMARY: a public pricing URL exists, is indexed, and unfurls correctly when shared. DEFINITIONAL target.',
    'SUPPORTING: app-store publication status is a known fact rather than an open question. DEFINITIONAL — this is a documentation target, not a growth one.',
    'SUPPORTING: if published, install count becomes a reported metric. Currently DATA NOT AVAILABLE.',
    'BASELINE FIRST — TARGET TO BE SET AFTER EXPERIMENT for any traffic or install outcome.',
  ],

  O_priority: 'P2',
  P_confidence: 'Medium overall — HIGH for the pricing-page absence (directly confirmed), LOW for the app-store absence (a negative search result contradicted by code evidence).',
  Q_source: ['Stage 1 external audit (pricing page, store search, competitor set)', 'Stage 2 codebase audit (IAP product IDs, Capacitor configuration)', 'Final Growth Verification §17 (pending founder answers)', 'Backlog register P2-4, P2-6'],
},

/* ======================================================================== */
{
  id: 12,
  title: 'No acquisition attribution',
  priority: 'P1',
  category: 'Measurement',
  severity: 'High',
  evidenceStatus: 'CONFIRMED',
  rootCauseStatus: 'CONFIRMED',
  funnelStage: 'Discovery → Signup (measurement across all stages)',
  confidence: 'High',
  oneLiner: 'Signups grew from 19 to 226 to 396 a month — and there is no column anywhere in the schema that could say where any of them came from.',

  underlying: [
    { id: 'P2-7', text: 'Zero acquisition attribution — no utm_source, medium, campaign or referrer column exists anywhere in the schema', tag: 'CODE' },
  ],

  A_summary: [
    'The one part of this business that is demonstrably working is acquisition. Signups went 19 in a partial June, 226 in July, 396 in August, and 366 in the last 30 days.',
    'Nobody can say why.',
    'An exhaustive search of the production schema returned no utm_source, utm_medium, utm_campaign, utm_content or referrer column anywhere. Channel performance depends entirely on GA4 and Meta\'s own dashboards, which cannot be joined back to who actually signed up or paid.',
    'This is unrecoverable for every historical period. August\'s 396 signups will never be attributable to a channel.',
  ],

  B_flaw: [
    'NO ATTRIBUTION COLUMNS: utm_source, utm_medium, utm_campaign, utm_content, referrer, landing page, first-touch and last-touch source — none exist.',
    'NO JOIN PATH: even the analytics that do exist (GA4, Meta Pixel) cannot be joined to profiles or payments, so no channel can ever be linked to a signup or a sale.',
    'PERMANENTLY UNRECOVERABLE HISTORY: this data was never captured. It cannot be backfilled, reconstructed or inferred for any past period.',
    'BLOCKS EVERY CHANNEL DECISION: it is impossible to say which channel to do more of, less of, or spend money on.',
  ],

  C_why: [
    'August was the best acquisition month in the platform\'s history — 396 signups, more than double July. Something worked, at some cost, and it cannot be identified or repeated deliberately.',
    'The moment any paid acquisition begins, spend will be unattributable to outcomes. CAC cannot be computed at all.',
    'It also blocks diagnosis: if activation or conversion differs by channel — and it usually does — that variation is currently invisible, which could be masking a channel that already converts.',
  ],

  D_evidence: [
    { tag: 'CODE', text: 'Exhaustive search of the production schema for utm_source, utm_medium, utm_campaign, utm_content and referrer: one non-match. No such column exists anywhere.' },
    { tag: 'CODE', text: 'Confirmed absent from the schema entirely: any events/analytics table, any acquisition-source column, any session-recording linkage.' },
    { tag: 'PROD', text: 'Signups by month: June 19 (17 days), July 226, August 396, September 45 (partial). Every one of these is unattributed.' },
    { tag: 'PROD', text: '366 signups in the last 30 days — source unknown for all 366.' },
    { tag: 'PROD', text: '50 signups in the last 7 days — source unknown for all 50.' },
    { tag: 'CODE', text: 'GA4, GTM and the Meta Pixel are live and firing for approximately 100% of web sessions (the consent banner was removed by product decision). They still cannot be joined to who paid.' },
    { tag: 'CODE', text: 'COMPOUNDING GAP: trackSignUp() has a single call site on the password/OTP path, so Google-created accounts are not even counted as signups in GA4 — see Flaw #13.' },
  ],

  E_howChecked: [
    'Source-code and schema inspection: exhaustive grep across the full supabase/ schema tree for UTM, campaign, source, medium and referrer patterns.',
    'Source-code inspection: enumerated every table in the schema and confirmed no events or analytics table exists.',
    'Source-code inspection: traced the signup path to confirm nothing captures query parameters or document.referrer at registration.',
    'Production SQL (read-only): the monthly and trailing-window signup counts, which establish the scale of what is unattributed.',
  ],

  F_numbers: [
    { label: 'Attribution columns in the schema',        calc: 'exhaustive grep', value: '0' },
    { label: 'Signups with a known source',              calc: '0 / 682', value: '0.00%' },
    { label: 'August signups, unattributed',             calc: '396 / 396', value: '100%' },
    { label: 'Last-30-day signups, unattributed',        calc: '366 / 366', value: '100%' },
    { label: 'Channel-level conversion rates',           calc: 'no channel data exists', value: 'DATA NOT AVAILABLE' },
    { label: 'CAC by channel',                           calc: 'no channel data, no spend data', value: 'DATA NOT AVAILABLE' },
    { label: 'Historical attribution recoverable?',      calc: 'the data was never captured', value: 'NO — permanently unrecoverable' },
  ],

  G_affected: {
    count: 'All 682 signups, and every future signup until this is instrumented',
    pct: '100% of acquisition is unattributed',
    stage: 'Discovery → Signup, with knock-on effects at every downstream stage',
    note: 'This flaw does not harm users at all. It harms every decision the business makes about acquisition.',
  },

  H_rootCause: {
    confirmed: [
      'No acquisition-source column was ever added to the schema. Confirmed by exhaustive search.',
      'The signup path does not read UTM parameters or the referrer.',
      'Third-party analytics cannot be joined to first-party records, because there is no shared key.',
    ],
    hypothesis: [
      'Which channel actually drove August\'s growth. Instagram, YouTube, Telegram, referral, organic and direct are all candidates and NONE can be supported by evidence. This report deliberately makes no guess.',
    ],
  },

  I_userImpact: [
    'None. This is invisible to users.',
  ],

  J_businessImpact: [
    'Every channel decision is currently made blind.',
    'The best acquisition month on record cannot be explained or deliberately repeated.',
    'Paid acquisition cannot be evaluated: CAC, channel ROI and payback are all uncomputable.',
    'Channel-level funnel differences are invisible, which may be hiding a channel that already converts better than the blended 0.00%.',
    'The cost compounds daily: every additional day without capture is another day of permanently unattributable signups.',
  ],

  K_devImpact: [
    'The profiles table and the handle_new_user() trigger path — where first-touch source would need to be persisted.',
    'The signup flow, which must capture UTM parameters and document.referrer before they are lost to navigation.',
    'Client-side storage for first-touch persistence: a source seen on the landing page must survive until registration, which may be several sessions later.',
    'The payments table, so that source travels through to revenue and channel ROI becomes computable.',
  ],

  L_fix: [
    'Capture at first touch: utm_source, utm_medium, utm_campaign, utm_content, document.referrer and the landing page URL.',
    'Persist first-touch AND last-touch separately. They answer different questions and one cannot be derived from the other.',
    'Write both onto the profile at signup, then carry the source through to the payments row, so channel → signup → activation → payment becomes a single joinable path.',
    'Fix the Google-signup tracking gap at the same time (Flaw #13), or a whole authentication method will remain invisible in the channel data.',
    'Accept the historical loss explicitly. Do not attempt to reconstruct past attribution — any such reconstruction would be fabrication.',
  ],

  M_implementation: [
    'First-touch persistence is the part that is easy to get wrong. A user may land from Instagram, leave, and register two days later from a direct visit. Storing only what is visible at registration would attribute that signup to "direct" and be actively misleading.',
    'Capture must happen on the landing surface, before any client-side routing strips the query string.',
    'Carrying source into payments is what makes the whole thing worth doing — attribution that stops at signup cannot answer which channel produces revenue.',
    'This is prospective only. Historical attribution is gone and no estimate of it should ever appear in a report.',
    'NO PRODUCTION CHANGE IS MADE BY THIS DASHBOARD.',
  ],

  N_successMetric: [
    'PRIMARY: 100% of NEW signups carry a first-touch source, medium, campaign, referrer and landing page. Currently 0%. DEFINITIONAL target.',
    'SECONDARY: source is present on the payments row for every new payment, making channel → revenue joinable.',
    'SUPPORTING: a channel-level funnel report exists — signups, activation rate and conversion rate by source.',
    'EXPLICIT NON-TARGET: historical attribution. It is unrecoverable and is not part of this success criterion.',
  ],

  O_priority: 'P1',
  P_confidence: 'High — the absence was confirmed by exhaustive schema search, and the acquisition figures it fails to explain are direct production counts.',
  Q_source: ['Stage 2 codebase audit (exhaustive schema search)', 'Stage 3 production queries (signup trend)', 'Latest acquisition verification (monthly and trailing-window signups)', 'Final Growth Verification §3, §17', 'Backlog register P2-7. PRIORITY NOTE: Stage 2 ranked this P1; the Final Verification ranked it P2. It is assigned P1 here because acquisition is now confirmed to be growing, which raises the cost of not knowing the source. The disagreement is disclosed rather than silently resolved.'],
},

/* ======================================================================== */
{
  id: 13,
  title: 'Incomplete product analytics & event tracking',
  priority: 'P1',
  category: 'Measurement',
  severity: 'High',
  evidenceStatus: 'CONFIRMED',
  rootCauseStatus: 'CONFIRMED',
  funnelStage: 'All stages (measurement layer)',
  confidence: 'High',
  oneLiner: 'The funnel has no top, no pricing-view denominator, no abandonment signal from any paid format, and a signup event that misses everyone who uses Google.',

  underlying: [
    { id: 'P2-8',  text: 'Paid test formats cannot log abandonment — record_abandoned_test is wired only to the free practice engine', tag: 'CODE' },
    { id: 'P2-9',  text: 'Google signups are not tracked as signups', tag: 'CODE' },
    { id: 'P2-10', text: 'premiumActive counts 1 of 5 plans', tag: 'CODE' },
    { id: 'P2-12', text: 'The active-user definition covers only test submission and current-affairs completion', tag: 'CODE' },
    { id: 'V-3',   text: 'Pricing views are not instrumented, so the checkout stage has no denominator', tag: 'CODE' },
    { id: 'V-4',   text: 'No server-side visitor or pageview store exists — the funnel has no top', tag: 'CODE' },
  ],

  A_summary: [
    'Several of the most important questions in this audit are unanswerable, and this flaw is why.',
    'How many people saw a pricing screen? Unknown — it is not instrumented. Do paying customers finish what they bought? Unknown — paid formats cannot log abandonment. How many people signed up? Undercounted — the signup event fires on only one of two authentication paths. How many paying customers does the founder\'s own dashboard show? One fifth of them.',
    'Individually these are small defects. Together they mean the funnel cannot be measured end to end, and several conclusions in this report have to be labelled hypothesis when better instrumentation would have made them fact.',
  ],

  B_flaw: [
    'NO PRICING-VIEW EVENT: trackViewContent fires on the Register page and the /rank-booster landing page, and is NOT confirmed to fire from the in-app PricingCards screen. The checkout stage of the funnel therefore has no denominator.',
    'NO PAID-FORMAT ABANDONMENT: record_abandoned_test has one call site, on the free practice engine. Mock, Vettri, Rank Booster and Test Series have no exit button and no abandon call. A quit inside content someone PAID for leaves zero trace. The reported 161 abandonments cover the free engine only.',
    'GOOGLE SIGNUPS INVISIBLE: trackSignUp() has a single call site on the password/OTP path. A Google-created account fires only trackLogin("google") and is indistinguishable from a returning user.',
    'premiumActive COUNTS 1 OF 5 PLANS: revenue_metrics.sql filters plan = premium_annual only. Vettri, Rank Booster and Mock Pack customers do not appear in the founder\'s headline paid figure.',
    'NARROW ACTIVE DEFINITION: daily_activity is written only by test submission and current-affairs completion. Reading, browsing and revision do not count, so every retention figure is a floor.',
    'NO VISITOR STORE: there is no server-side pageview log. The funnel has no top and never has had.',
    'NO PLAN LIFECYCLE EVENTS: expiry is computed on read via bundleAccess() and never written. Renewal and churn are unmeasurable.',
  ],

  C_why: [
    'Measurement gates every other fix in this report. Without a pricing-view event, the Phase 1 conversion work is unfalsifiable — there will be no way to tell whether it worked.',
    'Two of the most consequential conclusions in this audit — that value perception drives non-conversion, and that plan confusion suppresses it — remain hypotheses specifically because the instrumentation to test them does not exist.',
    'The defects also mislead. A founder reading premiumActive sees one fifth of their paying customers. Today that is masked by there being almost none; it becomes actively harmful the moment conversion moves.',
  ],

  D_evidence: [
    { tag: 'CODE', text: 'trackViewContent call sites: Register page load and the /rank-booster landing page. NOT confirmed on the in-app PricingCards screen.' },
    { tag: 'CODE', text: 'record_abandoned_test has exactly one client call site — an Exit→Discard / Back-confirm flow that exists only on the free practice engine (/quiz). MockQuizPage has no exit button and no abandon call.' },
    { tag: 'CODE', text: 'trackSignUp() has exactly one call site, in the password/WhatsApp-OTP path. Google-created accounts fire only trackLogin("google").' },
    { tag: 'CODE', text: "revenue_metrics.sql filters notes->>'plan' = 'premium_annual' for premiumActive, while payingCustomers and paidOrders nearby include all plans." },
    { tag: 'CODE', text: 'daily_activity has exactly two writers: test submission and current-affairs question completion.' },
    { tag: 'CODE', text: 'No subscription_renewed, subscription_expired or subscription_cancelled event exists anywhere. Plan expiry is computed on read.' },
    { tag: 'CODE', text: 'No server-side pageview store exists. Visitor data lives only in GA4/GTM, which cannot be joined to first-party records.' },
    { tag: 'PROD', text: 'CONSEQUENCE: 161 reported abandonments cover only the free practice engine. The true figure across all formats is unknown.' },
    { tag: 'PROD', text: 'CONSEQUENCE: the checkout stage of the funnel cannot be expressed as a conversion rate, because the stage above it does not exist as data.' },
    { tag: 'CODE', text: 'GOOD, FOR CONTRAST: page_view, login, start_test, submit_test, view_result, checkout_started, payment_success/failed and purchase all fire from single, correct choke-points. The instrumentation that exists is well built. It is incomplete, not sloppy.' },
  ],

  E_howChecked: [
    'Source-code inspection: enumerated every call site of trackSignUp, trackViewContent, trackInitiateCheckout and record_abandoned_test across the full src/ and server/ trees.',
    'Source-code inspection: read revenue_metrics.sql and get_platform_metrics() to establish exactly how each dashboard figure is computed.',
    'Source-code inspection: traced every writer of daily_activity to establish the operative definition of "active".',
    'Source-code inspection: searched for subscription lifecycle events and for any server-side pageview store. Neither exists.',
    'Timezone validation against production: active-today and active-7d were recomputed under both UTC and IST and returned identical values, which downgraded the Stage 2 timezone finding from P0 to P3.',
    'Cross-check: every measurement claim in this report was traced back to the query or code path that produces it, which is how these gaps were found.',
  ],

  F_numbers: [
    { label: 'Funnel stages with no data at all',      calc: 'visitors, pricing views', value: '2' },
    { label: 'Paid formats able to log abandonment',   calc: 'Mock, Vettri, Rank Booster, Test Series', value: '0 of 4' },
    { label: 'Authentication paths firing a signup event', calc: 'password/OTP yes, Google no', value: '1 of 2' },
    { label: 'Plans counted by premiumActive',         calc: 'premium_annual only', value: '1 of 5' },
    { label: 'Events writing daily_activity',          calc: 'test submission, CA completion', value: '2' },
    { label: 'Subscription lifecycle events',          calc: 'code search', value: '0' },
    { label: 'Reported abandonments, and their true scope', calc: '161 rows, free engine only', value: '161 — a lower bound on one engine, not a rate' },
    { label: 'Checkout conversion rate from pricing views', calc: 'no denominator exists', value: 'DATA NOT AVAILABLE' },
  ],

  G_affected: {
    count: 'Every metric in this report, and every developer or founder who reads one',
    pct: '100% of decision-making is affected to some degree',
    stage: 'All stages — this is the measurement layer',
    note: 'No user is harmed by this flaw. Every decision is.',
  },

  H_rootCause: {
    confirmed: [
      'Abandonment tracking was built once, for one engine, and never extended to the paid formats.',
      'The signup event was wired to one authentication path and not updated when Google sign-in was added.',
      'premiumActive was written when there was one plan and not widened when there were five.',
      'daily_activity was defined around test submission and never broadened.',
      'Pricing-view and visitor instrumentation were never built.',
    ],
    hypothesis: [
      'None required. Every item in this flaw was read directly in source code.',
    ],
  },

  I_userImpact: [
    'None directly. Users are unaffected by measurement gaps.',
    'Indirectly: every product decision made on incomplete data eventually reaches users as a worse product.',
  ],

  J_businessImpact: [
    'Phase 1 conversion work cannot currently be evaluated. That is the most urgent consequence.',
    'Two central hypotheses in this audit remain untestable.',
    'The founder\'s own paid-customer figure understates reality by up to 80% of plans.',
    'Abandonment inside paid content — arguably the single most important quality signal a paid product has — is completely invisible.',
    'Renewal and churn will be unmeasurable for the first paying cohort, whenever it exists.',
  ],

  K_devImpact: [
    'authStore.ts — one added trackSignUp() call on the Google path. Trivial.',
    'PricingCards and the individual plan cards — a pricing_viewed event and per-card view/click events.',
    'MockQuizPage.tsx — an abandon/heartbeat beacon mirroring the practice engine. This is the largest item in the flaw.',
    'revenue_metrics.sql — widen the premiumActive filter or replace it with a per-plan breakdown.',
    'daily_activity writers — broaden the definition of active, deliberately and with re-baselining.',
    'Plan lifecycle: write expiry and renewal as events rather than computing them on read.',
    'A server-side pageview log, if top-of-funnel volume is ever to be known.',
  ],

  L_fix: [
    'ORDER BY DEPENDENCY, NOT BY EFFORT. Ship pricing_viewed FIRST — it gates the evaluation of all of Phase 1.',
    'Add trackSignUp() to the Google path so signup counts are complete.',
    'Extend abandon tracking to Mock, Vettri, Rank Booster and Test Series, mirroring the existing practice-engine pattern.',
    'Widen premiumActive to all five plans, or replace it with a per-plan breakdown.',
    'Broaden the active-user definition, and re-baseline retention against both definitions during the transition.',
    'Write subscription lifecycle events so the first paying cohort is measurable from day one.',
    'Add a privacy-safe first-party server-side pageview count so the funnel finally has a top.',
  ],

  M_implementation: [
    'The existing instrumentation is well built — single, correct choke-points for each event. New events should follow the same pattern rather than introducing a second analytics path.',
    'Broadening the active definition will raise retention numbers with no product improvement at all. Report both definitions in parallel for at least one full cycle or the change becomes indistinguishable from progress.',
    'The paid-format abandon beacon is the only item here that is more than trivial, because those screens currently have no exit affordance to hang it on.',
    'NO PRODUCTION CHANGE IS MADE BY THIS DASHBOARD.',
  ],

  N_successMetric: [
    'PRIMARY: the funnel is measurable end to end — every stage has both a numerator and a denominator. DEFINITIONAL target.',
    'pricing_viewed fires from PricingCards, giving the checkout stage a denominator.',
    'Paid formats logging abandonment: 4 of 4, currently 0 of 4. DEFINITIONAL.',
    'Authentication paths firing a signup event: 2 of 2, currently 1 of 2. DEFINITIONAL.',
    'Plans counted by premiumActive: 5 of 5, currently 1 of 5. DEFINITIONAL.',
    'Subscription lifecycle events exist. DEFINITIONAL.',
    'These are all correctness targets with obviously correct values, which is why they are stated as numbers rather than as BASELINE FIRST.',
  ],

  O_priority: 'P1',
  P_confidence: 'High — every item was read directly in source code, and several were confirmed against production behaviour.',
  Q_source: ['Stage 2 codebase audit (exhaustive call-site enumeration, revenue_metrics.sql, get_platform_metrics())', 'Stage 3 production queries (timezone validation, abandonment scope)', 'Final Growth Verification §9, §12', 'Backlog register P2-8, P2-9, P2-10, P2-12'],
},

/* ======================================================================== */
{
  id: 14,
  title: 'Weak customer feedback & behavioural intelligence',
  priority: 'P2',
  category: 'Measurement',
  severity: 'Medium',
  evidenceStatus: 'CONFIRMED',
  rootCauseStatus: 'CONFIRMED',
  funnelStage: 'Post-activation (voice of customer)',
  confidence: 'High',
  oneLiner: 'Six star ratings from 682 users, averaging 4.33 — and not one word of written feedback. There is no qualitative user data in the entire system.',

  underlying: [
    { id: 'P2-11', text: 'The feedback prompt is deliberately buried: once, home screen only, after 2 completed tests, non-admins only, then suppressed 3 months', tag: 'CODE + PROD' },
    { id: 'V-5',   text: 'Microsoft Clarity behavioural data was inaccessible across all three audit stages', tag: 'GAP' },
    { id: 'V-6',   text: 'Zero written feedback — all six responses are ratings only', tag: 'PROD' },
  ],

  A_summary: [
    '682 users have produced 6 pieces of feedback. All six are star ratings: 5, 4, 5, 5, 2, 5 — an average of 4.33.',
    'None of them contains any written text. The system holds zero words of user opinion.',
    'A 4.33 average from six responses is not actionable. It identifies no feature, no friction, and no reason anyone did not upgrade. It is a number that feels like information and is not.',
    'The other behavioural channel, Microsoft Clarity, was inaccessible at every stage of this audit — so scroll depth, rage clicks, dead clicks, quick-backs, form abandonment and device split are all unknown too.',
    'The result is that the most important question in this audit — why do users not pay — has been answered entirely by inference, plus a walkthrough of n = 1.',
  ],

  B_flaw: [
    'THE PROMPT IS BURIED BY DESIGN: it appears once, only on the home screen, only after 2 completed tests, only for non-admins, and is then suppressed for 3 months per user — enforced both client and server side. Every one of those conditions is deliberate, and together they produce 6 responses from 682 users.',
    'RATINGS WITHOUT REASONS: the instrument collects a score and nothing else. A 2-star rating exists and nobody knows why.',
    'NO EXIT OR OBJECTION CAPTURE: nothing asks a user who abandoned a checkout, never started a test, or never returned what stopped them. These are the three largest populations in the funnel and none of them is ever asked anything.',
    'NO BEHAVIOURAL DATA: Clarity is loaded as a GTM container tag rather than called from the codebase, so even its firing rules live outside the repository and could not be audited from source.',
  ],

  C_why: [
    'Every major conclusion in this audit is inferential. Six ratings and zero words is why.',
    'The competing hypotheses in Flaw #2 — plan confusion versus price resistance — fit the data equally well and could be separated by asking roughly ten people a single question. That capability does not exist.',
    'Feedback is also the cheapest available source of social proof, which Flaw #1 identifies as entirely absent. A real ratings volume would supply it honestly.',
  ],

  D_evidence: [
    { tag: 'PROD', text: '6 feedback records from 682 users — a 0.88% response rate.' },
    { tag: 'PROD', text: 'Ratings: 5, 4, 5, 5, 2, 5. Distribution: four 5-star, one 4-star, one 2-star, no 3-star, no 1-star.' },
    { tag: 'PROD', text: 'Average: (5 + 4 + 5 + 5 + 2 + 5) / 6 = 26 / 6 = 4.33.' },
    { tag: 'PROD', text: 'Written feedback: 0. Not one response carries text.' },
    { tag: 'CODE', text: 'FeedbackModal is the only entry point. It appears once, on the home screen only, after 2 completed tests, for non-admins only, then is suppressed for 3 months per user — enforced client AND server side.' },
    { tag: 'CODE', text: 'A gating condition of "after 2 completed tests" excludes 396 of 682 users from ever seeing the prompt, since only 286 have completed even one test.' },
    { tag: 'GAP',  text: 'Microsoft Clarity: no access at any point across Stages 1, 2 or 3. No behavioural inference anywhere in this report is drawn from Clarity.' },
    { tag: 'UX',   text: 'The walkthrough is a substitute of n = 1, conducted by a non-aspirant. It is strong evidence that a friction exists and no evidence at all about how common it is.' },
  ],

  E_howChecked: [
    'Production SQL (read-only): counted app_feedback rows, read the rating values, and checked the text column for content.',
    'Arithmetic, shown in full: 26 / 6 = 4.33.',
    'Source-code inspection: read FeedbackModal and its gating conditions on both the client and the server.',
    'Cross-reference: compared the "after 2 completed tests" gate against the production figure of 286 completers, establishing that 396 users can never have seen the prompt.',
    'Clarity access was attempted in every stage and was unavailable each time. It is recorded as a gap, not worked around.',
  ],

  F_numbers: [
    { label: 'Feedback responses',            calc: 'app_feedback', value: '6' },
    { label: 'Response rate',                 calc: '6 / 682', value: '0.88%' },
    { label: 'Ratings received',              calc: 'raw values', value: '5, 4, 5, 5, 2, 5' },
    { label: 'Average rating',                calc: '26 / 6', value: '4.33 — n = 6, not statistically meaningful' },
    { label: 'Rating distribution',           calc: 'counts', value: '5★ ×4 · 4★ ×1 · 3★ ×0 · 2★ ×1 · 1★ ×0' },
    { label: 'Responses with written text',   calc: '0 / 6', value: '0' },
    { label: 'Users excluded by the 2-test gate', calc: '682 − 286 completers', value: '396 users can never have seen the prompt' },
    { label: 'Clarity behavioural data',      calc: 'no access in any stage', value: 'DATA NOT AVAILABLE' },
  ],

  G_affected: {
    count: '676 of 682 users have never given feedback; 682 of 682 have never given written feedback',
    pct: '99.12% have given no feedback at all (676 / 682); 100% have given no written feedback',
    stage: 'Post-activation — and, critically, NOT the abandonment stages, which are never asked anything',
    note: 'The populations whose opinions would be most valuable — the 337 who never started, the 270 who never returned, and the 11 who abandoned checkout — are structurally excluded from the current instrument. The 2-test gate alone excludes 396 users.',
  },

  H_rootCause: {
    confirmed: [
      'The prompt\'s gating conditions are deliberate and are each confirmed in code: once only, home screen only, after 2 completed tests, non-admins only, 3-month suppression.',
      'The instrument collects a rating and no free text.',
      'No exit-intent, objection or abandonment survey exists anywhere.',
      'Clarity was inaccessible throughout, so no behavioural data supplements the ratings.',
    ],
    hypothesis: [
      'That relaxing the gating would produce meaningfully more responses. Very likely, but untested — and volume alone is not the goal.',
      'That the 2-star rating reflects a specific, fixable problem. Unknowable. There is no text.',
    ],
  },

  I_userImpact: [
    'A user who has a problem has no easy way to say so.',
    'A user who abandons a checkout, or never comes back, is never asked why — so their objection is never resolved for them or for anyone after them.',
    'A user who loves the product is asked for a score and not for the reason, so their enthusiasm cannot become social proof for anyone else.',
  ],

  J_businessImpact: [
    'The most consequential questions in this audit are answered by inference rather than by evidence.',
    'The plan-confusion versus price-resistance question in Flaw #2 stays unresolved for want of roughly ten conversations.',
    'The cheapest honest source of social proof — real ratings at real volume — does not exist, which feeds directly back into Flaw #1.',
    'Product decisions are being made without any qualitative signal whatsoever.',
  ],

  K_devImpact: [
    'FeedbackModal and its gating conditions, on both the client and the server.',
    'The app_feedback schema, which needs to accommodate free-text responses alongside the rating.',
    'New prompt surfaces at the moments that matter: post-abandonment, post-inactivity, and post-cancellation.',
    'Clarity access is an operational task, not an engineering one — but the fact that Clarity is configured entirely in GTM means its firing rules are not reviewable from the repository at all.',
  ],

  L_fix: [
    'Redesign the instrument to collect reasons, not only scores: a rating, plus "What did you like?", plus "What should we improve?".',
    'Add a targeted question where the answer matters most: "Why didn\'t you upgrade?" — asked, appropriately, of users who reached pricing or abandoned a checkout.',
    'Relax the gating so the populations that matter can be reached. The 2-test gate alone excludes 396 users, including everyone who never activated.',
    'Add prompts at the abandonment moments: never started, never returned, checkout abandoned.',
    'Obtain Clarity access and audit its GTM firing rules, which are currently outside the repository and unreviewable.',
    'Use the resulting ratings volume as honest social proof on the pricing surfaces (Flaw #1), stated with its n.',
  ],

  M_implementation: [
    'Volume is not the objective. Six responses with reasons would be worth more than six hundred bare scores.',
    'Relax the gating carefully — the current design is over-tuned, but the opposite failure (prompting constantly) would compound the popup-overload problem in Flaw #4. One prompt, at a moment the user has a reason to answer.',
    'Free text needs a moderation and reading path, or it will accumulate unread.',
    'Any social proof drawn from ratings must state the n honestly. "4.33 from 6 responses" is credible; "rated 4.33" implies a volume that does not exist.',
    'NO PRODUCTION CHANGE IS MADE BY THIS DASHBOARD. NO USER WAS OR WILL BE CONTACTED AS PART OF THIS AUDIT.',
  ],

  N_successMetric: [
    'PRIMARY: feedback responses carrying written text > 0. Currently 0. DEFINITIONAL target — the system currently contains zero words of user opinion.',
    'SECONDARY: at least one specific, named product problem is identified from user text rather than from inference.',
    'SUPPORTING: response rate, currently 0.88% (6 / 682). BASELINE FIRST — TARGET TO BE SET AFTER EXPERIMENT, and explicitly secondary to text capture.',
    'SUPPORTING: the abandonment populations (never started, never returned, checkout abandoned) are reachable by a prompt at all. Currently none of them is.',
    'SUPPORTING: Clarity access exists and its firing rules have been audited. DEFINITIONAL.',
  ],

  O_priority: 'P2',
  P_confidence: 'High — the counts, the ratings, the absence of text and the gating conditions were each observed directly.',
  Q_source: ['Stage 3 production queries (app_feedback)', 'Latest feedback verification (individual rating values)', 'Stage 2 codebase audit (FeedbackModal gating, client and server)', 'Final Growth Verification §8, §18', 'Backlog register P2-11'],
},

];
