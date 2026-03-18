export type CategorySlug = 'rings' | 'anklets' | 'bracelets' | 'earrings' | 'brooches' | 'necklaces' | 'pendants';

export interface ProductVariant {
  type: 'color' | 'size';
  label: string;
  value: string;
  priceAdjustment?: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: CategorySlug;
  images: string[];
  price: number;
  priceRange?: [number, number];
  salePrice?: number;
  salePercent?: number;
  rating: number;
  reviewCount: number;
  variants: ProductVariant[];
  description: string;
  shortDescription: string;
  sku: string;
  inStock: boolean;
  tags: string[];
  isBestSeller?: boolean;
  isNew?: boolean;
  isFeatured?: boolean;
  isHot?: boolean;
}

export interface Category {
  slug: CategorySlug;
  name: string;
  description: string;
  image: string;
  productCount: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariants: Record<string, string>;
}

export interface WishlistItem {
  productId: string;
  addedAt: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  date: string;
  category: string;
  tags: string[];
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
  megaMenu?: boolean;
}

export type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' };

export type WishlistAction =
  | { type: 'TOGGLE_ITEM'; payload: string }
  | { type: 'CLEAR_WISHLIST' };

export type CompareAction =
  | { type: 'TOGGLE_ITEM'; payload: string }
  | { type: 'CLEAR_COMPARE' };
