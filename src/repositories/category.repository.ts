import { Category } from '../models/category.model.js';
import { AppError } from '../errors/AppError.js';
import type { CreateCategoryInput, UpdateCategoryInput } from '../schemas/category.schema.js';

export const categoryRepository = {
  async findAll() {
    return Category.find().sort({ name: 1 });
  },

  async findById(id: string) {
    const category = await Category.findById(id);
    if (!category) throw new AppError(404, 'Categoría no encontrada');
    return category;
  },

  async create(data: CreateCategoryInput) {
    return Category.create(data);
  },

  async update(id: string, data: UpdateCategoryInput) {
    const category = await Category.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!category) throw new AppError(404, 'Categoría no encontrada');
    return category;
  },

  async delete(id: string) {
    const category = await Category.findByIdAndDelete(id);
    if (!category) throw new AppError(404, 'Categoría no encontrada');
    return category;
  },
};
