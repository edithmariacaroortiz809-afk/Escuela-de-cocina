import { Router, type Request, type Response, type NextFunction } from 'express';
import { store } from '../store.js';
import type { CreateRecipeDto, UpdateRecipeDto } from '../types.js';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    data: store.getAll(),
  });
});

router.get('/:id', (req: Request, res: Response, next: NextFunction) => {
  const id = Number(req.params.id);
  const recipe = store.getById(id);

  if (!recipe) {
    return next({ status: 404, message: 'Receta no encontrada' });
  }

  return res.status(200).json({
    success: true,
    data: recipe,
  });
});

router.post('/', (req: Request, res: Response, next: NextFunction) => {
  const payload = req.body as Partial<CreateRecipeDto>;

  if (!payload.name || !payload.category || typeof payload.price !== 'number' || typeof payload.active !== 'boolean') {
    return next({ status: 400, message: 'Faltan campos obligatorios: name, category, price, active' });
  }

  const created = store.create({
    name: payload.name,
    category: payload.category,
    price: payload.price,
    active: payload.active,
    difficulty: payload.difficulty ?? 'media',
    duration: payload.duration ?? 30,
  });

  return res.status(201).json({
    success: true,
    data: created,
  });
});

router.put('/:id', (req: Request, res: Response, next: NextFunction) => {
  const id = Number(req.params.id);
  const payload = req.body as UpdateRecipeDto;

  const updated = store.update(id, payload);

  if (!updated) {
    return next({ status: 404, message: 'Receta no encontrada' });
  }

  return res.status(200).json({
    success: true,
    data: updated,
  });
});

router.delete('/:id', (req: Request, res: Response, next: NextFunction) => {
  const id = Number(req.params.id);
  const removed = store.remove(id);

  if (!removed) {
    return next({ status: 404, message: 'Receta no encontrada' });
  }

  return res.status(204).send();
});

export default router;
