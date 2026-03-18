'use client';

import { use, useState } from 'react';
import Image from 'next/image';
import { useAdmin } from '@/store/AdminContext';
import { useCart } from '@/store/CartContext';
import { useWishlist } from '@/store/WishlistContext';
import { formatCurrency } from '@/utils/formatCurrency';
import Breadcrumb from '@/components/layout/Breadcrumb';
import StarRating from '@/components/ui/StarRating';
import QuantitySelector from '@/components/ui/QuantitySelector';
import { ProductGrid } from '@/components/product/ProductGrid';
import styles from './page.module.css';

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { products, categories } = useAdmin();
  const product = products.find((p) => p.slug === slug);
  const { addItem } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();

  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState('description');

  if (!product) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 15px' }}>
        <h1>Product Not Found</h1>
        <p>The product you&apos;re looking for doesn&apos;t exist.</p>
      </div>
    );
  }

  const category = categories.find((c) => c.slug === product.category);
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);
  const wishlisted = isInWishlist(product.id);

  const colorVariants = product.variants.filter((v) => v.type === 'color');
  const sizeVariants = product.variants.filter((v) => v.type === 'size');

  const handleAddToCart = () => {
    addItem({ product, quantity, selectedVariants });
    setQuantity(1);
  };

  return (
    <>
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: category?.name || 'Shop', href: `/category/${product.category}` },
          { label: product.name },
        ]}
      />
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.productLayout}>
            {/* Gallery */}
            <div className={styles.gallery}>
              <div className={styles.mainImage}>
                <Image
                  src={product.images?.[activeImage] || product.images?.[0] || 'https://placehold.co/600x600?text=No+Image'}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{ objectFit: 'cover' }}
                  priority
                  unoptimized
                />
              </div>
              <div className={styles.thumbnails}>
                {(product.images || []).filter(Boolean).map((img, i) => (
                  <button
                    key={i}
                    className={`${styles.thumb} ${i === activeImage ? styles.thumbActive : ''}`}
                    onClick={() => setActiveImage(i)}
                  >
                    <Image src={img} alt={`${product.name} ${i + 1}`} fill sizes="80px" style={{ objectFit: 'cover' }} unoptimized />
                  </button>
                ))}
              </div>
            </div>

            {/* Info */}
            <div className={styles.info}>
              <div className={styles.category}>{category?.name}</div>
              <h1 className={styles.name}>{product.name}</h1>

              {product.rating > 0 && (
                <div className={styles.ratingRow}>
                  <StarRating rating={product.rating} />
                  <span className={styles.reviewCount}>({product.reviewCount} reviews)</span>
                </div>
              )}

              <div className={styles.priceRow}>
                {product.salePrice ? (
                  <>
                    <span className={styles.originalPrice}>{formatCurrency(product.price)}</span>
                    <span className={styles.currentPrice}>{formatCurrency(product.salePrice)}</span>
                    {product.salePercent && (
                      <span className={styles.saveBadge}>-{product.salePercent}%</span>
                    )}
                  </>
                ) : product.priceRange ? (
                  <span className={styles.currentPrice}>
                    {formatCurrency(product.priceRange[0])} – {formatCurrency(product.priceRange[1])}
                  </span>
                ) : (
                  <span className={styles.currentPrice}>{formatCurrency(product.price)}</span>
                )}
              </div>

              <p className={styles.description}>{product.shortDescription}</p>

              {colorVariants.length > 0 && (
                <div className={styles.variants}>
                  <div className={styles.variantLabel}>Color</div>
                  <div className={styles.variantOptions}>
                    {colorVariants.map((v) => (
                      <button
                        key={v.value}
                        className={`${styles.colorBtn} ${selectedVariants.color === v.value ? styles.colorBtnActive : ''}`}
                        style={{ backgroundColor: v.value }}
                        onClick={() => setSelectedVariants({ ...selectedVariants, color: v.value })}
                        title={v.label}
                      />
                    ))}
                  </div>
                </div>
              )}

              {sizeVariants.length > 0 && (
                <div className={styles.variants}>
                  <div className={styles.variantLabel}>Size</div>
                  <div className={styles.variantOptions}>
                    {sizeVariants.map((v) => (
                      <button
                        key={v.value}
                        className={`${styles.variantBtn} ${selectedVariants.size === v.value ? styles.variantBtnActive : ''}`}
                        onClick={() => setSelectedVariants({ ...selectedVariants, size: v.value })}
                      >
                        {v.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className={styles.addToCartRow}>
                <QuantitySelector value={quantity} onChange={setQuantity} />
                <button className={styles.addToCartBtn} onClick={handleAddToCart}>
                  Add to Cart
                </button>
                <button
                  className={`${styles.wishlistBtn} ${wishlisted ? styles.wishlistBtnActive : ''}`}
                  onClick={() => toggleItem(product.id)}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill={wishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </button>
              </div>

              <div className={styles.meta}>
                <div><span className={styles.metaLabel}>SKU:</span> {product.sku}</div>
                <div><span className={styles.metaLabel}>Category:</span> {category?.name}</div>
                <div><span className={styles.metaLabel}>Tags:</span> {product.tags.join(', ')}</div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className={styles.tabs}>
            <button
              className={`${styles.tabBtn} ${activeTab === 'description' ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveTab('description')}
            >
              Description
            </button>
            <button
              className={`${styles.tabBtn} ${activeTab === 'reviews' ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              Reviews ({product.reviewCount})
            </button>
          </div>

          <div className={styles.tabContent}>
            {activeTab === 'description' ? (
              <p>{product.description}</p>
            ) : (
              <div>
                {product.reviewCount === 0 ? (
                  <p>No reviews yet. Be the first to review this product!</p>
                ) : (
                  Array.from({ length: Math.min(product.reviewCount, 3) }).map((_, i) => (
                    <div key={i} className={styles.reviewItem}>
                      <div className={styles.reviewAuthor}>Customer {i + 1}</div>
                      <StarRating rating={product.rating} size="sm" />
                      <div className={styles.reviewDate}>January {10 + i}, 2024</div>
                      <p className={styles.reviewText}>
                        Beautiful piece of jewelry! The quality is excellent and it looks even better in person.
                        Would highly recommend to anyone looking for fine jewelry.
                      </p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {relatedProducts.length > 0 && (
            <div className={styles.relatedSection}>
              <h2 className={styles.sectionTitle}>Related Products</h2>
              <ProductGrid products={relatedProducts} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
