import type { Metadata } from 'next';
import { Providers } from '@/store/Providers';
import StoreChrome from '@/components/layout/StoreChrome';
import './globals.css';

export const metadata: Metadata = {
  title: 'Jubilee - Premium Diamond Jewelry Store',
  description: 'Discover our exclusive collection of handcrafted diamond jewelry. Rings, earrings, bracelets, necklaces, and more.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <StoreChrome>{children}</StoreChrome>
        </Providers>
      </body>
    </html>
  );
}
