import express from 'express';
import { categoryRoutes } from './routes/category.routes.js';
import { recipeRoutes } from './routes/recipe.routes.js';
import { notFound } from './middlewares/notFound.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { morganMiddleware } from './config/logger.js';

export const app = express();

app.use(express.json());
app.use(morganMiddleware);

app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/recipes', recipeRoutes);

app.use(notFound);
app.use(errorHandler);
