'use client';

import Link from 'next/link';
import { topBarLinks } from '@/data/navigation';
import { useAdmin } from '@/store/AdminContext';

const TopBar = () => {
  const { settings } = useAdmin();

  return (
    <div className="bg-heading text-white/80 text-xs tracking-wider">
      <div className="max-w-[1430px] mx-auto px-4 flex items-center justify-between h-10">
        <ul className="hidden md:flex items-center gap-5">
          {topBarLinks.map((link) => (
            <li key={link.label}>
              <Link href={link.href} className="hover:text-primary transition-colors duration-300">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        {settings.announcementActive && settings.announcementText && (
          <p className="text-center flex-1 md:flex-none font-light tracking-widest">
            {settings.announcementText}
          </p>
        )}
        <div className="hidden md:block">
          <Link href="/shop" className="hover:text-primary transition-colors duration-300 uppercase font-medium">
            Shop Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
