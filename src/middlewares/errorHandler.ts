import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../errors/AppError.js';

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }

  if (err instanceof ZodError) {
    res.status(422).json({ error: 'Validation error', details: err.issues });
    return;
  }

  // ID de Mongo con formato inválido: se trata como "no encontrado".
  if (err.name === 'CastError') {
    res.status(404).json({ error: 'Resource not found' });
    return;
  }

  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
}
