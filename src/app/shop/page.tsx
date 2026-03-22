'use client';

import { useState, useMemo, useEffect } from 'react';
import { useAdmin } from '@/store/AdminContext';
import { Product } from '@/types';
import Breadcrumb from '@/components/layout/Breadcrumb';
import { ShopSidebar, ShopFilters } from '@/components/shop/ShopSidebar';
import { SortDropdown } from '@/components/shop/SortDropdown';
import { ProductGrid } from '@/components/product/ProductGrid';

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

  const maxPrice = useMemo(() => {
    if (products.length === 0) return 100000;
    return Math.ceil(Math.max(...products.map((p) => p.salePrice || p.price)));
  }, [products]);

  const [filters, setFilters] = useState<ShopFilters>({
    categories: [],
    priceMin: 0,
    priceMax: 100000,
    colors: [],
    sort: 'default',
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setFilters((prev) => ({ ...prev, priceMax: maxPrice }));
  }, [maxPrice]);

  const filtered = useMemo(() => {
    let result = products;

    // Category filter
    if (filters.categories.length > 0) {
      result = result.filter((p) => filters.categories.includes(p.category));
    }

    // Color filter (FIX: was not applied before)
    if (filters.colors.length > 0) {
      result = result.filter((p) =>
        p.variants.some((v) => v.type === 'color' && filters.colors.includes(v.value))
      );
    }

    // Price filter
    const effectivePrice = (p: Product) => p.salePrice || p.price;
    result = result.filter(
      (p) => effectivePrice(p) >= filters.priceMin && effectivePrice(p) <= filters.priceMax
    );

    return sortProducts(result, filters.sort);
  }, [filters, products]);

  return (
    <>
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Shop' }]} />
      <div className="py-10 md:py-14">
        <div className="max-w-[1430px] mx-auto px-4 flex gap-8">
          {/* Mobile overlay */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-heading/40 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Sidebar */}
          <aside
            className={`
              fixed top-0 left-0 h-full w-[300px] bg-white z-50 p-6 overflow-y-auto transition-transform duration-300
              lg:static lg:h-auto lg:z-auto lg:translate-x-0 lg:w-[280px] lg:shrink-0 lg:bg-white lg:rounded-xl lg:shadow-card lg:p-6
              ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}
          >
            <div className="lg:hidden flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-heading">Filters</h3>
              <button onClick={() => setSidebarOpen(false)} className="text-body hover:text-heading">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <ShopSidebar filters={filters} onFilterChange={setFilters} products={products} />
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
              <span className="text-sm text-body">
                Showing {filtered.length} of {products.length} results
              </span>
              <div className="flex items-center gap-3">
                <button
                  className="lg:hidden px-4 py-2 rounded-full bg-primary text-white text-xs uppercase tracking-wider font-medium"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                  {sidebarOpen ? 'Hide Filters' : 'Filters'}
                </button>
                <SortDropdown
                  value={filters.sort}
                  onChange={(sort) => setFilters({ ...filters, sort })}
                />
              </div>
            </div>
            <ProductGrid products={filtered} />
            {filtered.length === 0 && (
              <div className="text-center py-20">
                <p className="text-body text-lg mb-2">No products found</p>
                <p className="text-body-light text-sm">Try adjusting your filters</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
