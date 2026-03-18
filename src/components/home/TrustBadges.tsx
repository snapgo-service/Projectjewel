'use client';

import styles from './TrustBadges.module.css';

const badges = [
  {
    title: 'Free Shipping',
    subtitle: 'On orders over $99',
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M26 10H2V28H26V10Z"
          stroke="#ce967e"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M26 16H32L38 22V28H26V16Z"
          stroke="#ce967e"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="9" cy="31" r="3" stroke="#ce967e" strokeWidth="2" />
        <circle cx="31" cy="31" r="3" stroke="#ce967e" strokeWidth="2" />
      </svg>
    ),
  },
  {
    title: 'Certified Diamonds',
    subtitle: 'Ethically sourced gems',
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M20 4L6 16L20 36L34 16L20 4Z"
          stroke="#ce967e"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M6 16H34"
          stroke="#ce967e"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M14 4L10 16L20 36L30 16L26 4"
          stroke="#ce967e"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: '30-Day Returns',
    subtitle: 'Hassle-free returns',
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M6 14C8.18 9.68 12.72 7 18 7C25.18 7 31 12.82 31 20C31 27.18 25.18 33 18 33C12.26 33 7.42 29.6 5.56 24.74"
          stroke="#ce967e"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M2 10L6 14L10 10"
          stroke="#ce967e"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: 'Secure Payment',
    subtitle: '100% protected checkout',
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect
          x="7"
          y="18"
          width="26"
          height="18"
          rx="2"
          stroke="#ce967e"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 18V12C12 7.58 15.58 4 20 4C24.42 4 28 7.58 28 12V18"
          stroke="#ce967e"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="20" cy="28" r="2" fill="#ce967e" />
      </svg>
    ),
  },
];

export default function TrustBadges() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {badges.map((badge) => (
          <div key={badge.title} className={styles.badge}>
            <div className={styles.icon}>{badge.icon}</div>
            <div className={styles.text}>
              <h4 className={styles.title}>{badge.title}</h4>
              <p className={styles.subtitle}>{badge.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
