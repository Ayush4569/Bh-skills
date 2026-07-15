import mongoose, { Schema, Document } from 'mongoose';

export interface IAchievement extends Document {
  title: string;
  description: string;
  xpRequired: number;
  icon: string;
}

const AchievementSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    xpRequired: { type: Number, required: true, default: 0 },
    icon: { type: String, default: 'Award' },
  },
  { timestamps: true }
);

export default mongoose.models.Achievement || mongoose.model<IAchievement>('Achievement', AchievementSchema);
