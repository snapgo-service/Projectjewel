'use client';

import { useState } from 'react';
import { useAdmin } from '@/store/AdminContext';
import { ProductGrid } from '@/components/product/ProductGrid';
import styles from './ProductTabs.module.css';

const tabs = [
  { key: 'all', label: 'All Products' },
  { key: 'new', label: 'New Arrivals' },
  { key: 'top', label: 'Top Rated Collections' },
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
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Our Products</h2>
          <div className={styles.tabs}>
            {tabs.map((tab) => (
              <button
                key={tab.key}
                className={`${styles.tab} ${activeTab === tab.key ? styles.tabActive : ''}`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        <div className={styles.content}>
          <ProductGrid products={filtered} />
        </div>
      </div>
    </section>
  );
}
