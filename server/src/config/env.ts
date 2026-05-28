import { z } from 'zod';
import dotenv from 'dotenv';
import { logger } from '../utils/logger';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('5000'),
  MONGO_URI: z.string().url('Invalid MongoDB URI format'),
  JWT_SECRET: z.string().min(10, 'JWT secret must be at least 10 characters'),
  JWT_EXPIRES_IN: z.string().default('1d'),
  ORS_API_KEY: z.string().optional(),
  GEMINI_API_KEY: z.string().min(10, 'Gemini API key is required for AI features'),
});

const validateEnv = () => {
  try {
    const envVars = envSchema.parse(process.env);
    return envVars;
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.error('Environment validation failed:', error.format());
    } else {
      logger.error('Unexpected error during environment validation', error);
    }
    process.exit(1);
  }
};

export const env = validateEnv();
