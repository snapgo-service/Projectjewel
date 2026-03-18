'use client';

import { useState } from 'react';
import styles from '../admin.module.css';
import ImageUpload from '@/components/admin/ImageUpload';
import { useAdmin } from '@/store/AdminContext';

import { Product, CategorySlug } from '@/types';

const emptyForm = {
  name: '',
  slug: '',
  category: '' as CategorySlug,
  price: 0,
  salePrice: 0,
  salePercent: 0,
  sku: '',
  rating: 0,
  reviewCount: 0,
  shortDescription: '',
  description: '',
  image1: '',
  image2: '',
  inStock: true,
  isBestSeller: false,
  isNew: false,
  isFeatured: false,
  tags: '',
};

export default function ProductsPage() {
  const { products, addProduct, updateProduct, deleteProduct, categories } = useAdmin();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ ...emptyForm });

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const generateSlug = (name: string) =>
    name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const handleNameChange = (name: string) => {
    setForm((prev) => ({
      ...prev,
      name,
      slug: generateSlug(name),
    }));
  };

  const openAdd = () => {
    setEditingId(null);
    setForm({ ...emptyForm });
    setShowModal(true);
  };

  const openEdit = (product: Product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      slug: product.slug,
      category: product.category,
      price: product.price,
      salePrice: product.salePrice || 0,
      salePercent: product.salePercent || 0,
      sku: product.sku,
      rating: product.rating,
      reviewCount: product.reviewCount,
      shortDescription: product.shortDescription,
      description: product.description,
      image1: product.images[0] || '',
      image2: product.images[1] || '',
      inStock: product.inStock,
      isBestSeller: product.isBestSeller || false,
      isNew: product.isNew || false,
      isFeatured: product.isFeatured || false,
      tags: product.tags.join(', '),
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id);
    }
  };

  const handleSave = () => {
    const images = [form.image1, form.image2].filter(Boolean);
    const tags = form.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const productData: Product = {
      id: editingId || crypto.randomUUID(),
      slug: form.slug,
      name: form.name,
      category: form.category,
      images,
      price: Number(form.price),
      salePrice: form.salePrice ? Number(form.salePrice) : undefined,
      salePercent: form.salePercent ? Number(form.salePercent) : undefined,
      rating: Number(form.rating),
      reviewCount: Number(form.reviewCount),
      variants: [],
      description: form.description,
      shortDescription: form.shortDescription,
      sku: form.sku,
      inStock: form.inStock,
      tags,
      isBestSeller: form.isBestSeller || undefined,
      isNew: form.isNew || undefined,
      isFeatured: form.isFeatured || undefined,
    };

    if (editingId) {
      updateProduct(editingId, productData);
    } else {
      addProduct(productData);
    }

    setShowModal(false);
    setEditingId(null);
    setForm({ ...emptyForm });
  };

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Products</h1>
          <p className={styles.pageSubtitle}>Manage your jewelry products</p>
        </div>
        <button className={styles.addBtn} onClick={openAdd}>
          Add New Product
        </button>
      </div>

      <div className={styles.searchInput}>
        <input
          type="text"
          className={styles.formInput}
          placeholder="Search products by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <h3 className={styles.tableTitle}>All Products ({filteredProducts.length})</h3>
        </div>
        {filteredProducts.length === 0 ? (
          <div className={styles.emptyState}>No products found.</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Sale Price</th>
                <th>Rating</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product: Product) => (
                <tr key={product.id}>
                  <td>
                    {product.images[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className={styles.tableImage}
                      />
                    ) : (
                      '—'
                    )}
                  </td>
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td>₹{product.price.toFixed(2)}</td>
                  <td>{product.salePrice ? `₹${product.salePrice.toFixed(2)}` : '—'}</td>
                  <td>{product.rating}/5</td>
                  <td>
                    <span className={product.inStock ? styles.badgeActive : styles.badgeInactive}>
                      {product.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td className={styles.tableActions}>
                    <button className={styles.editBtn} onClick={() => openEdit(product)}>
                      Edit
                    </button>
                    <button className={styles.deleteBtn} onClick={() => handleDelete(product.id)}>
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
                {editingId ? 'Edit Product' : 'Add New Product'}
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
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Category</label>
                  <select
                    className={styles.formSelect}
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value as CategorySlug })}
                  >
                    <option value="">Select category</option>
                    {categories.map((cat: { slug: string; name: string }) => (
                      <option key={cat.slug} value={cat.slug}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Price</label>
                  <input
                    type="number"
                    className={styles.formInput}
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Sale Price</label>
                  <input
                    type="number"
                    className={styles.formInput}
                    value={form.salePrice}
                    onChange={(e) => setForm({ ...form, salePrice: Number(e.target.value) })}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Sale Percent</label>
                  <input
                    type="number"
                    className={styles.formInput}
                    value={form.salePercent}
                    onChange={(e) => setForm({ ...form, salePercent: Number(e.target.value) })}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>SKU</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={form.sku}
                    onChange={(e) => setForm({ ...form, sku: e.target.value })}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Rating (0-5)</label>
                  <input
                    type="number"
                    className={styles.formInput}
                    min={0}
                    max={5}
                    step={0.1}
                    value={form.rating}
                    onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Review Count</label>
                  <input
                    type="number"
                    className={styles.formInput}
                    value={form.reviewCount}
                    onChange={(e) => setForm({ ...form, reviewCount: Number(e.target.value) })}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Short Description</label>
                  <textarea
                    className={styles.formTextarea}
                    value={form.shortDescription}
                    onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
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
                  <ImageUpload
                    label="Image 1"
                    value={form.image1}
                    onChange={(url) => setForm({ ...form, image1: url })}
                  />
                </div>
                <div className={styles.formGroup}>
                  <ImageUpload
                    label="Image 2"
                    value={form.image2}
                    onChange={(url) => setForm({ ...form, image2: url })}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formCheckbox}>
                    <input
                      type="checkbox"
                      checked={form.inStock}
                      onChange={(e) => setForm({ ...form, inStock: e.target.checked })}
                    />
                    In Stock
                  </label>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formCheckbox}>
                    <input
                      type="checkbox"
                      checked={form.isBestSeller}
                      onChange={(e) => setForm({ ...form, isBestSeller: e.target.checked })}
                    />
                    Is Best Seller
                  </label>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formCheckbox}>
                    <input
                      type="checkbox"
                      checked={form.isNew}
                      onChange={(e) => setForm({ ...form, isNew: e.target.checked })}
                    />
                    Is New
                  </label>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formCheckbox}>
                    <input
                      type="checkbox"
                      checked={form.isFeatured}
                      onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                    />
                    Is Featured
                  </label>
                </div>
                <div className={styles.formGroupFull}>
                  <label className={styles.formLabel}>Tags (comma-separated)</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={form.tags}
                    onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.cancelBtn} onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button className={styles.saveBtn} onClick={handleSave}>
                {editingId ? 'Update Product' : 'Add Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
