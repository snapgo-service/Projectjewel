import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  slug: string;
  name: string;
  description: string;
  image: string;
  productCount: number;
}

const CategorySchema = new Schema<ICategory>({
  slug: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, default: '' },
  image: { type: String, default: '' },
  productCount: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);
