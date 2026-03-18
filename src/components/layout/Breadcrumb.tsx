import Link from 'next/link';
import Image from 'next/image';
import { IMAGES } from '@/data/images';
import styles from './Breadcrumb.module.css';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const Breadcrumb = ({ items }: BreadcrumbProps) => {
  return (
    <div className={styles.breadcrumb}>
      <Image
        src={IMAGES.heroBg}
        alt=""
        fill
        className={styles.bgImage}
        quality={80}
      />
      <div className={styles.overlay} />
      <div className={styles.container}>
        <h2 className={styles.title}>
          {items.length > 0 ? items[items.length - 1].label : ''}
        </h2>
        <nav className={styles.nav} aria-label="Breadcrumb">
          <ol className={styles.list}>
            {items.map((item, index) => (
              <li key={index} className={styles.item}>
                {index > 0 && <span className={styles.separator}>&gt;</span>}
                {item.href && index < items.length - 1 ? (
                  <Link href={item.href} className={styles.link}>
                    {item.label}
                  </Link>
                ) : (
                  <span className={styles.current}>{item.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </div>
  );
};

export default Breadcrumb;
