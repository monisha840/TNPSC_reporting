# TNPSC Mentors — Final Growth Verification

> **THIS REPORT WAS GENERATED USING READ-ONLY DATA ACCESS.
> NO PRODUCTION DATA, CODE, CONFIGURATION OR DEPLOYMENT WAS MODIFIED.**

**Date:** 5 September 2026
**Sources:** Stage 1 external audit · Stage 2 codebase/schema audit · Stage 3 production database (read-only SELECT) · First-time-user walkthrough · Founder-provided context
**Prior documents:** `TNPSC_Mentors_Stage_1_Audit.md`, `TNPSC_Mentors_Stage_2_Growth_Diagnosis.md`, `TNPSC_Mentors_BACKLOG_REGISTER.md`

**Completion status:** 13 of 18 sections are complete. Sections 3 (Acquisition Trend), 4 (Paying vs Non-paying), 7 (Retention & Cohorts) await queries not yet run; Section 8 (Clarity) is inaccessible. Each is scoped precisely below rather than filled with estimates.

---

## 1. Executive Summary

**In 83 days of operation, TNPSC Mentors has acquired 682 users and converted zero of them into externally-generated paying customers.**

Four payment records exist. Three are internal staff accounts at ₹0 (founder-confirmed). The fourth — the only record carrying money, ₹899 — was founder-generated, not acquired. **Externally-generated revenue is therefore ₹0, and the ₹899 cannot be treated as evidence of product-market fit.**

The failure is not where the previous two stages assumed. Checkout was tested end-to-end on a real device and works. Payment infrastructure has recorded zero failures. Signup works cleanly. Frontend performance is fine. Every technical explanation that was available has been tested and disproved.

What remains is a **value-perception failure that compounds at three successive stages**:

| Stage | Loss | Evidence |
|---|---|---|
| Signup → first test | **337 users (49.4%)** never start one | Walkthrough: *"I don't know what is so necessary and what should I do now"* |
| Completion → return | **270 of 286 (94.4%)** never come back | Only 16 of 682 users have ever had 2+ active days |
| Checkout → payment | **11 people tried, 1 bought** | Walkthrough: *"I can't feel any urge to pay and get premium"* |

The single most diagnostic observation in the entire audit came from the walkthrough: after two completed tests, the tester felt no desire to pay — but after reaching **Revision and Insights**, said *"I feel good."* The product does contain a persuasive value moment. It arrives late, by accident, and after the paywall has already been shown repeatedly.

**What to fix first:** get users to that value moment before asking for money, and make the five plans distinguishable in five seconds. Everything else is secondary until external conversion moves off zero.

---

## 2. Current Production Baseline

All figures from a single read-only query run 2026-09-05 19:01 IST.

| Metric | Value |
|---|---|
| Platform age | **83 days** (2026-06-14 → 2026-09-05) |
| Total registered users | 682 |
| Active today | 2 |
| Active last 7 days | 17 |
| Active last 30 days | 135 |
| Tests completed | 462 |
| Tests abandoned | 161 |
| Tests in progress | 0 |
| Total questions in bank | 49,916 |
| Feedback records | 6 |
| Average rating | 4.33 |
| Payment records marked "paid" | 4 |
| **Real paying customers** | **1** (founder-generated) |
| **All-time revenue** | **₹899** (89,900 paise) |
| Failed payments | 0 |
| Coupon redemptions | 0 |

**Derived:** 8.2 signups/day · 5.6 completed tests/day · ₹10.83/day revenue · ARPU across all users ₹1.32 · 0.91 terminal test sessions per registered user.

**Timezone validation:** `active_today` returned **2 under both UTC and IST**; `active_7d` returned **17 under both**. The UTC/IST mismatch identified in Stage 2 is real in code but is **not currently distorting any reported figure**. It was over-ranked as P0 in Stage 2 and is downgraded to P3 here.

---

## 3. Acquisition Trend

**STATUS: PENDING — query not yet run.**

This is the single most important unanswered question in the audit. 682 users over 83 days averages 8.2/day, but the average conceals the trajectory, and the strategic recommendation inverts depending on the answer:

- **If growing** — acquisition works; the problem is purely conversion and retention, and effort belongs entirely on P0-1 through P0-4.
- **If declining** — there are two simultaneous problems, and discoverability (P2-1) moves up the priority list.
- **If flat** — steady-state with no compounding; content/SEO work becomes necessary rather than optional.

**HISTORICAL SOURCE ATTRIBUTION UNAVAILABLE.** No `utm_source`, `utm_medium`, `utm_campaign`, or referrer column exists anywhere in the schema (verified by exhaustive search of the production schema in Stage 2). Channel-level acquisition performance — Instagram, YouTube, Telegram, organic, direct, paid — **cannot be reconstructed for any historical period.** No channel numbers are estimated in this report.

Required: `Q10` (signups by month and by week).

---

## 4. Paying vs Non-paying Behaviour

**STATUS: STRUCTURALLY IMPOSSIBLE AT CURRENT SAMPLE SIZE.**

This analysis cannot be produced, and the reason matters more than the absence:

- Total accounts with a `paid` record: **4**
- Of those, internal staff comps at ₹0: **3** (founder-confirmed)
- Of those, founder-generated: **1** (the ₹899 record)
- **Externally-acquired paying users available for comparison: 0**

A behavioural comparison requires a paying population to compare against. There isn't one.

**A prior finding is retracted here.** An earlier comparison showed paying users with ~8× the engagement of non-payers (7.25 vs 0.88 tests started; 2.00 vs 0.47 active days). That result is an **artifact of staff usage** — team members building and testing the product naturally accumulate tests. It measured internal activity, not buyer behaviour, and must not be cited.

**Consequence:** the "activation threshold" hypothesis carried from Stage 1 — that completing *N* tests predicts conversion — **remains entirely untested** and cannot be tested until externally-acquired paying customers exist. Any pricing or gating decision justified by that hypothesis would be unsupported.

---

## 5. Plan-wise Funnel

Reconstructed from the payments ledger. A `created` row is written server-side only after the user passes a confirmation dialog showing the plan and final price — so every row below represents a **price-accepted purchase attempt**, not a page view.

| Plan | Price | Checkout attempts | Completed | Abandoned | Conversion | Revenue | Share of demand |
|---|---|---|---|---|---|---|---|
| **premium_annual** | ₹1,699 | **12** | 0 | 12 | **0%** | ₹0 | **57%** |
| vettri_nichayam | ₹899 | 4 | **1** | 3 | 25% | **₹899** | 19% |
| rank_booster_g2 | ₹1,249 | 3 | 0 | 3 | 0% | ₹0 | 14% |
| group1_mock_pack | ₹399 | 2 | 0 | 2 | 0% | ₹0 | 10% |
| **Total** | | **21** | **1** | **20** | **4.8%** | **₹899** | 100% |

*(The three `premium_annual` staff comps are excluded from this table — per the Stage 2 code read, comp grants write a synthetic order ID directly to `paid` and never generate a `created` row, so they are not checkout attempts.)*

**Most demanded:** `premium_annual` — 57% of all purchase attempts, at the highest price point (₹1,699). **It has converted zero times.**

**Only converting plan:** `vettri_nichayam` — the sole revenue-generating product, and that single sale was founder-generated.

**Most abandoned:** `premium_annual` — 12 of 20 abandonments (60%).

**Insufficient sample:** every plan. With 21 attempts and 1 conversion total, no per-plan conversion rate is statistically meaningful. These are demand *signals*, not rates.

**OBSERVATION (not fact):** the most expensive plan attracts the most interest and converts least. Two explanations fit equally well — price resistance at ₹1,699, or plan confusion driving users to the most prominent option and then stalling. The walkthrough finding (*"I can't differentiate what each plan does"*) supports the second. Neither is proven.

---

## 6. Payment Abandonment

| | |
|---|---|
| `created` rows never completed | **20** |
| Distinct users | **11** |
| Attempts per user | 5, 3, 2, 2, 2, 1, 1, 1, 1, 1, 1 |
| First attempt | 2026-06-18 (4 days after the first-ever signup) |
| Last attempt | **2026-09-05 — the day of this audit** |
| Age of oldest unresolved attempt | 79 days |
| Recovery mechanism | **None** — no cleanup, retry, reminder or follow-up exists |

**Reconciliation with the 11/20 figures:** the 20 rows are the sum of the `stuck_created` column across all four plans (12 + 3 + 3 + 2). They originate from 11 unique `user_id` values. Adding the single completed payment gives **21 total checkout attempts, of which 1 succeeded (4.8%)**.

### Attempt-timing analysis

| Pattern | Users | Attempts | Interpretation |
|---|---|---|---|
| Repeat within seconds (12s, 11.7s spans) | 2 | 4 | **Reinterpreted.** Originally read as a technical failure signature. Since checkout was subsequently verified working, the better reading is comparison-shopping — one user opened `premium_annual` then `vettri_nichayam` **12 seconds apart**, i.e. using the checkout screen to discover what the plans cost because the pricing page didn't say. |
| Repeat across days/weeks (59d, 16d, 13d spans) | 3 | 10 | Sustained interest with an unresolved objection. One user returned **5 times across 59 days** and never bought. |
| Single attempt, never returned | 6 | 6 | One look, no return. |

**Whether any of the 11 later converted is not yet determined** — a query is required (see Section 17).

**Revenue at stake — SCENARIO, not lost revenue:** if every abandoned attempt had converted at list price, 12×₹1,699 + 3×₹1,249 + 3×₹899 + 2×₹399 = **₹27,630**, or roughly 31× all-time revenue. This is a measure of expressed intent, not a forecast — most people who start a checkout anywhere never complete it.

---

## 7. Retention & Cohorts

**STATUS: PARTIAL — cohort tables pending.**

What is established:

| Metric | Value |
|---|---|
| Users with 2+ active days | **16 of 682 (2.3%)** |
| Test-completers who never returned | **270 of 286 (94.4%)** |
| Active in last 30 days | 135 (19.8%) |
| Active in last 7 days | 17 (2.5%) |

**The 30-day-to-7-day ratio is 12.6%.** Under steady engagement this would be substantially higher. That is a decay signal, though it is also consistent with a growing user base where recent joiners haven't yet had time to return.

### A necessary caveat on the definition of "active"

`daily_activity` is written **only** by test submission and current-affairs question completion. A user who logs in, browses materials, reads the CA magazine, or reviews bookmarks — but submits no test — **is not counted as active at all.**

Every retention figure in this report is therefore a **floor, not a measurement**. The true return rate is higher by an unknown margin. This should not be described as "true retention" in any decision-making context until a broader activity definition is instrumented.

Required for completion: `Q8` (D1/D3/D7/D14/D30 by cohort), `Q9` (engagement distribution).

---

## 8. Clarity Findings

**CLARITY DATA NOT ACCESSIBLE.**

No access was available in this environment at any point across Stages 1, 2 or 3. Clarity is additionally loaded as a Google Tag Manager container tag rather than being called directly from the codebase, so even its firing rules live outside the repository and could not be audited from source.

**No behavioural inferences are drawn from Clarity anywhere in this report.** The following questions consequently remain unanswered by session data: scroll depth on the landing page, rage/dead clicks, quick-backs, form-abandonment points, device split, and entry/exit page patterns. The walkthrough in Section 9 is a **substitute of n=1**, not a replacement.

---

## 9. Complete Funnel

| Stage | Count | Conv. | Drop-off | Source | Confidence |
|---|---|---|---|---|---|
| Visitors | — | — | — | GA4/GTM only — no server-side store | **DATA NOT AVAILABLE** |
| Signup completed | 682 | — | — | `profiles` | **ACTUAL** |
| Started ≥1 test | 345 | 50.6% | **−337** | `test_sessions` | **ACTUAL** |
| Completed ≥1 test | 286 | 82.9% | −59 | `test_sessions` | **ACTUAL** |
| Returned (2+ active days) | 16 | **5.6%** | **−270** | `daily_activity` | **ACTUAL (floor)** |
| Offer/pricing interaction | — | — | — | not instrumented | **DATA NOT AVAILABLE** |
| Checkout started | 21 attempts / 11 people | — | — | `payments.created` | **ACTUAL** |
| Payment completed | 1 | 4.8% | −20 | `payments.paid` | **ACTUAL** |
| **Externally-acquired paid** | **0** | **0.00%** | −1 | founder-confirmed | **ACTUAL** |

**Two largest absolute losses:** 337 users between signup and first test; 270 users between test completion and any return visit.

**Largest proportional loss:** 94.4% at completion → return.

**Note:** the checkout stage cannot be expressed as a percentage of the preceding stage, because pricing-page views are not instrumented. It is unknown how many of the 682 ever saw a plan.

---

## 10. Internal Customer Adjustment

| Category | Count | Revenue |
|---|---|---|
| Total records marked `paid` | 4 | ₹899 |
| Internal staff comps (founder-confirmed) | 3 | ₹0 |
| **INTERNAL / FOUNDER-GENERATED CUSTOMER** | 1 | ₹899 |
| **INTERNAL / FOUNDER-SIDE REFERRAL** | *pending identification* | *pending* |
| **EXTERNALLY-ACQUIRED PAYING CUSTOMERS** | **0** | **₹0** |

**Method note:** exactly one payment record carries a non-zero amount. Given the founder's statement that the single paying customer was generated internally, that record is necessarily the one in question — this is arithmetic on aggregates, not identification of a specific user. **No attempt has been made to guess which user IDs correspond to the internal customer or the founder-side referral.** Those will be labelled on receipt of the identifiers, and Section 10 updated with both views.

### Conversion rates, both ways

| Basis | Rate |
|---|---|
| Overall (all 4 `paid` records / 682 users) | 0.59% |
| Revenue-generating (1 / 682) | 0.15% |
| **Externally acquired (0 / 682)** | **0.00%** |

**The ₹899 does not demonstrate product-market fit, willingness to pay, or marketing effectiveness.** It demonstrates that the payment pipeline functions end-to-end — which is genuinely useful, but is an engineering result, not a commercial one.

---

## 11. Revenue Analysis

| Metric | Value |
|---|---|
| All-time revenue | ₹899 |
| Externally-generated revenue | **₹0** |
| Revenue per day | ₹10.83 |
| ARPU (all registered users) | ₹1.32 |
| AOV (single transaction) | ₹899 |
| Refunds | 0 |
| Failed payments | 0 |
| Coupon-attributed revenue | ₹0 (zero redemptions in 83 days) |
| Revenue concentration | 100% from one plan, one transaction, one internally-generated buyer |

At the current rate, annualised revenue is approximately ₹3,953. **The business has not yet demonstrated any external revenue.**

The coupon and promoter system is fully built, including per-promoter tracking — and **has never been used once**. The walkthrough identified why: *"Where to get the coupon codes"* — no discoverable path to a code exists in the product.

---

## 12. Root Cause Ranking

### DISPROVED — remove from consideration

| Claim | Disproved by |
|---|---|
| Checkout is broken | Walkthrough tested to the final payment step on a real device — works correctly. *This was the leading hypothesis and it failed.* |
| Payment infrastructure is failing | 0 failed payments in 83 days |
| Signup friction is causing drop-off | Signup verified working; the 337 loss occurs **after** clean registration |
| Frontend performance | ~221 KB gzipped, immutably cached (Stage 1 measurement) |
| Consent gating suppresses analytics | Banner removed; trackers fire for ~100% of sessions |
| The free tier is too generous | Walkthrough completed two full tests and still felt no urge to upgrade — absent value perception, not excess generosity |
| Timezone bug is urgent | Production data returned identical UTC and IST values |

### FACT — measured, not inferred

1. Zero externally-acquired paying customers in 83 days
2. 49.4% of signups (337) never start a test
3. 94.4% of test-completers (270) never return
4. 20 abandoned checkouts from 11 people; oldest unresolved for 79 days
5. Zero coupon redemptions
6. No acquisition attribution exists anywhere in the schema
7. An expired offer is live on the paid-ads landing page
8. Paid test formats cannot log abandonment at all
9. `premium_annual` draws 57% of purchase attempts and has converted zero times

### OBSERVATION — real pattern, causality not established

10. The value moment (Revision/Insights) exists but is reached late and accidentally
11. Premium upsells appear in every section while purchase desire is zero
12. Popup overload at first run
13. Images not loading in Current Affairs
14. 3–4 taps to reach a test

### HYPOTHESIS — plausible, unproven

15. **Value is not established before the paywall is shown** — the strongest available explanation for non-payment; supported by walkthrough (n=1) and consistent with all three funnel losses, but not independently verified
16. Plan indistinguishability suppresses conversion — supported by walkthrough plus the 12-second cross-plan checkout comparison
17. Price resistance at ₹1,699 — competes with #16 as the explanation for premium's zero conversion; unresolved

### UNVERIFIED — data not collected

18. Acquisition trend direction (Section 3)
19. Retention shape by cohort (Section 7)
20. All Clarity behavioural questions (Section 8)

---

## 13. Updated Backlog

`TNPSC_Mentors_BACKLOG_REGISTER.md` remains the working register — 33 open items, 6 closed. This verification makes three changes to it:

- **Add:** externally-acquired paying customers = 0 as the headline metric (supersedes "1 real customer")
- **Retract:** the paying-vs-non-paying engagement comparison (staff artifact — Section 4)
- **Confirm:** signup moves permanently to closed; the 337 loss is an orientation problem, not a registration one

---

## 14. Priorities

### P0 — Fix immediately

| # | Problem | Evidence | Confidence | Affected | Fix | Success measure |
|---|---|---|---|---|---|---|
| 1 | Value is asked for before it's established | *"I can't feel any urge to pay"*; 11 tried, 1 bought; 0 external conversions | High | All 682 | Route new users to Revision/Insights inside the first session, before any upsell | Externally-acquired paying customers > 0 |
| 2 | Five plans are indistinguishable | Walkthrough; 12-second cross-plan checkout comparison; code confirms overlapping entitlements | High | All 21 checkout attempts | One-line differentiator per plan; a default recommendation | premium_annual conversion > 0% |
| 3 | Expired offer live on the ads landing page | Offer expired 31 Aug; seen live 5 Sep; code does not auto-revert | Certain | All `/rank-booster` traffic | Update the constant; add an expiry check | No stale offer visible |

### P1 — High impact

| # | Problem | Evidence | Confidence | Affected |
|---|---|---|---|---|
| 4 | No orientation for new users | *"I don't know what I should do now"*; 337 never start a test | High | 337 users |
| 5 | Nothing brings users back | 270 of 286 never return; 16 of 682 have 2+ active days | High | 270 users |
| 6 | Popup overload at first run | Walkthrough; 5 competing modals in code | Medium | All new users |
| 7 | Premium upsell in every section with no desire built | Walkthrough | Medium | All users |
| 8 | Images broken in Current Affairs | Walkthrough | High | Daily-return hook |
| 9 | 3–4 taps to first test | Walkthrough | Medium | All new users |
| 10 | No coupon path exists | 0 redemptions; *"where to get the coupon codes"* | High | Entire referral system |
| 11 | 20 abandoned checkouts, no recovery | 11 identifiable people, no follow-up mechanism | High | 11 warm prospects |

### P2 — Medium

12. No acquisition attribution (blocks all channel decisions) · 13. Paid formats can't log abandonment · 14. No social proof · 15. Invisible in search · 16. No indexable pricing page · 17. `premiumActive` counts 1 of 5 plans · 18. Google signups untracked · 19. Feedback prompt buried

### P3 — Later

20. `revoked` check-constraint violation · 21. Timezone mismatch · 22. `passed_80_percent` misnamed · 23. Habit loop ignores partial effort · 24. README contradicts production

---

## 15. 30 / 60 / 90 Day Recommendation

**Days 1–30 — establish value, and find out whether acquisition works**
- Ship P0-1, P0-2, P0-3
- Run the outstanding queries (Section 17) — particularly the acquisition trend, which may reorder everything below
- Instrument pricing-page views so the checkout stage has a denominator
- Contact the 11 abandoned-checkout users and ask what stopped them — the fastest available route to resolving hypotheses #16 vs #17

**Days 31–60 — activation and return**
- P1-4 (orientation), P1-5 (return mechanism), P1-6 through P1-9
- Add UTM capture so that any future acquisition spend is measurable
- Make coupon codes discoverable, then recruit the first promoters

**Days 61–90 — only if external conversion has moved off zero**
- Extend abandonment tracking to paid formats
- SEO landing pages and social proof
- Re-run this verification against a real paying cohort and finally test the activation-threshold hypothesis

---

## 16. What NOT to Change Yet

- **Do not change prices.** Zero external conversions means there is no evidence that price is the binding constraint. Cutting prices before establishing value would forfeit margin without addressing the cause.
- **Do not restructure the plans yet** — beyond making them *describable*. Redesigning a pricing architecture on 21 attempts and 1 sale would be fitting to noise.
- **Do not spend on ads.** There is no channel underperforming; there is no channel that has ever produced a paying customer. Paid traffic into a funnel with 0.00% external conversion converts spend into nothing.
- **Do not rebuild checkout.** Verified working.
- **Do not touch frontend performance.** Measured, fine.
- **Do not act on the paying-vs-non-paying engagement gap.** It was staff activity (Section 4).

---

## 17. Data Gaps

**Queries not yet run** (all read-only SELECT; see `TNPSC_Mentors_Stage3_MANUAL_Queries.sql`):

| Query | Answers |
|---|---|
| **Q10 — signups by month/week** | Is acquisition growing or dying? *Highest priority* |
| Q12 — feedback text (6 rows) | The only qualitative user data in the system |
| Q9 — engagement distribution | Does any core of engaged users exist? |
| Q8 — retention D1/D3/D7/D14/D30 | When exactly do users leave? |
| Q6 — abandonment by category | Where in the product do people quit; do paid formats log it? |
| Q7 — target group | Which exam audience actually engages |
| Role breakdown | How many of the 682 are team accounts |
| Created→paid crossover | Did any of the 11 abandoners later convert? |

**Structurally unavailable:**
- Visitor counts and any top-of-funnel data (no server-side pageview store)
- Historical channel attribution (no UTM columns — unrecoverable for all past periods)
- Clarity behavioural data (no access)
- Pricing-page view counts (not instrumented)
- Paid-format abandonment (not instrumented)

**Pending from founder:**
- Identifiers for the internal customer and founder-side referral
- Whether the app is published on Play Store / App Store

---

## 18. Confidence & Limitations

**High confidence:** all production counts, the funnel stage figures, plan-wise demand distribution, the abandonment reconciliation, and the zero-external-conversion conclusion. These come from direct SELECT queries against production.

**Medium confidence:** the interpretation that value perception is the binding constraint. It is consistent with every measured funnel loss and with the walkthrough, but the walkthrough is **n=1**, conducted by a non-aspirant. A real TNPSC candidate's experience may differ materially — particularly around exam-category comprehension, which should be explicitly discounted from those findings.

**Low confidence / unresolved:** whether `premium_annual`'s zero conversion is caused by price or by plan confusion. These two hypotheses fit the data equally well and are not separable without either user interviews or a pricing-page instrumentation change.

**Known measurement limits:**
- Retention figures are floors, not measurements (`daily_activity` only records test submissions)
- 83 days is a short window; some apparent decay may be normal cohort maturation
- 21 checkout attempts and 1 conversion is too small a sample for any statistically meaningful rate
- Three of four `paid` records are staff, and the fourth is founder-generated — the entire monetization dataset is internally generated

**The central finding is nonetheless robust to all of the above:** across 83 days and 682 users, not one person discovered this product, valued it, and paid for it independently.

---

*Prepared through read-only analysis. No production code, database records, configuration, analytics, payments or deployments were modified at any point.*
