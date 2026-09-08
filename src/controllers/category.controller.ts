import type { Request, Response, NextFunction } from 'express';
import { categoryService } from '../services/category.service.js';
import { createCategorySchema, updateCategorySchema } from '../schemas/category.schema.js';

export const categoryController = {
  async getAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await categoryService.getAll();
      res.json(categories);
    } catch (err) {
      next(err);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const category = await categoryService.getById(String(req.params.id));
      res.json(category);
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createCategorySchema.parse(req.body);
      const category = await categoryService.create(data);
      res.status(201).json(category);
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const data = updateCategorySchema.parse(req.body);
      const category = await categoryService.update(String(req.params.id), data);
      res.json(category);
    } catch (err) {
      next(err);
    }
  },

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      await categoryService.remove(String(req.params.id));
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};
