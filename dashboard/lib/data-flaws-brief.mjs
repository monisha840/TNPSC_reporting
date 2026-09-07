/*
 * Compact executive briefs — the default visible view for each flaw.
 *
 * THIS FILE ADDS NO FACTS. Every sentence, number, quotation and status below is
 * condensed from the existing A–Q audit content in `data-flaws-1.mjs` and
 * `data-flaws-2.mjs`, which remain untouched and are rendered in full under
 * "View technical details". Nothing here overrides priority, confidence,
 * evidence status or root-cause status — those are read from the flaw itself.
 *
 * Caps, per the presentation spec: problem ≤ 3 sentences · evidence ≤ 4 ·
 * why ≤ 2 · confirmed ≤ 3 · hypothesis ≤ 2 · metrics ≤ 4 · checked ≤ 4.
 */

export default {

  1: {
    problem: [
      'The product asks for money before it has shown anyone why the money is worth spending.',
      'Revision and Insights — the screens that actually persuade — are reached late, by accident, and by almost nobody.',
      'Meanwhile a premium prompt appears in essentially every section, from the first session onward.',
    ],
    evidence: [
      { tag: 'PROD', text: '366 signups in the last 30 days → 0 new paying customers.' },
      { tag: 'PROD', text: '11 people reached a price-accepted checkout; 1 paid, and that one was founder-generated.' },
      { tag: 'UX', text: 'Tester completed two full tests and felt no urge to pay — then found Revision/Insights by wandering and said "I feel good".' },
      { tag: 'CODE', text: 'LandingPage.tsx and PricingCards.tsx contain 0 testimonials, ratings or user-count proof.' },
    ],
    why: [
      'Users are asked to buy before meeting the product’s strongest value.',
      'Acquisition is growing, so every extra user feeds a conversion experience that has converted nobody externally.',
    ],
    confirmed: [
      'Nothing in the product routes a new user to Revision or Insights.',
      'Premium prompts fire without any purchase-intent or engagement gating.',
      'No social proof exists on the landing or pricing surfaces.',
    ],
    hypothesis: [
      'Weak value communication is the binding constraint on conversion — rests on a walkthrough of n = 1.',
      'Reaching Revision/Insights earlier would raise conversion — entirely untested.',
    ],
    metrics: [
      { label: 'Recent signup → paid', value: '366 → 0', sub: '0.00%' },
      { label: 'Checkout users → paid', value: '11 → 1', sub: '9.1% · founder-generated' },
      { label: 'Externally acquired', value: '0', sub: '0.00% of 682' },
      { label: 'Revenue', value: '₹899', sub: 'all-time' },
    ],
    checked: [
      { tag: 'PROD', text: 'Read-only SQL on profiles and payments.' },
      { tag: 'CODE', text: 'Grepped LandingPage.tsx and PricingCards.tsx for trust signals.' },
      { tag: 'UX', text: 'First-time-user walkthrough on a real device.' },
      { tag: 'EXT', text: 'Competitor pricing-page comparison.' },
    ],
    sources: ['Stage 1 External Audit', 'Stage 2 Code Audit', 'Stage 3 Production Audit', 'UX Walkthrough'],
  },

  2: {
    problem: [
      'There are five paid price points and the entitlement rules behind them genuinely overlap.',
      'Premium includes Rank Booster; Vettri does not; the ₹399 Mock Pack unlocks no test bank at all.',
      'None of this is stated where a buyer would look.',
    ],
    evidence: [
      { tag: 'UX', text: '"I can’t differentiate what each plan does."' },
      { tag: 'PROD', text: 'One user opened two plans’ checkouts 12 seconds apart — comparison-shopping at the payment window.' },
      { tag: 'PROD', text: 'premium_annual draws 12 of 21 attempts (57%) and has converted 0 times.' },
      { tag: 'CODE', text: 'Entitlement rules confirm Premium ⊇ Rank Booster, Vettri ⊉ Rank Booster, Mock Pack unlocks neither.' },
    ],
    why: [
      'Confusion sits at the last controllable step before money changes hands.',
      'The most-wanted plan is also the highest-priced, and it has never sold.',
    ],
    confirmed: [
      'The entitlement overlap is real, not merely badly explained — it was read in the access-control code.',
      'No comparison surface states what each plan includes relative to the others.',
      'No default or recommended plan is presented.',
    ],
    hypothesis: [
      'Plan confusion is what suppresses conversion — supported by the walkthrough and the 12-second checkout, not proven.',
      'Competing explanation: price resistance at ₹1,699. Both fit the data equally well; neither is chosen.',
    ],
    metrics: [
      { label: 'premium_annual', value: '12 → 0', sub: '0% conversion' },
      { label: 'Share of purchase intent', value: '57%', sub: '12 of 21 attempts' },
      { label: 'Checkout attempts → paid', value: '21 → 1', sub: '4.8%' },
      { label: 'Shortest cross-plan span', value: '12 sec', sub: 'same user, two plans' },
    ],
    checked: [
      { tag: 'PROD', text: 'Payments grouped by plan key and by created_at timestamp.' },
      { tag: 'CODE', text: 'Read pricing constants and the entitlement / bundle-access logic.' },
      { tag: 'CODE', text: 'Located VettriSuggestModal and read its trigger conditions.' },
      { tag: 'UX', text: 'Tester asked to choose a plan and state the difference between them.' },
    ],
    sources: ['Stage 2 Code Audit', 'Stage 3 Production Audit', 'UX Walkthrough', 'Final Growth Verification'],
  },

  3: {
    problem: [
      'The /rank-booster page — the code’s own Meta ad landing target — advertises an "Independence Day offer valid till 31 Aug 2026".',
      'It was confirmed still live on 5 Sep, five days after expiry.',
      'The discounted price is a hand-maintained constant with no expiry check.',
    ],
    evidence: [
      { tag: 'CODE', text: '/rank-booster advertises ₹1,249 from an ₹1,800 MRP as an offer valid till 31 Aug 2026.' },
      { tag: 'CODE', text: 'The pricing source states in its own comment that the price does not auto-revert.' },
      { tag: 'UX', text: 'Confirmed still visible on 5 Sep 2026.' },
      { tag: 'CODE', text: 'The same page is identified in code as the Meta ad landing target.' },
    ],
    why: [
      'A visibly expired deadline signals an unmaintained page at the exact moment a user is asked for ₹1,249.',
      'It sits on the one page built specifically to convert paid traffic.',
    ],
    confirmed: [
      'The promotional price and its deadline are hand-maintained constants with no expiry logic.',
      'No centralised promotional-expiry mechanism exists, so every future offer can fail the same way.',
      'The deadline shown to users is static copy, not derived from any date comparison.',
    ],
    hypothesis: [
      'That the stale offer measurably suppressed Rank Booster conversion — 3 attempts and 0 conversions cannot support that claim. The trust argument stands without it.',
    ],
    metrics: [
      { label: 'Offer expired', value: '31 Aug 2026' },
      { label: 'Still live on', value: '5 Sep 2026', sub: '5 days past expiry' },
      { label: 'Automated expiry checks', value: '0' },
      { label: 'Traffic exposed', value: 'DATA NOT AVAILABLE', sub: 'no pageview store' },
    ],
    checked: [
      { tag: 'CODE', text: 'Read the /rank-booster component and the server-side pricing constants.' },
      { tag: 'UX', text: 'Loaded the live page on 5 Sep 2026.' },
      { tag: 'PROD', text: 'Pulled rank_booster_g2 checkout attempts for context.' },
      { tag: 'DERIVED', text: 'Compared the stated deadline against the audit date.' },
    ],
    sources: ['Stage 2 Code Audit', 'UX Walkthrough', 'Backlog Register P0-3'],
  },

  4: {
    problem: [
      'A new user lands with no orientation, meets up to five modals competing on entry, and is 3–4 taps from the only action that delivers value.',
      'Signup itself is confirmed working — this is what happens immediately after it.',
    ],
    evidence: [
      { tag: 'UX', text: '"When entered the application, I don’t know what is so necessary and what should I do now."' },
      { tag: 'UX', text: '"felt like there is too many pop up when entering the app."' },
      { tag: 'CODE', text: 'Five modals can fire on entry: onboarding tour, starter-test prompt, push primer, marathon alert, update prompt.' },
      { tag: 'PROD', text: '337 of 682 registered users (49.4%) never start a test — the outcome this stage feeds.' },
    ],
    why: [
      'These users are already acquired — the acquisition cost is paid and none of the value is collected.',
      'A user gets exactly one first session, and this is it.',
    ],
    confirmed: [
      'Five modals can compete on app entry.',
      '3–4 taps separate entry from a started test.',
      'Signup is NOT the cause — verified working by both the walkthrough and the founder.',
    ],
    hypothesis: [
      'Popup overload and tap count cause the 337 loss — the loss is fact, this attribution is not.',
      'One question then one action would materially move activation — plausible, cheap, untested.',
    ],
    metrics: [
      { label: 'Modals on entry', value: '5' },
      { label: 'Taps to first test', value: '3–4' },
      { label: 'Never started a test', value: '337 / 682', sub: '49.4%' },
      { label: 'Onboarding completion', value: 'DATA NOT AVAILABLE', sub: 'not instrumented' },
    ],
    checked: [
      { tag: 'UX', text: 'First-time-user walkthrough on a real device with a fresh account.' },
      { tag: 'UX', text: 'Tap count between app entry and a started test measured directly.' },
      { tag: 'CODE', text: 'Read every entry modal’s trigger conditions to confirm they can co-occur.' },
      { tag: 'PROD', text: 'Distinct users in test_sessions against the profiles count.' },
    ],
    sources: ['Stage 2 Code Audit', 'Stage 3 Production Audit', 'UX Walkthrough'],
  },

  5: {
    problem: [
      'Half of everyone who registers never uses the product: 682 signed up, 345 started a test, 337 did not.',
      'Of those who do start, 82.9% finish — so the failure is entirely at the moment of starting.',
      'Nothing follows up with a user who signs up and stops.',
    ],
    evidence: [
      { tag: 'PROD', text: '345 of 682 users have at least one row in test_sessions — 50.6%.' },
      { tag: 'PROD', text: '337 users have none — 49.4%, the largest absolute loss in the funnel.' },
      { tag: 'PROD', text: '286 completed at least one test — 82.9% of the 345 who started.' },
      { tag: 'CODE', text: 'No activation event, no time-to-first-test measurement and no re-engagement mechanism exists.' },
    ],
    why: [
      'Activation gates everything downstream — these 337 can never return, convert or be retained.',
      '366 signups in the last 30 days means the loss keeps compounding.',
    ],
    confirmed: [
      '337 registered users never started a test — two counts from two tables, no interpretation required.',
      'Signup is not the cause; it is verified working.',
      'No activation measurement or re-engagement path exists.',
    ],
    hypothesis: [
      'First-run experience (Flaw #4) is the primary cause — consistent with the evidence, not isolated.',
      'Some of the 337 are simply very recent signups — 53.7% of the base is under 30 days old, and this confound is unquantified.',
    ],
    metrics: [
      { label: 'Never started a test', value: '337 / 682', sub: '49.4%' },
      { label: 'Started ≥1 test', value: '345 / 682', sub: '50.6%' },
      { label: 'Completed ≥1 test', value: '286 / 682', sub: '41.9%' },
      { label: 'Completion among starters', value: '286 / 345', sub: '82.9%' },
    ],
    checked: [
      { tag: 'PROD', text: 'count(*) from profiles for the denominator.' },
      { tag: 'PROD', text: 'Distinct user_id in test_sessions, and again restricted to status = completed.' },
      { tag: 'UX', text: 'Signup tested end-to-end, removing registration as an explanation.' },
      { tag: 'CODE', text: 'Searched for any activation or re-engagement mechanism; none found.' },
    ],
    sources: ['Stage 3 Production Audit', 'UX Walkthrough', 'Final Growth Verification'],
  },

  6: {
    problem: [
      '94.4% of users who completed a test never came back on another day, and only 16 of 682 have ever had two active days.',
      'The habit system rewards completion only — answer 20 questions and quit, and nothing is credited.',
      'Both figures are floors, because "active" cannot see reading, browsing or revision.',
    ],
    evidence: [
      { tag: 'PROD', text: '270 of 286 test-completers (94.4%) never returned on a second day.' },
      { tag: 'PROD', text: '16 of 682 users have 2+ distinct activity dates — 2.3%.' },
      { tag: 'CODE', text: 'Streaks, XP and badges are written ONLY by submit_test.' },
      { tag: 'CODE', text: 'daily_activity is written only by test submission and current-affairs completion.' },
    ],
    why: [
      'Retention is what makes acquisition worth paying for — 396 signups in August against 16 lifetime two-day users.',
      'Repeated exposure is normally how a free user comes to value a paid tier.',
    ],
    confirmed: [
      'Partial effort earns no habit credit whatsoever.',
      'The "active" definition is structurally narrow, so every retention figure is a floor.',
      'No cohorted retention measurement exists.',
    ],
    hypothesis: [
      'The absence of a return loop is the primary cause of the 94.4% — consistent, not isolated.',
      'Part of the loss is cohort immaturity rather than churn — 53.7% of the base is under 30 days old. Unquantified.',
    ],
    metrics: [
      { label: 'Completers who returned', value: '16 / 286', sub: '5.6%' },
      { label: 'All users, 2+ active days', value: '16 / 682', sub: '2.3%' },
      { label: 'Active last 30 days', value: '135 / 682', sub: '19.8%' },
      { label: 'D1 / D3 / D7 / D14 / D30', value: 'DATA NOT AVAILABLE', sub: 'query not run' },
    ],
    checked: [
      { tag: 'PROD', text: 'Counted users with 2+ distinct activity_date values in daily_activity.' },
      { tag: 'PROD', text: 'Counted distinct users with a completed test session for the denominator.' },
      { tag: 'CODE', text: 'Traced every writer of daily_activity and of streak, XP and badge state.' },
      { tag: 'PROD', text: 'Recomputed active-today and active-7d under both UTC and IST — identical.' },
    ],
    sources: ['Stage 2 Code Audit', 'Stage 3 Production Audit', 'Final Growth Verification'],
  },

  7: {
    problem: [
      'Content that already exists is not doing the work it could.',
      'Current Affairs images fail to load — on the feature best suited to daily return — the free tier is under-communicated, and Kural of the Day has nothing prompting anyone to open it.',
    ],
    evidence: [
      { tag: 'UX', text: 'Images observed not loading in Current Affairs during the walkthrough.' },
      { tag: 'UX', text: '"for free should be highlighted more."' },
      { tag: 'UX', text: 'Kural of the Day raised unprompted as an existing feature nobody would find.' },
      { tag: 'CODE', text: 'Current-affairs completion is one of only two writers of daily_activity, so a broken CA experience suppresses the retention metric directly.' },
    ],
    why: [
      'Daily content is the cheapest retention mechanism available, and this product already has three sources of it.',
      'Under-communicated free value costs twice: users under-use it, and cannot judge what paid would add.',
    ],
    confirmed: [
      'Current Affairs images failed to load in the observed session.',
      'The free tier’s contents are not communicated where a user would look.',
      'Kural of the Day has no prompt, notification or placement.',
    ],
    hypothesis: [
      'The image failure is systemic rather than incidental — observed once and NOT reproduced.',
      'Surfacing daily content would improve return rates — structurally plausible, untested.',
    ],
    metrics: [
      { label: 'Free tier credits', value: '50 + 10/day' },
      { label: 'Free mock exams', value: '1', sub: 'ever' },
      { label: 'Users affected', value: 'DATA NOT AVAILABLE', sub: 'no per-feature usage data' },
      { label: 'Kural engagement', value: 'DATA NOT AVAILABLE', sub: 'not instrumented' },
    ],
    checked: [
      { tag: 'UX', text: 'Navigated the Current Affairs section and observed the failure directly.' },
      { tag: 'UX', text: 'Tester asked to state what they get for free.' },
      { tag: 'CODE', text: 'Read the free-tier credit and entitlement rules.' },
      { tag: 'CODE', text: 'Confirmed current-affairs completion writes daily_activity.' },
    ],
    sources: ['Stage 2 Code Audit', 'UX Walkthrough', 'Backlog Register P1-5 / P1-7 / P1-8'],
  },

  8: {
    problem: [
      'Four payment records exist. Three are staff comps at ₹0 and the fourth — the only one carrying money — was founder-generated.',
      'Externally-generated revenue is ₹0.',
      'This flaw is the scoreboard: it has no independent fix and moves only when Flaws #1, #2, #3 and #9 move.',
    ],
    evidence: [
      { tag: 'PROD', text: '4 records with status = paid; exactly one carries a non-zero amount (89,900 paise).' },
      { tag: 'FOUNDER', text: '3 of the 4 are internal staff comps at ₹0; the fourth was internally generated.' },
      { tag: 'PROD', text: '366 signups in the trailing 30 days → 0 new paying customers.' },
      { tag: 'PROD', text: '0 failed payments and 0 refunds in 83 days — the payment rail is not the problem.' },
    ],
    why: [
      'Reported as "1 paying customer, ₹899" this reads as early traction; nobody outside the building has ever paid.',
      'With no externally-acquired paying population, the activation-threshold hypothesis cannot be tested at all.',
    ],
    confirmed: [
      'This flaw has no independent root cause — it is the arithmetic outcome of Flaws #1, #2, #3 and #9.',
      'Payment infrastructure is not a cause: 0 failures, HMAC verification, idempotency, server-side re-fetch.',
      'Checkout is not a cause: verified working to the final payment step on a real device.',
    ],
    hypothesis: [
      'The binding constraint is value perception rather than price — see Flaw #1.',
      'Price is not established as a cause: there have been zero external conversions at any price point.',
    ],
    metrics: [
      { label: 'All-time revenue', value: '₹899', sub: 'one transaction' },
      { label: 'Externally generated', value: '₹0' },
      { label: 'Externally acquired', value: '0 / 682', sub: '0.00%' },
      { label: 'Last-30-day conversion', value: '0 / 366', sub: '0.00%' },
    ],
    checked: [
      { tag: 'PROD', text: 'Counted payments by status and summed amounts in paise.' },
      { tag: 'PROD', text: 'Grouped paid records by plan key to see which plans have ever converted.' },
      { tag: 'FOUNDER', text: 'Confirmed which paid accounts are staff and that the ₹899 was internal.' },
      { tag: 'DERIVED', text: 'Re-examined and formally retracted the paying-vs-non-paying engagement comparison.' },
    ],
    sources: ['Stage 3 Production Audit', 'Founder Confirmation', 'Final Growth Verification'],
  },

  9: {
    problem: [
      'Two fully-built systems are producing nothing.',
      '20 payment orders sit at "created" from 11 people — the oldest for 79 days — and no cleanup, retry, reminder or follow-up exists.',
      'The coupon and promoter system is complete, server-validated, and has been redeemed zero times.',
    ],
    evidence: [
      { tag: 'PROD', text: '20 created rows never completed, from 11 distinct users. Attempts per user: 5, 3, 2, 2, 2, 1, 1, 1, 1, 1, 1.' },
      { tag: 'PROD', text: 'Oldest unresolved attempt 79 days; one user returned to checkout 5 times across 59 days.' },
      { tag: 'PROD', text: '0 coupon redemptions across every plan in 83 days.' },
      { tag: 'UX', text: '"Where to get the coupon codes" — no discoverable path to a code exists in the product.' },
    ],
    why: [
      'These 11 are the warmest prospects the business has — they accepted a price and then stopped.',
      'The referral channel is the cheapest acquisition route for an audience that clusters physically, and it is switched off.',
    ],
    confirmed: [
      'No recovery mechanism of any kind exists — no cleanup, retry, reminder or follow-up.',
      'The coupon infrastructure works and is server-validated; it is unused, not broken.',
      'coupon_viewed is not instrumented, so zero redemptions cannot be diagnosed.',
    ],
    hypothesis: [
      'The 11 abandoners had a resolvable objection — supported by the repeat patterns, but the objection itself is unknown.',
      'Zero redemptions is a distribution problem rather than a discoverability one — both are likely true; neither is isolated.',
    ],
    metrics: [
      { label: 'Abandoned orders', value: '20', sub: 'from 11 people' },
      { label: 'Oldest unresolved', value: '79 days' },
      { label: 'Coupon redemptions', value: '0', sub: 'in 83 days' },
      { label: 'Recovery mechanisms', value: '0' },
    ],
    checked: [
      { tag: 'PROD', text: 'Selected created rows with no matching paid record, grouped by user and plan.' },
      { tag: 'PROD', text: 'Examined created_at timestamps per user to derive the attempt-timing patterns.' },
      { tag: 'CODE', text: 'Searched for any cleanup, retry or recovery path attached to created rows; none exists.' },
      { tag: 'UX', text: 'Tester attempted to find a coupon code and could not.' },
    ],
    sources: ['Stage 2 Code Audit', 'Stage 3 Production Audit', 'UX Walkthrough'],
  },

  10: {
    problem: [
      'There is almost no organic path to this product: the sitemap lists five URLs, four of them legal pages, and every route returns the same title and description.',
      'A search for "TNPSC group 2 test series" does not return this brand at all.',
      'This is a genuine weakness and it is NOT the current bottleneck — acquisition is growing without it.',
    ],
    evidence: [
      { tag: 'EXT', text: 'sitemap.xml contains 5 URLs; the 7 products named in the site’s own JSON-LD have no pages of their own.' },
      { tag: 'EXT', text: 'Identical title and meta description confirmed across 4 sampled routes.' },
      { tag: 'EXT', text: 'Zero third-party mentions, reviews or forum threads found for the brand anywhere.' },
      { tag: 'PROD', text: 'Counterweight — acquisition grew without organic search: 19 → 226 → 396 signups by month.' },
    ],
    why: [
      'Organic search is the only channel that compounds without ongoing spend, and it is currently at zero.',
      'But fixing discovery while conversion sits at 0.00% would deliver more users into a funnel that monetises none of them.',
    ],
    confirmed: [
      'The site is a pure client-rendered SPA with no per-route server output.',
      'No product landing pages exist, so seven keyword intents compete for one homepage.',
      'No third-party citation footprint exists.',
    ],
    hypothesis: [
      'Product landing pages would produce meaningful organic acquisition — reasonable by competitor analogy, unproven here.',
      'That this should be fixed before conversion — this report argues explicitly against that reading.',
    ],
    metrics: [
      { label: 'Sitemap URLs', value: '5', sub: '4 are legal pages' },
      { label: 'Products with a URL', value: '0 of 7' },
      { label: 'Third-party mentions', value: '0' },
      { label: 'Organic sessions', value: 'DATA NOT AVAILABLE', sub: 'no visitor store, no attribution' },
    ],
    checked: [
      { tag: 'EXT', text: 'curl of /sitemap.xml and a direct count of the URLs returned.' },
      { tag: 'EXT', text: 'curl of the title tag and meta description across four routes.' },
      { tag: 'EXT', text: 'Searched the category’s primary commercial query and the brand name.' },
      { tag: 'PROD', text: 'Monthly signup trend, used to prevent this flaw being over-prioritised.' },
    ],
    sources: ['Stage 1 External Audit', 'Stage 3 Production Audit', 'UX Walkthrough'],
  },

  11: {
    problem: [
      'A prospective buyer cannot find out what this product costs without creating an account.',
      'Separately, no app-store listing was found — but that is a negative search result, not a confirmed absence, and the codebase contains real IAP product IDs.',
      'These two findings have different evidence strength and must not be presented as equally certain.',
    ],
    evidence: [
      { tag: 'EXT', text: 'CONFIRMED — pricing renders only inside the app shell; no /pricing route appears in the sitemap.' },
      { tag: 'EXT', text: 'UNCONFIRMED — Play Store and App Store searches returned no listing for the brand.' },
      { tag: 'CODE', text: 'Real IAP product IDs (com.tnpscmentor.app.premium90) tied to store product identifiers.' },
      { tag: 'EXT', text: 'Competitor TNPSC Master publishes a public pricing page with a proof-of-scale claim on it.' },
    ],
    why: [
      'Price is a qualification signal; requiring signup to see it filters out exactly the users who are comparing options.',
      'If the app is genuinely unlisted, real mobile engineering is producing no install channel.',
    ],
    confirmed: [
      'Pricing is rendered only inside the authenticated app shell — there is no public route for it.',
      'The SPA provides no per-route server output, so even a /pricing route would need prerendering to be indexable.',
    ],
    hypothesis: [
      'That the app is genuinely unpublished — NOT established. The evidence supports only that a search did not find a listing; the IAP product IDs point the other way.',
      'That a public pricing page would improve conversion — reasonable by analogy, untested here.',
    ],
    metrics: [
      { label: 'Public pricing pages', value: '0', sub: 'CONFIRMED' },
      { label: 'App-store listings found', value: '0', sub: 'UNCONFIRMED absence' },
      { label: 'App-store status', value: 'PENDING', sub: 'awaiting founder answer since Stage 1' },
      { label: 'App install count', value: 'DATA NOT AVAILABLE' },
    ],
    checked: [
      { tag: 'EXT', text: 'Attempted to reach a public pricing URL and checked the sitemap for one.' },
      { tag: 'EXT', text: 'Searched Google Play and the App Store for the brand name and domain.' },
      { tag: 'CODE', text: 'Located the IAP product catalogue and the native platform configuration.' },
      { tag: 'EXT', text: 'Checked competitor pricing pages for public visibility.' },
    ],
    sources: ['Stage 1 External Audit', 'Stage 2 Code Audit', 'Final Growth Verification'],
  },

  12: {
    problem: [
      'The one part of this business that is demonstrably working is acquisition — 19 → 226 → 396 signups by month.',
      'Nobody can say why: no utm_source, medium, campaign or referrer column exists anywhere in the schema.',
      'This is unrecoverable for every historical period, not merely unqueried.',
    ],
    evidence: [
      { tag: 'CODE', text: 'Exhaustive schema search for utm/referrer columns returned one non-match — none exist.' },
      { tag: 'PROD', text: '100% of 682 signups are unattributed; 396 in August, 366 in the last 30 days.' },
      { tag: 'CODE', text: 'GA4, GTM and the Meta Pixel fire for ~100% of sessions but cannot be joined to who paid.' },
      { tag: 'CODE', text: 'Compounding gap — trackSignUp() has one call site, so Google signups are not even counted as signups.' },
    ],
    why: [
      'The best acquisition month on record cannot be explained or deliberately repeated.',
      'Any paid acquisition would be unattributable to outcomes — CAC cannot be computed at all.',
    ],
    confirmed: [
      'No acquisition-source column was ever added to the schema.',
      'The signup path does not read UTM parameters or the referrer.',
      'Third-party analytics cannot be joined to first-party records — there is no shared key.',
    ],
    hypothesis: [
      'Which channel actually drove August’s growth. Instagram, YouTube, Telegram, referral, organic and direct are all candidates and NONE can be supported. This report deliberately makes no guess.',
    ],
    metrics: [
      { label: 'Signups with a source', value: '0 / 682', sub: '0.00%' },
      { label: 'August, unattributed', value: '396', sub: '100%' },
      { label: 'Attribution columns', value: '0', sub: 'in the entire schema' },
      { label: 'Historical attribution', value: 'UNRECOVERABLE', sub: 'the data was never captured' },
    ],
    checked: [
      { tag: 'CODE', text: 'Exhaustive grep across the full supabase/ schema tree for UTM, campaign, source and referrer patterns.' },
      { tag: 'CODE', text: 'Enumerated every table; no events or analytics table exists.' },
      { tag: 'CODE', text: 'Traced the signup path for query-parameter or document.referrer capture.' },
      { tag: 'PROD', text: 'Monthly and trailing-window signup counts.' },
    ],
    sources: ['Stage 2 Code Audit', 'Stage 3 Production Audit', 'Latest Acquisition Verification'],
  },

  13: {
    problem: [
      'Several of the most important questions in this audit are unanswerable, and this flaw is why.',
      'Pricing views are not instrumented, so the checkout funnel stage has no denominator; paid formats cannot log abandonment; the signup event misses everyone who uses Google.',
      'The instrumentation that does exist is well built — it is incomplete, not sloppy.',
    ],
    evidence: [
      { tag: 'CODE', text: 'trackViewContent fires on Register and /rank-booster only — NOT confirmed on the in-app PricingCards screen.' },
      { tag: 'CODE', text: 'record_abandoned_test has one call site, on the free practice engine; Mock, Vettri, Rank Booster and Test Series leave no trace.' },
      { tag: 'CODE', text: 'trackSignUp() has one call site — Google-created accounts fire only trackLogin("google").' },
      { tag: 'CODE', text: "revenue_metrics.sql filters premiumActive to plan = 'premium_annual' only — 1 of 5 plans." },
    ],
    why: [
      'Without a pricing-view event, the Phase 1 conversion work would be unfalsifiable — there would be no way to tell whether it worked.',
      'Two central hypotheses in this audit remain untestable purely because the data to test them does not exist.',
    ],
    confirmed: [
      'Abandonment tracking was built once, for one engine, and never extended to the paid formats.',
      'The signup event was wired to one auth path and not updated when Google sign-in was added.',
      'Pricing-view and server-side visitor instrumentation were never built.',
    ],
    hypothesis: [
      'None required — every item in this flaw was read directly in source code.',
    ],
    metrics: [
      { label: 'Paid formats logging abandonment', value: '0 of 4' },
      { label: 'Auth paths firing signup', value: '1 of 2' },
      { label: 'Plans counted by premiumActive', value: '1 of 5' },
      { label: 'Funnel stages with no data', value: '2', sub: 'visitors, pricing views' },
    ],
    checked: [
      { tag: 'CODE', text: 'Enumerated every call site of trackSignUp, trackViewContent and record_abandoned_test.' },
      { tag: 'CODE', text: 'Read revenue_metrics.sql and get_platform_metrics() to establish how each figure is computed.' },
      { tag: 'CODE', text: 'Traced every writer of daily_activity to establish the operative definition of "active".' },
      { tag: 'PROD', text: 'Timezone validation — identical values under UTC and IST, downgrading that finding to P3.' },
    ],
    sources: ['Stage 2 Code Audit', 'Stage 3 Production Audit', 'Final Growth Verification'],
  },

  14: {
    problem: [
      '682 users have produced 6 pieces of feedback, all star ratings, none carrying any written text.',
      'A 4.33 average from six responses identifies no feature, no friction and no reason anyone did not upgrade.',
      'Clarity was inaccessible throughout, so there is no behavioural data either.',
    ],
    evidence: [
      { tag: 'PROD', text: '6 feedback records from 682 users — a 0.88% response rate. Ratings: 5, 4, 5, 5, 2, 5.' },
      { tag: 'PROD', text: 'Written feedback: 0. Not one response carries text.' },
      { tag: 'CODE', text: 'The prompt appears once, home screen only, after 2 completed tests, non-admins only, then suppressed 3 months.' },
      { tag: 'GAP', text: 'Microsoft Clarity — no access at any point across Stages 1, 2 or 3.' },
    ],
    why: [
      'Every major conclusion in this audit is inferential, and this is why.',
      'The plan-confusion versus price-resistance question could be settled by asking roughly ten people; that capability does not exist.',
    ],
    confirmed: [
      'The gating conditions are deliberate and each confirmed in code, client and server.',
      'The instrument collects a rating and no free text.',
      'No exit-intent, objection or abandonment survey exists anywhere.',
    ],
    hypothesis: [
      'Relaxing the gating would produce meaningfully more responses — very likely, but untested, and volume alone is not the goal.',
      'The 2-star rating reflects a specific, fixable problem — unknowable. There is no text.',
    ],
    metrics: [
      { label: 'Feedback responses', value: '6 / 682', sub: '0.88%' },
      { label: 'Average rating', value: '4.33', sub: 'n = 6, not meaningful' },
      { label: 'Responses with text', value: '0' },
      { label: 'Excluded by the 2-test gate', value: '396 users' },
    ],
    checked: [
      { tag: 'PROD', text: 'Counted app_feedback rows, read the rating values, checked the text column for content.' },
      { tag: 'CODE', text: 'Read FeedbackModal and its gating conditions on both client and server.' },
      { tag: 'DERIVED', text: 'Compared the 2-completed-test gate against the production figure of 286 completers.' },
      { tag: 'GAP', text: 'Clarity access attempted in every stage and unavailable each time.' },
    ],
    sources: ['Stage 3 Production Audit', 'Stage 2 Code Audit', 'Latest Feedback Verification'],
  },

};
