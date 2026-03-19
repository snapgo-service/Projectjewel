'use client';

import Image from 'next/image';
import Link from 'next/link';
import styles from './BrandStory.module.css';

export default function BrandStory() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.imageWrapper}>
          <Image
            src="https://images.unsplash.com/photo-1515562141589-67f0d569b6c2?w=800&q=80"
            alt="Stellora Silver elegant jewellery craftsmanship"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className={styles.image}
            unoptimized
          />
        </div>
        <div className={styles.content}>
          <span className={styles.label}>OUR STORY</span>
          <h2 className={styles.headline}>Crafted with Passion &amp; Precision</h2>
          <p className={styles.text}>
            For over three decades, Stellora Silver has embodied refined elegance, timeless beauty,
            and exquisite craftsmanship. Our master artisans bring passion and precision to every
            creation, transforming premium materials into sophisticated artificial jewellery that
            radiates grace and individuality. Each design is thoughtfully curated to elevate your
            style and mark life&apos;s most treasured moments with brilliance.
          </p>
          <p className={styles.text}>
            We believe that true luxury is found in the finest details. From the careful selection
            of designs to the flawless finishing touch, every step reflects our unwavering commitment
            to perfection and artistry. Every Stellora Silver piece is a celebration of heritage and
            contemporary sophistication — a seamless fusion of classic charm and modern allure
            designed to leave a lasting impression.
          </p>
          <Link href="/about" className={styles.cta}>
            Discover More
          </Link>
        </div>
      </div>
    </section>
  );
}
