'use client';

import { useState, useMemo } from 'react';
import { useAdmin } from '@/store/AdminContext';
import { Product } from '@/types';
import Breadcrumb from '@/components/layout/Breadcrumb';
import { ShopSidebar, ShopFilters } from '@/components/shop/ShopSidebar';
import { SortDropdown } from '@/components/shop/SortDropdown';
import { ProductGrid } from '@/components/product/ProductGrid';
import styles from './page.module.css';

const defaultFilters: ShopFilters = {
  categories: [],
  priceMin: 0,
  priceMax: 1000,
  colors: [],
  sort: 'default',
};

function sortProducts(items: Product[], sort: string): Product[] {
  const sorted = [...items];
  switch (sort) {
    case 'price-asc':
      return sorted.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
    case 'price-desc':
      return sorted.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
    case 'name-asc':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case 'name-desc':
      return sorted.sort((a, b) => b.name.localeCompare(a.name));
    case 'rating':
      return sorted.sort((a, b) => b.rating - a.rating);
    default:
      return sorted;
  }
}

export default function ShopPage() {
  const { products } = useAdmin();
  const [filters, setFilters] = useState<ShopFilters>(defaultFilters);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const filtered = useMemo(() => {
    let result = products;

    if (filters.categories.length > 0) {
      result = result.filter((p) => filters.categories.includes(p.category));
    }

    const effectivePrice = (p: Product) => p.salePrice || p.price;
    result = result.filter(
      (p) => effectivePrice(p) >= filters.priceMin && effectivePrice(p) <= filters.priceMax
    );

    return sortProducts(result, filters.sort);
  }, [filters]);

  return (
    <>
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Shop' }]} />
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
            <ShopSidebar filters={filters} onFilterChange={setFilters} />
          </div>
          <div className={styles.main}>
            <div className={styles.topBar}>
              <span className={styles.resultCount}>
                Showing {filtered.length} of {products.length} results
              </span>
              <button
                className={styles.mobileFilterBtn}
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                {sidebarOpen ? 'Hide Filters' : 'Show Filters'}
              </button>
              <SortDropdown
                value={filters.sort}
                onChange={(sort) => setFilters({ ...filters, sort })}
              />
            </div>
            <ProductGrid products={filtered} />
          </div>
        </div>
      </div>
    </>
  );
}
