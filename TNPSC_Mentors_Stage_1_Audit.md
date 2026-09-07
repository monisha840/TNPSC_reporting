# TNPSC Mentors — Stage 1 External Audit

**Why tnpscmentors.in isn't converting, and what to do about it**

A end-to-end read on why users are low, why leads don't pay, and where the fastest, cheapest fixes are — built from what's actually checkable on the public site, and structured so the rest drops in the moment you paste in your Superadmin and Clarity numbers.

## Report metadata

- **Site audited:** tnpscmentors.in + app.tnpscmentors.in
- **Date:** 5 Sep 2026
- **Scope:** public HTTP/HTML layer, SEO surface, app-store presence, social reach, competitive set
- **Not accessible:** /superadmin (auth wall), Clarity dashboard (auth wall)

## Headline numbers (audit-evidence KPIs)

| Metric | Value |
|---|---|
| URLs in the sitemap | 5 |
| Third-party reviews / mentions found for the brand | 0 |
| Instagram followers | 581 |
| Play Store / App Store listings found | 0 |
| Competing TNPSC apps outranking it | 7 |

## Confidence key

- **VERIFIED** — directly observed: HTML, headers, sitemap, or a live public listing
- **INFERRED** — reasoned from evidence, not yet confirmed on-screen
- **NEEDS YOUR DATA** — sits behind Superadmin/Clarity login — see the Appendix

---

## 01 · Executive Summary — Six reasons the funnel is thin, ranked

None of these are about the product being bad. The test content, the bilingual Tamil/English build, the Razorpay checkout, the native-app privacy engineering — that layer is genuinely solid (see the Evidence Locker). The problem sits earlier: almost nobody outside your existing channels can find this site, and the few who do can't easily forward what they found.

### 1. Discoverability is close to zero — **[VERIFIED]**

Zero third-party mentions, reviews, or forum threads turned up anywhere for "TNPSC Mentors" — against a field (Testbook, Entri, TNPSC Master, Nithra, KalviApp) that dominates the same searches. The sitemap has 5 URLs total. A student searching "TNPSC Group 2 test series" or "TNPSC previous year questions" in Tamil or English has no organic path to this site right now.

*→ see the sitemap & search evidence (Evidence Locker)*

### 2. Nothing on the site is shareable as itself — **[VERIFIED]**

Every route — home, privacy, refund policy, even the ones that will exist for pricing — renders the identical page title and description, because the whole site is one client-side bundle with no per-page server output. WhatsApp and Telegram (the two channels this exact audience uses to forward links) will unfurl *any* link on the domain as the generic homepage card. A student can't forward "here's the pricing" or "here's the Group 2 test" — only "here's the homepage."

*→ see the identical-title check (Evidence Locker)*

### 3. No visible proof-of-scale at the moment of deciding — **[INFERRED]**

Competitor TNPSC Master leads its pricing page with "10,000+ students" bought premium. Whether tnpscmentors.in shows any comparable number, a testimonial, or a rank/result claim couldn't be confirmed — the homepage is 100% client-rendered and didn't return readable content to an automated fetch. Worth a manual screenshot check (see Appendix) because this is normally a cheap, high-leverage fix.

### 4. The native app isn't converting engineering into installs — **[VERIFIED]**

The build ships proper Capacitor targets for Android and iOS, with real App Tracking Transparency and Android-16 edge-to-edge handling already coded in — that's not a trivial checkbox, someone did real mobile work. But neither store surfaces a "TNPSC Mentors" listing today. Every serious competitor in this space (Testbook, Entri, Nithra, KalviApp, Yukthi) is winning app-store search on these exact keywords instead.

*→ see the Play Store search results (Evidence Locker)*

### 5. The Clarity numbers you're looking at are a floor, not the truth — **[VERIFIED]**

GTM, Clarity and the Meta Pixel are wired to fire only after a visitor explicitly accepts the cookie banner — correct under DPDP/GDPR, and well-engineered. But it means every visitor who bounces before deciding, or who declines, is invisible to the dashboard you're reading. Read the roadmap's `MEAS-1` fix before trusting Clarity's traffic totals at face value.

### 6. The free tier may already be answering why people came — **[NEEDS YOUR DATA]**

The site's own SEO copy leads with "Free TNPSC test series" and a free daily current-affairs test plus previous-year questions — exactly the content most search intent is for. If the free tier already satisfies that intent end to end, there's no natural pull toward paying. This is a hypothesis, not a finding: it's confirmed or killed by your signup→paid rate and by what's actually gated. Plug your numbers into the calculator below.

*→ test this in the calculator (Section 03)*

---

## 02 · Evidence Locker — What was actually checked, and what it showed

Every card below is a live check run against the public site on 5 Sep 2026 — sitemap, HTTP headers, page source, robots.txt, and public listings on Instagram, Telegram, Play Store and web search. Nothing here required a login.

### Method: `curl /sitemap.xml`
**Finding:** Only 5 URLs are indexable, sitewide.
**Why it matters:** Home + `/privacy` + `/guidelines` + `/payment-policy` + `/refund-policy`. The site's own structured data names 7 distinct products (Group 2, English test, Tamil test, PYQ, PYQ-with-explanation, daily current affairs, general test series) — none has its own URL. Every one of those keyword intents currently competes for the same single homepage.

### Method: `curl` title-tag, 4 routes
**Finding:** Identical `<title>` and meta description on every route sampled.
**Why it matters:** /privacy, /guidelines, /payment-policy, /refund-policy all return the homepage's title verbatim. The app is 100% client-rendered with no per-route server output, so any bot or link-preview scraper that doesn't execute JavaScript — including WhatsApp's and Telegram's unfurlers — sees the same card for every link.

### Method: `curl --compressed`, JS/CSS bundles — **[VERIFIED, GOOD]**
**Finding:** ~221 KB gzipped JS + ~20 KB CSS, hashed & cached 1yr immutable.
**Why it matters:** This rules out "the site is slow" as a cause. The frontend is genuinely lean and well-cached — this is not where the growth problem lives, and it shouldn't be where engineering time goes next.

### Method: Page `<head>` source
**Finding:** GTM / Clarity / Meta Pixel load only after explicit cookie-consent acceptance.
**Why it matters:** Correctly built for DPDP Act / GDPR — trackers are gated behind a real consent function, not fired then hidden. The tradeoff: anyone who bounces before answering the banner, or who declines, never appears in Clarity, GA, or the Meta retargeting pool. Your dashboard undercounts real traffic by an unknown amount.

### Method: Google Play + App Store search
**Finding:** No listing found for "TNPSC Mentors" / "tnpscmentors" on either store.
**Why it matters:** Despite the codebase clearly targeting Capacitor Android + iOS builds (native-vs-web tracker split, ATT handling, Android 16 edge-to-edge support all present in source). Meanwhile Testbook runs *separate* dedicated apps for "TNPSC Group 1 Prep" and "TNPSC Group 2 Preparation," and Nithra, KalviApp, Yukthi, Aram and others all own app-store real estate for these keywords today.

### Method: Web search, brand name
**Finding:** Zero reviews, complaints, or forum mentions found anywhere for "TNPSC Mentors."
**Why it matters:** Searching the brand name plus "reviews," "pricing," or "complaint" returns nothing about this site at all — only unrelated coaching institutes. For comparison, the same search surfaces pricing pages, review aggregators and comparison articles for half a dozen competitors. Word-of-mouth and organic citation, the cheapest acquisition channel there is, is currently at zero.

### Method: instagram.com/mentorstnpsc
**Finding:** 581 followers, following 7 accounts.
**Why it matters:** Bio positions the brand well ("#1 TNPSC Prep — Group 1, 2, 4 & VAO") and links out to a Telegram channel, which is the right instinct for this audience. But at 581 followers the account isn't yet a meaningful acquisition channel on its own — it's a seed, not a funnel.

### Method: robots.txt (site's own comments) — **[VERIFIED, GOOD]**
**Finding:** Deliberately engineered per-host indexing: marketing site indexable, logged-in app (`app.tnpscmentors.in`) blocked with `noindex`.
**Why it matters:** This is the right architecture — it stops the app shell from competing with the marketing site in search, and stops thin auth-only routes (`/login`, `/test-arena`, `/profile`) from being crawled. The engineering judgment here is sound; the problem is there's so little content behind it to index in the first place.

### Method: Response headers, CSP
**Finding:** Razorpay checkout, Supabase backend, Google OAuth all present and correctly scoped in CSP.
**Why it matters:** Payment and auth infrastructure is standard and appropriate for the Indian market (Razorpay covers UPI, the dominant payment rail for this audience). `/payment-policy` and `/refund-policy` existing confirms paid plans are live — but the actual price point isn't visible anywhere public, on this site or cited elsewhere, which independently supports Cause #2.

### Method: Structured data (JSON-LD) — **[VERIFIED, GOOD]**
**Finding:** Clean `EducationalOrganization` + `FAQPage` schema already in place.
**Why it matters:** Someone already did the hard, easy-to-skip SEO groundwork — organization schema, bilingual `inLanguage` tags, an FAQ block. This is exactly the foundation the missing landing pages (Cause #1) need to attach to; it's mostly wasted right now because there's only one page for it to describe.

---

## 03 · Interactive Funnel & Revenue Calculator

*(This section was a live, editable calculator in the artifact — inputs recompute the funnel/revenue math instantly in the browser. Reproduced below as a static spec: the exact fields, default/example values, formulas, and the numbers those defaults currently produce.)*

**Purpose:** replace every default value with your real Superadmin/Clarity figures and the funnel, the weakest-link flag, and the revenue math all recompute. Nothing in the tool is sent anywhere — it runs entirely client-side.

### Inputs (with the example defaults shown at load)

| Field | Default / example value | Note |
|---|---|---|
| Monthly website visitors | 4,000 | example — pull from Clarity's "Traffic" tab (remember: floor, not true total) |
| Visitor → signup rate | 18% | |
| Signup → active (attempts ≥1 test) | 45% | |
| Active → paid conversion | 3% | |
| Price per plan (₹) | 449 | example — TNPSC Master's 6-month price. Replace with your real plan price |
| Avg. subscription length (months) | 6 | |
| Monthly marketing/ad spend (₹, optional) | 0 | leave 0 if you're not running paid acquisition yet |

### Formulas (exact, as implemented)

```
signups = visitors × (signup_rate / 100)
active  = signups × (active_rate / 100)
paid    = active × (paid_rate / 100)
mrr     = paid × price
ltv     = price × avg_months
cac     = spend / paid            (only if spend > 0 and paid > 0)
ltv_cac_ratio = ltv / cac
```

Funnel bar values are each shown as a percentage of total visitors. The "weakest stage" flag is computed as the relative shortfall of each conversion rate against the midpoint of its benchmark range (see below); whichever stage has the largest relative shortfall is flagged.

### Funnel output at the example defaults

| Stage | Value | % of visitors |
|---|---:|---:|
| Visitors | 4,000 | 100.0% |
| Signups | 720 | 18.0% |
| Active | 324 | 8.1% |
| Paid | 10 (9.72 unrounded) | 0.2% |

### Revenue/CAC output at the example defaults

| Output | Value |
|---|---|
| Paid users / month | 10 |
| Monthly recurring revenue | ₹4,364 |
| Est. LTV per paid user | ₹2,694 |
| CAC : LTV | — (spend = 0) |

### Benchmark comparison — where you stand vs. typical freemium ed-tech ranges

*Indicative ranges from general freemium/ed-tech benchmarking, not a guarantee for this niche — useful for spotting which stage is out of line, not as a target to hit exactly.*

| Stage | Your rate (example) | Typical range (India, freemium ed-tech) | Read |
|---|---:|---:|---|
| Visitor → signup | 18.0% | 15% – 30% | In range |
| Signup → active | 45.0% | 40% – 60% | In range |
| Active → paid | 3.0% | 2% – 6% | In range |

At these example inputs, all three stages sit inside their benchmark range — but **Active → paid** has the largest *relative* shortfall against its range midpoint (25% below midpoint, vs. 20% for signup and 10% for active), so the tool flags it as the weakest link:

> **Weakest link: Active → paid is furthest below the typical range — start there.**

### Before → after: fixing just the weakest stage by +2pt

| Scenario | Paid users/mo | MRR | Δ MRR / month |
|---|---:|---:|---:|
| Today | 10 | ₹4,364 | — |
| +2pt on Active → paid (3% → 5%) | 16 | ₹7,275 | +₹2,911 |

*(These are illustrative defaults only — replace every input with real numbers to get a real diagnosis.)*

---

## 04 · Competitive Landscape

Who's winning the searches this site should be winning. Every row below is a live, public listing or pricing page checked on 5 Sep 2026 — not estimates.

| Player | Public pricing | Social proof shown | Play Store app | Indexable pricing page |
|---|---|---|---|---|
| **TNPSC Mentors** | Not publicly visible | Not visible to an unauthenticated check | Not found | Not in sitemap |
| TNPSC Master | ₹299 / 3mo · ₹449 / 6mo · ₹599 / 12mo | "10,000+ students" on the pricing page itself | Not confirmed | Yes — /pricing |
| Testbook | Bundled subscription (not TNPSC-specific) | Large, established ed-tech brand | 2 apps — Group 1 & Group 2, separately | Yes |
| Entri App | Not confirmed in this check | Content hub + blog with dozens of TNPSC articles | Yes | Yes |
| Nithra / KalviApp / Yukthi / Aram (long tail) | Varies | Varies | Each has its own app | Varies |

The pattern across every competitor above: a dedicated pricing page that can rank and be shared, a stated proof-of-scale number, and app-store presence. tnpscmentors.in currently has none of the three, publicly.

---

## 05 · Prioritized Roadmap

Plotted by impact on the funnel vs. rough engineering/content effort. Low effort + high impact always goes first, regardless of tier — that's `TRUST-1`, `DIST-1` and `PRICE-1` here.

### Impact × Effort matrix (as plotted)

| Code | Impact (1–5) | Effort (1–5) | Priority tier |
|---|---:|---:|---|
| SEO-1 | 5 | 3 | Critical |
| DIST-1 | 5 | 2 | Critical |
| CONV-1 | 5 | 3 | Critical |
| SEO-2 | 4 | 3 | High |
| PRICE-1 | 4 | 2 | High |
| PARTNER-1 | 4 | 2 | High |
| TRUST-1 | 4 | 1 | High |
| SOCIAL-1 | 3 | 2 | Medium |
| MEAS-1 | 3 | 2 | Medium |

### Roadmap detail

| Code | Issue | What to change | Before → After | Priority |
|---|---|---|---|---|
| **SEO-1** | One page carries 7 keyword intents | Ship a dedicated, indexable landing page per product already named in your own schema: Group 2 test series, English test, Tamil test, PYQ+explanation, daily current affairs. | Before: 1 URL, 5 sitemap entries → After: 7+ ranking pages, each independently shareable | Critical |
| **DIST-1** | Native app built, not published under findable name | Submit the existing Capacitor build to Play Store and App Store as "TNPSC Mentors," ASO-optimized on the same keyword set as the site. | Before: 0 store listings → After: 2 listings competing on keywords 7 rivals already own | Critical |
| **CONV-1** | Free tier may fully satisfy visit intent | Once your funnel numbers confirm it: gate full-length timed mock exams with rank/percentile behind paid; keep PYQs + daily current affairs free as the acquisition hook. | Before: unclear paid wedge → After: a specific reason to upgrade, stated on the pricing page | Critical |
| **TRUST-1** | No visible proof-of-scale | State a real number on the homepage and pricing surfaces — users, tests attempted, or an average score/rank improvement claim. | Before: unverified → After: matches the "10,000+ students" pattern every competitor leads with | High |
| **PRICE-1** | No public, indexable pricing page | Add a server-visible or prerendered `/pricing` route so it can rank and be forwarded on WhatsApp/Telegram. | Before: pricing invisible pre-signup → After: pricing is a shareable, rankable URL | High |
| **SEO-2** | Identical title/description on every route | Prerender or SSR page-level `<title>`/meta so link previews are correct off-domain. | Before: every shared link shows the homepage card → After: each shared link previews correctly | High |
| **PARTNER-1** | No referral mechanism for a highly clustered audience | Add a referral code + WhatsApp-share incentive (e.g., 1 free month per 3 signups) — this audience already clusters in coaching centers and shares links constantly. | Before: no near-zero-CAC channel → After: word-of-mouth becomes trackable and rewarded | High |
| **SOCIAL-1** | Minimal social distribution (581 IG followers) | Daily current-affairs reel/short tied to the free tool as the hook, cross-posted to the existing Telegram + YouTube channels. | Before: 581 followers → After: compounding daily-content flywheel | Medium |
| **MEAS-1** | Consent-gated analytics undercounts real traffic | Log a privacy-safe first-party pageview count server-side (no PII) alongside consent-gated Clarity, so total traffic is known regardless of consent choice. | Before: Clarity shows a floor → After: true traffic volume is known | Medium |

---

## 06 · Marketing Strategy

Where to spend attention, channel by channel. Ordered by cost: the top row is near-free and matched to how this exact audience already behaves; paid acquisition is deliberately last, and gated on fixing the pricing/wedge problem first.

### SEO content clusters — *Owned · Free*
Turn the 7 products already named in your own structured data into 7 real, indexable landing pages, then feed them with a simple content cadence: subject-wise PYQ writeups, syllabus pages per exam group, "TNPSC current affairs today" updated daily.
- Directly fixes SEO-1
- Every YouTube/Instagram post gets a matching page to link to
- Compounds — each page keeps ranking after it's published

### Play Store / App Store ASO — *Owned · Free*
Publish the existing native build under an exact-match "TNPSC Mentors" title, keyword-rich short/long description, bilingual screenshots. Reviews become a second, compounding trust signal once live.
- Directly fixes DIST-1
- App-store search is an acquisition channel every real competitor already owns

### WhatsApp / Telegram nurture — *Owned · Free*
The Telegram channel already exists — use it as the daily free-value touchpoint (one current-affairs quiz a day) with a consistent, soft CTA toward the paid full mock exams once CONV-1 defines what those are.
- Matches how this audience already shares content
- Zero distribution cost per message

### YouTube — *Owned · Free*
TNPSC aspirants search YouTube directly for "previous year paper explained" content. Each video description links to the matching new SEO landing page — the two channels reinforce each other instead of competing.
- Channel already exists (@TNPSCMentors4you) — activate it, don't start from scratch

### Referral / campus-ambassador — *Owned · Free*
TNPSC aspirants cluster physically — coaching centers, library reading rooms, Tier-2/3 town study groups. A referral code with a real incentive turns that clustering into a near-zero-CAC channel instead of leaving it to chance.
- Directly fixes PARTNER-1
- Pairs naturally with the Telegram channel as the share surface

### Performance ads (Meta / Google) — *Paid · Phase 2/3 only*
Deliberately sequenced last. Spending on traffic into a funnel that has no indexable pricing page and no confirmed paid wedge (CONV-1) burns CAC on a leak that's already been identified — fix PRICE-1 and CONV-1 first, then this channel has something solid to convert against.
- The calculator above already models CAC:LTV once you have a spend number to test

---

## 07 · 30 / 60 / 90 — Sequencing, so nothing waits on everything else

### Days 1–30
- State a real proof-of-scale number on the homepage (TRUST-1)
- Ship a public `/pricing` route (PRICE-1)
- Submit the existing native app to Play Store + App Store (DIST-1)
- Add server-side pageview logging alongside Clarity (MEAS-1)

### Days 31–60
- Publish the 7 SEO landing pages (SEO-1)
- Fix per-route titles/meta so shared links unfurl correctly (SEO-2)
- Launch the referral/campus-ambassador program (PARTNER-1)
- Start a daily content cadence on Telegram/Instagram/YouTube (SOCIAL-1)

### Days 61–90
- Use the funnel data from days 1–60 to confirm and ship the paid wedge (CONV-1)
- Re-run the calculator above with real numbers to size a paid-ads budget
- Open performance ads only once PRICE-1 + CONV-1 are live

---

## 08 · Appendix — Send me these, and every number above becomes real

Everything in this report was built without logging into /superadmin or Clarity — both are behind your login, correctly. Pull these and the calculator, the benchmark comparison, and the roadmap priorities all get recalculated against your actual funnel instead of examples.

- [ ] Total registered users, and MAU/DAU if Superadmin tracks it
- [ ] Total paying users, and MRR if shown
- [ ] Current plan names and prices (all tiers)
- [ ] Clarity: traffic by channel, last 30 & 90 days (organic / direct / social / paid)
- [ ] Clarity: top 5 pages by traffic
- [ ] Clarity: top drop-off pages / rage-click & dead-click hotspots
- [ ] Device split — mobile vs. desktop sessions
- [ ] Signup form completion rate (started vs. finished)
- [ ] Checkout/payment abandonment rate, if visible in Razorpay/Supabase
- [ ] Refund requests — count and stated reasons, last 90 days
- [ ] A homepage + pricing-page screenshot (mobile), so Cause #3 can be confirmed
- [ ] YouTube/Telegram/Facebook follower & view counts, for a full social baseline

---

*Prepared as a public-evidence audit — figures marked "example" in the calculator are placeholders, not this business's real numbers. Re-run with real inputs for a real diagnosis.*
