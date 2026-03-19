import mongoose, { Schema, Document } from 'mongoose';

export interface ITestimonial extends Document {
  id: string;
  name: string;
  location: string;
  quote: string;
  rating: number;
  isActive: boolean;
  order: number;
}

const TestimonialSchema = new Schema<ITestimonial>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  location: { type: String, default: '' },
  quote: { type: String, required: true },
  rating: { type: Number, default: 5, min: 1, max: 5 },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.Testimonial || mongoose.model<ITestimonial>('Testimonial', TestimonialSchema);
