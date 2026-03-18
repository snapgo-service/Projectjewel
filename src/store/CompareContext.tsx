'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface CompareContextType {
  items: string[];
  toggleItem: (productId: string) => void;
  isInCompare: (productId: string) => boolean;
  clearCompare: () => void;
  itemCount: number;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export function CompareProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<string[]>([]);

  const toggleItem = (productId: string) => {
    setItems((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      }
      if (prev.length >= 4) return prev;
      return [...prev, productId];
    });
  };

  const isInCompare = (productId: string) => items.includes(productId);
  const clearCompare = () => setItems([]);

  return (
    <CompareContext.Provider value={{ items, toggleItem, isInCompare, clearCompare, itemCount: items.length }}>
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) throw new Error('useCompare must be used within CompareProvider');
  return context;
}
