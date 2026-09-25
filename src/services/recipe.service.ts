import { Recipe, IRecipe } from '../models/recipe.model.js';
import { AppError } from '../errors/AppError.js';
import type { CreateRecipeDto, UpdateRecipeDto } from '../schemas/recipe.schema.js';

export interface RecipeFilters {
  difficulty?: 'fácil' | 'media' | 'difícil';
}

export async function findAll(filters: RecipeFilters = {}): Promise<IRecipe[]> {
  const query: Record<string, unknown> = { active: true };
  if (filters.difficulty) query.difficulty = filters.difficulty;
  return Recipe.find(query).sort({ createdAt: -1 });
}

export async function findById(id: string): Promise<IRecipe> {
  const recipe = await Recipe.findById(id);
  if (!recipe) throw new AppError(404, 'Recipe not found');
  return recipe;
}

export async function create(data: CreateRecipeDto, userId: string): Promise<IRecipe> {
  const existing = await Recipe.findOne({ name: data.name });
  if (existing) throw new AppError(409, 'A recipe with this name already exists');
  return Recipe.create({ ...data, createdBy: userId });
}

export async function update(
  id: string,
  data: UpdateRecipeDto,
  requesterId: string,
  requesterRole: string
): Promise<IRecipe> {
  const recipe = await Recipe.findById(id);
  if (!recipe) throw new AppError(404, 'Recipe not found');
  if (requesterRole !== 'admin' && recipe.createdBy !== requesterId) {
    throw new AppError(403, 'Solo puedes actualizar tus propias recetas');
  }

  const updated = await Recipe.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!updated) throw new AppError(404, 'Recipe not found');
  return updated;
}

export async function remove(id: string): Promise<IRecipe> {
  const recipe = await Recipe.findByIdAndDelete(id);
  if (!recipe) throw new AppError(404, 'Recipe not found');
  return recipe;
}
