'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface WishlistContextType {
  items: string[];
  toggleItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  itemCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

function getInitialItems(): string[] {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('jubilee-wishlist');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
  }
  return [];
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<string[]>(getInitialItems);

  useEffect(() => {
    localStorage.setItem('jubilee-wishlist', JSON.stringify(items));
  }, [items]);

  const toggleItem = (productId: string) => {
    setItems((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const isInWishlist = (productId: string) => items.includes(productId);
  const clearWishlist = () => setItems([]);

  return (
    <WishlistContext.Provider value={{ items, toggleItem, isInWishlist, clearWishlist, itemCount: items.length }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within WishlistProvider');
  return context;
}
