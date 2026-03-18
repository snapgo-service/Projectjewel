import { Category } from '@/types';
import { IMAGES } from './images';

export const categories: Category[] = [
  {
    slug: 'rings',
    name: 'Rings',
    description: 'Discover our stunning collection of diamond rings, engagement rings, and fashion rings.',
    image: IMAGES.categories.rings,
    productCount: 5,
  },
  {
    slug: 'anklets',
    name: 'Anklets',
    description: 'Elegant anklets featuring diamonds and precious stones.',
    image: IMAGES.categories.anklets,
    productCount: 2,
  },
  {
    slug: 'bracelets',
    name: 'Bracelets',
    description: 'Beautiful bracelets and bangles crafted with premium materials.',
    image: IMAGES.categories.bracelets,
    productCount: 4,
  },
  {
    slug: 'earrings',
    name: 'Earrings',
    description: 'From studs to dangles, find the perfect pair of diamond earrings.',
    image: IMAGES.categories.earrings,
    productCount: 3,
  },
  {
    slug: 'brooches',
    name: 'Brooches',
    description: 'Classic and contemporary brooches with exquisite detailing.',
    image: IMAGES.categories.brooches,
    productCount: 1,
  },
  {
    slug: 'necklaces',
    name: 'Necklaces',
    description: 'Stunning necklaces and pendant sets in gold and diamond.',
    image: IMAGES.categories.necklaces,
    productCount: 3,
  },
];
