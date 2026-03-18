import mongoose, { Schema, Document } from 'mongoose';

export interface IBlogPost extends Document {
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

const BlogPostSchema = new Schema<IBlogPost>({
  id: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  excerpt: { type: String, default: '' },
  content: { type: String, default: '' },
  image: { type: String, default: '' },
  author: { type: String, default: '' },
  date: { type: String, default: '' },
  category: { type: String, default: '' },
  tags: [{ type: String }],
}, { timestamps: true });

export default mongoose.models.BlogPost || mongoose.model<IBlogPost>('BlogPost', BlogPostSchema);
