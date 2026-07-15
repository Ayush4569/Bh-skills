import mongoose, { Schema, Document } from 'mongoose';

export interface IUserProgress extends Document {
  userId: string;
  completedChallenges: mongoose.Types.ObjectId[];
  unlockedChallenges: mongoose.Types.ObjectId[];
  xp: number;
  currentLevel: number;
}

const UserProgressSchema: Schema = new Schema(
  {
    userId: { type: String, required: true, unique: true, index: true },
    completedChallenges: [{ type: Schema.Types.ObjectId, ref: 'Challenge' }],
    unlockedChallenges: [{ type: Schema.Types.ObjectId, ref: 'Challenge' }],
    xp: { type: Number, default: 0 },
    currentLevel: { type: Number, default: 1 },
  },
  { timestamps: true }
);

export default mongoose.models.UserProgress || mongoose.model<IUserProgress>('UserProgress', UserProgressSchema);
