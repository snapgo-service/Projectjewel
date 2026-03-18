import mongoose, { Schema, Document } from 'mongoose';

export interface ISlider extends Document {
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
}

const SliderSchema = new Schema<ISlider>({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  description: { type: String, default: '' },
  buttonText: { type: String, default: 'Shop Now' },
  buttonLink: { type: String, default: '/shop' },
  backgroundImage: { type: String, default: '' },
  productImage: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.Slider || mongoose.model<ISlider>('Slider', SliderSchema);
