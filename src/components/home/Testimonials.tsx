'use client';

import { useAdmin } from '@/store/AdminContext';

export default function Testimonials() {
  const { testimonials } = useAdmin();
  const active = testimonials
    .filter(t => t.isActive)
    .sort((a, b) => a.order - b.order);

  if (active.length === 0) return null;

  return (
    <section className="bg-bg-blush py-20 md:py-24">
      <div className="max-w-[1430px] mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-medium text-heading font-[family-name:var(--font-serif)] inline-block relative pb-4 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-12 after:h-0.5 after:bg-primary">
            What Our Customers Say
          </h2>
          <p className="text-body mt-4">Trusted by thousands of happy customers worldwide</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {active.map((t) => (
            <div key={t.id} className="bg-white rounded-xl p-8 shadow-card relative">
              <span className="text-6xl text-primary/20 font-[family-name:var(--font-serif)] leading-none absolute top-4 left-6">&ldquo;</span>
              <p className="text-body leading-relaxed mt-6 mb-5">{t.quote}</p>
              <div className="text-star text-sm mb-3">
                {'★'.repeat(t.rating)}
                <span className="text-star-empty">{'★'.repeat(5 - t.rating)}</span>
              </div>
              <p className="text-heading font-medium text-sm">{t.name}</p>
              {t.location && <p className="text-body-light text-xs mt-0.5">{t.location}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
