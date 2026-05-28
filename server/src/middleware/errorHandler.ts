import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { createErrorResponse } from '../utils/response';
import { HTTP_STATUS } from '../constants/httpStatus';
import { env } from '../config/env';
import { AppError } from '../utils/errors/AppError';

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(`${err.name}: ${err.message}`, {
    stack: err.stack,
    path: req.path,
    method: req.method,
    correlationId: req.headers['x-correlation-id'],
  });

  if (err instanceof AppError) {
    return res.status(err.statusCode).json(
      createErrorResponse(
        err.message,
        err.errors || (env.NODE_ENV === 'development' ? err.stack : undefined)
      )
    );
  }

  const statusCode = res.statusCode === HTTP_STATUS.OK ? HTTP_STATUS.INTERNAL_SERVER_ERROR : res.statusCode;
  
  res.status(statusCode).json(
    createErrorResponse(
      'Internal Server Error',
      env.NODE_ENV === 'development' ? err.stack : undefined
    )
  );
};
