'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useAdmin } from '@/store/AdminContext';
import styles from './CategoryShowcase.module.css';

export function CategoryShowcase() {
  const { categories } = useAdmin();

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Shop By Category</h2>
        </div>
        <div className={styles.grid}>
          {categories.filter((cat) => cat.image).map((cat) => (
            <Link href={`/category/${cat.slug}`} key={cat.slug} className={styles.card}>
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
                className={styles.cardImage}
                unoptimized
              />
              <div className={styles.cardOverlay}>
                <div className={styles.cardName}>{cat.name}</div>
                <div className={styles.cardCount}>{cat.productCount} Products</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
