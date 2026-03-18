'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from '../admin.module.css';
import ImageUpload from '@/components/admin/ImageUpload';
import { useAdmin } from '@/store/AdminContext';

interface Poster {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  link: string;
  position: 'hero' | 'mid-page' | 'sidebar' | 'footer';
  isActive: boolean;
  order: number;
}

const emptyPoster: Omit<Poster, 'id'> = {
  title: '',
  subtitle: '',
  image: '',
  link: '',
  position: 'hero',
  isActive: true,
  order: 0,
};

export default function PostersPage() {
  const { posters, addPoster, updatePoster, deletePoster } = useAdmin();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Poster, 'id'>>(emptyPoster);

  const sortedPosters = [...posters].sort((a: Poster, b: Poster) => a.order - b.order);

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyPoster);
    setModalOpen(true);
  };

  const openEdit = (poster: Poster) => {
    setEditingId(poster.id);
    setForm({
      title: poster.title,
      subtitle: poster.subtitle,
      image: poster.image,
      link: poster.link,
      position: poster.position,
      isActive: poster.isActive,
      order: poster.order,
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingId(null);
    setForm(emptyPoster);
  };

  const handleSave = () => {
    if (editingId) {
      updatePoster(editingId, form);
    } else {
      addPoster(form);
    }
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this poster?')) {
      deletePoster(id);
    }
  };

  const handleToggleActive = (poster: Poster) => {
    updatePoster(poster.id, { isActive: !poster.isActive });
  };

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Posters</h1>
          <p className={styles.pageSubtitle}>Manage promotional posters and banners</p>
        </div>
        <button className={styles.addBtn} onClick={openAdd}>
          Add New Poster
        </button>
      </div>

      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <h2 className={styles.tableTitle}>All Posters</h2>
        </div>

        {sortedPosters.length === 0 ? (
          <div className={styles.emptyState}>No posters found. Add your first poster.</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Order</th>
                <th>Image</th>
                <th>Title</th>
                <th>Subtitle</th>
                <th>Position</th>
                <th>Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedPosters.map((poster: Poster) => (
                <tr key={poster.id}>
                  <td>{poster.order}</td>
                  <td>
                    {poster.image && (
                      <Image
                        src={poster.image}
                        alt={poster.title}
                        width={50}
                        height={50}
                        className={styles.tableImage}
                        unoptimized
                      />
                    )}
                  </td>
                  <td>{poster.title}</td>
                  <td>{poster.subtitle}</td>
                  <td>
                    <span className={styles.badge}>{poster.position}</span>
                  </td>
                  <td>
                    <button
                      className={`${styles.toggle} ${poster.isActive ? styles.toggleActive : ''}`}
                      onClick={() => handleToggleActive(poster)}
                    >
                      <span className={poster.isActive ? styles.badgeActive : styles.badgeInactive}>
                        {poster.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </button>
                  </td>
                  <td className={styles.tableActions}>
                    <button className={styles.editBtn} onClick={() => openEdit(poster)}>
                      Edit
                    </button>
                    <button className={styles.deleteBtn} onClick={() => handleDelete(poster.id)}>
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
                {editingId ? 'Edit Poster' : 'Add New Poster'}
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
                  <ImageUpload
                    label="Image"
                    value={form.image}
                    onChange={(url) => setForm({ ...form, image: url })}
                  />
                </div>

                <div className={styles.formGroupFull}>
                  <label className={styles.formLabel}>Link</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={form.link}
                    onChange={(e) => setForm({ ...form, link: e.target.value })}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Position</label>
                  <select
                    className={styles.formSelect}
                    value={form.position}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        position: e.target.value as Poster['position'],
                      })
                    }
                  >
                    <option value="hero">Hero</option>
                    <option value="mid-page">Mid-page</option>
                    <option value="sidebar">Sidebar</option>
                    <option value="footer">Footer</option>
                  </select>
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
                {editingId ? 'Update Poster' : 'Add Poster'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
