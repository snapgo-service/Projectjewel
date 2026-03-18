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
            src="https://demos.codezeel.com/wordpress/WCM08/WCM080196/default/wp-content/uploads/sites/flavor1/2023/06/bn-1.jpg"
            alt="Jubilee luxury jewelry lifestyle"
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
            For over three decades, Jubilee has been synonymous with timeless elegance and
            unparalleled craftsmanship. Our master artisans pour their heart and soul into every
            piece, transforming precious metals and ethically sourced diamonds into wearable works
            of art that celebrate life&apos;s most cherished moments.
          </p>
          <p className={styles.text}>
            We believe that true luxury lies in the details. From hand-selecting each stone to the
            final polish, every step of our process reflects a deep commitment to quality and
            sustainability. Each Jubilee creation is a testament to our heritage — a perfect blend
            of tradition and modern design that stands the test of time.
          </p>
          <Link href="/about" className={styles.cta}>
            Discover More
          </Link>
        </div>
      </div>
    </section>
  );
}
