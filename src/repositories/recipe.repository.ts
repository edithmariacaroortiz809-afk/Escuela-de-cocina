import { RecipeModel, IRecipe } from '../models/recipe.model';
import { CreateRecipeDto, UpdateRecipeDto } from '../schemas/recipe.schema';

// ============================================
// REPOSITORIO: Receta
// ============================================

export async function findAll(): Promise<IRecipe[]> {
  return RecipeModel.find().sort({ createdAt: -1 });
}

export async function findById(id: string): Promise<IRecipe | null> {
  return RecipeModel.findById(id);
}

export async function create(data: CreateRecipeDto & { createdBy: string }): Promise<IRecipe> {
  return RecipeModel.create(data);
}

export async function updateById(
  id: string,
  data: UpdateRecipeDto
): Promise<IRecipe | null> {
  return RecipeModel.findByIdAndUpdate(id, data, { new: true, runValidators: true });
}

export async function deleteById(id: string): Promise<boolean> {
  const result = await RecipeModel.findByIdAndDelete(id);
  return result !== null;
}
