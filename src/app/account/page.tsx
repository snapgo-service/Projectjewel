'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import Breadcrumb from '@/components/layout/Breadcrumb';

type AccountTab = 'dashboard' | 'orders' | 'addresses' | 'details';

interface UserOrder {
  id: string;
  date: string;
  total: number;
  status: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  paymentMethod?: string;
  items: { productId: string; productName: string; quantity: number; price: number }[];
}

function AccountContent() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/account';

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<AccountTab>('dashboard');
  const [orders, setOrders] = useState<UserOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [returnModal, setReturnModal] = useState<string | null>(null);
  const [returnReason, setReturnReason] = useState('');

  const [address, setAddress] = useState({ street: '', city: '', state: '', zip: '', country: 'IN', phone: '' });
  const [addressSaved, setAddressSaved] = useState(false);
  const [detailsName, setDetailsName] = useState('');
  const [detailsEmail, setDetailsEmail] = useState('');
  const [detailsSaved, setDetailsSaved] = useState(false);

  useEffect(() => { if (session?.user) { setDetailsName(session.user.name || ''); setDetailsEmail(session.user.email || ''); } }, [session]);
  useEffect(() => { if (typeof window !== 'undefined') { const saved = localStorage.getItem('jubilee-address'); if (saved) { try { setAddress(JSON.parse(saved)); } catch { /* ignore */ } } } }, []);
  useEffect(() => {
    if (activeTab === 'orders' && session) {
      setOrdersLoading(true);
      fetch('/api/orders').then(res => res.ok ? res.json() : []).then(data => setOrders(Array.isArray(data) ? data : [])).catch(() => setOrders([])).finally(() => setOrdersLoading(false));
    }
  }, [activeTab, session]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setLoading(true);
    const result = await signIn('credentials', { email, password, redirect: false });
    if (result?.error) { setError('Invalid email or password'); setLoading(false); } else { window.location.href = callbackUrl; }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const res = await fetch('/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, email, password }) });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Registration failed'); setLoading(false); return; }
      await signIn('credentials', { email, password, redirect: false });
      window.location.href = '/account';
    } catch { setError('Registration failed. Please try again.'); setLoading(false); }
  };

  const handleSaveAddress = (e: React.FormEvent) => { e.preventDefault(); localStorage.setItem('jubilee-address', JSON.stringify(address)); setAddressSaved(true); setTimeout(() => setAddressSaved(false), 3000); };
  const handleSaveDetails = (e: React.FormEvent) => { e.preventDefault(); setDetailsSaved(true); setTimeout(() => setDetailsSaved(false), 3000); };

  const inputCls = "w-full px-4 py-3 rounded-lg border border-border text-sm text-heading focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all";
  const labelCls = "block text-sm font-medium text-heading mb-1.5";

  if (status === 'loading') {
    return (
      <>
        <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'My Account' }]} />
        <div className="text-center py-20 text-body">Loading...</div>
      </>
    );
  }

  if (session) {
    const tabs: { key: AccountTab; label: string }[] = [
      { key: 'dashboard', label: 'Dashboard' },
      { key: 'orders', label: 'Orders' },
      { key: 'addresses', label: 'Addresses' },
      { key: 'details', label: 'Account Details' },
    ];

    const statusColors: Record<string, string> = {
      delivered: 'bg-green-50 text-green-700',
      processing: 'bg-amber-50 text-amber-700',
      shipped: 'bg-blue-50 text-blue-700',
      cancelled: 'bg-red-50 text-red-700',
      return_requested: 'bg-amber-50 text-amber-700',
      returned: 'bg-blue-50 text-blue-700',
      pending: 'bg-gray-100 text-gray-600',
    };

    return (
      <>
        <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'My Account' }]} />
        <div className="py-12 md:py-16">
          <div className="max-w-[1430px] mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-10">
              {/* Sidebar */}
              <div>
                <h3 className="text-xl font-medium text-heading mb-5">My Account</h3>
                <div className="flex flex-col gap-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`text-left px-4 py-3 rounded-lg text-sm transition-all duration-300 ${
                        activeTab === tab.key
                          ? 'bg-primary text-white font-medium'
                          : 'text-body hover:bg-bg-blush hover:text-primary'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="text-left px-4 py-3 rounded-lg text-sm text-error hover:bg-red-50 transition-all duration-300"
                  >
                    Logout
                  </button>
                </div>
              </div>

              {/* Content */}
              <div>
                {activeTab === 'dashboard' && (
                  <>
                    <h2 className="text-2xl font-medium text-heading mb-4">Dashboard</h2>
                    <p className="text-body leading-relaxed mb-8">
                      Welcome back, <strong className="text-heading">{session.user?.name || session.user?.email}</strong>! From your account dashboard you can view your recent orders, manage your shipping addresses, and edit your account details.
                    </p>
                    {session.user?.role === 'admin' && (
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                        <strong>Admin Account</strong> — <a href="/admin" className="text-primary underline">Go to Admin Panel</a>
                      </div>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div onClick={() => setActiveTab('orders')} className="bg-white rounded-xl p-6 shadow-card cursor-pointer hover:shadow-card-hover transition-all duration-300">
                        <h4 className="text-heading font-medium mb-1">My Orders</h4>
                        <p className="text-body text-sm">View and track your orders</p>
                      </div>
                      <div onClick={() => setActiveTab('addresses')} className="bg-white rounded-xl p-6 shadow-card cursor-pointer hover:shadow-card-hover transition-all duration-300">
                        <h4 className="text-heading font-medium mb-1">Addresses</h4>
                        <p className="text-body text-sm">Manage your shipping address</p>
                      </div>
                      <div onClick={() => setActiveTab('details')} className="bg-white rounded-xl p-6 shadow-card cursor-pointer hover:shadow-card-hover transition-all duration-300">
                        <h4 className="text-heading font-medium mb-1">Account Details</h4>
                        <p className="text-body text-sm">Edit your name and email</p>
                      </div>
                      <div onClick={() => signOut({ callbackUrl: '/' })} className="bg-red-50 rounded-xl p-6 cursor-pointer hover:bg-red-100 transition-all duration-300">
                        <h4 className="text-error font-medium mb-1">Logout</h4>
                        <p className="text-body text-sm">Sign out of your account</p>
                      </div>
                    </div>
                  </>
                )}

                {activeTab === 'orders' && (
                  <>
                    <h2 className="text-2xl font-medium text-heading mb-5">My Orders</h2>
                    {ordersLoading ? (
                      <div className="text-center py-10 text-body">Loading orders...</div>
                    ) : orders.length === 0 ? (
                      <div className="bg-white rounded-xl p-10 text-center shadow-card">
                        <p className="text-body mb-3">No orders yet.</p>
                        <a href="/shop" className="text-primary underline font-medium">Start shopping</a>
                      </div>
                    ) : (
                      <div className="bg-white rounded-xl shadow-card overflow-hidden">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b-2 border-border text-left">
                              <th className="px-4 py-3 text-sm font-medium text-heading">Order</th>
                              <th className="px-4 py-3 text-sm font-medium text-heading">Date</th>
                              <th className="px-4 py-3 text-sm font-medium text-heading">Status</th>
                              <th className="px-4 py-3 text-sm font-medium text-heading">Total</th>
                              <th className="px-4 py-3 text-sm font-medium text-heading">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {orders.map((order) => (
                              <React.Fragment key={order.id}>
                                <tr className={expandedOrder === order.id ? '' : 'border-b border-border'}>
                                  <td className="px-4 py-3">
                                    <button onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)} className="text-primary font-medium text-sm underline">{order.id}</button>
                                  </td>
                                  <td className="px-4 py-3 text-sm text-body">{order.date}</td>
                                  <td className="px-4 py-3">
                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium capitalize ${statusColors[order.status] || 'bg-gray-100 text-gray-600'}`}>
                                      {order.status === 'return_requested' ? 'Return Requested' : order.status}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3 text-sm font-medium text-heading">₹{order.total}</td>
                                  <td className="px-4 py-3">
                                    {(order.status === 'pending' || order.status === 'processing') && (
                                      <button onClick={async () => { if (!confirm('Cancel this order?')) return; const res = await fetch(`/api/orders/${order.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'cancelled' }) }); if (res.ok) setOrders(orders.map(o => o.id === order.id ? { ...o, status: 'cancelled' } : o)); }} className="px-3 py-1 text-xs border border-error text-error rounded-full hover:bg-error hover:text-white transition-all">Cancel</button>
                                    )}
                                    {order.status === 'delivered' && (
                                      <button onClick={() => { setReturnModal(order.id); setReturnReason(''); }} className="px-3 py-1 text-xs border border-amber-600 text-amber-600 rounded-full hover:bg-amber-600 hover:text-white transition-all">Return / Exchange</button>
                                    )}
                                    {order.status === 'return_requested' && <span className="text-xs text-amber-600">Return in progress</span>}
                                    {['shipped', 'cancelled', 'returned'].includes(order.status) && <span className="text-xs text-body-light">—</span>}
                                  </td>
                                </tr>
                                {expandedOrder === order.id && (
                                  <tr className="border-b border-border">
                                    <td colSpan={5} className="px-4 pb-4">
                                      <div className="bg-bg-ivory rounded-xl p-5 mt-1">
                                        <div className="grid grid-cols-2 gap-4 mb-5">
                                          <div><div className="text-xs text-body-light mb-1">Customer</div><div className="text-sm text-heading">{order.customerName}</div></div>
                                          <div><div className="text-xs text-body-light mb-1">Email</div><div className="text-sm text-heading">{order.email}</div></div>
                                          <div><div className="text-xs text-body-light mb-1">Phone</div><div className="text-sm text-heading">{order.phone || '—'}</div></div>
                                          <div><div className="text-xs text-body-light mb-1">Payment</div><div className="text-sm text-heading uppercase">{order.paymentMethod || 'COD'}</div></div>
                                          <div className="col-span-2"><div className="text-xs text-body-light mb-1">Shipping Address</div><div className="text-sm text-heading">{order.address}</div></div>
                                        </div>
                                        <div className="text-sm font-medium text-heading mb-3">Items</div>
                                        <table className="w-full">
                                          <thead><tr className="border-b border-border"><th className="py-2 px-2 text-xs text-body-light text-left font-medium">Product</th><th className="py-2 px-2 text-xs text-body-light text-center font-medium">Qty</th><th className="py-2 px-2 text-xs text-body-light text-right font-medium">Price</th><th className="py-2 px-2 text-xs text-body-light text-right font-medium">Subtotal</th></tr></thead>
                                          <tbody>
                                            {order.items.map((item, idx) => (
                                              <tr key={idx} className="border-b border-border/50"><td className="py-2 px-2 text-sm text-heading">{item.productName}</td><td className="py-2 px-2 text-sm text-body text-center">{item.quantity}</td><td className="py-2 px-2 text-sm text-body text-right">₹{item.price}</td><td className="py-2 px-2 text-sm text-heading font-medium text-right">₹{item.quantity * item.price}</td></tr>
                                            ))}
                                          </tbody>
                                        </table>
                                        <div className="text-right mt-3 text-lg font-semibold text-heading">Total: ₹{order.total}</div>
                                      </div>
                                    </td>
                                  </tr>
                                )}
                              </React.Fragment>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {returnModal && (
                      <div className="fixed inset-0 bg-heading/50 backdrop-blur-sm z-[200] flex items-center justify-center p-4" onClick={() => setReturnModal(null)}>
                        <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-card-hover" onClick={e => e.stopPropagation()}>
                          <h3 className="text-lg font-medium text-heading mb-1">Return / Exchange Request</h3>
                          <p className="text-xs text-body-light mb-5">Order: {returnModal}</p>
                          <div className="bg-amber-50 p-4 rounded-lg mb-5 text-sm text-amber-700 leading-relaxed">
                            <strong>Exchange Policy:</strong> You can exchange the product for a different size, color, or a similar product of equal value. Returns are processed within 7 days of delivery.
                          </div>
                          <label className={labelCls}>Reason for Return / Exchange *</label>
                          <select value={returnReason} onChange={e => setReturnReason(e.target.value)} className={`${inputCls} mb-5`}>
                            <option value="">Select a reason</option>
                            <option value="wrong_size">Wrong Size</option>
                            <option value="wrong_color">Wrong Color</option>
                            <option value="defective">Defective / Damaged Product</option>
                            <option value="not_as_described">Product Not As Described</option>
                            <option value="exchange_other">Want to Exchange for Another Product</option>
                            <option value="other">Other</option>
                          </select>
                          <div className="flex gap-3">
                            <button onClick={async () => { if (!returnReason) { alert('Please select a reason'); return; } const res = await fetch(`/api/orders/${returnModal}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'return_requested', returnReason }) }); if (res.ok) { setOrders(orders.map(o => o.id === returnModal ? { ...o, status: 'return_requested' } : o)); setReturnModal(null); } }} className="px-6 py-3 bg-primary text-white rounded-full text-sm font-medium hover:bg-primary-hover transition-all">Submit Request</button>
                            <button onClick={() => setReturnModal(null)} className="px-6 py-3 border border-border text-body rounded-full text-sm hover:bg-bg-blush transition-all">Cancel</button>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {activeTab === 'addresses' && (
                  <>
                    <h2 className="text-2xl font-medium text-heading mb-5">Shipping Address</h2>
                    {addressSaved && <div className="bg-green-50 text-green-700 px-4 py-3 rounded-lg mb-4 text-sm">Address saved successfully!</div>}
                    <form onSubmit={handleSaveAddress} className="max-w-xl">
                      <div className="mb-4">
                        <label className={labelCls}>Street Address *</label>
                        <input type="text" required value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} className={inputCls} placeholder="House number and street name" />
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div><label className={labelCls}>City *</label><input type="text" required value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} className={inputCls} /></div>
                        <div><label className={labelCls}>State *</label><input type="text" required value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} className={inputCls} /></div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div><label className={labelCls}>ZIP Code *</label><input type="text" required value={address.zip} onChange={(e) => setAddress({ ...address, zip: e.target.value })} className={inputCls} /></div>
                        <div><label className={labelCls}>Country *</label><select value={address.country} onChange={(e) => setAddress({ ...address, country: e.target.value })} className={inputCls}><option value="IN">India</option><option value="US">United States</option><option value="CA">Canada</option><option value="UK">United Kingdom</option><option value="AU">Australia</option></select></div>
                      </div>
                      <div className="mb-6"><label className={labelCls}>Phone *</label><input type="tel" required value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} className={inputCls} /></div>
                      <button type="submit" className="px-8 py-3 bg-primary text-white rounded-full text-sm font-medium uppercase tracking-wider hover:bg-primary-hover transition-all">Save Address</button>
                    </form>
                  </>
                )}

                {activeTab === 'details' && (
                  <>
                    <h2 className="text-2xl font-medium text-heading mb-5">Account Details</h2>
                    {detailsSaved && <div className="bg-green-50 text-green-700 px-4 py-3 rounded-lg mb-4 text-sm">Details saved successfully!</div>}
                    <form onSubmit={handleSaveDetails} className="max-w-xl">
                      <div className="mb-4"><label className={labelCls}>Full Name</label><input type="text" value={detailsName} onChange={(e) => setDetailsName(e.target.value)} className={inputCls} /></div>
                      <div className="mb-4">
                        <label className={labelCls}>Email Address</label>
                        <input type="email" value={detailsEmail} disabled className={`${inputCls} bg-bg-ivory text-body-light`} />
                        <p className="text-xs text-body-light mt-1">Email cannot be changed</p>
                      </div>
                      <div className="mb-6 p-5 bg-white rounded-xl shadow-card">
                        <h4 className="text-heading font-medium mb-4">Change Password</h4>
                        <div className="mb-3"><label className={labelCls}>Current Password</label><input type="password" className={inputCls} placeholder="Leave blank to keep current" /></div>
                        <div className="mb-3"><label className={labelCls}>New Password</label><input type="password" className={inputCls} placeholder="Leave blank to keep current" /></div>
                        <div><label className={labelCls}>Confirm New Password</label><input type="password" className={inputCls} placeholder="Leave blank to keep current" /></div>
                      </div>
                      <button type="submit" className="px-8 py-3 bg-primary text-white rounded-full text-sm font-medium uppercase tracking-wider hover:bg-primary-hover transition-all">Save Changes</button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Login / Register form
  return (
    <>
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'My Account' }]} />
      <div className="py-12 md:py-16">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-card p-8 md:p-10">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-medium text-heading mb-2">{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
              <p className="text-body text-sm">{isLogin ? 'Please login to your account.' : 'Create a new account to get started.'}</p>
            </div>

            {error && <div className="bg-red-50 text-error px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>}

            <form onSubmit={isLogin ? handleLogin : handleRegister}>
              {!isLogin && (
                <div className="mb-4"><label className={labelCls}>Full Name *</label><input type="text" required value={name} onChange={(e) => setName(e.target.value)} className={inputCls} /></div>
              )}
              <div className="mb-4"><label className={labelCls}>Email *</label><input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} /></div>
              <div className="mb-6"><label className={labelCls}>Password *</label><input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className={inputCls} /></div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-primary text-white rounded-full text-sm font-medium uppercase tracking-wider hover:bg-primary-hover transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Please wait...' : isLogin ? 'Login' : 'Register'}
              </button>
            </form>

            <div className="text-center mt-5">
              <button
                onClick={() => { setIsLogin(!isLogin); setError(''); }}
                className="text-primary text-sm font-medium hover:underline"
              >
                {isLogin ? "Don't have an account? Register" : 'Already have an account? Login'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-body">Loading...</div>}>
      <AccountContent />
    </Suspense>
  );
}
