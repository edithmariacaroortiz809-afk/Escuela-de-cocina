import type { NextFunction, Request, Response } from 'express';

export function errorHandler(error: any, _req: Request, res: Response, _next: NextFunction) {
  const status = error?.status ?? 500;
  const message = error?.message ?? 'Error interno del servidor';

  res.status(status).json({
    success: false,
    message,
    details: error?.details ?? undefined,
  });
}
