'use client';

import { useAdmin } from '@/store/AdminContext';
import Link from 'next/link';

export default function PromoBanners() {
  const { posters } = useAdmin();
  const activeBanners = posters
    .filter((p) => p.isActive)
    .sort((a, b) => a.order - b.order)
    .slice(0, 3);

  if (activeBanners.length === 0) return null;

  const gridClass =
    activeBanners.length === 1
      ? 'grid-cols-1'
      : activeBanners.length === 2
        ? 'grid-cols-1 md:grid-cols-2'
        : 'grid-cols-1 md:grid-cols-3';

  return (
    <section className="py-16 md:py-20">
      <div className={`max-w-[1430px] mx-auto px-4 grid ${gridClass} gap-6`}>
        {activeBanners.map((banner) => (
          <div key={banner.id} className="group relative rounded-xl overflow-hidden aspect-[16/9] md:aspect-[4/3]">
            <div
              className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700"
              style={{ backgroundImage: `url(${banner.image})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-heading/60 via-heading/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
              <h3 className="text-white text-xl md:text-2xl font-medium mb-1">{banner.title}</h3>
              {banner.subtitle && (
                <p className="text-white/80 text-sm mb-4">{banner.subtitle}</p>
              )}
              <Link
                href={banner.link}
                className="inline-block text-xs uppercase tracking-[2px] font-medium text-white border-b border-white/60 pb-0.5 hover:border-primary hover:text-primary transition-all duration-300"
              >
                Shop Now
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
