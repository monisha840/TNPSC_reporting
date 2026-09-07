-- =====================================================================
-- TNPSC MENTORS — STAGE 3 MANUAL QUERY SET (SCREENSHOT-FRIENDLY)
-- =====================================================================
-- Run these in the self-hosted Supabase Studio SQL editor at
-- https://db.tnpscmentors.in
--
-- ALL QUERIES ARE SELECT-ONLY. Nothing here writes, alters, or deletes.
--
-- Run ONE query at a time (highlight the block, press Run), then
-- screenshot the result — or better, use the Results panel's Export ->
-- CSV button if it's available.
--
-- Label each screenshot with its query number (Q1, Q2, ...) so I can
-- match results to questions without ambiguity.
--
-- If a query errors (a column doesn't exist in your schema), just send
-- me the error text and skip to the next one — that error is itself a
-- useful finding.
-- =====================================================================


-- =====================================================================
-- Q1 — MASTER METRIC VALIDATION  ★ HIGHEST PRIORITY
-- Validates every Super Admin dashboard number against raw data,
-- including the UTC-vs-IST active-user correction.
-- Returns ~16 rows, 2 columns (metric | value).
-- =====================================================================
select 'total_users' as metric, count(*)::text as value from public.profiles
union all select 'active_today_UTC (dashboard method)', (select count(distinct user_id)::text from public.daily_activity where activity_date = current_date)
union all select 'active_today_IST (corrected)', (select count(distinct user_id)::text from public.daily_activity where activity_date = (now() at time zone 'Asia/Kolkata')::date)
union all select 'active_7d_UTC (dashboard method)', (select count(distinct user_id)::text from public.daily_activity where activity_date >= current_date - 6)
union all select 'active_7d_IST (corrected)', (select count(distinct user_id)::text from public.daily_activity where activity_date >= ((now() at time zone 'Asia/Kolkata')::date) - 6)
union all select 'active_30d_IST', (select count(distinct user_id)::text from public.daily_activity where activity_date >= ((now() at time zone 'Asia/Kolkata')::date) - 29)
union all select 'tests_completed', (select count(*)::text from public.test_sessions where status = 'completed')
union all select 'tests_abandoned', (select count(*)::text from public.test_sessions where status = 'abandoned')
union all select 'tests_in_progress (never finalised)', (select count(*)::text from public.test_sessions where status = 'in_progress')
union all select 'total_questions (all rows)', (select count(*)::text from public.questions)
union all select 'feedback_count', (select count(*)::text from public.app_feedback)
union all select 'avg_rating', (select coalesce(round(avg(rating),2),0)::text from public.app_feedback)
union all select 'PAID USERS (distinct, all plans)', (select count(distinct user_id)::text from public.payments where status = 'paid')
union all select 'paid orders (all plans)', (select count(*)::text from public.payments where status = 'paid')
union all select 'REVENUE all-time (paise)', (select coalesce(sum(amount),0)::text from public.payments where status = 'paid')
union all select 'failed payments', (select count(*)::text from public.payments where status = 'failed')
union all select 'earliest signup', (select min(created_at)::text from public.profiles)
union all select 'latest signup', (select max(created_at)::text from public.profiles);


-- =====================================================================
-- Q2 — THE FUNNEL  ★ HIGHEST PRIORITY
-- Signup -> first test -> completion -> return -> paid.
-- Returns 5 rows, 2 columns.
-- =====================================================================
with base as (
  select p.id,
    (select min(ts.started_at) from public.test_sessions ts where ts.user_id = p.id) as first_started,
    (select min(ts.started_at) from public.test_sessions ts where ts.user_id = p.id and ts.status = 'completed') as first_completed,
    (select count(distinct da.activity_date) from public.daily_activity da where da.user_id = p.id) as active_days,
    exists(select 1 from public.payments pay where pay.user_id = p.id and pay.status = 'paid') as is_paid
  from public.profiles p
)
select '1. signed up' as stage, count(*)::text as users from base
union all select '2. started >=1 test', (select count(*)::text from base where first_started is not null)
union all select '3. completed >=1 test', (select count(*)::text from base where first_completed is not null)
union all select '4. returned (2+ active days)', (select count(*)::text from base where active_days >= 2)
union all select '5. PAID', (select count(*)::text from base where is_paid);


-- =====================================================================
-- Q3 — FREE vs PAID BEHAVIOUR  ★ HIGHEST PRIORITY
-- The core "what do payers do differently" analysis.
-- Returns 2 rows (false = never paid, true = paid).
-- =====================================================================
with paid_users as (select distinct user_id from public.payments where status = 'paid'),
agg as (
  select p.id,
    (p.id in (select user_id from paid_users)) as is_paid,
    (select count(*) from public.test_sessions ts where ts.user_id = p.id) as started,
    (select count(*) from public.test_sessions ts where ts.user_id = p.id and ts.status='completed') as completed,
    (select count(*) from public.test_sessions ts where ts.user_id = p.id and ts.status='abandoned') as abandoned,
    (select coalesce(sum(ts.attempted),0) from public.test_sessions ts where ts.user_id = p.id) as questions_answered,
    (select count(distinct da.activity_date) from public.daily_activity da where da.user_id = p.id) as active_days
  from public.profiles p
)
select is_paid,
  count(*) as users,
  round(avg(started),2) as avg_tests_started,
  round(avg(completed),2) as avg_tests_completed,
  round(avg(abandoned),2) as avg_abandoned,
  round(avg(questions_answered),1) as avg_questions,
  round(avg(active_days),2) as avg_active_days
from agg group by is_paid order by is_paid;


-- =====================================================================
-- Q4 — REVENUE BY PLAN  ★ HIGHEST PRIORITY
-- Real revenue from the ledger, per plan.
-- =====================================================================
select
  coalesce(notes->>'plan','(no plan tag)') as plan,
  count(*) filter (where status='paid') as buyers,
  sum(amount) filter (where status='paid') as revenue_paise,
  count(*) filter (where status='failed') as failed,
  count(*) filter (where status='created') as stuck_created,
  count(*) filter (where status='paid' and coupon_id is not null) as used_coupon
from public.payments
group by 1 order by revenue_paise desc nulls last;


-- =====================================================================
-- Q5 — PAYMENT FUNNEL / LEAKAGE
-- =====================================================================
select 'payment rows total' as metric, count(*)::text as value from public.payments
union all select 'created (never completed)', (select count(*)::text from public.payments where status='created')
union all select 'paid', (select count(*)::text from public.payments where status='paid')
union all select 'failed', (select count(*)::text from public.payments where status='failed')
union all select 'success rate %', (select round(100.0*count(*) filter (where status='paid')/nullif(count(*),0),1)::text from public.payments)
union all select 'failure rate %', (select round(100.0*count(*) filter (where status='failed')/nullif(count(*),0),1)::text from public.payments)
union all select 'value stuck in failed (paise)', (select coalesce(sum(amount),0)::text from public.payments where status='failed')
union all select 'value stuck in created (paise)', (select coalesce(sum(amount),0)::text from public.payments where status='created');


-- =====================================================================
-- Q6 — ABANDONMENT BY TEST CATEGORY
-- Tests whether paid formats can even register abandonment.
-- =====================================================================
select
  category,
  count(*) filter (where status='completed') as completed,
  count(*) filter (where status='abandoned') as abandoned,
  count(*) filter (where status='in_progress') as in_progress,
  round(100.0*count(*) filter (where status='completed')
    / nullif(count(*) filter (where status in ('completed','abandoned')),0),1) as completion_pct,
  round(avg(attempted) filter (where status='abandoned'),1) as avg_qs_before_quit
from public.test_sessions
group by category
order by (count(*)) desc;


-- =====================================================================
-- Q7 — TARGET GROUP (which audience actually pays)
-- =====================================================================
select
  coalesce(p.target_group,'(none set)') as target_group,
  count(*) as users,
  count(*) filter (where exists(select 1 from public.payments pay where pay.user_id=p.id and pay.status='paid')) as paid_users,
  round(100.0*count(*) filter (where exists(select 1 from public.payments pay where pay.user_id=p.id and pay.status='paid'))/nullif(count(*),0),2) as paid_pct,
  coalesce((select sum(pay.amount) from public.payments pay join public.profiles p2 on p2.id=pay.user_id
            where pay.status='paid' and coalesce(p2.target_group,'(none set)')=coalesce(p.target_group,'(none set)')),0) as revenue_paise
from public.profiles p
group by p.target_group
order by users desc;


-- =====================================================================
-- Q8 — RETENTION (overall D1/D7/D14/D30)
-- =====================================================================
with c as (select id as user_id, created_at::date as signup_date from public.profiles)
select 'cohort size (all users)' as metric, count(*)::text as value from c
union all select 'D1 retained', (select count(distinct c.user_id)::text from c join public.daily_activity a on a.user_id=c.user_id and a.activity_date = c.signup_date + 1)
union all select 'D7 retained', (select count(distinct c.user_id)::text from c join public.daily_activity a on a.user_id=c.user_id and a.activity_date = c.signup_date + 7)
union all select 'D14 retained', (select count(distinct c.user_id)::text from c join public.daily_activity a on a.user_id=c.user_id and a.activity_date = c.signup_date + 14)
union all select 'D30 retained', (select count(distinct c.user_id)::text from c join public.daily_activity a on a.user_id=c.user_id and a.activity_date = c.signup_date + 30)
union all select 'active on signup day (D0)', (select count(distinct c.user_id)::text from c join public.daily_activity a on a.user_id=c.user_id and a.activity_date = c.signup_date);


-- =====================================================================
-- Q9 — ENGAGEMENT DISTRIBUTION (how many are one-and-done)
-- =====================================================================
select
  case
    when active_days = 0 then '0 - never active'
    when active_days = 1 then '1 day only'
    when active_days between 2 and 6 then '2-6 days'
    when active_days between 7 and 20 then '7-20 days'
    else '21+ days'
  end as engagement_bucket,
  count(*) as users
from (
  select p.id, coalesce((select count(distinct da.activity_date) from public.daily_activity da where da.user_id=p.id),0) as active_days
  from public.profiles p
) t
group by 1 order by 1;


-- =====================================================================
-- Q10 — SIGNUP TREND BY MONTH (is growth accelerating or dying?)
-- =====================================================================
select
  to_char(date_trunc('month', created_at), 'YYYY-MM') as month,
  count(*) as signups
from public.profiles
group by 1 order by 1;


-- =====================================================================
-- Q11 — COUPON / PROMOTER PERFORMANCE
-- (If the coupons table has different column names, send me the error.)
-- =====================================================================
select
  c.code,
  count(p.id) filter (where p.status='paid') as paid_redemptions,
  coalesce(sum(p.amount) filter (where p.status='paid'),0) as revenue_paise,
  coalesce(sum(p.discount_amount) filter (where p.status='paid'),0) as discount_given_paise
from public.coupons c
left join public.payments p on p.coupon_id = c.id
group by c.code
order by paid_redemptions desc;


-- =====================================================================
-- Q12 — THE FEEDBACK TEXT (qualitative signal nobody has read yet)
-- =====================================================================
select rating, page, message, created_at
from public.app_feedback
order by created_at desc;
