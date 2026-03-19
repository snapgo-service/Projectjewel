'use client';

import { useAdmin } from '@/store/AdminContext';
import styles from './Testimonials.module.css';

export default function Testimonials() {
  const { testimonials } = useAdmin();
  const active = testimonials
    .filter(t => t.isActive)
    .sort((a, b) => a.order - b.order);

  if (active.length === 0) return null;

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>What Our Customers Say</h2>
          <p className={styles.subtitle}>
            Trusted by thousands of happy customers worldwide
          </p>
        </div>
        <div className={styles.grid}>
          {active.map((t) => (
            <div key={t.id} className={styles.card}>
              <span className={styles.quoteMark}>&ldquo;</span>
              <p className={styles.quote}>{t.quote}</p>
              <div className={styles.stars}>{'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}</div>
              <p className={styles.name}>{t.name}</p>
              {t.location && <p className={styles.location}>{t.location}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
