import type { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
