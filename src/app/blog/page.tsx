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
      <div className="py-16">
        <div className="max-w-[1430px] mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-medium text-heading mb-4 font-[family-name:var(--font-serif)]">Our Blog</h1>
            <p className="text-body max-w-xl mx-auto">
              Discover jewelry tips, trends, and expert guides from our team.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <article key={post.id} className="bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-shadow duration-300">
                <Link href={`/blog/${post.slug}`} className="block relative aspect-[16/10] overflow-hidden">
                  <Image src={post.image} alt={post.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-500 hover:scale-105" />
                </Link>
                <div className="p-5">
                  <div className="flex gap-3 text-xs text-body-light mb-3">
                    <span>{post.date}</span>
                    <span>|</span>
                    <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full">{post.category}</span>
                  </div>
                  <h2 className="text-lg font-medium text-heading mb-3 leading-snug">
                    <Link href={`/blog/${post.slug}`} className="text-inherit no-underline hover:text-primary transition-colors duration-300">
                      {post.title}
                    </Link>
                  </h2>
                  <p className="text-body text-sm leading-relaxed mb-4">
                    {post.excerpt}
                  </p>
                  <Link href={`/blog/${post.slug}`} className="text-primary text-xs font-medium uppercase tracking-wider hover:text-primary-hover transition-colors">
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
