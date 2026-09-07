# TNPSC Mentors — Developer Handoff

> **THIS REPORT WAS GENERATED USING READ-ONLY DATA.**
> **NO PRODUCTION CODE, DATABASE, CONFIGURATION OR DEPLOYMENT WAS MODIFIED.**

This document is written so a developer can understand and scope each issue **without reading the full audit**. Every block states what exists today, what should exist, what must be instrumented, and how the change will be judged.

**Audit period:** 14 Jun 2026 → 5 Sep 2026 · **Compiled:** 7 Sep 2026

> **DO NOT IMPLEMENT FROM THIS DOCUMENT DIRECTLY.** It is a reporting and planning artefact. No production code, database, configuration, analytics or deployment was modified to produce it, and none should be modified by it. These blocks describe work to schedule, review and implement deliberately.

---

## Baseline every metric below is measured against

| Metric | Value |
|---|---|
| Registered users | **682** |
| Started ≥1 test | **345** |
| Completed ≥1 test | **286** |
| Returned on a second day | **16** |
| Checkout users | **11** |
| Checkout attempts | **20** |
| Genuine paying customers | **1** |
| All-time revenue | **₹899** |
| Failed payments | **0** |
| Coupon redemptions | **0** |
| Feedback responses | **6** |

---

## Build order

### PHASE 1 — CONVERSION FOUNDATION

*Conversion is the stage with a confirmed zero. Acquisition is confirmed growing, so every day this stage stays broken converts more traffic into nothing.*

| # | Work item | Flaw | Priority | Why here |
|---|---|---|---|---|
| 1 | Retire the expired promotional offer and make expiry automatic | #3 | P0 | Certain evidence, trivial effort, actively working against live ad traffic right now. |
| 2 | Make the plans distinguishable in five seconds | #2 | P0 | Code-confirmed entitlement overlap plus direct production evidence of comparison-shopping at the payment window. |
| 3 | Deliver the value moment before the first upsell | #1 | P0 | Highest expected impact, lowest certainty about mechanism. Ships with instrumentation so it can be judged. |

### PHASE 2 — ACTIVATION

*337 users is the largest absolute loss in the funnel, and it sits immediately after a signup step that is confirmed working.*

| # | Work item | Flaw | Priority | Why here |
|---|---|---|---|---|
| 4 | Rebuild the first-run experience: one question, one action | #4 | P1 | Sequence the five competing entry modals; cut the tap count to the first test. |
| 5 | Instrument and move signup → first-test-start | #5 | P1 | The metric this phase is judged on. Baseline 50.6%. |
| 6 | Fix Current Affairs images and surface the free tier and Kural of the Day | #7 | P1 | A content defect sits directly on the daily-return hook. |

### PHASE 3 — RETENTION

*94.4% of completers never return. Fixing conversion without fixing this converts a growing base into a growing pile of one-session users.*

| # | Work item | Flaw | Priority | Why here |
|---|---|---|---|---|
| 7 | Build a return loop, and reward partial effort | #6 | P1 | Currently the habit system reinforces only completed tests. |
| 8 | Turn on checkout recovery and make coupon codes discoverable | #9 | P1 | 11 warm, price-accepted prospects and an entire promoter system sitting unused. |

### PHASE 4 — MEASUREMENT

*SEQUENCING CAVEAT: this phase is numbered fourth but items 9 and 10 arguably belong at position zero. Without a pricing-view event you cannot measure whether Phase 1 worked, and without attribution you cannot tell which channel produced any improvement. Treat the numbering as a dependency graph, not a queue.*

| # | Work item | Flaw | Priority | Why here |
|---|---|---|---|---|
| 9 | Close the event-tracking gaps | #13 | P1 | Pricing views, paid-format abandonment, Google signups, plan lifecycle events, premiumActive across all five plans. |
| 10 | Capture acquisition attribution at signup | #12 | P1 | Persist first-touch and last-touch source through signup → payment. |
| 11 | Redesign the feedback instrument to collect reasons, not only scores | #14 | P2 | 6 ratings and 0 words is not a satisfaction measurement. |

### PHASE 5 — ACQUISITION SCALE

*Deliberately last. Acquisition is the one part of this business that is already working. Scaling traffic into a funnel with 0.00% external conversion converts spend into nothing.*

| # | Work item | Flaw | Priority | Why here |
|---|---|---|---|---|
| 12 | Build the organic discovery surface | #10 | P2 | Per-product indexable landing pages, per-route metadata, topic content. |
| 13 | Make the product and its price publicly visible | #11 | P2 | A rankable, forwardable pricing page; confirm and complete app-store presence. |

> **Sequencing caveat.** Within-phase ordering is by effort and evidence confidence, not by proven causal sequence. The evidence supports the PHASE ordering (conversion is the confirmed zero; activation is the largest absolute loss; acquisition is already working). It does not support a claim that item 4 must ship before item 5. Do not treat the numbers as a proven critical path.

---

## Handoff blocks

### Flaw #1 — Weak value proposition & conversion experience  `P0`

| Field | Detail |
|---|---|
| **Feature / module** | First-session routing · Premium upsell · Landing & pricing surfaces |
| **Relevant components** | `Post-signup and post-result routing · the premium upsell component and its triggers · Revision and Insights modules · LandingPage.tsx · PricingCards.tsx` |
| **Tables / data** | `profiles (for an honest user count) · app_feedback (for an honest rating) · test_sessions (to know a user has completed a test)` |
| **Current behaviour** | The upsell appears in essentially every section from the first session onward. Revision and Insights are reachable but nothing routes users there. Neither the landing page nor the pricing cards contain any testimonial, rating or user count. |
| **Problem** | The product asks for money before demonstrating value, and offers no trust signal at the moment of asking. 366 signups in 30 days produced 0 paying customers. |
| **Expected behaviour** | After a first completed test the user is taken to Insights/Revision, not to an upsell. The upsell fires only once a purchase-intent or engagement condition is met. Landing and pricing surfaces state a real, sourced number. |
| **Analytics events required** | `value_moment_viewed (Revision, Insights) · pricing_viewed (from PricingCards) · upsell_shown with its trigger reason` |
| **Database data required** | A live count from profiles and a live average from app_feedback, so the social proof cannot go stale or become false. |
| **Success metric** | Externally-acquired paying customers > 0 (currently 0). Supporting: pricing-view → checkout-start becomes computable. |

**Acceptance criteria**

- [ ] A new user completing their first test lands on Insights or Revision.
- [ ] The upsell does not render for a user with zero completed tests.
- [ ] Landing and pricing surfaces display a real number sourced from live data, with its n stated.
- [ ] value_moment_viewed and pricing_viewed fire and are visible in the analytics pipeline.

*Full analysis: see Flaw #1 in `TNPSC_MENTORS_GROWTH_DASHBOARD.md`.*

---

### Flaw #2 — Confusing monetization & pricing structure  `P0`

| Field | Detail |
|---|---|
| **Feature / module** | Pricing & entitlements |
| **Relevant components** | `Server-side pricing constants · entitlement / bundle-access logic · PricingCards · PremiumCard · VettriCard · VettriSuggestModal` |
| **Tables / data** | `payments (notes->>'plan' — currently 4 distinct plan keys for 5 price points)` |
| **Current behaviour** | Five price points with genuinely overlapping entitlements. Premium ⊇ Rank Booster, Premium ⊇ Vettri, Vettri ⊉ Rank Booster, Mock Pack unlocks no bank at all. None of this is stated on the pricing screen. No default is recommended. |
| **Problem** | Users cannot tell the plans apart. One opened two plans' checkouts 12 seconds apart. premium_annual draws 57% of intent and has converted 0 of 12. |
| **Expected behaviour** | Each plan carries a one-line differentiator. A comparison matrix states inclusions and exclusions explicitly, generated from the same entitlement source the access-control code uses. One plan is presented as the recommendation. The Mock Pack name matches what it grants. |
| **Analytics events required** | `pricing_viewed · plan_card_viewed (per plan) · plan_card_clicked (per plan) · checkout_started already exists and is correct` |
| **Database data required** | Per-plan view → click → checkout-start → paid funnel. Split the vettri_nichayam ledger key so the ₹499 and ₹899 variants are separable going forward. |
| **Success metric** | premium_annual conversion > 0% (currently 0 of 12). Supporting: cross-plan checkout opens within 60 seconds fall toward zero. |

**Acceptance criteria**

- [ ] The comparison matrix is generated from the entitlement source, not hand-maintained.
- [ ] A user can state, from the pricing screen alone, whether Vettri includes Rank Booster.
- [ ] Per-plan view and click events fire.
- [ ] NO PRICE IS CHANGED and NO PLAN IS REMOVED as part of this work.

*Full analysis: see Flaw #2 in `TNPSC_MENTORS_GROWTH_DASHBOARD.md`.*

---

### Flaw #3 — Broken / expired promotional experience  `P0`

| Field | Detail |
|---|---|
| **Feature / module** | Promotional pricing |
| **Relevant components** | `Server-side pricing constants · the /rank-booster landing page` |
| **Tables / data** | `None — this is configuration, not data` |
| **Current behaviour** | Rank Booster is advertised at ₹1,249 from an ₹1,800 MRP as an "Independence Day offer valid till 31 Aug 2026". The offer expired; the price does not auto-revert; the code comment says the constant must be updated by hand. It was still live on 5 Sep. |
| **Problem** | A visibly expired deadline on the one page built to convert paid traffic. |
| **Expected behaviour** | Promotional configuration carries a start and end timestamp. Every promotional surface compares that window against now() at render time. When the window closes, the offer disappears and the price reverts with no human action. |
| **Analytics events required** | `rank_booster_landing_viewed, so the page finally has a denominator` |
| **Database data required** | None required. |
| **Success metric** | Expired offers displayed in production = 0 (currently 1). DEFINITIONAL target. |

**Acceptance criteria**

- [ ] No offer whose end timestamp has passed renders anywhere.
- [ ] Promotional copy and promotional price derive from the same configuration object.
- [ ] An automated check fails loudly when a promotional deadline is in the past.

*Full analysis: see Flaw #3 in `TNPSC_MENTORS_GROWTH_DASHBOARD.md`.*

---

### Flaw #4 — Poor first-time user experience  `P1`

| Field | Detail |
|---|---|
| **Feature / module** | First-run experience |
| **Relevant components** | `Post-signup routing · app entry sequence · the five entry modals (onboarding tour, starter-test prompt, push primer, marathon free alert, update prompt) · navigation to the test arena` |
| **Tables / data** | `profiles · test_sessions` |
| **Current behaviour** | A new user lands with no orientation. Up to five modals can fire on entry, each deciding independently to show itself. The first test is 3–4 taps away. |
| **Problem** | Interruption before intention. 337 of 682 users never start a test. |
| **Expected behaviour** | One question (which exam?), then one action (start this test). A single arbiter decides what may be shown on first entry; everything else defers. |
| **Analytics events required** | `onboarding_started · onboarding_step_completed · onboarding_completed · first_test_started · modal_shown with its identity` |
| **Database data required** | Modals shown per first session. Taps to first test. Time from signup to first test start. |
| **Success metric** | Signup → first-test-start on weekly signup cohorts. Baseline 50.6% (345 / 682). Cohorted, never blended. |

**Acceptance criteria**

- [ ] At most one modal is shown on first entry.
- [ ] A test can be started in one tap from the first post-signup screen.
- [ ] The first-run sequence emits events at every step, so the departure point is locatable.

*Full analysis: see Flaw #4 in `TNPSC_MENTORS_GROWTH_DASHBOARD.md`.*

---

### Flaw #5 — Weak activation  `P1`

| Field | Detail |
|---|---|
| **Feature / module** | Activation measurement & post-signup routing |
| **Relevant components** | `Post-signup routing · test-arena entry path · reporting layer` |
| **Tables / data** | `profiles (created_at) · test_sessions (started_at, status)` |
| **Current behaviour** | Activation is not defined, not measured and not reported. It is visible only as a lifetime aggregate derived by hand. There is no re-engagement path for a user who signs up and stops. |
| **Problem** | 337 of 682 registered users (49.4%) never start a test — the largest absolute loss in the funnel. |
| **Expected behaviour** | Activation is defined as first test STARTED, with first test COMPLETED tracked alongside. Both are reported as cohorted rates by signup week at a fixed cohort age. Time-to-first-test is measured. |
| **Analytics events required** | `first_test_started · first_test_completed (both as distinct one-time-per-user milestones)` |
| **Database data required** | min(test_sessions.started_at) − profiles.created_at per user. Cohorted activation by signup week. |
| **Success metric** | Signup → first test start % (currently 50.6%) and signup → first test completion % (currently 41.9%), both cohorted. BASELINE FIRST — no target until the cohorted baseline exists. |

**Acceptance criteria**

- [ ] Activation is reported as a cohorted rate, not a lifetime blend.
- [ ] Median time from signup to first test start is reported.
- [ ] The cohorted baseline is captured BEFORE any product change ships.

*Full analysis: see Flaw #5 in `TNPSC_MENTORS_GROWTH_DASHBOARD.md`.*

---

### Flaw #6 — Poor retention & habit formation  `P1`

| Field | Detail |
|---|---|
| **Feature / module** | Retention & habit loop |
| **Relevant components** | `daily_activity writers · submit_test (sole writer of streak/XP/badge state) · the spaced-repetition module (review_items) · notification surfaces` |
| **Tables / data** | `daily_activity · test_sessions · review_items · profiles` |
| **Current behaviour** | daily_activity is written only by test submission and current-affairs completion. Streaks, XP and badges are written only by submit_test — partial effort earns nothing. The spaced-repetition system generates return-worthy content and nothing surfaces it. No cohorted retention exists. |
| **Problem** | 270 of 286 completers (94.4%) never return. 16 of 682 users have ever had two active days. |
| **Expected behaviour** | "Active" reflects real engagement including study sessions that do not end in a submission. Partial effort earns habit credit. The spaced-repetition queue drives a concrete reason to return. D1/D3/D7/D14/D30 are reported by signup cohort. |
| **Analytics events required** | `session_started · material_viewed · revision_completed · streak_credited with its trigger reason` |
| **Database data required** | Cohorted retention by signup week. Both the narrow and broadened active definitions, reported in parallel during the transition. |
| **Success metric** | The first target is the existence of the retention curve. Return rate among completers is currently 5.6% (16 / 286) under the narrow definition. BASELINE FIRST after re-definition. |

**Acceptance criteria**

- [ ] D1/D3/D7/D14/D30 exist as reported metrics.
- [ ] Both active-user definitions are reported side by side for at least one full cycle.
- [ ] Partial effort produces habit credit without double-counting when the session is later submitted.

*Full analysis: see Flaw #6 in `TNPSC_MENTORS_GROWTH_DASHBOARD.md`.*

---

### Flaw #7 — Weak content engagement & surfacing  `P1`

| Field | Detail |
|---|---|
| **Feature / module** | Content: Current Affairs · Kural of the Day · free-tier communication |
| **Relevant components** | `Current Affairs module and its image/asset pipeline · Kural of the Day · post-signup and home surfaces · pricing screen` |
| **Tables / data** | `daily_activity (current-affairs completion is one of only two activity writers)` |
| **Current behaviour** | Current Affairs images do not load. Kural of the Day has no prompt or placement. The free tier — 50 signup credits plus 10/day, one free 200-question mock, one free attempt per topic — is not stated where a user would see it. |
| **Problem** | Content that would drive daily returns is broken or hidden, sitting directly on the retention hook. |
| **Expected behaviour** | Current Affairs images load. Kural of the Day has a daily surface. The free tier is stated plainly to new users. |
| **Analytics events required** | `content_viewed per module (Current Affairs, Kural, Materials) · asset_load_failed` |
| **Database data required** | Per-module usage counts. Current Affairs daily completion, which already writes to daily_activity and is simply not reported. |
| **Success metric** | Broken images in Current Affairs = 0 (DEFINITIONAL). Current Affairs daily completion becomes a reported metric. |

**Acceptance criteria**

- [ ] The image failure is reproduced, diagnosed and scoped BEFORE work is sized.
- [ ] An automated asset check catches broken content images.
- [ ] Free-tier contents appear on a surface a new user actually reaches.

*Full analysis: see Flaw #7 in `TNPSC_MENTORS_GROWTH_DASHBOARD.md`.*

---

### Flaw #8 — Extremely weak monetization performance  `P0`

| Field | Detail |
|---|---|
| **Feature / module** | Revenue reporting (outcome) |
| **Relevant components** | `revenue_metrics.sql · the payments ledger` |
| **Tables / data** | `payments` |
| **Current behaviour** | Four paid records: three staff comps at ₹0 and one founder-generated ₹899. Nothing in the schema distinguishes an internal comp from a real customer — that distinction lives in founder memory. premiumActive counts 1 of 5 plans. Comp grants write a synthetic order ID straight to paid and never produce a created row. |
| **Problem** | ₹0 externally-generated revenue. Reported as "1 paying customer, ₹899", the situation reads as early traction. It is not. |
| **Expected behaviour** | Externally-generated revenue is the headline figure. Internal and comp records are flagged in the data, not remembered. |
| **Analytics events required** | `None new — the payment events are correct.` |
| **Database data required** | An internal/comp flag on payment records. A per-plan revenue breakdown replacing or supplementing premiumActive. |
| **Success metric** | Externally-acquired paying customers > 0 (currently 0). This flaw has NO independent fix — it moves when flaws 1, 2, 3 and 9 move. |

**Acceptance criteria**

- [ ] External revenue is computable by query, with no founder input required.
- [ ] premiumActive counts all five plans, or is replaced by a per-plan breakdown.
- [ ] Comp records are visibly distinguishable from purchases.

*Full analysis: see Flaw #8 in `TNPSC_MENTORS_GROWTH_DASHBOARD.md`.*

---

### Flaw #9 — Unused conversion & recovery mechanisms  `P1`

| Field | Detail |
|---|---|
| **Feature / module** | Checkout recovery · coupons & promoters |
| **Relevant components** | `payments lifecycle (created rows have no terminal state) · coupon entry surface · promoter tracking (built, unused)` |
| **Tables / data** | `payments (20 created rows from 11 users) · coupons` |
| **Current behaviour** | No cleanup, retry, reminder or follow-up exists for an incomplete payment order. The oldest has been unresolved for 79 days. The coupon system is complete and server-validated with per-promoter tracking, and has zero redemptions in 83 days. coupon_viewed is not tracked. |
| **Problem** | 11 price-accepted, high-intent prospects with no recovery path, and an entire referral channel switched off. |
| **Expected behaviour** | A created row reaches a defined terminal state. A recovery sequence exists and is tracked: reminder → retry → support / value clarification → recovery tracking. Coupon entry is discoverable. |
| **Analytics events required** | `checkout_abandoned · recovery_prompt_shown · recovery_completed · coupon_viewed` |
| **Database data required** | The recovery funnel: checkout → payment created → paid → unrecovered. The crossover query: did any of the 11 later convert? |
| **Success metric** | Abandoned-checkout recovery rate becomes computable (currently it cannot be). Coupon redemptions > 0 (currently 0). |

**Acceptance criteria**

- [ ] Recovery TRACKING ships before recovery ACTION, so the first campaign is measurable.
- [ ] Payment orders older than a defined threshold reach a terminal state.
- [ ] A user can find where to enter a coupon code.
- [ ] NO USER IS CONTACTED as part of this audit. Whether to contact the 11 is the founder's decision.

*Full analysis: see Flaw #9 in `TNPSC_MENTORS_GROWTH_DASHBOARD.md`.*

---

### Flaw #10 — Weak organic discoverability  `P2`

| Field | Detail |
|---|---|
| **Feature / module** | SEO & public content |
| **Relevant components** | `Rendering architecture (SPA, no per-route server output) · routing · sitemap generation · existing JSON-LD (already correct)` |
| **Tables / data** | `None` |
| **Current behaviour** | 5 sitemap URLs — home plus 4 legal pages. Identical title and meta on every route. The 7 products named in the site's own structured data have no pages. Zero third-party mentions anywhere. |
| **Problem** | No compounding organic discovery surface. Nothing is shareable as itself. |
| **Expected behaviour** | An indexable landing page per named product, per-route metadata via prerendering or SSR, and topic pages built from content the app already produces. |
| **Analytics events required** | `Server-side pageview logging, so organic traffic is knowable at all.` |
| **Database data required** | Organic sessions and ranked queries — neither currently exists. |
| **Success metric** | Organic sessions and ranked query count — both currently DATA NOT AVAILABLE. Judge on sessions, never on page count. |

**Acceptance criteria**

- [ ] Each of the 7 named products has its own indexable URL with unique metadata.
- [ ] A shared link unfurls with the correct title and description.
- [ ] SEQUENCING: this is Phase 5. It ships AFTER conversion and activation.

*Full analysis: see Flaw #10 in `TNPSC_MENTORS_GROWTH_DASHBOARD.md`.*

---

### Flaw #11 — Poor public product & commercial visibility  `P2`

| Field | Detail |
|---|---|
| **Feature / module** | Public pricing page · app-store presence |
| **Relevant components** | `A prerendered /pricing route (the SPA cannot serve one today) · the IAP product catalogue · native build configuration` |
| **Tables / data** | `None` |
| **Current behaviour** | Pricing renders only inside the app shell — CONFIRMED. No app-store listing was found — UNCONFIRMED, and contradicted by real IAP product IDs in the codebase. |
| **Problem** | A buyer cannot learn the price without registering. App-store discoverability is an open question that has been open since Stage 1. |
| **Expected behaviour** | A public, prerendered, indexable /pricing route. A definite answer on app-store publication status. |
| **Analytics events required** | `public_pricing_viewed` |
| **Database data required** | App install count, if a listing exists. |
| **Success metric** | A public pricing URL exists, is indexed, and unfurls correctly (DEFINITIONAL). App-store status is a known fact rather than an open question (DEFINITIONAL). |

**Acceptance criteria**

- [ ] GET THE APP-STORE ANSWER FIRST. Do not build a submission plan for an app that may already be published, and do not state publicly that the app is absent.
- [ ] The pricing route is prerendered, not client-rendered, or it will be as invisible as everything else on the domain.
- [ ] Ship alongside the plan-clarity work in Flaw #2 — publishing a confusing plan structure more widely does not help.

*Full analysis: see Flaw #11 in `TNPSC_MENTORS_GROWTH_DASHBOARD.md`.*

---

### Flaw #12 — No acquisition attribution  `P1`

| Field | Detail |
|---|---|
| **Feature / module** | Acquisition attribution |
| **Relevant components** | `Landing surface (capture before client routing strips the query string) · signup flow · handle_new_user() trigger path · client-side first-touch persistence` |
| **Tables / data** | `profiles (needs the columns) · payments (needs source carried through)` |
| **Current behaviour** | No utm_source, utm_medium, utm_campaign, utm_content or referrer column exists anywhere in the schema. Confirmed by exhaustive search. 100% of 682 signups are unattributed. |
| **Problem** | The best acquisition month on record — 396 signups in August — cannot be explained or deliberately repeated. |
| **Expected behaviour** | First-touch and last-touch source captured separately, persisted across sessions, written to the profile at signup, and carried through to the payments row. |
| **Analytics events required** | `Attribution parameters attached to sign_up and to purchase.` |
| **Database data required** | utm_source, utm_medium, utm_campaign, utm_content, referrer, landing page, first-touch, last-touch. |
| **Success metric** | 100% of NEW signups carry a first-touch source (currently 0%). DEFINITIONAL. Historical attribution is an explicit non-target. |

**Acceptance criteria**

- [ ] Capture happens on the landing surface, before routing strips the query string.
- [ ] First touch survives across sessions — a user landing from Instagram and registering two days later is attributed to Instagram, not to direct.
- [ ] Source is present on the payments row, so channel → revenue is joinable.
- [ ] NO ATTEMPT is made to reconstruct historical attribution. It is unrecoverable and any estimate would be fabrication.

*Full analysis: see Flaw #12 in `TNPSC_MENTORS_GROWTH_DASHBOARD.md`.*

---

### Flaw #13 — Incomplete product analytics & event tracking  `P1`

| Field | Detail |
|---|---|
| **Feature / module** | Analytics & event instrumentation |
| **Relevant components** | `authStore.ts (trackSignUp) · PricingCards (pricing_viewed) · MockQuizPage.tsx (abandon beacon) · revenue_metrics.sql (premiumActive) · daily_activity writers · bundleAccess() (plan lifecycle)` |
| **Tables / data** | `test_sessions · daily_activity · payments · profiles` |
| **Current behaviour** | pricing_viewed does not fire from PricingCards. record_abandoned_test has one call site on the free engine only. trackSignUp fires on one of two auth paths. premiumActive counts 1 of 5 plans. daily_activity has two writers. No subscription lifecycle events. No server-side pageview store. |
| **Problem** | The funnel has no top and no checkout denominator, paid-format abandonment is invisible, and the founder's paid figure understates reality. |
| **Expected behaviour** | Every funnel stage has a numerator and a denominator. All four paid formats log abandonment. Both auth paths fire a signup event. premiumActive covers all five plans. Plan lifecycle is written as events. |
| **Analytics events required** | `pricing_viewed · sign_up (Google path) · test_abandoned (Mock, Vettri, Rank Booster, Test Series) · subscription_renewed / expired / cancelled · server-side pageview` |
| **Database data required** | A complete funnel with valid denominators at every stage. |
| **Success metric** | Paid formats logging abandonment 4 of 4 (currently 0). Auth paths firing signup 2 of 2 (currently 1). premiumActive 5 of 5 plans (currently 1). All DEFINITIONAL. |

**Acceptance criteria**

- [ ] SHIP pricing_viewed FIRST — it gates the evaluation of all of Phase 1.
- [ ] New events follow the existing single-choke-point pattern; no second analytics path is introduced.
- [ ] Broadening the active definition is accompanied by parallel reporting of both definitions for one full cycle.
- [ ] The paid-format abandon beacon is the only non-trivial item — those screens have no exit affordance today.

*Full analysis: see Flaw #13 in `TNPSC_MENTORS_GROWTH_DASHBOARD.md`.*

---

### Flaw #14 — Weak customer feedback & behavioural intelligence  `P2`

| Field | Detail |
|---|---|
| **Feature / module** | Customer feedback |
| **Relevant components** | `FeedbackModal and its gating (client and server) · app_feedback schema · new prompt surfaces at abandonment moments · Clarity GTM configuration (outside the repository)` |
| **Tables / data** | `app_feedback (6 rows, 0 with text)` |
| **Current behaviour** | The prompt appears once, home screen only, after 2 completed tests, non-admins only, then is suppressed 3 months. The 2-test gate alone excludes 396 of 682 users. The instrument collects a rating and no text. |
| **Problem** | 6 ratings and 0 words from 682 users. There is no qualitative user data in the system at all. |
| **Expected behaviour** | The instrument collects a rating plus "What did you like?" and "What should we improve?", with "Why didn't you upgrade?" asked of users who reached pricing or abandoned checkout. Prompts reach the abandonment populations, not only the engaged ones. |
| **Analytics events required** | `feedback_prompt_shown · feedback_submitted with response type` |
| **Database data required** | Free-text responses. Feedback segmented by funnel stage, so the never-activated and never-returned populations are reachable. |
| **Success metric** | Responses carrying written text > 0 (currently 0). DEFINITIONAL. Response rate (0.88%) is secondary to text capture. |

**Acceptance criteria**

- [ ] Free text is captured and has a reading path, or it will accumulate unread.
- [ ] Gating is relaxed enough to reach non-activated users without recreating the popup-overload problem in Flaw #4.
- [ ] Any social proof drawn from ratings states its n honestly.
- [ ] NO USER IS CONTACTED as part of this audit.

*Full analysis: see Flaw #14 in `TNPSC_MENTORS_GROWTH_DASHBOARD.md`.*

---

## Instrumentation checklist — the events that gate everything else

| Event | Status today | Why it matters |
|---|---|---|
| `sign_up` | Partial | ONE call site: the password/WhatsApp-OTP path. A Google-created account fires only trackLogin("google") and is indistinguishable from a returning user. Every signup number in GA4/Meta undercounts by however many people use Google. |
| `test_abandoned` | Partial | Mock, Vettri, Rank Booster and Test Series have no exit button and no abandon call. A rage-quit on content someone PAID for leaves zero trace. The reported 161 abandonments cover only the free engine. |
| `pricing_viewed` | Partial | NOT confirmed to fire from the in-app PricingCards screen. This is why the checkout stage of the funnel has no denominator. |
| `subscription_renewed / expired / cancelled` | No | Plan expiry is computed on read via bundleAccess(), never written as an event. Renewal and churn are therefore unmeasurable. |
| `utm_source / medium / campaign / referrer` | No | Exhaustive schema search returned one non-match. Historical channel attribution is unrecoverable for every past period. |
| `Server-side pageview / visitor count` | No | The funnel has no top. Visitor volume is knowable only through GA4, which cannot be joined to who actually paid. |

> **Ship `pricing_viewed` first.** Without it the checkout stage of the funnel has no denominator, and the entire Phase 1 conversion effort would be unfalsifiable.

---

## Metric definition defects to correct

| Metric | Where | Defect | Consequence |
|---|---|---|---|
| `premiumActive` | `revenue_metrics.sql` | Filters notes->>'plan' = 'premium_annual' only — 1 of 5 plans. Vettri, Rank Booster and Mock Pack customers do not count toward the founder's own headline paid figure. | The business reads smaller to its own founder than it is. Currently masked by there being almost no customers; becomes actively misleading the moment conversion moves. |
| `Active today / Active 7d` | `get_platform_metrics()` | Filters daily_activity with a bare current_date (UTC session clock) while every write stamps activity_date in IST. | Real in code. NOT currently distorting anything: production returned identical values under UTC and IST (2 and 17). Downgraded from the P0 assigned in Stage 2 to P3. |
| `"Active" itself` | `daily_activity` | Written only by test submission and current-affairs completion. Reading materials, browsing, reviewing bookmarks — none of it counts. | Every engagement and retention number in this report is a floor. |
| `Tests abandoned (161)` | `test_sessions.status` | Only the free practice engine can ever write this status. | Cannot answer "do paying customers finish what they bought." |
| `Total questions (49,916)` | `questions` | Unfiltered by the questions.active soft-hide flag the student-facing sampler actually applies. | Overstates the live servable question pool by an unknown amount. |
| `passed_80_percent` | `test_sessions column name` | The enforced attendance gate is 25%, not 80%. The name is historical. | Anyone reading this column will misinterpret it. Registered P3 — out of scope for this dashboard, listed here for completeness. |

---

## Closed — do not spend engineering time here

| Hypothesis | Why it is closed |
|---|---|
| ~~Broken checkout~~ | Tested to the final payment step on a real device — works correctly. This was the leading hypothesis going into Stage 3 and it failed. |
| ~~Signup friction~~ | Verified working by walkthrough and founder. The 337 activation loss occurs after a clean registration. |
| ~~Payment infrastructure~~ | Zero failed payments in 83 days. HMAC verification, idempotency and server-side re-fetch are sound. |
| ~~Frontend performance~~ | ~221 KB gzipped JS + 20 KB CSS, hashed and immutably cached. Measured directly. |
| ~~Consent gating suppressing analytics~~ | The banner was removed by product decision; trackers now fire for ~100% of web sessions. |
| ~~"The free tier is too generous"~~ | Never supported by evidence. The walkthrough took two full tests and still felt no urge to upgrade — absent value perception, not excess generosity. |
| ~~Paying users are 8× more engaged~~ | RETRACTED. The comparison measured staff accounts building and testing the product. |

---

## Success metrics, consolidated

| Metric | Current | Target | Type | Flaw |
|---|---|---|---|---|
| Externally-acquired paying customers | 0 | > 0 | DEFINITIONAL | #8 |
| Expired offers visible in production | 1 (Rank Booster, expired 31 Aug 2026) | 0 | DEFINITIONAL | #3 |
| Signup → first test start | 50.6% | BASELINE FIRST — TARGET TO BE SET AFTER EXPERIMENT | EXPERIMENT | #5 |
| Signup → first test completion | 41.9% | BASELINE FIRST — TARGET TO BE SET AFTER EXPERIMENT | EXPERIMENT | #5 |
| D1 / D3 / D7 / D14 / D30 retention | DATA NOT AVAILABLE | Instrumented and reported weekly | DEFINITIONAL | #6 |
| Return rate (2+ active days, completers) | 5.6% | BASELINE FIRST — TARGET TO BE SET AFTER EXPERIMENT | EXPERIMENT | #6 |
| Pricing-view → checkout-start rate | UNMEASURABLE — no pricing_viewed event | Measurable | DEFINITIONAL | #13 |
| Paid formats logging abandonment | 0 of 4 | 4 of 4 | DEFINITIONAL | #13 |
| premiumActive plan coverage | 1 of 5 plans | 5 of 5 | DEFINITIONAL | #13 |
| Signups carrying an acquisition source | 0% | 100% of NEW signups | DEFINITIONAL | #12 |
| Coupon redemptions | 0 | BASELINE FIRST — TARGET TO BE SET AFTER EXPERIMENT | EXPERIMENT | #9 |
| Abandoned-checkout recovery rate | UNMEASURABLE — no recovery mechanism exists | Measurable, then BASELINE FIRST | EXPERIMENT | #9 |
| Feedback response rate | 0.88% | BASELINE FIRST — TARGET TO BE SET AFTER EXPERIMENT | EXPERIMENT | #14 |
| Feedback responses carrying written text | 0 | > 0 | DEFINITIONAL | #14 |
| Indexable product pages | 5 sitemap URLs (home + 4 legal) | BASELINE FIRST — TARGET TO BE SET AFTER EXPERIMENT | EXPERIMENT | #10 |

---

**REPORT/DASHBOARD GENERATED USING READ-ONLY DATA. NO PRODUCTION CODE, DATABASE, CONFIGURATION OR DEPLOYMENT WAS MODIFIED.**
