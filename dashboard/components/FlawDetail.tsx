import { Badge, EvidenceBadge, List, DataTable, EvRow, Value } from '@/components/ui';
import Expander from '@/components/Expander';
import type { Flaw } from '@/lib/types';

/**
 * The flaw panel.
 *
 * MAIN VIEW  — an eight-part executive brief, ~230–280 visible words, condensed
 *              from the audit content and capped for scannability.
 * TECHNICAL  — the complete A–Q audit record, collapsed by default but present
 *              in the HTML so nothing is lost to find-in-page or printing.
 *
 * Recommended fixes, implementation direction and success metrics are not rendered
 * here — the Fixes section carries the proposals. The underlying data remains intact
 * in `lib/data-flaws-*.mjs` and in the generated Markdown and CSV deliverables.
 */

function Part({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section className="part">
      <h4><span className="pn">{n}</span>{title}</h4>
      <div className="pbody">{children}</div>
    </section>
  );
}

function EvidenceLine({ tag, text }: { tag: string; text: string }) {
  return (
    <li className="ev-line">
      <EvidenceBadge tag={tag} />
      <span className="ev-arrow" aria-hidden="true">→</span>
      <span>{text}</span>
    </li>
  );
}

export default function FlawDetail({ flaw }: { flaw: Flaw }) {
  const b = flaw.brief;

  return (
    <>
      {/* ---------------------------------------------------- 1. THE PROBLEM */}
      <Part n={1} title="The problem">
        {b.problem.map((t, i) => <p key={i}>{t}</p>)}
      </Part>

      {/* -------------------------------------------------------- 2. EVIDENCE */}
      <Part n={2} title="Evidence">
        <ul className="ev-list">
          {b.evidence.map((e, i) => <EvidenceLine key={i} tag={e.tag} text={e.text} />)}
        </ul>
      </Part>

      {/* -------------------------------------------------- 3. WHY IT MATTERS */}
      <Part n={3} title="Why it matters">
        <List items={b.why} tight />
      </Part>

      {/* ------------------------------------------------------ 4. ROOT CAUSE */}
      <Part n={4} title="Root cause">
        <div className="rc-split">
          <div className="rc-box">
            <div className="rct"><Badge kind="CONFIRMED" /> Confirmed</div>
            <List items={b.confirmed} tight />
          </div>
          <div className="rc-box hyp">
            <div className="rct"><Badge kind="HYPOTHESIS" /> Hypothesis</div>
            <List items={b.hypothesis} tight />
          </div>
        </div>
      </Part>

      {/* ---------------------------------------------------------- 5. IMPACT */}
      <Part n={5} title="Impact">
        <div className="chips">
          {b.metrics.map((m) => (
            <div className="chip-m" key={m.label}>
              <div className="cl">{m.label}</div>
              <div className="cv"><Value>{m.value}</Value></div>
              {m.sub ? <div className="cs">{m.sub}</div> : null}
            </div>
          ))}
        </div>
      </Part>

      {/* --------------------------------------------------- 6. HOW WE CHECKED */}
      <Part n={6} title="How we checked">
        <ul className="ev-list">
          {b.checked.map((c, i) => <EvidenceLine key={i} tag={c.tag} text={c.text} />)}
        </ul>
      </Part>

      {/* ---------------------------------------------------- 7. AUDIT STATUS */}
      <Part n={7} title="Audit status">
        <div className="status-row">
          <span><b>Evidence</b> {flaw.evidenceStatus}</span>
          <span><b>Root cause</b> {flaw.rootCauseStatus}</span>
          <span><b>Confidence</b> {flaw.confidence.split(' ')[0].toUpperCase()}</span>
          <span><b>Priority</b> <Badge kind={flaw.priority} /></span>
        </div>
      </Part>

      {/* ---------------------------------------------------------- 8. SOURCE */}
      <Part n={8} title="Source">
        <div className="src-chips">
          {b.sources.map((s) => <span className="src-chip" key={s}>{s}</span>)}
        </div>
      </Part>

      {/* ------------------------------------------------ TECHNICAL DETAILS */}
      <Expander label="View technical details" id={`tech-${flaw.id}`}>
        <div className="tech">
          <h5>Executive summary</h5>
          {flaw.A_summary.map((t, i) => <p key={i}>{t}</p>)}

          <h5>What is wrong — in full</h5>
          <List items={flaw.B_flaw} />

          <h5>Why it matters — in full</h5>
          <List items={flaw.C_why} />

          <h5>Complete evidence ({flaw.D_evidence.length} items)</h5>
          {flaw.D_evidence.map((e, i) => (
            <EvRow key={i} left={<EvidenceBadge tag={e.tag} />}>{e.text}</EvRow>
          ))}

          <h5>Underlying audit findings consolidated into this flaw</h5>
          <div className="trace">
            {flaw.underlying.map((u) => (
              <div className="trace-item" key={u.id}>
                <span className="tid">{u.id}</span>
                <span>{u.text}</span>
                <EvidenceBadge tag={u.tag} />
              </div>
            ))}
          </div>

          <h5>Full methodology</h5>
          <List items={flaw.E_howChecked} />

          <h5>Detailed calculations</h5>
          <DataTable
            cols={[
              { t: 'Metric', k: true }, { t: 'Calculation', calc: true }, { t: 'Value', num: true },
            ]}
            rows={flaw.F_numbers.map((n) => [n.label, n.calc, <Value>{n.value}</Value>])}
            note="No percentage is shown without its denominator."
          />

          <h5>Affected users and caveats</h5>
          <EvRow left={<strong>Number affected</strong>}><Value>{flaw.G_affected.count}</Value></EvRow>
          <EvRow left={<strong>Percentage</strong>}><Value>{flaw.G_affected.pct}</Value></EvRow>
          <EvRow left={<strong>Funnel stage</strong>}>{flaw.G_affected.stage}</EvRow>
          <EvRow left={<strong>Caveat</strong>}>{flaw.G_affected.note}</EvRow>

          <h5>Root cause — full statements</h5>
          <div className="rc-split">
            <div className="rc-box">
              <div className="rct"><Badge kind="CONFIRMED" /> Confirmed</div>
              <List items={flaw.H_rootCause.confirmed} tight />
            </div>
            <div className="rc-box hyp">
              <div className="rct"><Badge kind="HYPOTHESIS" /> Hypothesis — unproven</div>
              <List items={flaw.H_rootCause.hypothesis} tight />
            </div>
          </div>

          <h5>What the user experiences</h5>
          <List items={flaw.I_userImpact} />

          <h5>Business impact</h5>
          <List items={flaw.J_businessImpact} />

          <h5>Affected product areas</h5>
          <List items={flaw.K_devImpact} />

          <h5>Confidence — in full</h5>
          <p>{flaw.P_confidence}</p>

          <h5>Full source references</h5>
          <List items={flaw.Q_source} tight />
        </div>
      </Expander>
    </>
  );
}
