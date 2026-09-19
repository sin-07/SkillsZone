import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAnnouncement extends Document {
  title: string;
  content: string;
  priority: 'normal' | 'high' | 'urgent';
  category: 'schedule' | 'rules' | 'weather' | 'general';
  isPinned: boolean;
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AnnouncementSchema = new Schema<IAnnouncement>(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    priority: {
      type: String,
      enum: ['normal', 'high', 'urgent'],
      default: 'normal',
    },
    category: {
      type: String,
      enum: ['schedule', 'rules', 'weather', 'general'],
      default: 'general',
    },
    isPinned: { type: Boolean, default: false },
    publishedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Announcement: Model<IAnnouncement> =
  mongoose.models.Announcement || mongoose.model<IAnnouncement>('Announcement', AnnouncementSchema);
export default Announcement;
