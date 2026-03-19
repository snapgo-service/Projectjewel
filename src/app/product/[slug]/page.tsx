'use client';

import { use, useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useAdmin } from '@/store/AdminContext';
import { useCart } from '@/store/CartContext';
import { useWishlist } from '@/store/WishlistContext';
import { formatCurrency } from '@/utils/formatCurrency';
import Breadcrumb from '@/components/layout/Breadcrumb';
import StarRating from '@/components/ui/StarRating';
import QuantitySelector from '@/components/ui/QuantitySelector';
import { ProductGrid } from '@/components/product/ProductGrid';
import styles from './page.module.css';

interface ReviewData {
  _id: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { products, categories } = useAdmin();
  const product = products.find((p) => p.slug === slug);
  const { addItem } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();

  const { data: session } = useSession();
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState('description');
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [canReview, setCanReview] = useState(false);
  const [reviewReason, setReviewReason] = useState('');
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewHover, setReviewHover] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewMessage, setReviewMessage] = useState('');

  if (!product) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 15px' }}>
        <h1>Product Not Found</h1>
        <p>The product you&apos;re looking for doesn&apos;t exist.</p>
      </div>
    );
  }

  const fetchReviews = useCallback(async () => {
    const res = await fetch(`/api/reviews?productId=${product.id}`);
    if (res.ok) setReviews(await res.json());
  }, [product.id]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  useEffect(() => {
    if (session?.user) {
      fetch(`/api/reviews/can-review?productId=${product.id}`)
        .then(res => res.json())
        .then(data => {
          setCanReview(data.canReview);
          setReviewReason(data.reason || '');
        });
    }
  }, [session, product.id]);

  const handleSubmitReview = async () => {
    if (!reviewRating || !reviewComment.trim()) return;
    setReviewSubmitting(true);
    setReviewMessage('');
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id, rating: reviewRating, comment: reviewComment }),
      });
      const data = await res.json();
      if (res.ok) {
        setReviewMessage('Thank you for your review!');
        setReviewRating(0);
        setReviewComment('');
        setCanReview(false);
        fetchReviews();
      } else {
        setReviewMessage(data.error || 'Failed to submit review');
      }
    } catch {
      setReviewMessage('Failed to submit review');
    }
    setReviewSubmitting(false);
  };

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
                    {formatCurrency(product.priceRange[0])}
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
              Reviews ({reviews.length})
            </button>
          </div>

          <div className={styles.tabContent}>
            {activeTab === 'description' ? (
              <p>{product.description}</p>
            ) : (
              <div>
                {/* Review Form */}
                {session?.user && canReview && (
                  <div className={styles.reviewForm}>
                    <div className={styles.reviewFormTitle}>Write a Review</div>
                    <div className={styles.starSelect}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          className={`${styles.starBtn} ${star <= (reviewHover || reviewRating) ? styles.starBtnActive : ''}`}
                          onMouseEnter={() => setReviewHover(star)}
                          onMouseLeave={() => setReviewHover(0)}
                          onClick={() => setReviewRating(star)}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                    <textarea
                      className={styles.reviewTextarea}
                      placeholder="Share your experience with this product..."
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                    />
                    <button
                      className={styles.submitReviewBtn}
                      onClick={handleSubmitReview}
                      disabled={reviewSubmitting || !reviewRating || !reviewComment.trim()}
                    >
                      {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </div>
                )}

                {!session?.user && (
                  <p className={styles.reviewMessage}>Please log in to leave a review.</p>
                )}

                {session?.user && !canReview && reviewReason === 'not_purchased' && (
                  <p className={styles.reviewMessage}>You can only review products you have purchased.</p>
                )}

                {session?.user && !canReview && reviewReason === 'already_reviewed' && (
                  <p className={styles.reviewMessage}>You have already reviewed this product.</p>
                )}

                {reviewMessage && (
                  <p className={styles.reviewMessage}>{reviewMessage}</p>
                )}

                {/* Reviews List */}
                {reviews.length === 0 ? (
                  <p>No reviews yet. Be the first to review this product!</p>
                ) : (
                  reviews.map((review) => (
                    <div key={review._id} className={styles.reviewItem}>
                      <div className={styles.reviewAuthor}>{review.userName}</div>
                      <StarRating rating={review.rating} size="sm" />
                      <div className={styles.reviewDate}>
                        {new Date(review.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </div>
                      <p className={styles.reviewText}>{review.comment}</p>
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
