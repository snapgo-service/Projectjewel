'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAdmin } from '@/store/AdminContext';
import styles from './MegaMenu.module.css';

const MegaMenu = () => {
  const { categories } = useAdmin();

  if (!categories.length) return null;

  return (
    <div className={styles.megaMenu}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/category/${category.slug}`}
              className={styles.categoryCard}
            >
              {category.image && (
                <div className={styles.imageWrapper}>
                  <Image
                    src={category.image}
                    alt={category.name}
                    width={200}
                    height={200}
                    className={styles.categoryImage}
                    unoptimized
                  />
                </div>
              )}
              <h4 className={styles.categoryName}>{category.name}</h4>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MegaMenu;
