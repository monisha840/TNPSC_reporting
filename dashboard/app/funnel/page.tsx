import Link from 'next/link';
import { D } from '@/lib/data';
import { PageHead, H2, Card, Callout, List, Badge } from '@/components/ui';

export const metadata = { title: 'User Funnel' };

/**
 * The verified journey, 682 → 1. Conversion percentages are shown only between
 * stages where the audit establishes a valid nested denominator. The checkout
 * stage is presented separately because no such denominator exists for it.
 */

interface Step {
  n: string; label: string; note?: string; width: number; terminal?: boolean;
  conv?: { pct: string; calc: string; drop?: string };
}

const STEPS: Step[] = [
  { n: '682', label: 'Registered', note: 'Every account row ever created — profiles', width: 100,
    conv: { pct: '50.6%', calc: '345 / 682', drop: '337 registered users did not start a test' } },
  { n: '345', label: 'Started ≥1 test', note: 'Distinct users in test_sessions', width: 50.6,
    conv: { pct: '82.9%', calc: '286 / 345', drop: '59 started but did not complete' } },
  { n: '286', label: 'Completed ≥1 test', note: '41.9% of all 682 registered users', width: 41.9,
    conv: { pct: '5.6%', calc: '16 / 286', drop: '270 completers were not observed returning' } },
  { n: '16', label: 'Returned on a second day', note: 'Users with 2+ distinct activity dates — a FLOOR, see caveat below', width: 2.3 },
];

const CHECKOUT: Step[] = [
  { n: '11', label: 'Reached checkout', note: '11 distinct users · 20 created payment attempts', width: 1.6 },
  { n: '1', label: 'Genuine paying customer', note: '₹899 all-time revenue · founder-generated', width: 0.5, terminal: true },
];

function Steps({ steps }: { steps: Step[] }) {
  return (
    <>
      {steps.map((s) => (
        <div key={s.label}>
          <div className={'fstep' + (s.terminal ? ' terminal' : '')}>
            <div className="fnum">{s.n}</div>
            <div>
              <div className="flab">{s.label}</div>
              {s.note ? <div className="fnote">{s.note}</div> : null}
            </div>
          </div>
          <div
            className={'fbar' + (s.terminal ? ' terminal' : '')}
            style={{ width: `calc(${Math.max(s.width, 0.6)}% - 0px)`, maxWidth: 'calc(100% - 126px)' }}
          />
          {s.conv ? (
            <div className="fconv">
              <b>{s.conv.pct}</b> &nbsp;<span style={{ fontFamily: 'var(--mono)' }}>{s.conv.calc}</span>
              {s.conv.drop ? <> &nbsp;·&nbsp; {s.conv.drop}</> : null}
            </div>
          ) : null}
        </div>
      ))}
    </>
  );
}

export default function FunnelPage() {
  return (
    <>
      <PageHead
        title="User funnel"
        sub="The verified journey from registration to payment. Every stage states its own denominator, and the two stages with no data source at all are marked rather than filled in."
      />

      <div className="funnel">
        <Steps steps={STEPS} />

        <div className="fbreak">
          <Badge kind="GAP">DATA GAP</Badge>{' '}
          <strong>Pricing viewed — DATA NOT AVAILABLE.</strong> Pricing views are not instrumented
          on the in-app pricing screen, so it is unknown how many of the 682 ever saw a plan. The
          checkout stage below therefore has no denominator, and the 11 checkout users are{' '}
          <strong>not</strong> established as a subset of the 16 returners — no query has run that
          overlap. No percentage is shown across this boundary.
        </div>

        <Steps steps={CHECKOUT} />
      </div>

      <H2>Checkout</H2>
      <Card>
        <div style={{ display: 'flex', gap: 36, flexWrap: 'wrap', marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 24, fontWeight: 700, fontFamily: 'var(--mono)' }}>11</div>
            <div style={{ fontSize: 12, color: 'var(--c-muted)' }}>checkout users</div>
          </div>
          <div>
            <div style={{ fontSize: 24, fontWeight: 700, fontFamily: 'var(--mono)' }}>20</div>
            <div style={{ fontSize: 12, color: 'var(--c-muted)' }}>checkout attempts</div>
          </div>
          <div>
            <div style={{ fontSize: 24, fontWeight: 700, fontFamily: 'var(--mono)' }}>1</div>
            <div style={{ fontSize: 12, color: 'var(--c-muted)' }}>completed payment</div>
          </div>
        </div>
        <p style={{ fontSize: 13, color: 'var(--c-muted)', maxWidth: '80ch' }}>
          These are payment rows and attempts identified in production. A <code>created</code> row
          is written server-side only after a confirmation dialog showing the plan and final price,
          so each one evidences checkout intent at an accepted price. But{' '}
          <strong>created/uncompleted payment rows should not automatically be described as
          confirmed user abandonment</strong> unless the payment lifecycle semantics establish
          that — and in this schema a created row that is never completed has no defined terminal
          state. One person alone accounts for 5 of the 20.
        </p>
        <p style={{ fontSize: 13, color: 'var(--c-muted)', maxWidth: '80ch', marginTop: 10 }}>
          Adding the one completed payment to the 20 gives 21 total price-accepted attempts.
          Separately, four <code>paid</code> records exist: three are staff comps at ₹0 and the
          fourth is the ₹899 founder-generated customer. Comp grants write a synthetic order ID
          straight to <code>paid</code> and never produce a <code>created</code> row, which is why
          the two figures reconcile at 21 rather than 24.
        </p>
      </Card>

      <H2>Main observed drop-offs</H2>
      <div className="pri-list">
        <div className="pri-row">
          <span className="pn">01</span>
          <span>
            <span className="pt">Registration → first test</span>
            <div className="pw" style={{ marginTop: 3 }}>
              337 registered users did not start a test. 337 / 682 = 49.4% — the largest absolute
              loss in the funnel.
            </div>
          </span>
          <span className="pw" style={{ textAlign: 'right' }}>
            <Link href="/flaws#flaw-5">Flaws #4, #5 →</Link>
          </span>
        </div>
        <div className="pri-row">
          <span className="pn">02</span>
          <span>
            <span className="pt">Test completion → return</span>
            <div className="pw" style={{ marginTop: 3 }}>
              Only 16 users were observed returning on a second active day. 16 / 286 = 5.6% of
              test-completers — the largest proportional loss.
            </div>
          </span>
          <span className="pw" style={{ textAlign: 'right' }}>
            <Link href="/flaws#flaw-6">Flaw #6 →</Link>
          </span>
        </div>
        <div className="pri-row">
          <span className="pn">03</span>
          <span>
            <span className="pt">Checkout → payment</span>
            <div className="pw" style={{ marginTop: 3 }}>
              Only 1 genuine paying customer is recorded, and that customer was founder-generated.
              Externally-acquired paying customers: 0.
            </div>
          </span>
          <span className="pw" style={{ textAlign: 'right' }}>
            <Link href="/flaws#flaw-8">Flaws #1, #2, #8 →</Link>
          </span>
        </div>
      </div>

      <Callout kind="warn" title="What this page does and does not claim">
        <p>
          The funnel describes <strong>what</strong> happened. It does not establish{' '}
          <strong>why</strong>. Causal explanations live in the{' '}
          <Link href="/flaws">14 Flaws</Link>, each carrying its own evidence and confidence —
          and several of them remain explicitly labelled as hypotheses.
        </p>
      </Callout>

      <H2>Denominator rules</H2>
      <Card>
        <List items={D.FUNNEL_CAVEATS} />
      </Card>

      <H2>Measurement caveats carried by these numbers</H2>
      <Card>
        <List items={D.RETENTION.caveats} />
      </Card>
    </>
  );
}
