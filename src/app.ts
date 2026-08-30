import express from 'express';
import recipesRoutes from './routes/recipes.routes.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFound } from './middlewares/notFound.js';
import { morganMiddleware } from './config/logger.js';

const app = express();
app.use(express.json());
app.use(morganMiddleware);
app.get('/', (_req, res) => res.json({ success: true, message: 'API de recetas con validación activa' }));
app.use('/api/v1/recipes', recipesRoutes);
app.use(notFound);
app.use(errorHandler);
export default app;
