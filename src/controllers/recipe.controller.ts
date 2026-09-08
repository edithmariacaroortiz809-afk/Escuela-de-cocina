import { Request, Response, NextFunction } from 'express';
import * as recipeService from '../services/recipe.service';
import { createRecipeSchema, updateRecipeSchema } from '../schemas/recipe.schema';

// ============================================
// CONTROLADOR: Receta
// ============================================

export async function getAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const recipes = await recipeService.getAll();
    res.json(recipes);
  } catch (err) {
    next(err);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const recipe = await recipeService.getById(String(req.params.id));
    res.json(recipe);
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = createRecipeSchema.parse(req.body);
    const userId = req.user!.sub;
    const recipe = await recipeService.create(data, userId);
    res.status(201).json(recipe);
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = updateRecipeSchema.parse(req.body);
    const recipe = await recipeService.update(String(req.params.id), data);
    res.json(recipe);
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await recipeService.remove(String(req.params.id));
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
