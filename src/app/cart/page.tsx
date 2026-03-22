'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/store/CartContext';
import { formatCurrency } from '@/utils/formatCurrency';
import Breadcrumb from '@/components/layout/Breadcrumb';
import QuantitySelector from '@/components/ui/QuantitySelector';

export default function CartPage() {
  const { items, subtotal, removeItem, updateQuantity } = useCart();

  const shipping = subtotal >= 199 ? 0 : 15;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <>
        <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Cart' }]} />
        <div className="flex flex-col items-center justify-center text-center py-20 px-4">
          <div className="text-6xl mb-6 text-body-light">🛒</div>
          <h2 className="text-2xl font-semibold text-heading mb-3">Your Cart is Empty</h2>
          <p className="text-body mb-8">Looks like you haven&apos;t added anything to your cart yet.</p>
          <Link
            href="/shop"
            className="bg-primary hover:bg-primary-hover text-white rounded-full px-10 py-4 font-medium transition-colors max-w-[300px]"
          >
            Continue Shopping
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Cart' }]} />
      <div className="bg-bg-ivory min-h-screen py-10">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl font-semibold text-heading mb-8">Shopping Cart</h1>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              {/* Table header - hidden on mobile */}
              <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 pb-4 border-b border-border text-sm font-medium text-body-light uppercase tracking-wide">
                <span>Product</span>
                <span>Price</span>
                <span>Quantity</span>
                <span>Subtotal</span>
                <span></span>
              </div>

              {/* Cart rows */}
              {items.map((item) => {
                const price = item.product.salePrice || item.product.price;
                return (
                  <div
                    key={item.product.id}
                    className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 items-center py-6 border-b border-border"
                  >
                    {/* Product */}
                    <div className="flex items-center gap-4">
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-white">
                        <Image
                          src={item.product.images?.[0] || 'https://placehold.co/80x80?text=No+Image'}
                          alt={item.product.name}
                          fill
                          sizes="80px"
                          style={{ objectFit: 'cover' }}
                          unoptimized
                        />
                      </div>
                      <Link
                        href={`/product/${item.product.slug}`}
                        className="text-heading font-medium hover:text-primary transition-colors"
                      >
                        {item.product.name}
                      </Link>
                    </div>

                    {/* Price */}
                    <div className="text-body font-medium">
                      <span className="md:hidden text-body-light text-sm mr-2">Price:</span>
                      {formatCurrency(price)}
                    </div>

                    {/* Quantity */}
                    <div>
                      <QuantitySelector
                        value={item.quantity}
                        onChange={(q) => updateQuantity(item.product.id, q)}
                      />
                    </div>

                    {/* Subtotal */}
                    <div className="text-heading font-semibold">
                      <span className="md:hidden text-body-light text-sm mr-2">Subtotal:</span>
                      {formatCurrency(price * item.quantity)}
                    </div>

                    {/* Remove */}
                    <button
                      className="text-body-light hover:text-error text-2xl transition-colors leading-none cursor-pointer"
                      onClick={() => removeItem(item.product.id)}
                      aria-label="Remove item"
                    >
                      &times;
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Summary */}
            <div>
              <div className="bg-white rounded-xl p-8 shadow-card sticky top-24">
                <h3 className="text-xl font-semibold text-heading mb-6">Cart Totals</h3>
                <div className="flex justify-between py-3 border-b border-border text-body">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-border text-body">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : formatCurrency(shipping)}</span>
                </div>
                {shipping > 0 && (
                  <div className="py-2 text-[13px] text-primary">
                    Free shipping on orders over $199
                  </div>
                )}
                <div className="flex justify-between py-4 text-heading font-bold text-lg">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
                <Link
                  href="/checkout"
                  className="block text-center bg-primary hover:bg-primary-hover text-white rounded-full w-full py-4 font-medium transition-colors mt-4"
                >
                  Proceed to Checkout
                </Link>
                <Link
                  href="/shop"
                  className="block text-center text-primary hover:text-primary-hover font-medium mt-4 transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
