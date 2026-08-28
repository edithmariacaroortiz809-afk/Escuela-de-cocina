import { Router } from 'express';
import { recipesController } from '../controllers/recipes.controller.js';

const router = Router();
router.get('/', recipesController.list);
router.get('/:id', recipesController.getById);
router.post('/', recipesController.create);
router.put('/:id', recipesController.update);
router.delete('/:id', recipesController.remove);
export default router;
