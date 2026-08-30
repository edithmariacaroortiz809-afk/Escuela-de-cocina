import express, { type NextFunction, type Request, type Response } from 'express';
import recipesRoutes from './routes/recipes.routes.js';

const app = express();

app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
  const startedAt = Date.now();

  const logRequest = () => {
    const duration = Date.now() - startedAt;
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`);
  };

  res.on('finish', logRequest);
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

app.use((error: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = error?.status ?? 500;
  const message = error?.message ?? 'Error interno del servidor';

  res.status(status).json({
    success: false,
    message,
  });
});

export default app;
