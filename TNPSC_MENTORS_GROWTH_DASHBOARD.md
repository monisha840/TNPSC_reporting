# TNPSC Mentors — Growth & Product Health Dashboard

> **THIS REPORT WAS GENERATED USING READ-ONLY DATA.**
> **NO PRODUCTION CODE, DATABASE, CONFIGURATION OR DEPLOYMENT WAS MODIFIED.**

**Audit period:** 14 Jun 2026 → 5 Sep 2026
**Production snapshot:** 5 Sep 2026, 19:01 IST (read-only SELECT)
**Compiled:** 7 Sep 2026
**Sources:** Stage 1 external audit · Stage 2 codebase & schema audit · Stage 3 production database (read-only SELECT) · first-time-user walkthrough · latest acquisition verification · latest feedback verification · founder-provided context

**Companion files:** `TNPSC_MENTORS_DASHBOARD.html` (interactive) · `TNPSC_MENTORS_DEVELOPER_HANDOFF.md` · `TNPSC_MENTORS_GROWTH_DATA.csv` · `TNPSC_MENTORS_CHARTS/`

---

## Contents

- [1. Executive overview](#1-executive-overview)
- [2. What is actually happening](#2-what-is-actually-happening)
- [3. Core funnel](#3-core-funnel)
- [4. Activation](#4-activation)
- [5. Retention](#5-retention)
- [6. Monetization](#6-monetization)
- [7. Acquisition](#7-acquisition)
- [8. Analytics health](#8-analytics-health)
- [9. Customer feedback](#9-customer-feedback)
- [10. The 14 major flaws](#10-the-14-major-flaws)
- [11. Complete user journey](#11-complete-user-journey)
- [12. Root cause tree](#12-root-cause-tree)
- [13. Priority matrix](#13-priority-matrix)
- [14. What to fix first](#14-what-to-fix-first)
- [15. Before → after KPI model](#15-before--after-kpi-model)
- [16. 30 / 60 / 90 day plan](#16-30--60--90-day-plan)
- [17. Data sources & methodology](#17-data-sources--methodology)
- [18. Data quality](#18-data-quality)
- [19. The real business problem](#19-the-real-business-problem)

---

## 1. Executive overview

**682 registered users. 83 days. ₹899 of all-time revenue — and every rupee of it internally generated. Externally-acquired paying customers: 0. In the last 30 days, 366 people signed up and none of them paid anything.**

### Current verified baseline — PRODUCTION VERIFIED

| Metric | Value | Evidence | Source | What it means |
|---|---|---|---|---|
| Registered users | **682** | PROD | `profiles — count(*)` | Every account row ever created. No soft-delete column exists, so nothing is ever pruned. Includes staff accounts. |
| Started ≥1 test | **345** | PROD | `test_sessions — distinct user_id` | 50.6% of 682. |
| Completed ≥1 test | **286** | PROD | `test_sessions status='completed' — distinct user_id` | 41.9% of 682; 82.9% of the 345 who started. |
| Returned on a second day | **16** | PROD | `daily_activity — users with ≥2 distinct activity_date` | FLOOR, not a measurement — daily_activity is written only by test submission and current-affairs completion. |
| Checkout users | **11** | PROD | `payments — distinct user_id on created rows` | Price-accepted purchase attempts: a created row is written server-side only after a confirmation dialog showing plan and final price. |
| Checkout attempts | **20** | PROD | `payments status='created', never completed` | 20 abandoned attempts. Adding the 1 completed payment gives 21 total price-accepted attempts — see the payments reconciliation. |
| Genuine paying customers | **1** | PROD | `payments — non-zero amount, status=paid` | Founder-generated, not acquired. Externally-acquired paying customers = 0 (founder-confirmed). |
| All-time revenue | **₹899** | PROD | `payments — sum(amount) = 89,900 paise` | Externally-generated revenue = ₹0. |
| Failed payments | **0** | PROD | `payments status='failed'` | Zero in 83 days. Razorpay integration is sound — this is not a payment-infrastructure problem. |
| Coupon redemptions | **0** | PROD | `payments — used_coupon across every plan` | The coupon and promoter system is fully built, including per-promoter tracking, and has never been used once. |
| Feedback responses | **6** | PROD | `app_feedback — count(*)` | 0.88% of 682 users. All six are star ratings; none carries written text. |

### Last 30 days

| Metric | Value |
|---|---|
| Signups, last 30 days | **366** |
| New paying customers from them | **0** |
| Signups, last 7 days | **50** |

### Secondary production figures

| Metric | Value | What it actually means |
|---|---|---|
| Active today | 2 | Identical under UTC and IST — the Stage 2 timezone bug is real in code but is not currently distorting this figure. |
| Active last 7 days | 17 | Identical under UTC and IST. 2.5% of 682. |
| Active last 30 days | 135 | 19.8% of 682. The 30d→7d ratio is 12.6%. |
| Tests completed | 462 | Terminal sessions, any score, any category. |
| Tests abandoned | 161 | Free practice engine ONLY. Paid formats structurally cannot produce this status. |
| Tests in progress | 0 | Dead schema — sessions are written already-final. |
| Questions in bank | 49,916 | Unfiltered by the questions.active soft-hide flag the student sampler actually uses — overstates the live pool. |
| Average rating | 4.33 | n = 6. Not statistically meaningful. |
| Payment records = paid | 4 | 3 staff comps at ₹0 + 1 founder-generated ₹899. |

---

## 2. What is actually happening

**Acquisition is growing. Everything downstream of it is not.**

The single most important thing to understand about this business is that the problem is NOT a lack of traffic.

Signups grew every full month measured: 226 in July, 396 in August — the best month on record — and 366 in the last 30 days. Something in acquisition is working.

In those same 30 days, zero of those 366 people paid anything.

The bottleneck is conversion, activation and retention, in that order of certainty. Conversion is a confirmed zero: nobody outside the building has ever paid for this product. Activation loses 49.4% of everyone who registers. Retention loses 94.4% of everyone who completes a test.

Every technical explanation that was available has been tested and disproved. Checkout works — it was driven to the final payment step on a real device. Payment infrastructure has recorded zero failures in 83 days. Signup works. Frontend performance is fine. The failure is not in the machinery.

The single most diagnostic observation in the entire audit came from the walkthrough: after two completed tests the tester felt no desire to pay — but after reaching Revision and Insights, said "I feel good." The product does contain a persuasive value moment. It arrives late, by accident, and after the paywall has already been shown repeatedly.

```
366 new users in the last 30 days
        ↓
0 new paying customers
```

### Signup trajectory

```
June         19  ██  ← PARTIAL
July        226  ███████████████████████
August      396  ████████████████████████████████████████
September    45  █████  ← PARTIAL
```

| Month | Signups | Days | Per day | Note |
|---|---|---|---|---|
| June 2026 **(PARTIAL)** | 19 | 17 | 1.1 | Partial month — the platform's first signup is 14 Jun 2026, so June covers 17 days, not 30. |
| July 2026 | 226 | 31 | 7.3 | First full month. 6.5× June's daily rate. |
| August 2026 | 396 | 31 | 12.8 | Best month on record. +75.2% over July (396 / 226). |
| September 2026 **(PARTIAL)** | 45 | 5–7 | 6.4 – 9.0 | PARTIAL MONTH. The exact query cut-off date is not recorded (5–7 Sep), so the implied daily rate is a range, not a point. This is NOT a collapse — it is 5–7 days of a 30-day month. |

> **September is a partial month.** September shows 45 signups. That is 5–7 days of a 30-day month, NOT a collapse. Comparing a partial month to a full one is the most common way to misread this chart, and it would lead directly to the wrong decision — pouring effort into acquisition, which is the one part of this business that is already working.

> **Reconciliation: monthly totals vs. the 682 baseline**
> The monthly breakdown sums to 686 (19 + 226 + 396 + 45), against a stated registered-user baseline of 682. The 4-user difference is consistent with the two queries having been run on different dates — the baseline snapshot is timestamped 5 Sep 2026 19:01 IST, while the acquisition query extends to the latest available production date. The exact run timestamp of the monthly query is NOT recorded.
> **DATA GAP — minor. It does not affect any conclusion in this report: every conclusion drawn from the monthly series is about shape and direction, not about the fourth significant figure. No figure has been adjusted to force the totals to agree.**

### How to read the trend

| Label | Statement |
|---|---|
| **FACT** | Acquisition grew every full month measured: 19 (17 days) → 226 → 396. August is the best month on record. |
| **FACT** | 366 users signed up in the last 30 days and none of them paid. |
| **CAUTION** | September's 45 signups cover 5–7 days of a 30-day month. Reading it as a decline is a partial-period error. September must not be compared to a full month. |
| **OBSERVATION** | Derived from the two windows (assuming both end on the same date): the last 7 days ran at 7.1 signups/day, while days 8–30 ran at 13.7/day. A single 7-day window is not a trend and this is well inside normal weekly variation for a base this size. |
| **DATA GAP** | No weekly time series was supplied, so the 7-day observation above cannot be confirmed or dismissed. A week-by-week signup query is the cheapest way to close it. |
| **DATA GAP** | Source attribution is absent for every one of these signups. It is not known whether August's 396 came from Instagram, Telegram, YouTube, referral, organic or direct — see Flaw #12. |

---

## 3. Core funnel

```
682   Registered users
 ↓    −337
345   Started ≥1 test              50.6% of 682
 ↓    −59
286   Completed ≥1 test            82.9% of 345 · 41.9% of 682
 ↓    −270
 16   Returned on a 2nd day        5.6% of 286 · 2.3% of 682   [FLOOR]

      ✗ PRICING VIEWED — DATA NOT AVAILABLE (not instrumented)
      ✗ NO VALID DENOMINATOR ACROSS THIS BOUNDARY

 11   Reached checkout             11 people / 21 attempts · 1.6% of 682
 ↓    −20 attempts
  1   Paid                         9.1% of 11 people · 4.8% of 21 attempts
 ↓    −1 (founder-generated)
  0   EXTERNALLY-ACQUIRED PAID     0.00% of 682
```

| Stage | Count | Of previous | Of 682 | Drop | Source | Confidence |
|---|---|---|---|---|---|---|
| Visitors | DATA NOT AVAILABLE | — | — | — | GA4/GTM only — no server-side pageview store exists | DATA NOT AVAILABLE |
| Signup completed | 682 | — | 100% | — | profiles | ACTUAL |
| Started ≥1 test | 345 | 50.6% of 682 | 50.6% | −337 | test_sessions | ACTUAL |
| Completed ≥1 test | 286 | 82.9% of 345 | 41.9% | −59 | test_sessions | ACTUAL |
| Returned on a 2nd day | 16 | 5.6% of 286 | 2.3% | −270 | daily_activity | ACTUAL (FLOOR) |
| Pricing viewed | DATA NOT AVAILABLE | — | — | — | not instrumented on the in-app PricingCards screen | DATA NOT AVAILABLE |
| Checkout started | 11 people / 21 attempts | — | 1.6% of 682 | — | payments.created | ACTUAL |
| Payment completed | 1 | 9.1% of 11 people · 4.8% of 21 attempts | 0.15% of 682 | −20 attempts | payments.paid | ACTUAL |
| Externally-acquired paid | 0 | 0% of 1 | 0.00% of 682 | −1 | founder-confirmed | ACTUAL |

### Denominator rules — read before quoting any percentage

- The funnel has no top. Visitor and pricing-view counts do not exist, so no stage above signup and no stage immediately above checkout can be expressed as a conversion rate.
- Stages 2–5 (682 → 345 → 286 → 16) share a valid nested denominator: each population is a strict subset of the one above it, measured in the same tables.
- Stage 7 (checkout) breaks the chain. The 11 checkout users are NOT established as a subset of the 16 returners. Any "16 → 11" arrow would be an invented relationship.
- Returner counts are a floor. daily_activity is written only by test submission and current-affairs question completion.
- 53.7% of the registered base (366 of 682) signed up within the last 30 days, so a material share of the 682 has had limited time to return at all. Retention percentages measured against the full base understate the mature-cohort rate by an unknown margin.

### Per-stage notes

| Stage | Note |
|---|---|
| Visitors | Top-of-funnel volume is unrecoverable for every historical period. The funnel below therefore starts at signup and has no true acquisition denominator. |
| Signup completed | Signup itself is confirmed working — verified end-to-end during the walkthrough and by the founder. Every loss below happens after a clean registration. |
| Started ≥1 test | The largest absolute loss in the funnel: 337 registered users never start a single test. |
| Completed ≥1 test | Once a user starts, they usually finish. Test-taking itself is not the problem. |
| Returned on a 2nd day | Largest proportional loss: 94.4%. This is a floor — a user who logs in and reads materials without submitting a test is not counted as active at all. |
| Pricing viewed | The single most damaging measurement gap in the funnel: the checkout stage below has no denominator. It is unknown how many of the 682 ever saw a plan. |
| Checkout started | CANNOT be expressed as a percentage of the previous stage. The 11 checkout users are not known to be a subset of the 16 returners — no query has established the overlap. Nor is there a pricing-view denominator. |
| Payment completed | One transaction, one plan, one buyer. |
| Externally-acquired paid | The single revenue-bearing record was founder-generated. In 83 days, nobody has discovered this product independently, valued it, and paid for it. |

---

## 4. Activation

**337 of 682 registered users — 49.4% — have never started a single test.** This is the largest absolute loss anywhere in the funnel, and it happens after a signup that is confirmed working.

```
682 registered
345 started       50.6%
337 did NOT start 49.4%   ← 337 / 682 = 49.4%
286 completed     41.9% of 682 · 82.9% of the 345 who started
```

> **Disproved — do not spend effort here.** Signup friction was the obvious explanation and it is wrong. Registration was verified working end-to-end by the walkthrough and confirmed by the founder. All 337 of these users completed a clean registration and then stopped, which points squarely at orientation rather than at the signup form.

### Recommended KPIs

| KPI | Current | Calculation | Target |
|---|---|---|---|
| Signup → first test start | 50.6% | `345 / 682` | BASELINE FIRST — TARGET TO BE SET AFTER EXPERIMENT |
| Signup → first test completion | 41.9% | `286 / 682` | BASELINE FIRST — TARGET TO BE SET AFTER EXPERIMENT |
| Median time signup → first test start | DATA NOT AVAILABLE | `requires min(test_sessions.started_at) − profiles.created_at per user` | Instrument, then baseline |

Both rates must be measured on **weekly signup cohorts**, never as a lifetime blend — 53.7% of the base registered in the last 30 days, so a blended figure will not move visibly even if the product change works.

---

## 5. Retention

**270 of 286 test-completers — 94.4% — never came back on a second day. Only 16 of 682 users have ever had two active days.**

| Basis | Calculation | Rate | Reading |
|---|---|---|---|
| Returners / test-completers | `16 / 286` | **5.6%** | The honest activation-conditioned rate: of users who actually completed a test, 5.6% came back on another day. |
| Returners / all registered | `16 / 682` | **2.3%** | The whole-base rate. Lower, because it includes 337 users who never started a test and so were never in a position to return. |
| Never returned / completers | `270 / 286` | **94.4%** | The largest proportional loss anywhere in the funnel. |
| Active last 30 days | `135 / 682` | **19.8%** |  |
| Active last 7 days | `17 / 682` | **2.5%** |  |
| 7-day / 30-day active ratio | `17 / 135` | **12.6%** | A decay signal — but also consistent with a fast-growing base where recent joiners have not yet had time to return. |

### Cohort retention

| Cohort day | Value |
|---|---|
| D1 | **DATA NOT AVAILABLE** |
| D3 | **DATA NOT AVAILABLE** |
| D7 | **DATA NOT AVAILABLE** |
| D14 | **DATA NOT AVAILABLE** |
| D30 | **DATA NOT AVAILABLE** |

The query has not been run. The underlying data exists in `daily_activity` and `profiles` — this is a reporting gap, not a data gap, and it is the single cheapest way to separate real churn from cohort immaturity.

### Caveats that must travel with every number above

- daily_activity is written ONLY by test submission and current-affairs question completion. A user who logs in, browses materials, reads the CA magazine or reviews bookmarks — but submits no test — is not counted as active at all. Every retention figure here is a FLOOR, not a measurement.
- 53.7% of the base (366 of 682) registered in the last 30 days. Some of the "never returned" population has simply not had much time yet. Cohorted retention (D1/D3/D7/D14/D30 by signup week) is the only honest way to separate churn from immaturity, and it has not been run.
- 83 days is a short window. Some apparent decay is normal cohort maturation.
- The habit loop reinforces only completion. Streaks, XP and badges are written exclusively by submit_test — a user who answers 20 questions and quits earns nothing.

---

## 6. Monetization

### Revenue

| Metric | Value | Evidence | Note |
|---|---|---|---|
| All-time revenue | **₹899** | PROD | 89,900 paise. One transaction. |
| Externally-generated revenue | **₹0** | FOUNDER | The only revenue-bearing record was founder-generated. |
| Revenue per day | **₹10.83** | DERIVED | ₹899 / 83 days. |
| ARPU (all registered users) | **₹1.32** | DERIVED | ₹899 / 682. |
| AOV | **₹899** | DERIVED | Single transaction — AOV and revenue are the same number. |
| Annualised run-rate | **≈ ₹3,953** | DERIVED | ₹899 / 83 × 365. SCENARIO — arithmetic on a single transaction, not a forecast. |
| Refunds | **0** | PROD |  |
| Failed payments | **0** | PROD | In 83 days. The payment rail works. |
| Coupon-attributed revenue | **₹0** | PROD | Zero redemptions in 83 days. |
| Revenue concentration | **100%** | DERIVED | One plan, one transaction, one internally-generated buyer. |

### Internal vs. external customers

| Segment | Count | Revenue | Evidence | Note |
|---|---|---|---|---|
| Total records marked paid | 4 | ₹899 | PROD |  |
| Internal staff comps (₹0) | 3 | ₹0 | FOUNDER | Founder-confirmed team members. Recorded as premium_annual with ₹0 revenue. |
| Founder-generated customer | 1 | ₹899 | FOUNDER | Arithmetic on aggregates: exactly one payment record carries a non-zero amount, and the founder states the single paying customer was generated internally — so that record is necessarily the one. No attempt has been made to guess which user ID it is. |
| Founder-side referral | PENDING | PENDING | GAP | PENDING IDENTIFICATION — identifiers not yet supplied by the founder. |
| Externally-acquired paying customers | 0 | ₹0 | FOUNDER | The headline metric of this audit. |

### Conversion, every way it can honestly be expressed

| Basis | Calculation | Rate |
|---|---|---|
| All paid records / all users | `4 / 682` | **0.59%** |
| Revenue-generating / all users | `1 / 682` | **0.15%** |
| Externally acquired / all users | `0 / 682` | **0.00%** |
| Paid / checkout people | `1 / 11` | **9.1%** |
| Paid / checkout attempts | `1 / 21` | **4.8%** |
| Paid / last-30-day signups | `0 / 366` | **0.00%** |

With 21 checkout attempts and 1 conversion, **no per-plan or overall rate is statistically meaningful**. These are demand signals, not rates.

### Plan comparison matrix

| Plan | Price | Duration | Target audience | Features / included tests | Credits | Rank Booster | Vettri | Mock | Attempts | Paid | Revenue |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Starter (Free) | ₹0 | Forever | Everyone — the acquisition tier | 50 signup credits + 10/day (1 credit per question), on-screen explanations · 1 free attempt per PYQ / CA topic | 50 + 10/day | No | No | 1 free 200-Q mock, ever | — | — | — |
| Group 1 Mock Test Pack | ₹399 | 80 days | Group 1 aspirants | A bigger credit drip — NOT unlimited access · No additional test bank | 50/day (vs 10) | No | No | Credit-metered only | 2 | 0 | ₹0 |
| Vettri Nichayam (monthly) | ₹499 | 30 days | Test-marathon users | Full Vettri / Test-Marathon bank · Vettri bank | Unlimited within Vettri | No | Yes | No | — | — | — |
| Vettri Nichayam (full) | ₹899 | 60 days | Test-marathon users, better per-day rate | Full Vettri / Test-Marathon bank · Vettri bank | Unlimited within Vettri | No | Yes | No | 4 | 1 | ₹899 |
| Rank Booster (Group 2 / 2A) | ₹1,249 | 90 days | Group 2 / 2A aspirants | 23-test Group II/IIA series — a separate product from Vettri · 23-test series | Unlimited | Yes | No | No | 3 | 0 | ₹0 |
| Premium Prelims Kit | ₹1,699 | 180 days | All prelims aspirants — the superset | Superset: Vettri-equivalent access AND Rank Booster included free · Everything | Unlimited | Yes (free) | Yes | Yes | 12 | 0 | ₹0 |

The catalogue has **5 paid price points** but the payments ledger records **4 distinct plan keys** — the two Vettri variants appear to share one key, so their split cannot be recovered. **[DATA GAP]**

- **Vettri Nichayam (monthly)** — The payments ledger records a single vettri_nichayam plan key. Whether the 4 recorded attempts split across the ₹499 monthly and ₹899 full variants is NOT established — DATA GAP.
- **Vettri Nichayam (full)** — The only plan that has ever converted — and that sale was founder-generated.
- **Rank Booster (Group 2 / 2A)** — MRP ₹1,800. Advertised as an "Independence Day offer valid till 31 Aug 2026" — expired, and still live. See Flaw #3.
- **Premium Prelims Kit** — Draws 57% of all purchase intent at the highest price point, and has converted zero times. 12 of the 20 abandonments (60%).

### Where the plans overlap

| Entitlement rule | Status | Why it confuses a buyer |
|---|---|---|
| `Premium ⊇ Rank Booster` | **Overlap** | Buying Premium gets Rank Booster free. A user who buys Rank Booster (₹1,249) then wants Vettri must buy again; a Premium buyer (₹1,699) would have had both for ₹450 more. Nothing on the pricing screen says so. |
| `Premium ⊇ Vettri` | **Overlap** | Same superset relationship, also unstated. |
| `Vettri ⊉ Rank Booster` | **Trap** | The most expensive non-Premium plan does NOT include the other most expensive non-Premium plan. This is the single least guessable rule in the catalogue. |
| `Mock Pack ⊉ Vettri, ⊉ Rank Booster` | **Trap** | The ₹399 "Mock Test Pack" unlocks no test bank at all — it raises the daily credit grant from 10 to 50. A buyer reasonably expects mock exams. |
| `Vettri monthly vs. full` | **Ambiguous** | ₹499/30d vs ₹899/60d — the same product at two rates. The ledger appears to collapse both into one plan key. |

> **Do not restructure the plans yet.** Redesigning a pricing architecture on 21 attempts and 1 sale would be fitting to noise. Make the plans *describable* first, instrument per-plan demand, then decide. And do not change prices: with zero external conversions at any price point there is no evidence that price is the binding constraint.

### Payments reconciliation — how 20, 21, 11, 4 and 1 fit together

| Figure | Value | Evidence |
|---|---|---|
| payments rows with status = created, never completed | **20** | PROD |
| Distinct users behind those 20 rows | **11** | PROD |
| Completed payment records (status = paid) | **4** | PROD |
| — of which internal staff comps at ₹0 (founder-confirmed) | **3** | FOUNDER |
| — of which revenue-bearing (₹899, founder-generated) | **1** | PROD + FOUNDER |
| Total price-accepted checkout attempts (20 abandoned + 1 completed) | **21** | DERIVED |
| Externally-acquired paying customers | **0** | FOUNDER |

The 3 staff comps do NOT appear as checkout attempts: comp grants write a synthetic order ID directly to paid and never generate a created row (code-confirmed). This is why 20 + 1 = 21 attempts, not 24. The brief's headline "checkout attempts: 20" counts the abandoned rows; both figures are correct and are shown separately throughout.

### Checkout abandonment — attempt timing

| Pattern | Users | Attempts | Reading |
|---|---|---|---|
| Repeat within seconds (12s and 11.7s spans) | 2 | 4 | Comparison-shopping at the payment window. One user opened premium_annual then vettri_nichayam 12 seconds apart — using the checkout screen to discover what the plans cost, because the pricing screen did not say. Originally read as a technical failure signature; reinterpreted after checkout was verified working. |
| Repeat across days/weeks (59d, 16d, 13d spans) | 3 | 10 | Sustained interest with an unresolved objection. One user returned 5 times across 59 days and never bought. |
| Single attempt, never returned | 6 | 6 | One look, no return. |

### Payment recovery funnel

```
Checkout reached      11 people
        ↓
Payment created       21 attempts   (20 abandoned + 1 completed)
        ↓
Paid                   1            founder-generated
        ↓
UNRECOVERED           20 attempts / 11 people   ← NO MECHANISM EXISTS
```

No cleanup, retry, reminder or follow-up exists. The oldest unresolved attempt is 79 days old. **No user has been or will be contacted as part of this audit.**

---

## 7. Acquisition

The one part of this business that is demonstrably working — and nobody can say why, because no acquisition source has ever been captured.

| Metric | Value | Note |
|---|---|---|
| Signups, last 30 days | **366** | 53.7% of the entire user base |
| Paying customers from them | **0** | 0.00% conversion |
| Signups, last 7 days | **50** | 7.1 per day |
| August signups | **396** | Best month on record · +75.2% over July |
| Signups with a known source | **0** | No attribution column exists anywhere in the schema |

### External discoverability

| Metric | Value | Evidence | Note |
|---|---|---|---|
| URLs in sitemap.xml | 5 | EXT | Home + /privacy + /guidelines + /payment-policy + /refund-policy. The 7 products named in the site's own JSON-LD have no pages of their own. |
| Third-party mentions / reviews for the brand | 0 | EXT | Brand name + "reviews" / "pricing" / "complaint" returns nothing about this site anywhere. The same searches surface pricing pages and comparison articles for half a dozen competitors. |
| Competing TNPSC apps outranking it | 7 | EXT | Testbook, Entri, Nithra, KalviApp, Yukthi, Aram, TNPSC Master. |
| Search result for "TNPSC group 2 test series" | Absent | UX | Veranda Race 1st, TNPSC Master 2nd. TNPSC Mentors does not appear. |
| Instagram followers | 581 | EXT | Bio positions the brand well and links to Telegram — the right instinct for this audience. A seed, not yet a funnel. |
| App-store listings found | 0 | EXT | UNCONFIRMED ABSENCE — a search did not find a listing. The codebase contains real IAP product IDs (com.tnpscmentor.app.premium90), which implies at least store registration. Awaiting founder confirmation. |
| Per-route <title> / meta description | Identical on every route | EXT | Pure client-rendered SPA with no per-route server output. Every link shared on WhatsApp or Telegram unfurls as the generic homepage card. |
| Public indexable pricing page | None | EXT | Pricing renders only inside the app shell — it cannot rank in search and cannot be forwarded. |
| Social proof on landing / pricing | None | CODE | LandingPage.tsx and PricingCards.tsx grepped in full: zero testimonials, ratings or user counts. Competitor TNPSC Master leads with "10,000+ students". |
| Frontend bundle | ~221 KB gz JS + 20 KB CSS | EXT | GOOD. Hashed, cached 1yr immutable. Performance is NOT a problem — do not spend engineering time here. |
| robots.txt architecture | Correct | EXT | GOOD. Marketing site indexable, logged-in app noindexed. The judgment is sound; there is simply almost nothing behind it to index. |
| Structured data (JSON-LD) | Present | EXT | GOOD. Clean EducationalOrganization + FAQPage schema, bilingual inLanguage tags. Mostly wasted, because there is one page for it to describe. |

> **Sequencing — deliberately counterintuitive.** Organic discoverability is a genuine weakness and it is **not** the current bottleneck. Acquisition is growing without it. Directing more traffic into a funnel with 0.00% external conversion converts effort into nothing. SEO is Phase 5 in this plan for exactly that reason.

---

## 8. Analytics health

The instrumentation that exists is well built — single, correct choke-points. It is **incomplete, not sloppy.** But the gaps are load-bearing: several conclusions in this audit are labelled hypothesis purely because the data to test them does not exist.

> **The most urgent gap.** `pricing_viewed` does not fire from the in-app pricing screen. That means the checkout stage of the funnel has **no denominator**, and the entire Phase 1 conversion effort would be **unfalsifiable** if it shipped today. Ship this event first, regardless of its position in the plan.

### Tracking coverage matrix

| Event | Tracked? | Reliable? | Where | Problem |
|---|---|---|---|---|
| `page_view` | Yes | Yes | GA4/GTM — every SPA route change, web + native split handled correctly | — |
| `sign_up` | Partial | No | trackSignUp() — authStore.ts | ONE call site: the password/WhatsApp-OTP path. A Google-created account fires only trackLogin("google") and is indistinguishable from a returning user. Every signup number in GA4/Meta undercounts by however many people use Google. |
| `login` | Yes | Yes | authStore.ts | — |
| `start_test` | Yes | Yes | quiz engine | — |
| `submit_test` | Yes | Yes | submit_test RPC | — |
| `view_result` | Yes | Yes | Result page | — |
| `test_abandoned` | Partial | No | record_abandoned_test() — one call site, free practice engine only | Mock, Vettri, Rank Booster and Test Series have no exit button and no abandon call. A rage-quit on content someone PAID for leaves zero trace. The reported 161 abandonments cover only the free engine. |
| `pricing_viewed` | Partial | No | trackViewContent — Register page load and /rank-booster landing only | NOT confirmed to fire from the in-app PricingCards screen. This is why the checkout stage of the funnel has no denominator. |
| `checkout_started` | Yes | Yes | PremiumCard, VettriCard, useMockPackPurchase, useRankBoosterPurchase | — |
| `payment_success / failed` | Yes | Yes | razorpay.ts / IAP flow — single choke-point | — |
| `purchase` | Yes | Yes | razorpay.ts | — |
| `coupon_applied` | Yes | Yes | server-validated | coupon_viewed is not tracked separately, so it is impossible to tell whether nobody looks for a code or nobody can find one. |
| `subscription_renewed / expired / cancelled` | No | n/a | not found in code | Plan expiry is computed on read via bundleAccess(), never written as an event. Renewal and churn are therefore unmeasurable. |
| `utm_source / medium / campaign / referrer` | No | n/a | nowhere — no column exists in the schema | Exhaustive schema search returned one non-match. Historical channel attribution is unrecoverable for every past period. |
| `Server-side pageview / visitor count` | No | n/a | no store exists | The funnel has no top. Visitor volume is knowable only through GA4, which cannot be joined to who actually paid. |

### Metric definition defects

| Metric | Where | Defect | Consequence |
|---|---|---|---|
| `premiumActive` | `revenue_metrics.sql` | Filters notes->>'plan' = 'premium_annual' only — 1 of 5 plans. Vettri, Rank Booster and Mock Pack customers do not count toward the founder's own headline paid figure. | The business reads smaller to its own founder than it is. Currently masked by there being almost no customers; becomes actively misleading the moment conversion moves. |
| `Active today / Active 7d` | `get_platform_metrics()` | Filters daily_activity with a bare current_date (UTC session clock) while every write stamps activity_date in IST. | Real in code. NOT currently distorting anything: production returned identical values under UTC and IST (2 and 17). Downgraded from the P0 assigned in Stage 2 to P3. |
| `"Active" itself` | `daily_activity` | Written only by test submission and current-affairs completion. Reading materials, browsing, reviewing bookmarks — none of it counts. | Every engagement and retention number in this report is a floor. |
| `Tests abandoned (161)` | `test_sessions.status` | Only the free practice engine can ever write this status. | Cannot answer "do paying customers finish what they bought." |
| `Total questions (49,916)` | `questions` | Unfiltered by the questions.active soft-hide flag the student-facing sampler actually applies. | Overstates the live servable question pool by an unknown amount. |
| `passed_80_percent` | `test_sessions column name` | The enforced attendance gate is 25%, not 80%. The name is historical. | Anyone reading this column will misinterpret it. Registered P3 — out of scope for this dashboard, listed here for completeness. |

### Existing vs. required

**Existing and reliable**

- `page_view` — GA4/GTM — every SPA route change, web + native split handled correctly
- `login` — authStore.ts
- `start_test` — quiz engine
- `submit_test` — submit_test RPC
- `view_result` — Result page
- `checkout_started` — PremiumCard, VettriCard, useMockPackPurchase, useRankBoosterPurchase
- `payment_success / failed` — razorpay.ts / IAP flow — single choke-point
- `purchase` — razorpay.ts
- `coupon_applied` — server-validated

**Required and missing or broken**

- `sign_up` — ONE call site: the password/WhatsApp-OTP path. A Google-created account fires only trackLogin("google") and is indistinguishable from a returning user. Every signup number in GA4/Meta undercounts by however many people use Google.
- `test_abandoned` — Mock, Vettri, Rank Booster and Test Series have no exit button and no abandon call. A rage-quit on content someone PAID for leaves zero trace. The reported 161 abandonments cover only the free engine.
- `pricing_viewed` — NOT confirmed to fire from the in-app PricingCards screen. This is why the checkout stage of the funnel has no denominator.
- `subscription_renewed / expired / cancelled` — Plan expiry is computed on read via bundleAccess(), never written as an event. Renewal and churn are therefore unmeasurable.
- `utm_source / medium / campaign / referrer` — Exhaustive schema search returned one non-match. Historical channel attribution is unrecoverable for every past period.
- `Server-side pageview / visitor count` — The funnel has no top. Visitor volume is knowable only through GA4, which cannot be joined to who actually paid.

---

## 9. Customer feedback

**6 star ratings from 682 users, averaging 4.33 — and not one word of written text.**

```
Ratings received:   5, 4, 5, 5, 2, 5
Average:            (5 + 4 + 5 + 5 + 2 + 5) / 6 = 26 / 6 = 4.33
Written feedback:   0
Response rate:      6 / 682 = 0.88%
```

| Rating | Count |
|---|---|
| 5★ | 4 |
| 4★ | 1 |
| 3★ | 0 |
| 2★ | 1 |
| 1★ | 0 |

### Why 4.33 is not actionable

- All six responses are star ratings. NOT ONE carries written text — there is no qualitative user data in the entire system.
- A 4.33 average from 6 responses tells you nothing actionable: it identifies no feature, no friction, and no reason not to upgrade.
- One 2-star rating exists. It is 1 of 6 responses. No rate should be computed from that — the sample is far too small, and there is no accompanying text explaining it.
- The prompt is deliberately rare by design: it appears once, only on the home screen, only after 2 completed tests, only for non-admins, then is suppressed for 3 months per user — enforced client AND server side.

```
Rating  →  no reason  →  no qualitative insight
```

### Recommended feedback design

- Rating (keep it — it works)
- + "What did you like?"
- + "What should we improve?"
- + "Why didn't you upgrade?" — asked of users who reached pricing or abandoned a checkout
- Relax the gating so non-activated and non-returning users can be reached at all
- Prompt at the abandonment moments, not only at the engaged ones

> **Microsoft Clarity — DATA NOT AVAILABLE.** No access at any point across Stages 1, 2 or 3. Clarity is loaded as a GTM container tag rather than called from the codebase, so even its firing rules live outside the repository. **No behavioural inference anywhere in this report is drawn from Clarity.**

---

## 10. The 14 major flaws

The backlog register carries 28 non-P3 finding IDs (P0-1…P0-4, P1-1…P1-12, P2-1…P2-12). Seven further findings were established during the verification stage and are given V- identifiers here. Together they are the 35 underlying findings consolidated into the 14 major flaws below. Nothing has been dropped. P3-5 additionally appears inside Flaw #6 because the brief explicitly requires partial-effort reinforcement there, and it is a retention mechanism rather than code debt — it is labelled as carried-in throughout.

### Overview

| # | Title | Priority | Category | Severity | Evidence | Root cause | Confidence | Funnel stage | One-line diagnosis |
|---|---|---|---|---|---|---|---|---|---|
| 1 | **Weak value proposition & conversion experience** | P0 | Conversion | Critical | CONFIRMED | HYPOTHESIS | Medium | Value discovery → Pricing → Checkout → Payment | The product asks for money before it has shown anyone why the money is worth spending — and the screens that would do the persuading sit downstream of the paywall. |
| 2 | **Confusing monetization & pricing structure** | P0 | Monetization | Critical | CONFIRMED | OBSERVATION | High | Pricing → Checkout | Five price points with genuinely non-obvious entitlement overlap, and a user was caught using the payment window itself to work out what the plans cost. |
| 3 | **Broken / expired promotional experience** | P0 | Trust | High | CONFIRMED | CONFIRMED | High | Paid-ads landing → Pricing | The one page built specifically to convert paid traffic advertises an "offer valid till 31 Aug 2026" — and it was still live on 5 Sep. |
| 4 | **Poor first-time user experience** | P1 | Activation | High | OBSERVED | OBSERVATION | Medium | Onboarding → First test | A new user lands in the app with no orientation, up to five modals competing for attention, and 3–4 taps between them and the only thing that delivers value. |
| 5 | **Weak activation** | P1 | Activation | Critical | CONFIRMED | OBSERVATION | High | Signup → First test | 337 of 682 registered users — 49.4% — have never started a single test. This is the largest absolute loss anywhere in the funnel. |
| 6 | **Poor retention & habit formation** | P1 | Retention | Critical | CONFIRMED | OBSERVATION | High | Test completion → Return visit | 270 of 286 users who completed a test — 94.4% — never came back on a second day. Only 16 of 682 users have ever had two active days. |
| 7 | **Weak content engagement & surfacing** | P1 | Engagement | Medium | OBSERVED | OBSERVATION | Medium | Daily engagement → Return visit | Content that exists and would bring users back is broken, hidden or unexplained — including a broken image on the daily-return hook itself. |
| 8 | **Extremely weak monetization performance** | P0 | Monetization | Critical | CONFIRMED | CONFIRMED | High | Payment (outcome) | 682 users, 83 days, ₹899 of all-time revenue — and every rupee of it internally generated. Externally-acquired revenue is ₹0. |
| 9 | **Unused conversion & recovery mechanisms** | P1 | Monetization | High | CONFIRMED | CONFIRMED | High | Checkout → Payment → Recovery | 11 people accepted a price and did not pay, the oldest 79 days ago — and nothing follows up. A complete coupon and promoter system sits fully built and has never been used once. |
| 10 | **Weak organic discoverability** | P2 | Acquisition | Medium | CONFIRMED | CONFIRMED | High | Discovery | Five URLs in the sitemap, zero third-party mentions anywhere, and absent from the category's primary search — a genuine weakness, but NOT the current bottleneck. |
| 11 | **Poor public product & commercial visibility** | P2 | Acquisition | Medium | CONFIRMED (pricing) · DATA GAP (app stores) | CONFIRMED | Medium | Discovery → Landing | The price cannot be seen without signing up, and no app-store listing was found — though absence of a search result is not proof of absence. |
| 12 | **No acquisition attribution** | P1 | Measurement | High | CONFIRMED | CONFIRMED | High | Discovery → Signup (measurement across all stages) | Signups grew from 19 to 226 to 396 a month — and there is no column anywhere in the schema that could say where any of them came from. |
| 13 | **Incomplete product analytics & event tracking** | P1 | Measurement | High | CONFIRMED | CONFIRMED | High | All stages (measurement layer) | The funnel has no top, no pricing-view denominator, no abandonment signal from any paid format, and a signup event that misses everyone who uses Google. |
| 14 | **Weak customer feedback & behavioural intelligence** | P2 | Measurement | Medium | CONFIRMED | CONFIRMED | High | Post-activation (voice of customer) | Six star ratings from 682 users, averaging 4.33 — and not one word of written feedback. There is no qualitative user data in the entire system. |

### Traceability — 35 underlying findings → 14 flaws

| Flaw | ID | Underlying finding | Evidence |
|---|---|---|---|
| **#1 Weak value proposition & conversion experience** | `P0-1` | The product asks for money before establishing value | UX + PROD |
|  | `P0-4` | The value moment (Revision / Insights) is discovered late and by accident | UX |
|  | `P1-4` | Premium upsell appears in every section, while purchase desire is zero | UX |
|  | `P2-5` | No social proof anywhere on the landing or pricing surfaces | CODE + EXT |
| **#2 Confusing monetization & pricing structure** | `P0-2` | The five plans are indistinguishable to a user; entitlement rules genuinely overlap | UX + CODE + PROD |
|  | `V-2` | premium_annual draws 57% of all purchase attempts and has converted zero times | PROD |
| **#3 Broken / expired promotional experience** | `P0-3` | Expired offer live on the paid-ads landing page; the price does not auto-revert | CODE + UX |
| **#4 Poor first-time user experience** | `P1-1` | No orientation for a new user after signup | UX + PROD |
|  | `P1-2` | 3–4 taps to reach a test | UX |
|  | `P1-3` | Popup overload at first run — five competing entry modals | UX + CODE |
| **#5 Weak activation** | `P1-1` | Registration → first meaningful action is where half the base is lost | PROD |
| **#6 Poor retention & habit formation** | `P1-6` | Nothing brings users back | PROD |
|  | `P3-5` | The habit loop ignores partial effort — streaks, XP and badges are written only by submit_test | CODE |
|  | `P2-12` | daily_activity only logs test submissions, so every retention figure is a floor | CODE |
| **#7 Weak content engagement & surfacing** | `P1-5` | Images not loading in Current Affairs | UX |
|  | `P1-7` | Free tier under-communicated | UX |
|  | `P1-8` | Kural of the Day has no prompt or surfacing | UX |
| **#8 Extremely weak monetization performance** | `P1-9` | One real customer in 83 days; ₹899 all-time revenue | PROD |
|  | `P1-10` | Three "premium" accounts are staff comps at ₹0, not customers | FOUNDER + PROD |
|  | `V-1` | Externally-acquired paying customers: 0 of 682 | FOUNDER + PROD |
|  | `V-7` | 366 signups in the last 30 days produced 0 new paying customers | PROD |
| **#9 Unused conversion & recovery mechanisms** | `P1-11` | Zero coupon redemptions in 83 days; no discoverable path to a code | PROD + UX |
|  | `P1-12` | 20 abandoned orders from 11 identifiable people, with no recovery mechanism of any kind | PROD |
| **#10 Weak organic discoverability** | `P2-1` | Invisible in search; zero third-party mentions or reviews for the brand | EXT + UX |
|  | `P2-2` | Sitemap contains 5 URLs — home plus 4 legal pages | EXT |
|  | `P2-3` | Identical title and meta description on every route | EXT |
| **#11 Poor public product & commercial visibility** | `P2-4` | No public, indexable pricing page — pricing renders only inside the app shell | EXT |
|  | `P2-6` | No app-store presence found, despite real IAP product IDs in the codebase | EXT + CODE |
| **#12 No acquisition attribution** | `P2-7` | Zero acquisition attribution — no utm_source, medium, campaign or referrer column exists anywhere in the schema | CODE |
| **#13 Incomplete product analytics & event tracking** | `P2-8` | Paid test formats cannot log abandonment — record_abandoned_test is wired only to the free practice engine | CODE |
|  | `P2-9` | Google signups are not tracked as signups | CODE |
|  | `P2-10` | premiumActive counts 1 of 5 plans | CODE |
|  | `P2-12` | The active-user definition covers only test submission and current-affairs completion | CODE |
|  | `V-3` | Pricing views are not instrumented, so the checkout stage has no denominator | CODE |
|  | `V-4` | No server-side visitor or pageview store exists — the funnel has no top | CODE |
| **#14 Weak customer feedback & behavioural intelligence** | `P2-11` | The feedback prompt is deliberately buried: once, home screen only, after 2 completed tests, non-admins only, then suppressed 3 months | CODE + PROD |
|  | `V-5` | Microsoft Clarity behavioural data was inaccessible across all three audit stages | GAP |
|  | `V-6` | Zero written feedback — all six responses are ratings only | PROD |

### P3 technical debt — EXPLICITLY OUT OF SCOPE

These six items are recorded in the backlog register and are deliberately excluded from this dashboard, per the brief. They are listed here only so that nobody mistakes their absence for an oversight. P3-5 is the single exception: it appears inside Flaw #6 because the brief requires it there.

| ID | Item |
|---|---|
| `P3-1` | superadmin_revoke_rank_booster() writes status='revoked', which the payments check constraint forbids. Will throw the first time it is used in a refund dispute. |
| `P3-2` | Active-today timezone mismatch — real in code, currently harmless. Production returned identical UTC and IST values. Downgraded from the P0 assigned in Stage 2. |
| `P3-3` | passed_80_percent is misnamed — the enforced attendance gate is 25%. |
| `P3-4` | in_progress is dead schema — 0 rows; sessions are written already-final. |
| `P3-5` | Habit loop ignores partial effort. CARRIED IN to Flaw #6 at the brief's explicit request. |
| `P3-6` | README contradicts production reality (states Supabase Cloud; production is self-hosted). |

### CLOSED — disproved, do not spend effort here

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

<a id="flaw-1"></a>

---

# FLAW #1 — Weak value proposition & conversion experience

| Priority | Category | Severity | Evidence status | Root cause status | Confidence | Affected funnel stage |
|---|---|---|---|---|---|---|
| P0 | Conversion | Critical | CONFIRMED | HYPOTHESIS | Medium | Value discovery → Pricing → Checkout → Payment |

> The product asks for money before it has shown anyone why the money is worth spending — and the screens that would do the persuading sit downstream of the paywall.

### A. Executive summary

TNPSC Mentors contains something genuinely persuasive. During the first-time walkthrough the tester completed two full tests and felt no desire to pay — then wandered, unprompted, into the Revision and Insights screens and said "I feel good."

That is the value moment. It exists, it works, and almost nobody reaches it. The paywall, meanwhile, is everywhere: a premium prompt appears in essentially every section of the app, starting from the first session, before the user has any reason to want it.

The result is a product that asks constantly and demonstrates rarely. 366 people signed up in the last 30 days and none of them paid.

### B. What is the flaw?

- The order of operations is inverted. A user is shown the price before they are shown the reason.
- The value moment is not on any path the product routes users through. Revision and Insights are reachable, but nothing takes a new user there — they are found by wandering.
- The upsell has no gating on desire. It appears in section after section regardless of whether the user has ever seen a result screen, completed a test, or shown any purchase signal.
- There is no trust signal at the moment of deciding: LandingPage.tsx and PricingCards.tsx were grepped in full and contain zero testimonials, ratings or user counts — while a competitor leads its pricing page with "10,000+ students".

### C. Why does it matter?

- This is the stage with a confirmed, absolute zero. Not a low rate — zero externally-acquired paying customers in 83 days.
- Acquisition is growing (19 → 226 → 396 signups by month). Every additional user acquired while this stage is broken is a user converted into nothing.
- It is also the cheapest possible thing to be wrong about: the value already exists and is already built. Nothing new has to be created — it has to be sequenced.

### D. Evidence

| Source | Evidence |
|---|---|
| **[PROD]** | 366 signups in the last 30 days → 0 new paying customers. |
| **[PROD]** | 11 people reached a price-accepted checkout across 21 attempts; 1 completed, and that one was founder-generated. Externally-acquired paying customers: 0 of 682. |
| **[PROD]** | One user returned to checkout 5 times across 59 days and never bought — sustained interest against an unresolved objection. |
| **[UX]** | "I can't feel any urge to pay and get premium." — said after completing two full tests. |
| **[UX]** | "after checking on the Revision, Insights section, I feel good" — reached only by wandering in unprompted, after the paywall had already been shown repeatedly. |
| **[UX]** | "whichever section I visit, somewhere I can see the pop up for premium plan." |
| **[CODE]** | LandingPage.tsx and PricingCards.tsx grepped in full for testimonial / rating / user-count language: zero matches. |
| **[CODE]** | An app_feedback table already holds a 4.33 average and 682 real signups exist — there is honest social proof available and none of it is used. |
| **[EXT]** | Competitor TNPSC Master leads its public pricing page with "10,000+ students". Every competitor checked shows a proof-of-scale number. |
| **[UX]** | DISPROVED ALTERNATIVE: checkout was tested to the final payment step on a real device and works correctly. This was the leading hypothesis before the walkthrough and it failed — the problem is upstream of the payment screen. |

### E. How did we check?

- Production SQL (read-only): counted registered users, checkout attempts by status, distinct checkout users, and paid records with non-zero amounts.
- Production SQL (read-only): counted signups in the trailing 30 days and paid records created in the same window.
- Source-code inspection: full-text grep of LandingPage.tsx and PricingCards.tsx for testimonial, rating, review, "students", "users" and count-style language.
- First-time-user walkthrough on a real device: signup → home → two complete tests → results → free exploration, with the tester narrating intent throughout.
- Checkout verification during the same walkthrough: driven to the final payment step to test the "checkout is broken" hypothesis directly.
- External inspection: competitor pricing pages checked for proof-of-scale claims.

### F. Numbers

| Metric | Calculation | Value |
|---|---|---|
| Recent signups → new paying customers | `366 → 0` | **0.00%** |
| Externally-acquired paying customers | `0 / 682` | **0.00%** |
| Checkout people → paid | `1 / 11` | **9.1% (and that 1 was founder-generated)** |
| Checkout attempts → paid | `1 / 21` | **4.8%** |
| Revenue-generating customers / all users | `1 / 682` | **0.15%** |
| Social-proof elements on acquisition surfaces | `grep of LandingPage.tsx + PricingCards.tsx` | **0** |
| Users who reached the value moment | `no feature-usage event exists` | **DATA NOT AVAILABLE** |

### G. Affected users

| Dimension | Value |
|---|---|
| Number affected | 682 registered users; 366 of them in the last 30 days alone |
| Percentage affected | 100% of the user base is exposed to this ordering |
| Funnel stage affected | Value discovery → Pricing → Checkout |
| Note | The measurable subset is the 11 people who reached checkout — those are the users who got far enough to be counted. How many of the other 671 ever saw a pricing screen is DATA NOT AVAILABLE, because pricing views are not instrumented. |

### H. Root cause

**CONFIRMED root cause**

- No social proof exists on the acquisition or pricing surfaces. Code-confirmed by exhaustive grep.
- Nothing in the product routes a new user to Revision or Insights. Confirmed by walkthrough — the tester found them by wandering.
- Premium prompts are not gated on any purchase-intent or engagement signal.

**HYPOTHESIS — unproven**

- That weak value communication is the binding constraint on conversion. This is the strongest available explanation and it is still a hypothesis: it rests on a walkthrough of n = 1 plus consistency with all three funnel losses. It is not independently verified.
- That reaching Revision/Insights earlier would raise conversion. Plausible and cheap to test; entirely untested.
- IMPORTANT: low conversion is a FACT. That value perception is its cause is a HYPOTHESIS. Do not let the certainty of the first transfer to the second.

### I. User impact

- The user completes a test, sees a result, and is asked to pay — having been shown a score but not an improvement path.
- They are asked again in the next section, and the next. The asking is the most consistent experience the product offers.
- If they do reach Revision or Insights, they find it valuable. Most never do.
- At the pricing screen there is nothing to reassure them that anyone else uses this product.

### J. Business impact

- Lost conversion: measurable and total. 0 externally-acquired customers in 83 days; 0 from 366 signups in the last 30 days.
- Lost revenue: ₹0 externally generated against ₹899 all-time, all of it internal.
- Compounding cost: acquisition is growing. August delivered 396 signups into a funnel with a 0.00% external conversion rate.
- Goodwill cost: repeated upselling against zero desire spends trust that would be needed later, when the ask is finally justified. UNQUANTIFIED — no measurement of this exists.

### K. Developer impact

- Routing and first-session flow — wherever the post-signup and post-result destinations are decided.
- Revision and Insights modules: currently reachable but not surfaced.
- The premium upsell component and its trigger conditions, which appear across essentially every section.
- LandingPage.tsx and PricingCards.tsx — the two files that currently carry no trust signal.
- Instrumentation: there is no feature-usage event on Revision/Insights, so the very behaviour this fix targets is currently invisible.

### L. Recommended fix

- Route the first session through the value moment. After the first completed test, take the user to Insights/Revision — not to an upsell.
- Gate the premium prompt on a signal: completed tests, a returning visit, or an explicit pricing visit. Stop showing it in every section by default.
- Put honest social proof on the landing and pricing surfaces. Two true numbers already exist: 682 registered aspirants and a 4.33 average rating from 6 responses. State them accurately, including the n, rather than inventing a rounder number.
- Instrument the value moment before changing it, so the change can be judged: fire an event when Revision and Insights are opened, and a pricing_viewed event on PricingCards.

### M. Implementation direction

- This is a sequencing change, not new functionality. Everything needed already exists in the product.
- Decide the post-first-result destination in one place rather than per-section, so the "value before price" rule is enforceable and testable.
- The upsell trigger needs a condition object it does not currently have — minimally: has the user completed ≥1 test, and have they seen a result screen.
- Social proof should read from real data (the profiles count and the app_feedback average) rather than being hard-coded, so it cannot go stale or become false.
- DO NOT ship the routing change without the events. Without a pricing_viewed event the checkout stage has no denominator, and this fix will be unfalsifiable — see Flaw #13.
- NO PRODUCTION CHANGE IS MADE BY THIS DASHBOARD. This section describes what a developer should change; it does not change it.

> **Scope boundary.** This report is a reporting and planning artefact. No production code, database, configuration or deployment has been modified. This section describes what a developer should change; it does not change it.

### N. Success metric

- PRIMARY: externally-acquired paying customers > 0. Currently 0 of 682. This is the only success criterion that matters for Phase 1.
- SUPPORTING: pricing-view → checkout-start rate becomes measurable at all (it currently has no denominator).
- SUPPORTING: share of first sessions that reach Revision or Insights. Currently DATA NOT AVAILABLE.
- GUARDRAIL: the upsell change must not reduce checkout starts. Watch created-row volume against the 21-attempt baseline.
- No conversion-rate target is set. 21 checkout attempts and 1 sale is far too small a sample for any rate to be meaningful — BASELINE FIRST, TARGET TO BE SET AFTER EXPERIMENT.

### O. Priority

**P0**

### P. Confidence

Medium — the conversion facts are High confidence; the value-perception causal claim is Medium and rests on n = 1.

### Q. Source

- Stage 1 external audit (social proof, competitor comparison)
- Stage 2 codebase audit (grep of LandingPage.tsx / PricingCards.tsx)
- Stage 3 production queries (payments, profiles)
- First-time-user walkthrough
- Final Growth Verification §1, §10, §12
- Backlog register P0-1, P0-4, P1-4, P2-5

<a id="flaw-2"></a>

---

# FLAW #2 — Confusing monetization & pricing structure

| Priority | Category | Severity | Evidence status | Root cause status | Confidence | Affected funnel stage |
|---|---|---|---|---|---|---|
| P0 | Monetization | Critical | CONFIRMED | OBSERVATION | High | Pricing → Checkout |

> Five price points with genuinely non-obvious entitlement overlap, and a user was caught using the payment window itself to work out what the plans cost.

### A. Executive summary

There are five paid price points. A user cannot tell them apart, and the entitlement rules behind them are genuinely intricate rather than merely badly explained.

Premium includes Rank Booster. Vettri does not. The Mock Test Pack unlocks no test bank at all — it raises a daily credit allowance from 10 to 50. None of this is stated where a buyer would look.

The strongest single piece of evidence is behavioural: one user opened two different plans' checkout screens 12 seconds apart. They were using the payment window to discover what the plans cost, because the pricing screen did not tell them.

### B. What is the flaw?

- FIVE PRICE POINTS: ₹399 Mock Pack, ₹499 Vettri monthly, ₹899 Vettri full, ₹1,249 Rank Booster, ₹1,699 Premium.
- ENTITLEMENT OVERLAP (code-confirmed): Premium ⊇ Rank Booster, Premium ⊇ Vettri, but Vettri ⊉ Rank Booster, and Mock Pack ⊉ either.
- THE TRAP: a user who buys Rank Booster at ₹1,249 and then wants Vettri must buy again. A Premium buyer at ₹1,699 would have had both for ₹450 more. Nothing on the pricing screen says so.
- THE MISNOMER: "Group 1 Mock Test Pack" at ₹399 does not unlock mock exams. It grants a bigger credit drip. A buyer reasonably expects otherwise.
- NO DEFAULT: five options and no recommendation. The team already senses the problem — the app ships a VettriSuggestModal that downsells Premium-curious users to the cheaper plan, which is a mitigation, not a fix.

### C. Why does it matter?

- premium_annual attracts 57% of all purchase intent — more than every other plan combined — at the highest price point, and has converted zero times out of twelve attempts.
- Confusion at the pricing screen is the last controllable step before money. Everything upstream has already been paid for in acquisition effort.
- It is cheap to fix. Clarifying what each plan includes requires no pricing change, no plan removal and no new product.

### D. Evidence

| Source | Evidence |
|---|---|
| **[UX]** | "I can't differentiate what each plan does." |
| **[PROD]** | User 9810aa5d opened two different plans' checkouts 12 SECONDS APART. A second user shows an 11.7-second cross-plan span. That is comparison-shopping at the payment window. |
| **[PROD]** | premium_annual: 12 checkout attempts (57% of all demand), 0 conversions, 12 of the 20 abandonments (60%). |
| **[PROD]** | vettri_nichayam: 4 attempts, 1 conversion (founder-generated) — the only plan that has ever converted. |
| **[PROD]** | rank_booster_g2: 3 attempts, 0 conversions. group1_mock_pack: 2 attempts, 0 conversions. |
| **[CODE]** | Entitlement rules read directly: Premium is a superset of both Vettri and Rank Booster; Vettri excludes Rank Booster; Mock Pack grants 50 credits/day instead of 10 and unlocks no bank. |
| **[CODE]** | VettriSuggestModal exists specifically to downsell Premium-curious users to Vettri — evidence the team already perceives the complexity. |
| **[EXT]** | No public pricing page exists, so a prospective buyer cannot study the plans outside the app or forward them to anyone. |

### E. How did we check?

- Production SQL (read-only): grouped the payments ledger by plan key and status to produce attempts, conversions, abandonments and revenue per plan.
- Production SQL (read-only): examined the timestamps of created rows per user, which surfaced the 12-second and 11.7-second cross-plan spans.
- Source-code inspection: read the pricing constants and the entitlement/bundle-access logic to establish exactly what each plan unlocks.
- Source-code inspection: located VettriSuggestModal and read its trigger conditions.
- First-time-user walkthrough: the tester was asked to choose a plan and articulate the difference between them.

### F. Numbers

| Metric | Calculation | Value |
|---|---|---|
| Paid price points | `₹399 · ₹499 · ₹899 · ₹1,249 · ₹1,699` | **5** |
| Distinct plan keys in the payments ledger | `group1_mock_pack, vettri_nichayam, rank_booster_g2, premium_annual` | **4 — the two Vettri variants appear to share one key (DATA GAP)** |
| premium_annual share of purchase intent | `12 / 21 attempts` | **57%** |
| premium_annual conversion | `0 / 12` | **0%** |
| premium_annual share of abandonments | `12 / 20` | **60%** |
| Shortest cross-plan checkout span | `two created rows, same user, different plans` | **12 seconds** |
| Overall checkout conversion | `1 / 21 attempts` | **4.8%** |

### G. Affected users

| Dimension | Value |
|---|---|
| Number affected | 11 people / 21 price-accepted checkout attempts are the directly evidenced population |
| Percentage affected | 100% of anyone who reaches the pricing screen is exposed; the size of that population is unknown |
| Funnel stage affected | Pricing → Checkout |
| Note | DATA GAP: pricing_viewed is not instrumented on PricingCards, so the number of users who saw the plans and left without starting a checkout is unknown. The 11 are the survivors, not the sample. |

### H. Root cause

**CONFIRMED root cause**

- The entitlement overlap is real, not a communication artefact. It was read directly in the pricing and access-control code.
- No plan comparison surface exists that states what each plan includes relative to the others.
- No default or recommended plan is presented.

**HYPOTHESIS — unproven**

- That plan confusion is what suppresses conversion. Supported by the walkthrough and by the 12-second cross-plan checkout, but not proven.
- COMPETING HYPOTHESIS: price resistance at ₹1,699 explains premium_annual's 0-for-12 just as well. These two explanations fit the data equally and cannot be separated without pricing-screen instrumentation or user interviews. Both are recorded; neither is chosen.

### I. User impact

- The user reads five plans and cannot state the difference between them.
- They open a checkout screen not to buy but to find out what a plan costs and includes.
- They open a second checkout screen 12 seconds later to compare.
- They buy neither.
- A buyer who does choose may pick a plan that excludes something they assumed was included — Vettri without Rank Booster, or a "Mock Test Pack" that unlocks no mock exams.

### J. Business impact

- Lost conversion, concentrated on the highest-value product: 12 attempts at ₹1,699, zero sales.
- Scenario value of the abandoned attempts at list price: 12×₹1,699 + 3×₹1,249 + 3×₹899 + 2×₹399 = ₹27,630, roughly 31× all-time revenue. This is a measure of expressed intent, NOT lost revenue and NOT a forecast — most checkouts started anywhere are never completed.
- Support and refund risk from mis-set expectations, particularly around the Mock Pack name. UNQUANTIFIED — 0 refunds so far, but also almost no customers.

### K. Developer impact

- The pricing constants and the entitlement / bundle-access logic — the two places where "what does this plan include" is actually decided.
- PricingCards and the individual plan cards (PremiumCard, VettriCard) — the presentation surface.
- VettriSuggestModal — an existing partial mitigation that should be reconsidered alongside a real comparison surface.
- The payments ledger plan key: the two Vettri price points appear to collapse into one key, which will make per-variant analysis impossible later.
- Instrumentation: no per-plan-card view or click event exists, so plan-level demand can only be reconstructed from checkout attempts — the very end of the process.

### L. Recommended fix

- Add a one-line differentiator to every plan stating who it is for and what it uniquely unlocks.
- Publish a plan comparison matrix showing inclusion and exclusion explicitly — particularly that Premium includes Rank Booster and Vettri does not.
- Rename or re-describe the Group 1 Mock Test Pack so its name matches what it grants.
- Present a default recommendation instead of five equal options.
- Instrument per-plan card views and clicks, plus a pricing_viewed event, so plan demand can be measured before the plans themselves are ever changed.
- DO NOT REMOVE OR RESTRUCTURE PLANS YET. With 21 attempts and 1 sale, redesigning the pricing architecture would be fitting to noise. Make the plans describable first, gather real per-plan funnel data, then decide.

### M. Implementation direction

- The comparison matrix should be generated from the same entitlement source the access-control code uses. If it is hand-maintained it will drift, and the resulting mismatch is worse than the current silence.
- Splitting the Vettri ledger plan key into its two variants is a forward-looking change: existing rows cannot be retroactively disambiguated.
- Per-plan-card instrumentation should mirror the existing checkout_started pattern, which already has a clean single choke-point.
- Pricing changes are explicitly out of scope. There is no evidence that price is the binding constraint, because there have been no external conversions at any price.
- NO PRODUCTION CHANGE IS MADE BY THIS DASHBOARD.

> **Scope boundary.** This report is a reporting and planning artefact. No production code, database, configuration or deployment has been modified. This section describes what a developer should change; it does not change it.

### N. Success metric

- PRIMARY: premium_annual conversion > 0%. It is currently 0 of 12.
- SUPPORTING: cross-plan checkout opens within 60 seconds of each other fall toward zero — users should be comparing on the pricing screen, not at the payment window.
- SUPPORTING: per-plan view → checkout-start rates become measurable at all.
- DIAGNOSTIC: whether conversion improves without a price change would, for the first time, separate the plan-confusion hypothesis from the price-resistance hypothesis.
- No conversion-rate target is set — BASELINE FIRST, TARGET TO BE SET AFTER EXPERIMENT.

### O. Priority

**P0**

### P. Confidence

High — the entitlement overlap and the per-plan demand figures are directly measured. The causal link to non-conversion is an OBSERVATION, not a proven mechanism.

### Q. Source

- Stage 2 codebase audit (pricing constants, entitlement rules, VettriSuggestModal)
- Stage 3 production queries (payments grouped by plan and timestamp)
- First-time-user walkthrough
- Final Growth Verification §5, §6, §12
- Backlog register P0-2

<a id="flaw-3"></a>

---

# FLAW #3 — Broken / expired promotional experience

| Priority | Category | Severity | Evidence status | Root cause status | Confidence | Affected funnel stage |
|---|---|---|---|---|---|---|
| P0 | Trust | High | CONFIRMED | CONFIRMED | High | Paid-ads landing → Pricing |

> The one page built specifically to convert paid traffic advertises an "offer valid till 31 Aug 2026" — and it was still live on 5 Sep.

### A. Executive summary

The /rank-booster page — which the code itself labels as the Meta ad landing target — advertises Rank Booster at ₹1,249 down from an ₹1,800 MRP, as an "Independence Day offer valid till 31 Aug 2026".

The offer expired on 31 August. It was confirmed still visible on 5 September, five days later.

The pricing source comments that the price is not auto-reverting and must be updated by hand when the offer window closes. Nobody did.

### B. What is the flaw?

- A promotional deadline is hard-coded as display copy with no relationship to the current date.
- The discounted price is a hand-maintained constant with no expiry automation — the code says so in its own comment.
- There is no central promotional-expiry mechanism, so this failure mode is available to every future offer, not just this one.
- It sits on the single page most likely to receive paid traffic, which is the worst possible location for it.

### C. Why does it matter?

- A visibly expired deadline is a direct trust signal. It tells a first-time visitor that nobody is looking after this page — at the exact moment they are being asked for ₹1,249.
- It is on the paid-ads landing target, so any advertising spend is being pointed at it.
- It is the cheapest fix in this entire report: a constant and an expiry check.

### D. Evidence

| Source | Evidence |
|---|---|
| **[CODE]** | /rank-booster advertises ₹1,249 (MRP ₹1,800) as an "Independence Day offer valid till 31 Aug 2026". |
| **[CODE]** | The pricing source states in its own comment that the price is not auto-reverting and the constant must be updated by hand when the offer window ends. |
| **[CODE]** | The same page is identified in code as the Meta ad landing target. |
| **[UX]** | Confirmed still visible on 5 Sep 2026 — five days after the stated expiry. |
| **[PROD]** | rank_booster_g2: 3 checkout attempts, 0 conversions. Sample far too small to attribute to the stale offer — recorded as context, not as proof of harm. |

### E. How did we check?

- Source-code inspection: read the /rank-booster landing page component and the server-side pricing constants, including the maintainer comment about manual reversion.
- Date comparison: the stated offer deadline (31 Aug 2026) against the audit date (5 Sep 2026).
- UX walkthrough: loaded the live page and confirmed the expired copy was still rendering.
- Production SQL (read-only): pulled rank_booster_g2 checkout attempts for context.

### F. Numbers

| Metric | Calculation | Value |
|---|---|---|
| Offer expiry date | `stated in page copy` | **31 Aug 2026** |
| Date confirmed still visible | `UX walkthrough` | **5 Sep 2026** |
| Days live past expiry | `31 Aug → 5 Sep` | **5 days at time of discovery, and counting** |
| Advertised price / MRP | `₹1,249 from ₹1,800` | **31% claimed discount** |
| Automated expiry checks in the promotional path | `code inspection` | **0** |
| Traffic exposed to the stale offer | `no server-side pageview store` | **DATA NOT AVAILABLE** |

### G. Affected users

| Dimension | Value |
|---|---|
| Number affected | Every visitor to /rank-booster since 1 Sep 2026 — count unknown |
| Percentage affected | DATA NOT AVAILABLE — there is no server-side pageview store, so page traffic cannot be quantified |
| Funnel stage affected | Paid-ads landing → Pricing |
| Note | This is one of the clearest cases in the report where the defect is certain and its blast radius is unmeasurable. That is itself a finding — see Flaw #13. |

### H. Root cause

**CONFIRMED root cause**

- The promotional price and its deadline are hand-maintained constants with no expiry logic.
- No centralised promotional-expiry mechanism exists, so every offer depends on someone remembering.
- The deadline shown to users is static copy, not derived from any date comparison.

**HYPOTHESIS — unproven**

- That the stale offer measurably suppressed Rank Booster conversion. With 3 attempts and 0 conversions the sample cannot support that claim. The trust argument stands on its own without it.

### I. User impact

- A visitor arrives from an advertisement and is shown a discount that expired days ago.
- The clearest available reading for that user is that the page is unmaintained — which is a poor introduction to a product asking for ₹1,249.
- If the price is honoured, the deadline was meaningless. If it is not honoured, the page is misleading. Neither is good.

### J. Business impact

- Lost trust at the point of conversion, on the one page built to convert paid traffic.
- Wasted advertising spend, to whatever degree spend is pointed at this page — UNQUANTIFIED, because there is no attribution and no pageview store.
- Reputational and compliance exposure from advertising a time-limited price past its stated deadline. Noted as a risk, not assessed.

### K. Developer impact

- The server-side pricing constants — the single place the discounted price and MRP live.
- The /rank-booster landing page component, which renders the deadline as copy.
- Any future promotional surface: the absence of a shared expiry mechanism is the actual defect, and it is not specific to this offer.

### L. Recommended fix

- Immediate: correct the current constant so the page shows a price and a claim that are both true today.
- Structural: centralise promotional configuration with a start and end timestamp, and have every promotional surface compare that window against now() at render time.
- Make expiry the default behaviour — when a window closes, the offer disappears and the price reverts without anyone taking action.
- Add a build-time or monitoring check that fails loudly when a promotional deadline is in the past.

### M. Implementation direction

- The rule should be that promotional copy cannot state a date that is not derived from the same configuration that controls the price. Today the two are independent, which is exactly how they drifted apart.
- Reverting the price and removing the copy are two separate actions today. They must become one.
- This is genuinely trivial work. Its priority comes from certainty and from where it sits, not from its size.
- NO PRODUCTION CHANGE IS MADE BY THIS DASHBOARD.

> **Scope boundary.** This report is a reporting and planning artefact. No production code, database, configuration or deployment has been modified. This section describes what a developer should change; it does not change it.

### N. Success metric

- PRIMARY: zero expired offers displayed anywhere in production, verified by an automated check rather than by inspection. Currently 1.
- This is a DEFINITIONAL target, not an experimental one — correctness has an obviously correct value.
- SUPPORTING: /rank-booster page → checkout-start rate, once the page has a view event to measure against. Currently unmeasurable.

### O. Priority

**P0**

### P. Confidence

High — the expiry date, the current date, the code comment and the live page were each observed directly.

### Q. Source

- Stage 2 codebase audit (pricing constants, /rank-booster component)
- First-time-user walkthrough (5 Sep 2026)
- Final Growth Verification §14 P0-3
- Backlog register P0-3

<a id="flaw-4"></a>

---

# FLAW #4 — Poor first-time user experience

| Priority | Category | Severity | Evidence status | Root cause status | Confidence | Affected funnel stage |
|---|---|---|---|---|---|---|
| P1 | Activation | High | OBSERVED | OBSERVATION | Medium | Onboarding → First test |

> A new user lands in the app with no orientation, up to five modals competing for attention, and 3–4 taps between them and the only thing that delivers value.

### A. Executive summary

Signup works. That is established and closed. What happens immediately afterwards does not.

The tester's first words on entering the app were: "When entered the application, I don't know what is so necessary and what should I do now."

Before they could work it out, they were interrupted: "felt like there is too many pop up when entering the app." Code inspection confirms five separate modals can compete on entry — an onboarding tour, a starter-test prompt, a push-notification primer, a marathon free alert and an update prompt.

And the thing they were supposed to reach was 3–4 taps away.

### B. What is the flaw?

- NO ORIENTATION: nothing tells a new user what this product is for them to do first.
- POPUP OVERLOAD: five modals can fire on entry, each asking for a decision before the user has done anything worth deciding about.
- NAVIGATION FRICTION: 3–4 taps sit between app entry and a started test — friction placed directly in front of the only action that delivers value.
- The three compound: the user does not know what to do, is interrupted while trying to work it out, and then has to navigate to find it.

### C. Why does it matter?

- The stage immediately downstream of this is the largest absolute loss in the funnel — 337 registered users never start a single test.
- These users are already acquired. They found the product, decided to try it, and completed a registration. They are the cheapest possible users to activate and they are being lost after the hard part.
- First-run experience is a one-shot resource. A user gets one first session.

### D. Evidence

| Source | Evidence |
|---|---|
| **[UX]** | "When entered the application, I don't know what is so necessary and what should I do now." |
| **[UX]** | "felt like there is too many pop up when entering the app." |
| **[UX]** | 3–4 taps from entry to a started test, counted during the walkthrough. |
| **[CODE]** | Five modals confirmed as able to compete on entry: onboarding tour, starter-test prompt, push primer, marathon free alert, update prompt. |
| **[PROD]** | 337 of 682 registered users (49.4%) never start a test — the outcome this stage feeds. |
| **[UX]** | DISPROVED ALTERNATIVE: signup friction. Registration was verified working by both the walkthrough and the founder, so the 337 are dropping AFTER a clean signup — which points at orientation, not registration. |
| **[CODE]** | No onboarding-completion event exists, so the drop-off inside this sequence cannot be located. |

### E. How did we check?

- First-time-user walkthrough on a real device: a fresh account was created and the tester narrated their intent from the first screen onward.
- Tap counting: the number of interactions between app entry and a started test was counted directly.
- Source-code inspection: located every modal capable of firing on app entry and read their trigger conditions to confirm they can co-occur.
- Production SQL (read-only): counted distinct users in test_sessions against the profiles count to establish the 345 / 337 split.
- Elimination: signup was tested end-to-end and confirmed by the founder, removing registration as an explanation.

### F. Numbers

| Metric | Calculation | Value |
|---|---|---|
| Modals able to fire on entry | `code inspection` | **5** |
| Taps from entry to a started test | `walkthrough count` | **3–4** |
| Users who never start a test | `337 / 682` | **49.4%** |
| Users who do start | `345 / 682` | **50.6%** |
| Onboarding completion rate | `no onboarding event exists` | **DATA NOT AVAILABLE** |
| Drop-off point within first run | `not instrumented` | **DATA NOT AVAILABLE** |

### G. Affected users

| Dimension | Value |
|---|---|
| Number affected | All 682 registered users passed through this experience; 337 of them never started a test |
| Percentage affected | 49.4% of registrations end without a single test start |
| Funnel stage affected | Onboarding → First test |
| Note | The 337 figure is FACT. Attributing all 337 to first-run experience specifically is NOT established — there is no onboarding instrumentation to locate where inside the sequence they leave. |

### H. Root cause

**CONFIRMED root cause**

- Five modals can compete on app entry. Read directly in code.
- 3–4 taps separate entry from a started test. Counted directly.
- No orientation step exists that establishes what the user should do first.
- Signup is NOT the cause — it is verified working.

**HYPOTHESIS — unproven**

- That popup overload and tap count are what cause the 337 loss. The loss is fact; this specific attribution is a walkthrough-based observation of n = 1.
- That a single-question orientation followed by a one-tap test start would materially move activation. Plausible, cheap, and entirely untested.

### I. User impact

- The user finishes registering, arrives, and does not know what they are supposed to do.
- Modals interrupt them before they have formed an intention.
- They dismiss several things, then have to navigate to find the actual product.
- Roughly half of them never get there at all.

### J. Business impact

- Lost activation: 337 acquired users produced no product usage whatsoever.
- The full acquisition cost of those users was paid and none of the value was collected. The actual cost is UNQUANTIFIED because there is no attribution or spend data.
- Downstream: a user who never starts a test can never complete one, never return, never see a value moment, and never convert. This stage gates everything after it.

### K. Developer impact

- The post-signup routing decision and the app entry sequence.
- All five entry modals and their trigger conditions — currently independent, and therefore able to stack.
- The navigation path between the home surface and the test arena.
- Instrumentation: no onboarding-start or onboarding-complete event exists, so the interior of this funnel is invisible.

### L. Recommended fix

- Replace the entry sequence with one question and one action: which exam are you preparing for, then start this test.
- Introduce a modal queue or priority so that at most one thing asks for attention on first entry, and defer the rest — the push-notification primer in particular has no business appearing before the user has any reason to want notifications.
- Put a one-tap test start on the first screen a new user sees.
- Instrument the first-run sequence so the drop-off point can be located rather than inferred.

### M. Implementation direction

- The modal stacking is the most mechanical part: five components independently decide to show themselves. They need a single arbiter that knows what has already been shown this session.
- The desired journey is: Signup → Choose exam → Start first test. The observed journey is: Signup → Landing/Home → Popup(s) → Navigation → Test. The gap between those two is the work.
- Instrument BEFORE redesigning. Without a first-run event sequence, any improvement will be attributable only to the aggregate activation rate, which moves slowly and is confounded by a fast-growing base.
- NO PRODUCTION CHANGE IS MADE BY THIS DASHBOARD.

> **Scope boundary.** This report is a reporting and planning artefact. No production code, database, configuration or deployment has been modified. This section describes what a developer should change; it does not change it.

### N. Success metric

- PRIMARY: signup → first-test-start rate, measured on weekly signup cohorts AFTER the change. Baseline 50.6% (345 / 682).
- Cohort measurement is essential here: 53.7% of the base registered in the last 30 days, so a blended lifetime figure will not move visibly even if the change works.
- SUPPORTING: median time from signup to first test start. Currently DATA NOT AVAILABLE.
- SUPPORTING: modals shown per first session falls to 1.
- No target rate is set — BASELINE FIRST, TARGET TO BE SET AFTER EXPERIMENT.

### O. Priority

**P1**

### P. Confidence

Medium — the modal count and tap count are directly observed and the 337 loss is measured, but the causal link between them rests on a walkthrough of n = 1 by a non-aspirant.

### Q. Source

- First-time-user walkthrough
- Stage 2 codebase audit (entry modal trigger conditions)
- Stage 3 production queries (profiles vs test_sessions)
- Final Growth Verification §14 P1-4, P1-6
- Backlog register P1-1, P1-2, P1-3

<a id="flaw-5"></a>

---

# FLAW #5 — Weak activation

| Priority | Category | Severity | Evidence status | Root cause status | Confidence | Affected funnel stage |
|---|---|---|---|---|---|---|
| P1 | Activation | Critical | CONFIRMED | OBSERVATION | High | Signup → First test |

> 337 of 682 registered users — 49.4% — have never started a single test. This is the largest absolute loss anywhere in the funnel.

### A. Executive summary

Half of everyone who registers never uses the product.

682 people signed up. 345 started a test. 337 did not. Of the 345 who started, 286 finished — so once a user begins, they usually complete. The failure is entirely at the moment of starting.

This is not a signup problem. Registration was verified working by the walkthrough and confirmed by the founder. These 337 people completed a clean signup and then stopped.

### B. What is the flaw?

- There is no defined activation moment that the product drives users toward.
- The gap between "account created" and "first meaningful action" is unmanaged: nothing routes, nudges or reminds.
- Activation is not measured as a metric. There is no onboarding event, no time-to-first-test, and no cohorted activation rate — so the problem is only visible as a lifetime aggregate.
- Nothing recovers a user who signs up and does not start. No reminder, no re-engagement, no second chance.

### C. Why does it matter?

- Activation gates every downstream stage. A user who never starts a test cannot complete one, cannot return, cannot reach a value moment, and cannot convert. All 337 are permanently excluded from every metric below.
- These are the cheapest users in the business to convert into product usage. The acquisition work is already done and paid for.
- Acquisition is growing. 366 signups in the last 30 days means roughly 180 more users are being added to this loss every month at the current rate.

### D. Evidence

| Source | Evidence |
|---|---|
| **[PROD]** | 682 registered users (profiles). |
| **[PROD]** | 345 users have at least one row in test_sessions — 50.6%. |
| **[PROD]** | 337 users have none — 49.4%. |
| **[PROD]** | 286 users completed at least one test — 41.9% of all users, and 82.9% of the 345 who started. |
| **[PROD]** | 59 users started but never completed — 17.1% of starters. Small relative to the 337. |
| **[UX]** | "When entered the application, I don't know what is so necessary and what should I do now." |
| **[UX + FOUNDER]** | DISPROVED ALTERNATIVE: signup friction. Registration is verified working, so this loss occurs after a clean registration. |
| **[CODE]** | No activation event, no time-to-first-test measurement, and no re-engagement mechanism exists for a user who signs up and stops. |

### E. How did we check?

- Production SQL (read-only): count(*) from profiles for the denominator.
- Production SQL (read-only): count of distinct user_id in test_sessions for the numerator, and the same restricted to status = completed.
- Subtraction, with both denominators stated: 682 − 345 = 337 never started; 345 − 286 = 59 started but never completed.
- Elimination of the signup hypothesis via the walkthrough and founder confirmation.
- Source-code inspection: searched for any activation, onboarding-completion or re-engagement mechanism. None found.

### F. Numbers

| Metric | Calculation | Value |
|---|---|---|
| Registered users | `profiles` | **682** |
| Started ≥1 test | `345 / 682` | **50.6%** |
| NEVER started a test | `337 / 682` | **49.4%** |
| Completed ≥1 test | `286 / 682` | **41.9%** |
| Completion rate among starters | `286 / 345` | **82.9%** |
| Started but never completed | `59 / 345` | **17.1%** |
| Median time signup → first test | `not computed` | **DATA NOT AVAILABLE** |
| Activation by signup cohort | `not computed` | **DATA NOT AVAILABLE** |

### G. Affected users

| Dimension | Value |
|---|---|
| Number affected | 337 registered users |
| Percentage affected | 49.4% of all registrations (337 / 682) |
| Funnel stage affected | Signup → First test start |
| Note | This is the largest absolute loss in the funnel. It is also the cleanest number in the report: two counts from two tables, no interpretation required. |

### H. Root cause

**CONFIRMED root cause**

- 337 users registered and never started a test. Directly counted.
- Signup is not the cause — it is verified working.
- No activation measurement, no time-to-first-test, and no re-engagement mechanism exists.

**HYPOTHESIS — unproven**

- That first-run experience (Flaw #4) is the primary cause. Consistent with the walkthrough evidence, but not isolated — the drop-off point inside the first session is not instrumented.
- That some fraction of the 337 are simply very recent signups who have not returned yet. 53.7% of the base registered in the last 30 days, so this is a genuine confound and it has NOT been quantified. Cohorted activation would separate it; that query has not been run. DATA GAP.

### I. User impact

- The user registers, arrives, and leaves without using the product.
- Whatever brought them — a search, an ad, a friend, a Telegram link — produced nothing for them.
- Nothing follows up, so the decision is final.

### J. Business impact

- Lost activation: 337 users, 49.4% of everything acquired.
- Every downstream loss is compounded by this one. The retention rate against all registered users (2.3%) is depressed partly because half the base was never in a position to return.
- Lost revenue: unquantifiable directly, since conversion is 0.00% for activated users too. But activation is a necessary precondition for any future conversion.

### K. Developer impact

- Post-signup routing — the first screen decision.
- The test-arena entry path and its distance from that first screen.
- Instrumentation: activation needs to become a first-class metric with an event, a definition, and a cohorted report.
- A re-engagement path for signed-up-but-inactive users does not exist and would be new work.

### L. Recommended fix

- Define activation explicitly. The recommended definition is: first test STARTED, with first test COMPLETED tracked alongside it. Both are already derivable from test_sessions.
- Report both as cohorted rates by signup week, not as lifetime aggregates.
- Reduce the distance to that action to a single tap from the first post-signup screen (this is the same work as Flaw #4).
- Instrument time-to-first-test so the shape of the delay is visible — a user who starts on day 3 is a different problem from one who never starts.
- Consider a re-engagement path for signed-up-but-never-started users. FLAGGED AS A PRODUCT MECHANISM ONLY — no user is contacted as part of this audit.

### M. Implementation direction

- The two KPIs are computable from data that already exists. This is a reporting build before it is a product build.
- Cohorting is not optional. With 53.7% of the base under 30 days old, a blended lifetime activation rate will barely move even if the product change works perfectly.
- Run the cohorted activation query BEFORE shipping any change, so there is a real before-picture rather than a single lifetime number.
- NO PRODUCTION CHANGE IS MADE BY THIS DASHBOARD.

> **Scope boundary.** This report is a reporting and planning artefact. No production code, database, configuration or deployment has been modified. This section describes what a developer should change; it does not change it.

### N. Success metric

- PRIMARY KPI: Signup → first test start %. Current 50.6% (345 / 682).
- SECONDARY KPI: Signup → first test completion %. Current 41.9% (286 / 682).
- Both measured on weekly signup cohorts at a fixed age (for example, 7 days after signup), so cohorts are compared like with like.
- SUPPORTING: median time from signup to first test start becomes measurable.
- No target rate is set — BASELINE FIRST, TARGET TO BE SET AFTER EXPERIMENT. A target chosen before the cohorted baseline exists would be an invented number.

### O. Priority

**P1**

### P. Confidence

High — the counts are direct and unambiguous. The causal attribution to first-run experience is Medium.

### Q. Source

- Stage 3 production queries (profiles, test_sessions)
- First-time-user walkthrough
- Final Growth Verification §1, §9
- Backlog register P1-1

<a id="flaw-6"></a>

---

# FLAW #6 — Poor retention & habit formation

| Priority | Category | Severity | Evidence status | Root cause status | Confidence | Affected funnel stage |
|---|---|---|---|---|---|---|
| P1 | Retention | Critical | CONFIRMED | OBSERVATION | High | Test completion → Return visit |

> 270 of 286 users who completed a test — 94.4% — never came back on a second day. Only 16 of 682 users have ever had two active days.

### A. Executive summary

The single largest proportional loss in the funnel: 94.4% of users who completed a test never returned on another day.

16 users out of 682 have ever had two active days. That is 2.3% of the base, or 5.6% of the users who actually completed a test.

Two caveats matter, and both must travel with these numbers. First, "active" is defined narrowly — a user who logs in and reads materials without submitting a test is not counted at all, so these are floors. Second, 53.7% of the base registered within the last 30 days and has had limited time to return.

Neither caveat rescues the figure. A 5.6% two-day rate among completers is very weak by any reading.

### B. What is the flaw?

- NO RETURN LOOP: nothing in the product creates a reason to open it tomorrow.
- PARTIAL EFFORT EARNS NOTHING: streaks, XP and badges are written exclusively by submit_test. A user who answers 20 questions and quits receives no reinforcement at all — precisely the user most in need of a reason to come back.
- MEASUREMENT IS TOO NARROW: daily_activity is written only by test submission and current-affairs completion, so the retention metric cannot see reading, browsing, revision or bookmarks.
- NO COHORT VIEW: D1/D3/D7/D14/D30 have never been computed, so it is unknown WHEN users leave — only that they do.

### C. Why does it matter?

- Retention is what makes acquisition worth paying for. Without it, a growing signup number produces a growing pile of single-session users — which is exactly the shape of this business today: 396 signups in August, 16 lifetime two-day users.
- Retention also gates conversion. A user needs repeated exposure to a product's value before paying for it, and 94.4% of completers get exactly one session.
- The habit machinery already exists — streaks, XP, badges, spaced repetition. It is built and it is being triggered by only one event.

### D. Evidence

| Source | Evidence |
|---|---|
| **[PROD]** | 286 users completed at least one test. |
| **[PROD]** | 16 users have ever had 2+ distinct activity dates in daily_activity. |
| **[PROD]** | 270 of 286 completers (94.4%) never returned on a second day. |
| **[PROD]** | 16 / 682 = 2.3% of all registered users; 16 / 286 = 5.6% of test-completers. Both denominators shown because they answer different questions. |
| **[PROD]** | Active last 30 days: 135 (19.8%). Active last 7 days: 17 (2.5%). The 7d/30d ratio is 12.6%. |
| **[CODE]** | Streaks, XP and badges are written ONLY by submit_test. An abandoned or silently-killed session earns nothing, even if 20 questions were answered first. |
| **[CODE]** | daily_activity is written only by test submission and current-affairs question completion. Logging in and reading materials does not register as activity. |
| **[CODE]** | A spaced-repetition system (review_items) exists — real return-loop machinery that is not being used as a return loop. |
| **[PROD]** | CONTEXT: 366 of 682 users (53.7%) registered within the last 30 days. A material share of the base has not had much opportunity to return. |

### E. How did we check?

- Production SQL (read-only): counted users with 2+ distinct activity_date values in daily_activity.
- Production SQL (read-only): counted distinct users with a completed test session, giving the 286 denominator.
- Production SQL (read-only): counted distinct active users in trailing 7-day and 30-day windows.
- Source-code inspection: traced every writer of daily_activity and every writer of streak, XP and badge state, to establish exactly what counts as "active" and what earns reinforcement.
- Timezone validation: active-today and active-7d were recomputed under both UTC and IST and returned identical values (2 and 17), confirming the known timezone bug is not distorting these figures.
- Cohort retention (D1/D3/D7/D14/D30) was NOT computed — the query has not been run.

### F. Numbers

| Metric | Calculation | Value |
|---|---|---|
| Test-completers who returned on a 2nd day | `16 / 286` | **5.6%** |
| All registered users with 2+ active days | `16 / 682` | **2.3%** |
| Completers who NEVER returned | `270 / 286` | **94.4%** |
| Active in last 30 days | `135 / 682` | **19.8%** |
| Active in last 7 days | `17 / 682` | **2.5%** |
| 7-day / 30-day active ratio | `17 / 135` | **12.6%** |
| Base registered in the last 30 days | `366 / 682` | **53.7% — the immaturity confound** |
| D1 / D3 / D7 / D14 / D30 retention | `query not run` | **DATA NOT AVAILABLE** |

### G. Affected users

| Dimension | Value |
|---|---|
| Number affected | 270 test-completers who never returned; 666 of 682 users have never had two active days |
| Percentage affected | 94.4% of completers (270 / 286); 97.7% of all users (666 / 682) |
| Funnel stage affected | Test completion → Return visit |
| Note | FLOOR, NOT MEASUREMENT. The true return rate is higher by an unknown margin because daily_activity cannot see non-test engagement. It is not plausible that the correction closes a gap this large, but the figure must not be described as "true retention" in any decision-making context. |

### H. Root cause

**CONFIRMED root cause**

- Streaks, XP and badges are written only by submit_test — partial effort is not reinforced. Read directly in code.
- daily_activity records only test submission and current-affairs completion — the retention metric is structurally narrow.
- No cohorted retention measurement exists.
- The spaced-repetition system exists but is not used to drive returns.

**HYPOTHESIS — unproven**

- That the absence of a return loop is the primary cause of the 94.4%. Consistent with the evidence; not isolated from alternatives.
- That rewarding partial effort would improve return rates. Structurally plausible — a user who quits mid-test currently receives zero acknowledgement — but entirely untested.
- That some share of the 94.4% is cohort immaturity rather than churn. Real and unquantified: 53.7% of the base is under 30 days old. Only cohorted retention can separate the two, and it has not been run. DATA GAP.

### I. User impact

- A user completes a test, sees a score, and is given no reason to come back tomorrow.
- A user who answers 20 questions and has to stop receives nothing — no streak credit, no XP, no acknowledgement that they tried. The system's response to a bad session is silence.
- Revision material is generated by the spaced-repetition system and never surfaced as a reason to return.

### J. Business impact

- Lost retention: 270 completers, and 666 of 682 users who have never had a second active day.
- Lost conversion: repeated exposure is normally how a free user comes to value a paid tier. 94.4% of completers get one session, which makes the conversion problem in Flaw #1 substantially harder to solve.
- Acquisition efficiency: 396 signups in August against 16 lifetime two-day users means growth is not compounding into an engaged base.

### K. Developer impact

- daily_activity writers — the definition of "active" itself.
- submit_test — currently the sole writer of streak, XP and badge state.
- The spaced-repetition module (review_items) — existing return-loop machinery that is not wired to any return prompt.
- Notification and messaging surfaces, which exist but are not used to bring users back.
- Reporting: a cohorted retention query needs to be written; the underlying data already exists.

### L. Recommended fix

- Broaden the definition of "active" so the metric reflects real engagement — logging in and studying materials should count. Do this FIRST, and re-baseline, or any subsequent improvement will be partly a measurement artefact.
- Reward partial effort: grant streak or XP credit for meaningful progress, not only for submission.
- Build one concrete reason to return tomorrow. The spaced-repetition system already produces exactly this content and it is not surfaced.
- Compute and report D1 / D3 / D7 / D14 / D30 by signup cohort. The data exists; only the query is missing.

### M. Implementation direction

- The measurement change and the product change must be sequenced deliberately. Broadening "active" will increase the retention number on its own, with no product improvement whatsoever. Re-baseline before, and report both definitions during the transition, or the improvement will be uninterpretable.
- Rewarding partial effort touches the habit-loop write path, which currently has exactly one trigger. Adding a second writer needs care around double-counting when a partially-completed test is later submitted.
- Cohorted retention is a reporting build, not a product build — it needs no schema change.
- NO PRODUCTION CHANGE IS MADE BY THIS DASHBOARD.

> **Scope boundary.** This report is a reporting and planning artefact. No production code, database, configuration or deployment has been modified. This section describes what a developer should change; it does not change it.

### N. Success metric

- PRIMARY: D1, D3, D7, D14 and D30 retention exist as reported metrics. The first target is the existence of the measurement — no retention percentage target can responsibly be set before the curve has been seen once.
- SECONDARY: return rate among test-completers. Current 5.6% (16 / 286), against the narrow definition of active.
- GUARDRAIL: report the narrow and broadened definitions side by side for at least one full cycle, so the definitional lift is separated from the real one.
- BASELINE FIRST — TARGET TO BE SET AFTER EXPERIMENT.

### O. Priority

**P1**

### P. Confidence

High for the measured counts. Medium for the causal attribution and for how much of the loss is churn versus cohort immaturity.

### Q. Source

- Stage 3 production queries (daily_activity, test_sessions)
- Stage 2 codebase audit (habit-loop writers, daily_activity writers)
- Final Growth Verification §7, §9
- Backlog register P1-6, P2-12, and P3-5 (carried in: the brief requires partial-effort reinforcement under this flaw, and it is a retention mechanism rather than code debt)

<a id="flaw-7"></a>

---

# FLAW #7 — Weak content engagement & surfacing

| Priority | Category | Severity | Evidence status | Root cause status | Confidence | Affected funnel stage |
|---|---|---|---|---|---|---|
| P1 | Engagement | Medium | OBSERVED | OBSERVATION | Medium | Daily engagement → Return visit |

> Content that exists and would bring users back is broken, hidden or unexplained — including a broken image on the daily-return hook itself.

### A. Executive summary

Three separate problems share one shape: content that already exists is not doing the work it could do.

Current Affairs images do not load — a content defect sitting directly on the feature most suited to being a daily-return habit.

The free tier is generous in breadth but under-communicated, so users do not realise what they already have.

Kural of the Day exists as a feature and has nothing prompting anyone to look at it.

None of these require building anything. All three are surfacing and repair.

### B. What is the flaw?

- CURRENT AFFAIRS IMAGES: observed not loading during the walkthrough. Current Affairs is the natural daily hook — it is dated, it renews, and it is exactly what a TNPSC aspirant would open every morning.
- FREE TIER UNDER-COMMUNICATED: "for free should be highlighted more." The free tier grants 50 signup credits plus 10/day, a free 200-question mock, and one free attempt per PYQ and CA topic. Very little of that is stated where a user would see it.
- KURAL OF THE DAY: an existing daily-content feature with no prompt, no notification and no placement that would cause anyone to encounter it.

### C. Why does it matter?

- Daily content is the cheapest available retention mechanism, and this product already has three sources of it: Current Affairs, Kural of the Day, and the spaced-repetition queue.
- 94.4% of test-completers never return. Content that renews daily is the most direct answer to that, and it is currently broken or hidden.
- Under-communicating the free tier costs twice: users do not extract the value they are entitled to, and they cannot perceive what a paid tier would add.

### D. Evidence

| Source | Evidence |
|---|---|
| **[UX]** | Images observed not loading in Current Affairs during the walkthrough. |
| **[UX]** | "for free should be highlighted more." |
| **[UX]** | Kural of the Day surfacing raised unprompted during the walkthrough as an existing feature nobody would find. |
| **[CODE]** | Free tier confirmed in code: 50 signup credits + 10/day (1 credit per question), 1 free 200-question mock ever, 1 free attempt per PYQ/CA topic, on-screen explanations. |
| **[CODE]** | daily_activity is written by current-affairs question completion as well as test submission — so CA engagement is one of only two things that count as activity at all. A broken CA experience therefore suppresses the retention metric directly. |
| **[PROD]** | No per-feature usage data exists for Current Affairs, Kural of the Day or Materials. How many users encounter them is DATA NOT AVAILABLE. |

### E. How did we check?

- First-time-user walkthrough: navigated the Current Affairs section and observed the image loading failure directly.
- Walkthrough: the tester was asked what they got for free and could not fully state it.
- Source-code inspection: read the free-tier credit and entitlement rules to establish what is actually granted.
- Source-code inspection: confirmed that current-affairs completion is one of only two writers of daily_activity.
- Root cause of the image failure was NOT determined — no diagnosis of the asset pipeline, CDN or content-entry path was performed. DATA GAP.

### F. Numbers

| Metric | Calculation | Value |
|---|---|---|
| Free tier: signup credits | `code` | **50, plus 10/day** |
| Free tier: full mock exams | `code` | **1, ever** |
| Free tier: attempts per topic | `code` | **1 per PYQ / CA topic** |
| Current Affairs image failure | `walkthrough observation` | **Observed — scope and cause unknown** |
| Users affected by the image issue | `no per-feature usage data` | **DATA NOT AVAILABLE** |
| Kural of the Day engagement | `not instrumented` | **DATA NOT AVAILABLE** |

### G. Affected users

| Dimension | Value |
|---|---|
| Number affected | Unknown — no per-feature usage instrumentation exists |
| Percentage affected | DATA NOT AVAILABLE |
| Funnel stage affected | Daily engagement → Return visit |
| Note | The upper bound is everyone who opens Current Affairs; the lower bound is unknown because the failure was observed once, on one device, in one session. Reproduction scope was not established. |

### H. Root cause

**CONFIRMED root cause**

- Current Affairs images failed to load in the observed session.
- The free tier's contents are not communicated on the surfaces where a user would look.
- Kural of the Day has no prompt, notification or placement driving traffic to it.

**HYPOTHESIS — unproven**

- That the image failure is systemic rather than incidental. UNVERIFIED — observed once. It should be reproduced before it is prioritised as a widespread defect.
- That better free-tier communication would improve both engagement and eventual conversion. Untested.
- That surfacing daily content would improve return rates. Structurally plausible given that CA completion is one of only two activity writers; untested.

### I. User impact

- A user opens Current Affairs — the thing most likely to bring them back daily — and finds broken images. The product looks unfinished.
- A user does not know what they are entitled to for free, so they under-use it and cannot judge what paying would add.
- A feature built for daily engagement sits unvisited because nothing points to it.

### J. Business impact

- Lost retention: the daily-return hook is degraded, and CA completion is one of only two events that count as activity.
- Lost activation: under-communicated free value reduces the chance a user finds a reason to start at all.
- Lost conversion: a user who cannot articulate what free gives them cannot articulate what paid would add.
- All three are UNQUANTIFIED. No per-feature usage data exists.

### K. Developer impact

- The Current Affairs module and its image/asset pipeline — the failure needs diagnosis before it can be fixed.
- The Kural of the Day feature and whatever surface would prompt it (home placement, notification, or daily card).
- The free-tier communication surfaces: post-signup, home, and the pricing screen.
- Instrumentation: per-feature usage events do not exist for any content module.

### L. Recommended fix

- Diagnose and fix the Current Affairs image failure, and determine its scope — one broken item or a systemic pipeline problem.
- State the free tier plainly where a new user will see it: what they get, how much, and for how long.
- Give Kural of the Day a daily surface — a home card or a notification.
- Instrument content-module usage so that "nobody uses this feature" can be distinguished from "nobody can find this feature".

### M. Implementation direction

- Reproduce the image failure before scoping the work. A single walkthrough observation is enough to justify investigation, not enough to justify a rebuild.
- Free-tier communication belongs next to the value moment, not on the pricing screen — a user needs to know what they have before they can evaluate what they lack.
- Content instrumentation should follow the existing event pattern rather than introducing a second analytics path.
- NO PRODUCTION CHANGE IS MADE BY THIS DASHBOARD.

> **Scope boundary.** This report is a reporting and planning artefact. No production code, database, configuration or deployment has been modified. This section describes what a developer should change; it does not change it.

### N. Success metric

- PRIMARY: zero broken images in Current Affairs, verified by an automated asset check rather than by inspection. DEFINITIONAL target.
- SUPPORTING: Current Affairs daily completion count becomes a reported metric — it already writes to daily_activity and is simply not reported.
- SUPPORTING: Kural of the Day view count exists at all. Currently DATA NOT AVAILABLE.
- SUPPORTING: share of new users who can state what the free tier includes — measurable only through the redesigned feedback instrument (Flaw #14).
- BASELINE FIRST — TARGET TO BE SET AFTER EXPERIMENT for every rate-based metric here.

### O. Priority

**P1**

### P. Confidence

Medium — the observations are direct but n = 1, and the scope of the image failure was never established.

### Q. Source

- First-time-user walkthrough
- Stage 2 codebase audit (free-tier entitlements, daily_activity writers)
- Backlog register P1-5, P1-7, P1-8

<a id="flaw-8"></a>

---

# FLAW #8 — Extremely weak monetization performance

| Priority | Category | Severity | Evidence status | Root cause status | Confidence | Affected funnel stage |
|---|---|---|---|---|---|---|
| P0 | Monetization | Critical | CONFIRMED | CONFIRMED | High | Payment (outcome) |

> 682 users, 83 days, ₹899 of all-time revenue — and every rupee of it internally generated. Externally-acquired revenue is ₹0.

### A. Executive summary

This flaw is the scoreboard. It has no independent fix — it is the measured outcome of Flaws #1, #2, #3 and #9, and it will move only when they do.

Four payment records exist. Three are internal staff comps at ₹0, confirmed by the founder. The fourth carries the only money in the system — ₹899 — and it was founder-generated.

Externally-generated revenue is therefore ₹0, and the ₹899 cannot be treated as evidence of product-market fit. It is evidence that the payment pipeline works end to end, which is a genuine engineering result and not a commercial one.

In the last 30 days, 366 people signed up and none of them paid anything.

### B. What is the flaw?

- Zero externally-acquired paying customers across the platform's entire 83-day life.
- Revenue is concentrated to a single point: one plan, one transaction, one internally-generated buyer.
- The dashboard the founder reads makes this harder to see, not easier: premiumActive counts only 1 of the 5 plans (see Flaw #13), and nothing in the system distinguishes an internal comp from a real customer.
- There is no external-revenue metric anywhere. All-time revenue and externally-generated revenue are different numbers with a ratio of ₹899 to ₹0, and only the first is reported.

### C. Why does it matter?

- It is the business outcome every other flaw feeds into.
- Distinguishing internal from external revenue is not accounting pedantry: a founder looking at "1 paying customer, ₹899" may reasonably read early traction. The correct reading is that nobody outside the building has ever paid.
- It sets the success criterion for everything else. Externally-acquired paying customers moving from 0 to 1 is a larger event for this business than any percentage improvement anywhere else in the funnel.

### D. Evidence

| Source | Evidence |
|---|---|
| **[PROD]** | 4 payment records with status = paid. |
| **[FOUNDER]** | 3 of those 4 are internal staff accounts, comped at ₹0. Founder-confirmed. |
| **[PROD]** | Exactly one payment record carries a non-zero amount: 89,900 paise = ₹899. |
| **[FOUNDER]** | The founder states the single paying customer was internally generated. Since only one record carries money, that record is necessarily the one — this is arithmetic on aggregates, not identification of a user. |
| **[PROD]** | 366 signups in the trailing 30 days → 0 new paying customers. |
| **[PROD]** | 0 failed payments and 0 refunds in 83 days. The rail is not the problem. |
| **[PROD]** | 0 coupon redemptions in 83 days. |
| **[PROD]** | Only vettri_nichayam has ever converted. premium_annual, rank_booster_g2 and group1_mock_pack are all 0. |
| **[PROD]** | RETRACTED FINDING: an earlier comparison showed paying users with ~8× the engagement of non-payers. That was an artifact of staff accounts building and testing the product. It measured internal activity, not buyer behaviour, and must not be cited. |

### E. How did we check?

- Production SQL (read-only): counted payments by status and summed amounts, in paise.
- Production SQL (read-only): grouped paid records by plan key to establish which plans have ever converted.
- Production SQL (read-only): counted signups and paid records in the trailing 30-day window.
- Founder confirmation: which paid accounts are staff, and that the single revenue-bearing customer was internally generated.
- Derived arithmetic, shown in full: 4 paid records − 3 staff comps = 1 revenue-bearing record; 1 founder-generated = 0 externally acquired.
- The earlier paying-vs-non-paying behavioural comparison was re-examined against the staff-account finding and formally retracted.

### F. Numbers

| Metric | Calculation | Value |
|---|---|---|
| All-time revenue | `89,900 paise` | **₹899** |
| Externally-generated revenue | `₹899 − ₹899 internal` | **₹0** |
| Paid records | `payments status=paid` | **4** |
| Internal staff comps | `founder-confirmed` | **3 (₹0)** |
| Revenue-bearing customers | `non-zero amount` | **1 (founder-generated)** |
| Externally-acquired customers | `0 / 682` | **0.00%** |
| Overall conversion (all paid records) | `4 / 682` | **0.59%** |
| Revenue-generating conversion | `1 / 682` | **0.15%** |
| Last-30-day conversion | `0 / 366` | **0.00%** |
| Revenue per day | `₹899 / 83 days` | **₹10.83** |
| ARPU | `₹899 / 682` | **₹1.32** |
| Annualised run-rate | `₹899 / 83 × 365` | **≈ ₹3,953 — SCENARIO, arithmetic on one transaction** |

### G. Affected users

| Dimension | Value |
|---|---|
| Number affected | 682 registered users, of whom 0 have been converted externally |
| Percentage affected | 0.00% external conversion |
| Funnel stage affected | Payment — the terminal stage |
| Note | The affected population here is the business itself. Every acquired user is affected in the sense that none of them has been monetised. |

### H. Root cause

**CONFIRMED root cause**

- This flaw has no independent root cause. It is the arithmetic outcome of Flaws #1 (value), #2 (pricing clarity), #3 (trust) and #9 (recovery).
- The payment infrastructure is NOT a cause: 0 failures, 0 refunds, HMAC verification, idempotency, and a server-side re-fetch before crediting.
- Checkout is NOT a cause: verified working to the final payment step on a real device.
- Price is NOT established as a cause: with zero external conversions at any price point, there is no evidence that price is the binding constraint.

**HYPOTHESIS — unproven**

- That the binding constraint is value perception rather than price. This is the strongest available reading and remains a hypothesis — see Flaw #1.

### I. User impact

- For users, nothing is broken. They can pay if they want to; the flow works.
- The impact is that 682 people have used a product and, with one internal exception, none of them found a reason to pay for it.

### J. Business impact

- Lost revenue: total. ₹0 externally generated in 83 days.
- Lost validation: without a single external customer, willingness to pay is untested at every price point.
- Blocked analysis: the activation-threshold hypothesis — that completing N tests predicts conversion — CANNOT be tested, because there is no externally-acquired paying population to compare against. Any pricing or gating decision justified by that hypothesis would be unsupported.
- Misreading risk: reported as "1 paying customer, ₹899", the situation looks like early traction. It is not.

### K. Developer impact

- The payments ledger, which is sound and needs no change.
- revenue_metrics.sql — where premiumActive counts 1 of 5 plans, understating any future paid cohort (Flaw #13).
- A missing distinction: nothing in the schema separates an internal comp from a real customer. That distinction is currently maintained by founder memory alone.
- Comp grants write a synthetic order ID directly to paid and never produce a created row, so they silently do not appear as checkout attempts — worth knowing before anyone builds a conversion report on this table.

### L. Recommended fix

- This flaw is not fixed directly. Ship Flaws #1, #2, #3 and #9.
- Add an explicit internal/comp flag to payment records so external revenue is computable without founder memory.
- Report externally-generated revenue as the headline figure, with all-time revenue secondary.
- Fix premiumActive to count all five plans before any real paid cohort exists, so the first customers are not undercounted from day one.

### M. Implementation direction

- The internal/comp distinction should be a column, not a convention. Today it lives in one person's knowledge and would be lost the moment the team grows.
- Do not change prices. Zero external conversions means there is no evidence price is the binding constraint, and cutting prices before establishing value would forfeit margin without addressing the cause.
- Do not restructure plans yet, beyond making them describable — see Flaw #2.
- NO PRODUCTION CHANGE IS MADE BY THIS DASHBOARD.

> **Scope boundary.** This report is a reporting and planning artefact. No production code, database, configuration or deployment has been modified. This section describes what a developer should change; it does not change it.

### N. Success metric

- PRIMARY: externally-acquired paying customers > 0. Currently 0. This is the single most important number in the entire audit.
- SECONDARY: externally-generated revenue > ₹0. Currently ₹0.
- SUPPORTING: at least two distinct plans have converted at least once, which would begin to indicate the catalogue is legible.
- No revenue target is set. A revenue forecast built on one internally-generated transaction would be fabrication — BASELINE FIRST, TARGET TO BE SET AFTER EXPERIMENT.

### O. Priority

**P0**

### P. Confidence

High — every figure is a direct production count, and the internal/external split is founder-confirmed.

### Q. Source

- Stage 3 production queries (payments)
- Founder confirmation (staff comps, internal customer)
- Final Growth Verification §1, §4, §10, §11
- Backlog register P1-9, P1-10

<a id="flaw-9"></a>

---

# FLAW #9 — Unused conversion & recovery mechanisms

| Priority | Category | Severity | Evidence status | Root cause status | Confidence | Affected funnel stage |
|---|---|---|---|---|---|---|
| P1 | Monetization | High | CONFIRMED | CONFIRMED | High | Checkout → Payment → Recovery |

> 11 people accepted a price and did not pay, the oldest 79 days ago — and nothing follows up. A complete coupon and promoter system sits fully built and has never been used once.

### A. Executive summary

Two fully-built systems are producing nothing.

The first is checkout recovery, which does not exist. 20 payment orders sit at status "created" from 11 distinct people, spanning 18 Jun to 5 Sep. No cleanup, retry, reminder or follow-up exists. The oldest has been unresolved for 79 days.

The second is the coupon and promoter system, which is complete — including per-promoter revenue tracking — and has been redeemed zero times in 83 days. The walkthrough found why: "Where to get the coupon codes." There is no discoverable path to one.

These 11 people are the highest-intent prospects the business has ever had. A created row is written server-side only after a confirmation dialog showing the plan and the final price, so every one of them accepted a price and then stopped.

### B. What is the flaw?

- NO RECOVERY: there is no mechanism of any kind for a payment order that is created and never completed. No cleanup job, no retry prompt, no reminder, no support outreach, no tracking of whether recovery ever happens.
- NO COUPON PATH: the coupon system works and is server-validated. Nothing in the product tells a user where a code comes from or where to enter it.
- NO CROSSOVER ANALYSIS: whether any of the 11 later converted has not been queried. It is knowable and has not been looked at.
- NO ABANDONMENT SIGNAL: the created row is the only trace. There is no event marking that a user reached the payment screen and left, so recovery could not be triggered even if a mechanism existed.

### C. Why does it matter?

- These are the warmest prospects in the business. Everyone else in the funnel has an unknown level of intent; these 11 demonstrated it by accepting a price.
- One of them returned five times across 59 days and never bought — sustained interest against an objection nobody has ever asked about.
- The coupon system represents completed engineering work producing zero return. Switching it on is a recruitment problem, not a build.

### D. Evidence

| Source | Evidence |
|---|---|
| **[PROD]** | 20 payment rows at status = created, never completed. |
| **[PROD]** | 11 distinct users behind those 20 rows. Attempts per user: 5, 3, 2, 2, 2, 1, 1, 1, 1, 1, 1. |
| **[PROD]** | First attempt 18 Jun 2026 — four days after the platform's first-ever signup. Last attempt 5 Sep 2026, the day of the audit. |
| **[PROD]** | Oldest unresolved attempt: 79 days. |
| **[PROD]** | One user returned to checkout 5 times across 59 days without buying. Three users show multi-day repeat patterns (59d, 16d, 13d spans, 10 attempts total). |
| **[PROD]** | Two users show cross-plan repeats within seconds (12s and 11.7s) — comparison-shopping, not technical failure. See Flaw #2. |
| **[PROD]** | Six users made a single attempt and never returned. |
| **[PROD]** | 0 coupon redemptions across every plan in 83 days. |
| **[UX]** | "Where to get the coupon codes" — there is no discoverable path to a code inside the product. |
| **[CODE]** | The coupon system is complete and server-validated, including per-promoter redemption tracking (topPromoters is a live computed field). |
| **[CODE]** | coupon_applied is tracked; coupon_viewed is not — so it is impossible to distinguish "nobody looks for a code" from "nobody can find where to enter one". |

### E. How did we check?

- Production SQL (read-only): selected payment rows at status = created with no corresponding paid record, grouped by user and by plan.
- Production SQL (read-only): examined created_at timestamps per user to derive the attempt-timing patterns and the 79-day age of the oldest unresolved attempt.
- Production SQL (read-only): summed used_coupon across every plan, returning 0.
- Source-code inspection: searched for any cleanup job, retry path, reminder or recovery mechanism attached to created payment rows. None exists.
- Source-code inspection: read the coupon validation and promoter-tracking implementation to confirm the system is complete and functional.
- First-time-user walkthrough: the tester attempted to find a coupon code and could not.
- NOT CHECKED: whether any of the 11 later converted. The crossover query has not been run — DATA GAP.

### F. Numbers

| Metric | Calculation | Value |
|---|---|---|
| Abandoned payment orders | `status=created, never completed` | **20** |
| Distinct people behind them | `distinct user_id` | **11** |
| Attempts per person | `distribution` | **5, 3, 2, 2, 2, 1, 1, 1, 1, 1, 1** |
| Oldest unresolved attempt | `18 Jun → 5 Sep` | **79 days** |
| Recovery mechanisms in existence | `code inspection` | **0** |
| Coupon redemptions in 83 days | `used_coupon across all plans` | **0** |
| Coupon-attributed revenue | `0 redemptions` | **₹0** |
| Scenario value of abandoned attempts at list price | `12×₹1,699 + 3×₹1,249 + 3×₹899 + 2×₹399` | **₹27,630 — SCENARIO ONLY, roughly 31× all-time revenue. This is expressed intent, NOT lost revenue and NOT a forecast.** |
| Did any of the 11 later convert? | `query not run` | **DATA NOT AVAILABLE** |

### G. Affected users

| Dimension | Value |
|---|---|
| Number affected | 11 identifiable high-intent people; the entire referral and promoter channel |
| Percentage affected | 11 of 682 users (1.6%) reached a price-accepted checkout; 20 of 21 attempts (95.2%) were abandoned with no follow-up |
| Funnel stage affected | Checkout → Payment → Recovery |
| Note | The 11 are individually identifiable in the database. NO USER HAS BEEN OR WILL BE CONTACTED AS PART OF THIS AUDIT. Recovery is described here strictly as a product mechanism to be built. |

### H. Root cause

**CONFIRMED root cause**

- No recovery mechanism exists. Confirmed by code inspection — there is no cleanup job, no retry, no reminder, no follow-up.
- No discoverable path to a coupon code exists in the product. Confirmed by walkthrough.
- The coupon infrastructure itself works and is server-validated — this is not a broken feature, it is an unused one.
- coupon_viewed is not instrumented, so the two possible causes of zero redemptions cannot be separated.

**HYPOTHESIS — unproven**

- That the 11 abandoners had a resolvable objection. Supported by the repeat-attempt patterns — a user returning 5 times across 59 days is not disinterested — but the objection itself is unknown.
- That zero redemptions is a distribution problem (no promoters recruited) rather than a discoverability problem (no path to enter a code). Both are likely true simultaneously; neither has been isolated.

### I. User impact

- A user decides to buy, confirms the plan and the price, reaches the payment screen, and stops. Nothing ever asks why, offers help, or reminds them.
- A user hears about a discount and cannot find anywhere to enter a code.
- A user returns to the checkout screen five times over two months, still unresolved.

### J. Business impact

- Lost conversion, concentrated in the highest-intent segment available.
- The entire referral and word-of-mouth channel is inert. For an audience that clusters physically — coaching centres, library reading rooms, town study groups — this is the cheapest acquisition channel there is, and it is switched off.
- Lost diagnostic value: the 11 abandoners are the fastest available route to resolving the plan-confusion versus price-resistance question in Flaw #2. Asking them is a business decision for the founder to make, not an audit action.

### K. Developer impact

- The payments ledger and the lifecycle of created rows, which currently have no terminal handling.
- The coupon entry surface — where a user would enter a code, which they cannot find.
- The promoter tracking system, which is built and reporting on zero data.
- Instrumentation: coupon_viewed, and an explicit checkout-abandoned signal, neither of which exists.

### L. Recommended fix

- RECOVERY FUNNEL — build it as a measurable sequence: Checkout started → Payment created → Paid → Unrecovered. Today only the first three states exist and the fourth is silent.
- Add a recovery mechanism, staged: an in-product reminder for a user who returns, a retry path from an incomplete order, a support or value-clarification touchpoint, and recovery tracking so the mechanism can be judged.
- Make the coupon path discoverable: put code entry where a buyer will see it, and explain where codes come from.
- Recruit promoters. The tracking is already built — this is a recruitment problem, not an engineering one.
- Instrument coupon_viewed so zero redemptions can be diagnosed rather than guessed at.
- Run the crossover query: did any of the 11 later convert? It is a single read-only SELECT and it changes how this flaw should be read.

### M. Implementation direction

- Order matters: build recovery TRACKING before recovery ACTION, or the first recovery campaign will be unmeasurable.
- A created row that is never completed currently has no terminal state. Deciding what that state is — expired, abandoned, superseded — is a prerequisite for any recovery logic.
- Coupon discoverability and promoter recruitment are separable and should be measured separately, since they fail for different reasons.
- EXPLICIT SCOPE BOUNDARY: this audit does not contact users. The 11 abandoners are identifiable in the database and no outreach of any kind has been performed or is recommended as an audit action. Whether to contact them is the founder's decision.
- NO PRODUCTION CHANGE IS MADE BY THIS DASHBOARD.

> **Scope boundary.** This report is a reporting and planning artefact. No production code, database, configuration or deployment has been modified. This section describes what a developer should change; it does not change it.

### N. Success metric

- PRIMARY: abandoned-checkout recovery rate exists as a measurable metric. It currently cannot be computed because no recovery mechanism exists.
- SECONDARY: coupon redemptions > 0. Currently 0 in 83 days.
- SUPPORTING: coupon_viewed instrumented, so redemption failure can be attributed to discoverability or to distribution.
- SUPPORTING: payment orders older than N days have a defined terminal state rather than sitting at created indefinitely. DEFINITIONAL target.
- BASELINE FIRST — TARGET TO BE SET AFTER EXPERIMENT for every rate here.

### O. Priority

**P1**

### P. Confidence

High — the abandonment counts, timings and zero redemptions are direct production measurements, and the absence of a recovery mechanism was confirmed by code inspection.

### Q. Source

- Stage 3 production queries (payments created rows, timestamps, used_coupon)
- Stage 2 codebase audit (coupon system, promoter tracking, absence of recovery)
- First-time-user walkthrough
- Final Growth Verification §6, §11
- Backlog register P1-11, P1-12

<a id="flaw-10"></a>

---

# FLAW #10 — Weak organic discoverability

| Priority | Category | Severity | Evidence status | Root cause status | Confidence | Affected funnel stage |
|---|---|---|---|---|---|---|
| P2 | Acquisition | Medium | CONFIRMED | CONFIRMED | High | Discovery |

> Five URLs in the sitemap, zero third-party mentions anywhere, and absent from the category's primary search — a genuine weakness, but NOT the current bottleneck.

### A. Executive summary

There is almost no organic path to this product. The sitemap lists five URLs: the homepage and four legal pages. The seven products named in the site's own structured data have no pages of their own.

A search for "TNPSC group 2 test series" returns Veranda Race first and TNPSC Master second. TNPSC Mentors does not appear. Searching the brand name plus "reviews", "pricing" or "complaint" returns nothing about this site at all.

Every route returns the same title and meta description, because the site is a pure client-rendered SPA with no per-route server output. Any link shared on WhatsApp or Telegram — the two channels this audience actually uses — unfurls as the generic homepage.

IMPORTANT CONTEXT: this is a genuine weakness and it is NOT the immediate bottleneck. Acquisition is growing — 226 signups in July, 396 in August, 366 in the last 30 days. Whatever channels are working are working without organic search.

### B. What is the flaw?

- FIVE INDEXABLE URLS: home, /privacy, /guidelines, /payment-policy, /refund-policy. Seven distinct product intents compete for one homepage.
- NO PER-ROUTE METADATA: identical title and description on every route sampled. Link previews are wrong everywhere.
- ZERO THIRD-PARTY FOOTPRINT: no reviews, comparisons, forum threads or citations exist for the brand anywhere. The same searches return rich results for half a dozen competitors.
- NOTHING IS SHAREABLE AS ITSELF: a student cannot forward "here is the Group 2 test series" — only "here is the homepage".
- The foundation is actually good and unused: clean EducationalOrganization and FAQPage JSON-LD, bilingual inLanguage tags, and a correctly-engineered robots.txt that indexes the marketing site and noindexes the logged-in app. There is simply almost nothing behind it to index.

### C. Why does it matter?

- Organic search is the only acquisition channel that compounds without ongoing spend, and it is currently at zero.
- It is also the only channel that captures intent at the moment it exists — a student searching "TNPSC previous year questions" is further down the funnel than anyone reached through social.
- BUT: it is explicitly NOT the current bottleneck. Acquisition is growing without it. Fixing discovery while conversion sits at 0.00% would deliver more users into a funnel that monetises none of them.

### D. Evidence

| Source | Evidence |
|---|---|
| **[EXT]** | curl of /sitemap.xml: 5 URLs total — home + /privacy + /guidelines + /payment-policy + /refund-policy. |
| **[EXT]** | The site's own JSON-LD names 7 distinct products (Group 2, English test, Tamil test, PYQ, PYQ-with-explanation, daily current affairs, general test series). None has its own URL. |
| **[EXT]** | Identical <title> and meta description confirmed across 4 sampled routes. |
| **[EXT]** | Web search for the brand name plus "reviews" / "pricing" / "complaint": zero results about this site. |
| **[UX]** | Search for "TNPSC group 2 test series": Veranda Race 1st, TNPSC Master 2nd, TNPSC Mentors absent. |
| **[EXT]** | 7 competing TNPSC apps rank on these keywords: Testbook, Entri, Nithra, KalviApp, Yukthi, Aram, TNPSC Master. |
| **[EXT]** | GOOD: robots.txt is correctly engineered — marketing site indexable, logged-in app noindexed. GOOD: clean structured data already in place. |
| **[PROD]** | COUNTERWEIGHT: acquisition is growing without organic search. 19 (17 days) → 226 → 396 signups by month; 366 in the last 30 days. |

### E. How did we check?

- External inspection: curl of /sitemap.xml and a direct count of the URLs returned.
- External inspection: curl of the title tag and meta description across four routes, compared for uniqueness.
- External inspection: read the site's JSON-LD structured data and enumerated the products it names.
- Search-engine inspection: searched the category's primary commercial query and recorded the ranking set.
- Search-engine inspection: searched the brand name with review, pricing and complaint modifiers.
- External inspection: read robots.txt including its own maintainer comments.
- Production SQL (read-only): the monthly signup trend, used here as a counterweight to prevent this flaw being over-prioritised.

### F. Numbers

| Metric | Calculation | Value |
|---|---|---|
| URLs in sitemap.xml | `direct count` | **5** |
| Products named in the site's own structured data | `JSON-LD` | **7** |
| Products with their own URL | `5 URLs, 4 of them legal` | **0** |
| Third-party mentions or reviews | `web search` | **0** |
| Competing apps ranking on these keywords | `search results` | **7** |
| Routes with unique title/meta | `4 sampled` | **0** |
| Organic sessions | `no server-side pageview store; no attribution` | **DATA NOT AVAILABLE** |

### G. Affected users

| Dimension | Value |
|---|---|
| Number affected | Everyone who searches for this category and does not find this product — unmeasurable |
| Percentage affected | DATA NOT AVAILABLE — there is no visitor store and no channel attribution |
| Funnel stage affected | Discovery |
| Note | This flaw affects users the product never acquires, which is precisely why it cannot be measured from inside the product. Its size is unknown. |

### H. Root cause

**CONFIRMED root cause**

- The site is a pure client-rendered SPA with no per-route server output, so no route can carry its own metadata.
- No product landing pages exist, so seven keyword intents compete for one homepage.
- No third-party citation footprint exists.

**HYPOTHESIS — unproven**

- That building product landing pages would produce meaningful organic acquisition. Reasonable — every competitor does it — but unproven for this brand, and the payoff horizon is months.
- That improved discoverability is worth doing BEFORE conversion is fixed. This report explicitly argues against that reading: acquisition is already growing and conversion is at zero.

### I. User impact

- A student searching for exactly what this product offers never finds it.
- A student who wants to share it can only share a homepage link, which unfurls identically no matter what they meant to send.
- A student researching the brand finds no reviews, no comparisons and no third-party discussion, which for a paid product is itself a trust signal.

### J. Business impact

- Lost acquisition of the highest-intent traffic available. UNQUANTIFIED — there is no visitor store and no attribution.
- Total dependence on channels that require continuous effort or spend, with no compounding asset accumulating.
- Sharing friction inside the audience's primary distribution channels, WhatsApp and Telegram.
- DELIBERATE COUNTERWEIGHT: acquisition is currently growing. This is a missed opportunity, not an active leak.

### K. Developer impact

- Rendering architecture — per-route metadata requires SSR, prerendering or static generation for the marketing surface.
- Routing and the sitemap generation path.
- Content: product landing pages are a content build as much as an engineering one.
- The existing JSON-LD is already correct and would attach to new pages without rework.

### L. Recommended fix

- Ship an indexable landing page for each of the seven products the site's own structured data already names.
- Add per-route titles and meta descriptions via prerendering or SSR so shared links unfurl correctly.
- Add topic and syllabus pages — subject-wise PYQ writeups, per-group syllabus pages, daily current-affairs content — reusing content that is already produced for the app.
- SEQUENCING: do this in Phase 5, after conversion and activation. Directing more traffic into a funnel with 0.00% external conversion converts effort into nothing.

### M. Implementation direction

- The marketing surface and the app shell have different rendering needs. The app is correctly noindexed already; only the marketing surface requires server-rendered metadata.
- Content for the topic pages already exists — daily current affairs and the exam schedules are produced for the app anyway. This is a publishing problem more than a writing one.
- Judge this work on organic sessions and ranked queries, never on page count. Page count is an output.
- NO PRODUCTION CHANGE IS MADE BY THIS DASHBOARD.

> **Scope boundary.** This report is a reporting and planning artefact. No production code, database, configuration or deployment has been modified. This section describes what a developer should change; it does not change it.

### N. Success metric

- PRIMARY: organic sessions, and the number of queries the site ranks for. Both currently DATA NOT AVAILABLE — the measurement must exist before the target can.
- SUPPORTING: routes with unique title and meta description. Currently 0 of 4 sampled. DEFINITIONAL target: all of them.
- SUPPORTING: indexable product pages. Currently 0 of 7 named products.
- BASELINE FIRST — TARGET TO BE SET AFTER EXPERIMENT. SEO outcomes have a 90-day-plus horizon and no responsible target can be set at this stage.

### O. Priority

**P2**

### P. Confidence

High — every finding here was directly observed over public HTTP. The priority assignment is a judgment call, explicitly justified by the confirmed acquisition growth.

### Q. Source

- Stage 1 external audit (sitemap, metadata, search, competitors, robots.txt, structured data)
- First-time-user walkthrough (search visibility)
- Stage 3 production queries (signup trend, used as counterweight)
- Backlog register P2-1, P2-2, P2-3

<a id="flaw-11"></a>

---

# FLAW #11 — Poor public product & commercial visibility

| Priority | Category | Severity | Evidence status | Root cause status | Confidence | Affected funnel stage |
|---|---|---|---|---|---|---|
| P2 | Acquisition | Medium | CONFIRMED (pricing) · DATA GAP (app stores) | CONFIRMED | Medium | Discovery → Landing |

> The price cannot be seen without signing up, and no app-store listing was found — though absence of a search result is not proof of absence.

### A. Executive summary

A prospective buyer cannot find out what this product costs without creating an account.

Pricing renders only inside the app shell. There is no /pricing route that can rank in search, be forwarded on WhatsApp, or be read by someone deciding whether to sign up at all. Every competitor checked has one.

Separately, no app-store listing was found for "TNPSC Mentors" on either store — while the codebase contains real in-app-purchase product IDs such as com.tnpscmentor.app.premium90, which implies at least store registration.

THESE TWO FINDINGS HAVE DIFFERENT EVIDENCE STRENGTH, and must not be presented as equally certain. The pricing-page absence is CONFIRMED by direct inspection. The app-store absence is UNCONFIRMED — a search did not find a listing, which is not the same as establishing that none exists.

### B. What is the flaw?

- NO PUBLIC PRICING PAGE (CONFIRMED): pricing is behind the app shell. It cannot rank, cannot be shared, and cannot be evaluated before signup.
- NO APP-STORE LISTING FOUND (UNCONFIRMED): searches on both stores returned no listing under the brand name. The codebase contains real IAP product IDs and native Capacitor targets for Android and iOS, including App Tracking Transparency handling and Android 16 edge-to-edge support — genuine mobile engineering that is not visibly converting into installs.
- The two compound: a user who cannot find the app in a store and cannot find the price on the web has no way to evaluate the product without committing to an account.

### C. Why does it matter?

- Price is a primary qualification signal. Requiring a signup to see it filters out exactly the users who are comparing options — which is most of them.
- Every competitor checked has a public pricing page, and TNPSC Master leads its own with "10,000+ students".
- App-store search is an acquisition channel every serious competitor already owns. Testbook runs two separate TNPSC apps.
- The mobile engineering is already done. If the listing genuinely does not exist, this is unusually high-leverage: publish what has already been built.

### D. Evidence

| Source | Evidence |
|---|---|
| **[EXT]** | CONFIRMED: pricing renders only inside the app shell. No /pricing route appears in the sitemap and none is publicly reachable. |
| **[EXT]** | CONFIRMED: /payment-policy and /refund-policy exist publicly, so paid plans are evidently live — but the price itself is not visible anywhere public. |
| **[EXT]** | CONFIRMED: TNPSC Master publishes a public pricing page (₹299/3mo, ₹449/6mo, ₹599/12mo) with a proof-of-scale claim on it. |
| **[EXT]** | UNCONFIRMED: Google Play and App Store searches for "TNPSC Mentors" / "tnpscmentors" returned no listing. THIS IS A NEGATIVE SEARCH RESULT, NOT A CONFIRMED ABSENCE. |
| **[CODE]** | The codebase contains real IAP product IDs (com.tnpscmentor.app.premium90 and others) tied to store product identifiers. These only function if the app is at least registered in App Store Connect / Play Console. |
| **[CODE]** | Proper Capacitor targets for Android and iOS, with App Tracking Transparency and Android 16 edge-to-edge handling implemented. This is real, non-trivial mobile work. |
| **[EXT]** | Competitors with app-store presence on these keywords: Testbook (two separate TNPSC apps), Entri, Nithra, KalviApp, Yukthi, Aram. |
| **[GAP]** | PENDING FOUNDER ANSWER: is the app published today, under what name, and with what install count? This question has been open since Stage 1 and remains unanswered. |

### E. How did we check?

- External inspection: attempted to reach a public pricing URL and checked the sitemap for one.
- External inspection: confirmed that payment and refund policy pages exist publicly, establishing that paid plans are live.
- External inspection: searched Google Play and the App Store for the brand name and domain.
- Source-code inspection: located the IAP product catalogue and the native platform configuration.
- Competitor inspection: checked competitor pricing pages for public visibility and proof-of-scale claims.
- THE APP-STORE QUESTION WAS NOT RESOLVED. It was escalated to the founder in Stage 1 and again in the Final Verification, and no answer has been received. It is recorded as a DATA GAP, not as a finding.

### F. Numbers

| Metric | Calculation | Value |
|---|---|---|
| Public, indexable pricing pages | `sitemap + direct check` | **0 — CONFIRMED** |
| App-store listings found | `store search` | **0 found — UNCONFIRMED ABSENCE** |
| IAP product IDs present in the codebase | `code inspection` | **Real store product IDs present** |
| Competitors with public pricing | `competitor set` | **All checked** |
| App install count | `no listing located; founder not yet answered` | **DATA NOT AVAILABLE** |

### G. Affected users

| Dimension | Value |
|---|---|
| Number affected | Every prospective buyer who wants to know the price before registering — unmeasurable |
| Percentage affected | DATA NOT AVAILABLE |
| Funnel stage affected | Discovery → Landing |
| Note | As with Flaw #10, this affects users the product never acquires and therefore cannot be measured from inside the product. |

### H. Root cause

**CONFIRMED root cause**

- Pricing is rendered only inside the authenticated app shell. There is no public route for it.
- The SPA architecture provides no per-route server output, so even a /pricing route would need prerendering to be indexable.

**HYPOTHESIS — unproven**

- That the app is genuinely unpublished. NOT ESTABLISHED. The evidence supports only that a search did not find a listing. The IAP product IDs point the other way.
- That a public pricing page would improve conversion or acquisition. Reasonable by competitor analogy; untested here.

### I. User impact

- A user evaluating options cannot compare this product on price without creating an account.
- A user who wants to send the price to someone — a parent, a study group — cannot.
- A user searching the app stores, where much of this audience discovers study apps, may not find the product at all.

### J. Business impact

- Lost acquisition from price-comparison traffic, which is high-intent by definition. UNQUANTIFIED.
- Lost app-store discovery — IF the app is genuinely unlisted. Conditional on an unanswered question.
- Real mobile engineering investment producing no visible install channel. Conditional on the same question.

### K. Developer impact

- A prerendered or server-rendered /pricing route, which the current SPA architecture does not support without a build change.
- The IAP product catalogue and native build configuration, which already exist.
- Store listing assets — ASO copy, bilingual screenshots — which are a content build, not an engineering one.

### L. Recommended fix

- Ship a public, prerendered /pricing route that can rank in search and be forwarded.
- FIRST: get a direct answer on app-store publication status. This single answer determines whether the store work is "publish the existing build" or "nothing to do".
- If unpublished: submit the existing Capacitor build under an exact-match brand name, with keyword-rich descriptions and bilingual screenshots.
- If published: the finding changes from "no listing" to "listing not discoverable", which is a different problem with a different fix (ASO), and this flaw should be re-scoped accordingly.

### M. Implementation direction

- DO NOT ACT ON THE APP-STORE FINDING UNTIL IT IS CONFIRMED. Building a store-submission plan for an app that is already published would be waste, and stating publicly that the app is absent would be wrong.
- The pricing page must be prerendered, not client-rendered, or it will be as invisible as everything else on the domain.
- The public pricing page and the plan clarity work in Flaw #2 should ship together — publishing a confusing plan structure more widely does not help.
- NO PRODUCTION CHANGE IS MADE BY THIS DASHBOARD.

> **Scope boundary.** This report is a reporting and planning artefact. No production code, database, configuration or deployment has been modified. This section describes what a developer should change; it does not change it.

### N. Success metric

- PRIMARY: a public pricing URL exists, is indexed, and unfurls correctly when shared. DEFINITIONAL target.
- SUPPORTING: app-store publication status is a known fact rather than an open question. DEFINITIONAL — this is a documentation target, not a growth one.
- SUPPORTING: if published, install count becomes a reported metric. Currently DATA NOT AVAILABLE.
- BASELINE FIRST — TARGET TO BE SET AFTER EXPERIMENT for any traffic or install outcome.

### O. Priority

**P2**

### P. Confidence

Medium overall — HIGH for the pricing-page absence (directly confirmed), LOW for the app-store absence (a negative search result contradicted by code evidence).

### Q. Source

- Stage 1 external audit (pricing page, store search, competitor set)
- Stage 2 codebase audit (IAP product IDs, Capacitor configuration)
- Final Growth Verification §17 (pending founder answers)
- Backlog register P2-4, P2-6

<a id="flaw-12"></a>

---

# FLAW #12 — No acquisition attribution

| Priority | Category | Severity | Evidence status | Root cause status | Confidence | Affected funnel stage |
|---|---|---|---|---|---|---|
| P1 | Measurement | High | CONFIRMED | CONFIRMED | High | Discovery → Signup (measurement across all stages) |

> Signups grew from 19 to 226 to 396 a month — and there is no column anywhere in the schema that could say where any of them came from.

### A. Executive summary

The one part of this business that is demonstrably working is acquisition. Signups went 19 in a partial June, 226 in July, 396 in August, and 366 in the last 30 days.

Nobody can say why.

An exhaustive search of the production schema returned no utm_source, utm_medium, utm_campaign, utm_content or referrer column anywhere. Channel performance depends entirely on GA4 and Meta's own dashboards, which cannot be joined back to who actually signed up or paid.

This is unrecoverable for every historical period. August's 396 signups will never be attributable to a channel.

### B. What is the flaw?

- NO ATTRIBUTION COLUMNS: utm_source, utm_medium, utm_campaign, utm_content, referrer, landing page, first-touch and last-touch source — none exist.
- NO JOIN PATH: even the analytics that do exist (GA4, Meta Pixel) cannot be joined to profiles or payments, so no channel can ever be linked to a signup or a sale.
- PERMANENTLY UNRECOVERABLE HISTORY: this data was never captured. It cannot be backfilled, reconstructed or inferred for any past period.
- BLOCKS EVERY CHANNEL DECISION: it is impossible to say which channel to do more of, less of, or spend money on.

### C. Why does it matter?

- August was the best acquisition month in the platform's history — 396 signups, more than double July. Something worked, at some cost, and it cannot be identified or repeated deliberately.
- The moment any paid acquisition begins, spend will be unattributable to outcomes. CAC cannot be computed at all.
- It also blocks diagnosis: if activation or conversion differs by channel — and it usually does — that variation is currently invisible, which could be masking a channel that already converts.

### D. Evidence

| Source | Evidence |
|---|---|
| **[CODE]** | Exhaustive search of the production schema for utm_source, utm_medium, utm_campaign, utm_content and referrer: one non-match. No such column exists anywhere. |
| **[CODE]** | Confirmed absent from the schema entirely: any events/analytics table, any acquisition-source column, any session-recording linkage. |
| **[PROD]** | Signups by month: June 19 (17 days), July 226, August 396, September 45 (partial). Every one of these is unattributed. |
| **[PROD]** | 366 signups in the last 30 days — source unknown for all 366. |
| **[PROD]** | 50 signups in the last 7 days — source unknown for all 50. |
| **[CODE]** | GA4, GTM and the Meta Pixel are live and firing for approximately 100% of web sessions (the consent banner was removed by product decision). They still cannot be joined to who paid. |
| **[CODE]** | COMPOUNDING GAP: trackSignUp() has a single call site on the password/OTP path, so Google-created accounts are not even counted as signups in GA4 — see Flaw #13. |

### E. How did we check?

- Source-code and schema inspection: exhaustive grep across the full supabase/ schema tree for UTM, campaign, source, medium and referrer patterns.
- Source-code inspection: enumerated every table in the schema and confirmed no events or analytics table exists.
- Source-code inspection: traced the signup path to confirm nothing captures query parameters or document.referrer at registration.
- Production SQL (read-only): the monthly and trailing-window signup counts, which establish the scale of what is unattributed.

### F. Numbers

| Metric | Calculation | Value |
|---|---|---|
| Attribution columns in the schema | `exhaustive grep` | **0** |
| Signups with a known source | `0 / 682` | **0.00%** |
| August signups, unattributed | `396 / 396` | **100%** |
| Last-30-day signups, unattributed | `366 / 366` | **100%** |
| Channel-level conversion rates | `no channel data exists` | **DATA NOT AVAILABLE** |
| CAC by channel | `no channel data, no spend data` | **DATA NOT AVAILABLE** |
| Historical attribution recoverable? | `the data was never captured` | **NO — permanently unrecoverable** |

### G. Affected users

| Dimension | Value |
|---|---|
| Number affected | All 682 signups, and every future signup until this is instrumented |
| Percentage affected | 100% of acquisition is unattributed |
| Funnel stage affected | Discovery → Signup, with knock-on effects at every downstream stage |
| Note | This flaw does not harm users at all. It harms every decision the business makes about acquisition. |

### H. Root cause

**CONFIRMED root cause**

- No acquisition-source column was ever added to the schema. Confirmed by exhaustive search.
- The signup path does not read UTM parameters or the referrer.
- Third-party analytics cannot be joined to first-party records, because there is no shared key.

**HYPOTHESIS — unproven**

- Which channel actually drove August's growth. Instagram, YouTube, Telegram, referral, organic and direct are all candidates and NONE can be supported by evidence. This report deliberately makes no guess.

### I. User impact

- None. This is invisible to users.

### J. Business impact

- Every channel decision is currently made blind.
- The best acquisition month on record cannot be explained or deliberately repeated.
- Paid acquisition cannot be evaluated: CAC, channel ROI and payback are all uncomputable.
- Channel-level funnel differences are invisible, which may be hiding a channel that already converts better than the blended 0.00%.
- The cost compounds daily: every additional day without capture is another day of permanently unattributable signups.

### K. Developer impact

- The profiles table and the handle_new_user() trigger path — where first-touch source would need to be persisted.
- The signup flow, which must capture UTM parameters and document.referrer before they are lost to navigation.
- Client-side storage for first-touch persistence: a source seen on the landing page must survive until registration, which may be several sessions later.
- The payments table, so that source travels through to revenue and channel ROI becomes computable.

### L. Recommended fix

- Capture at first touch: utm_source, utm_medium, utm_campaign, utm_content, document.referrer and the landing page URL.
- Persist first-touch AND last-touch separately. They answer different questions and one cannot be derived from the other.
- Write both onto the profile at signup, then carry the source through to the payments row, so channel → signup → activation → payment becomes a single joinable path.
- Fix the Google-signup tracking gap at the same time (Flaw #13), or a whole authentication method will remain invisible in the channel data.
- Accept the historical loss explicitly. Do not attempt to reconstruct past attribution — any such reconstruction would be fabrication.

### M. Implementation direction

- First-touch persistence is the part that is easy to get wrong. A user may land from Instagram, leave, and register two days later from a direct visit. Storing only what is visible at registration would attribute that signup to "direct" and be actively misleading.
- Capture must happen on the landing surface, before any client-side routing strips the query string.
- Carrying source into payments is what makes the whole thing worth doing — attribution that stops at signup cannot answer which channel produces revenue.
- This is prospective only. Historical attribution is gone and no estimate of it should ever appear in a report.
- NO PRODUCTION CHANGE IS MADE BY THIS DASHBOARD.

> **Scope boundary.** This report is a reporting and planning artefact. No production code, database, configuration or deployment has been modified. This section describes what a developer should change; it does not change it.

### N. Success metric

- PRIMARY: 100% of NEW signups carry a first-touch source, medium, campaign, referrer and landing page. Currently 0%. DEFINITIONAL target.
- SECONDARY: source is present on the payments row for every new payment, making channel → revenue joinable.
- SUPPORTING: a channel-level funnel report exists — signups, activation rate and conversion rate by source.
- EXPLICIT NON-TARGET: historical attribution. It is unrecoverable and is not part of this success criterion.

### O. Priority

**P1**

### P. Confidence

High — the absence was confirmed by exhaustive schema search, and the acquisition figures it fails to explain are direct production counts.

### Q. Source

- Stage 2 codebase audit (exhaustive schema search)
- Stage 3 production queries (signup trend)
- Latest acquisition verification (monthly and trailing-window signups)
- Final Growth Verification §3, §17
- Backlog register P2-7. PRIORITY NOTE: Stage 2 ranked this P1; the Final Verification ranked it P2. It is assigned P1 here because acquisition is now confirmed to be growing, which raises the cost of not knowing the source. The disagreement is disclosed rather than silently resolved.

<a id="flaw-13"></a>

---

# FLAW #13 — Incomplete product analytics & event tracking

| Priority | Category | Severity | Evidence status | Root cause status | Confidence | Affected funnel stage |
|---|---|---|---|---|---|---|
| P1 | Measurement | High | CONFIRMED | CONFIRMED | High | All stages (measurement layer) |

> The funnel has no top, no pricing-view denominator, no abandonment signal from any paid format, and a signup event that misses everyone who uses Google.

### A. Executive summary

Several of the most important questions in this audit are unanswerable, and this flaw is why.

How many people saw a pricing screen? Unknown — it is not instrumented. Do paying customers finish what they bought? Unknown — paid formats cannot log abandonment. How many people signed up? Undercounted — the signup event fires on only one of two authentication paths. How many paying customers does the founder's own dashboard show? One fifth of them.

Individually these are small defects. Together they mean the funnel cannot be measured end to end, and several conclusions in this report have to be labelled hypothesis when better instrumentation would have made them fact.

### B. What is the flaw?

- NO PRICING-VIEW EVENT: trackViewContent fires on the Register page and the /rank-booster landing page, and is NOT confirmed to fire from the in-app PricingCards screen. The checkout stage of the funnel therefore has no denominator.
- NO PAID-FORMAT ABANDONMENT: record_abandoned_test has one call site, on the free practice engine. Mock, Vettri, Rank Booster and Test Series have no exit button and no abandon call. A quit inside content someone PAID for leaves zero trace. The reported 161 abandonments cover the free engine only.
- GOOGLE SIGNUPS INVISIBLE: trackSignUp() has a single call site on the password/OTP path. A Google-created account fires only trackLogin("google") and is indistinguishable from a returning user.
- premiumActive COUNTS 1 OF 5 PLANS: revenue_metrics.sql filters plan = premium_annual only. Vettri, Rank Booster and Mock Pack customers do not appear in the founder's headline paid figure.
- NARROW ACTIVE DEFINITION: daily_activity is written only by test submission and current-affairs completion. Reading, browsing and revision do not count, so every retention figure is a floor.
- NO VISITOR STORE: there is no server-side pageview log. The funnel has no top and never has had.
- NO PLAN LIFECYCLE EVENTS: expiry is computed on read via bundleAccess() and never written. Renewal and churn are unmeasurable.

### C. Why does it matter?

- Measurement gates every other fix in this report. Without a pricing-view event, the Phase 1 conversion work is unfalsifiable — there will be no way to tell whether it worked.
- Two of the most consequential conclusions in this audit — that value perception drives non-conversion, and that plan confusion suppresses it — remain hypotheses specifically because the instrumentation to test them does not exist.
- The defects also mislead. A founder reading premiumActive sees one fifth of their paying customers. Today that is masked by there being almost none; it becomes actively harmful the moment conversion moves.

### D. Evidence

| Source | Evidence |
|---|---|
| **[CODE]** | trackViewContent call sites: Register page load and the /rank-booster landing page. NOT confirmed on the in-app PricingCards screen. |
| **[CODE]** | record_abandoned_test has exactly one client call site — an Exit→Discard / Back-confirm flow that exists only on the free practice engine (/quiz). MockQuizPage has no exit button and no abandon call. |
| **[CODE]** | trackSignUp() has exactly one call site, in the password/WhatsApp-OTP path. Google-created accounts fire only trackLogin("google"). |
| **[CODE]** | revenue_metrics.sql filters notes->>'plan' = 'premium_annual' for premiumActive, while payingCustomers and paidOrders nearby include all plans. |
| **[CODE]** | daily_activity has exactly two writers: test submission and current-affairs question completion. |
| **[CODE]** | No subscription_renewed, subscription_expired or subscription_cancelled event exists anywhere. Plan expiry is computed on read. |
| **[CODE]** | No server-side pageview store exists. Visitor data lives only in GA4/GTM, which cannot be joined to first-party records. |
| **[PROD]** | CONSEQUENCE: 161 reported abandonments cover only the free practice engine. The true figure across all formats is unknown. |
| **[PROD]** | CONSEQUENCE: the checkout stage of the funnel cannot be expressed as a conversion rate, because the stage above it does not exist as data. |
| **[CODE]** | GOOD, FOR CONTRAST: page_view, login, start_test, submit_test, view_result, checkout_started, payment_success/failed and purchase all fire from single, correct choke-points. The instrumentation that exists is well built. It is incomplete, not sloppy. |

### E. How did we check?

- Source-code inspection: enumerated every call site of trackSignUp, trackViewContent, trackInitiateCheckout and record_abandoned_test across the full src/ and server/ trees.
- Source-code inspection: read revenue_metrics.sql and get_platform_metrics() to establish exactly how each dashboard figure is computed.
- Source-code inspection: traced every writer of daily_activity to establish the operative definition of "active".
- Source-code inspection: searched for subscription lifecycle events and for any server-side pageview store. Neither exists.
- Timezone validation against production: active-today and active-7d were recomputed under both UTC and IST and returned identical values, which downgraded the Stage 2 timezone finding from P0 to P3.
- Cross-check: every measurement claim in this report was traced back to the query or code path that produces it, which is how these gaps were found.

### F. Numbers

| Metric | Calculation | Value |
|---|---|---|
| Funnel stages with no data at all | `visitors, pricing views` | **2** |
| Paid formats able to log abandonment | `Mock, Vettri, Rank Booster, Test Series` | **0 of 4** |
| Authentication paths firing a signup event | `password/OTP yes, Google no` | **1 of 2** |
| Plans counted by premiumActive | `premium_annual only` | **1 of 5** |
| Events writing daily_activity | `test submission, CA completion` | **2** |
| Subscription lifecycle events | `code search` | **0** |
| Reported abandonments, and their true scope | `161 rows, free engine only` | **161 — a lower bound on one engine, not a rate** |
| Checkout conversion rate from pricing views | `no denominator exists` | **DATA NOT AVAILABLE** |

### G. Affected users

| Dimension | Value |
|---|---|
| Number affected | Every metric in this report, and every developer or founder who reads one |
| Percentage affected | 100% of decision-making is affected to some degree |
| Funnel stage affected | All stages — this is the measurement layer |
| Note | No user is harmed by this flaw. Every decision is. |

### H. Root cause

**CONFIRMED root cause**

- Abandonment tracking was built once, for one engine, and never extended to the paid formats.
- The signup event was wired to one authentication path and not updated when Google sign-in was added.
- premiumActive was written when there was one plan and not widened when there were five.
- daily_activity was defined around test submission and never broadened.
- Pricing-view and visitor instrumentation were never built.

**HYPOTHESIS — unproven**

- None required. Every item in this flaw was read directly in source code.

### I. User impact

- None directly. Users are unaffected by measurement gaps.
- Indirectly: every product decision made on incomplete data eventually reaches users as a worse product.

### J. Business impact

- Phase 1 conversion work cannot currently be evaluated. That is the most urgent consequence.
- Two central hypotheses in this audit remain untestable.
- The founder's own paid-customer figure understates reality by up to 80% of plans.
- Abandonment inside paid content — arguably the single most important quality signal a paid product has — is completely invisible.
- Renewal and churn will be unmeasurable for the first paying cohort, whenever it exists.

### K. Developer impact

- authStore.ts — one added trackSignUp() call on the Google path. Trivial.
- PricingCards and the individual plan cards — a pricing_viewed event and per-card view/click events.
- MockQuizPage.tsx — an abandon/heartbeat beacon mirroring the practice engine. This is the largest item in the flaw.
- revenue_metrics.sql — widen the premiumActive filter or replace it with a per-plan breakdown.
- daily_activity writers — broaden the definition of active, deliberately and with re-baselining.
- Plan lifecycle: write expiry and renewal as events rather than computing them on read.
- A server-side pageview log, if top-of-funnel volume is ever to be known.

### L. Recommended fix

- ORDER BY DEPENDENCY, NOT BY EFFORT. Ship pricing_viewed FIRST — it gates the evaluation of all of Phase 1.
- Add trackSignUp() to the Google path so signup counts are complete.
- Extend abandon tracking to Mock, Vettri, Rank Booster and Test Series, mirroring the existing practice-engine pattern.
- Widen premiumActive to all five plans, or replace it with a per-plan breakdown.
- Broaden the active-user definition, and re-baseline retention against both definitions during the transition.
- Write subscription lifecycle events so the first paying cohort is measurable from day one.
- Add a privacy-safe first-party server-side pageview count so the funnel finally has a top.

### M. Implementation direction

- The existing instrumentation is well built — single, correct choke-points for each event. New events should follow the same pattern rather than introducing a second analytics path.
- Broadening the active definition will raise retention numbers with no product improvement at all. Report both definitions in parallel for at least one full cycle or the change becomes indistinguishable from progress.
- The paid-format abandon beacon is the only item here that is more than trivial, because those screens currently have no exit affordance to hang it on.
- NO PRODUCTION CHANGE IS MADE BY THIS DASHBOARD.

> **Scope boundary.** This report is a reporting and planning artefact. No production code, database, configuration or deployment has been modified. This section describes what a developer should change; it does not change it.

### N. Success metric

- PRIMARY: the funnel is measurable end to end — every stage has both a numerator and a denominator. DEFINITIONAL target.
- pricing_viewed fires from PricingCards, giving the checkout stage a denominator.
- Paid formats logging abandonment: 4 of 4, currently 0 of 4. DEFINITIONAL.
- Authentication paths firing a signup event: 2 of 2, currently 1 of 2. DEFINITIONAL.
- Plans counted by premiumActive: 5 of 5, currently 1 of 5. DEFINITIONAL.
- Subscription lifecycle events exist. DEFINITIONAL.
- These are all correctness targets with obviously correct values, which is why they are stated as numbers rather than as BASELINE FIRST.

### O. Priority

**P1**

### P. Confidence

High — every item was read directly in source code, and several were confirmed against production behaviour.

### Q. Source

- Stage 2 codebase audit (exhaustive call-site enumeration, revenue_metrics.sql, get_platform_metrics())
- Stage 3 production queries (timezone validation, abandonment scope)
- Final Growth Verification §9, §12
- Backlog register P2-8, P2-9, P2-10, P2-12

<a id="flaw-14"></a>

---

# FLAW #14 — Weak customer feedback & behavioural intelligence

| Priority | Category | Severity | Evidence status | Root cause status | Confidence | Affected funnel stage |
|---|---|---|---|---|---|---|
| P2 | Measurement | Medium | CONFIRMED | CONFIRMED | High | Post-activation (voice of customer) |

> Six star ratings from 682 users, averaging 4.33 — and not one word of written feedback. There is no qualitative user data in the entire system.

### A. Executive summary

682 users have produced 6 pieces of feedback. All six are star ratings: 5, 4, 5, 5, 2, 5 — an average of 4.33.

None of them contains any written text. The system holds zero words of user opinion.

A 4.33 average from six responses is not actionable. It identifies no feature, no friction, and no reason anyone did not upgrade. It is a number that feels like information and is not.

The other behavioural channel, Microsoft Clarity, was inaccessible at every stage of this audit — so scroll depth, rage clicks, dead clicks, quick-backs, form abandonment and device split are all unknown too.

The result is that the most important question in this audit — why do users not pay — has been answered entirely by inference, plus a walkthrough of n = 1.

### B. What is the flaw?

- THE PROMPT IS BURIED BY DESIGN: it appears once, only on the home screen, only after 2 completed tests, only for non-admins, and is then suppressed for 3 months per user — enforced both client and server side. Every one of those conditions is deliberate, and together they produce 6 responses from 682 users.
- RATINGS WITHOUT REASONS: the instrument collects a score and nothing else. A 2-star rating exists and nobody knows why.
- NO EXIT OR OBJECTION CAPTURE: nothing asks a user who abandoned a checkout, never started a test, or never returned what stopped them. These are the three largest populations in the funnel and none of them is ever asked anything.
- NO BEHAVIOURAL DATA: Clarity is loaded as a GTM container tag rather than called from the codebase, so even its firing rules live outside the repository and could not be audited from source.

### C. Why does it matter?

- Every major conclusion in this audit is inferential. Six ratings and zero words is why.
- The competing hypotheses in Flaw #2 — plan confusion versus price resistance — fit the data equally well and could be separated by asking roughly ten people a single question. That capability does not exist.
- Feedback is also the cheapest available source of social proof, which Flaw #1 identifies as entirely absent. A real ratings volume would supply it honestly.

### D. Evidence

| Source | Evidence |
|---|---|
| **[PROD]** | 6 feedback records from 682 users — a 0.88% response rate. |
| **[PROD]** | Ratings: 5, 4, 5, 5, 2, 5. Distribution: four 5-star, one 4-star, one 2-star, no 3-star, no 1-star. |
| **[PROD]** | Average: (5 + 4 + 5 + 5 + 2 + 5) / 6 = 26 / 6 = 4.33. |
| **[PROD]** | Written feedback: 0. Not one response carries text. |
| **[CODE]** | FeedbackModal is the only entry point. It appears once, on the home screen only, after 2 completed tests, for non-admins only, then is suppressed for 3 months per user — enforced client AND server side. |
| **[CODE]** | A gating condition of "after 2 completed tests" excludes 396 of 682 users from ever seeing the prompt, since only 286 have completed even one test. |
| **[GAP]** | Microsoft Clarity: no access at any point across Stages 1, 2 or 3. No behavioural inference anywhere in this report is drawn from Clarity. |
| **[UX]** | The walkthrough is a substitute of n = 1, conducted by a non-aspirant. It is strong evidence that a friction exists and no evidence at all about how common it is. |

### E. How did we check?

- Production SQL (read-only): counted app_feedback rows, read the rating values, and checked the text column for content.
- Arithmetic, shown in full: 26 / 6 = 4.33.
- Source-code inspection: read FeedbackModal and its gating conditions on both the client and the server.
- Cross-reference: compared the "after 2 completed tests" gate against the production figure of 286 completers, establishing that 396 users can never have seen the prompt.
- Clarity access was attempted in every stage and was unavailable each time. It is recorded as a gap, not worked around.

### F. Numbers

| Metric | Calculation | Value |
|---|---|---|
| Feedback responses | `app_feedback` | **6** |
| Response rate | `6 / 682` | **0.88%** |
| Ratings received | `raw values` | **5, 4, 5, 5, 2, 5** |
| Average rating | `26 / 6` | **4.33 — n = 6, not statistically meaningful** |
| Rating distribution | `counts` | **5★ ×4 · 4★ ×1 · 3★ ×0 · 2★ ×1 · 1★ ×0** |
| Responses with written text | `0 / 6` | **0** |
| Users excluded by the 2-test gate | `682 − 286 completers` | **396 users can never have seen the prompt** |
| Clarity behavioural data | `no access in any stage` | **DATA NOT AVAILABLE** |

### G. Affected users

| Dimension | Value |
|---|---|
| Number affected | 676 of 682 users have never given feedback; 682 of 682 have never given written feedback |
| Percentage affected | 99.12% have given no feedback at all (676 / 682); 100% have given no written feedback |
| Funnel stage affected | Post-activation — and, critically, NOT the abandonment stages, which are never asked anything |
| Note | The populations whose opinions would be most valuable — the 337 who never started, the 270 who never returned, and the 11 who abandoned checkout — are structurally excluded from the current instrument. The 2-test gate alone excludes 396 users. |

### H. Root cause

**CONFIRMED root cause**

- The prompt's gating conditions are deliberate and are each confirmed in code: once only, home screen only, after 2 completed tests, non-admins only, 3-month suppression.
- The instrument collects a rating and no free text.
- No exit-intent, objection or abandonment survey exists anywhere.
- Clarity was inaccessible throughout, so no behavioural data supplements the ratings.

**HYPOTHESIS — unproven**

- That relaxing the gating would produce meaningfully more responses. Very likely, but untested — and volume alone is not the goal.
- That the 2-star rating reflects a specific, fixable problem. Unknowable. There is no text.

### I. User impact

- A user who has a problem has no easy way to say so.
- A user who abandons a checkout, or never comes back, is never asked why — so their objection is never resolved for them or for anyone after them.
- A user who loves the product is asked for a score and not for the reason, so their enthusiasm cannot become social proof for anyone else.

### J. Business impact

- The most consequential questions in this audit are answered by inference rather than by evidence.
- The plan-confusion versus price-resistance question in Flaw #2 stays unresolved for want of roughly ten conversations.
- The cheapest honest source of social proof — real ratings at real volume — does not exist, which feeds directly back into Flaw #1.
- Product decisions are being made without any qualitative signal whatsoever.

### K. Developer impact

- FeedbackModal and its gating conditions, on both the client and the server.
- The app_feedback schema, which needs to accommodate free-text responses alongside the rating.
- New prompt surfaces at the moments that matter: post-abandonment, post-inactivity, and post-cancellation.
- Clarity access is an operational task, not an engineering one — but the fact that Clarity is configured entirely in GTM means its firing rules are not reviewable from the repository at all.

### L. Recommended fix

- Redesign the instrument to collect reasons, not only scores: a rating, plus "What did you like?", plus "What should we improve?".
- Add a targeted question where the answer matters most: "Why didn't you upgrade?" — asked, appropriately, of users who reached pricing or abandoned a checkout.
- Relax the gating so the populations that matter can be reached. The 2-test gate alone excludes 396 users, including everyone who never activated.
- Add prompts at the abandonment moments: never started, never returned, checkout abandoned.
- Obtain Clarity access and audit its GTM firing rules, which are currently outside the repository and unreviewable.
- Use the resulting ratings volume as honest social proof on the pricing surfaces (Flaw #1), stated with its n.

### M. Implementation direction

- Volume is not the objective. Six responses with reasons would be worth more than six hundred bare scores.
- Relax the gating carefully — the current design is over-tuned, but the opposite failure (prompting constantly) would compound the popup-overload problem in Flaw #4. One prompt, at a moment the user has a reason to answer.
- Free text needs a moderation and reading path, or it will accumulate unread.
- Any social proof drawn from ratings must state the n honestly. "4.33 from 6 responses" is credible; "rated 4.33" implies a volume that does not exist.
- NO PRODUCTION CHANGE IS MADE BY THIS DASHBOARD. NO USER WAS OR WILL BE CONTACTED AS PART OF THIS AUDIT.

> **Scope boundary.** This report is a reporting and planning artefact. No production code, database, configuration or deployment has been modified. This section describes what a developer should change; it does not change it.

### N. Success metric

- PRIMARY: feedback responses carrying written text > 0. Currently 0. DEFINITIONAL target — the system currently contains zero words of user opinion.
- SECONDARY: at least one specific, named product problem is identified from user text rather than from inference.
- SUPPORTING: response rate, currently 0.88% (6 / 682). BASELINE FIRST — TARGET TO BE SET AFTER EXPERIMENT, and explicitly secondary to text capture.
- SUPPORTING: the abandonment populations (never started, never returned, checkout abandoned) are reachable by a prompt at all. Currently none of them is.
- SUPPORTING: Clarity access exists and its firing rules have been audited. DEFINITIONAL.

### O. Priority

**P2**

### P. Confidence

High — the counts, the ratings, the absence of text and the gating conditions were each observed directly.

### Q. Source

- Stage 3 production queries (app_feedback)
- Latest feedback verification (individual rating values)
- Stage 2 codebase audit (FeedbackModal gating, client and server)
- Final Growth Verification §8, §18
- Backlog register P2-11

---

## 11. Complete user journey

```
DISCOVERY
  ↓
LANDING
  ↓
SIGNUP
  ↓
ONBOARDING
  ↓
FIRST TEST
  ↓
RESULT
  ↓
REPEAT USE
  ↓
VALUE DISCOVERY
  ↓
PRICING
  ↓
CHECKOUT
  ↓
PAYMENT
  ↓
RETENTION
  ↓
REFERRAL
```

| Stage | Current state | Problem | Evidence | Metric | Fix | Leak | Flaws |
|---|---|---|---|---|---|---|---|
| DISCOVERY | Almost entirely non-organic. 5 sitemap URLs, zero third-party mentions, no app-store listing found, brand absent from the category's primary search. | No compounding discovery surface exists. Every acquired user arrives through a channel nobody can name. | [EXT] 5 URLs · 0 mentions · 7 rivals ranking · [CODE] no UTM column anywhere | DATA NOT AVAILABLE — no visitor store, no attribution | Per-product indexable landing pages; capture first-touch source at signup. | UNKNOWN | #10 #11 #12 |
| LANDING | One client-rendered page carrying 7 keyword intents. Identical title/meta on every route. No social proof. | Nothing is shareable as itself, and there is no proof-of-scale at the moment of first impression. | [EXT] identical <title> on 4 sampled routes · [CODE] zero testimonial/rating/user-count text in LandingPage.tsx | DATA NOT AVAILABLE — landing-page views not stored server-side | Per-route SSR/prerendered meta; state a real number (682 aspirants already practising). | UNKNOWN | #1 #10 #11 |
| SIGNUP | Works cleanly. Confirmed end-to-end by walkthrough and by the founder. | None. This stage is CLOSED — do not spend effort here. | [UX][FOUNDER] verified working · [PROD] 682 accounts created | 682 signups · 366 in the last 30 days · 50 in the last 7 | Only instrumentation: fire trackSignUp() on the Google path too. | NONE | #13 |
| ONBOARDING | Signup lands the user in an app with no orientation. Up to five modals compete on entry: onboarding tour, starter-test prompt, push primer, marathon free alert, update prompt. | The user does not know what to do next, and is asked to dismiss things before they have done anything. | [UX] "When entered the application, I don't know what is so necessary and what should I do now" · "felt like there is too many pop up when entering the app" · [CODE] 5 competing entry modals | DATA NOT AVAILABLE — no onboarding-completion event | One question (which exam?), then one action (start this test). Sequence or suppress every other modal. | MAJOR | #4 #5 |
| FIRST TEST | 3–4 taps from entry to a test. 345 of 682 users ever reach one. | THE LARGEST ABSOLUTE LEAK. 337 registered users never start a single test. | [PROD] 345 / 682 started · [UX] tap count measured during walkthrough | 50.6% start rate (345 / 682) · 49.4% never start | One-tap first test from the post-signup screen. | LARGEST ABSOLUTE | #4 #5 |
| RESULT | Works. 286 of the 345 starters complete (82.9%). | Not the bottleneck. Once a user starts, they usually finish. | [PROD] 286 / 345 | 82.9% completion among starters | None required. | MINOR | — |
| REPEAT USE | 16 of 682 users have ever had two active days. | THE LARGEST PROPORTIONAL LEAK. 270 of 286 completers never come back. | [PROD] 16 users with ≥2 activity dates · [CODE] streaks/XP/badges written only by submit_test | 5.6% of completers (16 / 286) · 2.3% of all users (16 / 682) — FLOOR | A reason to return tomorrow; reward partial effort, not only completion. | LARGEST PROPORTIONAL | #6 #7 |
| VALUE DISCOVERY | Revision and Insights — the screens that actually persuade — are reached late, by accident, and by almost nobody. | The persuasive moment sits downstream of the paywall instead of upstream of it. | [UX] "after checking on the Revision, Insights section, I feel good" — reached only after wandering in unprompted, and after two tests had already produced no desire to pay | DATA NOT AVAILABLE — no feature-usage event on Revision/Insights | Route the first session through the value moment before any upsell. | MAJOR | #1 #7 |
| PRICING | Five price points across four ledger plan keys, with genuinely non-obvious entitlement overlap. No public page. No social proof. | The user cannot tell the plans apart, and there is no view event, so nobody knows how many even get here. | [UX] "I can't differentiate what each plan does" · [CODE] Premium ⊇ Rank Booster, Vettri ⊉ Rank Booster, Mock Pack unlocks neither · [PROD] two plans' checkouts opened 12 seconds apart | DATA NOT AVAILABLE — pricing_viewed not instrumented on PricingCards | One-line differentiator per plan, a default recommendation, and a pricing_viewed event. | UNMEASURED | #1 #2 #11 #13 |
| CHECKOUT | Works. Verified to the final payment step on a real device. 11 people, 21 price-accepted attempts. | Not a defect — a demand problem. 20 of 21 attempts are abandoned and nothing follows up. | [UX] tested to the final payment step — works · [PROD] 20 created rows, oldest unresolved 79 days | 11 people · 21 attempts · 1 completed (9.1% of people, 4.8% of attempts) | Do not rebuild checkout. Build recovery. | MAJOR | #2 #9 |
| PAYMENT | Razorpay with HMAC verification, idempotency and server-side re-fetch. Zero failures in 83 days. | None technically. Commercially: 1 transaction, ₹899, founder-generated. | [PROD] 0 failed payments · [PROD] 4 paid records, 3 staff comps at ₹0 | ₹899 all-time · ₹0 externally generated | None to the rail. Everything upstream. | TERMINAL | #8 |
| RETENTION | No post-purchase loop exists to observe, because there is no paying cohort to retain. | Renewal and expiry are computed on read, never written as events — churn would be unmeasurable even if there were customers. | [CODE] no subscription_renewed / expired / cancelled event exists | DATA NOT AVAILABLE | Write plan lifecycle events now, so the first real cohort is measurable from day one. | UNMEASURED | #6 #13 |
| REFERRAL | A complete coupon and promoter system, including per-promoter revenue tracking, fully built and never used once. | There is no discoverable path to a coupon code inside the product. | [PROD] 0 redemptions in 83 days · [UX] "Where to get the coupon codes" | 0 redemptions · 0 coupon-attributed revenue | Surface the code entry, then recruit promoters. This is a recruitment problem, not a build. | UNUSED ASSET | #9 |

**Largest absolute leak:** signup → first test (337 users). **Largest proportional leak:** completion → return (94.4%). **Signup and checkout are both CONFIRMED WORKING and are closed** — do not spend engineering time on either.

---

## 12. Root cause tree

```
LOW REVENUE   [FACT]
├── Low conversion   [FACT]
│   ├── Weak value perception   [HYPOTHESIS]  → Flaw #1
│   ├── Pricing complexity   [OBSERVATION]  → Flaw #2
│   ├── Weak trust   [FACT]  → Flaw #1
│   ├── Expired offer   [FACT]  → Flaw #3
│   └── Price resistance at ₹1,699   [HYPOTHESIS]  → Flaw #2
│
├── Low activation   [FACT]
│   ├── Poor orientation   [OBSERVATION]  → Flaw #4
│   ├── Navigation friction   [OBSERVATION]  → Flaw #4
│   └── Popup overload   [OBSERVATION]  → Flaw #4
│
├── Low retention   [FACT]
│   ├── Weak habit loop   [OBSERVATION]  → Flaw #6
│   ├── Poor content surfacing   [OBSERVATION]  → Flaw #7
│   └── Partial effort not reinforced   [FACT]  → Flaw #6
│
└── Measurement gaps   [FACT]
    ├── Attribution   [FACT]  → Flaw #12
    ├── Event tracking   [FACT]  → Flaw #13
    ├── Feedback   [FACT]  → Flaw #14
    └── Incomplete funnel   [FACT]  → Flaw #13
```

| Branch | Node | Status | Detail | Flaw |
|---|---|---|---|---|
| **Low conversion** | Weak value perception | HYPOTHESIS | Strongest available explanation. Supported by walkthrough (n=1) and consistent with all three funnel losses — not independently verified. | #1 |
|  | Pricing complexity | OBSERVATION | Entitlement overlap is code-confirmed FACT. That it suppresses conversion is an observation supported by the 12-second cross-plan checkout. | #2 |
|  | Weak trust | FACT | Zero testimonials, ratings or user counts anywhere on the acquisition or pricing surfaces. | #1 |
|  | Expired offer | FACT | Offer expired 31 Aug 2026, still visible 5 Sep on the dedicated paid-ads landing page. | #3 |
|  | Price resistance at ₹1,699 | HYPOTHESIS | Competes with pricing complexity as the explanation for premium_annual's 0/12. The two fit the data equally well and are not separable without instrumentation or interviews. | #2 |
| **Low activation** | Poor orientation | OBSERVATION | "I don't know what is so necessary and what should I do now." Walkthrough n=1; the 337 outcome is FACT. | #4 |
|  | Navigation friction | OBSERVATION | 3–4 taps between entry and the only thing that delivers value. | #4 |
|  | Popup overload | OBSERVATION | Five competing entry modals confirmed in code; the felt experience is walkthrough evidence. | #4 |
| **Low retention** | Weak habit loop | OBSERVATION | Nothing in the product creates a reason to open it tomorrow. | #6 |
|  | Poor content surfacing | OBSERVATION | Current Affairs images not loading; Kural of the Day has no prompt; the free tier is under-communicated. | #7 |
|  | Partial effort not reinforced | FACT | Streaks, XP and badges are written exclusively by submit_test. Answer 20 questions and quit, earn nothing. (Registered P3-5; carried in because it is a retention mechanism, not code debt.) | #6 |
| **Measurement gaps** | Attribution | FACT | No utm_source / medium / campaign / referrer column exists anywhere in the schema. | #12 |
|  | Event tracking | FACT | Paid-format abandonment cannot be logged; Google signups are not counted as signups; pricing views are not instrumented. | #13 |
|  | Feedback | FACT | 6 ratings, 0 words, from 682 users. No qualitative signal exists in the system at all. | #14 |
|  | Incomplete funnel | FACT | No visitor store and no pricing-view event — the funnel has neither a top nor a valid checkout denominator. | #13 |

**FACT** — measured directly in production or read directly in source code. **OBSERVATION** — a real pattern; causality not established. **HYPOTHESIS** — plausible, evidence-linked, unproven.

---

## 13. Priority matrix

| # | Flaw | Priority | Impact (1–5) | Effort (1–5) | Category | Confidence | Placement note |
|---|---|---|---|---|---|---|---|
| 8 | Extremely weak monetization performance | P0 | 5 | inherited | Monetization | High | OUTCOME METRIC. No independent effort — it moves when #1, #2, #3 and #9 move. Plotted on impact only. |
| 2 | Confusing monetization & pricing structure | P0 | 5 | 2 | Monetization | High | Copy, a comparison surface and a default recommendation. No pricing change. |
| 3 | Broken / expired promotional experience | P0 | 3 | 1 | Trust | High | A constant and an expiry check. The cheapest item in the report. |
| 1 | Weak value proposition & conversion experience | P0 | 5 | 4 | Conversion | Medium | Highest expected impact; effort is real because it is a sequencing change across the first session and the upsell trigger. |
| 5 | Weak activation | P1 | 5 | 3 | Activation | High | Largest absolute loss in the funnel; the fix overlaps heavily with #4. |
| 9 | Unused conversion & recovery mechanisms | P1 | 4 | 2 | Monetization | High | Recovery tracking, a coupon entry surface, and a recruitment problem that needs no code. |
| 12 | No acquisition attribution | P1 | 4 | 2 | Measurement | High | Small build, permanently compounding value. Every day of delay is another day of unrecoverable history. |
| 4 | Poor first-time user experience | P1 | 4 | 3 | Activation | Medium | Modal arbitration plus a re-thought first screen. |
| 6 | Poor retention & habit formation | P1 | 5 | 4 | Retention | High | Largest proportional loss; requires a measurement change and a product change, carefully sequenced. |
| 7 | Weak content engagement & surfacing | P1 | 3 | 2 | Engagement | Medium | A bug fix and two surfacing changes. |
| 13 | Incomplete product analytics & event tracking | P1 | 4 | 3 | Measurement | High | Mostly trivial items plus one real piece of work (paid-format abandon beacon). Gates the evaluation of Phase 1. |
| 14 | Weak customer feedback & behavioural intelligence | P2 | 3 | 1 | Measurement | High | A form redesign and a gating change. |
| 11 | Poor public product & commercial visibility | P2 | 3 | 2 | Acquisition | Medium | Effort estimate is conditional on the unanswered app-store question. |
| 10 | Weak organic discoverability | P2 | 4 | 4 | Acquisition | High | High ceiling, long horizon, and explicitly not the current bottleneck. |

Impact and effort are 1–5 analyst estimates, **not measurements**.

### P0 — 4 flaws

- **#1 Weak value proposition & conversion experience** — The product asks for money before it has shown anyone why the money is worth spending — and the screens that would do the persuading sit downstream of the paywall.
- **#2 Confusing monetization & pricing structure** — Five price points with genuinely non-obvious entitlement overlap, and a user was caught using the payment window itself to work out what the plans cost.
- **#3 Broken / expired promotional experience** — The one page built specifically to convert paid traffic advertises an "offer valid till 31 Aug 2026" — and it was still live on 5 Sep.
- **#8 Extremely weak monetization performance** — 682 users, 83 days, ₹899 of all-time revenue — and every rupee of it internally generated. Externally-acquired revenue is ₹0.

### P1 — 7 flaws

- **#4 Poor first-time user experience** — A new user lands in the app with no orientation, up to five modals competing for attention, and 3–4 taps between them and the only thing that delivers value.
- **#5 Weak activation** — 337 of 682 registered users — 49.4% — have never started a single test. This is the largest absolute loss anywhere in the funnel.
- **#6 Poor retention & habit formation** — 270 of 286 users who completed a test — 94.4% — never came back on a second day. Only 16 of 682 users have ever had two active days.
- **#7 Weak content engagement & surfacing** — Content that exists and would bring users back is broken, hidden or unexplained — including a broken image on the daily-return hook itself.
- **#9 Unused conversion & recovery mechanisms** — 11 people accepted a price and did not pay, the oldest 79 days ago — and nothing follows up. A complete coupon and promoter system sits fully built and has never been used once.
- **#12 No acquisition attribution** — Signups grew from 19 to 226 to 396 a month — and there is no column anywhere in the schema that could say where any of them came from.
- **#13 Incomplete product analytics & event tracking** — The funnel has no top, no pricing-view denominator, no abandonment signal from any paid format, and a signup event that misses everyone who uses Google.

### P2 — 3 flaws

- **#10 Weak organic discoverability** — Five URLs in the sitemap, zero third-party mentions anywhere, and absent from the category's primary search — a genuine weakness, but NOT the current bottleneck.
- **#11 Poor public product & commercial visibility** — The price cannot be seen without signing up, and no app-store listing was found — though absence of a search result is not proof of absence.
- **#14 Weak customer feedback & behavioural intelligence** — Six star ratings from 682 users, averaging 4.33 — and not one word of written feedback. There is no qualitative user data in the entire system.

**P3 technical debt is out of scope** and is listed in section 10 for completeness only.

---

## 14. What to fix first

> **Sequencing caveat.** Within-phase ordering is by effort and evidence confidence, not by proven causal sequence. The evidence supports the PHASE ordering (conversion is the confirmed zero; activation is the largest absolute loss; acquisition is already working). It does not support a claim that item 4 must ship before item 5. Do not treat the numbers as a proven critical path.

### PHASE 1 — CONVERSION FOUNDATION

*Conversion is the stage with a confirmed zero. Acquisition is confirmed growing, so every day this stage stays broken converts more traffic into nothing.*

1. **Retire the expired promotional offer and make expiry automatic** — Flaw #3 (P0)
   Certain evidence, trivial effort, actively working against live ad traffic right now.
2. **Make the plans distinguishable in five seconds** — Flaw #2 (P0)
   Code-confirmed entitlement overlap plus direct production evidence of comparison-shopping at the payment window.
3. **Deliver the value moment before the first upsell** — Flaw #1 (P0)
   Highest expected impact, lowest certainty about mechanism. Ships with instrumentation so it can be judged.

### PHASE 2 — ACTIVATION

*337 users is the largest absolute loss in the funnel, and it sits immediately after a signup step that is confirmed working.*

4. **Rebuild the first-run experience: one question, one action** — Flaw #4 (P1)
   Sequence the five competing entry modals; cut the tap count to the first test.
5. **Instrument and move signup → first-test-start** — Flaw #5 (P1)
   The metric this phase is judged on. Baseline 50.6%.
6. **Fix Current Affairs images and surface the free tier and Kural of the Day** — Flaw #7 (P1)
   A content defect sits directly on the daily-return hook.

### PHASE 3 — RETENTION

*94.4% of completers never return. Fixing conversion without fixing this converts a growing base into a growing pile of one-session users.*

7. **Build a return loop, and reward partial effort** — Flaw #6 (P1)
   Currently the habit system reinforces only completed tests.
8. **Turn on checkout recovery and make coupon codes discoverable** — Flaw #9 (P1)
   11 warm, price-accepted prospects and an entire promoter system sitting unused.

### PHASE 4 — MEASUREMENT

*SEQUENCING CAVEAT: this phase is numbered fourth but items 9 and 10 arguably belong at position zero. Without a pricing-view event you cannot measure whether Phase 1 worked, and without attribution you cannot tell which channel produced any improvement. Treat the numbering as a dependency graph, not a queue.*

9. **Close the event-tracking gaps** — Flaw #13 (P1)
   Pricing views, paid-format abandonment, Google signups, plan lifecycle events, premiumActive across all five plans.
10. **Capture acquisition attribution at signup** — Flaw #12 (P1)
   Persist first-touch and last-touch source through signup → payment.
11. **Redesign the feedback instrument to collect reasons, not only scores** — Flaw #14 (P2)
   6 ratings and 0 words is not a satisfaction measurement.

### PHASE 5 — ACQUISITION SCALE

*Deliberately last. Acquisition is the one part of this business that is already working. Scaling traffic into a funnel with 0.00% external conversion converts spend into nothing.*

12. **Build the organic discovery surface** — Flaw #10 (P2)
   Per-product indexable landing pages, per-route metadata, topic content.
13. **Make the product and its price publicly visible** — Flaw #11 (P2)
   A rankable, forwardable pricing page; confirm and complete app-store presence.

---

## 15. Before → after KPI model

> **No target number has been invented.** Targets are one of two kinds. **DEFINITIONAL** targets have an obviously correct value — zero expired offers, all five plans counted, all four paid formats logging abandonment, 100% of new signups carrying a source. **EXPERIMENT** targets are marked `BASELINE FIRST — TARGET TO BE SET AFTER EXPERIMENT`, because choosing a number before the baseline exists would be fabrication.

| Metric | Current | Calculation | Target | Type | Measurement period | Success criteria | Flaw |
|---|---|---|---|---|---|---|---|
| Externally-acquired paying customers | 0 | `0 / 682` | > 0 | DEFINITIONAL | Continuous | One person who was not staff, not the founder, and not a founder-side referral pays real money. This is the single success criterion for the entire Phase 1 effort. | #8 |
| Expired offers visible in production | 1 (Rank Booster, expired 31 Aug 2026) | `manual + automated expiry check` | 0 | DEFINITIONAL | Continuous | No offer whose deadline has passed is rendered anywhere. Enforced by an expiry check, not by a person remembering. | #3 |
| Signup → first test start | 50.6% | `345 / 682` | BASELINE FIRST — TARGET TO BE SET AFTER EXPERIMENT | EXPERIMENT | Weekly cohort, 30 days post-change | Measured on signup cohorts AFTER the change ships, never against the lifetime blended figure — the base is growing too fast for a blended number to move visibly. | #5 |
| Signup → first test completion | 41.9% | `286 / 682` | BASELINE FIRST — TARGET TO BE SET AFTER EXPERIMENT | EXPERIMENT | Weekly cohort, 30 days post-change | Same cohorting rule. | #5 |
| D1 / D3 / D7 / D14 / D30 retention | DATA NOT AVAILABLE | `requires cohorted daily_activity by signup week` | Instrumented and reported weekly | DEFINITIONAL | From first report | The target is the existence of the measurement. No retention percentage target can be responsibly set before the curve has been seen once. | #6 |
| Return rate (2+ active days, completers) | 5.6% | `16 / 286` | BASELINE FIRST — TARGET TO BE SET AFTER EXPERIMENT | EXPERIMENT | 30-day cohort | Must be re-baselined against a broadened "active" definition first — the current figure is a floor, so any improvement would be partly a measurement artefact. | #6 |
| Pricing-view → checkout-start rate | UNMEASURABLE — no pricing_viewed event | `n/a` | Measurable | DEFINITIONAL | From instrumentation | The checkout stage of the funnel acquires a denominator. Until then, no conversion claim about the pricing screen can be evaluated. | #13 |
| Paid formats logging abandonment | 0 of 4 | `Mock, Vettri, Rank Booster, Test Series` | 4 of 4 | DEFINITIONAL | From instrumentation | A quit inside paid content produces a row. Precondition for ever answering "do paying customers finish what they bought". | #13 |
| premiumActive plan coverage | 1 of 5 plans | `revenue_metrics.sql filters plan = 'premium_annual'` | 5 of 5 | DEFINITIONAL | Immediate | The founder's headline paid-user figure counts every paying customer. | #13 |
| Signups carrying an acquisition source | 0% | `0 / 682 — no column exists` | 100% of NEW signups | DEFINITIONAL | From instrumentation | Every new profile row carries first-touch source, medium, campaign, referrer and landing page, and that source survives through to the payments row. Historical attribution is unrecoverable and is not part of this target. | #12 |
| Coupon redemptions | 0 | `0 in 83 days` | BASELINE FIRST — TARGET TO BE SET AFTER EXPERIMENT | EXPERIMENT | 30 days after the code path is discoverable | Split the metric: (a) can users find where to enter a code, (b) do promoters exist to hand codes out. Today both are zero and they are being measured as one number. | #9 |
| Abandoned-checkout recovery rate | UNMEASURABLE — no recovery mechanism exists | `n/a` | Measurable, then BASELINE FIRST | EXPERIMENT | 30 days after recovery ships | A recovered payment is attributable to the recovery mechanism. NOTE: recovery is a product mechanism. No user is to be contacted as part of this audit. | #9 |
| Feedback response rate | 0.88% | `6 / 682` | BASELINE FIRST — TARGET TO BE SET AFTER EXPERIMENT | EXPERIMENT | 30 days after the prompt is redesigned | Response rate alone is not the goal — see the next row. | #14 |
| Feedback responses carrying written text | 0 | `0 / 6` | > 0 | DEFINITIONAL | 30 days after redesign | At least one free-text answer explaining a rating. Today the system contains zero words of user opinion. | #14 |
| Indexable product pages | 5 sitemap URLs (home + 4 legal) | `sitemap.xml` | BASELINE FIRST — TARGET TO BE SET AFTER EXPERIMENT | EXPERIMENT | 90 days after publication | Judge on organic sessions and ranked queries, not on page count. Page count is an output, not an outcome. | #10 |

---

## 16. 30 / 60 / 90 day plan

### Days 1–30 — establish value and make the funnel measurable

- Ship Flaw #3 (expired offer) — trivial, certain, and live on the ads landing page right now.
- Ship Flaw #2 (plan clarity) — one-line differentiators, a comparison matrix generated from the entitlement source, and a default recommendation. No price changes.
- Ship Flaw #1 (value before paywall) — route the first session through Revision/Insights and gate the upsell on a real signal.
- Ship pricing_viewed from PricingCards (part of Flaw #13). Without it none of the above can be evaluated.
- Run the four outstanding read-only queries: cohorted retention, engagement distribution, the abandoner crossover, and the role breakdown.
- Get the two pending founder answers: app-store publication status, and identifiers for the internal customer and founder-side referral.
- DECISION FOR THE FOUNDER, NOT AN AUDIT ACTION: whether to ask the 11 abandoned-checkout users what stopped them. It is the fastest available route to separating plan confusion from price resistance. No user has been contacted by this audit.

### Days 31–60 — activation and return

- Ship Flaw #4 (first-run experience) and Flaw #5 (activation measurement), which overlap heavily.
- Ship Flaw #7 (Current Affairs images, free-tier communication, Kural surfacing).
- Ship Flaw #6 measurement first: broaden the active definition, re-baseline, and report both definitions in parallel.
- Ship Flaw #12 (attribution capture) so that any future acquisition effort is measurable. Every day of delay is another day of permanently unrecoverable history.
- Ship the remaining Flaw #13 items: Google signup tracking, paid-format abandon beacon, premiumActive across all five plans.
- Ship Flaw #9 recovery TRACKING (not yet recovery action) and make coupon entry discoverable.

### Days 61–90 — only if external conversion has moved off zero

- GATE: if externally-acquired paying customers is still 0, do not proceed to acquisition scale. Return to Phase 1 with the instrumentation that now exists and diagnose properly.
- Ship Flaw #6 product changes: the return loop and partial-effort reinforcement.
- Ship Flaw #14 (feedback redesign) and obtain Clarity access.
- Ship Flaw #11 (public pricing page) and, conditional on the founder's answer, app-store work.
- Begin Flaw #10 (SEO landing pages) — the longest-horizon item, deliberately last.
- Re-run this entire verification against a real paying cohort, and finally test the activation-threshold hypothesis that has been untestable throughout.

### What NOT to do yet

- DO NOT SPEND ON ADS. There is no underperforming channel to fix — there is no channel that has ever produced a paying customer. Paid traffic into a funnel with 0.00% external conversion converts spend into nothing.
- DO NOT CHANGE PRICES. Zero external conversions means there is no evidence that price is the binding constraint. Cutting prices before establishing value forfeits margin without addressing the cause.
- DO NOT RESTRUCTURE THE PLANS — beyond making them describable. Redesigning a pricing architecture on 21 attempts and 1 sale would be fitting to noise.
- DO NOT PRIORITISE SEO YET. It is a genuine weakness and it is not the bottleneck. Acquisition is already growing without it.
- DO NOT REBUILD CHECKOUT. Verified working.
- DO NOT TOUCH FRONTEND PERFORMANCE. Measured, fine.
- DO NOT CITE THE ₹899 AS TRACTION. It was founder-generated. External revenue is ₹0.

---

## 17. Data sources & methodology

### Production safety

- No production code was modified.
- No production database was modified.
- No INSERT, UPDATE, DELETE, UPSERT, MERGE, ALTER, CREATE, DROP or TRUNCATE was executed.
- No tables, views or functions were created in production.
- No migrations were run.
- No RLS policy was changed.
- No Supabase, Razorpay, analytics or Clarity configuration was changed.
- No user, payment or coupon record was touched.
- No message, email or WhatsApp was sent to any user — including the 11 abandoned-checkout prospects.
- Nothing was deployed.
- Every calculation in this dashboard was performed locally from read-only query output.
- Where a figure was unavailable it is shown as DATA NOT AVAILABLE. No metric was estimated, interpolated or invented.

### Evidence tags

| Tag | Source | What it means |
|---|---|---|
| `[PROD]` | Production database | Measured directly in the production Postgres database through read-only SELECT statements. No write of any kind was issued. |
| `[CODE]` | Source code / schema | Read from a read-only clone of the application repository, including the src/, server/ and supabase/ trees. |
| `[UX]` | First-time-user walkthrough | A single guided session on a real device by a non-aspirant tester. n = 1. Strong for finding friction, weak for measuring how common it is. |
| `[EXT]` | External / public audit | Public HTTP, sitemap, robots.txt, page source, search results, app-store search and social profiles. Nothing required a login. |
| `[FOUNDER]` | Founder-confirmed | Stated directly by the founder — used for facts only they can supply, such as which accounts are staff. |
| `[DERIVED]` | Derived arithmetic | Computed in this report from tagged figures above. The calculation is always shown alongside the result. |
| `[GAP]` | Data not available | The figure does not exist, or exists somewhere this audit could not reach. Never estimated, never filled in. |

### Sources, coverage and limits

| Source | Covers | Access | Limits |
|---|---|---|---|
| Production database (read-only) | All baseline counts, funnel stages, payments ledger, plan-wise demand, retention counts, feedback ratings, acquisition trend | Read-only SELECT, snapshot 5 Sep 2026 19:01 IST + a later acquisition query | No writes were issued at any point. Some queries (cohort retention, engagement distribution, abandoner crossover) have not been run. |
| Codebase (read-only clone) | Entitlement rules, pricing constants, event instrumentation, schema search, metric definitions, habit-loop writers, feedback-prompt gating | Full src/, server/, supabase/ trees | The clone reflects a point in time; production may have moved since. |
| First-time-user walkthrough | Orientation, tap counts, popup load, plan comprehension, value moment, coupon discoverability, Current Affairs images, checkout verification | One guided session, real device | n = 1, conducted by a non-aspirant. Exam-category comprehension findings should be explicitly discounted. Strong for existence, useless for prevalence. |
| External / public audit | Sitemap, per-route metadata, search visibility, competitor set, app-store search, social reach, bundle size, robots.txt, structured data | Public HTTP only | A search that does not find a listing is not proof the listing does not exist. |
| Founder-provided context | Which paid accounts are staff; that the single revenue-bearing customer was internally generated | Direct statement | Identifiers for the internal customer and the founder-side referral are still pending. |
| Microsoft Clarity | NOTHING — no access at any point across Stages 1, 2 or 3 | None | Clarity is loaded as a GTM container tag rather than called from the codebase, so even its firing rules live outside the repository. No behavioural inference anywhere in this report is drawn from Clarity. |

### Metric-by-metric source

| Metric | Value | Evidence | Query / source |
|---|---|---|---|
| Registered users | 682 | PROD | `profiles — count(*)` |
| Started ≥1 test | 345 | PROD | `test_sessions — distinct user_id` |
| Completed ≥1 test | 286 | PROD | `test_sessions status='completed' — distinct user_id` |
| Returned on a second day | 16 | PROD | `daily_activity — users with ≥2 distinct activity_date` |
| Checkout users | 11 | PROD | `payments — distinct user_id on created rows` |
| Checkout attempts | 20 | PROD | `payments status='created', never completed` |
| Genuine paying customers | 1 | PROD | `payments — non-zero amount, status=paid` |
| All-time revenue | ₹899 | PROD | `payments — sum(amount) = 89,900 paise` |
| Failed payments | 0 | PROD | `payments status='failed'` |
| Coupon redemptions | 0 | PROD | `payments — used_coupon across every plan` |
| Feedback responses | 6 | PROD | `app_feedback — count(*)` |
| Active today | 2 | PROD | Identical under UTC and IST — the Stage 2 timezone bug is real in code but is not currently distorting this figure. |
| Active last 7 days | 17 | PROD | Identical under UTC and IST. 2.5% of 682. |
| Active last 30 days | 135 | PROD | 19.8% of 682. The 30d→7d ratio is 12.6%. |
| Tests completed | 462 | PROD | Terminal sessions, any score, any category. |
| Tests abandoned | 161 | PROD | Free practice engine ONLY. Paid formats structurally cannot produce this status. |
| Tests in progress | 0 | PROD | Dead schema — sessions are written already-final. |
| Questions in bank | 49,916 | PROD | Unfiltered by the questions.active soft-hide flag the student sampler actually uses — overstates the live pool. |
| Average rating | 4.33 | PROD | n = 6. Not statistically meaningful. |
| Payment records = paid | 4 | PROD | 3 staff comps at ₹0 + 1 founder-generated ₹899. |

---

## 18. Data quality

### WHAT WE KNOW

- Exactly how many people registered, started a test, completed a test, returned, reached checkout and paid — all from direct read-only SELECTs against production.
- That acquisition grew every full month measured: 226 in July, 396 in August, and 366 in the last 30 days.
- That zero of those 366 recent signups paid anything.
- That the payment rail works: 0 failures in 83 days, HMAC verification, idempotency and a server-side re-fetch before crediting.
- That signup works: verified by walkthrough and by the founder.
- That checkout works: tested to the final payment step on a real device.
- That the five-plan entitlement overlap is real, because it was read directly in the pricing and entitlement code.
- That the promotional offer on the paid-ads landing page expired on 31 Aug 2026 and was still visible on 5 Sep.
- That no acquisition-source column exists anywhere in the schema.
- That three of the four paid records are staff comps, and the fourth was founder-generated.

### WHAT WE DON'T KNOW

- How many visitors the site gets, or ever got. There is no server-side pageview store.
- Where any user came from. No UTM, medium, campaign or referrer data exists for any historical period — this is unrecoverable, not merely unqueried.
- How many of the 682 ever saw a pricing screen. pricing_viewed is not instrumented on PricingCards.
- What retention actually looks like by cohort. D1/D3/D7/D14/D30 have not been run.
- Whether the 11 checkout users overlap with the 16 returners.
- Whether any of the 11 abandoners later converted.
- Why users abandon paid tests — paid formats cannot log abandonment at all.
- What users think. Six star ratings and zero words.
- Anything from Microsoft Clarity — no access at any point across all three stages.
- Whether the app is actually published on the Play Store or App Store.
- How many of the 682 accounts are team accounts (beyond the 3 confirmed comps).
- The exact run date of the acquisition-trend query, which is why the monthly totals sum to 686 against a 682 baseline.

### WHAT IS CONFIRMED

1. 0 externally-acquired paying customers in 83 days.
2. 337 of 682 registered users (49.4%) never start a test.
3. 270 of 286 test-completers (94.4%) never return on a second day.
4. 20 abandoned checkouts from 11 people; the oldest unresolved for 79 days; no recovery mechanism of any kind exists.
5. 0 coupon redemptions in 83 days, against a fully-built promoter system.
6. No acquisition attribution exists anywhere in the schema.
7. An expired offer is live on the dedicated paid-ads landing page.
8. Paid test formats cannot log abandonment.
9. premium_annual draws 57% of all purchase attempts and has converted zero times.
10. Acquisition grew month over month: 19 (17 days) → 226 → 396.
11. Streaks, XP and badges are written only by submit_test — partial effort earns nothing.
12. Zero social proof exists on the landing or pricing surfaces.

### WHAT IS A HYPOTHESIS

1. That value is not established before the paywall is shown. This is the STRONGEST available explanation for non-payment, and it is still a hypothesis: it rests on a walkthrough of n = 1 plus consistency with all three funnel losses. It has not been independently verified.
2. That plan indistinguishability suppresses conversion. Supported by the walkthrough and by one user opening two plans' checkouts 12 seconds apart. Not proven.
3. That price resistance at ₹1,699 explains premium_annual's 0-for-12. Competes directly with the hypothesis above; the two fit the data equally well and cannot be separated without instrumentation or user interviews.
4. That popup overload and tap count materially suppress activation. The 337 outcome is fact; attributing it to these specific causes is not.
5. That the free tier being under-communicated costs conversion. Walkthrough observation only.

### WHAT WAS DISPROVED

| Claim | Disproved by |
|---|---|
| ~~Checkout is broken~~ | Walkthrough tested it to the final payment step on a real device. It works. This was the leading hypothesis going into Stage 3 and it failed. |
| ~~Payment infrastructure is failing~~ | 0 failed payments in 83 days. |
| ~~Signup friction causes the drop-off~~ | Signup verified working by walkthrough and founder. The 337 loss occurs AFTER a clean registration — which is exactly what makes it an orientation problem. |
| ~~Frontend performance is a cause~~ | ~221 KB gzipped JS, hashed and immutably cached. Measured directly. |
| ~~Consent gating suppresses analytics~~ | The banner was removed by product decision; trackers now fire for ~100% of web sessions. Stage 1's concern no longer applies. |
| ~~The free tier is too generous~~ | The walkthrough completed two full tests and still felt no urge to upgrade. That is absent value perception, not excess generosity. |
| ~~The Active-Today timezone bug is urgent~~ | Production returned identical values under UTC and IST (2 and 17). Real in code, currently harmless. Downgraded from P0 to P3. |
| ~~Paying users are 8× more engaged than non-payers~~ | RETRACTED. That comparison measured staff accounts building and testing the product. It is an artifact of internal usage, not buyer behaviour, and must not be cited. |

### DATA GAPS

| Gap | Why | Recoverable? |
|---|---|---|
| Visitor / top-of-funnel volume | No server-side pageview store | Only prospectively |
| Historical channel attribution | No UTM/referrer column has ever existed | NO — permanently unrecoverable |
| Pricing-page view counts | Not instrumented on PricingCards | Only prospectively |
| Paid-format abandonment | record_abandoned_test is wired to the free engine only | Only prospectively |
| D1/D3/D7/D14/D30 cohort retention | Query not yet run | YES — data exists, run the query |
| Engagement distribution (is there an engaged core?) | Query not yet run | YES |
| Whether any of the 11 abandoners later converted | Query not yet run | YES |
| Overlap between the 11 checkout users and the 16 returners | Query not yet run | YES |
| Team/staff account count within the 682 | Role-breakdown query not yet run | YES |
| Weekly signup time series | Only monthly totals supplied | YES |
| Qualitative user opinion | 6 ratings, 0 written responses | Only prospectively, after the feedback instrument is redesigned |
| Clarity behavioural data (scroll depth, rage clicks, quick-backs, device split) | No access in any stage | YES — needs a login |
| App-store publication status | Awaiting founder answer | YES — one answer |
| Identifiers for the internal customer and founder-side referral | Awaiting founder | YES |
| Exact run date of the acquisition-trend query | Not recorded; monthly totals sum to 686 vs a 682 baseline | YES — re-run with a timestamp |

---

## 19. The real business problem

Acquisition is growing. Activation is weak. Retention is extremely weak. Conversion is extremely weak. Value communication is weak. Pricing clarity is weak. Measurement is incomplete.

In 83 days and 682 users, not one person discovered this product independently, valued it, and paid for it. That single sentence is the whole audit.

It is not a technical failure. Every technical explanation was tested and eliminated. It is a sequencing failure: the product asks for money before it has shown anyone why the money is worth spending, and then does not give them a reason to come back and reconsider.

### WHY ARE USERS NOT PAYING?

- FACT: they are not. 0 externally-acquired paying customers in 83 days; 0 from 366 signups in the last 30 days; 11 people accepted a price and 1 paid, and that one was internal.
- CONFIRMED CONTRIBUTORS: the plans are genuinely indistinguishable (entitlement overlap read directly in code); there is no social proof anywhere on the pricing surface; an expired offer sits on the paid-ads landing page.
- HYPOTHESIS, NOT FACT: that weak value communication is the binding constraint. It is the strongest available explanation, it is consistent with all three funnel losses, and it rests on a walkthrough of n = 1. It has not been independently verified.
- EXPLICITLY UNRESOLVED: whether premium_annual's 0-for-12 is caused by plan confusion or by price resistance at ₹1,699. The two fit the data equally well. Roughly ten user conversations would settle it, and the instrument to have them does not exist.

### WHY ARE USERS NOT RETURNING?

- FACT: 270 of 286 test-completers (94.4%) never came back on a second day. Only 16 of 682 users have ever had two active days.
- CONFIRMED CONTRIBUTOR: the habit loop reinforces only completion — streaks, XP and badges are written exclusively by submit_test, so a user who answers 20 questions and quits earns nothing.
- CONFIRMED CONTRIBUTOR: the daily-return hook is degraded — Current Affairs images do not load, and Kural of the Day has no prompt.
- CAVEAT THAT MUST TRAVEL WITH THE NUMBER: "active" is defined narrowly, so these are floors. And 53.7% of the base registered in the last 30 days, so some of the non-return is cohort immaturity rather than churn. Cohorted retention would separate them and it has not been run.

### WHY ARE USERS NOT ACTIVATING?

- FACT: 337 of 682 registered users (49.4%) never start a single test.
- CONFIRMED: it is not signup. Registration was verified working by both the walkthrough and the founder, so this loss occurs after a clean registration.
- OBSERVED: a new user arrives with no orientation, meets up to five competing modals, and is 3–4 taps from the only thing that delivers value.
- DATA GAP: no onboarding instrumentation exists, so the exact point of departure inside that first session cannot be located.

### WHERE IS THE BIGGEST LEAK?

- BY ABSOLUTE COUNT: signup → first test. 337 users, 49.4% of everything acquired.
- BY PROPORTION: test completion → return. 94.4% of completers.
- BY BUSINESS CONSEQUENCE: conversion. It is the only stage sitting at a confirmed absolute zero, and it is the stage the other two ultimately feed.
- These are three different questions with three different answers, and the fix sequence in this report follows business consequence first — because acquisition is growing, which means the cost of leaving conversion broken compounds daily.

### WHAT SHOULD DEVELOPERS FIX FIRST?

- 1. The expired offer. Certain evidence, trivial effort, sitting on the paid-ads landing page right now.
- 2. Plan clarity. Code-confirmed entitlement overlap, plus production evidence of a user comparison-shopping at the payment window 12 seconds apart.
- 3. Value before paywall. Route the first session through Revision and Insights before any upsell.
- AND, ARGUABLY BEFORE ALL THREE: the pricing_viewed event. Without it, the checkout funnel stage has no denominator and none of the work above can be evaluated. It is listed in Phase 4 for narrative reasons; treat the phases as a dependency graph, not a queue.

### WHAT SHOULD MARKETING NOT DO YET?

- DO NOT SPEND ON ADS. There is no underperforming channel to fix — there is no channel that has ever produced a paying customer. Paid traffic into a funnel with 0.00% external conversion converts spend into nothing.
- DO NOT CHANGE PRICES. Zero external conversions means there is no evidence that price is the binding constraint. Cutting prices before establishing value forfeits margin without addressing the cause.
- DO NOT RESTRUCTURE THE PLANS — beyond making them describable. Redesigning a pricing architecture on 21 attempts and 1 sale would be fitting to noise.
- DO NOT PRIORITISE SEO YET. It is a genuine weakness and it is not the bottleneck. Acquisition is already growing without it.
- DO NOT REBUILD CHECKOUT. Verified working.
- DO NOT TOUCH FRONTEND PERFORMANCE. Measured, fine.
- DO NOT CITE THE ₹899 AS TRACTION. It was founder-generated. External revenue is ₹0.

---

## Final statement

**REPORT/DASHBOARD GENERATED USING READ-ONLY DATA. NO PRODUCTION CODE, DATABASE, CONFIGURATION OR DEPLOYMENT WAS MODIFIED.**

*Internal analysis artefact for the TNPSC Mentors development team. Not deployed and not for public distribution.*
