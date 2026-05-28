import { z } from 'zod';

export const commonValidations = {
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID format'),
  pagination: z.object({
    page: z.string().regex(/^\d+$/).optional().transform(Number).default(1),
    limit: z.string().regex(/^\d+$/).optional().transform(Number).default(10),
  }),
};
