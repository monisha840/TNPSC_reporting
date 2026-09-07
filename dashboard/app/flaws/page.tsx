import { D } from '@/lib/data';
import { PageHead } from '@/components/ui';
import FlawList, { type FlawRow } from '@/components/FlawList';
import FlawDetail from '@/components/FlawDetail';

export const metadata = { title: '14 Flaws' };

export default function FlawsPage() {
  const rows: FlawRow[] = D.FLAWS.map((f) => ({
    id: f.id,
    title: f.title,
    priority: f.priority,
    oneLiner: f.oneLiner,
    detail: <FlawDetail flaw={f} />,
  }));

  return (
    <>
      <PageHead
        title="The 14 major flaws"
        sub="What is wrong with the product today, and what proves it. Open a row for the evidence, the numbers behind it, and what is confirmed versus still a hypothesis."
      />

      <FlawList flaws={rows} />
    </>
  );
}
