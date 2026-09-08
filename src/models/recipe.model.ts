import { Schema, model, Types, type InferSchemaType } from 'mongoose';

const recipeSchema = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, trim: true },
    price: { type: Number, required: true, min: 0 },
    difficulty: { type: String, enum: ['fácil', 'media', 'difícil'], required: true },
    duration: { type: Number, required: true, min: 1 },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  },
  { timestamps: true },
);

export type IRecipe = InferSchemaType<typeof recipeSchema> & { category: Types.ObjectId };

export const Recipe = model('Recipe', recipeSchema);
