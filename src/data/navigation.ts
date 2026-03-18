import { NavItem } from '@/types';

export const mainNav: NavItem[] = [
  { label: 'Home', href: '/' },
  {
    label: 'Shop',
    href: '/shop',
    children: [
      { label: 'All Products', href: '/shop' },
      { label: 'Best Sellers', href: '/shop?filter=best-sellers' },
      { label: 'New Arrivals', href: '/shop?filter=new' },
      { label: 'On Sale', href: '/shop?filter=sale' },
    ],
  },
  {
    label: 'Categories',
    href: '#',
    megaMenu: true,
    children: [
      { label: 'Rings', href: '/category/rings' },
      { label: 'Anklets', href: '/category/anklets' },
      { label: 'Bracelets', href: '/category/bracelets' },
      { label: 'Earrings', href: '/category/earrings' },
      { label: 'Brooches', href: '/category/brooches' },
      { label: 'Necklaces', href: '/category/necklaces' },
    ],
  },
  {
    label: 'Pages',
    href: '#',
    children: [
      { label: 'About Us', href: '/about' },
      { label: 'Contact Us', href: '/contact' },
      { label: 'FAQs', href: '/faqs' },
      { label: 'Blog', href: '/blog' },
      { label: 'My Account', href: '/account' },
    ],
  },
];

export const topBarLinks: NavItem[] = [
  { label: 'About Us', href: '/about' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact Us', href: '/contact' },
  { label: 'FAQs', href: '/faqs' },
];
