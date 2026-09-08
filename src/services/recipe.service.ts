import { IRecipe } from '../models/recipe.model';
import * as recipeRepository from '../repositories/recipe.repository';
import { CreateRecipeDto, UpdateRecipeDto } from '../schemas/recipe.schema';
import { AppError } from '../errors/AppError';

// ============================================
// SERVICIO: Receta
// ============================================

export async function getAll(): Promise<IRecipe[]> {
  return recipeRepository.findAll();
}

export async function getById(id: string): Promise<IRecipe> {
  const recipe = await recipeRepository.findById(id);
  if (!recipe) {
    throw new AppError(404, 'Receta no encontrada');
  }
  return recipe;
}

export async function create(
  dto: CreateRecipeDto,
  userId: string
): Promise<IRecipe> {
  return recipeRepository.create({ ...dto, createdBy: userId });
}

export async function update(
  id: string,
  dto: UpdateRecipeDto
): Promise<IRecipe> {
  const recipe = await recipeRepository.updateById(id, dto);
  if (!recipe) {
    throw new AppError(404, 'Receta no encontrada');
  }
  return recipe;
}

export async function remove(id: string): Promise<void> {
  const deleted = await recipeRepository.deleteById(id);
  if (!deleted) {
    throw new AppError(404, 'Receta no encontrada');
  }
}
