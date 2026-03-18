import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Omit<Document, 'isNew'> {
  id: string;
  slug: string;
  name: string;
  category: string;
  images: string[];
  price: number;
  priceRange?: [number, number];
  salePrice?: number;
  salePercent?: number;
  rating: number;
  reviewCount: number;
  variants: { type: 'color' | 'size'; label: string; value: string; priceAdjustment?: number }[];
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

const ProductSchema = new Schema<IProduct>({
  id: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  images: [{ type: String }],
  price: { type: Number, required: true },
  priceRange: { type: [Number] },
  salePrice: Number,
  salePercent: Number,
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  variants: [{
    type: { type: String, enum: ['color', 'size'] },
    label: String,
    value: String,
    priceAdjustment: Number,
  }],
  description: { type: String, default: '' },
  shortDescription: { type: String, default: '' },
  sku: { type: String, default: '' },
  inStock: { type: Boolean, default: true },
  tags: [{ type: String }],
  isBestSeller: Boolean,
  isNew: Boolean,
  isFeatured: Boolean,
  isHot: Boolean,
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
