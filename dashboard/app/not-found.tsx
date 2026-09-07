import Link from 'next/link';
import { PageHead } from '@/components/ui';

export default function NotFound() {
  return (
    <>
      <PageHead title="Page not found" sub="That route is not part of this audit dashboard." />
      <div className="empty">
        <p>Nothing here.</p>
        <p><Link href="/">← Back to the overview</Link></p>
      </div>
    </>
  );
}
