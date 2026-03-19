'use client';

import { useState } from 'react';
import styles from '../admin.module.css';
import { useAdmin } from '@/store/AdminContext';
import { Category, CategorySlug } from '@/types';
import ImageUpload from '@/components/admin/ImageUpload';

const emptyForm = {
  name: '',
  slug: '' as CategorySlug,
  description: '',
  image: '',
  productCount: 0,
};

export default function CategoriesPage() {
  const { categories, addCategory, updateCategory, deleteCategory } = useAdmin();
  const [showModal, setShowModal] = useState(false);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [form, setForm] = useState({ ...emptyForm });

  const generateSlug = (name: string) =>
    name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const handleNameChange = (name: string) => {
    setForm((prev) => ({
      ...prev,
      name,
      slug: generateSlug(name) as CategorySlug,
    }));
  };

  const openAdd = () => {
    setEditingSlug(null);
    setForm({ ...emptyForm });
    setShowModal(true);
  };

  const openEdit = (category: Category) => {
    setEditingSlug(category.slug);
    setForm({
      name: category.name,
      slug: category.slug,
      description: category.description,
      image: category.image,
      productCount: category.productCount,
    });
    setShowModal(true);
  };

  const handleDelete = (slug: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      deleteCategory(slug);
    }
  };

  const handleSave = () => {
    const categoryData: Category = {
      slug: form.slug as CategorySlug,
      name: form.name,
      description: form.description,
      image: form.image,
      productCount: Number(form.productCount),
    };

    if (editingSlug) {
      updateCategory(editingSlug, categoryData);
    } else {
      addCategory(categoryData);
    }

    setShowModal(false);
    setEditingSlug(null);
    setForm({ ...emptyForm });
  };

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Categories</h1>
          <p className={styles.pageSubtitle}>Manage your jewelry categories</p>
        </div>
        <button className={styles.addBtn} onClick={openAdd}>
          Add New Category
        </button>
      </div>

      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <h3 className={styles.tableTitle}>All Categories ({categories.length})</h3>
        </div>
        {categories.length === 0 ? (
          <div className={styles.emptyState}>No categories found.</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Slug</th>
                <th>Description</th>
                <th>Product Count</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category: Category) => (
                <tr key={category.slug}>
                  <td>
                    {category.image ? (
                      <img
                        src={category.image}
                        alt={category.name}
                        className={styles.tableImage}
                      />
                    ) : (
                      '—'
                    )}
                  </td>
                  <td>{category.name}</td>
                  <td>{category.slug}</td>
                  <td>{category.description}</td>
                  <td>{category.productCount}</td>
                  <td className={styles.tableActions}>
                    <button className={styles.editBtn} onClick={() => openEdit(category)}>
                      Edit
                    </button>
                    <button className={styles.deleteBtn} onClick={() => handleDelete(category.slug)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                {editingSlug ? 'Edit Category' : 'Add New Category'}
              </h2>
              <button className={styles.modalClose} onClick={() => setShowModal(false)}>
                &times;
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Name</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={form.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Slug</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value as CategorySlug })}
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
                  <ImageUpload label="Image" value={form.image} onChange={(url) => setForm({...form, image: url})} />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Product Count</label>
                  <input
                    type="number"
                    className={styles.formInput}
                    value={form.productCount}
                    onChange={(e) => setForm({ ...form, productCount: Number(e.target.value) })}
                  />
                </div>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.cancelBtn} onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button className={styles.saveBtn} onClick={handleSave}>
                {editingSlug ? 'Update Category' : 'Add Category'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
