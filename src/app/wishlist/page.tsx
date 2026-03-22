'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useWishlist } from '@/store/WishlistContext';
import { useAdmin } from '@/store/AdminContext';
import { useCart } from '@/store/CartContext';
import { formatCurrency } from '@/utils/formatCurrency';
import Breadcrumb from '@/components/layout/Breadcrumb';

export default function WishlistPage() {
  const { items: wishlistIds, toggleItem, clearWishlist } = useWishlist();
  const { products } = useAdmin();
  const { addItem } = useCart();

  const wishlistProducts = products.filter((p) => wishlistIds.includes(p.id));

  const handleAddToCart = (product: typeof wishlistProducts[0]) => {
    if (product.variants.length > 0) return;
    addItem({ product, quantity: 1, selectedVariants: {} });
    toggleItem(product.id);
  };

  return (
    <>
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Wishlist' }]} />
      <div className="py-10 pb-16">
        <div className="max-w-[1430px] mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl md:text-[32px] font-medium text-heading font-[family-name:var(--font-serif)]">My Wishlist</h1>
            {wishlistProducts.length > 0 && (
              <button
                className="bg-transparent border border-border px-5 py-2 text-xs text-body uppercase tracking-wider cursor-pointer transition-all duration-300 hover:border-error hover:text-error rounded-full"
                onClick={clearWishlist}
              >
                Clear All
              </button>
            )}
          </div>

          {wishlistProducts.length === 0 ? (
            <div className="text-center py-16 px-4">
              <svg className="mx-auto mb-5" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#E8A0BF" strokeWidth="1.5">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              <h2 className="text-2xl font-medium text-heading mb-3">Your Wishlist is Empty</h2>
              <p className="text-body mb-6">Save your favorite items here to buy them later.</p>
              <Link href="/shop" className="inline-block px-10 py-3.5 bg-primary text-white no-underline uppercase text-sm font-medium tracking-widest rounded-full transition-all duration-300 hover:bg-primary-hover">
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {wishlistProducts.map((product) => (
                <div key={product.id} className="relative bg-white border border-border rounded-xl overflow-hidden transition-shadow duration-300 hover:shadow-card-hover">
                  <button
                    className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full border-none bg-white shadow-md cursor-pointer text-lg text-body-light flex items-center justify-center transition-all duration-300 hover:bg-error hover:text-white"
                    onClick={() => toggleItem(product.id)}
                    aria-label="Remove from wishlist"
                  >
                    &times;
                  </button>
                  <Link href={`/product/${product.slug}`} className="block">
                    <div className="relative w-full pt-[100%] bg-bg-ivory">
                      <Image
                        src={product.images?.[0] || 'https://placehold.co/300x300?text=No+Image'}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  </Link>
                  <div className="p-4">
                    <Link href={`/product/${product.slug}`} className="block text-sm font-medium text-heading no-underline mb-2 leading-snug line-clamp-2 hover:text-primary transition-colors">
                      {product.name}
                    </Link>
                    <div className="flex gap-2 items-center mb-2">
                      {product.salePrice ? (
                        <>
                          <span className="text-sm text-body-light line-through">{formatCurrency(product.price)}</span>
                          <span className="text-base font-semibold text-primary">{formatCurrency(product.salePrice)}</span>
                        </>
                      ) : (
                        <span className="text-base font-semibold text-primary">{formatCurrency(product.price)}</span>
                      )}
                    </div>
                    <div className="mb-3 text-xs">
                      {product.inStock ? (
                        <span className="text-success">In Stock</span>
                      ) : (
                        <span className="text-error">Out of Stock</span>
                      )}
                    </div>
                    {product.variants.length > 0 ? (
                      <Link href={`/product/${product.slug}`} className="block w-full py-2.5 bg-heading text-white text-center no-underline text-xs font-medium uppercase tracking-wider rounded-full transition-all duration-300 hover:bg-primary">
                        Select Options
                      </Link>
                    ) : (
                      <button
                        className="block w-full py-2.5 bg-heading text-white border-none cursor-pointer text-xs font-medium uppercase tracking-wider rounded-full transition-all duration-300 hover:bg-primary disabled:bg-gray-300 disabled:cursor-not-allowed"
                        onClick={() => handleAddToCart(product)}
                        disabled={!product.inStock}
                      >
                        Add to Cart
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
