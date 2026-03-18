'use client';

import { useAdmin } from '@/store/AdminContext';
import { ProductGrid } from '@/components/product/ProductGrid';
import styles from './BestSelling.module.css';

export function BestSelling() {
  const { products } = useAdmin();
  const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 4);

  if (bestSellers.length === 0) return null;

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Best Selling</h2>
        </div>
        <ProductGrid products={bestSellers} />
      </div>
    </section>
  );
}
