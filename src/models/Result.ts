import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IResultWinner {
  rank: 1 | 2 | 3;
  medal: 'Gold' | 'Silver' | 'Bronze';
  participantId?: mongoose.Types.ObjectId;
  participantName: string;
  familyId?: mongoose.Types.ObjectId;
  familyName: string;
  houseNumber: string;
  blockTower: string;
  scoreOrTime: string;
  pointsAwarded: number;
  notes?: string;
}

export interface IResult extends Document {
  eventId: mongoose.Types.ObjectId;
  eventTitle: string;
  category: string;
  sportType: string;
  winners: IResultWinner[];
  publishedAt: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ResultWinnerSchema = new Schema<IResultWinner>(
  {
    rank: { type: Number, enum: [1, 2, 3], required: true },
    medal: { type: String, enum: ['Gold', 'Silver', 'Bronze'], required: true },
    participantId: { type: Schema.Types.ObjectId, ref: 'Participant' },
    participantName: { type: String, required: true },
    familyId: { type: Schema.Types.ObjectId, ref: 'Family' },
    familyName: { type: String, required: true },
    houseNumber: { type: String, required: true },
    blockTower: { type: String, required: true },
    scoreOrTime: { type: String, required: true },
    pointsAwarded: { type: Number, required: true, default: 0 },
    notes: { type: String },
  },
  { _id: false }
);

const ResultSchema = new Schema<IResult>(
  {
    eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
    eventTitle: { type: String, required: true },
    category: { type: String, required: true },
    sportType: { type: String, required: true },
    winners: [ResultWinnerSchema],
    publishedAt: { type: Date, default: Date.now },
    notes: { type: String },
  },
  { timestamps: true }
);

export const Result: Model<IResult> =
  mongoose.models.Result || mongoose.model<IResult>('Result', ResultSchema);
export default Result;

// Indexed winners familyId for fast leaderboard aggregation
