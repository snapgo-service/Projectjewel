'use client';

import { usePathname } from 'next/navigation';
import TopBar from './TopBar';
import HeaderWrapper from './HeaderWrapper';
import Footer from './Footer';

export default function StoreChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <TopBar />
      <HeaderWrapper />
      <main>{children}</main>
      <Footer />
    </>
  );
}
