import mongoose, { Schema, Document } from 'mongoose';

export interface IAttempt extends Document {
  userId: string;
  challengeId: mongoose.Types.ObjectId;
  submittedCode: string;
  passed: boolean;
  attempts: number;
  completedAt: Date;
}

const AttemptSchema: Schema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    challengeId: { type: Schema.Types.ObjectId, ref: 'Challenge', required: true, index: true },
    submittedCode: { type: String, required: true },
    passed: { type: Boolean, required: true },
    attempts: { type: Number, default: 1 },
    completedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Compound index to quickly find an attempt by a user for a specific challenge
AttemptSchema.index({ userId: 1, challengeId: 1 });

export default mongoose.models.Attempt || mongoose.model<IAttempt>('Attempt', AttemptSchema);
