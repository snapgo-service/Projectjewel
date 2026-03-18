'use client';

import styles from './Testimonials.module.css';

const testimonials = [
  {
    quote:
      'The diamond ring I purchased exceeded all expectations. The craftsmanship is absolutely stunning and the customer service was impeccable.',
    name: 'Sarah Mitchell',
    location: 'New York',
  },
  {
    quote:
      "I've been a loyal customer for years. Every piece from Jubilee tells a story of elegance and sophistication. Simply the best.",
    name: 'Priya Sharma',
    location: 'Mumbai',
  },
  {
    quote:
      'The attention to detail in their jewelry is remarkable. My wife was speechless when she saw the necklace. Worth every penny!',
    name: 'James Anderson',
    location: 'London',
  },
];

export default function Testimonials() {
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
          {testimonials.map((t) => (
            <div key={t.name} className={styles.card}>
              <span className={styles.quoteMark}>&ldquo;</span>
              <p className={styles.quote}>{t.quote}</p>
              <div className={styles.stars}>&#9733;&#9733;&#9733;&#9733;&#9733;</div>
              <p className={styles.name}>{t.name}</p>
              <p className={styles.location}>{t.location}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
