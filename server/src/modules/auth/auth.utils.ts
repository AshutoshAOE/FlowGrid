import jwt from 'jsonwebtoken';
import { env } from '../../config/env';
import mongoose from 'mongoose';

export interface TokenPayload {
  userId: string;
  companyId: string;
  role: string;
}

export const generateToken = (userId: mongoose.Types.ObjectId, companyId: mongoose.Types.ObjectId, role: string): string => {
  return jwt.sign(
    { userId: userId.toString(), companyId: companyId.toString(), role },
    env.JWT_SECRET,
    { expiresIn: '1d' } // Token expires in 1 day
  );
};

export const verifyToken = (token: string): TokenPayload => {
  return jwt.verify(token, env.JWT_SECRET) as TokenPayload;
};
