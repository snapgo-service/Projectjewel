import Image from 'next/image';
import { IMAGES } from '@/data/images';
import Breadcrumb from '@/components/layout/Breadcrumb';

export default function AboutPage() {
  return (
    <>
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'About Us' }]} />
      <div style={{ padding: '60px 0' }}>
        <div style={{ maxWidth: 1430, margin: '0 auto', padding: '0 15px' }}>
          {/* About Us Section */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 50, alignItems: 'center', marginBottom: 60 }}>
            <div style={{ position: 'relative', aspectRatio: '4/3', borderRadius: 8, overflow: 'hidden' }}>
              <Image src={IMAGES.heroProduct} alt="About Stellora Silver" fill style={{ objectFit: 'cover' }} sizes="(max-width: 768px) 100vw, 50vw" />
            </div>
            <div>
              <h1 style={{ fontSize: 36, fontWeight: 500, color: '#222', marginBottom: 20 }}>About Stellora Silver</h1>
              <h3 style={{ fontSize: 20, fontWeight: 400, color: '#ce967e', marginBottom: 20 }}>The Story of Stellora Silver</h3>
              <p style={{ color: '#666', lineHeight: 1.8, marginBottom: 15 }}>
                At Stellora Silver, we believe jewellery is more than an accessory—it is an expression of elegance,
                confidence, and individuality. Born from a passion for timeless design and refined artistry,
                Stellora Silver was created to bring the brilliance of luxury within reach, without compromising
                on quality or style.
              </p>
              <p style={{ color: '#666', lineHeight: 1.8 }}>
                Our journey began with a vision to redefine artificial jewellery by blending classic sophistication
                with modern trends. Today, Stellora Silver stands as a symbol of grace and craftsmanship, offering
                pieces that capture attention and celebrate every moment with effortless beauty.
              </p>
            </div>
          </div>

          {/* Stats Section */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 30, textAlign: 'center', padding: '40px 0', borderTop: '1px solid #e5e5e5', borderBottom: '1px solid #e5e5e5', marginBottom: 60 }}>
            {[
              { number: '15+', label: 'Years Experience' },
              { number: '5000+', label: 'Happy Customers' },
              { number: '2000+', label: 'Products' },
              { number: '50+', label: 'Awards Won' },
            ].map((stat) => (
              <div key={stat.label}>
                <div style={{ fontSize: 36, fontWeight: 600, color: '#ce967e', marginBottom: 8 }}>{stat.number}</div>
                <div style={{ fontSize: 15, color: '#666', textTransform: 'uppercase', letterSpacing: 1 }}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Our Craftsmanship Section */}
          <div style={{ textAlign: 'center', maxWidth: 800, margin: '0 auto', marginBottom: 60 }}>
            <h2 style={{ fontSize: 28, fontWeight: 500, color: '#222', marginBottom: 20 }}>Our Craftsmanship</h2>
            <p style={{ color: '#666', lineHeight: 1.8, fontSize: 16, marginBottom: 15 }}>
              Every Stellora Silver creation is a reflection of meticulous craftsmanship and thoughtful design.
              Our artisans carefully shape each piece with precision, ensuring that every detail—from intricate
              patterns to the final polish—meets the highest standards of excellence.
            </p>
            <p style={{ color: '#666', lineHeight: 1.8, fontSize: 16 }}>
              We use premium-quality materials to create jewellery that not only looks luxurious but also feels
              comfortable and long-lasting. Each design is curated to mirror the brilliance of fine jewellery,
              allowing you to shine with confidence on every occasion.
            </p>
          </div>

          {/* Our Philosophy Section */}
          <div style={{ textAlign: 'center', maxWidth: 800, margin: '0 auto', marginBottom: 60 }}>
            <h2 style={{ fontSize: 28, fontWeight: 500, color: '#222', marginBottom: 20 }}>Our Philosophy</h2>
            <p style={{ color: '#666', lineHeight: 1.8, fontSize: 16, marginBottom: 15 }}>
              Luxury lies in the details, and at Stellora Silver, perfection is our standard. We are dedicated
              to creating designs that are elegant, versatile, and timeless. Our collections are inspired by
              modern aesthetics while staying rooted in classic charm—making every piece a seamless blend of
              tradition and contemporary style.
            </p>
            <p style={{ color: '#666', lineHeight: 1.8, fontSize: 16 }}>
              We believe that every individual deserves to feel extraordinary. That&apos;s why our jewellery is
              designed to complement your personality, elevate your presence, and make every moment unforgettable.
            </p>
          </div>

          {/* Why Choose Stellora Silver Section */}
          <div style={{ textAlign: 'center', maxWidth: 800, margin: '0 auto', marginBottom: 60 }}>
            <h2 style={{ fontSize: 28, fontWeight: 500, color: '#222', marginBottom: 20 }}>Why Choose Stellora Silver</h2>
            <div style={{ display: 'inline-block', textAlign: 'left' }}>
              {[
                'Premium-quality artificial jewellery with a luxurious finish',
                'Designs inspired by global fashion and timeless elegance',
                'Crafted with precision, care, and attention to detail',
                'Perfect for everyday wear and special occasions',
                'Affordable luxury without compromise',
              ].map((item) => (
                <p key={item} style={{ color: '#666', lineHeight: 2, fontSize: 16 }}>
                  ✨ {item}
                </p>
              ))}
            </div>
          </div>

          {/* Our Promise Section */}
          <div style={{ textAlign: 'center', maxWidth: 800, margin: '0 auto' }}>
            <h2 style={{ fontSize: 28, fontWeight: 500, color: '#222', marginBottom: 20 }}>Our Promise</h2>
            <p style={{ color: '#666', lineHeight: 1.8, fontSize: 16 }}>
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
