import express, { type NextFunction, type Request, type Response } from 'express';
import { errorHandler } from './middleware/errorHandler.js';
import recipesRoutes from './routes/recipes.routes.js';

const app = express();

app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
  const startedAt = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - startedAt;
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`);
  });

  next();
});

app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'API de recetas de Escuela de Cocina activa',
    endpoints: [
      'GET /api/v1/recipes',
      'GET /api/v1/recipes/:id',
      'POST /api/v1/recipes',
      'PUT /api/v1/recipes/:id',
      'DELETE /api/v1/recipes/:id',
    ],
  });
});

app.use('/api/v1/recipes', recipesRoutes);

app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada',
  });
});

app.use(errorHandler);

export default app;
