import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  slug: string;
  sportType:
    | 'Cricket'
    | 'Hockey'
    | 'Football'
    | 'Table Tennis'
    | 'Race'
    | 'Slow Cycling'
    | 'Badminton'
    | 'Basketball'
    | 'Custom';
  category: 'Individual' | 'Team' | 'Family';
  description: string;
  rules: string[];
  minAge: number;
  maxAge: number;
  teamSize: number;
  maxParticipants: number;
  registeredCount: number;
  venue: string;
  scheduleDate: string;
  scheduleTime: string;
  status: 'open' | 'closing-soon' | 'closed' | 'completed';
  bannerImage: string;
  iconName: string;
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    sportType: {
      type: String,
      enum: [
        'Cricket',
        'Hockey',
        'Football',
        'Table Tennis',
        'Race',
        'Slow Cycling',
        'Badminton',
        'Basketball',
        'Custom',
      ],
      required: true,
    },
    category: {
      type: String,
      enum: ['Individual', 'Team', 'Family'],
      default: 'Individual',
    },
    description: { type: String, required: true },
    rules: [{ type: String }],
    minAge: { type: Number, default: 5 },
    maxAge: { type: Number, default: 80 },
    teamSize: { type: Number, default: 1 },
    maxParticipants: { type: Number, required: true, default: 32 },
    registeredCount: { type: Number, default: 0 },
    venue: { type: String, required: true, trim: true },
    scheduleDate: { type: String, required: true },
    scheduleTime: { type: String, required: true },
    status: {
      type: String,
      enum: ['open', 'closing-soon', 'closed', 'completed'],
      default: 'open',
    },
    bannerImage: { type: String, default: '' },
    iconName: { type: String, default: 'Trophy' },
  },
  { timestamps: true }
);

export const Event: Model<IEvent> =
  mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);
export default Event;

// Indexed sportType and slug fields for high-speed tournament queries
