import { Recipe, IRecipe } from '../models/recipe.model.js';
import type { CreateRecipeDto, UpdateRecipeDto } from '../schemas/recipe.schema.js';

// ============================================
// TODO: Adapta las funciones a tu dominio
// ============================================
// Renombra Item → tu modelo (Book, Medicine, etc.)

export async function findAll(): Promise<IRecipe[]> {
  return Recipe.find({ active: true }).sort({ createdAt: -1 });
}

export async function findById(id: string): Promise<IRecipe | null> {
  return Recipe.findById(id);
}

export async function create(data: CreateRecipeDto, userId: string): Promise<IRecipe> {
  return Recipe.create({ ...data, createdBy: userId });
}

export async function update(
  id: string,
  data: UpdateRecipeDto,
  requesterId: string,
  requesterRole: string
): Promise<IRecipe | null> {
  const recipe = await Recipe.findById(id);
  if (!recipe) return null;
  if (requesterRole !== 'admin' && recipe.createdBy !== requesterId) {
    throw new Error('FORBIDDEN');
  }
  return Recipe.findByIdAndUpdate(id, data, { new: true, runValidators: true });
}

export async function remove(id: string): Promise<IRecipe | null> {
  return Recipe.findByIdAndDelete(id);
}
