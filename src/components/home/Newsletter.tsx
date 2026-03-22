'use client';

import { useState, FormEvent } from 'react';

export default function Newsletter() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="bg-primary/10 py-16 md:py-20">
      <div className="max-w-xl mx-auto px-4 text-center">
        <span className="text-xs uppercase tracking-[4px] text-primary font-semibold">Newsletter</span>
        <h2 className="text-2xl md:text-3xl font-medium text-heading mt-3 mb-3 font-[family-name:var(--font-serif)]">
          Join the Stellora Silver Family
        </h2>
        <p className="text-body text-sm mb-8">
          Subscribe to receive exclusive offers, new arrivals, and styling tips
          directly to your inbox.
        </p>

        {submitted ? (
          <p className="text-primary font-medium text-lg">Thank you for subscribing!</p>
        ) : (
          <form className="flex flex-col sm:flex-row gap-3" onSubmit={handleSubmit}>
            <input
              type="email"
              required
              placeholder="Enter your email address"
              className="flex-1 px-6 py-3.5 rounded-full border border-border bg-white text-heading text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all"
            />
            <button
              type="submit"
              className="px-8 py-3.5 rounded-full bg-primary text-white text-sm font-medium uppercase tracking-wider hover:bg-primary-hover transition-all duration-300"
            >
              Subscribe
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
