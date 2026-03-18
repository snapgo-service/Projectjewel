import mongoose, { Schema, Document } from 'mongoose';

export interface IImage extends Document {
  data: Buffer;
  contentType: string;
  filename: string;
  size: number;
}

const ImageSchema = new Schema<IImage>({
  data: { type: Buffer, required: true },
  contentType: { type: String, required: true },
  filename: { type: String, required: true },
  size: { type: Number, required: true },
}, { timestamps: true });

export default mongoose.models.Image || mongoose.model<IImage>('Image', ImageSchema);
