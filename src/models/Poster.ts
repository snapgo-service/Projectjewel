import mongoose, { Schema, Document } from 'mongoose';

export interface IPoster extends Document {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  link: string;
  position: 'hero' | 'mid-page' | 'sidebar' | 'footer';
  isActive: boolean;
  order: number;
}

const PosterSchema = new Schema<IPoster>({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  image: { type: String, default: '' },
  link: { type: String, default: '' },
  position: { type: String, enum: ['hero', 'mid-page', 'sidebar', 'footer'], default: 'mid-page' },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.Poster || mongoose.model<IPoster>('Poster', PosterSchema);
