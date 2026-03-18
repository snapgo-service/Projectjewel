import Link from 'next/link';
import { topBarLinks } from '@/data/navigation';
import styles from './TopBar.module.css';

const TopBar = () => {
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
        <p className={styles.announcement}>
          Free shipping world wide for all orders over $199
        </p>
        <div className={styles.shopNow}>
          <Link href="/shop">Shop Now</Link>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
