'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { labelFor } from '@/lib/nav';

/** Reads the theme actually in force: an explicit choice, else the OS preference. */
function effectiveTheme(): 'light' | 'dark' {
  const set = document.documentElement.getAttribute('data-theme');
  if (set === 'light' || set === 'dark') return set;
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export default function Topbar() {
  const pathname = usePathname();
  const [theme, setTheme] = useState<'light' | 'dark' | null>(null);

  useEffect(() => { setTheme(effectiveTheme()); }, []);

  const toggle = () => {
    const next = effectiveTheme() === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('tnpsc-audit-theme', next); } catch { /* private mode */ }
    setTheme(next);
  };

  const flaw = pathname.match(/^\/flaws\/(\d+)/);

  return (
    <div className="topbar">
      <div className="crumb">
        {flaw ? <>14 Flaws / <strong>Flaw #{flaw[1]}</strong></> : <strong>{labelFor(pathname)}</strong>}
      </div>
      <div className="spacer" />
      <button className="btn" onClick={toggle} suppressHydrationWarning>
        {theme === 'dark' ? '☀ Light' : '☾ Dark'}
      </button>
      <button className="btn" onClick={() => window.print()}>Print / PDF</button>
    </div>
  );
}
