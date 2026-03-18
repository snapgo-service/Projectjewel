'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import { useCart } from '@/store/CartContext';
import { useWishlist } from '@/store/WishlistContext';
import { useCompare } from '@/store/CompareContext';
import { formatCurrency } from '@/utils/formatCurrency';
import SaleBadge from '@/components/ui/SaleBadge';
import StarRating from '@/components/ui/StarRating';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export function ProductCard({ product, onQuickView }: ProductCardProps) {
  const { addItem } = useCart();
  const { toggleItem: toggleWishlist, isInWishlist } = useWishlist();
  const { toggleItem: toggleCompare, isInCompare } = useCompare();

  const hasVariants = product.variants.length > 0;
  const wishlisted = isInWishlist(product.id);
  const compared = isInCompare(product.id);

  const handleAddToCart = () => {
    if (hasVariants) return;
    addItem({
      product,
      quantity: 1,
      selectedVariants: {},
    });
  };

  const renderPrice = () => {
    if (product.priceRange && product.priceRange.length === 2) {
      return (
        <span className={styles.priceRange}>
          {formatCurrency(product.priceRange[0])} – {formatCurrency(product.priceRange[1])}
        </span>
      );
    }
    if (product.salePrice) {
      return (
        <>
          <span className={styles.originalPrice}>{formatCurrency(product.price)}</span>
          <span className={styles.price}>{formatCurrency(product.salePrice)}</span>
        </>
      );
    }
    return <span className={styles.price}>{formatCurrency(product.price)}</span>;
  };

  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        <Image
          src={product.images?.[0] || 'https://placehold.co/300x300?text=No+Image'}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className={styles.mainImage}
          unoptimized
        />
        {product.images?.[1] && (
          <Image
            src={product.images[1]}
            alt={`${product.name} hover`}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={styles.hoverImage}
            unoptimized
          />
        )}

        <div className={styles.badges}>
          {product.salePercent && <SaleBadge variant="sale" percent={product.salePercent} />}
          {product.isNew && <SaleBadge variant="new" />}
          {product.isHot && <SaleBadge variant="hot" />}
          {product.isFeatured && <SaleBadge variant="featured" />}
        </div>

        <div className={styles.actions}>
          <button
            className={`${styles.actionBtn} ${wishlisted ? styles.active : ''}`}
            onClick={() => toggleWishlist(product.id)}
            aria-label="Add to wishlist"
          >
            <svg viewBox="0 0 24 24" fill={wishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
          <button
            className={`${styles.actionBtn} ${compared ? styles.active : ''}`}
            onClick={() => toggleCompare(product.id)}
            aria-label="Compare"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="16 3 21 3 21 8" />
              <line x1="4" y1="20" x2="21" y2="3" />
              <polyline points="21 16 21 21 16 21" />
              <line x1="15" y1="15" x2="21" y2="21" />
              <line x1="4" y1="4" x2="9" y2="9" />
            </svg>
          </button>
          {onQuickView && (
            <button
              className={styles.actionBtn}
              onClick={() => onQuickView(product)}
              aria-label="Quick view"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className={styles.info}>
        {product.rating > 0 && (
          <div className={styles.rating}>
            <StarRating rating={product.rating} size="sm" />
          </div>
        )}
        <h3 className={styles.name}>
          <Link href={`/product/${product.slug}`}>{product.name}</Link>
        </h3>
        <div className={styles.priceWrapper}>{renderPrice()}</div>
        {hasVariants ? (
          <Link href={`/product/${product.slug}`} className={styles.addToCart}>
            Select Options
          </Link>
        ) : (
          <button className={styles.addToCart} onClick={handleAddToCart}>
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
}
