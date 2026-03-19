'use client';

import Link from 'next/link';
import { useAdmin } from '@/store/AdminContext';
import styles from './admin.module.css';

export default function AdminDashboard() {
  const { stats, orders, products } = useAdmin();

  const recentOrders = orders.slice(-5).reverse();
  const topProducts = products.slice(0, 5);

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Dashboard</h1>
          <p className={styles.pageSubtitle}>Welcome to Stellora Silver Admin Panel</p>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>💎</div>
          <div className={styles.statValue}>{stats.totalProducts}</div>
          <div className={styles.statLabel}>Total Products</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>📦</div>
          <div className={styles.statValue}>{stats.totalOrders}</div>
          <div className={styles.statLabel}>Total Orders</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>💰</div>
          <div className={styles.statValue}>₹{stats.totalRevenue.toLocaleString()}</div>
          <div className={styles.statLabel}>Total Revenue</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>📂</div>
          <div className={styles.statValue}>{stats.totalCategories}</div>
          <div className={styles.statLabel}>Categories</div>
        </div>
      </div>

      <div className={styles.dashboardGrid}>
        <div className={styles.tableCard}>
          <div className={styles.tableHeader}>
            <span className={styles.tableTitle}>Recent Orders</span>
            <Link href="/admin/orders" className={styles.editBtn}>View All</Link>
          </div>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 ? (
                <tr><td colSpan={4} style={{ textAlign: 'center', color: '#888' }}>No orders yet</td></tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td style={{ fontWeight: 500 }}>{order.id}</td>
                    <td>{order.customerName}</td>
                    <td>₹{order.total}</td>
                    <td>
                      <span className={`${styles.badge} ${styles[`badge${order.status.charAt(0).toUpperCase() + order.status.slice(1)}` as keyof typeof styles]}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className={styles.tableCard}>
          <div className={styles.tableHeader}>
            <span className={styles.tableTitle}>Top Products</span>
            <Link href="/admin/products" className={styles.editBtn}>View All</Link>
          </div>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Rating</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((product) => (
                <tr key={product.id}>
                  <td className={styles.textTruncate}>
                    {product.name}
                  </td>
                  <td>₹{product.salePrice || product.price}</td>
                  <td>{'⭐'.repeat(Math.round(product.rating))} {product.rating > 0 ? product.rating.toFixed(1) : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
