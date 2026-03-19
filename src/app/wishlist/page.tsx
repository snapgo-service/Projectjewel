'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useWishlist } from '@/store/WishlistContext';
import { useAdmin } from '@/store/AdminContext';
import { useCart } from '@/store/CartContext';
import { formatCurrency } from '@/utils/formatCurrency';
import Breadcrumb from '@/components/layout/Breadcrumb';
import styles from './page.module.css';

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
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={styles.title}>My Wishlist</h1>
            {wishlistProducts.length > 0 && (
              <button className={styles.clearBtn} onClick={clearWishlist}>
                Clear All
              </button>
            )}
          </div>

          {wishlistProducts.length === 0 ? (
            <div className={styles.empty}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              <h2>Your Wishlist is Empty</h2>
              <p>Save your favorite items here to buy them later.</p>
              <Link href="/shop" className={styles.shopBtn}>
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className={styles.grid}>
              {wishlistProducts.map((product) => (
                <div key={product.id} className={styles.card}>
                  <button
                    className={styles.removeBtn}
                    onClick={() => toggleItem(product.id)}
                    aria-label="Remove from wishlist"
                  >
                    &times;
                  </button>
                  <Link href={`/product/${product.slug}`} className={styles.imageLink}>
                    <div className={styles.imageWrapper}>
                      <Image
                        src={product.images?.[0] || 'https://placehold.co/300x300?text=No+Image'}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        style={{ objectFit: 'cover' }}
                        unoptimized
                      />
                    </div>
                  </Link>
                  <div className={styles.info}>
                    <Link href={`/product/${product.slug}`} className={styles.name}>
                      {product.name}
                    </Link>
                    <div className={styles.priceRow}>
                      {product.salePrice ? (
                        <>
                          <span className={styles.originalPrice}>{formatCurrency(product.price)}</span>
                          <span className={styles.price}>{formatCurrency(product.salePrice)}</span>
                        </>
                      ) : (
                        <span className={styles.price}>{formatCurrency(product.price)}</span>
                      )}
                    </div>
                    <div className={styles.stock}>
                      {product.inStock ? (
                        <span className={styles.inStock}>In Stock</span>
                      ) : (
                        <span className={styles.outOfStock}>Out of Stock</span>
                      )}
                    </div>
                    {product.variants.length > 0 ? (
                      <Link href={`/product/${product.slug}`} className={styles.addToCartBtn}>
                        Select Options
                      </Link>
                    ) : (
                      <button
                        className={styles.addToCartBtn}
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
