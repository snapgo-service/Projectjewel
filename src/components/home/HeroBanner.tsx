'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAdmin } from '@/store/AdminContext';
import { IMAGES } from '@/data/images';
import styles from './HeroBanner.module.css';

export function HeroBanner() {
  const { sliders } = useAdmin();
  const activeSliders = sliders.filter(s => s.isActive).sort((a, b) => a.order - b.order);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (activeSliders.length <= 1) return;
    const interval = setInterval(() => {
      setCurrent(prev => (prev + 1) % activeSliders.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [activeSliders.length]);

  const slide = activeSliders[current] || {
    title: 'Special sale! Up to 30% OFF',
    subtitle: 'Special Collection',
    description: 'Discover our exclusive collection of handcrafted diamond jewelry.',
    buttonText: 'Shop Now',
    buttonLink: '/shop',
    backgroundImage: IMAGES.heroBg,
    productImage: IMAGES.heroProduct,
  };

  return (
    <section className={styles.hero}>
      <Image
        src={slide.backgroundImage || IMAGES.heroBg}
        alt="Stellora Silver Jewellery"
        fill
        priority
        className={styles.bgImage}
        unoptimized
      />
      <div className={styles.overlay} />
      <div className={styles.content}>
        <div className={styles.textContent}>
          <p className={styles.subtitle} style={slide.subtitleColor ? { color: slide.subtitleColor } : undefined}>{slide.subtitle}</p>
          <h1 className={styles.title} style={slide.titleColor ? { color: slide.titleColor } : undefined}>
            {slide.title}
          </h1>
          <p className={styles.description} style={slide.descriptionColor ? { color: slide.descriptionColor } : undefined}>{slide.description}</p>
          <Link href={slide.buttonLink} style={{
            display: 'inline-block',
            padding: '12px 35px',
            background: slide.buttonBgColor || '#ce967e',
            color: slide.buttonTextColor || '#fff',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            fontSize: '14px',
            fontWeight: 500,
            transition: 'all 0.3s ease',
          }}>
            {slide.buttonText}
          </Link>
          {activeSliders.length > 1 && (
            <div style={{ display: 'flex', gap: 8, marginTop: 25 }}>
              {activeSliders.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  style={{
                    width: i === current ? 30 : 10,
                    height: 10,
                    borderRadius: 5,
                    background: i === current ? '#ce967e' : 'rgba(255,255,255,0.5)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                  }}
                />
              ))}
            </div>
          )}
        </div>
        {slide.productImage && (
          <div className={styles.productImage}>
            <Image
              src={slide.productImage}
              alt="Featured Jewelry"
              fill
              sizes="400px"
              style={{ objectFit: 'contain' }}
              priority
              unoptimized
            />
          </div>
        )}
      </div>
    </section>
  );
}
