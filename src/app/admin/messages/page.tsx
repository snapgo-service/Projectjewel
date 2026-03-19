'use client';

import { useState } from 'react';
import styles from '../admin.module.css';
import { useAdmin, ContactMessage } from '@/store/AdminContext';

export default function MessagesAdminPage() {
  const { contactMessages, updateContactMessageStatus, deleteContactMessage } = useAdmin();
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const openModal = (msg: ContactMessage) => {
    setSelectedMessage(msg);
    setModalOpen(true);
    if (msg.status === 'unread') {
      updateContactMessageStatus(msg.id, 'read');
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedMessage(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this message?')) {
      deleteContactMessage(id);
      closeModal();
    }
  };

  const filteredMessages = filterStatus === 'all'
    ? contactMessages
    : contactMessages.filter((m) => m.status === filterStatus);

  const unreadCount = contactMessages.filter((m) => m.status === 'unread').length;

  const statusBadge = (status: ContactMessage['status']) => {
    const map: Record<string, string> = {
      unread: styles.badgePending,
      read: styles.badgeProcessing,
      replied: styles.badgeDelivered,
    };
    return map[status] || '';
  };

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>
            Messages {unreadCount > 0 && <span style={{ fontSize: 16, color: '#ce967e', fontWeight: 400 }}>({unreadCount} unread)</span>}
          </h1>
          <p className={styles.pageSubtitle}>Contact form submissions from customers</p>
        </div>
      </div>

      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <h2 className={styles.tableTitle}>All Messages</h2>
          <select
            className={styles.formSelect}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{ width: 'auto', minWidth: 150 }}
          >
            <option value="all">All Messages</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
            <option value="replied">Replied</option>
          </select>
        </div>
        {filteredMessages.length === 0 ? (
          <div className={styles.emptyState}>No messages found.</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Subject</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMessages.map((msg) => (
                <tr key={msg.id} style={{ fontWeight: msg.status === 'unread' ? 600 : 400 }}>
                  <td>{msg.name}</td>
                  <td>{msg.email}</td>
                  <td>{msg.subject || '—'}</td>
                  <td>
                    <span className={`${styles.badge} ${statusBadge(msg.status)}`}>
                      {msg.status}
                    </span>
                  </td>
                  <td>{new Date(msg.date).toLocaleDateString()}</td>
                  <td className={styles.tableActions}>
                    <button className={styles.editBtn} onClick={() => openModal(msg)}>
                      View
                    </button>
                    <button className={styles.deleteBtn} onClick={() => handleDelete(msg.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modalOpen && selectedMessage && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Message from {selectedMessage.name}</h2>
              <button className={styles.modalClose} onClick={closeModal}>
                &times;
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Name</label>
                  <input type="text" className={styles.formInput} value={selectedMessage.name} readOnly />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Email</label>
                  <input type="text" className={styles.formInput} value={selectedMessage.email} readOnly />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Subject</label>
                  <input type="text" className={styles.formInput} value={selectedMessage.subject || '—'} readOnly />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Date</label>
                  <input type="text" className={styles.formInput} value={new Date(selectedMessage.date).toLocaleString()} readOnly />
                </div>
                <div className={styles.formGroupFull}>
                  <label className={styles.formLabel}>Message</label>
                  <textarea
                    className={styles.formTextarea}
                    value={selectedMessage.message}
                    readOnly
                    rows={6}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Status</label>
                  <select
                    className={styles.formSelect}
                    value={selectedMessage.status}
                    onChange={(e) => {
                      const newStatus = e.target.value as ContactMessage['status'];
                      updateContactMessageStatus(selectedMessage.id, newStatus);
                      setSelectedMessage({ ...selectedMessage, status: newStatus });
                    }}
                  >
                    <option value="unread">Unread</option>
                    <option value="read">Read</option>
                    <option value="replied">Replied</option>
                  </select>
                </div>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.deleteBtn} onClick={() => handleDelete(selectedMessage.id)}>
                Delete
              </button>
              <button className={styles.cancelBtn} onClick={closeModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
