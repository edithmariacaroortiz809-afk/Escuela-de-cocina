import { Schema, model, type InferSchemaType } from 'mongoose';

const categorySchema = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, trim: true },
  },
  { timestamps: true },
);

export type ICategory = InferSchemaType<typeof categorySchema>;

export const Category = model('Category', categorySchema);
