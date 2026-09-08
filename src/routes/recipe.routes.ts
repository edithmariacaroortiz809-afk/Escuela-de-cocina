import { Router } from 'express';
import { recipeController } from '../controllers/recipe.controller.js';

export const recipeRoutes = Router();

recipeRoutes.get('/', recipeController.getAll);
recipeRoutes.get('/:id', recipeController.getById);
recipeRoutes.post('/', recipeController.create);
recipeRoutes.put('/:id', recipeController.update);
recipeRoutes.delete('/:id', recipeController.remove);
