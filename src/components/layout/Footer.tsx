'use client';

import Link from 'next/link';
import Image from 'next/image';
import { IMAGES } from '@/data/images';
import { useAdmin } from '@/store/AdminContext';
import styles from './Footer.module.css';

const Footer = () => {
  const { settings } = useAdmin();

  const quickLinks = [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop' },
    { label: 'About Us', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'FAQs', href: '/faqs' },
  ];

  const categoryLinks = [
    { label: 'Rings', href: '/categories/rings' },
    { label: 'Earrings', href: '/categories/earrings' },
    { label: 'Bracelets', href: '/categories/bracelets' },
    { label: 'Necklaces', href: '/categories/necklaces' },
    { label: 'Pendants', href: '/categories/pendants' },
    { label: 'Brooches', href: '/categories/brooches' },
  ];

  const socialLinks = [
    {
      url: settings.socialFacebook,
      label: 'Facebook',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      ),
    },
    {
      url: settings.socialTwitter,
      label: 'Twitter',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
        </svg>
      ),
    },
    {
      url: settings.socialInstagram,
      label: 'Instagram',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      ),
    },
    {
      url: settings.socialPinterest,
      label: 'Pinterest',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
        </svg>
      ),
    },
  ].filter((link) => link.url);

  return (
    <footer className={styles.footer}>
      <div className={styles.bgOverlay} />
      <Image
        src={IMAGES.footerBg}
        alt=""
        fill
        className={styles.bgImage}
        quality={80}
      />
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.column}>
            <Link href="/" className={styles.footerLogo}>
              <Image
                src={IMAGES.logo}
                alt={settings.siteName}
                width={120}
                height={50}
                style={{ objectFit: 'contain', height: 50, width: 'auto' }}
              />
            </Link>
            <p className={styles.description}>
              {settings.siteDescription}
            </p>
          </div>

          <div className={styles.column}>
            <h4 className={styles.columnTitle}>Quick Links</h4>
            <ul className={styles.linkList}>
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className={styles.footerLink}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.column}>
            <h4 className={styles.columnTitle}>Categories</h4>
            <ul className={styles.linkList}>
              {categoryLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className={styles.footerLink}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.column}>
            <h4 className={styles.columnTitle}>Contact Info</h4>
            <ul className={styles.contactList}>
              {settings.contactAddress && (
                <li className={styles.contactItem}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span>{settings.contactAddress}</span>
                </li>
              )}
              {settings.contactPhone && (
                <li className={styles.contactItem}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <a href={`tel:${settings.contactPhone}`} className={styles.contactLink}>
                    {settings.contactPhone}
                  </a>
                </li>
              )}
              {settings.contactEmail && (
                <li className={styles.contactItem}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  <a href={`mailto:${settings.contactEmail}`} className={styles.contactLink}>
                    {settings.contactEmail}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          {socialLinks.length > 0 && (
            <div className={styles.socialIcons}>
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  className={styles.socialIcon}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          )}
          <p className={styles.copyright}>
            &copy; {new Date().getFullYear()} {settings.siteName}. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
