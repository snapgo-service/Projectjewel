'use client';

import { useState, FormEvent } from 'react';
import styles from './Newsletter.module.css';

export default function Newsletter() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <span className={styles.label}>NEWSLETTER</span>
        <h2 className={styles.title}>Join the Jubilee Family</h2>
        <p className={styles.subtitle}>
          Subscribe to receive exclusive offers, new arrivals, and styling tips
          directly to your inbox.
        </p>

        {submitted ? (
          <p className={styles.thankYou}>Thank you!</p>
        ) : (
          <form className={styles.form} onSubmit={handleSubmit}>
            <input
              type="email"
              required
              placeholder="Enter your email address"
              className={styles.input}
            />
            <button type="submit" className={styles.button}>
              Subscribe
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
