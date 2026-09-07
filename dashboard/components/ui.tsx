import type { ReactNode } from 'react';

/* ------------------------------------------------------------------ badges */

const badgeClass = (kind: string) => 'badge b-' + kind.replace(/[^A-Za-z0-9]/g, '');

export function Badge({ kind, children }: { kind: string; children?: ReactNode }) {
  return <span className={badgeClass(kind)}>{children ?? kind}</span>;
}

/** Evidence badge — colours by the leading tag, prints the compound label. */
export function EvidenceBadge({ tag }: { tag: string }) {
  const lead = tag.split('+')[0].trim().split(' ')[0];
  return <span className={badgeClass(lead)}>{tag}</span>;
}

/* --------------------------------------------------- "data not available" */

const GAP = /DATA NOT AVAILABLE|UNMEASURABLE|not run|not computed|unrecoverable|^PENDING/i;

/** Renders a value, marking it when it is an admission rather than a number. */
export function Value({ children }: { children: string | number | null | undefined }) {
  const s = String(children ?? '');
  return GAP.test(s) ? <span className="na">{s}</span> : <>{s}</>;
}

/* ------------------------------------------------------------------ layout */

export function PageHead({ title, sub, children }: {
  title: string; sub?: ReactNode; children?: ReactNode;
}) {
  return (
    <div className="page-head">
      <h1>{title}</h1>
      {sub ? <div className="sub">{sub}</div> : null}
      {children}
    </div>
  );
}

export function H2({ children }: { children: ReactNode }) {
  return <h2 className="sec">{children}</h2>;
}

export function Card({ title, children, className }: {
  title?: ReactNode; children: ReactNode; className?: string;
}) {
  return (
    <div className={'card' + (className ? ' ' + className : '')}>
      {title ? <h3>{title}</h3> : null}
      {children}
    </div>
  );
}

export function Callout({ kind = 'accent', title, children }: {
  kind?: 'accent' | 'danger' | 'warn' | 'good'; title: string; children: ReactNode;
}) {
  return (
    <div className={'callout ' + (kind === 'accent' ? '' : kind)}>
      <div className="ct">{title}</div>
      {children}
    </div>
  );
}

export function List({ items, tight }: { items: ReactNode[]; tight?: boolean }) {
  return (
    <ul className={'clean' + (tight ? ' tight' : '')}>
      {items.map((t, i) => <li key={i}>{t}</li>)}
    </ul>
  );
}

/* ------------------------------------------------------------------ tables */

export interface Col { t: string; num?: boolean; calc?: boolean; k?: boolean }

export function DataTable({ cols, rows, note }: {
  cols: Col[]; rows: ReactNode[][]; note?: ReactNode;
}) {
  return (
    <div className="tw">
      <table>
        <thead>
          <tr>{cols.map((c, i) => <th key={i} className={c.num ? 'num' : undefined}>{c.t}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((r, ri) => (
            <tr key={ri}>
              {r.map((cell, ci) => {
                const c = cols[ci] ?? ({} as Col);
                const cls = c.num ? 'num' : c.calc ? 'calc' : c.k ? 'k' : undefined;
                return <td key={ci} className={cls}>{cell}</td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>
      {note ? <div className="t-note">{note}</div> : null}
    </div>
  );
}

/* ------------------------------------------------------------- misc blocks */

export function EvRow({ left, children }: { left: ReactNode; children: ReactNode }) {
  return <div className="ev-row"><div>{left}</div><div>{children}</div></div>;
}

export function Metric({ value, label, bad }: { value: string; label: string; bad?: boolean }) {
  return (
    <div className={'metric' + (bad ? ' bad' : '')}>
      <div className="v">{value}</div>
      <div className="l">{label}</div>
    </div>
  );
}
