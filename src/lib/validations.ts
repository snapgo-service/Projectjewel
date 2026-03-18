import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const contactFormSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email'),
  subject: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export const checkoutFormSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  company: z.string().optional(),
  country: z.string().min(1, 'Country is required'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zip: z.string().min(1, 'ZIP code is required'),
  phone: z.string().min(1, 'Phone is required'),
  email: z.string().email('Invalid email'),
  notes: z.string().optional(),
});

export const productSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  category: z.string().min(1),
  images: z.array(z.string()),
  price: z.number().positive(),
  salePrice: z.number().optional(),
  salePercent: z.number().optional(),
  rating: z.number().min(0).max(5).default(0),
  reviewCount: z.number().default(0),
  variants: z.array(z.object({
    type: z.enum(['color', 'size']),
    label: z.string(),
    value: z.string(),
    priceAdjustment: z.number().optional(),
  })).default([]),
  description: z.string().default(''),
  shortDescription: z.string().default(''),
  sku: z.string().default(''),
  inStock: z.boolean().default(true),
  tags: z.array(z.string()).default([]),
  isBestSeller: z.boolean().optional(),
  isNew: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  isHot: z.boolean().optional(),
});
