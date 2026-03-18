import mongoose, { Schema, Document } from 'mongoose';

export interface ISiteSettings extends Document {
  siteName: string;
  siteDescription: string;
  freeShippingThreshold: number;
  shippingCost: number;
  currency: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  socialFacebook: string;
  socialTwitter: string;
  socialInstagram: string;
  socialPinterest: string;
  announcementText: string;
  announcementActive: boolean;
}

const SiteSettingsSchema = new Schema<ISiteSettings>({
  siteName: { type: String, default: 'Jubilee' },
  siteDescription: { type: String, default: 'Premium Diamond Jewelry Store' },
  freeShippingThreshold: { type: Number, default: 199 },
  shippingCost: { type: Number, default: 15 },
  currency: { type: String, default: '$' },
  contactEmail: { type: String, default: 'info@jubilee.com' },
  contactPhone: { type: String, default: '+1 (555) 123-4567' },
  contactAddress: { type: String, default: '123 Jewelry Lane, Diamond District, NY 10036' },
  socialFacebook: { type: String, default: '' },
  socialTwitter: { type: String, default: '' },
  socialInstagram: { type: String, default: '' },
  socialPinterest: { type: String, default: '' },
  announcementText: { type: String, default: 'Free shipping world wide for all orders over $199' },
  announcementActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.models.SiteSettings || mongoose.model<ISiteSettings>('SiteSettings', SiteSettingsSchema);
