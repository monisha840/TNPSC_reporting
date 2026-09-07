'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Accordion of the 14 fix proposals. The panels are rendered on the server and
 * merely hidden, so the whole proposal set is in the static HTML — find-in-page
 * and printing reach it whether or not a card has been opened.
 */
export interface FixRow {
  id: number;
  title: string;
  priority: 'P0' | 'P1' | 'P2';
  proposed: string;
  detail: React.ReactNode;
}

export default function FixList({ fixes }: { fixes: FixRow[] }) {
  const [open, setOpen] = useState<Set<number>>(new Set());
  const pathname = usePathname();

  /* Deep links arrive as /fixes#fix-3 — open that one. */
  useEffect(() => {
    const m = window.location.hash.match(/^#fix-(\d+)$/);
    if (!m) return;
    const id = Number(m[1]);
    setOpen((prev) => new Set(prev).add(id));
    document.getElementById('fix-' + id)?.scrollIntoView({ block: 'start' });
  }, [pathname]);

  const toggle = (id: number) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });

  const allOpen = open.size === fixes.length;

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 10 }}>
        <button
          className="btn"
          onClick={() => setOpen(allOpen ? new Set() : new Set(fixes.map((f) => f.id)))}
        >
          {allOpen ? 'Collapse all' : 'Expand all'}
        </button>
      </div>

      <div className="flaws">
        {fixes.map((f) => {
          const isOpen = open.has(f.id);
          return (
            <div className="flaw" key={f.id} id={'fix-' + f.id}>
              <button
                className="flaw-head"
                onClick={() => toggle(f.id)}
                aria-expanded={isOpen}
                aria-controls={'fix-body-' + f.id}
              >
                <span className={'badge b-' + f.priority}>{f.priority}</span>
                <span className="fnum">{String(f.id).padStart(2, '0')}</span>
                <span>
                  <h3>{f.title}</h3>
                  <span className="fline">
                    <span className="fix-lead">Proposed fix:</span> {f.proposed}
                  </span>
                </span>
                <span className="fopen">{isOpen ? 'Hide ▲' : 'View Fix ▼'}</span>
              </button>

              <div className="flaw-body" id={'fix-body-' + f.id} hidden={!isOpen}>
                {f.detail}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
