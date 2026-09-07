import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { D, flawById } from '@/lib/data';
import { Badge } from '@/components/ui';
import FlawDetail from '@/components/FlawDetail';

/**
 * Dedicated page per flaw. The accordion on /flaws is the primary surface; these
 * routes exist so a single flaw can be linked to and shared directly.
 */

export function generateStaticParams() {
  return D.FLAWS.map((f) => ({ id: String(f.id) }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> },
): Promise<Metadata> {
  const { id } = await params;
  const flaw = flawById(Number(id));
  return { title: flaw ? `Flaw #${flaw.id} — ${flaw.title}` : 'Flaw not found' };
}

export default async function FlawPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const f = flawById(Number(id));
  if (!f) notFound();

  const prev = f.id > 1 ? f.id - 1 : null;
  const next = f.id < D.FLAWS.length ? f.id + 1 : null;

  return (
    <>
      <p style={{ marginBottom: 16, fontSize: 13 }}>
        <Link href="/flaws">← All 14 flaws</Link>
      </p>

      <div className="page-head">
        <div style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--c-faint)', fontWeight: 700 }}>
          FLAW #{String(f.id).padStart(2, '0')}
        </div>
        <h1 style={{ marginTop: 6 }}>{f.title}</h1>
        <div style={{ marginTop: 10, display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
          <Badge kind={f.priority} />
          <span style={{ fontSize: 10.5, color: 'var(--c-muted)', fontWeight: 600 }}>
            {f.category.toUpperCase()} · {f.severity.toUpperCase()} · {f.funnelStage}
          </span>
        </div>
        <div className="sub">{f.oneLiner}</div>
      </div>

      <div className="flaw-body" style={{ padding: '4px 22px 22px', borderRadius: 'var(--radius)', border: '1px solid var(--c-line)' }}>
        <FlawDetail flaw={f} />
      </div>

      <nav className="pager">
        {prev ? <Link href={`/flaws/${prev}`}>← Flaw #{prev}</Link> : <span />}
        <Link href="/flaws">All flaws</Link>
        {next ? <Link href={`/flaws/${next}`}>Flaw #{next} →</Link> : <span />}
      </nav>
    </>
  );
}
