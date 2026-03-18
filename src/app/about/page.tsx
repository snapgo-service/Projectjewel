import Image from 'next/image';
import { IMAGES } from '@/data/images';
import Breadcrumb from '@/components/layout/Breadcrumb';

export default function AboutPage() {
  return (
    <>
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'About Us' }]} />
      <div style={{ padding: '60px 0' }}>
        <div style={{ maxWidth: 1430, margin: '0 auto', padding: '0 15px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 50, alignItems: 'center', marginBottom: 60 }}>
            <div style={{ position: 'relative', aspectRatio: '4/3', borderRadius: 8, overflow: 'hidden' }}>
              <Image src={IMAGES.heroProduct} alt="About Jubilee" fill style={{ objectFit: 'cover' }} sizes="(max-width: 768px) 100vw, 50vw" />
            </div>
            <div>
              <h1 style={{ fontSize: 36, fontWeight: 500, color: '#222', marginBottom: 20 }}>About Jubilee</h1>
              <p style={{ color: '#666', lineHeight: 1.8, marginBottom: 15 }}>
                Jubilee is a premier destination for fine diamond jewelry, offering an exquisite collection of handcrafted pieces
                that celebrate life&apos;s most precious moments. Founded with a passion for exceptional craftsmanship,
                we bring together traditional artistry and modern design.
              </p>
              <p style={{ color: '#666', lineHeight: 1.8, marginBottom: 15 }}>
                Each piece in our collection is carefully selected for its quality, beauty, and craftsmanship.
                We work with the finest materials — from ethically sourced diamonds to premium gold in yellow,
                white, and rose variants — ensuring every creation meets our exacting standards.
              </p>
              <p style={{ color: '#666', lineHeight: 1.8 }}>
                Our commitment to excellence extends beyond our jewelry. We pride ourselves on providing
                an exceptional shopping experience, from personalized consultations to our hassle-free
                return policy. At Jubilee, every customer is part of our family.
              </p>
            </div>
          </div>

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

          <div style={{ textAlign: 'center', maxWidth: 800, margin: '0 auto' }}>
            <h2 style={{ fontSize: 28, fontWeight: 500, color: '#222', marginBottom: 20 }}>Our Mission</h2>
            <p style={{ color: '#666', lineHeight: 1.8, fontSize: 16 }}>
              To create timeless pieces of jewelry that capture the essence of beauty and elegance,
              making luxury accessible while maintaining the highest standards of quality and ethical sourcing.
              We believe that every piece of jewelry tells a story, and we&apos;re honored to be part of yours.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
