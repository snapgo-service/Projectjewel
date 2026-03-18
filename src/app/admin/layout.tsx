'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import styles from './admin.module.css';

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: '📊' },
  { label: 'Sliders', href: '/admin/sliders', icon: '🖼️' },
  { label: 'Posters', href: '/admin/posters', icon: '📰' },
  { label: 'Products', href: '/admin/products', icon: '💎' },
  { label: 'Categories', href: '/admin/categories', icon: '📂' },
  { label: 'Blog Posts', href: '/admin/blog', icon: '📝' },
  { label: 'Coupons', href: '/admin/coupons', icon: '🎟️' },
  { label: 'Orders', href: '/admin/orders', icon: '📦' },
  { label: 'Settings', href: '/admin/settings', icon: '⚙️' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className={styles.loadingScreen}><p>Loading...</p></div>
    );
  }

  if ((session?.user as { role?: string })?.role !== 'admin') {
    return (
      <div className={styles.accessDenied}>
        <h1>403</h1>
        <h2>Access Denied</h2>
        <p>You do not have permission to access the admin panel. Please contact your administrator.</p>
        <Link href="/">← Back to Store</Link>
      </div>
    );
  }

  return (
    <div className={styles.adminWrapper}>
      <aside className={`${styles.sidebar} ${sidebarOpen ? '' : styles.sidebarClosed}`}>
        <div className={styles.sidebarHeader}>
          <Link href="/admin" className={styles.logo}>
            <span className={styles.logoIcon}>J</span>
            {sidebarOpen && <span className={styles.logoText}>Jubilee Admin</span>}
          </Link>
        </div>
        <nav className={styles.sidebarNav}>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navItem} ${pathname === item.href ? styles.navItemActive : ''}`}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              {sidebarOpen && <span className={styles.navLabel}>{item.label}</span>}
            </Link>
          ))}
        </nav>
        <div className={styles.sidebarFooter}>
          <Link href="/" className={styles.viewSite}>
            {sidebarOpen ? '← View Store' : '←'}
          </Link>
        </div>
      </aside>

      <div className={`${styles.mainArea} ${sidebarOpen ? '' : styles.mainAreaCollapsed}`}>
        <header className={styles.topbar}>
          <button className={styles.toggleBtn} onClick={() => setSidebarOpen(!sidebarOpen)}>
            <span></span><span></span><span></span>
          </button>
          <div className={styles.topbarRight}>
            <span className={styles.adminUser}>
              {session?.user?.name || session?.user?.email || 'Admin'}
            </span>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className={styles.logoutBtn}
            >
              Logout
            </button>
          </div>
        </header>
        <main className={styles.content}>
          {children}
        </main>
      </div>
    </div>
  );
}
