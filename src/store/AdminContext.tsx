'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Product, Category, BlogPost } from '@/types';
import { products as defaultProducts } from '@/data/products';
import { categories as defaultCategories } from '@/data/categories';
import { blogPosts as defaultBlogPosts } from '@/data/blogPosts';
import { IMAGES } from '@/data/images';

export interface Slider {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  backgroundImage: string;
  productImage: string;
  isActive: boolean;
  order: number;
  titleColor?: string;
  subtitleColor?: string;
  descriptionColor?: string;
  buttonBgColor?: string;
  buttonTextColor?: string;
}

export interface Poster {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  link: string;
  position: 'hero' | 'mid-page' | 'sidebar' | 'footer';
  isActive: boolean;
  order: number;
}

export interface Order {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  items: { productId: string; productName: string; quantity: number; price: number }[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod?: string;
  paymentId?: string;
  date: string;
}

export interface Coupon {
  id: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount: number;
  maxUses: number;
  currentUses: number;
  expiryDate: string;
  isActive: boolean;
  applicableProducts: string[];
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  date: string;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  quote: string;
  rating: number;
  isActive: boolean;
  order: number;
}

export interface SiteSettings {
  siteName: string;
  siteDescription: string;
  freeShippingThreshold: number;
  shippingCost: number;
  currency: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  socialFacebook: string;
  socialTwitter: string;
  socialInstagram: string;
  socialPinterest: string;
  announcementText: string;
  announcementActive: boolean;
}

interface AdminContextType {
  // Sliders
  sliders: Slider[];
  addSlider: (slider: Omit<Slider, 'id'>) => void;
  updateSlider: (id: string, slider: Partial<Slider>) => void;
  deleteSlider: (id: string) => void;
  // Posters
  posters: Poster[];
  addPoster: (poster: Omit<Poster, 'id'>) => void;
  updatePoster: (id: string, poster: Partial<Poster>) => void;
  deletePoster: (id: string) => void;
  // Products
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  // Categories
  categories: Category[];
  addCategory: (category: Category) => void;
  updateCategory: (slug: string, category: Partial<Category>) => void;
  deleteCategory: (slug: string) => void;
  // Blog Posts
  blogPosts: BlogPost[];
  addBlogPost: (post: Omit<BlogPost, 'id'>) => void;
  updateBlogPost: (id: string, post: Partial<BlogPost>) => void;
  deleteBlogPost: (id: string) => void;
  // Coupons
  coupons: Coupon[];
  addCoupon: (coupon: Omit<Coupon, 'id' | 'createdAt' | 'currentUses'>) => void;
  updateCoupon: (id: string, coupon: Partial<Coupon>) => void;
  deleteCoupon: (id: string) => void;
  // Testimonials
  testimonials: Testimonial[];
  addTestimonial: (testimonial: Omit<Testimonial, 'id'>) => void;
  updateTestimonial: (id: string, testimonial: Partial<Testimonial>) => void;
  deleteTestimonial: (id: string) => void;
  // Contact Messages
  contactMessages: ContactMessage[];
  updateContactMessageStatus: (id: string, status: ContactMessage['status']) => void;
  deleteContactMessage: (id: string) => void;
  // Orders
  orders: Order[];
  updateOrderStatus: (id: string, status: Order['status']) => void;
  // Settings
  settings: SiteSettings;
  updateSettings: (settings: Partial<SiteSettings>) => void;
  // Stats
  stats: { totalProducts: number; totalOrders: number; totalRevenue: number; totalCategories: number };
  // Loading state
  isLoading: boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const defaultSliders: Slider[] = [
  {
    id: 'slider-1',
    title: 'Special sale! Up to 30% OFF',
    subtitle: 'Special Collection',
    description: 'Discover our exclusive collection of handcrafted diamond jewelry. Each piece tells a unique story of elegance and sophistication.',
    buttonText: 'Shop Now',
    buttonLink: '/shop',
    backgroundImage: IMAGES.heroBg,
    productImage: IMAGES.heroProduct,
    isActive: true,
    order: 1,
  },
  {
    id: 'slider-2',
    title: 'New Arrivals Collection',
    subtitle: 'Just Landed',
    description: 'Explore our newest pieces featuring the latest trends in fine jewelry design.',
    buttonText: 'Explore Now',
    buttonLink: '/shop?filter=new',
    backgroundImage: IMAGES.heroBg,
    productImage: IMAGES.products['taneka-ring'][0],
    isActive: true,
    order: 2,
  },
];

const defaultPosters: Poster[] = [
  {
    id: 'poster-1',
    title: 'Diamond Rings Collection',
    subtitle: 'Starting from $190',
    image: IMAGES.products['sinead-ring'][0],
    link: '/category/rings',
    position: 'mid-page',
    isActive: true,
    order: 1,
  },
  {
    id: 'poster-2',
    title: 'Earrings Sale',
    subtitle: 'Up to 20% Off',
    image: IMAGES.products['eulla-earring'][0],
    link: '/category/earrings',
    position: 'mid-page',
    isActive: true,
    order: 2,
  },
];

const defaultSettings: SiteSettings = {
  siteName: 'Stellora Silver',
  siteDescription: 'Premium Artificial Jewellery Store',
  freeShippingThreshold: 199,
  shippingCost: 15,
  currency: '$',
  contactEmail: 'info@jubilee.com',
  contactPhone: '+1 (555) 123-4567',
  contactAddress: '123 Jewelry Lane, Diamond District, NY 10036',
  socialFacebook: 'https://facebook.com/jubilee',
  socialTwitter: 'https://twitter.com/jubilee',
  socialInstagram: 'https://instagram.com/jubilee',
  socialPinterest: 'https://pinterest.com/jubilee',
  announcementText: 'Free shipping world wide for all orders over $199',
  announcementActive: true,
};

const defaultCoupons: Coupon[] = [
  {
    id: 'coupon-1',
    code: 'WELCOME10',
    description: '10% off on your first order',
    discountType: 'percentage',
    discountValue: 10,
    minOrderAmount: 50,
    maxUses: 100,
    currentUses: 0,
    expiryDate: '2027-12-31',
    isActive: true,
    applicableProducts: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'coupon-2',
    code: 'FLAT500',
    description: '$500 flat discount on premium orders',
    discountType: 'fixed',
    discountValue: 500,
    minOrderAmount: 2000,
    maxUses: 50,
    currentUses: 0,
    expiryDate: '2027-06-30',
    isActive: true,
    applicableProducts: [],
    createdAt: new Date().toISOString(),
  },
];

async function apiFetch<T>(url: string, options?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(url, options);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export function AdminProvider({ children }: { children: ReactNode }) {
  const [sliders, setSliders] = useState<Slider[]>(defaultSliders);
  const [posters, setPosters] = useState<Poster[]>(defaultPosters);
  const [products, setProducts] = useState<Product[]>(defaultProducts);
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(defaultBlogPosts);
  const [coupons, setCoupons] = useState<Coupon[]>(defaultCoupons);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from API on mount
  useEffect(() => {
    async function loadData() {
      const [
        slidersData,
        postersData,
        productsData,
        categoriesData,
        blogData,
        contactData,
        ordersData,
        settingsData,
        testimonialsData,
      ] = await Promise.all([
        apiFetch<Slider[]>('/api/sliders'),
        apiFetch<Poster[]>('/api/posters'),
        apiFetch<Product[]>('/api/products'),
        apiFetch<Category[]>('/api/categories'),
        apiFetch<BlogPost[]>('/api/blog'),
        apiFetch<ContactMessage[]>('/api/contact'),
        apiFetch<Order[]>('/api/orders'),
        apiFetch<SiteSettings>('/api/settings'),
        apiFetch<Testimonial[]>('/api/testimonials'),
      ]);

      if (slidersData?.length) setSliders(slidersData);
      if (postersData?.length) setPosters(postersData);
      if (productsData?.length) setProducts(productsData);
      if (categoriesData?.length) setCategories(categoriesData);
      if (blogData?.length) setBlogPosts(blogData);
      if (contactData) setContactMessages(Array.isArray(contactData) ? contactData : []);
      if (ordersData) setOrders(Array.isArray(ordersData) ? ordersData : []);
      if (testimonialsData) setTestimonials(Array.isArray(testimonialsData) ? testimonialsData : []);
      if (settingsData?.siteName) setSettings(settingsData);

      setIsLoading(false);
    }
    loadData();
  }, []);

  // Sliders
  const addSlider = useCallback(async (slider: Omit<Slider, 'id'>) => {
    const created = await apiFetch<Slider>('/api/sliders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(slider),
    });
    if (created) setSliders(prev => [...prev, created]);
  }, []);

  const updateSlider = useCallback(async (id: string, data: Partial<Slider>) => {
    setSliders(prev => prev.map(s => s.id === id ? { ...s, ...data } : s));
    await apiFetch(`/api/sliders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  }, []);

  const deleteSlider = useCallback(async (id: string) => {
    setSliders(prev => prev.filter(s => s.id !== id));
    await apiFetch(`/api/sliders/${id}`, { method: 'DELETE' });
  }, []);

  // Posters
  const addPoster = useCallback(async (poster: Omit<Poster, 'id'>) => {
    const created = await apiFetch<Poster>('/api/posters', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(poster),
    });
    if (created) setPosters(prev => [...prev, created]);
  }, []);

  const updatePoster = useCallback(async (id: string, data: Partial<Poster>) => {
    setPosters(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
    await apiFetch(`/api/posters/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  }, []);

  const deletePoster = useCallback(async (id: string) => {
    setPosters(prev => prev.filter(p => p.id !== id));
    await apiFetch(`/api/posters/${id}`, { method: 'DELETE' });
  }, []);

  // Products
  const addProduct = useCallback(async (product: Omit<Product, 'id'>) => {
    const created = await apiFetch<Product>('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    if (created) setProducts(prev => [...prev, created]);
  }, []);

  const updateProduct = useCallback(async (id: string, data: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
    await apiFetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  }, []);

  const deleteProduct = useCallback(async (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    await apiFetch(`/api/products/${id}`, { method: 'DELETE' });
  }, []);

  // Categories
  const addCategory = useCallback(async (category: Category) => {
    const created = await apiFetch<Category>('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(category),
    });
    if (created) setCategories(prev => [...prev, created]);
  }, []);

  const updateCategory = useCallback(async (slug: string, data: Partial<Category>) => {
    setCategories(prev => prev.map(c => c.slug === slug ? { ...c, ...data } : c));
    await apiFetch(`/api/categories/${slug}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  }, []);

  const deleteCategory = useCallback(async (slug: string) => {
    setCategories(prev => prev.filter(c => c.slug !== slug));
    await apiFetch(`/api/categories/${slug}`, { method: 'DELETE' });
  }, []);

  // Blog Posts
  const addBlogPost = useCallback(async (post: Omit<BlogPost, 'id'>) => {
    const created = await apiFetch<BlogPost>('/api/blog', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(post),
    });
    if (created) setBlogPosts(prev => [...prev, created]);
  }, []);

  const updateBlogPost = useCallback(async (id: string, data: Partial<BlogPost>) => {
    setBlogPosts(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
    await apiFetch(`/api/blog/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  }, []);

  const deleteBlogPost = useCallback(async (id: string) => {
    setBlogPosts(prev => prev.filter(p => p.id !== id));
    await apiFetch(`/api/blog/${id}`, { method: 'DELETE' });
  }, []);

  // Testimonials
  const addTestimonial = useCallback(async (testimonial: Omit<Testimonial, 'id'>) => {
    const created = await apiFetch<Testimonial>('/api/testimonials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testimonial),
    });
    if (created) setTestimonials(prev => [...prev, created]);
  }, []);

  const updateTestimonial = useCallback(async (id: string, data: Partial<Testimonial>) => {
    setTestimonials(prev => prev.map(t => t.id === id ? { ...t, ...data } : t));
    await apiFetch(`/api/testimonials/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  }, []);

  const deleteTestimonial = useCallback(async (id: string) => {
    setTestimonials(prev => prev.filter(t => t.id !== id));
    await apiFetch(`/api/testimonials/${id}`, { method: 'DELETE' });
  }, []);

  // Coupons
  const addCoupon = useCallback(async (coupon: Omit<Coupon, 'id' | 'createdAt' | 'currentUses'>) => {
    const newCoupon: Coupon = {
      ...coupon,
      id: `coupon-${Date.now()}`,
      currentUses: 0,
      createdAt: new Date().toISOString(),
    };
    setCoupons(prev => [...prev, newCoupon]);
  }, []);

  const updateCoupon = useCallback(async (id: string, data: Partial<Coupon>) => {
    setCoupons(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));
  }, []);

  const deleteCoupon = useCallback(async (id: string) => {
    setCoupons(prev => prev.filter(c => c.id !== id));
  }, []);

  // Contact Messages
  const updateContactMessageStatus = useCallback(async (id: string, status: ContactMessage['status']) => {
    setContactMessages(prev => prev.map(m => m.id === id ? { ...m, status } : m));
    await apiFetch(`/api/contact/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
  }, []);

  const deleteContactMessage = useCallback(async (id: string) => {
    setContactMessages(prev => prev.filter(m => m.id !== id));
    await apiFetch(`/api/contact/${id}`, { method: 'DELETE' });
  }, []);

  // Orders
  const updateOrderStatus = useCallback(async (id: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    await apiFetch(`/api/orders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
  }, []);

  // Settings
  const updateSettings = useCallback(async (data: Partial<SiteSettings>) => {
    setSettings(prev => ({ ...prev, ...data }));
    await apiFetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  }, []);

  const stats = {
    totalProducts: products.length,
    totalOrders: orders.length,
    totalRevenue: orders.reduce((sum, o) => sum + o.total, 0),
    totalCategories: categories.length,
  };

  return (
    <AdminContext.Provider value={{
      sliders, addSlider, updateSlider, deleteSlider,
      posters, addPoster, updatePoster, deletePoster,
      products, addProduct, updateProduct, deleteProduct,
      categories, addCategory, updateCategory, deleteCategory,
      blogPosts, addBlogPost, updateBlogPost, deleteBlogPost,
      testimonials, addTestimonial, updateTestimonial, deleteTestimonial,
      coupons, addCoupon, updateCoupon, deleteCoupon,
      contactMessages, updateContactMessageStatus, deleteContactMessage,
      orders, updateOrderStatus,
      settings, updateSettings,
      stats,
      isLoading,
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) throw new Error('useAdmin must be used within AdminProvider');
  return context;
}
