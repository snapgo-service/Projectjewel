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
      <div className="text-center py-24 px-4">
        <h1 className="text-2xl font-medium text-heading">Product Not Found</h1>
        <p className="text-body mt-2">The product you&apos;re looking for doesn&apos;t exist.</p>
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
      <div className="py-12 md:py-16">
        <div className="max-w-[1430px] mx-auto px-4">
          {/* Product Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Gallery */}
            <div className="relative">
              <div className="relative w-full aspect-square bg-bg-blush overflow-hidden rounded-xl mb-4">
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
              <div className="flex gap-3">
                {(product.images || []).filter(Boolean).map((img, i) => (
                  <button
                    key={i}
                    className={`w-20 h-20 relative bg-bg-blush cursor-pointer rounded-lg overflow-hidden border-2 transition-colors duration-300 ${
                      i === activeImage ? 'border-primary' : 'border-transparent'
                    }`}
                    onClick={() => setActiveImage(i)}
                  >
                    <Image src={img} alt={`${product.name} ${i + 1}`} fill sizes="80px" style={{ objectFit: 'cover' }} unoptimized />
                  </button>
                ))}
              </div>
            </div>

            {/* Info */}
            <div className="pt-2">
              <div className="text-xs uppercase tracking-wider text-primary mb-3">{category?.name}</div>
              <h1 className="text-3xl font-medium text-heading mb-4 leading-snug font-[family-name:var(--font-serif)]">{product.name}</h1>

              {product.rating > 0 && (
                <div className="flex items-center gap-3 mb-4">
                  <StarRating rating={product.rating} />
                  <span className="text-body-light text-sm">({product.reviewCount} reviews)</span>
                </div>
              )}

              <div className="flex items-center gap-3 mb-5">
                {product.salePrice ? (
                  <>
                    <span className="text-lg text-body-light line-through">{formatCurrency(product.price)}</span>
                    <span className="text-2xl font-semibold text-heading">{formatCurrency(product.salePrice)}</span>
                    {product.salePercent && (
                      <span className="text-xs bg-primary text-white px-2 py-1 rounded-full">-{product.salePercent}%</span>
                    )}
                  </>
                ) : product.priceRange ? (
                  <span className="text-2xl font-semibold text-heading">
                    {formatCurrency(product.priceRange[0])}
                  </span>
                ) : (
                  <span className="text-2xl font-semibold text-heading">{formatCurrency(product.price)}</span>
                )}
              </div>

              <p className="text-body leading-relaxed mb-6 pb-6 border-b border-border">{product.shortDescription}</p>

              {colorVariants.length > 0 && (
                <div className="mb-6">
                  <div className="text-sm font-medium text-heading mb-3 uppercase tracking-wider">Color</div>
                  <div className="flex gap-3">
                    {colorVariants.map((v) => (
                      <button
                        key={v.value}
                        className={`w-9 h-9 rounded-full border-2 cursor-pointer transition-all duration-300 hover:scale-110 ${
                          selectedVariants.color === v.value ? 'border-heading scale-110' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: v.value }}
                        onClick={() => setSelectedVariants({ ...selectedVariants, color: v.value })}
                        title={v.label}
                      />
                    ))}
                  </div>
                </div>
              )}

              {sizeVariants.length > 0 && (
                <div className="mb-6">
                  <div className="text-sm font-medium text-heading mb-3 uppercase tracking-wider">Size</div>
                  <div className="flex gap-3">
                    {sizeVariants.map((v) => (
                      <button
                        key={v.value}
                        className={`px-5 py-2 bg-white text-sm cursor-pointer rounded-full transition-all duration-300 ${
                          selectedVariants.size === v.value
                            ? 'ring-2 ring-primary text-primary border border-primary'
                            : 'border border-border hover:border-primary hover:text-primary'
                        }`}
                        onClick={() => setSelectedVariants({ ...selectedVariants, size: v.value })}
                      >
                        {v.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-4 items-center mb-6">
                <QuantitySelector value={quantity} onChange={setQuantity} />
                <button
                  className="px-9 py-3 bg-primary text-white uppercase text-sm font-medium tracking-widest rounded-full cursor-pointer transition-all duration-300 hover:bg-[#D4849A]"
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </button>
                <button
                  className={`w-12 h-12 border rounded-full bg-white flex items-center justify-center cursor-pointer transition-all duration-300 ${
                    wishlisted ? 'border-primary text-primary' : 'border-border hover:border-primary hover:text-primary'
                  }`}
                  onClick={() => toggleItem(product.id)}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill={wishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </button>
              </div>

              <div className="text-sm text-body flex flex-col gap-2">
                <div><span className="font-medium text-heading">SKU:</span> {product.sku}</div>
                <div><span className="font-medium text-heading">Category:</span> {category?.name}</div>
                <div><span className="font-medium text-heading">Tags:</span> {product.tags.join(', ')}</div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-border mb-8">
            <button
              className={`px-6 py-3 text-sm font-medium uppercase tracking-wider border-b-2 transition-all duration-300 bg-transparent cursor-pointer ${
                activeTab === 'description'
                  ? 'text-primary border-primary'
                  : 'text-body border-transparent hover:text-primary hover:border-primary'
              }`}
              onClick={() => setActiveTab('description')}
            >
              Description
            </button>
            <button
              className={`px-6 py-3 text-sm font-medium uppercase tracking-wider border-b-2 transition-all duration-300 bg-transparent cursor-pointer ${
                activeTab === 'reviews'
                  ? 'text-primary border-primary'
                  : 'text-body border-transparent hover:text-primary hover:border-primary'
              }`}
              onClick={() => setActiveTab('reviews')}
            >
              Reviews ({reviews.length})
            </button>
          </div>

          <div className="text-body leading-relaxed">
            {activeTab === 'description' ? (
              <p>{product.description}</p>
            ) : (
              <div>
                {/* Review Form */}
                {session?.user && canReview && (
                  <div className="py-5 border-b border-border mb-5">
                    <div className="text-base font-medium text-heading mb-4">Write a Review</div>
                    <div className="flex gap-1 mb-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          className={`bg-transparent border-none cursor-pointer p-0 text-2xl transition-colors duration-200 ${
                            star <= (reviewHover || reviewRating) ? 'text-star' : 'text-gray-300'
                          }`}
                          onMouseEnter={() => setReviewHover(star)}
                          onMouseLeave={() => setReviewHover(0)}
                          onClick={() => setReviewRating(star)}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                    <textarea
                      className="w-full min-h-[100px] p-3 border border-border rounded-lg font-[inherit] text-sm resize-y mb-4 focus:outline-none focus:border-primary"
                      placeholder="Share your experience with this product..."
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                    />
                    <button
                      className="px-6 py-2.5 bg-primary text-white text-sm uppercase tracking-wider rounded-full cursor-pointer transition-colors duration-300 hover:bg-[#D4849A] disabled:bg-gray-300 disabled:cursor-not-allowed"
                      onClick={handleSubmitReview}
                      disabled={reviewSubmitting || !reviewRating || !reviewComment.trim()}
                    >
                      {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </div>
                )}

                {!session?.user && (
                  <p className="px-4 py-3 rounded-lg mb-4 text-sm text-body bg-bg-blush border border-border">Please log in to leave a review.</p>
                )}

                {session?.user && !canReview && reviewReason === 'not_purchased' && (
                  <p className="px-4 py-3 rounded-lg mb-4 text-sm text-body bg-bg-blush border border-border">You can only review products you have purchased.</p>
                )}

                {session?.user && !canReview && reviewReason === 'already_reviewed' && (
                  <p className="px-4 py-3 rounded-lg mb-4 text-sm text-body bg-bg-blush border border-border">You have already reviewed this product.</p>
                )}

                {reviewMessage && (
                  <p className="px-4 py-3 rounded-lg mb-4 text-sm text-body bg-bg-blush border border-border">{reviewMessage}</p>
                )}

                {/* Reviews List */}
                {reviews.length === 0 ? (
                  <p>No reviews yet. Be the first to review this product!</p>
                ) : (
                  reviews.map((review) => (
                    <div key={review._id} className="py-5 border-b border-border">
                      <div className="font-medium text-heading mb-1">{review.userName}</div>
                      <StarRating rating={review.rating} size="sm" />
                      <div className="text-xs text-body-light mt-1 mb-2">
                        {new Date(review.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </div>
                      <p className="text-body leading-relaxed">{review.comment}</p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {relatedProducts.length > 0 && (
            <div className="pt-12 mt-12 border-t border-border">
              <h2 className="text-2xl md:text-3xl font-medium text-heading text-center mb-8 font-[family-name:var(--font-serif)]">Related Products</h2>
              <ProductGrid products={relatedProducts} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
