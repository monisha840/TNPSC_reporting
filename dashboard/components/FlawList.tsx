'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Accordion of the 14 flaws. The detail panels are rendered on the server and
 * passed in as children, so the whole audit body is still in the static HTML —
 * expanding only toggles visibility.
 */
export interface FlawRow {
  id: number;
  title: string;
  priority: 'P0' | 'P1' | 'P2';
  oneLiner: string;
  detail: React.ReactNode;
}

export default function FlawList({ flaws }: { flaws: FlawRow[] }) {
  const [open, setOpen] = useState<Set<number>>(new Set());
  const pathname = usePathname();

  /* Deep links from other pages arrive as /flaws#flaw-3 — open that one. */
  useEffect(() => {
    const m = window.location.hash.match(/^#flaw-(\d+)$/);
    if (!m) return;
    const id = Number(m[1]);
    setOpen((prev) => new Set(prev).add(id));
    document.getElementById('flaw-' + id)?.scrollIntoView({ block: 'start' });
  }, [pathname]);

  const toggle = (id: number) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });

  const allOpen = open.size === flaws.length;

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 10 }}>
        <button
          className="btn"
          onClick={() => setOpen(allOpen ? new Set() : new Set(flaws.map((f) => f.id)))}
        >
          {allOpen ? 'Collapse all' : 'Expand all'}
        </button>
      </div>

      <div className="flaws">
        {flaws.map((f) => {
          const isOpen = open.has(f.id);
          return (
            <div className="flaw" key={f.id} id={'flaw-' + f.id}>
              <button
                className="flaw-head"
                onClick={() => toggle(f.id)}
                aria-expanded={isOpen}
                aria-controls={'flaw-body-' + f.id}
              >
                <span className={'badge b-' + f.priority}>{f.priority}</span>
                <span className="fnum">{String(f.id).padStart(2, '0')}</span>
                <span>
                  <h3>{f.title}</h3>
                  <span className="fline">{f.oneLiner}</span>
                </span>
                <span className="fopen">{isOpen ? 'Hide ▲' : 'View Evidence ▼'}</span>
              </button>

              <div
                className="flaw-body"
                id={'flaw-body-' + f.id}
                hidden={!isOpen}
              >
                {f.detail}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
