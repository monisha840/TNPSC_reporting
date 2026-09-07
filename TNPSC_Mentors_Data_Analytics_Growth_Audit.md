# TNPSC Mentors — End-to-End Data Analytics & Growth Audit

## Project Objective

**Application:** https://tnpscmentors.in/  
**Super Admin:** https://tnpscmentors.in/superadmin  
**Microsoft Clarity Project:** https://clarity.microsoft.com/projects/view/xinm0efx1o/dashboard

### Business Goal

The primary goal is to increase:

1. New users
2. User activation
3. Test engagement
4. User retention
5. Paid subscriptions
6. Revenue

The analysis must determine **why the application currently has relatively low active users, low paid conversion, and low overall conversion**, identify the root causes using evidence, and provide a professional, measurable growth plan.

---

# Analyst Role

Act as a **30+ year experienced Senior Product Data Analyst, Growth Analyst, CRO specialist, and SaaS Business Analyst**.

The work must be evidence-driven and must combine:

- Application/codebase analysis
- Database analysis
- Product analytics
- Funnel analysis
- Revenue analysis
- Retention/cohort analysis
- Microsoft Clarity behavioral analysis
- UX/CRO analysis
- Marketing analysis
- Business impact calculations

## Critical Rules

- **Do not modify production code during the initial audit.**
- Perform a **read-only audit first**.
- Do not fabricate metrics.
- Do not assume a feature exists without verifying it.
- Clearly distinguish:
  - FACT
  - OBSERVATION
  - HYPOTHESIS
  - RECOMMENDATION
  - TARGET / SCENARIO
- If a metric cannot be calculated from available data, explicitly state:
  **DATA NOT AVAILABLE**
- When data is unavailable, identify exactly what instrumentation/data is required.
- Historical scenarios must never be presented as actual results.
- Before making product or marketing recommendations, identify the actual funnel leakage and root causes.

---

# Current Super Admin Baseline

The current Super Admin dashboard visibly shows:

- Total users: **681**
- Active today: **0**
- Active in last 7 days: **15**
- Tests completed: **459**
- Tests abandoned: **161**
- Total questions: **49,916**
- Average rating: **4.33**
- Feedback received: **6**

These figures are an initial UI snapshot and must be validated against the underlying database/events before being used as definitive analytical metrics.

### Initial Signals to Investigate

#### 1. Low recent activity

15 active users in the last 7 days out of 681 total users is approximately:

**15 / 681 × 100 = 2.20%**

This is a strong signal of a possible activation/engagement/retention problem.

Do not automatically conclude this is the root cause. Validate:

- Definition of active user
- Date range
- Data freshness
- Login activity
- Test activity
- Session activity
- New vs returning users

#### 2. Test abandonment

Completed tests = 459  
Abandoned tests = 161

If these are directly comparable attempt-level events:

**Abandonment rate = 161 / (459 + 161) × 100 ≈ 26.0%**

Validate that the two metrics use the same population and definitions before treating 26% as the actual abandonment rate.

#### 3. Low feedback volume

Only 6 feedback submissions are visible.

Investigate whether:

- Users do not see the feedback mechanism
- Users do not have a reason to submit feedback
- Feedback collection is poorly positioned
- The user base is less engaged
- Feedback events are not being tracked correctly

---

# Core Growth Funnel

Build the complete funnel:

```text
TRAFFIC
   ↓
WEBSITE VISIT
   ↓
SIGNUP STARTED
   ↓
SIGNUP COMPLETED
   ↓
ACCOUNT CREATED
   ↓
ONBOARDING COMPLETED
   ↓
FIRST VALUE / FIRST TEST
   ↓
TEST STARTED
   ↓
TEST COMPLETED
   ↓
RETURNING USER
   ↓
PAID VALUE EXPOSED
   ↓
PRICING VIEWED
   ↓
CHECKOUT STARTED
   ↓
PAYMENT INITIATED
   ↓
PAYMENT SUCCESS
   ↓
PAID SUBSCRIPTION
   ↓
REPEAT USAGE
   ↓
RENEWAL
```

The objective is to identify exactly where the largest leakage occurs.

---

# Phase 1 — Understand the Complete Application

Perform a read-only inspection of the complete codebase.

Create an application architecture map covering:

## Public Experience

Identify actual existing pages/features such as:

- Home
- Courses
- Test Series
- Mock Exams
- Materials
- CA Magazine
- Pricing
- Login
- Registration
- Payment
- Other public pages

## Student/User Experience

Identify:

- Student dashboard
- Profile
- Tests
- Test Series
- Mock Exams
- Results
- Performance analytics
- Materials
- Courses
- Notifications
- Subscription
- Payment history
- Other student features

## Super Admin

Inspect and document:

- Overview
- Revenue
- Users
- Coupons
- Notify
- Feedback
- Reports
- Notes
- Mock Exams
- Test Series
- Vettri
- Materials
- CA Magazine
- Other admin functionality

For every feature document:

| Module | Purpose | User | Business Value | Conversion Role | Current State | Potential Friction |
|---|---|---|---|---|---|---|

Do not infer functionality without verifying the implementation.

---

# Phase 2 — Database Analysis

Inspect the database schema and historical data.

Identify available tables/data for:

- Users
- Registrations
- Authentication
- Login activity
- Sessions
- Tests
- Test attempts
- Test starts
- Test completions
- Test abandonment
- Questions
- Results
- Courses
- Materials
- Subscriptions
- Payments
- Payment failures
- Coupons
- Feedback
- Notifications
- Content usage
- Traffic/source attribution
- Analytics events
- Any other relevant data

For every metric determine:

1. Data source
2. Definition
3. Date range
4. Reliability
5. Calculation method
6. Limitations

Never fabricate missing data.

---

# Phase 3 — Funnel Analysis

Calculate wherever data exists:

## Acquisition

- Website visitors
- Landing page visitors
- Signup page visitors
- Signup starts
- Signup completions
- Registration conversion

## Activation

- Registered users
- Onboarding starts
- Onboarding completion
- First dashboard visit
- First test view
- First test start
- First test completion
- Activation rate

## Engagement

- DAU
- WAU
- MAU
- Tests per user
- Sessions per user
- Questions answered
- Content views
- Returning users

## Monetization

- Pricing page views
- Checkout starts
- Payment initiation
- Successful payments
- Failed payments
- Paid subscriptions
- Free-to-paid conversion
- Signup-to-paid conversion

## Retention

- D1 retention
- D7 retention
- D14 retention
- D30 retention
- Weekly retention
- Monthly retention
- Churn
- Renewal rate

For every stage calculate:

- Number of users
- Conversion rate
- Drop-off rate
- Trend
- Segment differences

---

# Phase 4 — User Segmentation

Do not treat all users as one group.

Segment users by:

## Activity

- Never active
- Registered but never tested
- Tested once
- Occasional users
- Regular users
- Highly engaged users

## Commercial State

- Free
- Paid
- Active subscription
- Expired
- Cancelled
- Renewed

## Exam Type

Where available:

- Group 1
- Group 2
- Group 2A
- Group 4
- VAO
- Other exams

## Acquisition

Where available:

- Organic
- Google
- Instagram
- Facebook
- YouTube
- WhatsApp
- Referral
- Direct
- Campaign/UTM source

## Device

- Mobile
- Tablet
- Desktop
- Browser
- OS

For each segment calculate:

- Users
- Activation
- Engagement
- Conversion
- Revenue
- Retention

Identify high-value and low-value segments.

---

# Phase 5 — Microsoft Clarity Behavioral Analysis

Use the TNPSC Mentors Microsoft Clarity project when access/data is available.

Analyze:

- Session recordings
- Heatmaps
- Scroll depth
- Dead clicks
- Rage clicks
- Navigation
- Page engagement
- Landing-page behavior
- Registration behavior
- Dashboard behavior
- Test behavior
- Checkout behavior
- Mobile behavior

## Landing Page Questions

Determine:

- Do users understand the product quickly?
- Is the value proposition clear?
- Which CTAs receive clicks?
- Where do users stop scrolling?
- Do users reach pricing?
- Do users click registration?
- Which sections are ignored?
- Which sections create engagement?

## Registration Questions

Determine:

- Where users abandon registration
- Which field causes friction
- Whether there are validation errors
- Whether there are unnecessary fields
- Whether users repeatedly attempt registration
- Whether mobile registration creates problems

## Dashboard Questions

Determine:

- Whether new users understand what to do next
- Whether users find tests quickly
- Whether important actions are visually obvious
- Whether users leave without taking a meaningful action

## Test Questions

Determine:

- Where tests are abandoned
- Time to abandonment
- Question-level friction where measurable
- Navigation confusion
- Technical issues
- Mobile usability problems

## Payment Questions

Determine:

- Pricing-page engagement
- Checkout starts
- Payment clicks
- Payment abandonment
- Payment failures
- Back-navigation
- Confusion/friction

---

# Phase 6 — Combine Database + Clarity

This is a key part of the analysis.

For every major funnel problem use:

```text
DATABASE METRIC
        +
CLARITY BEHAVIOR
        =
ROOT CAUSE HYPOTHESIS
```

Example:

```text
Database:
Signup → First Test activation = 25%

Clarity:
Users enter dashboard → browse → fail to find next action → leave

Hypothesis:
Poor first-time guidance/value discovery is contributing to low activation.
```

Every hypothesis should have a confidence level:

- HIGH
- MEDIUM
- LOW

Do not present hypotheses as facts.

---

# Phase 7 — Revenue & Monetization Analysis

Calculate:

## Revenue

- Total revenue
- Monthly revenue
- Weekly revenue
- Daily revenue where meaningful
- Revenue trend
- Revenue per paid user
- ARPU where appropriate
- Average order value

## Conversion

- Visitor → Signup
- Signup → Activation
- Activation → Test
- Test → Paid
- Signup → Paid
- Active User → Paid

## Payment Funnel

- Checkout viewed
- Checkout started
- Payment initiated
- Payment successful
- Payment failed
- Payment abandoned

## Subscription

- Active subscriptions
- Expired subscriptions
- Cancelled subscriptions
- Renewals
- Churn
- Renewal rate
- Plan-level performance

Identify whether monetization is constrained by:

- Low perceived value
- Weak pricing communication
- Poor paywall
- Poor CTA
- Checkout friction
- Payment failures
- Insufficient premium differentiation
- Lack of urgency
- Lack of trust/social proof
- Wrong audience
- Wrong product-market fit

All conclusions must be evidence-based.

---

# Phase 8 — Retention & Cohort Analysis

Calculate:

- D1 retention
- D7 retention
- D14 retention
- D30 retention

Create signup cohorts by:

- Week
- Month

Example:

| Signup Cohort | Users | Activated | Paid | Paid % | D7 Retention | D30 Retention |
|---|---:|---:|---:|---:|---:|---:|

Determine whether the major business problem is:

- Acquisition
- Activation
- Engagement
- Retention
- Monetization
- Or a combination

---

# Phase 9 — Root Cause Analysis

For every major problem create:

| Problem | Evidence | Metric | Root Cause Hypothesis | Clarity Evidence | Business Impact | Confidence |
|---|---|---|---|---|---|---|

Potential categories:

### Acquisition

- Low traffic
- Poor SEO
- Poor campaign targeting
- Weak content distribution
- Poor acquisition-source quality

### Activation

- Poor onboarding
- Unclear next step
- Weak first-value moment
- Complicated registration
- Lack of immediate free value

### Engagement

- Weak content discovery
- Poor test experience
- Lack of personalization
- Weak feedback loop

### Retention

- No habit loop
- Weak reminders
- No streaks
- No progress motivation
- Insufficient recurring value

### Monetization

- Weak paid differentiation
- Poor pricing presentation
- Checkout friction
- Lack of trust
- Poor payment UX
- Weak offers

---

# Phase 10 — Before / After Scenarios

For every high-priority recommendation provide:

## BEFORE

```text
Visitors
↓
Registrations
↓
Activated
↓
Test Users
↓
Paid Users
↓
Revenue
```

## CHANGE

Describe the exact proposed intervention.

## AFTER TARGET

Calculate a scenario using explicit assumptions.

Example:

```text
Before:
1,000 visitors
50 registrations
10 activated
2 paid

After target:
1,000 visitors
100 registrations
40 activated
10 paid
```

Calculate:

- Absolute improvement
- Relative improvement
- Percentage-point improvement
- Additional paid users
- Potential revenue impact

Clearly label all such numbers as:

**TARGET / SCENARIO**

Never present them as guaranteed outcomes.

---

# Phase 11 — Growth Opportunity Matrix

Create a prioritized matrix:

| Problem | Evidence | Impact | Effort | Confidence | Priority |
|---|---|---:|---:|---:|---|
| Example | Evidence | High | Low | High | P0 |

Priority definitions:

### P0 — Critical

Directly affecting user/revenue conversion.

### P1 — High

Significant growth or retention opportunity.

### P2 — Medium

Meaningful optimization opportunity.

### P3 — Nice to Have

Low urgency or cosmetic improvements.

---

# Phase 12 — Marketing Strategy

Marketing recommendations must come **after** funnel diagnosis.

Evaluate:

- SEO
- Google Ads
- Meta Ads
- Instagram
- YouTube
- WhatsApp
- Referral
- Influencers
- Free mock tests
- Lead magnets
- Exam-specific campaigns
- Retargeting
- Content marketing
- Community marketing

Do not recommend channels blindly.

For every marketing strategy define:

| Strategy | Target Audience | Offer | Channel | Funnel Stage | Why | KPI | Measurement |
|---|---|---|---|---|---|---|---|

Potential campaign concepts:

- Free mock test
- Free daily TNPSC quiz
- Free current affairs content
- Performance report
- Rank/leaderboard hook
- Exam-specific test series
- Limited-time subscription offer
- Referral reward
- WhatsApp re-engagement

Validate these against actual data before prioritizing.

---

# Phase 13 — Product / CRO Recommendations

Analyze and recommend improvements for:

- Landing page
- Registration
- Onboarding
- Dashboard
- Tests
- Results
- Performance
- Pricing
- Checkout
- Subscription
- Notifications
- Retention
- Mobile UX

For every recommendation provide:

```text
BEFORE
↓
PROBLEM
↓
CHANGE
↓
AFTER
↓
EXPECTED EFFECT
↓
METRIC TO MONITOR
```

Examples of possible interventions to evaluate:

- Stronger first-time onboarding
- Immediate free mock test
- Better CTA hierarchy
- Clear premium value
- Personalized dashboard
- Progress tracking
- Streaks
- Daily challenge
- Leaderboard
- Performance insights
- Exam-specific recommendations
- WhatsApp reminders
- Better checkout UX
- Better pricing communication
- Social proof

Do not implement these until evidence supports them.

---

# Phase 14 — Analytics Instrumentation

Identify missing tracking required for reliable analysis.

Create a GA4 + GTM + Clarity tracking plan.

## Recommended Events

```text
page_view

signup_started
signup_completed

login

onboarding_started
onboarding_completed

dashboard_viewed

test_viewed
test_started
test_question_answered
test_completed
test_abandoned

test_series_viewed
mock_exam_viewed

pricing_viewed

checkout_started
payment_initiated
payment_success
payment_failed

subscription_started
subscription_cancelled
subscription_expired
subscription_renewed

coupon_viewed
coupon_applied

material_viewed
course_viewed

notification_clicked
feedback_submitted
```

## Recommended Parameters

```text
exam_type
test_id
test_series_id
test_category
user_type
device_type
traffic_source
traffic_medium
campaign
subscription_plan
price
coupon_code
payment_method
```

For every event document:

| Event | Trigger | Parameters | User Properties | Business Question | Conversion? |
|---|---|---|---|---|---|

---

# Phase 15 — Growth Dashboard Specification

Design a professional Growth Command Center.

## Executive KPI Section

```text
TOTAL USERS
ACTIVE TODAY
DAU
WAU
MAU
NEW USERS
PAID USERS
REVENUE
```

## Funnel

```text
Visitors
↓
Signups
↓
Activated
↓
Test Users
↓
Completed Tests
↓
Pricing Views
↓
Checkout
↓
Payments
↓
Paid Users
```

Show:

- Volume
- Conversion %
- Drop-off %
- Trend

## Engagement

- DAU
- WAU
- MAU
- DAU/MAU
- Tests per user
- Completion rate
- Abandonment rate
- Questions answered
- Returning users

## Retention

- D1
- D7
- D14
- D30
- Cohort heatmap

## Revenue

- Total revenue
- Revenue trend
- Paid users
- Conversion rate
- AOV
- ARPU
- Churn
- Renewals

## Segmentation

- Exam
- Device
- Source
- Plan
- Activity level

## Problem Detection

Display:

```text
Metric
↓
Change
↓
Potential Cause
↓
Evidence
↓
Recommended Action
```

---

# Phase 16 — "Why?" Growth Engine

Where possible, the dashboard should not only show metrics.

Example:

```text
Signup → Paid Conversion
2.1% ↓ 18%
```

Potential contributing signals:

```text
1. Pricing-page abandonment increased 31%
2. Checkout errors increased 12%
3. New-user activation decreased 15%
4. Mobile conversion is materially lower
```

Then:

```text
RECOMMENDED ACTION

Prioritize:
1. Mobile checkout
2. Pricing communication
3. New-user onboarding
```

All causal statements must be appropriately labelled as evidence-based findings or hypotheses.

---

# Phase 17 — Final Professional Report

Produce a professional report containing:

## 1. Executive Summary

Answer:

- What is happening?
- Why is it happening?
- Where is the biggest leakage?
- What should be done first?
- What is the expected business opportunity?

## 2. Current Business Health

Summarize:

- Users
- Activity
- Engagement
- Tests
- Revenue
- Paid users
- Conversion
- Retention

## 3. Application Architecture

Complete application/module map.

## 4. User Funnel

Complete acquisition → activation → engagement → monetization funnel.

## 5. Acquisition Analysis

Traffic and source analysis.

## 6. Activation Analysis

Signup → first value.

## 7. Engagement Analysis

Tests, content, sessions, active users.

## 8. Retention Analysis

D1/D7/D14/D30 and cohorts.

## 9. Monetization Analysis

Pricing → checkout → payment → subscription.

## 10. Revenue Analysis

Revenue, AOV, ARPU, churn, renewals.

## 11. Clarity Behavioral Analysis

Behavioral evidence.

## 12. Root Cause Analysis

Facts + hypotheses + confidence.

## 13. User Segmentation

Identify high-value and low-value segments.

## 14. Cohort Analysis

Identify trends over time.

## 15. Biggest Problems

Rank by business impact.

## 16. P0/P1/P2/P3 Roadmap

Prioritized action plan.

## 17. Before/After Scenarios

Quantified scenarios.

## 18. Marketing Strategy

Evidence-based acquisition and conversion strategy.

## 19. Product/CRO Strategy

Evidence-based product improvements.

## 20. Analytics Instrumentation

GA4/GTM/Clarity tracking plan.

## 21. Growth Dashboard Specification

Dashboard requirements.

## 22. 30-Day Action Plan

Immediate actions.

## 23. 60-Day Action Plan

Growth experiments and product improvements.

## 24. 90-Day Action Plan

Scale successful initiatives.

---

# 30-Day / 60-Day / 90-Day Framework

## Days 1–30 — Diagnose + Fix Critical Leakage

Focus on:

- Tracking accuracy
- Funnel visibility
- Signup conversion
- Activation
- First-value experience
- Major UX blockers
- Checkout/payment issues
- Basic re-engagement

## Days 31–60 — Optimize + Experiment

Focus on:

- CRO experiments
- Pricing tests
- Onboarding experiments
- Free-to-paid mechanisms
- Retention loops
- Notifications
- WhatsApp re-engagement
- Exam-specific campaigns

## Days 61–90 — Scale

Focus on:

- Best-performing acquisition channels
- High-value exam segments
- Retargeting
- Referral
- Content engine
- Subscription optimization
- Automation
- Growth dashboard
- Continuous experimentation

---

# KPI Tree

The ultimate KPI structure should be:

```text
                         REVENUE
                            │
                ┌───────────┴───────────┐
                │                       │
            PAID USERS             REVENUE / USER
                │
          ┌─────┴─────┐
          │           │
     CONVERSION     RETENTION
          │
     ┌────┴────┐
     │         │
 ACTIVATION  TRAFFIC
     │
 ┌───┴────┐
 │        │
SIGNUP  FIRST VALUE
```

The goal is to identify which branch is limiting revenue.

---

# Most Important Analytical Principle

Do not start with:

> "We need more users."

Instead ask:

```text
Do we have enough traffic?
        ↓
Do visitors sign up?
        ↓
Do users activate?
        ↓
Do users experience value?
        ↓
Do users return?
        ↓
Do users see the paid value?
        ↓
Do users start checkout?
        ↓
Do payments succeed?
        ↓
Do users subscribe?
        ↓
Do they renew?
```

The correct intervention depends on the biggest measurable bottleneck.

---

# Final Deliverable

At the end, provide:

## TOP 10 ACTIONS MOST LIKELY TO INCREASE PAID USERS

Rank every action using:

**Expected Impact × Confidence ÷ Effort**

For each action provide:

1. Problem
2. Evidence
3. Root cause
4. Proposed change
5. Priority
6. Effort
7. Expected impact
8. KPI
9. Measurement method
10. Before scenario
11. After target scenario
12. Owner/team
13. Recommended timeline

The final output must allow the product/business team to answer:

> **"What is preventing TNPSC Mentors from growing, what evidence proves it, what should we change first, how much could it improve, and how will we know whether the change worked?"**
