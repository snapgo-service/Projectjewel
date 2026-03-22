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
        <span className="text-heading font-semibold">
          {formatCurrency(product.priceRange[0])}
        </span>
      );
    }
    if (product.salePrice) {
      return (
        <>
          <span className="text-body-light line-through text-sm mr-2">{formatCurrency(product.price)}</span>
          <span className="text-primary font-semibold">{formatCurrency(product.salePrice)}</span>
        </>
      );
    }
    return <span className="text-heading font-semibold">{formatCurrency(product.price)}</span>;
  };

  return (
    <div className="group bg-white rounded-xl overflow-hidden transition-all duration-300 hover:shadow-card-hover">
      <div className="relative aspect-[334/367] overflow-hidden bg-bg-ivory">
        <Image
          src={product.images?.[0] || 'https://placehold.co/300x300?text=No+Image'}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-opacity duration-500"
          unoptimized
        />
        {product.images?.[1] && (
          <Image
            src={product.images[1]}
            alt={`${product.name} hover`}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            unoptimized
          />
        )}

        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.salePercent && <SaleBadge variant="sale" percent={product.salePercent} />}
          {product.isNew && <SaleBadge variant="new" />}
          {product.isHot && <SaleBadge variant="hot" />}
          {product.isFeatured && <SaleBadge variant="featured" />}
        </div>

        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
          <button
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm ${
              wishlisted ? 'bg-primary text-white' : 'bg-white/90 text-heading hover:bg-primary hover:text-white'
            }`}
            onClick={() => toggleWishlist(product.id)}
            aria-label="Add to wishlist"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill={wishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
          <button
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm ${
              compared ? 'bg-primary text-white' : 'bg-white/90 text-heading hover:bg-primary hover:text-white'
            }`}
            onClick={() => toggleCompare(product.id)}
            aria-label="Compare"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="16 3 21 3 21 8" />
              <line x1="4" y1="20" x2="21" y2="3" />
              <polyline points="21 16 21 21 16 21" />
              <line x1="15" y1="15" x2="21" y2="21" />
              <line x1="4" y1="4" x2="9" y2="9" />
            </svg>
          </button>
          {onQuickView && (
            <button
              className="w-9 h-9 rounded-full bg-white/90 text-heading hover:bg-primary hover:text-white flex items-center justify-center transition-all duration-300 backdrop-blur-sm"
              onClick={() => onQuickView(product)}
              aria-label="Quick view"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="p-4 text-center">
        {product.rating > 0 && (
          <div className="mb-2 flex justify-center">
            <StarRating rating={product.rating} size="sm" />
          </div>
        )}
        <h3 className="text-sm font-medium text-heading mb-1.5">
          <Link href={`/product/${product.slug}`} className="hover:text-primary transition-colors duration-300">
            {product.name}
          </Link>
        </h3>
        <div className="mb-3">{renderPrice()}</div>
        {hasVariants ? (
          <Link
            href={`/product/${product.slug}`}
            className="inline-block border border-border text-heading text-xs uppercase tracking-[1.5px] font-medium px-6 py-2.5 rounded-full hover:bg-primary hover:border-primary hover:text-white transition-all duration-300"
          >
            Select Options
          </Link>
        ) : (
          <button
            className="border border-border text-heading text-xs uppercase tracking-[1.5px] font-medium px-6 py-2.5 rounded-full hover:bg-primary hover:border-primary hover:text-white transition-all duration-300"
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
}
