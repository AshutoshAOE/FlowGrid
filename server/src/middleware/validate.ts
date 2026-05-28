import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { ValidationError } from '../utils/errors/AppError';

export const validateRequest = (schema: ZodSchema<any>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error: any) {
      if (error instanceof ZodError || error.issues) {
        const errorMessages = (error.issues || error.errors || []).map((err: any) => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        next(new ValidationError('Invalid request data', errorMessages));
      } else {
        next(error);
      }
    }
  };
};
