import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IParticipant extends Document {
  familyId: mongoose.Types.ObjectId;
  fullName: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  relation: 'Self' | 'Spouse' | 'Son' | 'Daughter' | 'Father' | 'Mother' | 'Sibling' | 'Other';
  tShirtSize: 'Kids-S' | 'Kids-M' | 'Kids-L' | 'S' | 'M' | 'L' | 'XL' | 'XXL';
  emergencyContact?: string;
  medicalNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ParticipantSchema = new Schema<IParticipant>(
  {
    familyId: { type: Schema.Types.ObjectId, ref: 'Family', required: true },
    fullName: { type: String, required: true, trim: true },
    age: { type: Number, required: true, min: 3, max: 100 },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    relation: {
      type: String,
      enum: ['Self', 'Spouse', 'Son', 'Daughter', 'Father', 'Mother', 'Sibling', 'Other'],
      default: 'Self',
    },
    tShirtSize: {
      type: String,
      enum: ['Kids-S', 'Kids-M', 'Kids-L', 'S', 'M', 'L', 'XL', 'XXL'],
      default: 'M',
    },
    emergencyContact: { type: String, trim: true },
    medicalNotes: { type: String, trim: true },
  },
  { timestamps: true }
);

export const Participant: Model<IParticipant> =
  mongoose.models.Participant || mongoose.model<IParticipant>('Participant', ParticipantSchema);
export default Participant;
