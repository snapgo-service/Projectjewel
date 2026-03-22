'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCompare } from '@/store/CompareContext';
import { useAdmin } from '@/store/AdminContext';
import { useCart } from '@/store/CartContext';
import { formatCurrency } from '@/utils/formatCurrency';
import StarRating from '@/components/ui/StarRating';
import Breadcrumb from '@/components/layout/Breadcrumb';

export default function ComparePage() {
  const { items: compareIds, toggleItem, clearCompare } = useCompare();
  const { products } = useAdmin();
  const { addItem } = useCart();

  const compareProducts = products.filter((p) => compareIds.includes(p.id));

  const handleAddToCart = (product: typeof compareProducts[0]) => {
    if (product.variants.length > 0) return;
    addItem({ product, quantity: 1, selectedVariants: {} });
  };

  return (
    <>
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Compare' }]} />
      <div className="py-10 pb-16">
        <div className="max-w-[1430px] mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl md:text-[32px] font-medium text-heading font-[family-name:var(--font-serif)]">Compare Products</h1>
            {compareProducts.length > 0 && (
              <button
                className="bg-transparent border border-border px-5 py-2 text-xs text-body uppercase tracking-wider cursor-pointer transition-all duration-300 hover:border-error hover:text-error rounded-full"
                onClick={clearCompare}
              >
                Clear All
              </button>
            )}
          </div>

          {compareProducts.length === 0 ? (
            <div className="text-center py-16 px-4">
              <svg className="mx-auto mb-5" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#E8A0BF" strokeWidth="1.5">
                <polyline points="16 3 21 3 21 8" />
                <line x1="4" y1="20" x2="21" y2="3" />
                <polyline points="21 16 21 21 16 21" />
                <line x1="15" y1="15" x2="21" y2="21" />
                <line x1="4" y1="4" x2="9" y2="9" />
              </svg>
              <h2 className="text-2xl font-medium text-heading mb-3">No Products to Compare</h2>
              <p className="text-body mb-6">Add products to compare by clicking the compare icon on product cards.</p>
              <Link href="/shop" className="inline-block px-10 py-3.5 bg-primary text-white no-underline uppercase text-sm font-medium tracking-widest rounded-full transition-all duration-300 hover:bg-primary-hover">
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-card overflow-x-auto">
              <table className="w-full border-collapse min-w-[600px]">
                <tbody>
                  <tr>
                    <th className="text-left px-5 py-4 bg-bg-ivory text-sm font-semibold text-heading uppercase tracking-wider border-b border-border w-[140px] align-top">Product</th>
                    {compareProducts.map((product) => (
                      <td key={product.id} className="px-5 py-4 border-b border-border text-sm text-body align-top">
                        <div className="relative flex flex-col items-center gap-3 text-center">
                          <button
                            className="absolute -top-1 -right-1 w-7 h-7 rounded-full border-none bg-bg-ivory cursor-pointer text-base text-body-light flex items-center justify-center transition-all duration-300 hover:bg-error hover:text-white"
                            onClick={() => toggleItem(product.id)}
                          >
                            &times;
                          </button>
                          <Link href={`/product/${product.slug}`} className="relative w-40 h-40 block rounded-lg overflow-hidden bg-bg-ivory">
                            <Image
                              src={product.images?.[0] || 'https://placehold.co/200x200?text=No+Image'}
                              alt={product.name}
                              fill
                              sizes="200px"
                              className="object-cover"
                              unoptimized
                            />
                          </Link>
                          <Link href={`/product/${product.slug}`} className="text-sm font-medium text-heading no-underline leading-snug hover:text-primary transition-colors">
                            {product.name}
                          </Link>
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr className="bg-bg-blush/50">
                    <th className="text-left px-5 py-4 bg-bg-ivory text-sm font-semibold text-heading uppercase tracking-wider border-b border-border w-[140px] align-top">Price</th>
                    {compareProducts.map((product) => (
                      <td key={product.id} className="px-5 py-4 border-b border-border text-sm text-body align-top">
                        <div className="flex gap-2 items-center">
                          {product.salePrice ? (
                            <>
                              <span className="line-through text-body-light text-xs">{formatCurrency(product.price)}</span>
                              <span className="font-semibold text-primary text-base">{formatCurrency(product.salePrice)}</span>
                            </>
                          ) : (
                            <span className="font-semibold text-primary text-base">{formatCurrency(product.price)}</span>
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <th className="text-left px-5 py-4 bg-bg-ivory text-sm font-semibold text-heading uppercase tracking-wider border-b border-border w-[140px] align-top">Rating</th>
                    {compareProducts.map((product) => (
                      <td key={product.id} className="px-5 py-4 border-b border-border text-sm text-body align-top">
                        {product.rating > 0 ? (
                          <div className="flex items-center gap-1.5">
                            <StarRating rating={product.rating} size="sm" />
                            <span>({product.reviewCount})</span>
                          </div>
                        ) : (
                          <span className="text-body-light italic">No reviews</span>
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr className="bg-bg-blush/50">
                    <th className="text-left px-5 py-4 bg-bg-ivory text-sm font-semibold text-heading uppercase tracking-wider border-b border-border w-[140px] align-top">Category</th>
                    {compareProducts.map((product) => (
                      <td key={product.id} className="px-5 py-4 border-b border-border text-sm text-body align-top capitalize">{product.category}</td>
                    ))}
                  </tr>
                  <tr>
                    <th className="text-left px-5 py-4 bg-bg-ivory text-sm font-semibold text-heading uppercase tracking-wider border-b border-border w-[140px] align-top">Availability</th>
                    {compareProducts.map((product) => (
                      <td key={product.id} className="px-5 py-4 border-b border-border text-sm align-top">
                        {product.inStock ? (
                          <span className="text-success font-medium">In Stock</span>
                        ) : (
                          <span className="text-error font-medium">Out of Stock</span>
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr className="bg-bg-blush/50">
                    <th className="text-left px-5 py-4 bg-bg-ivory text-sm font-semibold text-heading uppercase tracking-wider border-b border-border w-[140px] align-top">SKU</th>
                    {compareProducts.map((product) => (
                      <td key={product.id} className="px-5 py-4 border-b border-border text-sm text-body align-top">{product.sku}</td>
                    ))}
                  </tr>
                  <tr>
                    <th className="text-left px-5 py-4 bg-bg-ivory text-sm font-semibold text-heading uppercase tracking-wider border-b border-border w-[140px] align-top">Description</th>
                    {compareProducts.map((product) => (
                      <td key={product.id} className="px-5 py-4 border-b border-border text-sm text-body align-top leading-relaxed max-w-[250px]">{product.shortDescription}</td>
                    ))}
                  </tr>
                  <tr className="bg-bg-blush/50">
                    <th className="text-left px-5 py-4 bg-bg-ivory text-sm font-semibold text-heading uppercase tracking-wider border-b border-border w-[140px] align-top">Action</th>
                    {compareProducts.map((product) => (
                      <td key={product.id} className="px-5 py-4 border-b border-border text-sm align-top">
                        {product.variants.length > 0 ? (
                          <Link href={`/product/${product.slug}`} className="inline-block px-6 py-2.5 bg-heading text-white no-underline text-xs font-medium uppercase tracking-wider text-center rounded-full transition-all duration-300 hover:bg-primary">
                            Select Options
                          </Link>
                        ) : (
                          <button
                            className="inline-block px-6 py-2.5 bg-heading text-white border-none cursor-pointer text-xs font-medium uppercase tracking-wider text-center rounded-full transition-all duration-300 hover:bg-primary disabled:bg-gray-300 disabled:cursor-not-allowed"
                            onClick={() => handleAddToCart(product)}
                            disabled={!product.inStock}
                          >
                            Add to Cart
                          </button>
                        )}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
