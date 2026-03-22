'use client';

import { Product } from '@/types';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  columns?: 3 | 4;
  onQuickView?: (product: Product) => void;
}

export function ProductGrid({ products, columns = 4, onQuickView }: ProductGridProps) {
  return (
    <div className={`grid gap-6 md:gap-8 ${
      columns === 3
        ? 'grid-cols-2 md:grid-cols-3'
        : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
    }`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onQuickView={onQuickView} />
      ))}
    </div>
  );
}
