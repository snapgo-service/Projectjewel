import Image from 'next/image';
import { IMAGES } from '@/data/images';
import Breadcrumb from '@/components/layout/Breadcrumb';

export default function AboutPage() {
  return (
    <>
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'About Us' }]} />
      <div className="py-16">
        <div className="max-w-[1430px] mx-auto px-4">
          {/* Hero Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
              <Image src={IMAGES.heroProduct} alt="About Stellora Silver" fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
            </div>
            <div>
              <h1 className="text-4xl font-medium text-heading mb-5 font-[family-name:var(--font-serif)]">About Stellora Silver</h1>
              <h3 className="text-xl font-normal text-primary mb-5">The Story of Stellora Silver</h3>
              <p className="text-body leading-relaxed mb-4">
                At Stellora Silver, we believe jewellery is more than an accessory—it is an expression of elegance,
                confidence, and individuality. Born from a passion for timeless design and refined artistry,
                Stellora Silver was created to bring the brilliance of luxury within reach, without compromising
                on quality or style.
              </p>
              <p className="text-body leading-relaxed">
                Our journey began with a vision to redefine artificial jewellery by blending classic sophistication
                with modern trends. Today, Stellora Silver stands as a symbol of grace and craftsmanship, offering
                pieces that capture attention and celebrate every moment with effortless beauty.
              </p>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center py-10 border-t border-b border-border mb-16 bg-bg-blush rounded-xl">
            {[
              { number: '15+', label: 'Years Experience' },
              { number: '5000+', label: 'Happy Customers' },
              { number: '2000+', label: 'Products' },
              { number: '50+', label: 'Awards Won' },
            ].map((stat) => (
              <div key={stat.label} className="p-4">
                <div className="text-4xl font-semibold text-primary mb-2">{stat.number}</div>
                <div className="text-sm text-body uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Our Craftsmanship Section */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-medium text-heading mb-5 font-[family-name:var(--font-serif)]">Our Craftsmanship</h2>
            <p className="text-body leading-relaxed text-base mb-4">
              Every Stellora Silver creation is a reflection of meticulous craftsmanship and thoughtful design.
              Our artisans carefully shape each piece with precision, ensuring that every detail—from intricate
              patterns to the final polish—meets the highest standards of excellence.
            </p>
            <p className="text-body leading-relaxed text-base">
              We use premium-quality materials to create jewellery that not only looks luxurious but also feels
              comfortable and long-lasting. Each design is curated to mirror the brilliance of fine jewellery,
              allowing you to shine with confidence on every occasion.
            </p>
          </div>

          {/* Our Philosophy Section */}
          <div className="text-center max-w-3xl mx-auto mb-16 bg-bg-blush rounded-xl p-10">
            <h2 className="text-3xl font-medium text-heading mb-5 font-[family-name:var(--font-serif)]">Our Philosophy</h2>
            <p className="text-body leading-relaxed text-base mb-4">
              Luxury lies in the details, and at Stellora Silver, perfection is our standard. We are dedicated
              to creating designs that are elegant, versatile, and timeless. Our collections are inspired by
              modern aesthetics while staying rooted in classic charm—making every piece a seamless blend of
              tradition and contemporary style.
            </p>
            <p className="text-body leading-relaxed text-base">
              We believe that every individual deserves to feel extraordinary. That&apos;s why our jewellery is
              designed to complement your personality, elevate your presence, and make every moment unforgettable.
            </p>
          </div>

          {/* Why Choose Stellora Silver Section */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-medium text-heading mb-5 font-[family-name:var(--font-serif)]">Why Choose Stellora Silver</h2>
            <div className="inline-block text-left">
              {[
                'Premium-quality artificial jewellery with a luxurious finish',
                'Designs inspired by global fashion and timeless elegance',
                'Crafted with precision, care, and attention to detail',
                'Perfect for everyday wear and special occasions',
                'Affordable luxury without compromise',
              ].map((item) => (
                <p key={item} className="text-body leading-loose text-base">
                  ✨ {item}
                </p>
              ))}
            </div>
          </div>

          {/* Our Promise Section */}
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-medium text-heading mb-5 font-[family-name:var(--font-serif)]">Our Promise</h2>
            <p className="text-body leading-relaxed text-base">
              At Stellora Silver, we promise to deliver more than just jewellery—we deliver an experience of
              elegance, trust, and sophistication. Every piece you wear tells a story of beauty and confidence,
              designed to make you feel your absolute best.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
