-- =====================================================================
-- TNPSC MENTORS — STAGE 3 READ-ONLY QUERY PACK
-- =====================================================================
-- EVERY query below is SELECT-only. None of them INSERT, UPDATE, DELETE,
-- ALTER, CREATE, DROP, or call any mutating RPC. They are safe to paste,
-- one block at a time, into the Supabase SQL editor (read-only) against
-- the TNPSC Mentors production project, or to run through a read-only
-- Postgres role / replica if one exists.
--
-- Run a section, copy the result grid, paste it back — that's all that's
-- needed to turn Stage 3 from a query pack into a real, numbers-backed
-- report. Every query is commented with which Stage-3 section it answers.
--
-- Schema assumptions below are taken from the read-only codebase audit
-- (Stage 2): profiles, test_sessions, test_answers, questions, payments,
-- coupons, app_feedback, daily_activity, review_items, audit_log.
-- If a table/column name here doesn't match production, that's useful
-- information too — note the error and skip to the next block.
-- =====================================================================


-- =====================================================================
-- SECTION 2 — SCHEMA / ROW COUNTS / DATE RANGES
-- =====================================================================

-- 2a. Row counts and date ranges for every core table
select 'profiles' as table_name, count(*) as row_count,
       min(created_at) as earliest, max(created_at) as latest
from public.profiles
union all
select 'test_sessions', count(*), min(started_at), max(started_at)
from public.test_sessions
union all
select 'test_answers', count(*), min(created_at), max(created_at)
from public.test_answers
union all
select 'questions', count(*), min(created_at), max(created_at)
from public.questions
union all
select 'payments', count(*), min(created_at), max(created_at)
from public.payments
union all
select 'coupons', count(*), min(created_at), max(created_at)
from public.coupons
union all
select 'app_feedback', count(*), min(created_at), max(created_at)
from public.app_feedback
union all
select 'daily_activity', count(*), min(activity_date::timestamptz), max(activity_date::timestamptz)
from public.daily_activity
union all
select 'review_items', count(*), min(created_at), max(created_at)
from public.review_items;

-- 2b. Signup method — Supabase Auth natively records the provider per
-- identity (email/password vs google), independent of the app's own
-- client-side analytics. This answers Section 12 directly from auth data.
select identities.provider, count(distinct u.id) as users
from auth.users u
join auth.identities identities on identities.user_id = u.id
group by identities.provider
order by users desc;


-- =====================================================================
-- SECTION 3 — USER FUNNEL
-- =====================================================================
-- NOTE: "Visitors," "signup started," "pricing viewed," "checkout started"
-- have NO database row — they live only in GA4/GTM/Meta (Stage 2 finding).
-- These queries can only ever populate the DB-backed stages below;
-- everything upstream must explicitly stay "DATA NOT AVAILABLE."

-- 3a. Signup completed (a DB row exists the moment `profiles` is inserted)
select count(*) as signups_completed from public.profiles;

-- 3b. First test started / completed per user, and the gap between signup and first test
with first_test as (
  select user_id, min(started_at) as first_started,
         min(started_at) filter (where status = 'completed') as first_completed
  from public.test_sessions
  group by user_id
)
select
  count(*) filter (where first_started is not null) as users_started_a_test,
  count(*) filter (where first_completed is not null) as users_completed_a_test,
  round(avg(extract(epoch from (ft.first_started - p.created_at)) / 3600.0)
        filter (where ft.first_started is not null), 1) as avg_hours_signup_to_first_test
from public.profiles p
left join first_test ft on ft.user_id = p.id;

-- 3c. Returning user (>=2 distinct activity days)
select count(*) as returning_users
from (
  select user_id from public.daily_activity
  group by user_id having count(distinct activity_date) >= 2
) t;

-- 3d. Paid user (>=1 row with status='paid')
select count(distinct user_id) as paid_users
from public.payments
where status = 'paid';

-- 3e. Full funnel in one shot (signup -> first test -> returning -> paid)
with base as (
  select p.id as user_id, p.created_at,
         (select min(ts.started_at) from public.test_sessions ts where ts.user_id = p.id) as first_test_started,
         (select min(ts.started_at) from public.test_sessions ts where ts.user_id = p.id and ts.status = 'completed') as first_test_completed,
         (select count(distinct da.activity_date) from public.daily_activity da where da.user_id = p.id) as active_days,
         exists(select 1 from public.payments pay where pay.user_id = p.id and pay.status = 'paid') as is_paid
  from public.profiles p
)
select
  count(*) as signup_completed,
  count(*) filter (where first_test_started is not null) as first_test_started,
  count(*) filter (where first_test_completed is not null) as first_test_completed,
  count(*) filter (where active_days >= 2) as returning_user,
  count(*) filter (where is_paid) as paid_user
from base;


-- =====================================================================
-- SECTION 4 — ACTIVATION ANALYSIS
-- =====================================================================

-- 4a. New users by week (signup trend)
select date_trunc('week', created_at) as signup_week, count(*) as new_users
from public.profiles
group by 1 order by 1;

-- 4b. Completed-test buckets per user (1, 2+, 5+, 10+) and payment status
with completed_counts as (
  select user_id, count(*) filter (where status = 'completed') as completed_tests
  from public.test_sessions
  group by user_id
), paid_flags as (
  select user_id, true as is_paid from public.payments where status = 'paid' group by user_id
)
select
  count(*) filter (where cc.completed_tests >= 1) as users_1plus,
  count(*) filter (where cc.completed_tests >= 2) as users_2plus,
  count(*) filter (where cc.completed_tests >= 5) as users_5plus,
  count(*) filter (where cc.completed_tests >= 10) as users_10plus,
  count(*) filter (where cc.completed_tests >= 1 and pf.is_paid) as users_1plus_and_paid,
  count(*) filter (where cc.completed_tests >= 5 and pf.is_paid) as users_5plus_and_paid
from public.profiles p
left join completed_counts cc on cc.user_id = p.id
left join paid_flags pf on pf.user_id = p.id;


-- =====================================================================
-- SECTION 5 — FREE vs PAID BEHAVIOURAL COMPARISON
-- =====================================================================

with paid_users as (
  select distinct user_id from public.payments where status = 'paid'
),
agg as (
  select
    p.id as user_id,
    (p.id in (select user_id from paid_users)) as is_paid,
    p.target_group,
    p.created_at as signup_at,
    (select count(*) from public.test_sessions ts where ts.user_id = p.id) as tests_started,
    (select count(*) from public.test_sessions ts where ts.user_id = p.id and ts.status = 'completed') as tests_completed,
    (select count(*) from public.test_sessions ts where ts.user_id = p.id and ts.status = 'abandoned') as tests_abandoned,
    (select coalesce(sum(ts.attempted),0) from public.test_sessions ts where ts.user_id = p.id) as questions_answered,
    (select count(distinct da.activity_date) from public.daily_activity da where da.user_id = p.id) as active_days,
    (select min(pay.created_at) from public.payments pay where pay.user_id = p.id and pay.status = 'paid') as first_paid_at
  from public.profiles p
)
select
  is_paid,
  count(*) as users,
  round(avg(tests_started), 2) as avg_tests_started,
  round(avg(tests_completed), 2) as avg_tests_completed,
  round(avg(tests_abandoned), 2) as avg_tests_abandoned,
  round(avg(questions_answered), 1) as avg_questions_answered,
  round(avg(active_days), 2) as avg_active_days,
  round(avg(extract(epoch from (first_paid_at - signup_at)) / 3600.0) filter (where is_paid), 1) as avg_hours_signup_to_payment
from agg
group by is_paid;

-- 5b. Target-group split within paid vs free
select target_group,
       count(*) filter (where user_id in (select user_id from public.payments where status='paid')) as paid,
       count(*) as total
from public.profiles
group by target_group
order by total desc;


-- =====================================================================
-- SECTION 6 — PAID PLAN BREAKDOWN (verify revenue directly from the ledger)
-- =====================================================================

select
  notes->>'plan' as plan_id,
  count(*) filter (where status = 'paid') as successful_payments,
  count(*) filter (where status = 'created') as pending_created,
  count(*) filter (where status = 'failed') as failed_payments,
  sum(amount) filter (where status = 'paid') as gross_revenue_paise,
  round(avg(amount) filter (where status = 'paid')) as avg_order_value_paise,
  count(*) filter (where status = 'paid' and coupon_id is not null) as paid_with_coupon,
  sum(discount_amount) filter (where status = 'paid') as total_discount_paise,
  count(distinct provider) as providers_seen
from public.payments
group by notes->>'plan'
order by gross_revenue_paise desc nulls last;

-- 6b. Revenue contribution % by plan (run after 6a, or as one CTE)
with plan_rev as (
  select notes->>'plan' as plan_id, sum(amount) as rev
  from public.payments where status = 'paid'
  group by notes->>'plan'
)
select plan_id, rev,
       round(100.0 * rev / sum(rev) over (), 1) as pct_of_total_revenue
from plan_rev
order by rev desc;


-- =====================================================================
-- SECTION 7 — PAYMENT FUNNEL / REVENUE LEAKAGE
-- =====================================================================

select
  count(*) as total_payment_rows,
  count(*) filter (where status = 'created') as created_only,
  count(*) filter (where status = 'paid') as paid,
  count(*) filter (where status = 'failed') as failed,
  round(100.0 * count(*) filter (where status = 'paid') / nullif(count(*), 0), 1) as pct_success,
  round(100.0 * count(*) filter (where status = 'failed') / nullif(count(*), 0), 1) as pct_failed,
  round(100.0 * count(*) filter (where status = 'created') / nullif(count(*), 0), 1) as pct_stuck_created,
  sum(amount) filter (where status = 'failed') as revenue_at_risk_in_failed_paise
from public.payments;

-- 7b. Failure rate by plan (identifies "highest failure plan")
select notes->>'plan' as plan_id,
       count(*) filter (where status='failed') as failed,
       count(*) as total,
       round(100.0 * count(*) filter (where status='failed') / nullif(count(*),0), 1) as failure_pct
from public.payments
group by notes->>'plan'
order by failure_pct desc nulls last;


-- =====================================================================
-- SECTION 8 — RETENTION & COHORTS (D1/D7/D14/D30, free vs paid)
-- =====================================================================

with cohort as (
  select p.id as user_id, date_trunc('week', p.created_at) as signup_week, p.created_at::date as signup_date,
         (p.id in (select user_id from public.payments where status='paid')) as is_paid
  from public.profiles p
),
activity as (
  select user_id, activity_date from public.daily_activity
)
select
  c.signup_week,
  c.is_paid,
  count(distinct c.user_id) as cohort_size,
  count(distinct a.user_id) filter (where a.activity_date = c.signup_date + 1) as d1_retained,
  count(distinct a.user_id) filter (where a.activity_date = c.signup_date + 7) as d7_retained,
  count(distinct a.user_id) filter (where a.activity_date = c.signup_date + 14) as d14_retained,
  count(distinct a.user_id) filter (where a.activity_date = c.signup_date + 30) as d30_retained
from cohort c
left join activity a on a.user_id = c.user_id
group by c.signup_week, c.is_paid
order by c.signup_week, c.is_paid;

-- 8b. One-time vs returning vs highly engaged (by distinct active days, all-time)
select
  case
    when active_days = 0 then 'never active'
    when active_days = 1 then 'one-time'
    when active_days between 2 and 6 then 'occasional (2-6 days)'
    when active_days between 7 and 20 then 'regular (7-20 days)'
    else 'highly engaged (21+ days)'
  end as engagement_bucket,
  count(*) as users
from (
  select p.id, coalesce((select count(distinct da.activity_date) from public.daily_activity da where da.user_id = p.id), 0) as active_days
  from public.profiles p
) t
group by 1
order by 2 desc;


-- =====================================================================
-- SECTION 9 — TEST BEHAVIOUR & ABANDONMENT BY CATEGORY
-- =====================================================================

select
  category,
  count(*) filter (where status = 'completed') as completed,
  count(*) filter (where status = 'abandoned') as abandoned,
  round(100.0 * count(*) filter (where status='completed')
        / nullif(count(*) filter (where status in ('completed','abandoned')), 0), 1) as completion_pct,
  round(avg(attempted) filter (where status='abandoned'), 1) as avg_questions_attempted_before_abandon,
  round(avg(time_taken_seconds) filter (where status='abandoned'), 0) as avg_seconds_before_abandon
from public.test_sessions
group by category
order by (count(*) filter (where status='abandoned')) desc;

-- 9b. Confirms/refutes whether abandonment tracking covers paid formats
-- (expect zero or near-zero abandoned rows for mock/vettri/testseries/rankbooster categories)
select category, status, count(*)
from public.test_sessions
where category in ('mock','vettri','testseries','testseries_g2')
group by category, status
order by category, status;


-- =====================================================================
-- SECTION 10 — TARGET GROUP ANALYSIS
-- =====================================================================

with by_group as (
  select p.id, p.target_group,
         (p.id in (select user_id from public.payments where status='paid')) as is_paid,
         coalesce((select count(distinct da.activity_date) from public.daily_activity da where da.user_id=p.id),0) as active_days
  from public.profiles p
),
revenue_by_group as (
  select p.target_group, sum(pay.amount) as revenue
  from public.payments pay
  join public.profiles p on p.id = pay.user_id
  where pay.status = 'paid'
  group by p.target_group
)
select
  bg.target_group,
  count(*) as registered_users,
  count(*) filter (where bg.active_days > 0) as active_users,
  count(*) filter (where bg.is_paid) as paid_users,
  round(100.0 * count(*) filter (where bg.is_paid) / nullif(count(*),0), 2) as paid_conversion_pct,
  round(avg(bg.active_days), 2) as avg_active_days,
  coalesce(rg.revenue, 0) as revenue_paise
from by_group bg
left join revenue_by_group rg on rg.target_group = bg.target_group
group by bg.target_group, rg.revenue
order by revenue_paise desc nulls last;


-- =====================================================================
-- SECTION 11 — ACQUISITION ATTRIBUTION
-- =====================================================================
-- Expected result: NO utm_source / utm_medium / utm_campaign / referrer
-- column exists anywhere in this schema (confirmed by exhaustive grep in
-- Stage 2). This query will error with "column does not exist" — that
-- error IS the finding. Do not add the column to make it work; just
-- record the confirmation.
-- select utm_source, utm_medium, utm_campaign from public.profiles limit 1;

-- 11b. What DOES exist: coupon/promoter attribution (a real, if partial, acquisition signal)
select
  c.code as coupon_code, c.owner_name as promoter, -- adjust column name if different in production
  count(*) filter (where p.status = 'paid') as paid_conversions,
  sum(p.amount) filter (where p.status = 'paid') as revenue_paise,
  sum(p.discount_amount) filter (where p.status = 'paid') as discount_given_paise
from public.coupons c
left join public.payments p on p.coupon_id = c.id
group by c.code, c.owner_name
order by revenue_paise desc nulls last;


-- =====================================================================
-- SECTION 12 — SIGNUP METHOD x ACTIVATION x PAYMENT
-- =====================================================================

with method as (
  select u.id as user_id, i.provider
  from auth.users u
  join auth.identities i on i.user_id = u.id
)
select
  m.provider,
  count(distinct p.id) as signups,
  count(distinct p.id) filter (where exists(select 1 from public.test_sessions ts where ts.user_id=p.id and ts.status='completed')) as activated,
  count(distinct p.id) filter (where exists(select 1 from public.payments pay where pay.user_id=p.id and pay.status='paid')) as paid
from public.profiles p
join method m on m.user_id = p.id
group by m.provider
order by signups desc;


-- =====================================================================
-- SECTION 13 — COUPON / PROMOTER PERFORMANCE (fuller version of 11b)
-- =====================================================================

select
  c.code,
  c.discount_type, c.percent, c.flat, c.max_discount, c.max_redemptions, c.active,
  count(*) filter (where p.status='paid') as redemptions_paid,
  sum(p.amount) filter (where p.status='paid') as revenue_paise,
  sum(p.discount_amount) filter (where p.status='paid') as discount_paise,
  sum(p.amount) filter (where p.status='paid') - sum(p.discount_amount) filter (where p.status='paid') as net_after_discount_paise
from public.coupons c
left join public.payments p on p.coupon_id = c.id
group by c.code, c.discount_type, c.percent, c.flat, c.max_discount, c.max_redemptions, c.active
order by revenue_paise desc nulls last;


-- =====================================================================
-- SECTION 14 — FEEDBACK / TRUST
-- =====================================================================

select
  count(*) as total_feedback,
  round(avg(rating), 2) as avg_rating,
  count(*) filter (where rating = 5) as five_star,
  count(*) filter (where rating = 4) as four_star,
  count(*) filter (where rating = 3) as three_star,
  count(*) filter (where rating <= 2) as two_star_or_below
from public.app_feedback;

-- 14b. The actual text — this is qualitative signal no prior report read
select rating, message, page, created_at
from public.app_feedback
order by created_at desc;


-- =====================================================================
-- SECTION 16 — ACTIVE-USER METRIC VALIDATION (IST correction, READ-ONLY —
-- this does NOT modify get_platform_metrics(), it independently computes
-- the corrected number for side-by-side comparison)
-- =====================================================================

select
  (select count(distinct user_id) from public.daily_activity
     where activity_date = current_date) as dashboard_style_active_today_utc,
  (select count(distinct user_id) from public.daily_activity
     where activity_date = (now() at time zone 'Asia/Kolkata')::date) as corrected_active_today_ist,
  (select count(distinct user_id) from public.daily_activity
     where activity_date >= current_date - 6) as dashboard_style_active_7d_utc,
  (select count(distinct user_id) from public.daily_activity
     where activity_date >= ((now() at time zone 'Asia/Kolkata')::date) - 6) as corrected_active_7d_ist;


-- =====================================================================
-- SECTION 17 — FULL DASHBOARD METRIC VALIDATION (run once, compare to
-- the live Super Admin Overview screen at the same moment)
-- =====================================================================

select jsonb_build_object(
  'totalUsers_raw', (select count(*) from public.profiles),
  'activeToday_raw_utc', (select count(distinct user_id) from public.daily_activity where activity_date = current_date),
  'activeToday_corrected_ist', (select count(distinct user_id) from public.daily_activity where activity_date = (now() at time zone 'Asia/Kolkata')::date),
  'active7d_raw_utc', (select count(distinct user_id) from public.daily_activity where activity_date >= current_date - 6),
  'active7d_corrected_ist', (select count(distinct user_id) from public.daily_activity where activity_date >= ((now() at time zone 'Asia/Kolkata')::date) - 6),
  'testsCompleted_raw', (select count(*) from public.test_sessions where status='completed'),
  'testsAbandoned_raw', (select count(*) from public.test_sessions where status='abandoned'),
  'totalQuestions_raw', (select count(*) from public.questions),
  'totalQuestions_active_only', (select count(*) from public.questions where active),
  'feedbackCount_raw', (select count(*) from public.app_feedback),
  'avgRating_raw', (select round(coalesce(avg(rating),0)::numeric,2) from public.app_feedback),
  'paidUsers_all_plans', (select count(distinct user_id) from public.payments where status='paid'),
  'premiumActive_annual_only', (select count(distinct user_id) from public.payments
      where status='paid' and notes->>'plan'='premium_annual' and created_at >= now() - interval '1 year'),
  'revenueAllTime_paise', (select coalesce(sum(amount),0) from public.payments where status='paid'),
  'failedPayments_raw', (select count(*) from public.payments where status='failed')
) as metric_validation_snapshot;


-- =====================================================================
-- END OF QUERY PACK
-- =====================================================================
-- Paste each block's result grid back, in order, and Stage 3 can be
-- completed as a real, numbers-backed report rather than a template.
-- =====================================================================
