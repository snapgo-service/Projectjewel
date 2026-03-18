'use client';

import { useState } from 'react';
import styles from '../admin.module.css';
import { useAdmin } from '@/store/AdminContext';

interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  date: string;
}

const statusBadgeMap: Record<Order['status'], string> = {
  pending: styles.badgePending,
  processing: styles.badgeProcessing,
  shipped: styles.badgeShipped,
  delivered: styles.badgeDelivered,
  cancelled: styles.badgeCancelled,
};

export default function OrdersAdminPage() {
  const { orders, updateOrderStatus } = useAdmin();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState<Order['status']>('pending');

  const openModal = (order: Order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedOrder(null);
  };

  const handleSave = () => {
    if (selectedOrder) {
      updateOrderStatus(selectedOrder.id, newStatus);
    }
    closeModal();
  };

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Orders</h1>
          <p className={styles.pageSubtitle}>Manage customer orders</p>
        </div>
      </div>

      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <h2 className={styles.tableTitle}>All Orders</h2>
        </div>
        {orders.length === 0 ? (
          <div className={styles.emptyState}>No orders found.</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Email</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order: Order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.customerName}</td>
                  <td>{order.email}</td>
                  <td>{order.items.length}</td>
                  <td>${order.total.toFixed(2)}</td>
                  <td>
                    <span
                      className={`${styles.badge} ${statusBadgeMap[order.status]}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td>{order.date}</td>
                  <td className={styles.tableActions}>
                    <button
                      className={styles.editBtn}
                      onClick={() => openModal(order)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modalOpen && selectedOrder && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                Order Details — {selectedOrder.id}
              </h2>
              <button className={styles.modalClose} onClick={closeModal}>
                &times;
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Customer Name</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={selectedOrder.customerName}
                    readOnly
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Email</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={selectedOrder.email}
                    readOnly
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Phone</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={selectedOrder.phone}
                    readOnly
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Date</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={selectedOrder.date}
                    readOnly
                  />
                </div>
                <div className={styles.formGroupFull}>
                  <label className={styles.formLabel}>Address</label>
                  <textarea
                    className={styles.formTextarea}
                    value={selectedOrder.address}
                    readOnly
                    rows={2}
                  />
                </div>
              </div>

              <h3 className={styles.itemsHeading}>Items</h3>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items.map((item, index) => (
                    <tr key={index}>
                      <td>{item.productName}</td>
                      <td>{item.quantity}</td>
                      <td>${item.price.toFixed(2)}</td>
                      <td>${(item.quantity * item.price).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className={styles.totalAmount}>
                Total: ${selectedOrder.total.toFixed(2)}
              </div>

              <div className={`${styles.formGrid} ${styles.statusSection}`}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Status</label>
                  <select
                    className={styles.formSelect}
                    value={newStatus}
                    onChange={(e) =>
                      setNewStatus(e.target.value as Order['status'])
                    }
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.cancelBtn} onClick={closeModal}>
                Cancel
              </button>
              <button className={styles.saveBtn} onClick={handleSave}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
