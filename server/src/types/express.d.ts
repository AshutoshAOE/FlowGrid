import { Request } from 'express';
import mongoose from 'mongoose';

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: mongoose.Types.ObjectId;
        companyId: mongoose.Types.ObjectId;
        role: string;
      };
    }
  }
}
