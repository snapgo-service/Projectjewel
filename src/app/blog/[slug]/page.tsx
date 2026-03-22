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
      <div className="text-center py-24 px-4">
        <h1 className="text-heading text-2xl font-medium">Post Not Found</h1>
        <p className="text-body mt-3">The blog post you&apos;re looking for doesn&apos;t exist.</p>
        <Link href="/blog" className="text-primary mt-4 inline-block font-medium hover:text-primary-hover transition-colors">← Back to Blog</Link>
      </div>
    );
  }

  return (
    <>
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Blog', href: '/blog' }, { label: post.title }]} />
      <div className="py-16">
        <div className="max-w-3xl mx-auto px-4">
          <div className="mb-8">
            <div className="flex gap-3 text-xs text-body-light mb-4">
              <span>{post.date}</span>
              <span>|</span>
              <span>{post.category}</span>
              <span>|</span>
              <span>By {post.author}</span>
            </div>
            <h1 className="text-3xl font-medium text-heading leading-tight mb-5 font-[family-name:var(--font-serif)]">
              {post.title}
            </h1>
          </div>

          <div className="relative aspect-video mb-8 rounded-2xl overflow-hidden">
            <Image src={post.image} alt={post.title} fill sizes="800px" className="object-cover" priority />
          </div>

          <div
            className="text-body leading-relaxed text-base prose prose-headings:text-heading prose-a:text-primary max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className="mt-10 pt-8 border-t border-border flex gap-2.5 flex-wrap">
            <span className="font-medium text-heading">Tags:</span>
            {post.tags.map((tag) => (
              <span key={tag} className="px-3 py-1 bg-bg-ivory text-body text-xs rounded-full">
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-8">
            <Link href="/blog" className="text-primary font-medium hover:text-primary-hover transition-colors">← Back to Blog</Link>
          </div>
        </div>
      </div>
    </>
  );
}
