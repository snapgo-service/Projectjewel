'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { IMAGES } from '@/data/images';
import { mainNav } from '@/data/navigation';
import { useWishlist } from '@/store/WishlistContext';
import { useCart } from '@/store/CartContext';
import MegaMenu from './MegaMenu';
import SearchModal from './SearchModal';

interface NavbarProps {
  onMobileMenuOpen: () => void;
}

const Navbar = ({ onMobileMenuOpen }: NavbarProps) => {
  const [isSticky, setIsSticky] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { items: wishlistItems } = useWishlist();
  const { items: cartItems } = useCart();
  const closeSearch = useCallback(() => setSearchOpen(false), []);

  const wishlistCount = mounted ? wishlistItems.length : 0;
  const cartCount = mounted ? cartItems.reduce((total, item) => total + item.quantity, 0) : 0;

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsSticky(window.scrollY > 80);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className={`bg-white border-b border-border transition-all duration-300 z-50 ${
          isSticky ? 'fixed top-0 left-0 right-0 shadow-navbar animate-slide-down' : 'relative'
        }`}
      >
        <div className="max-w-[1430px] mx-auto px-4 flex items-center justify-between h-20">
          <Link href="/" className="shrink-0">
            <Image
              src={IMAGES.logo}
              alt="Stellora"
              width={120}
              height={50}
              priority
              style={{ objectFit: 'contain', height: 50, width: 'auto' }}
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {mainNav.map((item) => (
              <div
                key={item.label}
                className={`relative ${item.label === 'Categories' ? 'group' : ''}`}
              >
                <Link
                  href={item.href}
                  className="text-heading text-sm uppercase tracking-[1.5px] font-medium hover:text-primary transition-colors duration-300 py-7"
                >
                  {item.label}
                </Link>
                {item.label === 'Categories' && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                    <MegaMenu />
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <button
              className="text-heading hover:text-primary transition-colors duration-300 p-2"
              aria-label="Search"
              onClick={() => setSearchOpen(true)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>

            <Link href="/wishlist" className="text-heading hover:text-primary transition-colors duration-300 p-2 relative" aria-label="Wishlist">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-primary text-white text-[10px] font-semibold w-[18px] h-[18px] rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link href="/cart" className="text-heading hover:text-primary transition-colors duration-300 p-2 relative" aria-label="Cart">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-primary text-white text-[10px] font-semibold w-[18px] h-[18px] rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            <Link href="/account" className="hidden sm:block text-heading hover:text-primary transition-colors duration-300 p-2" aria-label="Account">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </Link>

            <button
              className="lg:hidden text-heading p-2 flex flex-col gap-[5px]"
              onClick={onMobileMenuOpen}
              aria-label="Open menu"
            >
              <span className="w-5 h-[2px] bg-heading transition-all duration-300" />
              <span className="w-5 h-[2px] bg-heading transition-all duration-300" />
              <span className="w-5 h-[2px] bg-heading transition-all duration-300" />
            </button>
          </div>
        </div>
      </header>
      <SearchModal isOpen={searchOpen} onClose={closeSearch} />
    </>
  );
};

export default Navbar;
