import { Request, Response, NextFunction } from 'express';
import * as recipeService from '../services/recipe.service.js';
import { createRecipeSchema, updateRecipeSchema } from '../schemas/recipe.schema.js';
import { AppError } from '../errors/AppError.js';

// ============================================
// TODO: Renombra estas funciones a tu dominio
// ============================================
// Ejemplos: getBooks, createBook, updateBook, deleteBook
//           getMedicines, createMedicine, etc.

export async function getAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
  // TODO: Implementar listado de recursos del dominio
  try {
    const recipes = await recipeService.findAll();
    res.json({ data: recipes, total: recipes.length });
  } catch (err) {
    next(err);
  }
}

export async function getById(req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> {
  // TODO: Implementar búsqueda por ID
  // Retornar 404 si no existe
  try {
    const recipe = await recipeService.findById(req.params.id);
    if (!recipe) throw new AppError(404, 'Recipe not found');
    res.json({ data: recipe });
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  // TODO: Implementar creación validando con Zod
  // req.user está disponible (authMiddleware ya validó el token)
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
  // TODO: Implementar actualización
  // Verificar que el usuario sea el dueño O sea admin
  try {
    if (!req.user) throw new AppError(401, 'Not authenticated');

    const { body } = updateRecipeSchema.parse({ body: req.body });
    const recipe = await recipeService.update(
      req.params.id,
      body,
      req.user.sub,
      req.user.role as string
    );

    if (!recipe) throw new AppError(404, 'Recipe not found');
    res.json({ message: 'Recipe updated', data: recipe });
  } catch (err) {
    if (err instanceof Error && err.message === 'FORBIDDEN') {
      next(new AppError(403, 'Solo puedes actualizar tus propias recetas'));
      return;
    }
    next(err);
  }
}

export async function remove(req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> {
  // TODO: Implementar eliminación (solo admin — enforced en la ruta)
  try {
    const recipe = await recipeService.remove(req.params.id);
    if (!recipe) throw new AppError(404, 'Recipe not found');
    res.json({ message: 'Recipe deleted' });
  } catch (err) {
    next(err);
  }
}
