import { Request, Response, NextFunction } from 'express';
import * as recipeService from '../services/recipe.service.js';
import { createRecipeSchema, updateRecipeSchema } from '../schemas/recipe.schema.js';
import { AppError } from '../errors/AppError.js';

export async function getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { difficulty } = req.query;
    const filters =
      typeof difficulty === 'string' && ['fácil', 'media', 'difícil'].includes(difficulty)
        ? { difficulty: difficulty as 'fácil' | 'media' | 'difícil' }
        : {};

    const recipes = await recipeService.findAll(filters);
    res.json({ data: recipes, total: recipes.length });
  } catch (err) {
    next(err);
  }
}

export async function getById(req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> {
  try {
    const recipe = await recipeService.findById(req.params.id);
    res.json({ data: recipe });
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) throw new AppError(401, 'Not authenticated');

    const { body } = createRecipeSchema.parse({ body: req.body });
    const recipe = await recipeService.create(body, req.user.sub);
    res.status(201).json({ message: 'Recipe created', data: recipe });
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) throw new AppError(401, 'Not authenticated');

    const { body } = updateRecipeSchema.parse({ body: req.body });
    const recipe = await recipeService.update(
      req.params.id,
      body,
      req.user.sub,
      req.user.role as string
    );

    res.json({ message: 'Recipe updated', data: recipe });
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> {
  try {
    const recipe = await recipeService.remove(req.params.id);
    res.json({ message: 'Recipe deleted', data: recipe });
  } catch (err) {
    next(err);
  }
}
