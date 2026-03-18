'use client';

import { use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAdmin } from '@/store/AdminContext';
import Breadcrumb from '@/components/layout/Breadcrumb';

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { blogPosts } = useAdmin();
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 15px' }}>
        <h1>Post Not Found</h1>
        <p style={{ color: '#666', marginTop: 10 }}>The blog post you&apos;re looking for doesn&apos;t exist.</p>
        <Link href="/blog" style={{ color: '#ce967e', marginTop: 15, display: 'inline-block' }}>← Back to Blog</Link>
      </div>
    );
  }

  return (
    <>
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Blog', href: '/blog' }, { label: post.title }]} />
      <div style={{ padding: '60px 0' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 15px' }}>
          <div style={{ marginBottom: 30 }}>
            <div style={{ display: 'flex', gap: 15, fontSize: 13, color: '#999', marginBottom: 15 }}>
              <span>{post.date}</span>
              <span>|</span>
              <span>{post.category}</span>
              <span>|</span>
              <span>By {post.author}</span>
            </div>
            <h1 style={{ fontSize: 32, fontWeight: 500, color: '#222', lineHeight: 1.3, marginBottom: 20 }}>
              {post.title}
            </h1>
          </div>

          <div style={{ position: 'relative', aspectRatio: '16/9', marginBottom: 30, borderRadius: 8, overflow: 'hidden' }}>
            <Image src={post.image} alt={post.title} fill sizes="800px" style={{ objectFit: 'cover' }} priority />
          </div>

          <div
            style={{ color: '#666', lineHeight: 1.8, fontSize: 16 }}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div style={{ marginTop: 40, paddingTop: 30, borderTop: '1px solid #e5e5e5', display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 500, color: '#222' }}>Tags:</span>
            {post.tags.map((tag) => (
              <span key={tag} style={{ padding: '4px 12px', background: '#f7f7f7', fontSize: 13, color: '#666' }}>
                {tag}
              </span>
            ))}
          </div>

          <div style={{ marginTop: 30 }}>
            <Link href="/blog" style={{ color: '#ce967e', fontWeight: 500 }}>← Back to Blog</Link>
          </div>
        </div>
      </div>
    </>
  );
}
