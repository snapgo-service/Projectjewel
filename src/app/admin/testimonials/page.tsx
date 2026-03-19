'use client';

import { useState } from 'react';
import { useAdmin } from '@/store/AdminContext';
import styles from '../admin.module.css';

export default function TestimonialsPage() {
  const { testimonials, addTestimonial, updateTestimonial, deleteTestimonial } = useAdmin();
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', location: '', quote: '', rating: 5, isActive: true, order: 0 });

  const resetForm = () => {
    setForm({ name: '', location: '', quote: '', rating: 5, isActive: true, order: 0 });
    setEditing(null);
    setShowForm(false);
  };

  const handleSave = async () => {
    if (!form.name || !form.quote) return;
    if (editing) {
      await updateTestimonial(editing, form);
    } else {
      await addTestimonial(form);
    }
    resetForm();
  };

  const handleEdit = (t: typeof testimonials[0]) => {
    setForm({ name: t.name, location: t.location, quote: t.quote, rating: t.rating, isActive: t.isActive, order: t.order });
    setEditing(t.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this testimonial?')) {
      await deleteTestimonial(id);
    }
  };

  const inputStyle = { width: '100%', padding: '10px 14px', border: '1px solid #e5e5e5', borderRadius: 4, fontSize: 14, fontFamily: 'inherit' };
  const labelStyle: React.CSSProperties = { display: 'block', fontSize: 14, fontWeight: 500, color: '#222', marginBottom: 6 };

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Testimonials</h1>
          <p className={styles.pageSubtitle}>Manage customer testimonials displayed on the homepage</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          style={{ padding: '10px 20px', background: '#ce967e', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 14 }}
        >
          + Add Testimonial
        </button>
      </div>

      {showForm && (
        <div style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: 8, padding: 25, marginBottom: 25 }}>
          <h3 style={{ fontSize: 18, fontWeight: 500, marginBottom: 20 }}>{editing ? 'Edit Testimonial' : 'Add New Testimonial'}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15, marginBottom: 15 }}>
            <div>
              <label style={labelStyle}>Customer Name *</label>
              <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={inputStyle} placeholder="e.g. Priya Sharma" />
            </div>
            <div>
              <label style={labelStyle}>Location</label>
              <input type="text" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} style={inputStyle} placeholder="e.g. Mumbai" />
            </div>
          </div>
          <div style={{ marginBottom: 15 }}>
            <label style={labelStyle}>Testimonial Quote *</label>
            <textarea
              value={form.quote}
              onChange={e => setForm({ ...form, quote: e.target.value })}
              style={{ ...inputStyle, minHeight: 100, resize: 'vertical' }}
              placeholder="What did the customer say..."
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 15, marginBottom: 20 }}>
            <div>
              <label style={labelStyle}>Rating (1-5)</label>
              <select value={form.rating} onChange={e => setForm({ ...form, rating: Number(e.target.value) })} style={inputStyle}>
                {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{r} Star{r > 1 ? 's' : ''}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Display Order</label>
              <input type="number" value={form.order} onChange={e => setForm({ ...form, order: Number(e.target.value) })} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Status</label>
              <select value={form.isActive ? 'active' : 'inactive'} onChange={e => setForm({ ...form, isActive: e.target.value === 'active' })} style={inputStyle}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={handleSave} style={{ padding: '10px 25px', background: '#ce967e', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 14 }}>
              {editing ? 'Update' : 'Add'} Testimonial
            </button>
            <button onClick={resetForm} style={{ padding: '10px 25px', background: '#f5f5f5', color: '#666', border: '1px solid #e5e5e5', borderRadius: 4, cursor: 'pointer', fontSize: 14 }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {testimonials.length === 0 ? (
        <div style={{ background: '#f7f7f7', padding: 40, textAlign: 'center', borderRadius: 8, color: '#666' }}>
          <p style={{ fontSize: 16, marginBottom: 10 }}>No testimonials yet.</p>
          <p style={{ fontSize: 14 }}>Add customer testimonials to display on the homepage.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 15 }}>
          {[...testimonials].sort((a, b) => a.order - b.order).map(t => (
            <div key={t.id} style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: 8, padding: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <strong style={{ fontSize: 15, color: '#222' }}>{t.name}</strong>
                  {t.location && <span style={{ fontSize: 13, color: '#999' }}>— {t.location}</span>}
                  <span style={{
                    padding: '2px 10px', borderRadius: 12, fontSize: 11, fontWeight: 500,
                    background: t.isActive ? '#e8f5e9' : '#f5f5f5',
                    color: t.isActive ? '#2e7d32' : '#999',
                  }}>
                    {t.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p style={{ color: '#666', lineHeight: 1.6, fontSize: 14, marginBottom: 6 }}>&ldquo;{t.quote}&rdquo;</p>
                <div style={{ color: '#f5a623', fontSize: 14 }}>{'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}</div>
              </div>
              <div style={{ display: 'flex', gap: 8, marginLeft: 15 }}>
                <button onClick={() => handleEdit(t)} style={{ padding: '6px 14px', background: '#fff3e0', color: '#e65100', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}>
                  Edit
                </button>
                <button onClick={() => handleDelete(t.id)} style={{ padding: '6px 14px', background: '#ffebee', color: '#c62828', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
