import { z } from 'zod';

export const productSchema = z.object({
  body: z.object({
    SKU: z.string().min(2, 'SKU must be at least 2 characters'),
    name: z.string().min(2, 'Name is required'),
    category: z.string().min(2, 'Category is required'),
    weight: z.number().min(0).optional(),
    dimensions: z.object({
      length: z.number().min(0),
      width: z.number().min(0),
      height: z.number().min(0),
    }).optional(),
    isActive: z.boolean().optional(),
  }),
});

export const updateProductSchema = z.object({
  body: productSchema.shape.body.partial(),
});
