'use client';

import { useState } from 'react';
import { useAdmin } from '@/store/AdminContext';
import { ProductGrid } from '@/components/product/ProductGrid';
import styles from './ProductTabs.module.css';

const tabs = [
  { key: 'all', label: 'All Products' },
  { key: 'rings', label: 'Rings' },
  { key: 'earrings', label: 'Earrings' },
  { key: 'bracelets', label: 'Bracelets' },
  { key: 'pendants', label: 'Pendants' },
];

export function ProductTabs() {
  const { products } = useAdmin();
  const [activeTab, setActiveTab] = useState('all');

  const filtered =
    activeTab === 'all'
      ? products
      : products.filter((p) => p.category === activeTab);

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
