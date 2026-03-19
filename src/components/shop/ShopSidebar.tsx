'use client';

import { useState, useMemo } from 'react';
import { useAdmin } from '@/store/AdminContext';
import { Category, CategorySlug, Product } from '@/types';
import styles from './ShopSidebar.module.css';

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

  // Compute actual product counts per category from products
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
    setLocalPriceMax(filters.priceMax);
    onFilterChange({
      categories: [],
      priceMin: 0,
      priceMax: filters.priceMax,
      colors: [],
      sort: filters.sort,
    });
  };

  const hasActiveFilters =
    filters.categories.length > 0 || filters.colors.length > 0 || filters.priceMin > 0;

  return (
    <aside className={styles.sidebar}>
      {hasActiveFilters && (
        <button className={styles.clearBtn} onClick={clearFilters}>
          Clear All Filters
        </button>
      )}

      <div className={styles.widget}>
        <h3 className={styles.widgetTitle}>Categories</h3>
        <div className={styles.categoryList}>
          {categoriesWithCounts.map((cat) => (
            <label key={cat.slug} className={styles.categoryItem}>
              <input
                type="checkbox"
                checked={filters.categories.includes(cat.slug)}
                onChange={() => toggleCategory(cat.slug)}
              />
              {cat.name}
              <span className={styles.count}>({cat.productCount})</span>
            </label>
          ))}
        </div>
      </div>

      <div className={styles.widget}>
        <h3 className={styles.widgetTitle}>Price</h3>
        <div className={styles.priceRange}>
          <div className={styles.priceInputs}>
            <input
              type="number"
              className={styles.priceInput}
              value={localPriceMin}
              onChange={(e) => setLocalPriceMin(Number(e.target.value))}
              placeholder="Min"
            />
            <span className={styles.priceSep}>–</span>
            <input
              type="number"
              className={styles.priceInput}
              value={localPriceMax}
              onChange={(e) => setLocalPriceMax(Number(e.target.value))}
              placeholder="Max"
            />
          </div>
          <button className={styles.filterBtn} onClick={applyPrice}>
            Filter
          </button>
        </div>
      </div>

      <div className={styles.widget}>
        <h3 className={styles.widgetTitle}>Color</h3>
        <div className={styles.colorList}>
          {colors.map((c) => (
            <button
              key={c.value}
              className={`${styles.colorSwatch} ${filters.colors.includes(c.value) ? styles.colorSwatchActive : ''}`}
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
