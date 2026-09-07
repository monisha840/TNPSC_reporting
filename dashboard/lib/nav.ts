/** Sidebar structure — exactly four top-level sections. */
export interface NavItem { href: string; n: string; label: string }

export const NAV: NavItem[] = [
  { href: '/',       n: '01', label: 'Overview' },
  { href: '/funnel', n: '02', label: 'User Funnel' },
  { href: '/flaws',  n: '03', label: '14 Flaws' },
  { href: '/fixes',  n: '04', label: 'Fixes' },
];

export const labelFor = (pathname: string): string => {
  if (pathname.startsWith('/flaws/')) return '14 Flaws';
  const item = NAV.find((i) => (i.href === '/' ? pathname === '/' : pathname.startsWith(i.href)));
  return item?.label ?? '';
};
