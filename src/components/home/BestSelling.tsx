'use client';

import { useAdmin } from '@/store/AdminContext';
import { ProductGrid } from '@/components/product/ProductGrid';

export function BestSelling() {
  const { products } = useAdmin();
  const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 4);

  if (bestSellers.length === 0) return null;

  return (
    <section className="py-20 md:py-24">
      <div className="max-w-[1430px] mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-medium text-heading font-[family-name:var(--font-serif)] inline-block relative pb-4 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-12 after:h-0.5 after:bg-primary">
            Best Selling
          </h2>
        </div>
        <ProductGrid products={bestSellers} />
      </div>
    </section>
  );
}
