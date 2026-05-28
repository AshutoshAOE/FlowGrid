import { Request, Response, NextFunction } from 'express';
import { AuthError } from '../utils/errors/AppError';

export const requireRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AuthError('Authentication required'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new AuthError('You do not have permission to perform this action'));
    }

    next();
  };
};
