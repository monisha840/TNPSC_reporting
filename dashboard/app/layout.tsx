import type { Metadata } from 'next';
import './globals.css';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import { D } from '@/lib/data';

export const metadata: Metadata = {
  title: {
    default: 'TNPSC Mentors — Growth Audit',
    template: '%s · TNPSC Mentors Growth Audit',
  },
  description:
    'Internal read-only growth and product audit for TNPSC Mentors. Not for public distribution.',
  robots: { index: false, follow: false, nocache: true },
};

/* Applies the saved theme before first paint so the page never flashes. */
const THEME_BOOT = `(function(){try{var t=localStorage.getItem('tnpsc-audit-theme');
if(t==='dark'||t==='light')document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    /* The theme-boot script below sets data-theme on <html> before React
       hydrates, so this one element legitimately differs from the server HTML. */
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT }} />
      </head>
      <body>
        <a className="skip-link" href="#main">Skip to content</a>
        <div className="app">
          <Sidebar />
          <main className="main">
            <Topbar />
            <div className="content" id="main">
              {children}
              <footer className="foot">
                <p>
                  {D.AUDIT.product} — internal growth audit. Audit period {D.AUDIT.periodStart} →{' '}
                  {D.AUDIT.periodEnd}. Compiled {D.AUDIT.compiled}.
                </p>
              </footer>
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
