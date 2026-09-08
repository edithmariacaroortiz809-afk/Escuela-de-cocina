import { Router } from 'express';
import * as recipeController from '../controllers/recipe.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

// ============================================
// RUTAS: Recetas (Escuela de Cocina)
// ============================================
// Todas las rutas están protegidas con authMiddleware.
// ============================================

const router = Router();

// Todas las rutas de este router requieren autenticación
router.use(authMiddleware);

// GET /api/v1/recipes — listar todas
router.get('/', recipeController.getAll);

// GET /api/v1/recipes/:id — obtener una por ID
router.get('/:id', recipeController.getById);

// POST /api/v1/recipes — crear una nueva
router.post('/', recipeController.create);

// PATCH /api/v1/recipes/:id — actualizar parcialmente
router.patch('/:id', recipeController.update);

// DELETE /api/v1/recipes/:id — eliminar
router.delete('/:id', recipeController.remove);

export default router;
