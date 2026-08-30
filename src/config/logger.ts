import winston from 'winston';
import morgan from 'morgan';
import type { RequestHandler } from 'express';

const isProduction = process.env.NODE_ENV === 'production';

export const logger = winston.createLogger({
  level: isProduction ? 'warn' : 'http',
  format: isProduction
    ? winston.format.combine(winston.format.timestamp(), winston.format.json())
    : winston.format.combine(winston.format.colorize(), winston.format.simple()),
  transports: [
    new winston.transports.Console(),
    ...(isProduction ? [new winston.transports.File({ filename: 'logs/error.log', level: 'error' })] : []),
  ],
});

export const morganMiddleware: RequestHandler = morgan('combined', {
  stream: { write: (message: string) => logger.http(message.trim()) },
});
