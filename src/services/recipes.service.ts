import { recipesRepository } from '../repositories/recipes.repository.js';
import { AppError } from '../errors/AppError.js';
import type { CreateRecipeInput, UpdateRecipeInput } from '../schemas/recipes.schema.js';

export const recipesService = {
  async list(page: number, limit: number) {
    const result = await recipesRepository.findMany((page - 1) * limit, limit);
    return { data: result.data, total: result.total, page, limit };
  },
  async getById(id: string) {
    const recipe = await recipesRepository.findById(id);
    if (!recipe) throw new AppError(404, 'Recurso no encontrado');
    return recipe;
  },
  create(data: CreateRecipeInput) { return recipesRepository.create(data); },
  update(id: string, data: UpdateRecipeInput) { return recipesRepository.update(id, data); },
  remove(id: string) { return recipesRepository.remove(id); },
};
