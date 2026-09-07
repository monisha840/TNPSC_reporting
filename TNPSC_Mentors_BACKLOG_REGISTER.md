# TNPSC Mentors — Consolidated Backlog Register

**Compiled:** 5 September 2026
**Sources:** Stage 1 external audit · Stage 2 codebase/schema audit · Stage 3 production database queries (read-only) · First-time-user walkthrough

---

## Baseline (production data, verified 5 Sep 2026)

| Metric | Value |
|---|---|
| Platform age | **83 days** (first signup 2026-06-14, latest 2026-09-05) |
| Registered users | 682 |
| Started ≥1 test | 345 (50.6%) |
| Completed ≥1 test | 286 (41.9%) |
| Returned on a 2nd day | **16 (2.3%)** |
| Reached checkout | 11 people / 20 attempts |
| **Real paying customers** | **1** |
| **All-time revenue** | **₹899** (89,900 paise) |
| Failed payments | 0 |
| Coupon redemptions | 0 |
| Feedback received | 6 |

---

## Evidence key

- **[PROD]** — measured directly in the production database
- **[CODE]** — read from source code / SQL schema
- **[EXT]** — external/public evidence (search, sitemap, HTTP)
- **[UX]** — first-time-user walkthrough
- **[FOUNDER]** — confirmed directly by the founder

---

## P0 — The core problem

| ID | Item | Evidence / reason |
|---|---|---|
| **P0-1** | **The product asks for money before establishing value** | **[UX]** *"I can't feel any urge to pay and get premium."* **[PROD]** 11 people reached checkout, 1 bought. This is not a checkout defect — checkout was tested to the final payment step and works. |
| **P0-2** | **The five plans are indistinguishable** | **[UX]** *"I can't differentiate what each plan does."* **[CODE]** Entitlement rules genuinely overlap (Premium ⊇ Rank Booster, Vettri ⊉ Rank Booster, Mock Pack unlocks neither). **[PROD]** User `9810aa5d` opened two different plans' checkouts **12 seconds apart** — comparison-shopping at the payment window because the pricing screen didn't explain the difference. |
| **P0-3** | **Expired offer live on the paid-ads landing page** | **[CODE]** `/rank-booster` advertises "Independence Day offer valid till 31 Aug 2026"; `pricing.ts` states the price does not auto-revert. **[UX]** Confirmed still visible on 5 Sep — 5 days after expiry. |
| **P0-4** | **The value moment is discovered late and by accident** | **[UX]** *"after checking on the Revision, Insights section, I feel good"* — but only after wandering in unprompted, and after two tests had already produced no desire to pay. These are the screens that do the persuading, and almost nobody reaches them. |

---

## P1 — Activation & first-run experience

| ID | Item | Evidence / reason |
|---|---|---|
| **P1-1** | **No orientation for a new user** | **[UX]** *"When entered the application, I don't know what is so necessary and what should I do now."* **[PROD]** **337 of 682 signups (49.4%) never start a single test.** Signup itself is confirmed working (P1-1 is a post-signup problem, not a registration one). |
| **P1-2** | **3–4 taps to reach a test** | **[UX]** Counted during walkthrough. Friction sits directly in front of the only thing that delivers value. |
| **P1-3** | **Popup overload at first run** | **[UX]** *"felt like there is too many pop up when entering the app."* **[CODE]** Onboarding tour, starter-test prompt, push primer, marathon free alert and update prompt all compete on entry. |
| **P1-4** | **Premium upsell appears in every section** | **[UX]** *"whichever section I visit, somewhere I can see the pop up for premium plan."* Constant asking while desire is zero — costs goodwill without converting. |
| **P1-5** | **Images not loading in Current Affairs** | **[UX]** Observed during walkthrough. A content defect sitting on the daily-return hook. |
| **P1-6** | **Nothing brings users back** | **[PROD]** **270 of 286 test-completers (94.4%) never returned on a second day.** Only 16 of 682 users have ever had 2+ active days. |
| **P1-7** | **Free tier under-communicated** | **[UX]** *"for free should be highlighted more."* |
| **P1-8** | **Kural of the day has no prompt** | **[UX]** Suggested during walkthrough — an existing feature with no surfacing. |

---

## P1 — Monetization

| ID | Item | Evidence / reason |
|---|---|---|
| **P1-9** | **One real customer in 83 days** | **[PROD]** `vettri_nichayam: 1 buyer, 89,900 paise`. Total all-time revenue ₹899 (≈₹10.83/day). |
| **P1-10** | **Three "premium" accounts are staff, not customers** | **[FOUNDER]** Confirmed team members. **[PROD]** `premium_annual: 3 buyers, ₹0 revenue`. **No paid conversion has ever originated from marketing.** |
| **P1-11** | **Zero coupon redemptions in 83 days** | **[PROD]** `used_coupon = 0` across every plan. **[UX]** *"Where to get the coupon codes"* — there is no discoverable path to one. The infrastructure works; nobody can find a code. |
| **P1-12** | **20 abandoned orders with no recovery** | **[PROD]** 20 rows stuck at `created` from 11 identifiable people, spanning 2026-06-18 to 2026-09-05 (most recent: today). No cleanup, retry, reminder, or follow-up exists. These are contactable, price-accepted prospects. |

---

## P2 — Acquisition & discoverability

| ID | Item | Evidence / reason |
|---|---|---|
| **P2-1** | **Invisible in search** | **[UX]** Searching "TNPSC group 2 test series": Veranda Race 1st, TNPSC Master 2nd; TNPSC Mentors absent. **[EXT]** Zero third-party mentions, reviews or forum threads found anywhere for the brand. |
| **P2-2** | **Sitemap contains 5 URLs** | **[EXT]** Home + 4 legal pages. The 7 products named in the site's own structured data have no pages of their own. |
| **P2-3** | **Identical title/meta on every route** | **[EXT]** Pure client-rendered SPA with no per-route server output. Every link shared on WhatsApp/Telegram unfurls as the generic homepage. |
| **P2-4** | **No public, indexable pricing page** | **[EXT]** Pricing renders only inside the app shell — cannot rank in search or be forwarded. |
| **P2-5** | **No social proof anywhere** | **[CODE]** `LandingPage.tsx` and `PricingCards.tsx` contain zero testimonials, ratings or user counts. Competitor TNPSC Master leads with "10,000+ students". |
| **P2-6** | **No app-store presence found** | **[EXT]** No listing located for "TNPSC Mentors" on either store, despite **[CODE]** real IAP product IDs (`com.tnpscmentor.app.premium90` etc.) implying store registration. **Still unconfirmed — awaiting founder answer.** |

---

## P2 — Measurement & analytics

| ID | Item | Evidence / reason |
|---|---|---|
| **P2-7** | **Zero acquisition attribution** | **[CODE]** No `utm_source`/`medium`/`campaign`/referrer column exists anywhere in the schema. You cannot determine where your single paying customer came from. |
| **P2-8** | **Paid formats cannot log abandonment** | **[CODE]** `record_abandoned_test` is wired only to the free practice engine. Quits in Mock / Vettri / Rank Booster / Test Series leave no trace at all. |
| **P2-9** | **Google signups not tracked as signups** | **[CODE]** `trackSignUp()` has a single call site (password/OTP path). Google-created accounts only fire `trackLogin`, indistinguishable from a returning user. |
| **P2-10** | **`premiumActive` counts 1 of 5 plans** | **[CODE]** `revenue_metrics.sql` filters `plan = 'premium_annual'` only — understates real paying customers on the founder's own dashboard. |
| **P2-11** | **Feedback prompt deliberately buried** | **[CODE]** Appears once, only on the home screen, only after 2 completed tests, non-admins only, then suppressed 3 months. **[PROD]** Result: 6 responses from 682 users. |
| **P2-12** | **`daily_activity` only logs test submissions** | **[CODE]** A user who logs in and reads materials is not counted as "active." All retention figures are therefore a floor, not the truth. |

---

## P3 — Technical debt

| ID | Item | Evidence / reason |
|---|---|---|
| **P3-1** | **`revoked` status violates the check constraint** | **[CODE]** `superadmin_revoke_rank_booster()` writes `status='revoked'`, which the `payments` table forbids (`created/paid/failed` only). Will throw the first time it is used in a refund dispute. |
| **P3-2** | **Active-today timezone mismatch** | **[CODE]** Query filters on UTC `current_date`; writes are stamped IST. **[PROD] Currently harmless** — Q1 returned identical UTC and IST values (2 and 17). Only misleads between IST 00:00–05:30. *Downgraded from the P0 assigned in Stage 2.* |
| **P3-3** | **`passed_80_percent` is misnamed** | **[CODE]** The enforced attendance gate is 25%, not 80%. Anyone reading this column will misinterpret it. |
| **P3-4** | **`in_progress` is dead schema** | **[PROD]** 0 rows. Sessions are written already-final; the state is never used. |
| **P3-5** | **Habit loop ignores partial effort** | **[CODE]** Streaks/XP/badges are written only by `submit_test`. A user who answers 20 questions then quits earns nothing — no reinforcement to return after a bad first session. |
| **P3-6** | **README contradicts production reality** | **[CODE]** States "the database stays on Supabase Cloud"; production is self-hosted. This misdirection cost several hours during Stage 3. |

---

## Closed — do NOT spend effort here

| Item | Why it is closed |
|---|---|
| ~~Broken checkout~~ | **[UX]** Tested to the final payment step on a real device — works correctly. This was the leading hypothesis going into the walkthrough and it is disproved. |
| ~~Signup friction~~ | **[UX][FOUNDER]** Signup confirmed working perfectly. This matters: the 337 who never take a test are dropping *after* a clean registration, which points squarely at P1-1 (orientation), not registration. |
| ~~Payment infrastructure~~ | **[PROD]** Zero failed payments in 83 days. Razorpay integration (HMAC verification, idempotency, server-side re-fetch) is sound. |
| ~~Frontend performance~~ | **[EXT]** ~221 KB gzipped JS + 20 KB CSS, hashed and cached immutably. Measured in Stage 1 — not a problem. |
| ~~Consent gating suppressing analytics~~ | **[CODE]** The banner was removed by product decision; trackers now fire for ~100% of web sessions. Stage 1's concern no longer applies. |
| ~~"Free tier is too generous"~~ | **[UX]** Never supported by evidence. The walkthrough took two full tests and still felt no urge to upgrade — the problem is absent value perception, not an over-generous free tier. |

---

## Still open — data not yet collected

| Question | How to answer |
|---|---|
| **Is acquisition growing or dying?** | Q10 (signups by month). **The single most important open question** — it decides whether P0-1 or P2-1 leads the roadmap. |
| What did the 6 users actually say? | Q12 (feedback text) |
| Is there any core of engaged users? | Q9 (engagement distribution) |
| Where do people quit tests, and do paid formats log it? | Q6 (abandonment by category) |
| When do users leave — D1, D7, D30? | Q8 (retention) |
| How many of the 682 are team accounts? | Role breakdown query |
| Is the app actually published on the stores? | Founder answer |
| Clarity behavioural data | No access this round |

---

*All production figures above were obtained through read-only SELECT queries. No production code, data, configuration or deployment was modified at any point in this audit.*
