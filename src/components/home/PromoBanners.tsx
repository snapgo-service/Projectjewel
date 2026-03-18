'use client';

import { useAdmin } from '@/store/AdminContext';
import Link from 'next/link';
import styles from './PromoBanners.module.css';

export default function PromoBanners() {
  const { posters } = useAdmin();
  const activeBanners = posters
    .filter((p) => p.isActive)
    .sort((a, b) => a.order - b.order)
    .slice(0, 3);

  if (activeBanners.length === 0) return null;

  const gridClass =
    activeBanners.length === 1
      ? styles.gridSingle
      : activeBanners.length === 2
        ? styles.gridTwo
        : styles.gridThree;

  return (
    <section className={styles.section}>
      <div className={`${styles.container} ${gridClass}`}>
        {activeBanners.map((banner, index) => (
          <div
            key={banner.id}
            className={`${styles.banner} ${
              activeBanners.length === 2 && index === 0 ? styles.bannerWide : ''
            }`}
          >
            <div
              className={styles.imageWrapper}
              style={{ backgroundImage: `url(${banner.image})` }}
            />
            <div className={styles.overlay} />
            <div className={styles.content}>
              <h3 className={styles.title}>{banner.title}</h3>
              {banner.subtitle && (
                <p className={styles.subtitle}>{banner.subtitle}</p>
              )}
              <Link href={banner.link} className={styles.cta}>
                Shop Now
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
