'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAdmin } from '@/store/AdminContext';
import { formatCurrency } from '@/utils/formatCurrency';

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
    <div className="fixed inset-0 bg-heading/50 backdrop-blur-sm z-[200] flex items-start justify-center pt-24 animate-fade-in" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-card-hover w-full max-w-2xl mx-4 overflow-hidden animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 px-6 py-4 border-b border-border">
          <div className="flex-1 flex items-center gap-3">
            <svg className="text-body-light shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              placeholder="Search for products..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full text-heading text-base py-2 border-none outline-none placeholder:text-body-light bg-transparent"
            />
            {query && (
              <button className="text-body-light hover:text-heading text-xl transition-colors" onClick={() => setQuery('')}>
                &times;
              </button>
            )}
          </div>
          <button className="text-sm text-body hover:text-primary font-medium transition-colors" onClick={onClose}>
            Close
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {query.trim() && results.length === 0 && (
            <div className="text-center py-12 px-6">
              <p className="text-body mb-3">No products found for &ldquo;{query}&rdquo;</p>
              <Link href="/shop" className="text-primary font-medium hover:underline" onClick={onClose}>
                Browse all products
              </Link>
            </div>
          )}

          {results.length > 0 && (
            <>
              <div className="px-6 py-3 text-xs text-body-light uppercase tracking-wider">
                {results.length} result{results.length !== 1 ? 's' : ''} found
              </div>
              <div>
                {results.map((product) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.slug}`}
                    className="flex items-center gap-4 px-6 py-3 hover:bg-bg-blush transition-colors duration-200"
                    onClick={onClose}
                  >
                    <div className="w-14 h-14 rounded-lg overflow-hidden bg-bg-ivory relative shrink-0">
                      <Image
                        src={product.images?.[0] || 'https://placehold.co/60x60?text=No+Image'}
                        alt={product.name}
                        fill
                        sizes="56px"
                        style={{ objectFit: 'cover' }}
                        unoptimized
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-heading truncate">{product.name}</h4>
                      <span className="text-xs text-body-light capitalize">{product.category}</span>
                      <div className="text-sm font-medium mt-0.5">
                        {product.salePrice ? (
                          <>
                            <span className="text-body-light line-through mr-2">{formatCurrency(product.price)}</span>
                            <span className="text-primary">{formatCurrency(product.salePrice)}</span>
                          </>
                        ) : (
                          <span className="text-heading">{formatCurrency(product.price)}</span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              {results.length >= 8 && (
                <Link
                  href={`/shop?search=${encodeURIComponent(query)}`}
                  className="block text-center py-4 text-primary font-medium text-sm hover:underline border-t border-border"
                  onClick={onClose}
                >
                  View all results
                </Link>
              )}
            </>
          )}

          {!query.trim() && (
            <div className="px-6 py-8">
              <p className="text-xs text-body-light uppercase tracking-wider mb-4">Popular Searches</p>
              <div className="flex flex-wrap gap-2">
                {['Rings', 'Earrings', 'Diamond', 'Gold', 'Pendant', 'Bracelet'].map((tag) => (
                  <button
                    key={tag}
                    className="px-4 py-2 rounded-full border border-border text-sm text-body hover:bg-primary hover:text-white hover:border-primary transition-all duration-300"
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
