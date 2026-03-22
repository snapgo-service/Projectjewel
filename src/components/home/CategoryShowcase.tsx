'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useAdmin } from '@/store/AdminContext';

export function CategoryShowcase() {
  const { categories } = useAdmin();

  return (
    <section className="py-20 md:py-24 bg-white">
      <div className="max-w-[1430px] mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-medium text-heading font-[family-name:var(--font-serif)] inline-block relative pb-4 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-12 after:h-0.5 after:bg-primary">
            Shop By Category
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
          {categories.filter((cat) => cat.image).map((cat) => (
            <Link href={`/category/${cat.slug}`} key={cat.slug} className="group relative aspect-[3/4] rounded-xl overflow-hidden">
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-heading/70 via-heading/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
                <div className="text-white font-medium text-sm uppercase tracking-wider">{cat.name}</div>
                <div className="text-white/70 text-xs mt-1">{cat.productCount} Products</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
