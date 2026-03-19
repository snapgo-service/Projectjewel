import mongoose, { Schema, Document } from 'mongoose';

export interface IContactMessage extends Document {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  date: string;
}

const ContactMessageSchema = new Schema<IContactMessage>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, default: '' },
  message: { type: String, required: true },
  status: { type: String, enum: ['unread', 'read', 'replied'], default: 'unread' },
  date: { type: String, default: () => new Date().toISOString() },
}, { timestamps: true });

export default mongoose.models.ContactMessage || mongoose.model<IContactMessage>('ContactMessage', ContactMessageSchema);
