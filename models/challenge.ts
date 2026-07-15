import mongoose, { Schema, Document } from 'mongoose';

export interface IValidationRule {
  id: string;
  description: string;
  checkFn: string;
}

export interface IChallenge extends Document {
  moduleId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  language: 'html' | 'css' | 'javascript' | 'python';
  difficulty: 'easy' | 'medium' | 'hard' | 'miniproject';
  xp: number;
  starterCode: string;
  solution: string;
  validationRules: IValidationRule[];
  hints: string[];
  nextChallengeId: mongoose.Types.ObjectId | null;
  published: boolean;
}

const ChallengeSchema: Schema = new Schema(
  {
    moduleId: { type: Schema.Types.ObjectId, ref: 'Module', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    language: {
      type: String,
      enum: ['html', 'css', 'javascript', 'python'],
      required: true,
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard', 'miniproject'],
      required: true,
    },
    xp: { type: Number, required: true, default: 20 },
    starterCode: { type: String, default: '' },
    solution: { type: String, default: '' },
    validationRules: [
      {
        id: { type: String, required: true },
        description: { type: String, required: true },
        checkFn: { type: String, required: true },
      },
    ],
    hints: [{ type: String }],
    nextChallengeId: { type: Schema.Types.ObjectId, ref: 'Challenge', default: null },
    published: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Challenge || mongoose.model<IChallenge>('Challenge', ChallengeSchema);
