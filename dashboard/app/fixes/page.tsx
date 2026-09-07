import { D } from '@/lib/data';
import { PageHead } from '@/components/ui';
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
            One proposed change per flaw.
          </>
        }
      />

      <FixList fixes={rows} />
    </>
  );
}
