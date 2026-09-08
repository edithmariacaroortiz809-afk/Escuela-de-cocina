import type { ErrorRequestHandler } from 'express';
import { Error as MongooseError } from 'mongoose';
import { ZodError } from 'zod';
import { AppError } from '../errors/AppError.js';
import { logger } from '../config/logger.js';

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof ZodError) {
    res.status(400).json({ error: 'Bad Request', message: 'Datos inválidos', issues: error.issues });
    return;
  }
  if (error instanceof MongooseError.CastError) {
    res.status(400).json({ error: 'Bad Request', message: 'ID inválido' });
    return;
  }
  if (typeof error === 'object' && error !== null && 'code' in error && (error as { code?: number }).code === 11000) {
    res.status(409).json({ error: 'Conflict', message: 'Ya existe un registro con ese valor' });
    return;
  }
  if (error instanceof AppError) {
    logger.warn(`${error.statusCode} ${error.message}`);
    res.status(error.statusCode).json({ error: error.name, message: error.message });
    return;
  }
  logger.error(error);
  res.status(500).json({ error: 'Internal Server Error', message: 'Error interno del servidor' });
};
