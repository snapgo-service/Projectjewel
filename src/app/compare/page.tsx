'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCompare } from '@/store/CompareContext';
import { useAdmin } from '@/store/AdminContext';
import { useCart } from '@/store/CartContext';
import { formatCurrency } from '@/utils/formatCurrency';
import StarRating from '@/components/ui/StarRating';
import Breadcrumb from '@/components/layout/Breadcrumb';
import styles from './page.module.css';

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
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={styles.title}>Compare Products</h1>
            {compareProducts.length > 0 && (
              <button className={styles.clearBtn} onClick={clearCompare}>
                Clear All
              </button>
            )}
          </div>

          {compareProducts.length === 0 ? (
            <div className={styles.empty}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5">
                <polyline points="16 3 21 3 21 8" />
                <line x1="4" y1="20" x2="21" y2="3" />
                <polyline points="21 16 21 21 16 21" />
                <line x1="15" y1="15" x2="21" y2="21" />
                <line x1="4" y1="4" x2="9" y2="9" />
              </svg>
              <h2>No Products to Compare</h2>
              <p>Add products to compare by clicking the compare icon on product cards.</p>
              <Link href="/shop" className={styles.shopBtn}>
                Browse Products
              </Link>
            </div>
          ) : (
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <tbody>
                  <tr>
                    <th>Product</th>
                    {compareProducts.map((product) => (
                      <td key={product.id}>
                        <div className={styles.productCell}>
                          <button
                            className={styles.removeBtn}
                            onClick={() => toggleItem(product.id)}
                          >
                            &times;
                          </button>
                          <Link href={`/product/${product.slug}`} className={styles.productImage}>
                            <Image
                              src={product.images?.[0] || 'https://placehold.co/200x200?text=No+Image'}
                              alt={product.name}
                              fill
                              sizes="200px"
                              style={{ objectFit: 'cover' }}
                              unoptimized
                            />
                          </Link>
                          <Link href={`/product/${product.slug}`} className={styles.productName}>
                            {product.name}
                          </Link>
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <th>Price</th>
                    {compareProducts.map((product) => (
                      <td key={product.id}>
                        <div className={styles.priceCell}>
                          {product.salePrice ? (
                            <>
                              <span className={styles.originalPrice}>{formatCurrency(product.price)}</span>
                              <span className={styles.salePrice}>{formatCurrency(product.salePrice)}</span>
                            </>
                          ) : (
                            <span className={styles.salePrice}>{formatCurrency(product.price)}</span>
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <th>Rating</th>
                    {compareProducts.map((product) => (
                      <td key={product.id}>
                        {product.rating > 0 ? (
                          <div className={styles.ratingCell}>
                            <StarRating rating={product.rating} size="sm" />
                            <span>({product.reviewCount})</span>
                          </div>
                        ) : (
                          <span className={styles.noRating}>No reviews</span>
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <th>Category</th>
                    {compareProducts.map((product) => (
                      <td key={product.id} className={styles.capitalize}>{product.category}</td>
                    ))}
                  </tr>
                  <tr>
                    <th>Availability</th>
                    {compareProducts.map((product) => (
                      <td key={product.id}>
                        {product.inStock ? (
                          <span className={styles.inStock}>In Stock</span>
                        ) : (
                          <span className={styles.outOfStock}>Out of Stock</span>
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <th>SKU</th>
                    {compareProducts.map((product) => (
                      <td key={product.id}>{product.sku}</td>
                    ))}
                  </tr>
                  <tr>
                    <th>Description</th>
                    {compareProducts.map((product) => (
                      <td key={product.id} className={styles.descCell}>{product.shortDescription}</td>
                    ))}
                  </tr>
                  <tr>
                    <th>Action</th>
                    {compareProducts.map((product) => (
                      <td key={product.id}>
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
