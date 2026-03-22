'use client';

import { useState } from 'react';
import { useAdmin } from '@/store/AdminContext';
import { ProductGrid } from '@/components/product/ProductGrid';

const tabs = [
  { key: 'all', label: 'All Products' },
  { key: 'new', label: 'New Arrivals' },
  { key: 'top', label: 'Top Rated' },
];

export function ProductTabs() {
  const { products } = useAdmin();
  const [activeTab, setActiveTab] = useState('all');

  const filtered =
    activeTab === 'all'
      ? products
      : activeTab === 'new'
        ? [...products].sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()).slice(0, 8)
        : [...products].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 8);

  return (
    <section className="py-20 md:py-24">
      <div className="max-w-[1430px] mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-medium text-heading font-[family-name:var(--font-serif)] mb-8 inline-block relative pb-4 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-12 after:h-0.5 after:bg-primary">
            Our Products
          </h2>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeTab === tab.key
                    ? 'bg-primary text-white'
                    : 'text-body hover:bg-primary/10 hover:text-primary'
                }`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        <ProductGrid products={filtered} />
      </div>
    </section>
  );
}
