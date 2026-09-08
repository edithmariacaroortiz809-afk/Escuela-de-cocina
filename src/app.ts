import express from 'express';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.routes.js';
import recipeRouter from './routes/recipe.routes.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFound } from './middlewares/notFound.js';

export const app = express();

app.use(express.json());
app.use(cookieParser());

// Rutas de autenticación
app.use('/api/v1/auth', authRouter);

// Recursos del dominio: Recetas (Escuela de Cocina)
app.use('/api/v1/recipes', recipeRouter);

// Middlewares de errores (siempre al final)
app.use(notFound);
app.use(errorHandler);
