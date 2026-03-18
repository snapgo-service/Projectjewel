'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { IMAGES } from '@/data/images';
import { mainNav } from '@/data/navigation';
import { useWishlist } from '@/store/WishlistContext';
import { useCart } from '@/store/CartContext';
import MegaMenu from './MegaMenu';
import styles from './Navbar.module.css';

interface NavbarProps {
  onMobileMenuOpen: () => void;
}

const Navbar = ({ onMobileMenuOpen }: NavbarProps) => {
  const [isSticky, setIsSticky] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { items: wishlistItems } = useWishlist();
  const { items: cartItems } = useCart();

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
    <header className={`${styles.navbar} ${isSticky ? styles.sticky : ''}`}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <Image
            src={IMAGES.logo}
            alt="Stellora"
            width={120}
            height={50}
            priority
            style={{ objectFit: 'contain', height: 50, width: 'auto' }}
          />
        </Link>

        <nav className={styles.navLinks}>
          {mainNav.map((item) => (
            <div
              key={item.label}
              className={`${styles.navItem} ${item.label === 'Categories' ? styles.hasMegaMenu : ''}`}
            >
              <Link href={item.href} className={styles.navLink}>
                {item.label}
              </Link>
              {item.label === 'Categories' && (
                <div className={styles.megaMenuWrapper}>
                  <MegaMenu />
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className={styles.actions}>
          <button className={styles.actionBtn} aria-label="Search">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>

          <Link href="/wishlist" className={styles.actionBtn} aria-label="Wishlist">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            {wishlistCount > 0 && (
              <span className={styles.badge}>{wishlistCount}</span>
            )}
          </Link>

          <Link href="/cart" className={styles.actionBtn} aria-label="Cart">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            {cartCount > 0 && (
              <span className={styles.badge}>{cartCount}</span>
            )}
          </Link>

          <Link href="/account" className={styles.actionBtn} aria-label="Account">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </Link>

          <button
            className={styles.hamburger}
            onClick={onMobileMenuOpen}
            aria-label="Open menu"
          >
            <span className={styles.hamburgerLine} />
            <span className={styles.hamburgerLine} />
            <span className={styles.hamburgerLine} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
