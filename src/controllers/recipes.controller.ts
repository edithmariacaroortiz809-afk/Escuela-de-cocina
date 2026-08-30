import type { NextFunction, Request, Response } from 'express';
import { paginationSchema, recipeIdSchema, createRecipeSchema, updateRecipeSchema } from '../schemas/recipe.schema.js';
import { recipesService } from '../services/recipes.service.js';

export const recipesController = {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = paginationSchema.safeParse(req.query);
      if (!parsed.success) return next(parsed.error);
      const { page, limit } = parsed.data;
      res.status(200).json(await recipesService.getAll(page, limit));
    } catch (error) { next(error); }
  },
  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = recipeIdSchema.safeParse(req.params.id);
      if (!parsed.success) return next(parsed.error);
      const id = parsed.data;
      res.status(200).json({ data: await recipesService.getById(id) });
    } catch (error) { next(error); }
  },
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = createRecipeSchema.safeParse(req.body);
      if (!parsed.success) return next(parsed.error);
      const data = parsed.data;
      res.status(201).json({ data: await recipesService.create(data) });
    } catch (error) { next(error); }
  },
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const parsedId = recipeIdSchema.safeParse(req.params.id);
      if (!parsedId.success) return next(parsedId.error);
      const parsed = updateRecipeSchema.safeParse(req.body);
      if (!parsed.success) return next(parsed.error);
      const id = parsedId.data;
      const data = parsed.data;
      res.status(200).json({ data: await recipesService.update(id, data) });
    } catch (error) { next(error); }
  },
  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = recipeIdSchema.safeParse(req.params.id);
      if (!parsed.success) return next(parsed.error);
      const id = parsed.data;
      await recipesService.remove(id);
      res.status(204).send();
    } catch (error) { next(error); }
  },
};
