import mongoose, { Document, Schema } from 'mongoose';

// ============================================
// MODELO: Receta (Escuela de Cocina)
// ============================================

export interface IRecipe extends Document {
  name: string;
  description?: string;
  price: number;
  difficulty: 'fácil' | 'media' | 'difícil';
  duration: number;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const recipeSchema = new Schema<IRecipe>(
  {
    name: {
      type: String,
      required: [true, 'El nombre es requerido'],
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'El precio es requerido'],
      min: [0, 'El precio no puede ser negativo'],
    },
    difficulty: {
      type: String,
      enum: ['fácil', 'media', 'difícil'],
      required: [true, 'La dificultad es requerida'],
    },
    duration: {
      type: Number,
      required: [true, 'La duración es requerida'],
      min: [1, 'La duración mínima es 1 minuto'],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

export const RecipeModel = mongoose.model<IRecipe>('Recipe', recipeSchema);
