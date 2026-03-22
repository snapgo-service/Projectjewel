'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { useSession } from 'next-auth/react';
import { useCart } from '@/store/CartContext';
import { useAdmin } from '@/store/AdminContext';
import { formatCurrency } from '@/utils/formatCurrency';
import Breadcrumb from '@/components/layout/Breadcrumb';

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const { data: session } = useSession();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { coupons } = useAdmin();
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountType: 'percentage' | 'fixed'; discountValue: number } | null>(null);

  const [form, setForm] = useState({
    firstName: '', lastName: '', company: '', country: 'IN',
    address: '', city: '', state: '', zip: '', phone: '', email: '', notes: '',
  });

  // Auto-fill from session + last order address
  useEffect(() => {
    if (!session?.user) return;

    const nameParts = (session.user.name || '').split(' ');
    setForm(prev => ({
      ...prev,
      firstName: nameParts[0] || '',
      lastName: nameParts.slice(1).join(' ') || '',
      email: session.user?.email || '',
    }));

    // Fetch last order to pre-fill address & phone
    fetch('/api/orders')
      .then(res => res.ok ? res.json() : [])
      .then((orders: { customerName?: string; email?: string; phone?: string; address?: string }[]) => {
        if (orders.length > 0) {
          const last = orders[0]; // already sorted by date desc
          const addrParts = (last.address || '').split(',').map((s: string) => s.trim());
          setForm(prev => ({
            ...prev,
            phone: prev.phone || last.phone || '',
            address: prev.address || addrParts[0] || '',
            city: prev.city || addrParts[1] || '',
            state: prev.state || (addrParts[2] || '').split(' ')[0] || '',
            zip: prev.zip || (addrParts[2] || '').split(' ')[1] || '',
          }));
        }
      })
      .catch(() => { /* ignore - just won't pre-fill */ });
  }, [session]);

  const applyCoupon = () => {
    setCouponError('');
    const code = couponCode.trim().toUpperCase();
    if (!code) { setCouponError('Please enter a coupon code'); return; }

    const coupon = coupons.find(c => c.code.toUpperCase() === code);
    if (!coupon) { setCouponError('Invalid coupon code'); return; }
    if (!coupon.isActive) { setCouponError('This coupon is no longer active'); return; }
    if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) { setCouponError('This coupon has expired'); return; }
    if (coupon.maxUses > 0 && coupon.currentUses >= coupon.maxUses) { setCouponError('This coupon has reached its usage limit'); return; }
    if (coupon.minOrderAmount > 0 && subtotal < coupon.minOrderAmount) { setCouponError(`Minimum order amount is ₹${coupon.minOrderAmount}`); return; }
    if (coupon.applicableProducts.length > 0) {
      const hasApplicable = items.some(item => coupon.applicableProducts.includes(item.product.id));
      if (!hasApplicable) { setCouponError('This coupon is not applicable to items in your cart'); return; }
    }

    setAppliedCoupon({ code: coupon.code, discountType: coupon.discountType, discountValue: coupon.discountValue });
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
  };

  const discountAmount = appliedCoupon
    ? (appliedCoupon.discountType === 'percentage'
      ? Math.round(subtotal * (appliedCoupon.discountValue / 100))
      : Math.min(appliedCoupon.discountValue, subtotal))
    : 0;
  const afterDiscount = subtotal - discountAmount;
  const shipping = afterDiscount >= 199 ? 0 : 15;
  const total = afterDiscount + shipping;

  const updateForm = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const getOrderData = () => ({
    customerName: `${form.firstName} ${form.lastName}`,
    email: form.email,
    phone: form.phone,
    address: `${form.address}, ${form.city}, ${form.state} ${form.zip}, ${form.country}`,
    items: items.map(item => ({
      productId: item.product.id,
      productName: item.product.name,
      quantity: item.quantity,
      price: item.product.salePrice || item.product.price,
    })),
    total,
    couponCode: appliedCoupon?.code || undefined,
    discount: discountAmount,
  });

  const handleCOD = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...getOrderData(), paymentMethod: 'cod' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to place order');
      setOrderId(data.id);
      clearCart();
      setOrderPlaced(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const handleRazorpay = async () => {
    setLoading(true);
    setError('');
    try {
      // Create Razorpay order
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: total, currency: 'INR' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create payment');

      // Open Razorpay checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: 'Stellora Silver',
        description: 'Jewellery Order Payment',
        order_id: data.orderId,
        handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          // Verify payment
          const verifyRes = await fetch('/api/checkout/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderData: getOrderData(),
            }),
          });
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            setOrderId(verifyData.orderId);
            clearCart();
            setOrderPlaced(true);
          } else {
            setError('Payment verification failed');
          }
        },
        prefill: {
          name: `${form.firstName} ${form.lastName}`,
          email: form.email,
          contact: form.phone,
        },
        theme: { color: '#E8A0BF' },
        modal: {
          ondismiss: () => { setLoading(false); },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed');
      setLoading(false);
    }
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentMethod === 'razorpay') {
      handleRazorpay();
    } else {
      handleCOD();
    }
  };

  if (orderPlaced) {
    return (
      <>
        <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Order Confirmed' }]} />
        <div className="flex flex-col items-center justify-center text-center py-20 px-4 min-h-[60vh]">
          <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center text-success text-4xl font-bold mb-6">
            &#10003;
          </div>
          <h2 className="text-3xl font-semibold text-heading mb-3">Thank You for Your Order!</h2>
          {orderId && (
            <p className="text-base text-primary font-medium mb-3">Order ID: {orderId}</p>
          )}
          <p className="text-body mb-8 max-w-md">
            Your order has been placed successfully. We&apos;ll send you a confirmation email shortly.
          </p>
          <Link
            href="/shop"
            className="bg-primary hover:bg-primary-hover text-white rounded-full px-10 py-4 font-medium transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </>
    );
  }

  if (items.length === 0) {
    return (
      <>
        <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Checkout' }]} />
        <div className="flex flex-col items-center justify-center text-center py-20 px-4">
          <h2 className="text-2xl font-semibold text-heading mb-3">Your cart is empty</h2>
          <p className="text-body mb-6">Add some items before checkout.</p>
          <Link
            href="/shop"
            className="bg-primary hover:bg-primary-hover text-white rounded-full px-10 py-4 font-medium transition-colors"
          >
            Go to Shop
          </Link>
        </div>
      </>
    );
  }

  const inputClasses = "w-full rounded-lg border border-border focus:ring-2 focus:ring-primary/30 focus:border-primary px-4 py-3 text-heading outline-none transition-all";

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Checkout' }]} />
      <div className="bg-bg-ivory min-h-screen py-10">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl font-semibold text-heading mb-8">Checkout</h1>

          {error && (
            <div className="bg-error/10 text-error px-4 py-3 rounded-lg mb-6 text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handlePlaceOrder}>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
              {/* Billing Form */}
              <div className="lg:col-span-3">
                <div className="bg-white rounded-xl p-8 shadow-card">
                  <h3 className="text-xl font-semibold text-heading mb-6">Billing Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="text-sm font-medium text-heading mb-1.5 block">
                        First Name <span className="text-error">*</span>
                      </label>
                      <input type="text" className={inputClasses} required value={form.firstName} onChange={(e) => updateForm('firstName', e.target.value)} />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-heading mb-1.5 block">
                        Last Name <span className="text-error">*</span>
                      </label>
                      <input type="text" className={inputClasses} required value={form.lastName} onChange={(e) => updateForm('lastName', e.target.value)} />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-heading mb-1.5 block">
                        Company Name (optional)
                      </label>
                      <input type="text" className={inputClasses} value={form.company} onChange={(e) => updateForm('company', e.target.value)} />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-heading mb-1.5 block">
                        Country / Region <span className="text-error">*</span>
                      </label>
                      <select className={inputClasses} required value={form.country} onChange={(e) => updateForm('country', e.target.value)}>
                        <option value="">Select a country</option>
                        <option value="IN">India</option>
                        <option value="US">United States</option>
                        <option value="CA">Canada</option>
                        <option value="UK">United Kingdom</option>
                        <option value="AU">Australia</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-heading mb-1.5 block">
                        Street Address <span className="text-error">*</span>
                      </label>
                      <input type="text" className={inputClasses} placeholder="House number and street name" required value={form.address} onChange={(e) => updateForm('address', e.target.value)} />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-heading mb-1.5 block">
                        City <span className="text-error">*</span>
                      </label>
                      <input type="text" className={inputClasses} required value={form.city} onChange={(e) => updateForm('city', e.target.value)} />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-heading mb-1.5 block">
                        State <span className="text-error">*</span>
                      </label>
                      <input type="text" className={inputClasses} required value={form.state} onChange={(e) => updateForm('state', e.target.value)} />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-heading mb-1.5 block">
                        ZIP Code <span className="text-error">*</span>
                      </label>
                      <input type="text" className={inputClasses} required value={form.zip} onChange={(e) => updateForm('zip', e.target.value)} />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-heading mb-1.5 block">
                        Mobile Number <span className="text-error">*</span>
                      </label>
                      <input type="tel" className={inputClasses} required pattern="[0-9]{10}" minLength={10} maxLength={10} placeholder="10-digit mobile number" title="Please enter a valid 10-digit mobile number" value={form.phone} onChange={(e) => updateForm('phone', e.target.value.replace(/\D/g, '').slice(0, 10))} />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-heading mb-1.5 block">
                        Email Address <span className="text-error">*</span>
                      </label>
                      <input type="email" className={inputClasses} required value={form.email} onChange={(e) => updateForm('email', e.target.value)} />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-heading mb-1.5 block">
                        Order Notes (optional)
                      </label>
                      <textarea className={`${inputClasses} min-h-[100px] resize-y`} placeholder="Notes about your order, e.g. special notes for delivery." value={form.notes} onChange={(e) => updateForm('notes', e.target.value)} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Summary - Sticky */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl p-8 shadow-card sticky top-24">
                  <h3 className="text-xl font-semibold text-heading mb-6">Your Order</h3>

                  {/* Order items */}
                  <div className="space-y-3 mb-4">
                    {items.map((item) => (
                      <div key={item.product.id} className="flex items-center justify-between gap-3 text-sm">
                        <span className="text-heading font-medium flex-1 truncate">{item.product.name}</span>
                        <span className="text-body-light shrink-0">&times; {item.quantity}</span>
                        <span className="text-heading font-medium shrink-0">
                          {formatCurrency((item.product.salePrice || item.product.price) * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Coupon Code */}
                  <div className="py-4 border-y border-border">
                    {appliedCoupon ? (
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-[13px] text-success font-medium">
                            Coupon &quot;{appliedCoupon.code}&quot; applied
                          </span>
                          <div className="text-xs text-success">
                            {appliedCoupon.discountType === 'percentage' ? `${appliedCoupon.discountValue}% off` : `₹${appliedCoupon.discountValue} off`}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={removeCoupon}
                          className="text-error text-xs font-medium hover:underline cursor-pointer bg-transparent border-none"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Enter coupon code"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                            className="flex-1 px-3 py-2 border border-border rounded-lg text-sm uppercase outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                          />
                          <button
                            type="button"
                            onClick={applyCoupon}
                            className="px-5 py-2 bg-heading text-white rounded-lg text-sm font-medium cursor-pointer hover:bg-heading/90 transition-colors whitespace-nowrap"
                          >
                            Apply
                          </button>
                        </div>
                        {couponError && <p className="text-error text-xs mt-1.5">{couponError}</p>}
                      </div>
                    )}
                  </div>

                  {/* Totals */}
                  <div className="flex justify-between py-3 text-body text-sm">
                    <span>Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between py-3 text-sm">
                      <span className="text-body">Discount</span>
                      <span className="text-success font-medium">-{formatCurrency(discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between py-3 text-body text-sm border-b border-border">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'Free' : formatCurrency(shipping)}</span>
                  </div>
                  <div className="flex justify-between py-4 text-heading font-bold text-lg">
                    <span>Total</span>
                    <span>{formatCurrency(total)}</span>
                  </div>

                  {/* Payment Methods */}
                  <div className="space-y-3 mb-6">
                    <label
                      className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        paymentMethod === 'razorpay'
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/40'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value="razorpay"
                        checked={paymentMethod === 'razorpay'}
                        onChange={() => setPaymentMethod('razorpay')}
                        className="accent-primary w-4 h-4"
                      />
                      <span className="text-sm font-medium text-heading">Pay Online (Cards, UPI, Net Banking)</span>
                    </label>
                    <label
                      className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        paymentMethod === 'cod'
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/40'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value="cod"
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                        className="accent-primary w-4 h-4"
                      />
                      <span className="text-sm font-medium text-heading">Cash on Delivery</span>
                    </label>
                    <p className="text-xs text-body-light mt-2">
                      {paymentMethod === 'razorpay'
                        ? 'Pay securely via Razorpay — Cards, UPI, Net Banking.'
                        : 'Pay with cash upon delivery.'}
                    </p>
                  </div>

                  {/* Place Order Button */}
                  <button
                    type="submit"
                    className="bg-primary hover:bg-primary-hover text-white rounded-full w-full py-4 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-base"
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : paymentMethod === 'razorpay' ? 'Pay Now' : 'Place Order'}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
