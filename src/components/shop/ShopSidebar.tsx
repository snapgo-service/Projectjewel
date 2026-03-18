'use client';

import { useState } from 'react';
import { categories } from '@/data/categories';
import { CategorySlug } from '@/types';
import styles from './ShopSidebar.module.css';

interface ShopSidebarProps {
  onFilterChange: (filters: ShopFilters) => void;
  filters: ShopFilters;
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

export function ShopSidebar({ onFilterChange, filters }: ShopSidebarProps) {
  const [localPriceMin, setLocalPriceMin] = useState(filters.priceMin);
  const [localPriceMax, setLocalPriceMax] = useState(filters.priceMax);

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

  return (
    <aside className={styles.sidebar}>
      <div className={styles.widget}>
        <h3 className={styles.widgetTitle}>Categories</h3>
        <div className={styles.categoryList}>
          {categories.map((cat) => (
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
