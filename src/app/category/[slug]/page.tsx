'use client';

import { use } from 'react';
import { useAdmin } from '@/store/AdminContext';
import Breadcrumb from '@/components/layout/Breadcrumb';
import { ProductGrid } from '@/components/product/ProductGrid';
import { CategorySlug } from '@/types';

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { products, categories } = useAdmin();
  const category = categories.find((c) => c.slug === slug);
  const categoryProducts = products.filter((p) => p.category === slug as CategorySlug);

  if (!category) {
    return (
      <div className="text-center py-24 px-4">
        <h1 className="text-heading text-2xl font-medium">Category Not Found</h1>
        <p className="text-body mt-3">The category you&apos;re looking for doesn&apos;t exist.</p>
      </div>
    );
  }

  return (
    <>
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Categories', href: '/shop' }, { label: category.name }]} />
      <div className="bg-bg-blush py-16 mb-10">
        <div className="max-w-[1430px] mx-auto px-4 text-center">
          <h1 className="text-3xl font-medium text-heading mb-3 font-[family-name:var(--font-serif)]">
            {category.name}
          </h1>
          <p className="text-body max-w-xl mx-auto">
            {category.description}
          </p>
        </div>
      </div>
      <div className="pb-16">
        <div className="max-w-[1430px] mx-auto px-4">
          {categoryProducts.length > 0 ? (
            <ProductGrid products={categoryProducts} />
          ) : (
            <p className="text-center text-body py-10">
              No products found in this category.
            </p>
          )}
        </div>
      </div>
    </>
  );
}
