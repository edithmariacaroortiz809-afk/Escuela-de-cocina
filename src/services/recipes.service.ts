import { AppError } from '../errors/AppError.js';
import { recipesRepository } from '../repositories/recipes.repository.js';
import type { CreateRecipeDto, Recipe, UpdateRecipeDto } from '../types.js';

export type PaginatedResponse<T> = { data: T[]; total: number; page: number; limit: number };

export const recipesService = {
  async getAll(page: number, limit: number): Promise<PaginatedResponse<Recipe>> {
    const allRecipes = await recipesRepository.getAll();
    const start = (page - 1) * limit;
    return { data: allRecipes.slice(start, start + limit), total: allRecipes.length, page, limit };
  },
  async getById(id: number): Promise<Recipe> {
    const recipe = await recipesRepository.getById(id);
    if (!recipe) throw new AppError(404, `Receta ${id} no encontrada`);
    return recipe;
  },
  async create(data: CreateRecipeDto): Promise<Recipe> { return recipesRepository.create(data); },
  async update(id: number, data: UpdateRecipeDto): Promise<Recipe> {
    const recipe = await recipesRepository.update(id, data);
    if (!recipe) throw new AppError(404, `Receta ${id} no encontrada`);
    return recipe;
  },
  async remove(id: number): Promise<void> {
    const removed = await recipesRepository.remove(id);
    if (!removed) throw new AppError(404, `Receta ${id} no encontrada`);
  },
};
