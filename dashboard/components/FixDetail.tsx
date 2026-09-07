import Link from 'next/link';
import { Badge, List } from '@/components/ui';
import type { Fix, ExampleBlock, ExampleRow, Flaw } from '@/lib/types';

/**
 * A fix PROPOSAL panel: what to change, the before/after comparison, one
 * example, the expected result, today's baseline and the connected flaw.
 *
 * Priority is read from the connected flaw, never stored on the fix, so the
 * audit's P0/P1/P2 assignments stay the single source of truth. `before` cites
 * only confirmed findings; example blocks are illustrative and labelled as such.
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

/** A short arrow flow. Kept to one line per step so the change reads at a glance. */
function Flow({ steps, tone }: { steps: string[]; tone: 'before' | 'after' }) {
  return (
    <div className={'ba-flow ' + tone}>
      {steps.map((s, i) => (
        <span key={s}>
          <span className="ba-step">{s}</span>
          {i < steps.length - 1 ? <span className="ba-sep" aria-hidden="true">→</span> : null}
        </span>
      ))}
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
  /* One example block is enough to make the proposal concrete. */
  const example = fix.example.blocks.slice(0, 1);
  let n = 0;

  return (
    <>
      <Part n={++n} title="What to change">
        {fix.change.map((t, i) => <p key={i}>{t}</p>)}
      </Part>

      <Part n={++n} title="Before">
        <Flow steps={fix.before} tone="before" />
      </Part>

      <Part n={++n} title="After">
        <Flow steps={fix.after} tone="after" />
      </Part>

      <Part n={++n} title="Example">
        <div className="ex-wrap">
          <div className="ex-tag">ILLUSTRATIVE — a mock-up, not audit data</div>
          <div className="ex-blocks">
            {example.map((b, i) => <Block key={i} block={b} />)}
          </div>
        </div>
      </Part>

      <Part n={++n} title="Expected result">
        <List items={fix.outcome.slice(0, 2)} tight />
      </Part>

      {fix.baseline ? (
        <Part n={++n} title="Today">
          <div className="fix-baseline">{fix.baseline}</div>
        </Part>
      ) : null}

      <Part n={++n} title="Connected flaw">
        <Link href={`/flaws#flaw-${flaw.id}`} className="fix-link">
          <Badge kind={flaw.priority} />
          <span>Flaw {String(flaw.id).padStart(2, '0')} — {flaw.title}</span>
          <span className="fix-link-go" aria-hidden="true">→</span>
        </Link>
      </Part>
    </>
  );
}
