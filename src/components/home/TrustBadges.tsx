'use client';

const badges = [
  {
    title: 'Free Shipping',
    subtitle: 'On orders over $99',
    icon: (
      <svg width="36" height="36" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M26 10H2V28H26V10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M26 16H32L38 22V28H26V16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="9" cy="31" r="3" stroke="currentColor" strokeWidth="2" />
        <circle cx="31" cy="31" r="3" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
  },
  {
    title: 'Certified Diamonds',
    subtitle: 'Ethically sourced gems',
    icon: (
      <svg width="36" height="36" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 4L6 16L20 36L34 16L20 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6 16H34" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14 4L10 16L20 36L30 16L26 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: '30-Day Returns',
    subtitle: 'Hassle-free returns',
    icon: (
      <svg width="36" height="36" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 14C8.18 9.68 12.72 7 18 7C25.18 7 31 12.82 31 20C31 27.18 25.18 33 18 33C12.26 33 7.42 29.6 5.56 24.74" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M2 10L6 14L10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Secure Payment',
    subtitle: '100% protected checkout',
    icon: (
      <svg width="36" height="36" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="7" y="18" width="26" height="18" rx="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 18V12C12 7.58 15.58 4 20 4C24.42 4 28 7.58 28 12V18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="20" cy="28" r="2" fill="currentColor" />
      </svg>
    ),
  },
];

export default function TrustBadges() {
  return (
    <section className="bg-white py-12 md:py-16 border-b border-border">
      <div className="max-w-[1430px] mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
        {badges.map((badge) => (
          <div key={badge.title} className="flex items-center gap-4 justify-center text-primary">
            <div className="shrink-0">{badge.icon}</div>
            <div>
              <h4 className="text-sm font-semibold text-heading uppercase tracking-wider">{badge.title}</h4>
              <p className="text-xs text-body mt-0.5">{badge.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
