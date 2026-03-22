'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAdmin } from '@/store/AdminContext';
import { IMAGES } from '@/data/images';

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
    <section className="relative min-h-[500px] md:min-h-[600px] flex items-center overflow-hidden">
      <Image
        src={slide.backgroundImage || IMAGES.heroBg}
        alt="Stellora Silver Jewellery"
        fill
        priority
        className="object-cover"
        unoptimized
      />
      <div className="absolute inset-0 bg-gradient-to-r from-heading/60 via-heading/30 to-transparent" />
      <div className="relative z-10 max-w-[1430px] mx-auto px-4 w-full flex items-center justify-between py-16">
        <div className="max-w-xl">
          <p
            className="text-sm md:text-base uppercase tracking-[4px] mb-4 font-[family-name:var(--font-serif)] italic"
            style={{ color: slide.subtitleColor || '#E8A0BF' }}
          >
            {slide.subtitle}
          </p>
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight mb-5"
            style={{ color: slide.titleColor || '#ffffff' }}
          >
            {slide.title}
          </h1>
          <p
            className="text-base md:text-lg leading-relaxed mb-8 max-w-md"
            style={{ color: slide.descriptionColor || 'rgba(255,255,255,0.85)' }}
          >
            {slide.description}
          </p>
          <Link
            href={slide.buttonLink}
            className="inline-block px-10 py-4 rounded-full uppercase tracking-[2px] text-sm font-medium transition-all duration-300 hover:opacity-90 hover:translate-y-[-2px]"
            style={{
              background: slide.buttonBgColor || '#E8A0BF',
              color: slide.buttonTextColor || '#fff',
            }}
          >
            {slide.buttonText}
          </Link>
          {activeSliders.length > 1 && (
            <div className="flex gap-2 mt-8">
              {activeSliders.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    i === current
                      ? 'w-8 bg-primary'
                      : 'w-2.5 bg-white/50 hover:bg-white/70'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
        {slide.productImage && (
          <div className="hidden lg:block relative w-[400px] h-[400px]">
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
