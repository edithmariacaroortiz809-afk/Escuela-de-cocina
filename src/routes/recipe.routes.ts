import { Router } from 'express';
import { getAll, getById, create, update, remove } from '../controllers/recipe.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/requireRole.js';

const router = Router();

// ============================================
// El catálogo es público; escribir requiere autenticación.
router.get('/', getAll);
router.get('/:id', getById);
router.post('/', authMiddleware, create);
router.patch('/:id', authMiddleware, update);
router.delete('/:id', authMiddleware, requireRole('admin'), remove);

export default router;
