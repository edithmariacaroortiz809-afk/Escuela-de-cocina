import { Recipe } from '../models/recipe.model.js';
import { AppError } from '../errors/AppError.js';
import type { CreateRecipeInput, UpdateRecipeInput } from '../schemas/recipe.schema.js';

export const recipeRepository = {
  async findAll(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      Recipe.find().populate('category').sort({ createdAt: -1 }).skip(skip).limit(limit),
      Recipe.countDocuments(),
    ]);
    return { data, total, page, totalPages: Math.ceil(total / limit) };
  },

  async findById(id: string) {
    const recipe = await Recipe.findById(id).populate('category');
    if (!recipe) throw new AppError(404, 'Receta no encontrada');
    return recipe;
  },

  async create(data: CreateRecipeInput) {
    return Recipe.create(data);
  },

  async update(id: string, data: UpdateRecipeInput) {
    const recipe = await Recipe.findByIdAndUpdate(id, data, { new: true, runValidators: true }).populate('category');
    if (!recipe) throw new AppError(404, 'Receta no encontrada');
    return recipe;
  },

  async delete(id: string) {
    const recipe = await Recipe.findByIdAndDelete(id);
    if (!recipe) throw new AppError(404, 'Receta no encontrada');
    return recipe;
  },
};
