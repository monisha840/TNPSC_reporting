'use client';

import { useState } from 'react';

/**
 * Collapsible section. Children are rendered by the server and merely hidden,
 * so the full audit content is present in the static HTML — browser find-in-page
 * and printing reach it whether or not it has been expanded.
 */
export default function Expander({
  label, children, id,
}: { label: string; children: React.ReactNode; id: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="expander">
      <button
        className="expander-btn"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls={id}
      >
        <span className="ex-sign" aria-hidden="true">{open ? '−' : '+'}</span>
        {open ? 'Hide technical details' : label}
      </button>
      <div className="expander-body" id={id} data-tech hidden={!open}>
        {children}
      </div>
    </div>
  );
}
