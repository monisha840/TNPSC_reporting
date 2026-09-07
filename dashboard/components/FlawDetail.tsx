import { Badge, EvidenceBadge, List } from '@/components/ui';
import type { Flaw } from '@/lib/types';

/**
 * The flaw panel — an executive brief, not an audit archive.
 *
 * Five sections: the flaw, three strongest evidence points, why it matters,
 * status, source. The complete A–Q record (full evidence, methodology,
 * calculations, root-cause statements, user and business impact, underlying
 * finding IDs) is retained in `lib/data-flaws-*.mjs` and rendered in full in
 * `TNPSC_MENTORS_GROWTH_DASHBOARD.md`.
 */

const SOURCE_NAME: Record<string, string> = {
  PROD: 'Production',
  CODE: 'Code',
  UX: 'UX',
  EXT: 'External',
  FOUNDER: 'Founder',
};

/** Short provenance label, e.g. "Production + Code + UX". */
function sourceLabel(flaw: Flaw): string {
  const seen = new Set<string>();
  flaw.brief.evidence.forEach((e) => {
    e.tag.split('+').forEach((t) => {
      const lead = t.trim().split(' ')[0];
      if (SOURCE_NAME[lead]) seen.add(SOURCE_NAME[lead]);
    });
  });
  return ['Production', 'Code', 'UX', 'External', 'Founder']
    .filter((n) => seen.has(n))
    .join(' + ');
}

function Part({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section className="part">
      <h4><span className="pn">{n}</span>{title}</h4>
      <div className="pbody">{children}</div>
    </section>
  );
}

export default function FlawDetail({ flaw }: { flaw: Flaw }) {
  const b = flaw.brief;
  const evidence = b.evidencePick.map((i) => b.evidence[i]);
  const source = sourceLabel(flaw);

  return (
    <>
      <Part n={1} title="The flaw">
        {b.problem.map((t, i) => <p key={i}>{t}</p>)}
      </Part>

      <Part n={2} title="Evidence">
        <ul className="ev-list">
          {evidence.map((e, i) => (
            <li className="ev-line" key={i}>
              <EvidenceBadge tag={e.tag} />
              <span className="ev-arrow" aria-hidden="true">→</span>
              <span>{e.text}</span>
            </li>
          ))}
        </ul>
      </Part>

      <Part n={3} title="Why it matters">
        <List items={b.why} tight />
      </Part>

      <Part n={4} title="Status">
        <div className="status-row">
          <span><b>Evidence</b> {flaw.evidenceStatus.split(' ')[0]}</span>
          <span><b>Root cause</b> {flaw.rootCauseStatus}</span>
          <span><b>Priority</b> <Badge kind={flaw.priority} /></span>
        </div>
      </Part>

      {source ? (
        <Part n={5} title="Source">
          <span className="src-chip">{source}</span>
        </Part>
      ) : null}
    </>
  );
}
