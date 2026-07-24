import mongoose, { Schema, Document } from 'mongoose';

export interface ICustomPath extends Document {
  title: string;
  selectedTopics: string[];
  problemCount: number;
  difficultyProfile: 'Beginner' | 'Balanced' | 'Challenge';
  challengeIds: mongoose.Types.ObjectId[];
  createdAt: Date;
}

const CustomPathSchema: Schema = new Schema({
  title: { type: String, required: true },
  selectedTopics: [{ type: String }],
  problemCount: { type: Number, required: true },
  difficultyProfile: { type: String, enum: ['Beginner', 'Balanced', 'Challenge'], required: true },
  challengeIds: [{ type: Schema.Types.ObjectId, ref: 'Challenge' }],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.CustomPath || mongoose.model<ICustomPath>('CustomPath', CustomPathSchema);
