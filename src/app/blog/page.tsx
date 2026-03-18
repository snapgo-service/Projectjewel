'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useAdmin } from '@/store/AdminContext';
import Breadcrumb from '@/components/layout/Breadcrumb';

export default function BlogPage() {
  const { blogPosts } = useAdmin();
  return (
    <>
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Blog' }]} />
      <div style={{ padding: '60px 0' }}>
        <div style={{ maxWidth: 1430, margin: '0 auto', padding: '0 15px' }}>
          <div style={{ textAlign: 'center', marginBottom: 50 }}>
            <h1 style={{ fontSize: 36, fontWeight: 500, color: '#222', marginBottom: 15 }}>Our Blog</h1>
            <p style={{ color: '#666', maxWidth: 600, margin: '0 auto' }}>
              Discover jewelry tips, trends, and expert guides from our team.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 30 }}>
            {blogPosts.map((post) => (
              <article key={post.id} style={{ background: '#fff', overflow: 'hidden', transition: 'box-shadow 0.3s' }}>
                <Link href={`/blog/${post.slug}`} style={{ display: 'block', position: 'relative', aspectRatio: '16/10', overflow: 'hidden' }}>
                  <Image src={post.image} alt={post.title} fill sizes="(max-width: 768px) 100vw, 33vw" style={{ objectFit: 'cover', transition: 'transform 0.5s' }} />
                </Link>
                <div style={{ padding: '20px 0' }}>
                  <div style={{ display: 'flex', gap: 15, fontSize: 13, color: '#999', marginBottom: 10 }}>
                    <span>{post.date}</span>
                    <span>|</span>
                    <span>{post.category}</span>
                  </div>
                  <h2 style={{ fontSize: 20, fontWeight: 500, color: '#222', marginBottom: 12, lineHeight: 1.4 }}>
                    <Link href={`/blog/${post.slug}`} style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.3s' }}>
                      {post.title}
                    </Link>
                  </h2>
                  <p style={{ color: '#666', fontSize: 14, lineHeight: 1.6, marginBottom: 15 }}>
                    {post.excerpt}
                  </p>
                  <Link href={`/blog/${post.slug}`} style={{ color: '#ce967e', fontSize: 13, fontWeight: 500, textTransform: 'uppercase', letterSpacing: 1 }}>
                    Read More →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
