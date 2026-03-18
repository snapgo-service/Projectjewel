'use client';

import { useState, useEffect } from 'react';
import styles from '../admin.module.css';
import { useAdmin } from '@/store/AdminContext';

interface SiteSettings {
  siteName: string;
  siteDescription: string;
  freeShippingThreshold: number;
  shippingCost: number;
  currency: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  socialFacebook: string;
  socialTwitter: string;
  socialInstagram: string;
  socialPinterest: string;
  announcementText: string;
  announcementActive: boolean;
}

export default function SettingsAdminPage() {
  const { settings, updateSettings } = useAdmin();
  const [formData, setFormData] = useState<SiteSettings>(settings);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = () => {
    updateSettings(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Settings</h1>
          <p className={styles.pageSubtitle}>Configure your store settings</p>
        </div>
      </div>

      <div className={styles.tableCard}>
        {/* General */}
        <h3 className={styles.sectionTitle}>General</h3>
        <div className={styles.sectionBody}>
          <div className={styles.formGroupFull}>
            <label className={styles.formLabel}>Site Name</label>
            <input
              type="text"
              name="siteName"
              className={styles.formInput}
              value={formData.siteName}
              onChange={handleChange}
            />
          </div>
          <div className={styles.formGroupFull}>
            <label className={styles.formLabel}>Site Description</label>
            <textarea
              name="siteDescription"
              className={styles.formTextarea}
              value={formData.siteDescription}
              onChange={handleChange}
              rows={3}
            />
          </div>
        </div>

        {/* Shipping */}
        <h3 className={styles.sectionTitle}>Shipping</h3>
        <div className={styles.sectionBody}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Free Shipping Threshold</label>
            <input
              type="number"
              name="freeShippingThreshold"
              className={styles.formInput}
              value={formData.freeShippingThreshold}
              onChange={handleChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Shipping Cost</label>
            <input
              type="number"
              name="shippingCost"
              className={styles.formInput}
              value={formData.shippingCost}
              onChange={handleChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Currency</label>
            <input
              type="text"
              name="currency"
              className={styles.formInput}
              value={formData.currency}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Contact */}
        <h3 className={styles.sectionTitle}>Contact</h3>
        <div className={styles.sectionBody}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Contact Email</label>
            <input
              type="text"
              name="contactEmail"
              className={styles.formInput}
              value={formData.contactEmail}
              onChange={handleChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Contact Phone</label>
            <input
              type="text"
              name="contactPhone"
              className={styles.formInput}
              value={formData.contactPhone}
              onChange={handleChange}
            />
          </div>
          <div className={styles.formGroupFull}>
            <label className={styles.formLabel}>Contact Address</label>
            <textarea
              name="contactAddress"
              className={styles.formTextarea}
              value={formData.contactAddress}
              onChange={handleChange}
              rows={2}
            />
          </div>
        </div>

        {/* Social Media */}
        <h3 className={styles.sectionTitle}>Social Media</h3>
        <div className={styles.sectionBody}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Facebook</label>
            <input
              type="text"
              name="socialFacebook"
              className={styles.formInput}
              value={formData.socialFacebook}
              onChange={handleChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Twitter</label>
            <input
              type="text"
              name="socialTwitter"
              className={styles.formInput}
              value={formData.socialTwitter}
              onChange={handleChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Instagram</label>
            <input
              type="text"
              name="socialInstagram"
              className={styles.formInput}
              value={formData.socialInstagram}
              onChange={handleChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Pinterest</label>
            <input
              type="text"
              name="socialPinterest"
              className={styles.formInput}
              value={formData.socialPinterest}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Announcement Bar */}
        <h3 className={styles.sectionTitle}>Announcement Bar</h3>
        <div className={styles.sectionBody}>
          <div className={styles.formGroupFull}>
            <label className={styles.formLabel}>Announcement Text</label>
            <input
              type="text"
              name="announcementText"
              className={styles.formInput}
              value={formData.announcementText}
              onChange={handleChange}
            />
          </div>
          <div className={styles.formGroupFull}>
            <label className={styles.formCheckbox}>
              <input
                type="checkbox"
                name="announcementActive"
                checked={formData.announcementActive}
                onChange={handleChange}
              />
              Announcement Active
            </label>
          </div>
        </div>

        {/* Save Button */}
        <div className={styles.formActions}>
          {saved && (
            <span className={styles.successAlert}>
              Settings saved successfully!
            </span>
          )}
          <button className={styles.saveBtn} onClick={handleSave}>
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
