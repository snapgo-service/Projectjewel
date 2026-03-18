'use client';

import { useState } from 'react';
import styles from '../admin.module.css';
import { useAdmin } from '@/store/AdminContext';
import type { Coupon } from '@/store/AdminContext';

const emptyForm = {
  code: '',
  description: '',
  discountType: 'percentage' as 'percentage' | 'fixed',
  discountValue: 0,
  minOrderAmount: 0,
  maxUses: 0,
  expiryDate: '',
  isActive: true,
  applicableProducts: '',
};

export default function CouponsPage() {
  const { coupons, addCoupon, updateCoupon, deleteCoupon } = useAdmin();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (coupon: Coupon) => {
    setEditingId(coupon.id);
    setForm({
      code: coupon.code,
      description: coupon.description,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minOrderAmount: coupon.minOrderAmount,
      maxUses: coupon.maxUses,
      expiryDate: coupon.expiryDate,
      isActive: coupon.isActive,
      applicableProducts: coupon.applicableProducts.join(', '),
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSave = () => {
    const parsedProducts = form.applicableProducts
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    if (editingId) {
      updateCoupon(editingId, {
        code: form.code,
        description: form.description,
        discountType: form.discountType,
        discountValue: form.discountValue,
        minOrderAmount: form.minOrderAmount,
        maxUses: form.maxUses,
        expiryDate: form.expiryDate,
        isActive: form.isActive,
        applicableProducts: parsedProducts,
      });
    } else {
      addCoupon({
        code: form.code,
        description: form.description,
        discountType: form.discountType,
        discountValue: form.discountValue,
        minOrderAmount: form.minOrderAmount,
        maxUses: form.maxUses,
        expiryDate: form.expiryDate,
        isActive: form.isActive,
        applicableProducts: parsedProducts,
      });
    }
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      deleteCoupon(id);
    }
  };

  const handleToggleActive = (coupon: Coupon) => {
    updateCoupon(coupon.id, { isActive: !coupon.isActive });
  };

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Coupons</h1>
          <p className={styles.pageSubtitle}>Manage discount coupons and promo codes</p>
        </div>
        <button className={styles.addBtn} onClick={openAdd}>
          Add New Coupon
        </button>
      </div>

      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <h2 className={styles.tableTitle}>All Coupons</h2>
        </div>

        {coupons.length === 0 ? (
          <div className={styles.emptyState}>No coupons found. Add your first coupon.</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Code</th>
                <th>Description</th>
                <th>Type</th>
                <th>Value</th>
                <th>Min Order</th>
                <th>Max Uses</th>
                <th>Used</th>
                <th>Expiry Date</th>
                <th>Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((coupon: Coupon) => (
                <tr key={coupon.id}>
                  <td><strong style={{ textTransform: 'uppercase' }}>{coupon.code}</strong></td>
                  <td>{coupon.description}</td>
                  <td>
                    <span className={`${styles.badge} ${coupon.discountType === 'percentage' ? styles.badgeProcessing : styles.badgeActive}`}>
                      {coupon.discountType === 'percentage' ? 'Percentage' : 'Flat'}
                    </span>
                  </td>
                  <td>
                    {coupon.discountType === 'percentage'
                      ? `${coupon.discountValue}%`
                      : `$${coupon.discountValue}`}
                  </td>
                  <td>${coupon.minOrderAmount}</td>
                  <td>{coupon.maxUses === 0 ? 'Unlimited' : coupon.maxUses}</td>
                  <td>{coupon.currentUses}</td>
                  <td>{coupon.expiryDate}</td>
                  <td>
                    <button
                      className={`${styles.toggle} ${coupon.isActive ? styles.toggleActive : ''}`}
                      onClick={() => handleToggleActive(coupon)}
                    >
                      <span className={coupon.isActive ? styles.badgeActive : styles.badgeInactive}>
                        {coupon.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </button>
                  </td>
                  <td className={styles.tableActions}>
                    <button className={styles.editBtn} onClick={() => openEdit(coupon)}>
                      Edit
                    </button>
                    <button className={styles.deleteBtn} onClick={() => handleDelete(coupon.id)}>
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
                {editingId ? 'Edit Coupon' : 'Add New Coupon'}
              </h2>
              <button className={styles.modalClose} onClick={closeModal}>
                &times;
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Code</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Description</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Discount Type</label>
                  <select
                    className={styles.formSelect}
                    value={form.discountType}
                    onChange={(e) => setForm({ ...form, discountType: e.target.value as 'percentage' | 'fixed' })}
                  >
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Discount Value</label>
                  <input
                    type="number"
                    className={styles.formInput}
                    value={form.discountValue}
                    onChange={(e) => setForm({ ...form, discountValue: parseFloat(e.target.value) || 0 })}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Minimum Order Amount</label>
                  <input
                    type="number"
                    className={styles.formInput}
                    value={form.minOrderAmount}
                    onChange={(e) => setForm({ ...form, minOrderAmount: parseFloat(e.target.value) || 0 })}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Maximum Uses</label>
                  <input
                    type="number"
                    className={styles.formInput}
                    value={form.maxUses}
                    onChange={(e) => setForm({ ...form, maxUses: parseInt(e.target.value) || 0 })}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Expiry Date</label>
                  <input
                    type="date"
                    className={styles.formInput}
                    value={form.expiryDate}
                    onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
                  />
                </div>

                <div className={styles.formGroupFull}>
                  <label className={styles.formLabel}>Applicable Products</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={form.applicableProducts}
                    placeholder="Leave empty for all products, or enter product IDs comma-separated"
                    onChange={(e) => setForm({ ...form, applicableProducts: e.target.value })}
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
                {editingId ? 'Update Coupon' : 'Add Coupon'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
