'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function BrandStory() {
  return (
    <section className="bg-bg-blush py-20 md:py-24">
      <div className="max-w-[1430px] mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1515562141589-67f0d569b6c2?w=800&q=80"
            alt="Stellora Silver elegant jewellery craftsmanship"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            unoptimized
          />
        </div>
        <div>
          <span className="text-xs uppercase tracking-[4px] text-primary font-semibold">Our Story</span>
          <h2 className="text-3xl md:text-4xl font-medium text-heading mt-4 mb-6 font-[family-name:var(--font-serif)]">
            Crafted with Passion &amp; Precision
          </h2>
          <p className="text-body leading-relaxed mb-5">
            For over three decades, Stellora Silver has embodied refined elegance, timeless beauty,
            and exquisite craftsmanship. Our master artisans bring passion and precision to every
            creation, transforming premium materials into sophisticated artificial jewellery that
            radiates grace and individuality.
          </p>
          <p className="text-body leading-relaxed mb-8">
            We believe that true luxury is found in the finest details. From the careful selection
            of designs to the flawless finishing touch, every step reflects our unwavering commitment
            to perfection and artistry. Every Stellora Silver piece is a celebration of heritage and
            contemporary sophistication.
          </p>
          <Link
            href="/about"
            className="inline-block px-8 py-3 rounded-full border border-primary text-primary text-sm uppercase tracking-[2px] font-medium hover:bg-primary hover:text-white transition-all duration-300"
          >
            Discover More
          </Link>
        </div>
      </div>
    </section>
  );
}
