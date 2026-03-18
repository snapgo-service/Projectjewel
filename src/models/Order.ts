import mongoose, { Schema, Document } from 'mongoose';

export interface IOrder extends Document {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  items: { productId: string; productName: string; quantity: number; price: number }[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: string;
  paymentId?: string;
  date: string;
}

const OrderSchema = new Schema<IOrder>({
  id: { type: String, required: true, unique: true },
  customerName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, default: '' },
  address: { type: String, default: '' },
  items: [{
    productId: String,
    productName: String,
    quantity: Number,
    price: Number,
  }],
  total: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
  paymentMethod: { type: String, default: 'cod' },
  paymentId: String,
  date: { type: String, default: () => new Date().toISOString().split('T')[0] },
}, { timestamps: true });

export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
