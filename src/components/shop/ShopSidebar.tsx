'use client';

import { useState, useMemo } from 'react';
import { useAdmin } from '@/store/AdminContext';
import { CategorySlug, Product } from '@/types';

interface ShopSidebarProps {
  onFilterChange: (filters: ShopFilters) => void;
  filters: ShopFilters;
  products: Product[];
}

export interface ShopFilters {
  categories: CategorySlug[];
  priceMin: number;
  priceMax: number;
  colors: string[];
  sort: string;
}

const colors = [
  { label: 'Yellow Gold', value: '#FFD700' },
  { label: 'Rose Gold', value: '#B76E79' },
  { label: 'White Gold', value: '#E8E8E8' },
  { label: 'Silver', value: '#C0C0C0' },
];

export function ShopSidebar({ onFilterChange, filters, products }: ShopSidebarProps) {
  const { categories } = useAdmin();
  const [localPriceMin, setLocalPriceMin] = useState(filters.priceMin);
  const [localPriceMax, setLocalPriceMax] = useState(filters.priceMax);

  const categoriesWithCounts = useMemo(() => {
    const countMap: Record<string, number> = {};
    products.forEach((p) => {
      countMap[p.category] = (countMap[p.category] || 0) + 1;
    });
    return categories.map((cat) => ({
      ...cat,
      productCount: countMap[cat.slug] || 0,
    }));
  }, [categories, products]);

  const priceRange = useMemo(() => {
    if (products.length === 0) return { min: 0, max: 100000 };
    const prices = products.map(p => p.salePrice || p.price);
    return { min: Math.floor(Math.min(...prices)), max: Math.ceil(Math.max(...prices)) };
  }, [products]);

  const toggleCategory = (slug: CategorySlug) => {
    const newCats = filters.categories.includes(slug)
      ? filters.categories.filter((c) => c !== slug)
      : [...filters.categories, slug];
    onFilterChange({ ...filters, categories: newCats });
  };

  const toggleColor = (color: string) => {
    const newColors = filters.colors.includes(color)
      ? filters.colors.filter((c) => c !== color)
      : [...filters.colors, color];
    onFilterChange({ ...filters, colors: newColors });
  };

  const applyPrice = () => {
    onFilterChange({ ...filters, priceMin: localPriceMin, priceMax: localPriceMax });
  };

  const clearFilters = () => {
    setLocalPriceMin(0);
    setLocalPriceMax(priceRange.max);
    onFilterChange({
      categories: [],
      priceMin: 0,
      priceMax: priceRange.max,
      colors: [],
      sort: filters.sort,
    });
  };

  const hasActiveFilters =
    filters.categories.length > 0 || filters.colors.length > 0 || filters.priceMin > 0;

  return (
    <aside>
      {hasActiveFilters && (
        <button
          className="w-full mb-6 px-4 py-2.5 rounded-full border border-primary text-primary text-xs uppercase tracking-wider font-medium hover:bg-primary hover:text-white transition-all duration-300"
          onClick={clearFilters}
        >
          Clear All Filters
        </button>
      )}

      {/* Categories */}
      <div className="mb-8 pb-8 border-b border-border">
        <h3 className="text-sm font-semibold text-heading uppercase tracking-wider mb-5">Categories</h3>
        <div className="space-y-3">
          {categoriesWithCounts.map((cat) => (
            <label key={cat.slug} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.categories.includes(cat.slug)}
                onChange={() => toggleCategory(cat.slug)}
                className="w-4 h-4 rounded border-border-dark text-primary focus:ring-primary/30 accent-[#E8A0BF]"
              />
              <span className="text-sm text-body group-hover:text-primary transition-colors flex-1">
                {cat.name}
              </span>
              <span className="text-xs text-body-light">({cat.productCount})</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price */}
      <div className="mb-8 pb-8 border-b border-border">
        <h3 className="text-sm font-semibold text-heading uppercase tracking-wider mb-5">Price</h3>
        <div className="flex items-center gap-2 mb-3">
          <input
            type="number"
            className="w-full px-3 py-2.5 rounded-lg border border-border text-sm text-heading focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all"
            value={localPriceMin}
            onChange={(e) => setLocalPriceMin(Number(e.target.value))}
            placeholder={`Min (${priceRange.min})`}
          />
          <span className="text-body-light text-sm">–</span>
          <input
            type="number"
            className="w-full px-3 py-2.5 rounded-lg border border-border text-sm text-heading focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all"
            value={localPriceMax}
            onChange={(e) => setLocalPriceMax(Number(e.target.value))}
            placeholder={`Max (${priceRange.max})`}
          />
        </div>
        <button
          className="w-full px-4 py-2.5 rounded-full bg-primary text-white text-xs uppercase tracking-wider font-medium hover:bg-primary-hover transition-all duration-300"
          onClick={applyPrice}
        >
          Apply
        </button>
      </div>

      {/* Color */}
      <div>
        <h3 className="text-sm font-semibold text-heading uppercase tracking-wider mb-5">Color</h3>
        <div className="flex flex-wrap gap-3">
          {colors.map((c) => (
            <button
              key={c.value}
              className={`w-8 h-8 rounded-full border-2 transition-all duration-300 ${
                filters.colors.includes(c.value)
                  ? 'border-primary ring-2 ring-primary/30 ring-offset-2'
                  : 'border-border-dark hover:border-primary/50'
              }`}
              style={{ backgroundColor: c.value }}
              onClick={() => toggleColor(c.value)}
              aria-label={c.label}
              title={c.label}
            />
          ))}
        </div>
      </div>
    </aside>
  );
}
