import mongoose, { Schema, Document } from 'mongoose';

export interface IXPLog extends Document {
  userId: string;
  amount: number;
  reason: string;
  createdAt: Date;
}

const XPLogSchema: Schema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    amount: { type: Number, required: true },
    reason: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.XPLog || mongoose.model<IXPLog>('XPLog', XPLogSchema);
