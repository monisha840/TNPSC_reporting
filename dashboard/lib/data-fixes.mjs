/*
 * FIX PROPOSALS — one per major flaw.
 *
 * THESE ARE PROPOSALS, NOT IMPLEMENTATIONS. Nothing here has been built, and no
 * TNPSC Mentors application code, database or configuration was accessed or
 * changed to write it. Every fix is status PLANNED / NOT IMPLEMENTED.
 *
 * Priority is NOT stored here — it is read from the connected flaw, so the audit's
 * own P0/P1/P2 assignments remain the single source of truth.
 *
 * `before` describes the CURRENT state and cites only findings the audit confirmed.
 * `after` is the proposed state.
 *
 * Numbers inside `example` blocks are ILLUSTRATIVE mock-ups of a proposed screen.
 * They are marked as such in the UI and must never be read as audit data. Real
 * measured figures appear only in `baseline`, and are quoted from the audit model.
 */

export const FIX_STATUS = { state: 'PLANNED', detail: 'NOT IMPLEMENTED' };

/* ---------------------------------------------------------------------------
 * The 14 fix proposals
 * ------------------------------------------------------------------------- */

export const FIXES = [

  {
    id: 1, flaw: 1,
    title: 'Weak Value Proposition & Conversion Experience',
    proposed: 'Make users experience the product’s strongest value before introducing the Premium purchase decision.',
    change: [
      'Change the order of the experience: value first, premium ask second.',
      'The strongest existing value moments — Results, Revision and Insights — should be surfaced as part of the intended journey instead of being discovered by wandering.',
      'Introduce genuine social proof on the public landing and pricing surfaces.',
    ],
    before: [
      'Signup',
      'Home',
      'Premium prompt in every section',
      'Revision / Insights found only by wandering',
    ],
    after: ['Signup', 'First Test', 'Result', 'Insights', 'Weak Areas', 'Recommended Practice', 'Relevant Premium opportunity'],
    example: {
      caption: 'After completing a test',
      blocks: [
        { type: 'screen', rows: [
          { kind: 'stat', text: '72 / 100' },
          { kind: 'line', text: 'Your strongest area: History' },
          { kind: 'line', text: 'Needs improvement: Polity + Current Affairs' },
          { kind: 'cta', text: 'View Detailed Insights' },
        ] },
        { type: 'screen', caption: 'Only after the user has seen the insight', rows: [
          { kind: 'line', text: 'Want deeper preparation guidance?' },
          { kind: 'cta', text: 'Explore Premium' },
        ] },
      ],
    },
    outcome: [
      'Users understand the product’s value before being asked to pay.',
      'Premium appears at a moment when the user has demonstrated interest.',
      'The strongest existing features become part of the intended journey.',
    ],
    caveat: 'The audit establishes very low conversion as a FACT. That weak value communication causes it remains a HYPOTHESIS — this fix is the proposed way to test it, not a proven remedy.',
    baseline: '366 signups in the last 30 days → 0 new paying customers. Externally-acquired paying customers: 0 of 682.',
  },

  {
    id: 2, flaw: 2,
    title: 'Confusing Monetization & Pricing Structure',
    proposed: 'Make the pricing experience goal-based rather than presenting several plans as equally important choices.',
    change: [
      'Ask the user what they are preparing for, then guide them to the plan that matches that goal.',
      'For each plan, state plainly who it is for, what it includes, its duration and its price — and mark one as recommended.',
      'Plan entitlements themselves stay exactly as they are; only how they are explained changes.',
    ],
    before: [
      'Pricing screen',
      'Five plans shown as equal choices',
      'No recommended default',
      'User opens two checkouts to compare',
    ],
    after: ['Ask the goal', 'Recommend one plan', 'Show who it is for + what it includes', 'Allow comparison', 'Checkout'],
    example: {
      caption: '"What is your goal?"',
      blocks: [
        { type: 'map', pairs: [
          ['I just want more mock tests', 'Mock Test Pack'],
          ['I want serious preparation', 'Vettri'],
          ['I want to improve my rank', 'Rank Booster'],
          ['I want complete preparation', 'Premium Prelims Kit'],
        ] },
      ],
    },
    outcome: [
      'Users understand which plan fits their goal.',
      'Less decision confusion at the last step before payment.',
      'Plan-level conversion becomes possible to measure.',
    ],
    caveat: 'The entitlement overlap is a CONFIRMED code-level fact. That plan complexity is what suppresses conversion is a HYPOTHESIS, and it competes with price resistance at ₹1,699 — this fix is designed to help separate them, not to assume one.',
    baseline: 'premium_annual draws 12 of 21 checkout attempts (57%) and has converted 0 times.',
  },

  {
    id: 3, flaw: 3,
    title: 'Broken / Expired Promotional Experience',
    proposed: 'Make promotional offers automatically become inactive after their defined expiry date.',
    change: [
      'Promotion validity should be decided by comparing the current time against an explicit start and end, not by someone remembering to edit a constant.',
      'When a promotion is not active, the product shows the normal price and none of the promotional messaging.',
      'No replacement discount is proposed — the correct state after expiry is simply the normal price.',
    ],
    before: [
      '₹1,249 + "valid till 31 Aug 2026" hard-coded',
      '31 Aug passes',
      'Page unchanged — offer still shown',
    ],
    after: ['Before start: normal price', 'During window: offer price + messaging', 'After end: normal price, messaging removed'],
    example: {
      caption: 'Rank Booster',
      blocks: [
        { type: 'screen', caption: 'While the offer is genuinely running', rows: [
          { kind: 'strike', text: '₹1,800' },
          { kind: 'stat', text: '₹1,249' },
          { kind: 'chip', text: 'Limited-time offer' },
        ] },
        { type: 'screen', caption: 'After expiry — no banner, badge, countdown or old price', rows: [
          { kind: 'stat', text: '₹1,800' },
        ] },
      ],
    },
    outcome: [
      'Users never see an expired promotion.',
      'Promotional messaging stays trustworthy.',
      'Future offers expire on their own, with no manual edit.',
    ],
    caveat: 'A visible price and the price actually charged must agree at every step — product page, pricing card, checkout and order creation. The payable amount should be determined server-side, not from what the page happens to be showing.',
    baseline: 'Offer stated as valid till 31 Aug 2026; confirmed still visible on 5 Sep 2026.',
  },

  {
    id: 4, flaw: 4,
    title: 'Poor First-Time User Experience',
    proposed: 'Replace the unstructured first session with a short guided introduction.',
    change: [
      'A new user should be asked two quick questions and then taken straight into a test.',
      'Everything else that currently competes for attention on entry should wait until the user has done something.',
      'This is a sequencing change — no new features are required.',
    ],
    before: [
      'Signup',
      'Home',
      'Up to five modals compete',
      'Navigate',
      '3–4 taps',
      'Test',
    ],
    after: ['Welcome', 'Choose exam', 'Choose preparation level', 'Start first test', 'View result'],
    example: {
      caption: 'First session',
      blocks: [
        { type: 'screen', rows: [
          { kind: 'line', text: 'Welcome to TNPSC Mentors.' },
          { kind: 'line', text: 'Which exam are you preparing for?' },
          { kind: 'chips', items: ['Group 1', 'Group 2', 'Group 2A', 'Group 4'] },
        ] },
        { type: 'screen', rows: [
          { kind: 'line', text: 'What’s your preparation level?' },
          { kind: 'chips', items: ['Beginner', 'Preparing', 'Revision'] },
        ] },
        { type: 'screen', rows: [
          { kind: 'line', text: 'Let’s find your current level.' },
          { kind: 'cta', text: 'Start Test' },
        ] },
      ],
    },
    outcome: [
      'New users know what to do.',
      'Fewer competing actions in the first session.',
      'A faster path to meaningful product usage.',
    ],
    caveat: 'Signup itself is CONFIRMED working and is not in scope. That popup overload and tap count cause the activation loss is an OBSERVATION from a walkthrough of n = 1.',
    baseline: 'Five modals can fire on entry; 3–4 taps from entry to a started test.',
  },

  {
    id: 5, flaw: 5,
    title: 'Weak Activation',
    proposed: 'Make the first meaningful test the primary action immediately after registration.',
    change: [
      'The first screen after signup should offer one obvious action: take a short test.',
      'Reduce the navigation between registration and that test to a single tap.',
      'Define activation explicitly as first-test-started, and report it on weekly signup cohorts rather than as a lifetime blend.',
    ],
    before: [
      'Signup',
      'Home',
      'User decides what to do next',
      'No first action offered',
    ],
    after: ['Signup', '"Take your first test"', 'Test', 'Result'],
    example: {
      caption: 'Immediately after registration',
      blocks: [
        { type: 'screen', rows: [
          { kind: 'label', text: 'YOUR FIRST STEP' },
          { kind: 'line', text: '🎯 Take your first TNPSC test' },
          { kind: 'muted', text: '10 questions · about 5 minutes' },
          { kind: 'cta', text: 'START TEST' },
        ] },
      ],
    },
    outcome: [
      'More registered users reach their first test.',
      'Fewer users register and never experience the product at all.',
      'Activation becomes a reported metric instead of a derived one.',
    ],
    caveat: 'The 337 activation loss is a FACT. That first-run friction causes it is an OBSERVATION from a walkthrough of n = 1, so this fix is the proposed way to test it, not a proven remedy. Cohorting also matters: 53.7% of the base registered within the last 30 days, so a blended lifetime rate will barely move even if the change works.',
    baseline: '345 of 682 users (50.6%) have started at least one test; 337 (49.4%) never have.',
  },

  {
    id: 6, flaw: 6,
    title: 'Weak Retention & Habit Formation',
    proposed: 'Turn the product into a daily preparation routine with a concrete reason to return tomorrow.',
    change: [
      'Give every day a small, finishable set of work, and show progress against it.',
      'Acknowledge partial effort — a user who answers questions and stops should not receive nothing.',
      'Broaden what counts as "active" first, and re-baseline, so a measurement change is not mistaken for an improvement.',
    ],
    before: [
      'Complete a test',
      'Score shown',
      'Nothing scheduled for tomorrow',
      'Partial effort earns nothing',
    ],
    after: ['Today’s preparation', 'Current Affairs — 10 questions', 'Weak Area Practice — 15 questions', 'Mini Test — 20 questions', 'Daily Challenge — 10 questions'],
    example: {
      caption: 'On return',
      blocks: [
        { type: 'screen', rows: [
          { kind: 'label', text: 'TODAY’S PREPARATION' },
          { kind: 'muted', text: '2 / 4 completed' },
          { kind: 'line', text: 'Today’s goal completed. Tomorrow’s challenge is ready.' },
        ] },
        { type: 'screen', rows: [
          { kind: 'chip', text: '🔥 3-day streak' },
          { kind: 'line', text: 'Tomorrow: 20 Polity questions' },
          { kind: 'cta', text: 'Come Back Tomorrow' },
        ] },
      ],
    },
    outcome: [
      'Users are given a concrete reason to return.',
      'A repeatable study habit becomes possible.',
      'Meaningful active days increase.',
    ],
    caveat: 'The 94.4% non-return is a FACT. That the absence of a return loop is its primary cause is an OBSERVATION, not proven — and part of the loss may be cohort immaturity rather than churn. Retention measurement is also incomplete: activity is recorded only around specific product actions, so today’s figures are a FLOOR. Broadening the definition will raise the number on its own — report both definitions in parallel through the transition. A future extension could use controlled reminders for unfinished preparation.',
    baseline: '16 of 286 test-completers (5.6%) returned on a second day; 16 of 682 users (2.3%) have ever had two active days.',
  },

  {
    id: 7, flaw: 7,
    title: 'Weak Content Engagement & Surfacing',
    proposed: 'Stop making users search the product for useful content — surface it from what they have just done.',
    change: [
      'After a test, point the user at their weakest area and offer the practice for it.',
      'Give Current Affairs and Kural of the Day a daily surface instead of leaving them to be found.',
      'Ensure content still reads correctly when an image fails to load.',
    ],
    before: [
      'Content exists but must be searched for',
      'Current Affairs images fail to load',
      'Kural of the Day unprompted',
      'Free tier unstated',
    ],
    after: ['Test completed', 'Weakest area identified', 'Recommended practice offered', 'Daily content surfaced'],
    example: {
      caption: 'After a test',
      blocks: [
        { type: 'screen', rows: [
          { kind: 'muted', text: 'Based on your last test' },
          { kind: 'line', text: 'Polity is your weakest area.' },
          { kind: 'cta', text: 'Practice Polity — 15 questions' },
        ] },
        { type: 'screen', rows: [
          { kind: 'label', text: 'TODAY’S CURRENT AFFAIRS' },
          { kind: 'muted', text: '10 questions' },
          { kind: 'cta', text: 'Start' },
        ] },
      ],
    },
    outcome: [
      'Existing content gets used more.',
      'Users know what to study next.',
      'Revision and Current Affairs become part of the preparation journey.',
    ],
    caveat: 'The Current Affairs image failure was OBSERVED once during the walkthrough and was NOT reproduced — its scope should be established before the work is sized.',
    baseline: 'No per-feature usage data exists, so current content engagement is DATA NOT AVAILABLE.',
  },

  {
    id: 8, flaw: 8,
    title: 'Extremely Weak Monetization Performance',
    proposed: 'Build monetization around demonstrated value rather than increasing the number of generic Premium prompts.',
    change: [
      'Let the free experience produce a genuinely useful result, then show what a deeper version of that same result would contain.',
      'Make the paid tier legible at the moment the user has an immediate need for it.',
      'Separate internal and comp records from real customers in reporting, so external revenue is readable at a glance.',
    ],
    before: [
      'Test result',
      'Score only',
      'Generic Premium prompt, shown everywhere',
    ],
    after: ['Free experience', 'Useful result', 'Personalized insight', 'Premium opportunity'],
    example: {
      caption: 'On the result screen',
      blocks: [
        { type: 'screen', rows: [
          { kind: 'label', text: 'YOUR RESULT' },
          { kind: 'stat', text: '72 / 100' },
          { kind: 'muted', text: 'Free: score and basic result' },
          { kind: 'locked', text: 'Detailed topic analysis' },
          { kind: 'locked', text: 'Rank and percentile' },
          { kind: 'locked', text: 'Weak-area insights and recommendations' },
          { kind: 'cta', text: 'Unlock Full Analysis' },
        ] },
      ],
    },
    outcome: [
      'Premium becomes relevant to the user’s immediate need.',
      'Users can see what they would be paying for.',
      'Whether demonstrated value raises premium intent becomes measurable.',
    ],
    caveat: 'This is the proposed EXPERIMENT based on current evidence, not a claim that it will increase conversion. This flaw is an outcome — it moves only when Fixes 01, 02, 03 and 09 move.',
    baseline: '₹899 all-time revenue, founder-generated. Externally-generated revenue: ₹0.',
  },

  {
    id: 9, flaw: 9,
    title: 'Unused Conversion & Recovery Mechanisms',
    proposed: 'Use the existing checkout, coupon and referral infrastructure that is already built and sitting idle.',
    change: [
      'When a checkout is started and payment is not completed, offer a small number of controlled reminders — one or two, never more.',
      'Make coupon entry discoverable, and give the existing promoter tracking some promoters to track.',
      'Build the recovery measurement before the recovery campaign, so the first attempt can be judged.',
    ],
    before: [
      'Checkout started',
      'Payment not completed',
      'Nothing follows up',
      'Oldest unresolved 79 days',
    ],
    after: ['Checkout started', 'Payment not completed', 'Controlled reminder', 'Optional second reminder', 'Recovery tracked'],
    example: {
      caption: 'Two reminders, maximum',
      blocks: [
        { type: 'screen', caption: 'After 30 minutes', rows: [
          { kind: 'line', text: 'You were almost there. Your selected plan is still available.' },
          { kind: 'cta', text: 'Continue Payment' },
        ] },
        { type: 'screen', caption: 'After 24 hours', rows: [
          { kind: 'line', text: 'Complete your TNPSC Mentors enrollment.' },
          { kind: 'cta', text: 'Continue Payment' },
        ] },
        { type: 'flow', steps: ['Student', 'Invite friend', 'Friend receives benefit', 'Student receives reward'] },
      ],
    },
    outcome: [
      'Some genuine high-intent checkout users are recovered.',
      'The existing referral infrastructure is finally switched on.',
      'A measurable referral channel exists for the first time.',
    ],
    caveat: 'Created payment rows evidence checkout intent at an accepted price. They should be interpreted by their actual lifecycle semantics, not read automatically as confirmed abandonment — the schema gives an incomplete order no defined terminal state. NO USER HAS BEEN CONTACTED as part of this audit; whether to contact the 11 is the founder’s decision.',
    baseline: '20 created payment rows from 11 people, oldest unresolved 79 days. 0 coupon redemptions in 83 days.',
  },

  {
    id: 10, flaw: 10,
    title: 'Weak Organic Discoverability',
    proposed: 'Create public pages built around actual TNPSC search intent, using content the product already produces.',
    change: [
      'Give each product a real, indexable page instead of having several keyword intents compete for one homepage.',
      'Make each page state what it is, who it is for, what the user can do and where to start free.',
      'Judge this work on organic sessions and ranked queries, not on the number of pages published.',
    ],
    before: [
      'One homepage carries seven product intents',
      '5 sitemap URLs — four are legal pages',
      'No product page to rank or share',
    ],
    after: ['/tnpsc-group-4-mock-test', '/tnpsc-group-2-mock-test', '/tnpsc-group-2a-mock-test', '/tnpsc-current-affairs', '/tnpsc-previous-year-questions', '/tnpsc-question-bank'],
    example: {
      caption: 'What each page needs to answer',
      blocks: [
        { type: 'list', items: [
          'What it is',
          'Who it is for',
          'What users can do here',
          'Why TNPSC Mentors is useful for it',
          'A free starting point',
          'One clear call to action',
        ] },
      ],
    },
    outcome: [
      'Organic discovery increases.',
      'Existing product content becomes a set of search entry points.',
      'Less dependence on direct and social traffic.',
    ],
    caveat: 'This is a genuine weakness and it is NOT the current bottleneck — acquisition is already growing without it. Sequenced deliberately behind conversion and activation.',
    baseline: 'Sitemap contains 5 URLs, four of them legal pages. 0 of 7 named products have a page.',
  },

  {
    id: 11, flaw: 11,
    title: 'Poor Public Product / Commercial Visibility',
    proposed: 'Let the public website explain the product and its commercial offering before asking anyone to register.',
    change: [
      'A visitor should be able to understand what the product is, who it is for and what it costs without creating an account.',
      'Make pricing a public, shareable, comparable page.',
      'Resolve the open app-store question before planning any store work.',
    ],
    before: [
      'Visitor lands',
      'Must register to see the price',
      'Pricing renders only inside the app shell',
    ],
    after: ['What is TNPSC Mentors?', 'Who is it for?', 'How it helps', 'What users get', 'Genuine student proof', 'Plans', 'FAQ', 'Call to action'],
    example: {
      caption: 'Public pricing',
      blocks: [
        { type: 'screen', rows: [
          { kind: 'line', text: 'Choose the plan that matches your preparation goal.' },
          { kind: 'muted', text: 'Simple side-by-side comparison — who it is for, what is included, duration, price.' },
        ] },
      ],
    },
    outcome: [
      'Users understand the product before signup.',
      'Pricing becomes shareable and comparable.',
      'Trust increases through genuine proof.',
    ],
    caveat: 'Do NOT fabricate testimonials, ratings or user counts. Two honest numbers already exist and should be stated with their n. The absent app-store listing is UNCONFIRMED — a search did not find one, which is not the same as establishing that none exists.',
    baseline: 'No public pricing page (CONFIRMED). No app-store listing found (UNCONFIRMED — founder answer still pending).',
  },

  {
    id: 12, flaw: 12,
    title: 'No Acquisition Attribution',
    proposed: 'Make every acquisition source traceable through the whole user journey, from first touch to payment.',
    change: [
      'Capture where a user came from at first touch, persist it across sessions, and carry it through signup to the payment record.',
      'Report signups, activation and conversion by source rather than only in aggregate.',
      'Accept that historical attribution is unrecoverable and do not attempt to reconstruct it.',
    ],
    before: [
      'Source unknown',
      'Signup',
      'No link between the two',
      'Payment',
    ],
    after: ['Source', 'Landing page', 'Signup', 'First test', 'Payment'],
    example: {
      caption: 'What a channel report would look like once attribution exists',
      blocks: [
        { type: 'flow', steps: ['Instagram', '300 signups', '150 tests', '20 checkouts', '4 paid'] },
      ],
    },
    outcome: [
      'The team can see which channels produce valuable users, not just traffic.',
      'Future acquisition spend becomes measurable against outcomes.',
      'Channel-level differences in activation and conversion become visible.',
    ],
    caveat: 'No channel can be described as performing better or worse until attribution exists. The example figures above are ILLUSTRATIVE ONLY — there is no channel data today, and this audit deliberately makes no guess about what drove August’s growth.',
    baseline: '0 of 682 signups carry a source. No attribution column exists anywhere in the schema.',
  },

  {
    id: 13, flaw: 13,
    title: 'Incomplete Product Analytics & Event Tracking',
    proposed: 'Create a complete, measurable product journey so future changes can be evaluated with data instead of opinion.',
    change: [
      'Instrument every stage of the funnel so each one has both a numerator and a denominator.',
      'Close the specific known gaps: pricing views, paid-test abandonment, Google signups, plan-level conversion, and meaningful activity beyond test submission.',
      'Ship the pricing-view event first — without it, the conversion work in Phase 2 and 3 cannot be judged at all.',
    ],
    before: [
      'Landing — no server-side store',
      '✗ pricing views not instrumented',
      'Checkout — no denominator',
      'Payment',
    ],
    after: ['Landing', 'Signup Started', 'Signup Completed', 'First Test Started', 'Test Completed', 'Result Viewed', 'Revision Viewed', 'Insights Viewed', 'Premium Viewed', 'Checkout Started', 'Payment Completed'],
    example: {
      caption: 'Gaps this closes',
      blocks: [
        { type: 'list', items: [
          'Google signups counted as signups',
          'Abandonment logged inside paid test formats',
          'Plan-level conversion measurable',
          'Activity counted beyond test submission alone',
          'Pricing views — giving the checkout stage a denominator',
        ] },
      ],
    },
    outcome: [
      'Every important funnel stage becomes measurable.',
      'Product changes can be evaluated against real data.',
      'Conversion and retention hypotheses can be tested rather than guessed.',
    ],
    caveat: 'The instrumentation that already exists is well built — single, correct choke-points. It is incomplete, not sloppy, and this fix extends it rather than replacing it.',
    baseline: '0 of 4 paid formats log abandonment; 1 of 2 auth paths fires a signup event; premiumActive counts 1 of 5 plans.',
  },

  {
    id: 14, flaw: 14,
    title: 'Weak Customer Feedback & Behavioural Intelligence',
    proposed: 'Move from star-only feedback toward short, contextual feedback that captures the reason behind the score.',
    change: [
      'Ask for a rating plus what the user liked and what should improve — a few taps, not an essay.',
      'Reach the populations whose opinions matter most: users who never activated, never returned, or abandoned a checkout.',
      'Do not interrupt the first-time experience to do it.',
    ],
    before: [
      'After 2 completed tests, home screen only',
      'Star rating',
      'Submit',
      'No reason captured',
    ],
    after: ['Meaningful product moment', 'Rating', 'What did you like?', 'What should we improve?', 'Submit'],
    example: {
      caption: 'After a meaningful moment — not during onboarding',
      blocks: [
        { type: 'screen', rows: [
          { kind: 'line', text: 'How was your experience?' },
          { kind: 'chip', text: '⭐⭐⭐⭐⭐' },
          { kind: 'muted', text: 'What did you like?' },
          { kind: 'chips', items: ['Tests', 'Questions', 'Results', 'Revision', 'Insights'] },
          { kind: 'muted', text: 'What should we improve?' },
          { kind: 'field', text: '' },
          { kind: 'cta', text: 'Submit' },
        ] },
      ],
    },
    outcome: [
      'Understand why users like or dislike the product.',
      'Connect feedback to actual user behaviour.',
      'Identify specific, named product improvements.',
    ],
    caveat: 'Volume is not the objective — six responses with reasons would be worth more than six hundred bare scores. Any social proof drawn from ratings must state its n honestly.',
    baseline: '6 responses from 682 users (0.88%), average 4.33 from n = 6, and 0 carrying written text.',
  },

];

export default FIXES;
