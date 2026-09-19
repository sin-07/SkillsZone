import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IFamily extends Document {
  familyName: string;
  houseNumber: string;
  blockTower: string;
  primaryContactName: string;
  primaryPhone: string;
  primaryEmail: string;
  points: number;
  medals: {
    gold: number;
    silver: number;
    bronze: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const FamilySchema = new Schema<IFamily>(
  {
    familyName: { type: String, required: true, trim: true },
    houseNumber: { type: String, required: true, trim: true },
    blockTower: { type: String, required: true, trim: true },
    primaryContactName: { type: String, required: true, trim: true },
    primaryPhone: { type: String, required: true, trim: true },
    primaryEmail: { type: String, required: true, lowercase: true, trim: true },
    points: { type: Number, default: 0 },
    medals: {
      gold: { type: Number, default: 0 },
      silver: { type: Number, default: 0 },
      bronze: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

export const Family: Model<IFamily> = mongoose.models.Family || mongoose.model<IFamily>('Family', FamilySchema);
export default Family;

// Auto-indexing for blockTower and houseNumber uniqueness
