'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAdmin } from '@/store/AdminContext';
import { formatCurrency } from '@/utils/formatCurrency';
import styles from './SearchModal.module.css';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { products } = useAdmin();

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tags?.some((t) => t.toLowerCase().includes(q))
    ).slice(0, 8);
  }, [query, products]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.searchHeader}>
          <div className={styles.inputWrapper}>
            <svg className={styles.searchIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              placeholder="Search for products..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className={styles.input}
            />
            {query && (
              <button className={styles.clearBtn} onClick={() => setQuery('')}>
                &times;
              </button>
            )}
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            Close
          </button>
        </div>

        <div className={styles.results}>
          {query.trim() && results.length === 0 && (
            <div className={styles.noResults}>
              <p>No products found for &ldquo;{query}&rdquo;</p>
              <Link href="/shop" className={styles.browseLink} onClick={onClose}>
                Browse all products
              </Link>
            </div>
          )}

          {results.length > 0 && (
            <>
              <div className={styles.resultCount}>
                {results.length} result{results.length !== 1 ? 's' : ''} found
              </div>
              <div className={styles.resultList}>
                {results.map((product) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.slug}`}
                    className={styles.resultItem}
                    onClick={onClose}
                  >
                    <div className={styles.resultImage}>
                      <Image
                        src={product.images?.[0] || 'https://placehold.co/60x60?text=No+Image'}
                        alt={product.name}
                        fill
                        sizes="60px"
                        style={{ objectFit: 'cover' }}
                        unoptimized
                      />
                    </div>
                    <div className={styles.resultInfo}>
                      <h4 className={styles.resultName}>{product.name}</h4>
                      <span className={styles.resultCategory}>{product.category}</span>
                      <div className={styles.resultPrice}>
                        {product.salePrice ? (
                          <>
                            <span className={styles.resultOriginalPrice}>{formatCurrency(product.price)}</span>
                            <span>{formatCurrency(product.salePrice)}</span>
                          </>
                        ) : (
                          <span>{formatCurrency(product.price)}</span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              {results.length >= 8 && (
                <Link
                  href={`/shop?search=${encodeURIComponent(query)}`}
                  className={styles.viewAll}
                  onClick={onClose}
                >
                  View all results
                </Link>
              )}
            </>
          )}

          {!query.trim() && (
            <div className={styles.suggestions}>
              <p className={styles.suggestionsTitle}>Popular Searches</p>
              <div className={styles.suggestionTags}>
                {['Rings', 'Earrings', 'Diamond', 'Gold', 'Pendant', 'Bracelet'].map((tag) => (
                  <button
                    key={tag}
                    className={styles.suggestionTag}
                    onClick={() => setQuery(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
