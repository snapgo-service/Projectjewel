'use client';

import { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';
import { CartProvider } from './CartContext';
import { WishlistProvider } from './WishlistContext';
import { CompareProvider } from './CompareContext';
import { AdminProvider } from './AdminContext';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <AdminProvider>
        <CartProvider>
          <WishlistProvider>
            <CompareProvider>
              {children}
            </CompareProvider>
          </WishlistProvider>
        </CartProvider>
      </AdminProvider>
    </SessionProvider>
  );
}
