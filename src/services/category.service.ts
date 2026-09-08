import { categoryRepository } from '../repositories/category.repository.js';
import type { CreateCategoryInput, UpdateCategoryInput } from '../schemas/category.schema.js';

export const categoryService = {
  getAll: () => categoryRepository.findAll(),
  getById: (id: string) => categoryRepository.findById(id),
  create: (data: CreateCategoryInput) => categoryRepository.create(data),
  update: (id: string, data: UpdateCategoryInput) => categoryRepository.update(id, data),
  remove: (id: string) => categoryRepository.delete(id),
};
