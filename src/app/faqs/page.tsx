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
      <div style={{ padding: '60px 0' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 15px' }}>
          <div style={{ textAlign: 'center', marginBottom: 50 }}>
            <h1 style={{ fontSize: 36, fontWeight: 500, color: '#222', marginBottom: 15 }}>
              Frequently Asked Questions
            </h1>
            <p style={{ color: '#666' }}>Find answers to common questions about our products and services.</p>
          </div>

          <div>
            {faqs.map((faq, i) => (
              <div key={i} style={{ borderBottom: '1px solid #e5e5e5' }}>
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  style={{
                    width: '100%',
                    padding: '20px 0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontSize: 16,
                    fontWeight: 500,
                    color: openIndex === i ? '#ce967e' : '#222',
                    transition: 'color 0.3s',
                    fontFamily: 'var(--font-primary)',
                  }}
                >
                  {faq.q}
                  <span style={{ fontSize: 22, color: '#ce967e', flexShrink: 0, marginLeft: 15 }}>
                    {openIndex === i ? '−' : '+'}
                  </span>
                </button>
                {openIndex === i && (
                  <div style={{ padding: '0 0 20px', color: '#666', lineHeight: 1.8 }}>
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
