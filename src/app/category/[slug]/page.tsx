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
      <div style={{ textAlign: 'center', padding: '100px 15px' }}>
        <h1>Category Not Found</h1>
        <p>The category you&apos;re looking for doesn&apos;t exist.</p>
      </div>
    );
  }

  return (
    <>
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Categories', href: '/shop' }, { label: category.name }]} />
      <div style={{ padding: '40px 0 60px' }}>
        <div style={{ maxWidth: 1430, margin: '0 auto', padding: '0 15px' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h1 style={{ fontSize: 32, fontWeight: 500, color: '#222', marginBottom: 10 }}>
              {category.name}
            </h1>
            <p style={{ color: '#666', maxWidth: 600, margin: '0 auto' }}>
              {category.description}
            </p>
          </div>
          {categoryProducts.length > 0 ? (
            <ProductGrid products={categoryProducts} />
          ) : (
            <p style={{ textAlign: 'center', color: '#666', padding: '40px 0' }}>
              No products found in this category.
            </p>
          )}
        </div>
      </div>
    </>
  );
}
