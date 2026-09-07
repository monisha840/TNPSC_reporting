# TNPSC Mentors — Stage 2 Growth Diagnosis

**What the actual codebase and database say — validated, not assumed**

Stage 1 was an outside-in audit of the public site. This is an inside-out diagnosis, built by reading the real application: `github.com/riyazlive04/TNPSC-Academy` (React/Vite SPA + Express API + Supabase/Postgres), read-only, no changes made. Every finding below is labelled so you can see exactly how sure we are.

## Report metadata

- **Repo read:** full `src/`, `server/`, `supabase/` trees (read-only clone)
- **Not accessible this round:** live database rows, Super Admin login, Microsoft Clarity
- **Founder-provided baseline:** Total users 681 · Active today 0 · Active 7d 15 · Completed 459 · Abandoned 161 · Questions 49,916 · Rating 4.33 · Feedback 6
- **Date context:** 5 Sep 2026

## Confidence key

- **FACT** — directly read in source code or SQL — a claim you can hand to an engineer to verify in one lookup
- **OBSERVATION** — a pattern in the code worth noting, not yet a causal claim
- **HYPOTHESIS** — a reasoned, evidence-linked guess — unconfirmed without live data
- **RECOMMENDATION** — a proposed change
- **TARGET / SCENARIO** — an illustrative "if X then Y" calculation — not a forecast
- **DATA NOT AVAILABLE** — cannot be answered without DB/Clarity access — stated explicitly, never guessed

---

## 1 · Executive Summary — 2 · Current Business Health

### The product is far more built-out than the numbers suggest. The bottleneck is visibility, not value.

**What's happening:** a mature app — five separate paid products, a credit-metered free tier, streaks/XP/badges, spaced repetition, daily current affairs, a working coupon and referral-payout system, native iOS/Android purchase infrastructure — is showing a Super Admin dashboard that reads as almost lifeless (15 of 681 accounts "active" in 7 days, 0 today). **Why:** a meaningful share of that reading is the dashboard's own measurement, not the business — one of the two "active" numbers is fed by a confirmed timezone bug, the "abandoned" count structurally can't include a single one of the five paid content formats, and the revenue dashboard's headline "active premium" figure only counts one of five paid plans. Underneath the measurement problems, the real, code-confirmed gaps are: zero social proof anywhere on the acquisition surface, zero first-party attribution (no channel/UTM data captured anywhere in the database), and a live, currently-expired discount offer sitting on the app's only dedicated paid-ads landing page.

**Where the biggest leakage is:** we cannot compute a real acquisition→paid funnel this round — that requires live database rows this session doesn't have access to (see §4, §26). What we *can* say with confidence is that the instrumentation needed to ever answer that question for the paid formats specifically (Mock/Vettri/Rank Booster/Test Series) does not exist yet — see §10.

**What to do first:** three trivial, high-confidence fixes before any strategic redesign — see Top 10 Actions #1–#3. **Expected opportunity:** stated only as labelled scenarios in §19 — no guaranteed outcomes.

---

## Front-loaded per your request (see §20) — Top 10 Actions Most Likely to Increase Paid Users

Ranked by Expected Impact × Confidence ÷ Effort. The first three are code-confirmed bugs fixable in minutes; the rest need either a product decision or the live-data access flagged in §26.

### 1. The only dedicated paid-ads landing page is showing an expired discount
**Priority:** P0 · **Evidence:** FACT

`/rank-booster` — the page the code itself labels "the Meta ad landing target" — advertises ₹1,249 (from an ₹1,800 MRP) as an "Independence Day offer valid till 31 Aug 2026." Today is 5 Sep 2026. `server/src/pricing.ts`'s own comment says the price "is not auto-reverting; update this constant by hand when the offer window ends." Nobody has.

- **Root cause:** Hand-maintained offer constant with no expiry automation
- **Change:** Update copy/price now; add a check that compares the offer deadline to `now()`
- **Effort:** Trivial — a config edit
- **Confidence:** High — directly observed in code + current date
- **Before:** anyone landing from a live ad sees a "sale ends" date that already passed.
- **After:** the offer is either genuinely live or clearly retired — nothing stale-looking sits on the one page built to convert paid traffic.
- **KPI:** rank-booster page → checkout-start rate. **Measurement:** once §10's instrumentation exists, or via GA4 `view_content`→`initiate_checkout` on this page today.

### 2. "Active Today / Active 7d" is fed by a timezone bug
**Priority:** P0 · **Evidence:** FACT

`get_platform_metrics()` filters `daily_activity` with a bare `current_date` (the DB session's UTC clock), while every write to that table stamps `activity_date` in IST. For roughly 5.5 hours of every day (IST 00:00–05:30), a test finished "today" in India can fall outside `current_date`'s reckoning — producing an "Active Today = 0" reading even with real same-day activity.

- **Root cause:** No `at time zone 'Asia/Kolkata'` cast in this one query
- **Change:** Match the query to the write path's IST cast
- **Effort:** Trivial — one SQL migration
- **Confidence:** High — mismatch directly confirmed by reading both sides
- **Before:** the founder's own trust in every other Overview number is undermined by one visibly-broken one.
- **After:** "Active Today/7d" reads what actually happened in India, every day, without an unlucky-hour caveat.

### 3. Every paid exam format is structurally invisible to abandonment tracking
**Priority:** P0 · **Evidence:** FACT

The `'abandoned'` status can only ever be written by `record_abandoned_test()`, and its one client call-site (an explicit Exit→Discard / Back-confirm flow) exists *only* on the free/credit-metered practice engine (`/quiz`). Mock exams, Vettri, Rank Booster and Test Series (`/mock/quiz`) have no exit button and no abandon call at all — a rage-quit on content someone paid for leaves zero trace.

- **Root cause:** Abandon-tracking was built once, for one engine, and never extended
- **Change:** Add an abandon/heartbeat beacon to `MockQuizPage.tsx`, mirroring the practice engine
- **Effort:** Small–medium
- **Confidence:** High — confirmed by reading every call site
- **Before:** cannot tell whether paying customers are finishing what they bought.
- **After:** real abandonment-rate visibility on the exact content revenue depends on — the precondition for §13's free-vs-paid behavioral analysis.

### 4. Google sign-ups are invisible to the signup funnel
**Priority:** P1 · **Evidence:** FACT

`trackSignUp()` has exactly one call site (the password/WhatsApp-OTP path). A brand-new Google-created account only ever fires `trackLogin('google')` — indistinguishable from a returning user. Any GA4/Meta "signups" number today undercounts by however many people use Google.

- **Effort:** Trivial — one added call in `authStore.ts`
- **Confidence:** High

### 5. Zero first-party attribution exists anywhere
**Priority:** P1 · **Evidence:** FACT

No `utm_source`/`medium`/`campaign`/referrer column exists in the entire schema (exhaustive grep, one non-match). Channel performance today depends entirely on GTM/GA4/Meta's own dashboards, which can't be joined back to who actually paid.

- **Change:** Capture UTM/referrer at signup; join to `payments` later for real channel ROI
- **Effort:** Small–medium

### 6. Zero social proof on the acquisition surface
**Priority:** P1 · **Evidence:** FACT

Grepped `LandingPage.tsx` and `PricingCards.tsx` in full for testimonial/rating/user-count language — nothing. Meanwhile a real `app_feedback` table already holds a 4.33 average (thin at n=6, but real and growable), and 681 real signups exist to eventually cite.

- **Change:** State a real number honestly today ("681 aspirants already practicing"); add ratings/testimonials as feedback volume grows
- **Effort:** Small

### 7. Five overlapping paid plans may be too much to parse in one sitting
**Priority:** P2 · **Evidence:** HYPOTHESIS

Premium / Vettri-full / Vettri-month / Rank Booster / Mock Pack, with genuinely intricate inclusion rules (Premium includes Rank Booster free; Vettri does not). The app already ships a mitigation — `VettriSuggestModal` downsells to the cheaper plan first — suggesting the team already senses this. Plausible, not proven.

- **Needs:** Per-plan-card view/click/purchase funnel data (depends on #3's instrumentation pattern extended to pricing UI)
- **Effort:** Medium — don't redesign blind

### 8. The founder's own "active premium" number hides 4 of 5 paid products
**Priority:** P1 · **Evidence:** FACT

`revenue_metrics.sql`'s `premiumActive` filters `notes->>'plan' = 'premium_annual'` only. Vettri, Rank Booster and Mock Pack customers — real, paying — don't count toward that specific figure, even though `payingCustomers`/`paidOrders` nearby do include them. Risk: the business looks smaller to its own founder than it is.

- **Effort:** Trivial — widen the filter or add a per-plan breakdown

### 9. The Rank Booster revoke tool will crash the moment it's used
**Priority:** P2 · **Evidence:** FACT

`superadmin_revoke_rank_booster()` writes `status='revoked'`, a value the `payments` table's own check-constraint doesn't permit (only `created/paid/failed`). Not growth-critical, but it's a live admin-tool bug someone will hit during a refund dispute.

- **Effort:** Trivial — widen the constraint

### 10. Test the Stage-1 "activation threshold" hypothesis with data already being collected
**Priority:** P2 · **Evidence:** RECOMMENDATION

The app already tracks Starter-Challenge completion and first-test-bonus grants. Cross-referencing "did this user finish their first test" and "days to first test" against `payments` would directly test whether early completion predicts paying — the moment live DB access exists (§26), this is a same-day query, not a new build.

- **Effort:** Small, once DB access exists

---

## 3 · Validate the Super Admin numbers — 4 · Application Architecture — Data Availability

### What "681 users" and "15 active" actually mean

Every number below traces to one Postgres function, `get_platform_metrics()` (`supabase/superadmin.sql`), called by `GET /api/superadmin/metrics`. Nothing here required live data — the query definitions themselves are the evidence.

| Dashboard figure | Exact source | True definition | Reliable? |
|---|---|---|---|
| **Total users = 681** | `count(*) from profiles` | Every account row ever created. No filter. No soft-delete/test-account column exists on `profiles` at all — nothing is ever pruned. | **FACT-Reliable** as "lifetime signups." **HYPOTHESIS-Not reliable** as "current/live users" — includes staff accounts and every signup that never returned. |
| **Active today = 0** | `count(distinct user_id) from daily_activity where activity_date = current_date` | "Active" = completed a test or answered CA-daily questions (the only two writers of `daily_activity`) — a real study event, not a login/page-hit. | **HYPOTHESIS-Not reliable** — confirmed timezone mismatch: the column is written in IST, the query filters in the DB's UTC session clock. Can read 0 with real same-day activity. |
| **Active last 7 days = 15** | Same table, `activity_date >= current_date - 6` | Same "active" definition, 7-day window. | **OBSERVATION-Partially reliable** — same tz bug dilutes one boundary day out of seven; directionally meaningful, exact count is shifted. |
| **Tests completed = 459** | `count(*) from test_sessions where status='completed'`, set only inside the `submit_test` RPC | Any test that reached a submit call and got graded — any score, any category, even far below the attendance gate. **Correction to the founder's mental model:** the code's own comment confirms the enforced attendance gate is **25%**, not 80% — the DB column/field names ("`passed_80_percent`") are historical and misleading. | **FACT-Reliable** — single writer, unambiguous definition. |
| **Tests abandoned = 161** | `count(*) from test_sessions where status='abandoned'`, set only by `record_abandoned_test()` | An explicit Exit→Discard or Back→confirm-leave action — **only reachable from the free practice-quiz engine**. Mock/Vettri/Rank-Booster/Test-Series can never produce this status (see Top 10 #3). A silently killed app/tab/network produces no row in *either* bucket. | **HYPOTHESIS-Not reliable** as a general abandonment rate — it is a lower bound on practice-engine quits only, blind to every paid format and every silent quit. |
| **Total questions = 49,916** | `count(*) from questions` | Every question row ever inserted — not filtered by the real `questions.active` soft-hide flag that the actual student-facing quiz sampler *does* filter on. | **OBSERVATION-Not reliable** as "questions students can currently be served" — likely overstates the live pool by including retired/hidden rows. |
| **Average rating = 4.33 / Feedback = 6** | `avg(rating)` / `count(*) from app_feedback` | An overall app-satisfaction star rating (not per-question). The only entry point, `FeedbackModal`, is deliberately rare: appears once, only on the home screen, only after 2 completed tests, only for non-admins, then suppressed 3 months per user (client *and* server enforced). | **FACT-Reliable** as a literal count. **OBSERVATION-Statistically thin** at n=6, and the low volume reflects a buried prompt design choice, not necessarily low satisfaction. |

### Application architecture — what actually exists

| Layer | Confirmed modules (code-read) | Notable finding |
|---|---|---|
| **Public** | Landing page, Login, Register, Forgot/Reset Password, standalone `/rank-booster` ad-landing page, Policy pages (privacy/guidelines/payment/refund/delete-account) | No dedicated "Pricing" URL — pricing only renders inside the app shell (`PricingCards`), consistent with Stage 1's finding of no indexable pricing page. |
| **Student** | Test Arena (PYQ ×3 groups, Samacheer, Current Affairs, Aptitude, Thirukural), Quiz engine, Mock/Vettri/Rank-Booster/Test-Series exams, Result, Insights, Revision (spaced repetition), Daily CA, Materials, Bookmarks, Profile, Messages, Notifications | Far more feature-complete than the original build-spec (`context.md`) describes — that file is a stale early plan, not current-state documentation. |
| **Super Admin** | Overview, Revenue, Users, Coupons, Notify, Feedback, Reports, Notes, App (release mgmt), Mock Exams, Test Series, Vettri, Materials, CA Magazine, CA Slides, CA Questions | All 13 modules the founder named exist, plus 3 more not mentioned (CA Slides, CA Questions, App/release management). |

### Data availability

Confirmed to exist in the schema, with historical range unknown (requires live query): `profiles`, `test_sessions`, `test_answers`, `questions` (+active flag), `payments` (unified ledger, all providers), `coupons`, `app_feedback`, `daily_activity`, `review_items` (spaced revision), `audit_log`.

**Confirmed NOT to exist anywhere:** any events/analytics table, any UTM/referrer/acquisition-source column, any session-recording linkage, any soft-delete/account-status column.

**[DATA NOT AVAILABLE]** this round for all of them: row counts, date ranges, and joins — this session has no live database connection (see §26).

---

## 5 · Funnel — 6 · Segmentation — 7–9 · Acquisition / Activation / Engagement — 10 · Abandonment — 11 · Retention/Cohorts — 15 · Clarity

### The funnel, mapped to real tables — and what's genuinely missing

Sixteen stages, each mapped to its actual data source in this codebase. Marked **[DATA NOT AVAILABLE]** where the row-level numbers require live DB access this session doesn't have.

| Stage | Real data source (confirmed in code) | Status |
|---|---|---|
| Visitor | GTM/GA4/Meta Pixel only — no server-side pageview store | **[DATA NOT AVAILABLE]** Needs GA4 export |
| Signup started | `track('signup_form_submit')` ad-hoc GA4 event, `RegisterPage.tsx` | **[DATA NOT AVAILABLE]** Needs GA4 export |
| Signup completed | `profiles` insert via `handle_new_user()` trigger; `trackSignUp()` — **fires only for password/OTP signups, not Google** | **[DATA NOT AVAILABLE]** Row count needs DB access |
| Onboarding (Starter Challenge) | `onboardingStore` arm/consume flags; `first_test_bonus` grant | **[DATA NOT AVAILABLE]** Needs DB access |
| First test started / completed | `test_sessions.started_at` / `status='completed'`, per-user `min()` | **[DATA NOT AVAILABLE]** Needs DB access |
| Returning user | `daily_activity`, distinct `activity_date` per user | **[DATA NOT AVAILABLE]** Needs DB access (and Top 10 #2 fixed first) |
| Pricing viewed | `trackViewContent` — fires on Register page load and Rank-Booster landing only; **not confirmed to fire from the in-app `PricingCards` screen itself** | **[OBSERVATION]** Likely incomplete instrumentation |
| Checkout started | `trackInitiateCheckout` — `PremiumCard`, `VettriCard`, `useMockPackPurchase`, `useRankBoosterPurchase` | **[DATA NOT AVAILABLE]** Needs GA4/Meta export or DB access |
| Payment initiated / success / failed | `payments.status` ∈ {created, paid, failed} — single unified ledger, all providers | **[DATA NOT AVAILABLE]** Needs DB access |
| Paid subscription | `payments` joined to plan via `notes->>'plan'` — 5 distinct plan IDs, not 1 | **[DATA NOT AVAILABLE]** Needs DB access |
| Repeat usage / renewal | `daily_activity` post-purchase; plan expiry vs. repurchase in `payments` | **[DATA NOT AVAILABLE]** Needs DB access |

**The one funnel ratio computable today** (from the founder-provided baseline, with the caveats above attached): 459 completed + 161 abandoned = 620 terminal-state sessions against 681 total accounts ≈ **0.91** sessions-with-an-outcome per account, lifetime. **[OBSERVATION]**, not a conclusion — consistent with a large share of the 681 accounts having tried roughly one test each, but this cannot distinguish "one-and-done" from "recently joined and hasn't had time yet" without signup-date cohorting (§11, data not available).

### Segmentation — what's actually possible from the schema

**Possible today [FACT]:**
- **By exam group** — `profiles.target_group` ∈ Group1/Group2_2A/Group4_VAO, set at signup.
- **By role** — `profiles.role` ∈ user/admin/superadmin.
- **By plan** — `payments.notes->>'plan'`, 5 values.
- **By activity level** — derivable from `daily_activity` row counts per user once queried.

**Not possible — no data captured [DATA NOT AVAILABLE]:**
- **By acquisition source** — no UTM/referrer column anywhere (Top 10 #5).
- **By device/OS** — `lib/device.ts` only stores an opaque login-cap UUID, no platform/OS field is persisted anywhere queryable.

### Test abandonment — why users abandon (practice engine only)

The only population that can appear in the 161 figure is free/credit-gated practice-quiz sessions. Within that scope, code confirms exactly two causes, both **intent/UX**, not technical or content-difficulty: (1) tapping the Exit button and choosing "Discard" over "Evaluate," or (2) pressing back and confirming "leave this test."

**[DATA NOT AVAILABLE]** for: which specific tests/topics cluster abandonment, what question-number people quit at, time-spent-before-quitting, device split, or whether any of it is technical-error-driven — all of this requires querying real `test_sessions` rows, which this session cannot do.

**[HYPOTHESIS]**, not evidence: because credits are charged at test *start* (not completion) "to prevent gaming," a user who exits early has already spent the credit — this could itself be a source of frustration that increases the odds of a discard-quit look, but no user complaint text was available to confirm it (feedback message contents were not read this round).

### Retention / cohorts

**[DATA NOT AVAILABLE]** — D1/D7/D14/D30 and cohort tables require grouping live `daily_activity` and `payments` rows by signup week/month, which needs the DB access flagged in §26.

What code confirms structurally **[FACT]**: streaks/XP/badges are written *only* by `submit_test` — an abandoned or silently-killed session earns zero habit-loop credit, even if 20 questions were answered first.

**[HYPOTHESIS]**: this asymmetry (finish-anything beats quit-with-progress) may quietly suppress return visits after a bad first session, since nothing in the reward system acknowledges partial effort.

### Microsoft Clarity

**[DATA NOT AVAILABLE]** — no Clarity login this round (per your answer to the earlier access question). Clarity is loaded as a GTM container tag, not called directly anywhere in this codebase, so its firing rules live in the GTM dashboard, outside this repo, and could not be audited from source either.

---

## 12 · Monetization — 13 · Free vs Paid — Payment Analysis

### Five products, one ledger, and a pricing surface more intricate than it looks

| Plan | Price | Validity | What it actually unlocks |
|---|---|---|---|
| Starter (Free) | ₹0 | Forever | 50 signup + 10/day credits (1 credit/question), 1 free 200-Q mock ever, 1 free attempt per PYQ/CA topic, on-screen explanations |
| Group 1 Mock Test Pack | ₹399 | 80 days | Boosted daily credit grant (50/day vs 10) — does *not* unlock unlimited access, just a bigger drip |
| Vettri Nichayam (monthly) | ₹499 | 30 days | Full access to the Vettri/Test-Marathon bank — does **not** include Rank Booster |
| Vettri Nichayam (full) | ₹899 | 60 days | Same as above, better per-day rate |
| Rank Booster (Group 2/2A) | ₹1,249 (MRP ₹1,800 — "offer valid till 31 Aug 2026," now expired, see Top 10 #1) | 90 days | 23-test Group II/IIA series — a separate product from Vettri, unlimited credits |
| Premium Prelims Kit | ₹1,699 | 180 days | Superset — includes Vettri-equivalent access **and** Rank Booster for free, unlimited credits |

**[OBSERVATION]** the entitlement math is genuinely non-obvious: Premium ⊇ Rank Booster and Premium ⊇ Vettri, but Vettri ⊉ Rank Booster, and Mock Pack unlocks neither, just more credits. The app already mitigates this once (a downsell modal nudging Premium-curious buyers toward cheaper Vettri first) — a sign the team has already sensed the complexity. **[HYPOTHESIS]**, unconfirmed: this complexity itself measurably suppresses conversion (Top 10 #7) — testable only once per-plan-card funnel data exists.

### Payment funnel — states that actually exist

`payments.status` ∈ `{created, paid, failed}` — a single ledger across Razorpay (web), Apple/Google IAP (native), and superadmin/coupon comps. Verification is real (HMAC signature + idempotency + a server-side re-fetch confirming Razorpay's own `captured`/`authorized` state before crediting) — **[FACT]**, not a rubber-stamp integration.

**[OBSERVATION]**: a runtime inconsistency exists — `superadmin_revoke_rank_booster()` writes a 4th status, `'revoked'`, that the table's own check-constraint doesn't allow (Top 10 #9).

**[DATA NOT AVAILABLE]**: actual counts of created/paid/failed, per-plan breakdown, coupon usage volume, and the free-vs-paid behavioral comparison Stage 2 asked for (tests started/completed, sessions, time-to-payment, device) — all require live rows from `payments` joined to `test_sessions`, which this session cannot query. The exact SQL to run the moment DB access exists: join `payments(status='paid')` to `test_sessions`/`daily_activity` by `user_id`, compare against a matched sample of accounts with zero paid rows.

### Why aren't users paying? — evidence-graded, not assumed

**Supported by code [OBSERVATION]:** Zero trust/social-proof signal at the exact moment of paying (no testimonials/ratings/user-counts anywhere on pricing surfaces).

**Supported by code [OBSERVATION]:** The one dedicated paid-ads page currently shows a stale/expired offer — actively working against conversion right now, not hypothetically.

**Plausible, unconfirmed [HYPOTHESIS]:** Five overlapping plans create decision friction (needs per-plan funnel data).

**Weakened by code, not eliminated [HYPOTHESIS]:** "Free tier fully satisfies intent" (Stage 1's Cause #6) — the free tier is generous in *breadth* (many topics reachable) but tight in *depth* (1 attempt per topic, 1 mock ever) — a motivated aspirant plausibly exhausts it fast. Needs real credit-exhaustion data to confirm either way.

**Ruled out for lack of evidence, not ruled out for real [DATA NOT AVAILABLE]:** checkout friction, payment failures, wrong pricing, wrong audience — the payment flow itself (signature verification, idempotency, failure logging) reads as solid engineering; nothing in the code points to technical checkout friction as a likely cause, but this is an absence of evidence, not evidence of absence, without real failed-payment volume.

---

## 16 · Public Audit Validation

### Revisiting the Stage 1 findings against real code

| Stage 1 finding | Verdict | Why |
|---|---|---|
| Low discoverability (thin sitemap, no reviews) | **PARTIALLY CONFIRMED** | External evidence (zero third-party mentions) stands untouched. But the codebase reveals deep native-app purchase infrastructure (real store product IDs registered) that Stage 1 didn't know existed — whether the app is actually live/published under those IDs is **[DATA NOT AVAILABLE]** without asking you directly. |
| Weak third-party presence | **CONFIRMED** | External fact, unaffected by codebase access. |
| Generic SPA metadata (identical titles per route) | **CONFIRMED, unchanged** | Direct HTTP evidence from Stage 1; not re-examined this round, nothing found to contradict it. |
| Shareability problems | **CONFIRMED, unchanged** | Same root cause as above. |
| Limited social proof | **CONFIRMED — upgraded from Inferred to Fact** | Stage 1 could only infer this from a failed JS-render fetch. This round directly read `LandingPage.tsx`/`PricingCards.tsx` source: zero testimonial/rating/user-count text exists anywhere. |
| App Store / Play Store discoverability | **NEEDS DATA** | Web search still found no public listing (unchanged from Stage 1) — but the code shows real IAP product catalog entries (`com.tnpscmentor.app.premium90`, etc.) tied to store product IDs. This only works if the app is at least registered in App Store Connect / Play Console. **Direct question for you:** is the app live/published today, under what name, and what's the install count? |
| Analytics consent gating undercounts Clarity | **PARTIALLY REFUTED** | The gating mechanism is real in code, but the visible consent banner was removed by product decision — every web visitor now auto-accepts on page load. In current practice, trackers fire for ~100% of sessions; the specific "banner abandonment" loss Stage 1 flagged isn't actually happening. A different, confirmed gap replaces it: Google-signups mistracked as logins, and zero server-side attribution at all (Top 10 #4, #5). |
| Frontend performance (bundle size) | **CONFIRMED, unchanged** | Not re-examined this round (out of scope for this pass); nothing in the codebase read contradicts Stage 1's direct network measurement. |

---

## 17 · Root Cause Tree — 18 · Biggest Bottlenecks — 19 · Quantified Opportunities

### Root cause tree — where the branches actually lead, based on evidence gathered so far

```
LOW REVENUE
├── LOW PAID USERS
│   ├── LOW TRAFFIC ................... confirmed external (Stage 1) — thin organic/app-store footprint
│   ├── LOW SIGNUP CONVERSION ......... data not available — needs GA4 export or DB access
│   ├── LOW ACTIVATION ................ data not available — but habit-loop only rewards completion, never partial effort (fact)
│   ├── LOW ENGAGEMENT ................ data not available — 15/681 reading is tz-bug-affected (fact), true figure unknown
│   ├── LOW RETENTION ................. data not available — no cohort query possible this round
│   └── LOW PAYMENT CONVERSION ........ zero social proof + expired ad-landing offer (fact) — trust/clarity friction, not a broken checkout
└── LOW REVENUE / PAID USER
    ├── Pricing ........................ 5 products, real prices ₹399–₹1,699 — reasonable vs. ₹15,000 coaching-centre comparison the app itself cites
    ├── Plan mix ....................... "premiumActive" metric only sees 1 of 5 plans (fact) — true paid-user count may already be larger than the dashboard implies
    ├── Discounts ...................... Rank Booster's headline discount is currently expired copy (fact)
    └── Renewal ........................ data not available — needs live payments history
```

**Biggest bottleneck, ranked by what's actually provable today:**

1. **Measurement itself** — three separate dashboard/analytics figures are confirmed wrong or incomplete (Active Today, abandonment scope, premiumActive), meaning no one can currently trust the numbers enough to make a confident second decision.
2. **Trust/clarity at the point of conversion** — zero social proof, plus a live expired offer, on the surfaces built specifically to convert.
3. **Acquisition attribution** — zero ability to tell which channel, if any, is worth spending more on.

Everything downstream of these three (retention, cohort quality, free-tier tuning) cannot be responsibly diagnosed until they're fixed, because the data needed to diagnose them either doesn't exist yet or can't be trusted yet.

### Quantified opportunity — labelled scenarios only

**[TARGET / SCENARIO]** — illustrative arithmetic, not a forecast, using the founder-provided baseline with its caveats intact:

| Scenario | Assumption | Illustrative result |
|---|---|---|
| Current (as reported) | 681 accounts, 15 "active" (7d, tz-bug affected), 620 terminal-state sessions | 0.91 sessions/account lifetime — baseline for comparison only |
| If the tz bug alone were fixed | Same underlying activity, corrected measurement window | "Active Today/7d" would read closer to true same-day/weekly activity — **[SCENARIO]**, magnitude unknown without re-querying post-fix |
| If paid-content abandonment were instrumented for 1 month | Mock/Vettri/Rank-Booster sessions start producing real completion/abandon rows | Founder gains, for the first time, a real denominator for "did paying customers finish what they bought" — **[SCENARIO]**, no rate assumed |

Deliberately not populated with invented signup/paid/revenue percentages — Stage 1 already published an editable calculator for exactly that purpose once real numbers are available; repeating placeholder math here would misrepresent this codebase-evidence report as having live figures it doesn't.

---

## 20 · P0–P3 Roadmap

| # | Priority | Confidence | Effort | Item |
|---:|---|---|---|---|
| 1 | P0 | High | Trivial | Fix the expired Rank Booster offer |
| 2 | P0 | High | Trivial | Fix the Active-Today/7d timezone bug |
| 3 | P0 | High | Small–medium | Instrument abandonment for all paid exam formats |
| 4 | P1 | High | Trivial | Fix Google-signup tracking gap |
| 5 | P1 | High | Small–medium | Capture UTM/referrer attribution |
| 6 | P1 | High | Small | Add real social proof to landing/pricing |
| 7 | P1 | High | Trivial | Fix "premiumActive" to cover all 5 plans |
| 8 | P2 | Medium | Medium | Instrument and test the 5-plan complexity hypothesis before redesigning pricing |
| 9 | P2 | Medium | Small | Test the activation-threshold hypothesis (Top 10 #10) once DB access exists |
| 10 | P2 | High | Trivial | Fix the payments 'revoked' status / check-constraint bug |
| 11 | P3 | Medium | Medium | Extend habit-loop credit to partial-effort abandoned sessions (retention hypothesis) |

---

## 21 · CRO — 22 · Marketing Strategy

### Now that the bottlenecks are evidenced — where to actually point effort

Ad spend is deliberately not recommended to increase until Top 10 #1 and #3 are shipped — you'd be filling a funnel you can't yet see the bottom of.

### Promoter / referral coupons — *Ready to switch on*
A real, working coupon system already exists with per-promoter redemption tracking (`topPromoters` is a live field in `revenue_metrics`). This is not a build — it's a "recruit promoters" problem.
- WHO: coaching-centre staff, YouTube/Telegram creators in the TNPSC space
- OFFER: a tracked code, revenue-shared or flat per paid referral
- KPI: `couponOrders`, `topPromoters` (already computed)

### Meta ads → `/rank-booster` — *Fix before scaling*
The page and pixel plumbing (`InitiateCheckout`, `CompleteRegistration` on purchase) are already wired correctly. The only active problem is the expired offer (Top 10 #1) actively working against whatever spend is already happening.
- KPI: page → checkout-start rate, once the offer is current

### Any new paid channel (Google Ads, Instagram) — *Needs attribution first*
Without UTM capture (Top 10 #5), new spend here can't be measured against who actually pays — instrument first, spend second.

### Content built from what already exists — *Low-cost, code-adjacent*
Daily current-affairs and the Vettri/Rank-Booster exam schedules are real, dated content already produced for the app — repurposing them as public SEO/social content (per Stage 1's SEO-1 recommendation) costs no new content production, only publishing.

---

## 17 (instrumentation) · Analytics Instrumentation — 24 · Growth Dashboard Spec

### What's already firing vs. what to add

| Event | Status | Note |
|---|---|---|
| `page_view` | **[FACT] Live** | Every SPA route change, web + native excluded correctly |
| `sign_up` | **[OBSERVATION] Partially live** | Password/OTP only — Google gap (Top 10 #4) |
| `login`, `start_test`, `submit_test`, `view_result` | **[FACT] Live** | Single, correct choke-points each |
| `test_abandoned` | **[OBSERVATION] Partially live** | Practice engine only — every paid format missing (Top 10 #3) |
| `pricing_viewed` | **[OBSERVATION] Unconfirmed** on the in-app pricing screen | Only confirmed on Register-page load and the Rank-Booster landing page |
| `checkout_started`, `payment_success`/`failed`, `purchase` | **[FACT] Live** | Single choke-point in `razorpay.ts`/IAP flow |
| `subscription_cancelled/expired/renewed` | **[DATA NOT AVAILABLE] Not found in code** | Plan expiry is computed on read (`bundleAccess()`), not written as an event |
| `coupon_viewed/applied` | **[FACT] Applied is live** (server-validated) | "Viewed" not separately tracked |
| UTM/campaign/traffic_source parameters | **[DATA NOT AVAILABLE] Not found anywhere** | Top 10 #5 — the single highest-leverage instrumentation gap |

**Growth Dashboard spec:** Stage 1's calculator artifact already provides an editable Executive-KPI/funnel/revenue layout; once live DB access exists, the highest-value addition specific to this codebase is a **per-plan** breakdown (not just "premium") everywhere the current dashboard collapses to one number, plus a corrected IST-aware activity query, plus a paid-format abandonment column that doesn't exist today.

---

## 25–27 · 30/60/90-Day Plan — 30 · Data Gaps

### Sequenced so measurement is trustworthy before strategy changes

### Days 1–30
- Fix the expired Rank Booster offer (Top 10 #1)
- Fix the Active-Today/7d timezone bug (#2)
- Fix Google-signup tracking (#4)
- Fix "premiumActive" to cover all 5 plans (#8)
- Fix the payments 'revoked' constraint bug (#9)
- Grant this session (or a follow-up) live read access to Supabase to unblock everything marked "data not available" above

### Days 31–60
- Instrument abandonment for Mock/Vettri/Rank-Booster/Test-Series (#3)
- Capture UTM/referrer attribution (#5)
- Add real social proof to landing/pricing (#6)
- Re-run this diagnosis's funnel/cohort/free-vs-paid sections with real rows

### Days 61–90
- Test the 5-plan complexity hypothesis with real per-plan funnel data (#7)
- Test the activation-threshold hypothesis (#10)
- Scale the promoter/coupon channel and paid ads only once the above confirm a healthy funnel underneath

### Data gaps — exactly what unlocks the rest of this diagnosis

Live read access to Supabase (even a read-only role) to run the joins named throughout this report; Super Admin login or a CSV export of `payments`/`test_sessions`/`daily_activity`; Microsoft Clarity access; confirmation of whether the native app is actually published today and under what name/install count; and the actual text of the 6 `app_feedback` messages, which is qualitative signal this session never read.

---

## Final Rule — Direct Answers, A–J

**A. #1 reason users are not paying**
Not provable as a single fact without live funnel data — but the strongest evidence-backed read is **trust/clarity friction at the point of decision**: zero social proof anywhere, plus a live, currently-expired discount on the one page built specifically to convert. The paid content itself (Vettri/Rank Booster/Premium) is real, reasonably priced, and well-engineered — this doesn't look like a value problem.

**B. #1 reason users are not active**
Partly a measurement artifact: the "15/681" figure is confirmed affected by a timezone bug. Net of that, no evidence points to a dramatically different true number — but there's also no evidence the underlying engagement is actually strong; this genuinely needs the fix + a re-read.

**C. #1 acquisition problem**
Zero first-party attribution. Combined with Stage 1's confirmed near-zero organic/app-store footprint, the business cannot currently see which channel, if any, is worth funding further.

**D. #1 retention problem**
**[DATA NOT AVAILABLE]** for a confirmed answer. Structurally plausible (Hypothesis): the habit-loop only rewards finished tests, never partial effort — a bad first session earns zero reinforcement to return.

**E. #1 product/UX problem**
The pricing/entitlement surface's complexity (5 overlapping plans) at the exact moment of conversion — compounded, right now, by the expired offer sitting on top of it.

**F. #1 marketing opportunity**
The promoter/coupon system is already fully built and tracked (`topPromoters`) — this is a "recruit people" problem, not an engineering one, and the fastest lever available today.

**G. What to fix FIRST**
The three P0 code-confirmed bugs (expired offer, timezone bug, missing paid-format abandonment tracking) — all trivial-to-small effort, all foundational to trusting every decision made after them.

**H. What NOT to waste effort on**
Don't redesign pricing or rebuild the free tier on guesswork — the "free tier satisfies everyone" hypothesis is only weakly supported once you see the real per-topic/per-mock limits. Don't increase ad spend on `/rank-booster` until the offer is fixed and paid-format abandonment is visible. Don't touch frontend performance — confirmed fine in Stage 1, nothing here contradicts that.

**I. What data are we still missing**
Live Supabase read access; Super Admin/Clarity access; whether the native app is actually published and its install count; the content of the 6 feedback messages.

**J. Metrics to monitor weekly, post-fix**
Signups split by method (password/OTP vs. Google, once fixed); IST-corrected Active Today/7d; completed vs. abandoned split by category (practice vs. paid, once instrumented); `payingCustomers`/`paidOrders` across all 5 plans; `revenueWeek`; `couponOrders`/`topPromoters`; `/rank-booster` views→checkout-starts; feedback count/rating trend.

---

*Read-only analysis of github.com/riyazlive04/TNPSC-Academy — no code or data was modified. Figures marked "data not available" require live database, Super Admin, or Clarity access this session does not have.*
