import mongoose, { Schema, Document } from 'mongoose';

export interface IModule extends Document {
  title: string;
  description: string;
  courseId: mongoose.Types.ObjectId;
  order: number;
}

const ModuleSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Module || mongoose.model<IModule>('Module', ModuleSchema);
