import type { Metadata } from 'next';
import { Providers } from '@/store/Providers';
import StoreChrome from '@/components/layout/StoreChrome';
import './globals.css';

export const metadata: Metadata = {
  title: 'Stellora Silver - Premium Artificial Jewellery Store',
  description: 'Discover our exclusive collection of premium artificial jewellery. Rings, earrings, bracelets, necklaces, and more.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Jost:wght@300;400;500;600;700&family=Cardo:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>
          <StoreChrome>{children}</StoreChrome>
        </Providers>
      </body>
    </html>
  );
}
