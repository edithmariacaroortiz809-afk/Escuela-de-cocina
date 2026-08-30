import { recipesRepository } from '../repositories/recipes.repository.js';
import type { CreateRecipeDto, Recipe, UpdateRecipeDto } from '../types.js';

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
};

export const recipesService = {
  async getAll(page = 1, limit = 10): Promise<PaginatedResponse<Recipe>> {
    const allRecipes = await recipesRepository.getAll();
    const safePage = Math.max(1, Number(page) || 1);
    const safeLimit = Math.max(1, Number(limit) || 10);
    const start = (safePage - 1) * safeLimit;
    const end = start + safeLimit;

    return {
      data: allRecipes.slice(start, end),
      total: allRecipes.length,
      page: safePage,
      limit: safeLimit,
    };
  },

  async getById(id: number): Promise<Recipe | undefined> {
    return recipesRepository.getById(id);
  },

  async create(data: CreateRecipeDto): Promise<Recipe> {
    return recipesRepository.create(data);
  },

  async update(id: number, data: UpdateRecipeDto): Promise<Recipe | undefined> {
    return recipesRepository.update(id, data);
  },

  async remove(id: number): Promise<boolean> {
    return recipesRepository.remove(id);
  },
};
