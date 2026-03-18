'use client';

import { Product } from '@/types';
import { ProductCard } from './ProductCard';
import styles from './ProductGrid.module.css';

interface ProductGridProps {
  products: Product[];
  columns?: 3 | 4;
  onQuickView?: (product: Product) => void;
}

export function ProductGrid({ products, columns = 4, onQuickView }: ProductGridProps) {
  return (
    <div className={`${styles.grid} ${columns === 3 ? styles.grid3 : ''}`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onQuickView={onQuickView} />
      ))}
    </div>
  );
}
