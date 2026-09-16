import { Schema, model, Document } from 'mongoose';

export interface IRecipe extends Document {
  name: string;
  description?: string;
  price: number;
  difficulty: 'fácil' | 'media' | 'difícil';
  duration: number;
  active: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const recipeSchema = new Schema<IRecipe>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, trim: true },
    price: { type: Number, required: true, min: 0 },
    difficulty: { type: String, enum: ['fácil', 'media', 'difícil'], required: true },
    duration: { type: Number, required: true, min: 1 },
    active: { type: Boolean, default: true },
    createdBy: { type: String, required: true },
  },
  { timestamps: true }
);

export const Recipe = model<IRecipe>('Recipe', recipeSchema);
