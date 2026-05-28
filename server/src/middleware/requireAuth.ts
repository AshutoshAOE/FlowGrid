import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { verifyToken } from '../modules/auth/auth.utils';
import { AuthError } from '../utils/errors/AppError';
import mongoose from 'mongoose';

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AuthError('Authentication required'));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
    
    // Inject decoded tenant info into request
    req.user = {
      userId: new mongoose.Types.ObjectId(decoded.userId),
      companyId: new mongoose.Types.ObjectId(decoded.companyId),
      role: decoded.role,
    };

    next();
  } catch (error) {
    return next(new AuthError('Invalid or expired token'));
  }
};
