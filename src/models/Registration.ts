import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IRegistrationEntry {
  participantId: mongoose.Types.ObjectId;
  participantName: string;
  eventId: mongoose.Types.ObjectId;
  eventTitle: string;
  sportType: string;
  sportSpecificInfo: {
    role?: string;
    skillLevel?: string;
    partnerName?: string;
    bicycleOption?: string;
    notes?: string;
  };
}

export interface IRegistration extends Document {
  registrationId: string;
  userId?: mongoose.Types.ObjectId;
  familyId: mongoose.Types.ObjectId;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  entries: IRegistrationEntry[];
  status: 'confirmed' | 'waitlisted' | 'cancelled';
  qrCodeDataUrl: string;
  checkIn: {
    isCheckedIn: boolean;
    checkedInAt?: Date;
    checkedInBy?: string;
  };
  totalEntries: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const RegistrationEntrySchema = new Schema<IRegistrationEntry>(
  {
    participantId: { type: Schema.Types.ObjectId, ref: 'Participant', required: true },
    participantName: { type: String, required: true },
    eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
    eventTitle: { type: String, required: true },
    sportType: { type: String, required: true },
    sportSpecificInfo: {
      role: { type: String },
      skillLevel: { type: String },
      partnerName: { type: String },
      bicycleOption: { type: String },
      notes: { type: String },
    },
  },
  { _id: false }
);

const RegistrationSchema = new Schema<IRegistration>(
  {
    registrationId: { type: String, required: true, unique: true, uppercase: true, trim: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    familyId: { type: Schema.Types.ObjectId, ref: 'Family', required: true },
    contactName: { type: String, required: true, trim: true },
    contactEmail: { type: String, required: true, lowercase: true, trim: true },
    contactPhone: { type: String, required: true, trim: true },
    entries: [RegistrationEntrySchema],
    status: {
      type: String,
      enum: ['confirmed', 'waitlisted', 'cancelled'],
      default: 'confirmed',
    },
    qrCodeDataUrl: { type: String, default: '' },
    checkIn: {
      isCheckedIn: { type: Boolean, default: false },
      checkedInAt: { type: Date },
      checkedInBy: { type: String },
    },
    totalEntries: { type: Number, default: 0 },
    notes: { type: String },
  },
  { timestamps: true }
);

RegistrationSchema.index({ familyId: 1, registrationId: 1 });
RegistrationSchema.index({ status: 1, createdAt: -1 });

export const Registration: Model<IRegistration> =
  mongoose.models.Registration || mongoose.model<IRegistration>('Registration', RegistrationSchema);
export default Registration;
