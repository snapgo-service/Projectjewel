'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from '../admin.module.css';
import ImageUpload from '@/components/admin/ImageUpload';
import { useAdmin } from '@/store/AdminContext';

interface Slider {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  backgroundImage: string;
  productImage: string;
  isActive: boolean;
  order: number;
  titleColor?: string;
  subtitleColor?: string;
  descriptionColor?: string;
  buttonBgColor?: string;
  buttonTextColor?: string;
}

const emptySlider: Omit<Slider, 'id'> = {
  title: '',
  subtitle: '',
  description: '',
  buttonText: '',
  buttonLink: '',
  backgroundImage: '',
  productImage: '',
  isActive: true,
  order: 0,
  titleColor: '#ffffff',
  subtitleColor: '#ce967e',
  descriptionColor: '#ffffffcc',
  buttonBgColor: '#ce967e',
  buttonTextColor: '#ffffff',
};

export default function SlidersPage() {
  const { sliders, addSlider, updateSlider, deleteSlider } = useAdmin();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Slider, 'id'>>(emptySlider);

  const sortedSliders = [...sliders].sort((a: Slider, b: Slider) => a.order - b.order);

  const openAdd = () => {
    setEditingId(null);
    setForm(emptySlider);
    setModalOpen(true);
  };

  const openEdit = (slider: Slider) => {
    setEditingId(slider.id);
    setForm({
      title: slider.title,
      subtitle: slider.subtitle,
      description: slider.description,
      buttonText: slider.buttonText,
      buttonLink: slider.buttonLink,
      backgroundImage: slider.backgroundImage,
      productImage: slider.productImage,
      isActive: slider.isActive,
      order: slider.order,
      titleColor: slider.titleColor || '#ffffff',
      subtitleColor: slider.subtitleColor || '#ce967e',
      descriptionColor: slider.descriptionColor || '#ffffffcc',
      buttonBgColor: slider.buttonBgColor || '#ce967e',
      buttonTextColor: slider.buttonTextColor || '#ffffff',
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingId(null);
    setForm(emptySlider);
  };

  const handleSave = () => {
    if (editingId) {
      updateSlider(editingId, form);
    } else {
      addSlider(form);
    }
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this slider?')) {
      deleteSlider(id);
    }
  };

  const handleToggleActive = (slider: Slider) => {
    updateSlider(slider.id, { isActive: !slider.isActive });
  };

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Sliders / Banners</h1>
          <p className={styles.pageSubtitle}>Manage homepage sliders and banners</p>
        </div>
        <button className={styles.addBtn} onClick={openAdd}>
          Add New Slider
        </button>
      </div>

      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <h2 className={styles.tableTitle}>All Sliders</h2>
        </div>

        {sortedSliders.length === 0 ? (
          <div className={styles.emptyState}>No sliders found. Add your first slider.</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Order</th>
                <th>Image</th>
                <th>Title</th>
                <th>Subtitle</th>
                <th>Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedSliders.map((slider: Slider) => (
                <tr key={slider.id}>
                  <td>{slider.order}</td>
                  <td>
                    {slider.backgroundImage && (
                      <Image
                        src={slider.backgroundImage}
                        alt={slider.title}
                        width={50}
                        height={50}
                        className={styles.tableImage}
                        unoptimized
                      />
                    )}
                  </td>
                  <td>{slider.title}</td>
                  <td>{slider.subtitle}</td>
                  <td>
                    <button
                      className={`${styles.toggle} ${slider.isActive ? styles.toggleActive : ''}`}
                      onClick={() => handleToggleActive(slider)}
                    >
                      <span className={slider.isActive ? styles.badgeActive : styles.badgeInactive}>
                        {slider.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </button>
                  </td>
                  <td className={styles.tableActions}>
                    <button className={styles.editBtn} onClick={() => openEdit(slider)}>
                      Edit
                    </button>
                    <button className={styles.deleteBtn} onClick={() => handleDelete(slider.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modalOpen && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                {editingId ? 'Edit Slider' : 'Add New Slider'}
              </h2>
              <button className={styles.modalClose} onClick={closeModal}>
                &times;
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Title</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Subtitle</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={form.subtitle}
                    onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                  />
                </div>

                <div className={styles.formGroupFull}>
                  <label className={styles.formLabel}>Description</label>
                  <textarea
                    className={styles.formTextarea}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Button Text</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={form.buttonText}
                    onChange={(e) => setForm({ ...form, buttonText: e.target.value })}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Button Link</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={form.buttonLink}
                    onChange={(e) => setForm({ ...form, buttonLink: e.target.value })}
                  />
                </div>

                <div className={styles.formGroupFull}>
                  <label className={styles.formLabel} style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Text Colors</label>
                  <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                      <input type="color" value={form.titleColor || '#ffffff'} onChange={(e) => setForm({ ...form, titleColor: e.target.value })} style={{ width: 32, height: 32, border: '1px solid #ddd', borderRadius: 6, cursor: 'pointer', padding: 2 }} />
                      Title
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                      <input type="color" value={form.subtitleColor || '#ce967e'} onChange={(e) => setForm({ ...form, subtitleColor: e.target.value })} style={{ width: 32, height: 32, border: '1px solid #ddd', borderRadius: 6, cursor: 'pointer', padding: 2 }} />
                      Subtitle
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                      <input type="color" value={form.descriptionColor || '#ffffffcc'} onChange={(e) => setForm({ ...form, descriptionColor: e.target.value })} style={{ width: 32, height: 32, border: '1px solid #ddd', borderRadius: 6, cursor: 'pointer', padding: 2 }} />
                      Description
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                      <input type="color" value={form.buttonBgColor || '#ce967e'} onChange={(e) => setForm({ ...form, buttonBgColor: e.target.value })} style={{ width: 32, height: 32, border: '1px solid #ddd', borderRadius: 6, cursor: 'pointer', padding: 2 }} />
                      Button BG
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                      <input type="color" value={form.buttonTextColor || '#ffffff'} onChange={(e) => setForm({ ...form, buttonTextColor: e.target.value })} style={{ width: 32, height: 32, border: '1px solid #ddd', borderRadius: 6, cursor: 'pointer', padding: 2 }} />
                      Button Text
                    </label>
                  </div>
                </div>

                <div className={styles.formGroupFull}>
                  <ImageUpload label="Background Image" value={form.backgroundImage} onChange={(url) => setForm({ ...form, backgroundImage: url })} />
                </div>

                <div className={styles.formGroupFull}>
                  <ImageUpload label="Product Image" value={form.productImage} onChange={(url) => setForm({ ...form, productImage: url })} />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Order</label>
                  <input
                    type="number"
                    className={styles.formInput}
                    value={form.order}
                    onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formCheckbox}>
                    <input
                      type="checkbox"
                      checked={form.isActive}
                      onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                    />
                    Is Active
                  </label>
                </div>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button className={styles.cancelBtn} onClick={closeModal}>
                Cancel
              </button>
              <button className={styles.saveBtn} onClick={handleSave}>
                {editingId ? 'Update Slider' : 'Add Slider'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
