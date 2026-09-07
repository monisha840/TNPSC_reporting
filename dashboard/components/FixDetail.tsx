import Link from 'next/link';
import { Badge, List } from '@/components/ui';
import type { Fix, ExampleBlock, ExampleRow, Flaw } from '@/lib/types';

/**
 * A fix PROPOSAL panel. Nothing here has been built.
 *
 * Priority is read from the connected flaw, never stored on the fix, so the
 * audit's own P0/P1/P2 assignments stay the single source of truth.
 *
 * Everything inside an EXAMPLE block is an illustrative mock-up of a proposed
 * screen and is labelled as such — those numbers are not audit data. Measured
 * figures appear only under "Today", quoted from the audit model.
 */

function Row({ row }: { row: ExampleRow }) {
  switch (row.kind) {
    case 'stat':   return <div className="ex-stat">{row.text}</div>;
    case 'strike': return <div className="ex-strike">{row.text}</div>;
    case 'label':  return <div className="ex-label">{row.text}</div>;
    case 'muted':  return <div className="ex-muted">{row.text}</div>;
    case 'cta':    return <div className="ex-cta">{row.text}</div>;
    case 'chip':   return <div><span className="ex-chip">{row.text}</span></div>;
    case 'locked': return <div className="ex-locked"><span aria-hidden="true">🔒</span> {row.text}</div>;
    case 'field':  return <div className="ex-field" aria-hidden="true" />;
    case 'chips':
      return (
        <div className="ex-chiprow">
          {(row.items ?? []).map((c) => <span className="ex-chip" key={c}>{c}</span>)}
        </div>
      );
    default:       return <div className="ex-line">{row.text}</div>;
  }
}

function Block({ block }: { block: ExampleBlock }) {
  if (block.type === 'screen') {
    return (
      <div className="ex-screen">
        {block.caption ? <div className="ex-cap">{block.caption}</div> : null}
        {block.rows.map((r, i) => <Row key={i} row={r} />)}
      </div>
    );
  }
  if (block.type === 'map') {
    return (
      <div className="ex-map">
        {block.pairs.map(([from, to]) => (
          <div className="ex-pair" key={from}>
            <span className="ex-from">{from}</span>
            <span className="ex-arrow" aria-hidden="true">→</span>
            <span className="ex-to">{to}</span>
          </div>
        ))}
      </div>
    );
  }
  if (block.type === 'flow') {
    return (
      <div className="ex-flow">
        {block.steps.map((s, i) => (
          <span key={s}>
            <span className="ex-step">{s}</span>
            {i < block.steps.length - 1 ? <span className="ex-sep" aria-hidden="true">→</span> : null}
          </span>
        ))}
      </div>
    );
  }
  return (
    <div className="ex-screen">
      <List items={block.items} tight />
    </div>
  );
}

function Part({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section className="part">
      <h4><span className="pn">{n}</span>{title}</h4>
      <div className="pbody">{children}</div>
    </section>
  );
}

export default function FixDetail({ fix, flaw }: { fix: Fix; flaw: Flaw }) {
  return (
    <>
      <Part n={1} title="What we should change">
        {fix.change.map((t, i) => <p key={i}>{t}</p>)}
      </Part>

      <Part n={2} title="How it should work">
        <div className="ex-flow steps">
          {fix.flow.map((s, i) => (
            <span key={s}>
              <span className="ex-step">{s}</span>
              {i < fix.flow.length - 1 ? <span className="ex-sep" aria-hidden="true">↓</span> : null}
            </span>
          ))}
        </div>
      </Part>

      <Part n={3} title="Example">
        <div className="ex-wrap">
          <div className="ex-tag">ILLUSTRATIVE — a mock-up of the proposed screen, not audit data</div>
          {fix.example.caption ? <div className="ex-cap top">{fix.example.caption}</div> : null}
          <div className="ex-blocks">
            {fix.example.blocks.map((b, i) => <Block key={i} block={b} />)}
          </div>
        </div>
      </Part>

      <Part n={4} title="Expected outcome">
        <List items={fix.outcome} tight />
      </Part>

      {fix.baseline ? (
        <Part n={5} title="Today">
          <div className="fix-baseline">{fix.baseline}</div>
        </Part>
      ) : null}

      {fix.caveat ? (
        <Part n={fix.baseline ? 6 : 5} title="Important">
          <div className="fix-caveat">{fix.caveat}</div>
        </Part>
      ) : null}

      <Part n={(fix.baseline ? 6 : 5) + (fix.caveat ? 1 : 0)} title="Connected flaw">
        <Link href={`/flaws#flaw-${flaw.id}`} className="fix-link">
          <Badge kind={flaw.priority} />
          <span>
            Flaw {String(flaw.id).padStart(2, '0')} — {flaw.title}
          </span>
          <span className="fix-link-go" aria-hidden="true">→</span>
        </Link>
        <p className="fix-oneliner">{flaw.oneLiner}</p>
      </Part>
    </>
  );
}
