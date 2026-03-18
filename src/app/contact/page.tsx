'use client';

import { useState } from 'react';
import Breadcrumb from '@/components/layout/Breadcrumb';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to send message');
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Contact Us' }]} />
      <div style={{ padding: '60px 0' }}>
        <div style={{ maxWidth: 1430, margin: '0 auto', padding: '0 15px' }}>
          <div style={{ textAlign: 'center', marginBottom: 50 }}>
            <h1 style={{ fontSize: 36, fontWeight: 500, color: '#222', marginBottom: 15 }}>Contact Us</h1>
            <p style={{ color: '#666', maxWidth: 600, margin: '0 auto' }}>
              Have questions about our products or need assistance? We&apos;d love to hear from you.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 50 }}>
            <div>
              {submitted ? (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#4caf50', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, margin: '0 auto 20px' }}>✓</div>
                  <h3 style={{ fontSize: 22, color: '#222', marginBottom: 10 }}>Message Sent!</h3>
                  <p style={{ color: '#666' }}>We&apos;ll get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {error && (
                    <div style={{ background: '#ffebee', color: '#c62828', padding: '12px 15px', borderRadius: 4, marginBottom: 15, fontSize: 14 }}>
                      {error}
                    </div>
                  )}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15, marginBottom: 15 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#222', marginBottom: 6 }}>Name *</label>
                      <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} style={{ width: '100%', padding: '10px 14px', border: '1px solid #e5e5e5', fontSize: 14 }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#222', marginBottom: 6 }}>Email *</label>
                      <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} style={{ width: '100%', padding: '10px 14px', border: '1px solid #e5e5e5', fontSize: 14 }} />
                    </div>
                  </div>
                  <div style={{ marginBottom: 15 }}>
                    <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#222', marginBottom: 6 }}>Subject</label>
                    <input type="text" value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} style={{ width: '100%', padding: '10px 14px', border: '1px solid #e5e5e5', fontSize: 14 }} />
                  </div>
                  <div style={{ marginBottom: 20 }}>
                    <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#222', marginBottom: 6 }}>Message *</label>
                    <textarea required value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} style={{ width: '100%', padding: '10px 14px', border: '1px solid #e5e5e5', fontSize: 14, minHeight: 150, resize: 'vertical', fontFamily: 'var(--font-primary)' }} />
                  </div>
                  <button type="submit" disabled={loading} style={{ padding: '12px 35px', background: loading ? '#ccc' : '#ce967e', color: '#fff', textTransform: 'uppercase', fontSize: 14, fontWeight: 500, letterSpacing: 2, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.3s' }}>
                    {loading ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>

            <div>
              <div style={{ marginBottom: 30 }}>
                <h3 style={{ fontSize: 20, fontWeight: 500, color: '#222', marginBottom: 15 }}>Get in Touch</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  {[
                    { icon: '📍', title: 'Address', text: '123 Jewelry Lane, Diamond District, NY 10036' },
                    { icon: '📞', title: 'Phone', text: '+1 (555) 123-4567' },
                    { icon: '✉️', title: 'Email', text: 'info@jubilee.com' },
                    { icon: '🕐', title: 'Hours', text: 'Mon - Sat: 10AM - 8PM | Sun: 11AM - 6PM' },
                  ].map((item) => (
                    <div key={item.title} style={{ display: 'flex', gap: 15 }}>
                      <span style={{ fontSize: 24 }}>{item.icon}</span>
                      <div>
                        <div style={{ fontWeight: 500, color: '#222', marginBottom: 3 }}>{item.title}</div>
                        <div style={{ color: '#666', fontSize: 14 }}>{item.text}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ width: '100%', height: 250, background: '#f7f7f7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999', borderRadius: 8 }}>
                Map Placeholder
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
