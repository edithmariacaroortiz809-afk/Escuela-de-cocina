import type { Request, Response, NextFunction } from 'express';
import { recipeService } from '../services/recipe.service.js';
import { createRecipeSchema, updateRecipeSchema } from '../schemas/recipe.schema.js';

export const recipeController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const page = Math.max(1, Number(req.query.page) || 1);
      const limit = Math.max(1, Number(req.query.limit) || 10);
      const result = await recipeService.getAll(page, limit);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const recipe = await recipeService.getById(String(req.params.id));
      res.json(recipe);
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createRecipeSchema.parse(req.body);
      const recipe = await recipeService.create(data);
      res.status(201).json(recipe);
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const data = updateRecipeSchema.parse(req.body);
      const recipe = await recipeService.update(String(req.params.id), data);
      res.json(recipe);
    } catch (err) {
      next(err);
    }
  },

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      await recipeService.remove(String(req.params.id));
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};
