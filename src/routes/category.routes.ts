import { Router } from 'express';
import { categoryController } from '../controllers/category.controller.js';

export const categoryRoutes = Router();

categoryRoutes.get('/', categoryController.getAll);
categoryRoutes.get('/:id', categoryController.getById);
categoryRoutes.post('/', categoryController.create);
categoryRoutes.put('/:id', categoryController.update);
categoryRoutes.delete('/:id', categoryController.remove);
