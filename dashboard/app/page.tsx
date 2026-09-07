import Link from 'next/link';
import { D } from '@/lib/data';
import { PageHead, H2, Metric, Badge } from '@/components/ui';

/**
 * Overview — the landing page. Answers "what is happening, how bad is it, what
 * do I look at next" in 10–20 seconds. Every number is the verified production
 * figure already in the audit model; nothing is recalculated here.
 */

/** The highest-impact findings, in the order a reader should meet them. */
const TOP = [1, 2, 4, 6, 8];

export default function OverviewPage() {
  const byId = new Map(D.FLAWS.map((f) => [f.id, f]));
  const b = (key: string) => D.BASELINE.find((x) => x.key === key)!;

  return (
    <>
      <PageHead title="TNPSC Mentors — Growth Audit">
        <div className="meta-line">
          <div><b>Audit period</b>{D.AUDIT.periodStart} → {D.AUDIT.periodEnd}</div>
          <div><b>Production snapshot</b>{D.AUDIT.prodSnapshot}</div>
          <div><b>Compiled</b>{D.AUDIT.compiled}</div>
        </div>
      </PageHead>

      <div className="diagnosis">
        <div className="dlabel">Headline diagnosis</div>
        <div className="dmain">
          Users are arriving, but too few are activating, returning, or converting into
          paying customers.
        </div>
        <div className="dsub">
          <p>
            Acquisition is growing — 366 people registered in the last 30 days. In that same
            window, none of them paid anything.
          </p>
          <p>
            One paying customer is recorded across the whole audit period, carrying{' '}
            <strong>₹899</strong> of all-time revenue. The founder has confirmed that customer
            was internally generated, and three further <code>paid</code> records are staff
            comps at ₹0 — so <strong>externally-acquired paying customers: 0</strong>. The ₹899
            demonstrates that the payment pipeline works end to end. It is not evidence of
            product-market fit.
          </p>
        </div>
      </div>

      <H2>Verified production figures</H2>
      <div className="metrics">
        <Metric value={b('registered').value} label="Registered Users" />
        <Metric value={b('started').value} label="Started a Test" />
        <Metric value={b('completed').value} label="Completed a Test" />
        <Metric value={b('returned').value} label="Returned on a Second Day" bad />
        <Metric value={b('payingCustomers').value} label="Genuine Paying Customer" bad />
        <Metric value={b('revenue').value} label="All-Time Revenue" bad />
      </div>
      <p style={{ fontSize: 12, color: 'var(--c-muted)' }}>
        Read-only <code>SELECT</code> against production, snapshot {D.AUDIT.prodSnapshot}. The
        single paying customer and the ₹899 are founder-generated; externally-acquired paying
        customers is 0. Full stage-by-stage detail is on the{' '}
        <Link href="/funnel">User Funnel</Link>.
      </p>

      <H2>Where the product is breaking</H2>
      <div className="pri-list">
        {TOP.map((id, i) => {
          const f = byId.get(id)!;
          return (
            <Link
              href={`/flaws#flaw-${f.id}`}
              key={f.id}
              className="pri-row"
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <span className="pn">{String(i + 1).padStart(2, '0')}</span>
              <span>
                <span className="pt">{f.title}</span>{' '}
                <Badge kind={f.priority} />
                <div className="pw" style={{ marginTop: 3 }}>{f.oneLiner}</div>
              </span>
              <span className="pw" style={{ textAlign: 'right' }}>Flaw #{f.id} →</span>
            </Link>
          );
        })}
      </div>
      <p style={{ fontSize: 12, color: 'var(--c-muted)', marginTop: 10 }}>
        These are five of the fourteen documented flaws, selected by impact. The funnel
        describes <em>what</em> happened; the flaws set out <em>why we believe</em> it is
        happening, with the evidence and the confidence attached to each claim.
      </p>

      <div className="cta-row">
        <Link href="/funnel" className="cta primary">View User Funnel</Link>
        <Link href="/flaws" className="cta">View All 14 Flaws</Link>
      </div>
    </>
  );
}
