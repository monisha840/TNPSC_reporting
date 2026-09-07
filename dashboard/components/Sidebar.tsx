'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV } from '@/lib/nav';

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="b1">TNPSC MENTORS</div>
        <div className="b2">Growth Audit</div>
      </div>

      <nav className="nav" aria-label="Sections">
        {NAV.map((i) => (
          <Link
            key={i.href}
            href={i.href}
            className={isActive(i.href) ? 'active' : undefined}
            aria-current={isActive(i.href) ? 'page' : undefined}
          >
            <span className="num">{i.n}</span>
            {i.label}
          </Link>
        ))}
      </nav>

      <div className="sidebar-foot">
        <span className="dot" aria-hidden="true" />
        READ-ONLY • PRODUCTION UNTOUCHED
      </div>
    </aside>
  );
}
