'use client';

import Link from 'next/link';
import { topBarLinks } from '@/data/navigation';
import { useAdmin } from '@/store/AdminContext';
import styles from './TopBar.module.css';

const TopBar = () => {
  const { settings } = useAdmin();

  return (
    <div className={styles.topBar}>
      <div className={styles.container}>
        <ul className={styles.links}>
          {topBarLinks.map((link) => (
            <li key={link.label}>
              <Link href={link.href}>{link.label}</Link>
            </li>
          ))}
        </ul>
        {settings.announcementActive && settings.announcementText && (
          <p className={styles.announcement}>
            {settings.announcementText}
          </p>
        )}
        <div className={styles.shopNow}>
          <Link href="/shop">Shop Now</Link>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
