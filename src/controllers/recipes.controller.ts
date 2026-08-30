import type { NextFunction, Request, Response } from 'express';
import { recipeSchema, updateRecipeSchema } from '../validators/recipeValidator.js';
import { recipesService } from '../services/recipes.service.js';

export const recipesController = {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const page = Number(req.query.page ?? 1);
      const limit = Number(req.query.limit ?? 10);
      const result = await recipesService.getAll(page, limit);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const recipe = await recipesService.getById(id);

      if (!recipe) {
        return res.status(404).json({
          error: 'Not Found',
          message: `Recipe ${id} not found`,
        });
      }

      return res.status(200).json({ data: recipe });
    } catch (error) {
      return next(error);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = recipeSchema.safeParse(req.body);

      if (!parsed.success) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Datos inválidos',
          details: parsed.error.issues,
        });
      }

      const recipe = await recipesService.create(parsed.data);
      return res.status(201).json({ data: recipe });
    } catch (error) {
      return next(error);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const parsed = updateRecipeSchema.safeParse(req.body);

      if (!parsed.success) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Datos inválidos',
          details: parsed.error.issues,
        });
      }

      const recipe = await recipesService.update(id, parsed.data);

      if (!recipe) {
        return res.status(404).json({
          error: 'Not Found',
          message: `Recipe ${id} not found`,
        });
      }

      return res.status(200).json({ data: recipe });
    } catch (error) {
      return next(error);
    }
  },

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const removed = await recipesService.remove(id);

      if (!removed) {
        return res.status(404).json({
          error: 'Not Found',
          message: `Recipe ${id} not found`,
        });
      }

      return res.status(204).send();
    } catch (error) {
      return next(error);
    }
  },
};
