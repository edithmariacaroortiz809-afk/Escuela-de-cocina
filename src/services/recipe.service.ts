import { recipeRepository } from '../repositories/recipe.repository.js';
import type { CreateRecipeInput, UpdateRecipeInput } from '../schemas/recipe.schema.js';

export const recipeService = {
  getAll: (page: number, limit: number) => recipeRepository.findAll(page, limit),
  getById: (id: string) => recipeRepository.findById(id),
  create: (data: CreateRecipeInput) => recipeRepository.create(data),
  update: (id: string, data: UpdateRecipeInput) => recipeRepository.update(id, data),
  remove: (id: string) => recipeRepository.delete(id),
};
