'use client';

import { useState } from 'react';
import Link from 'next/link';
import { mainNav } from '@/data/navigation';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SubItem {
  label: string;
  href: string;
}

interface NavItem {
  label: string;
  href: string;
  subItems?: SubItem[];
}

const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpand = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label]
    );
  };

  const handleLinkClick = () => {
    onClose();
    setExpandedItems([]);
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-heading/40 backdrop-blur-sm z-[100] transition-opacity duration-300 ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={onClose}
      />
      <div
        className={`fixed top-0 left-0 w-[320px] max-w-[85vw] h-full bg-white z-[101] shadow-card-hover transition-transform duration-300 flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <h3 className="text-lg font-medium text-heading tracking-wide">Menu</h3>
          <button
            className="text-body hover:text-heading transition-colors duration-300 p-1"
            onClick={onClose}
            aria-label="Close menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          {(mainNav as NavItem[]).map((item) => (
            <div key={item.label} className="border-b border-border/50">
              <div className="flex items-center justify-between">
                <Link
                  href={item.href}
                  className="flex-1 px-6 py-4 text-heading text-[15px] font-medium hover:text-primary transition-colors duration-300"
                  onClick={handleLinkClick}
                >
                  {item.label}
                </Link>
                {item.subItems && item.subItems.length > 0 && (
                  <button
                    className={`px-4 py-4 text-body hover:text-primary transition-all duration-300 ${
                      expandedItems.includes(item.label) ? 'rotate-180' : ''
                    }`}
                    onClick={() => toggleExpand(item.label)}
                    aria-label={`Expand ${item.label}`}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                )}
              </div>

              {item.subItems && item.subItems.length > 0 && (
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    expandedItems.includes(item.label) ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  {item.subItems.map((subItem) => (
                    <Link
                      key={subItem.label}
                      href={subItem.href}
                      className="block px-10 py-3 text-sm text-body hover:text-primary hover:bg-bg-blush transition-all duration-300"
                      onClick={handleLinkClick}
                    >
                      {subItem.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="px-6 py-6 border-t border-border">
          <div className="flex items-center justify-center gap-5">
            <a href="#" aria-label="Facebook" className="text-body hover:text-primary transition-colors duration-300">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
            <a href="#" aria-label="Twitter" className="text-body hover:text-primary transition-colors duration-300">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
              </svg>
            </a>
            <a href="#" aria-label="Instagram" className="text-body hover:text-primary transition-colors duration-300">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileMenu;
