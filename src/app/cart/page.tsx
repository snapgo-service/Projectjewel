'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/store/CartContext';
import { formatCurrency } from '@/utils/formatCurrency';
import Breadcrumb from '@/components/layout/Breadcrumb';
import QuantitySelector from '@/components/ui/QuantitySelector';
import styles from './page.module.css';

export default function CartPage() {
  const { items, subtotal, removeItem, updateQuantity } = useCart();

  const shipping = subtotal >= 199 ? 0 : 15;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <>
        <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Cart' }]} />
        <div className={styles.emptyCart}>
          <h2>Your Cart is Empty</h2>
          <p>Looks like you haven&apos;t added anything to your cart yet.</p>
          <Link href="/shop" className={styles.checkoutBtn} style={{ maxWidth: 300, margin: '0 auto' }}>
            Continue Shopping
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Cart' }]} />
      <div className={styles.page}>
        <div className={styles.container}>
          <h1 className={styles.title}>Shopping Cart</h1>
          <div className={styles.layout}>
            <div>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Subtotal</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => {
                    const price = item.product.salePrice || item.product.price;
                    return (
                      <tr key={item.product.id}>
                        <td>
                          <div className={styles.productCell}>
                            <div className={styles.productImage}>
                              <Image
                                src={item.product.images?.[0] || 'https://placehold.co/80x80?text=No+Image'}
                                alt={item.product.name}
                                fill
                                sizes="80px"
                                style={{ objectFit: 'cover' }}
                                unoptimized
                              />
                            </div>
                            <div className={styles.productName}>
                              <Link href={`/product/${item.product.slug}`}>
                                {item.product.name}
                              </Link>
                            </div>
                          </div>
                        </td>
                        <td className={styles.price}>{formatCurrency(price)}</td>
                        <td>
                          <QuantitySelector
                            value={item.quantity}
                            onChange={(q) => updateQuantity(item.product.id, q)}
                          />
                        </td>
                        <td className={styles.subtotal}>
                          {formatCurrency(price * item.quantity)}
                        </td>
                        <td>
                          <button
                            className={styles.removeBtn}
                            onClick={() => removeItem(item.product.id)}
                          >
                            ×
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className={styles.summary}>
              <h3 className={styles.summaryTitle}>Cart Totals</h3>
              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Shipping</span>
                <span>{shipping === 0 ? 'Free' : formatCurrency(shipping)}</span>
              </div>
              {shipping > 0 && (
                <div className={styles.summaryRow} style={{ fontSize: 13, color: '#ce967e' }}>
                  <span>Free shipping on orders over $199</span>
                </div>
              )}
              <div className={styles.summaryTotal}>
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
              <Link href="/checkout" className={styles.checkoutBtn}>
                Proceed to Checkout
              </Link>
              <Link href="/shop" className={styles.continueBtn}>
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
