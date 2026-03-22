'use client';

import { useState } from 'react';
import Breadcrumb from '@/components/layout/Breadcrumb';

const faqs = [
  { q: 'What payment methods do you accept?', a: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers. All transactions are secured with SSL encryption.' },
  { q: 'Do you offer free shipping?', a: 'Yes! We offer free worldwide shipping on all orders over $199. Orders under $199 have a flat shipping rate of $15.' },
  { q: 'What is your return policy?', a: 'We offer a 30-day return policy on all unworn and undamaged items. Items must be returned in their original packaging with all tags attached.' },
  { q: 'Are your diamonds certified?', a: 'Yes, all our diamonds are certified by reputable gemological laboratories including GIA, AGS, and IGI. Each diamond comes with its certification documentation.' },
  { q: 'Do you offer custom jewelry?', a: 'Absolutely! We offer custom design services where you can work with our expert jewelers to create your dream piece. Contact us for a consultation.' },
  { q: 'How do I determine my ring size?', a: 'You can use our printable ring size guide available on our website, visit a local jeweler for measurement, or order our free ring sizer kit.' },
  { q: 'Do you offer warranty on your products?', a: 'Yes, all our jewelry comes with a lifetime warranty against manufacturing defects. We also offer free cleaning and inspection services.' },
  { q: 'How long does shipping take?', a: 'Domestic orders typically arrive within 3-5 business days. International orders may take 7-14 business days depending on the destination.' },
];

export default function FAQsPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <>
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'FAQs' }]} />
      <div className="py-16">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-medium text-heading mb-4 font-[family-name:var(--font-serif)]">
              Frequently Asked Questions
            </h1>
            <p className="text-body">Find answers to common questions about our products and services.</p>
          </div>

          <div className="flex flex-col gap-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-xl shadow-card overflow-hidden">
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className={`w-full px-6 py-5 flex justify-between items-center bg-transparent border-none cursor-pointer text-left text-base font-medium transition-colors duration-300 ${openIndex === i ? 'text-primary' : 'text-heading'}`}
                >
                  {faq.q}
                  <span className={`text-primary flex-shrink-0 ml-4 transition-transform duration-300 ${openIndex === i ? 'rotate-180' : ''}`}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </span>
                </button>
                {openIndex === i && (
                  <div className="px-6 pb-5 text-body leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
