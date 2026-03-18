'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import Breadcrumb from '@/components/layout/Breadcrumb';

type AccountTab = 'dashboard' | 'orders' | 'addresses' | 'details';

interface UserOrder {
  id: string;
  date: string;
  total: number;
  status: string;
  items: { productName: string; quantity: number; price: number }[];
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

  // Address state
  const [address, setAddress] = useState({
    street: '', city: '', state: '', zip: '', country: 'IN', phone: '',
  });
  const [addressSaved, setAddressSaved] = useState(false);

  // Account details state
  const [detailsName, setDetailsName] = useState('');
  const [detailsEmail, setDetailsEmail] = useState('');
  const [detailsSaved, setDetailsSaved] = useState(false);

  useEffect(() => {
    if (session?.user) {
      setDetailsName(session.user.name || '');
      setDetailsEmail(session.user.email || '');
    }
  }, [session]);

  // Load saved address from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('jubilee-address');
      if (saved) {
        try { setAddress(JSON.parse(saved)); } catch { /* ignore */ }
      }
    }
  }, []);

  // Fetch orders when tab changes to orders
  useEffect(() => {
    if (activeTab === 'orders' && session) {
      setOrdersLoading(true);
      fetch('/api/orders')
        .then(res => res.ok ? res.json() : [])
        .then(data => {
          const userOrders = Array.isArray(data)
            ? data.filter((o: UserOrder & { email?: string }) => o.email === session.user?.email)
            : [];
          setOrders(userOrders);
        })
        .catch(() => setOrders([]))
        .finally(() => setOrdersLoading(false));
    }
  }, [activeTab, session]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await signIn('credentials', { email, password, redirect: false });
    if (result?.error) {
      setError('Invalid email or password');
      setLoading(false);
    } else {
      window.location.href = callbackUrl;
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Registration failed');
        setLoading(false);
        return;
      }
      await signIn('credentials', { email, password, redirect: false });
      window.location.href = '/account';
    } catch {
      setError('Registration failed. Please try again.');
      setLoading(false);
    }
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('jubilee-address', JSON.stringify(address));
    setAddressSaved(true);
    setTimeout(() => setAddressSaved(false), 3000);
  };

  const handleSaveDetails = (e: React.FormEvent) => {
    e.preventDefault();
    setDetailsSaved(true);
    setTimeout(() => setDetailsSaved(false), 3000);
  };

  const inputStyle = { width: '100%', padding: '10px 14px', border: '1px solid #e5e5e5', fontSize: 14, fontFamily: 'var(--font-primary)' };
  const labelStyle = { display: 'block' as const, fontSize: 14, fontWeight: 500, color: '#222', marginBottom: 6 };

  if (status === 'loading') {
    return (
      <>
        <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'My Account' }]} />
        <div style={{ textAlign: 'center', padding: '80px 15px', color: '#666' }}>Loading...</div>
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

    return (
      <>
        <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'My Account' }]} />
        <div style={{ padding: '60px 0' }}>
          <div style={{ maxWidth: 1430, margin: '0 auto', padding: '0 15px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: 40 }}>
              {/* Sidebar */}
              <div>
                <h3 style={{ fontSize: 20, fontWeight: 500, color: '#222', marginBottom: 20 }}>My Account</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {tabs.map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      style={{
                        textAlign: 'left', padding: '10px 15px',
                        background: activeTab === tab.key ? '#ce967e' : 'none',
                        border: '1px solid #e5e5e5', fontSize: 14,
                        color: activeTab === tab.key ? '#fff' : '#666',
                        cursor: 'pointer', transition: 'all 0.3s',
                        fontFamily: 'var(--font-primary)', fontWeight: activeTab === tab.key ? 500 : 400,
                      }}
                    >
                      {tab.label}
                    </button>
                  ))}
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    style={{ textAlign: 'left', padding: '10px 15px', background: 'none', border: '1px solid #e5e5e5', fontSize: 14, color: '#f44336', cursor: 'pointer', fontFamily: 'var(--font-primary)' }}
                  >
                    Logout
                  </button>
                </div>
              </div>

              {/* Content */}
              <div>
                {activeTab === 'dashboard' && (
                  <>
                    <h2 style={{ fontSize: 24, fontWeight: 500, color: '#222', marginBottom: 15 }}>Dashboard</h2>
                    <p style={{ color: '#666', lineHeight: 1.8, marginBottom: 30 }}>
                      Welcome back, <strong>{session.user?.name || session.user?.email}</strong>! From your account dashboard you can view your recent orders,
                      manage your shipping and billing addresses, and edit your account details.
                    </p>
                    {session.user?.role === 'admin' && (
                      <div style={{ background: '#fff3e0', padding: '15px 20px', borderRadius: 8, marginBottom: 20, border: '1px solid #ffe0b2' }}>
                        <strong>Admin Account</strong> — <a href="/admin" style={{ color: '#ce967e', textDecoration: 'underline' }}>Go to Admin Panel</a>
                      </div>
                    )}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                      <div onClick={() => setActiveTab('orders')} style={{ background: '#f7f7f7', padding: 25, borderRadius: 8, cursor: 'pointer', transition: 'all 0.3s', border: '1px solid transparent' }}>
                        <h4 style={{ fontSize: 16, color: '#222', marginBottom: 8 }}>My Orders</h4>
                        <p style={{ color: '#666', fontSize: 14 }}>View and track your orders</p>
                      </div>
                      <div onClick={() => setActiveTab('addresses')} style={{ background: '#f7f7f7', padding: 25, borderRadius: 8, cursor: 'pointer', transition: 'all 0.3s', border: '1px solid transparent' }}>
                        <h4 style={{ fontSize: 16, color: '#222', marginBottom: 8 }}>Addresses</h4>
                        <p style={{ color: '#666', fontSize: 14 }}>Manage your shipping address</p>
                      </div>
                      <div onClick={() => setActiveTab('details')} style={{ background: '#f7f7f7', padding: 25, borderRadius: 8, cursor: 'pointer', transition: 'all 0.3s', border: '1px solid transparent' }}>
                        <h4 style={{ fontSize: 16, color: '#222', marginBottom: 8 }}>Account Details</h4>
                        <p style={{ color: '#666', fontSize: 14 }}>Edit your name and email</p>
                      </div>
                      <div onClick={() => signOut({ callbackUrl: '/' })} style={{ background: '#fff5f5', padding: 25, borderRadius: 8, cursor: 'pointer', transition: 'all 0.3s', border: '1px solid transparent' }}>
                        <h4 style={{ fontSize: 16, color: '#f44336', marginBottom: 8 }}>Logout</h4>
                        <p style={{ color: '#666', fontSize: 14 }}>Sign out of your account</p>
                      </div>
                    </div>
                  </>
                )}

                {activeTab === 'orders' && (
                  <>
                    <h2 style={{ fontSize: 24, fontWeight: 500, color: '#222', marginBottom: 20 }}>My Orders</h2>
                    {ordersLoading ? (
                      <div style={{ textAlign: 'center', padding: 40, color: '#666' }}>Loading orders...</div>
                    ) : orders.length === 0 ? (
                      <div style={{ background: '#f7f7f7', padding: 40, textAlign: 'center', color: '#666', borderRadius: 8 }}>
                        <p style={{ fontSize: 16, marginBottom: 10 }}>No orders yet.</p>
                        <a href="/shop" style={{ color: '#ce967e', textDecoration: 'underline' }}>Start shopping</a>
                      </div>
                    ) : (
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr style={{ borderBottom: '2px solid #e5e5e5', textAlign: 'left' }}>
                            <th style={{ padding: '12px 10px', fontSize: 14, color: '#222' }}>Order</th>
                            <th style={{ padding: '12px 10px', fontSize: 14, color: '#222' }}>Date</th>
                            <th style={{ padding: '12px 10px', fontSize: 14, color: '#222' }}>Status</th>
                            <th style={{ padding: '12px 10px', fontSize: 14, color: '#222' }}>Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders.map((order) => (
                            <tr key={order.id} style={{ borderBottom: '1px solid #e5e5e5' }}>
                              <td style={{ padding: '12px 10px', fontSize: 14, color: '#ce967e', fontWeight: 500 }}>{order.id}</td>
                              <td style={{ padding: '12px 10px', fontSize: 14, color: '#666' }}>{order.date}</td>
                              <td style={{ padding: '12px 10px' }}>
                                <span style={{
                                  display: 'inline-block', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 500, textTransform: 'capitalize',
                                  background: order.status === 'delivered' ? '#e8f5e9' : order.status === 'processing' ? '#fff3e0' : order.status === 'shipped' ? '#e3f2fd' : order.status === 'cancelled' ? '#ffebee' : '#f5f5f5',
                                  color: order.status === 'delivered' ? '#2e7d32' : order.status === 'processing' ? '#e65100' : order.status === 'shipped' ? '#1565c0' : order.status === 'cancelled' ? '#c62828' : '#666',
                                }}>
                                  {order.status}
                                </span>
                              </td>
                              <td style={{ padding: '12px 10px', fontSize: 14, color: '#222', fontWeight: 500 }}>₹{order.total}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </>
                )}

                {activeTab === 'addresses' && (
                  <>
                    <h2 style={{ fontSize: 24, fontWeight: 500, color: '#222', marginBottom: 20 }}>Shipping Address</h2>
                    {addressSaved && (
                      <div style={{ background: '#e8f5e9', color: '#2e7d32', padding: '12px 15px', borderRadius: 4, marginBottom: 15, fontSize: 14 }}>
                        Address saved successfully!
                      </div>
                    )}
                    <form onSubmit={handleSaveAddress} style={{ maxWidth: 600 }}>
                      <div style={{ marginBottom: 15 }}>
                        <label style={labelStyle}>Street Address *</label>
                        <input type="text" required value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} style={inputStyle} placeholder="House number and street name" />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15, marginBottom: 15 }}>
                        <div>
                          <label style={labelStyle}>City *</label>
                          <input type="text" required value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} style={inputStyle} />
                        </div>
                        <div>
                          <label style={labelStyle}>State *</label>
                          <input type="text" required value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} style={inputStyle} />
                        </div>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15, marginBottom: 15 }}>
                        <div>
                          <label style={labelStyle}>ZIP Code *</label>
                          <input type="text" required value={address.zip} onChange={(e) => setAddress({ ...address, zip: e.target.value })} style={inputStyle} />
                        </div>
                        <div>
                          <label style={labelStyle}>Country *</label>
                          <select value={address.country} onChange={(e) => setAddress({ ...address, country: e.target.value })} style={inputStyle}>
                            <option value="IN">India</option>
                            <option value="US">United States</option>
                            <option value="CA">Canada</option>
                            <option value="UK">United Kingdom</option>
                            <option value="AU">Australia</option>
                          </select>
                        </div>
                      </div>
                      <div style={{ marginBottom: 20 }}>
                        <label style={labelStyle}>Phone *</label>
                        <input type="tel" required value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} style={inputStyle} />
                      </div>
                      <button type="submit" style={{ padding: '12px 35px', background: '#ce967e', color: '#fff', textTransform: 'uppercase', fontSize: 14, fontWeight: 500, letterSpacing: 2, border: 'none', cursor: 'pointer' }}>
                        Save Address
                      </button>
                    </form>
                  </>
                )}

                {activeTab === 'details' && (
                  <>
                    <h2 style={{ fontSize: 24, fontWeight: 500, color: '#222', marginBottom: 20 }}>Account Details</h2>
                    {detailsSaved && (
                      <div style={{ background: '#e8f5e9', color: '#2e7d32', padding: '12px 15px', borderRadius: 4, marginBottom: 15, fontSize: 14 }}>
                        Details saved successfully!
                      </div>
                    )}
                    <form onSubmit={handleSaveDetails} style={{ maxWidth: 600 }}>
                      <div style={{ marginBottom: 15 }}>
                        <label style={labelStyle}>Full Name</label>
                        <input type="text" value={detailsName} onChange={(e) => setDetailsName(e.target.value)} style={inputStyle} />
                      </div>
                      <div style={{ marginBottom: 15 }}>
                        <label style={labelStyle}>Email Address</label>
                        <input type="email" value={detailsEmail} disabled style={{ ...inputStyle, background: '#f5f5f5', color: '#999' }} />
                        <p style={{ fontSize: 12, color: '#999', marginTop: 4 }}>Email cannot be changed</p>
                      </div>
                      <div style={{ marginBottom: 20, padding: '20px', background: '#f7f7f7', borderRadius: 8 }}>
                        <h4 style={{ fontSize: 16, color: '#222', marginBottom: 15 }}>Change Password</h4>
                        <div style={{ marginBottom: 12 }}>
                          <label style={labelStyle}>Current Password</label>
                          <input type="password" style={inputStyle} placeholder="Leave blank to keep current" />
                        </div>
                        <div style={{ marginBottom: 12 }}>
                          <label style={labelStyle}>New Password</label>
                          <input type="password" style={inputStyle} placeholder="Leave blank to keep current" />
                        </div>
                        <div>
                          <label style={labelStyle}>Confirm New Password</label>
                          <input type="password" style={inputStyle} placeholder="Leave blank to keep current" />
                        </div>
                      </div>
                      <button type="submit" style={{ padding: '12px 35px', background: '#ce967e', color: '#fff', textTransform: 'uppercase', fontSize: 14, fontWeight: 500, letterSpacing: 2, border: 'none', cursor: 'pointer' }}>
                        Save Changes
                      </button>
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

  return (
    <>
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'My Account' }]} />
      <div style={{ padding: '60px 0' }}>
        <div style={{ maxWidth: 500, margin: '0 auto', padding: '0 15px' }}>
          <div style={{ textAlign: 'center', marginBottom: 30 }}>
            <h1 style={{ fontSize: 32, fontWeight: 500, color: '#222', marginBottom: 10 }}>
              {isLogin ? 'Login' : 'Register'}
            </h1>
            <p style={{ color: '#666' }}>
              {isLogin ? 'Welcome back! Please login to your account.' : 'Create a new account to get started.'}
            </p>
          </div>

          {error && (
            <div style={{ background: '#ffebee', color: '#c62828', padding: '12px 15px', borderRadius: 4, marginBottom: 15, fontSize: 14 }}>
              {error}
            </div>
          )}

          <form onSubmit={isLogin ? handleLogin : handleRegister}>
            {!isLogin && (
              <div style={{ marginBottom: 15 }}>
                <label style={labelStyle}>Full Name *</label>
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />
              </div>
            )}
            <div style={{ marginBottom: 15 }}>
              <label style={labelStyle}>Email *</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Password *</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} />
            </div>
            <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', background: loading ? '#ccc' : '#ce967e', color: '#fff', textTransform: 'uppercase', fontSize: 14, fontWeight: 500, letterSpacing: 2, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.3s' }}>
              {loading ? 'Please wait...' : isLogin ? 'Login' : 'Register'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 20 }}>
            <button
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              style={{ background: 'none', border: 'none', color: '#ce967e', fontSize: 14, cursor: 'pointer', fontFamily: 'var(--font-primary)' }}
            >
              {isLogin ? "Don't have an account? Register" : 'Already have an account? Login'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={<div style={{ textAlign: 'center', padding: '80px 15px', color: '#666' }}>Loading...</div>}>
      <AccountContent />
    </Suspense>
  );
}
