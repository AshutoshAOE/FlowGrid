import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import crypto from 'crypto';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  // Assign correlation ID if not present
  req.headers['x-correlation-id'] = req.headers['x-correlation-id'] || crypto.randomUUID();
  const correlationId = req.headers['x-correlation-id'];

  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(`[${correlationId}] ${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`, {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      durationMs: duration,
      ip: req.ip,
      correlationId,
    });
  });

  next();
};
