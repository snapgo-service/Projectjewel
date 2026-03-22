'use client';

import { useState } from 'react';
import { useAdmin } from '@/store/AdminContext';
import Breadcrumb from '@/components/layout/Breadcrumb';

export default function ContactPage() {
  const { settings } = useAdmin();
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

  const contactInfo = [
    { icon: '📍', title: 'Address', text: settings.contactAddress },
    { icon: '📞', title: 'Phone', text: settings.contactPhone },
    { icon: '✉️', title: 'Email', text: settings.contactEmail },
    { icon: '🕐', title: 'Hours', text: 'Mon - Sat: 10AM - 8PM | Sun: 11AM - 6PM' },
  ];

  return (
    <>
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Contact Us' }]} />
      <div className="py-16">
        <div className="max-w-[1430px] mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-medium text-heading mb-4 font-[family-name:var(--font-serif)]">Contact Us</h1>
            <p className="text-body max-w-xl mx-auto">
              Have questions about our products or need assistance? We&apos;d love to hear from you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-white rounded-2xl shadow-card p-8">
              {submitted ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 rounded-full bg-success text-white flex items-center justify-center text-3xl mx-auto mb-5">✓</div>
                  <h3 className="text-xl text-heading mb-2">Message Sent!</h3>
                  <p className="text-body">We&apos;ll get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {error && (
                    <div className="bg-red-50 text-error px-4 py-3 rounded-lg mb-4 text-sm">
                      {error}
                    </div>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-heading mb-1.5">Name *</label>
                      <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:border-primary transition-colors" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-heading mb-1.5">Email *</label>
                      <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:border-primary transition-colors" />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-heading mb-1.5">Subject</label>
                    <input type="text" value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} className="w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:border-primary transition-colors" />
                  </div>
                  <div className="mb-5">
                    <label className="block text-sm font-medium text-heading mb-1.5">Message *</label>
                    <textarea required value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="w-full px-4 py-2.5 border border-border rounded-lg text-sm min-h-[150px] resize-y focus:outline-none focus:border-primary transition-colors" />
                  </div>
                  <button type="submit" disabled={loading} className={`px-9 py-3 rounded-full text-white uppercase text-sm font-medium tracking-widest transition-all duration-300 ${loading ? 'bg-gray-300 cursor-not-allowed' : 'bg-primary hover:bg-primary-hover cursor-pointer'}`}>
                    {loading ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>

            <div>
              <div className="mb-8">
                <h3 className="text-xl font-medium text-heading mb-4">Get in Touch</h3>
                <div className="flex flex-col gap-5">
                  {contactInfo.map((item) => (
                    <div key={item.title} className="flex gap-4 bg-bg-blush rounded-xl p-4">
                      <span className="text-2xl">{item.icon}</span>
                      <div>
                        <div className="font-medium text-heading mb-1">{item.title}</div>
                        <div className="text-body text-sm">{item.text}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="w-full h-[250px] bg-bg-ivory flex items-center justify-center text-body-light rounded-xl">
                Map Placeholder
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
