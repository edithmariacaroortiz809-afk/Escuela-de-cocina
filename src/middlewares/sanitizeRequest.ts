import type { NextFunction, Request, Response } from 'express';
import mongoSanitize from 'express-mongo-sanitize';

type SanitizeModule = typeof mongoSanitize & {
  sanitize: (value: Record<string, unknown>) => Record<string, unknown>;
};

const sanitize = (mongoSanitize as SanitizeModule).sanitize;

export function sanitizeRequest(req: Request, _res: Response, next: NextFunction): void {
  req.body = sanitize(req.body ?? {});
  req.params = sanitize(req.params);

  const cleanQuery = sanitize({ ...req.query } as Record<string, unknown>);
  for (const key of Object.keys(req.query)) {
    delete req.query[key];
  }
  Object.assign(req.query, cleanQuery);

  next();
}