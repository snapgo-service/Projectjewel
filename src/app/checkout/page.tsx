'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { useSession } from 'next-auth/react';
import { useCart } from '@/store/CartContext';
import { useAdmin } from '@/store/AdminContext';
import { formatCurrency } from '@/utils/formatCurrency';
import Breadcrumb from '@/components/layout/Breadcrumb';
import styles from './page.module.css';

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
    if (coupon.minOrderAmount > 0 && subtotal < coupon.minOrderAmount) { setCouponError(`Minimum order amount is $${coupon.minOrderAmount}`); return; }
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
        name: 'Jubilee Jewelry',
        description: 'Jewelry Order Payment',
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
        theme: { color: '#ce967e' },
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
        <div className={styles.success}>
          <div className={styles.checkmark}>✓</div>
          <h2>Thank You for Your Order!</h2>
          {orderId && <p style={{ fontSize: 16, color: '#ce967e', fontWeight: 500, marginBottom: 10 }}>Order ID: {orderId}</p>}
          <p>Your order has been placed successfully. We&apos;ll send you a confirmation email shortly.</p>
          <Link href="/shop" className={styles.placeOrderBtn} style={{ maxWidth: 300, margin: '0 auto', display: 'inline-block' }}>
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
        <div style={{ textAlign: 'center', padding: '80px 15px' }}>
          <h2>Your cart is empty</h2>
          <p style={{ color: '#666', marginTop: 10 }}>Add some items before checkout.</p>
          <Link href="/shop" className={styles.placeOrderBtn} style={{ maxWidth: 300, margin: '20px auto 0', display: 'inline-block' }}>
            Go to Shop
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Checkout' }]} />
      <div className={styles.page}>
        <div className={styles.container}>
          <h1 className={styles.title}>Checkout</h1>
          {error && (
            <div style={{ background: '#ffebee', color: '#c62828', padding: '12px 15px', borderRadius: 4, marginBottom: 20, fontSize: 14 }}>
              {error}
            </div>
          )}
          <form onSubmit={handlePlaceOrder}>
            <div className={styles.layout}>
              <div className={styles.formSection}>
                <h3>Billing Details</h3>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>First Name <span className={styles.required}>*</span></label>
                    <input type="text" className={styles.input} required value={form.firstName} onChange={(e) => updateForm('firstName', e.target.value)} />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Last Name <span className={styles.required}>*</span></label>
                    <input type="text" className={styles.input} required value={form.lastName} onChange={(e) => updateForm('lastName', e.target.value)} />
                  </div>
                  <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label className={styles.label}>Company Name (optional)</label>
                    <input type="text" className={styles.input} value={form.company} onChange={(e) => updateForm('company', e.target.value)} />
                  </div>
                  <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label className={styles.label}>Country / Region <span className={styles.required}>*</span></label>
                    <select className={styles.select} required value={form.country} onChange={(e) => updateForm('country', e.target.value)}>
                      <option value="">Select a country</option>
                      <option value="IN">India</option>
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="UK">United Kingdom</option>
                      <option value="AU">Australia</option>
                    </select>
                  </div>
                  <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label className={styles.label}>Street Address <span className={styles.required}>*</span></label>
                    <input type="text" className={styles.input} placeholder="House number and street name" required value={form.address} onChange={(e) => updateForm('address', e.target.value)} />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>City <span className={styles.required}>*</span></label>
                    <input type="text" className={styles.input} required value={form.city} onChange={(e) => updateForm('city', e.target.value)} />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>State <span className={styles.required}>*</span></label>
                    <input type="text" className={styles.input} required value={form.state} onChange={(e) => updateForm('state', e.target.value)} />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>ZIP Code <span className={styles.required}>*</span></label>
                    <input type="text" className={styles.input} required value={form.zip} onChange={(e) => updateForm('zip', e.target.value)} />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Mobile Number <span className={styles.required}>*</span></label>
                    <input type="tel" className={styles.input} required pattern="[0-9]{10}" minLength={10} maxLength={10} placeholder="10-digit mobile number" title="Please enter a valid 10-digit mobile number" value={form.phone} onChange={(e) => updateForm('phone', e.target.value.replace(/\D/g, '').slice(0, 10))} />
                  </div>
                  <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label className={styles.label}>Email Address <span className={styles.required}>*</span></label>
                    <input type="email" className={styles.input} required value={form.email} onChange={(e) => updateForm('email', e.target.value)} />
                  </div>
                  <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label className={styles.label}>Order Notes (optional)</label>
                    <textarea className={styles.textarea} placeholder="Notes about your order, e.g. special notes for delivery." value={form.notes} onChange={(e) => updateForm('notes', e.target.value)} />
                  </div>
                </div>
              </div>

              <div className={styles.orderSummary}>
                <h3 className={styles.orderTitle}>Your Order</h3>
                {items.map((item) => (
                  <div key={item.product.id} className={styles.orderItem}>
                    <span className={styles.orderItemName}>{item.product.name}</span>
                    <span className={styles.orderItemQty}>× {item.quantity}</span>
                    <span className={styles.orderItemPrice}>
                      {formatCurrency((item.product.salePrice || item.product.price) * item.quantity)}
                    </span>
                  </div>
                ))}
                {/* Coupon Code */}
                <div style={{ padding: '12px 0', borderBottom: '1px solid #eee' }}>
                  {appliedCoupon ? (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span style={{ fontSize: 13, color: '#059669', fontWeight: 500 }}>
                          Coupon &quot;{appliedCoupon.code}&quot; applied
                        </span>
                        <div style={{ fontSize: 12, color: '#059669' }}>
                          {appliedCoupon.discountType === 'percentage' ? `${appliedCoupon.discountValue}% off` : `$${appliedCoupon.discountValue} off`}
                        </div>
                      </div>
                      <button type="button" onClick={removeCoupon} style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: 12, fontWeight: 500 }}>Remove</button>
                    </div>
                  ) : (
                    <div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <input
                          type="text"
                          placeholder="Enter coupon code"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                          style={{ flex: 1, padding: '8px 12px', border: '1px solid #ddd', borderRadius: 4, fontSize: 13, textTransform: 'uppercase' }}
                        />
                        <button type="button" onClick={applyCoupon} style={{ padding: '8px 16px', background: '#222', color: '#fff', border: 'none', borderRadius: 4, fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap' }}>Apply</button>
                      </div>
                      {couponError && <p style={{ color: '#dc2626', fontSize: 12, marginTop: 4 }}>{couponError}</p>}
                    </div>
                  )}
                </div>
                <div className={styles.orderRow}>
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className={styles.orderRow}>
                    <span>Discount</span>
                    <span style={{ color: '#059669' }}>-{formatCurrency(discountAmount)}</span>
                  </div>
                )}
                <div className={styles.orderRow}>
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : formatCurrency(shipping)}</span>
                </div>
                <div className={styles.orderTotal}>
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>

                <div className={styles.paymentMethod}>
                  <label className={styles.paymentLabel} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, cursor: 'pointer' }}>
                    <input type="radio" name="payment" value="razorpay" checked={paymentMethod === 'razorpay'} onChange={() => setPaymentMethod('razorpay')} />
                    Pay Online (Cards, UPI, Net Banking)
                  </label>
                  <label className={styles.paymentLabel} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                    <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
                    Cash on Delivery
                  </label>
                  <p className={styles.paymentDesc} style={{ marginTop: 8 }}>
                    {paymentMethod === 'razorpay' ? 'Pay securely via Razorpay — Cards, UPI, Net Banking.' : 'Pay with cash upon delivery.'}
                  </p>
                </div>

                <button type="submit" className={styles.placeOrderBtn} disabled={loading}>
                  {loading ? 'Processing...' : paymentMethod === 'razorpay' ? 'Pay Now' : 'Place Order'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
