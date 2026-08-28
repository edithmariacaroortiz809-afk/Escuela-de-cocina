import type { NextFunction, Request, Response } from 'express';
import { createRecipeSchema, paginationSchema, recipeIdSchema, updateRecipeSchema } from '../schemas/recipes.schema.js';
import { recipesService } from '../services/recipes.service.js';

export const recipesController = {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = paginationSchema.safeParse(req.query);
      if (!parsed.success) return next(parsed.error);
      res.json(await recipesService.list(parsed.data.page, parsed.data.limit));
    } catch (error) { next(error); }
  },
  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = recipeIdSchema.parse(req.params.id);
      res.json({ data: await recipesService.getById(id) });
    } catch (error) { next(error); }
  },
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createRecipeSchema.parse(req.body);
      res.status(201).json({ data: await recipesService.create(data) });
    } catch (error) { next(error); }
  },
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = recipeIdSchema.parse(req.params.id);
      const data = updateRecipeSchema.parse(req.body);
      res.json({ data: await recipesService.update(id, data) });
    } catch (error) { next(error); }
  },
  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const id = recipeIdSchema.parse(req.params.id);
      await recipesService.remove(id);
      res.status(204).send();
    } catch (error) { next(error); }
  },
};
