import Link from 'next/link';
import { D } from '@/lib/data';
import { PageHead, H2, Card } from '@/components/ui';
import FixList, { type FixRow } from '@/components/FixList';
import FixDetail from '@/components/FixDetail';

export const metadata = { title: 'Fixes' };

export default function FixesPage() {
  const flawById = new Map(D.FLAWS.map((f) => [f.id, f]));

  const rows: FixRow[] = D.FIXES.map((fx) => {
    const flaw = flawById.get(fx.flaw)!;
    return {
      id: fx.id,
      title: fx.title,
      priority: flaw.priority,
      proposed: fx.proposed,
      detail: <FixDetail fix={fx} flaw={flaw} />,
    };
  });

  return (
    <>
      <PageHead
        title="Fixes"
        sub={
          <>
            <span className="status-chip">
              {D.FIX_STATUS.state} · {D.FIX_STATUS.detail}
            </span>
            What we propose changing to address each flaw — one fix per flaw, with a worked
            example and the improvement we are aiming for.
          </>
        }
      />

      <H2>The journey these fixes are meant to build</H2>
      <Card>
        <div className="journey-strip">
          {D.FIX_STRATEGY.journey.map((s, i) => (
            <span key={s}>
              <span className="js-step">{s}</span>
              {i < D.FIX_STRATEGY.journey.length - 1 ? (
                <span className="js-sep" aria-hidden="true">↓</span>
              ) : null}
            </span>
          ))}
        </div>

        <div className="fix-groups">
          {D.FIX_STRATEGY.groups.map((g) => (
            <div className="fix-group" key={g.name}>
              <div className="fg-name">{g.name}</div>
              <div className="fg-ids">
                {g.fixes.map((n) => (
                  <Link href={`#fix-${n}`} className="fg-chip" key={n}>
                    {String(n).padStart(2, '0')}
                  </Link>
                ))}
              </div>
              <div className="fg-note">{g.note}</div>
            </div>
          ))}
        </div>
      </Card>

      <H2>The 14 proposed fixes</H2>
      <FixList fixes={rows} />
    </>
  );
}
