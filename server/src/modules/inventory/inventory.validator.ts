import { z } from 'zod';

export const updateInventorySchema = z.object({
  body: z.object({
    warehouseId: z.string().min(1, 'Warehouse ID is required'),
    productId: z.string().min(1, 'Product ID is required'),
    quantityAdjustment: z.number(), // Can be positive or negative
  }),
});

export const operationalInventorySchema = z.object({
  body: z.object({
    warehouseId: z.string().min(1, 'Warehouse ID is required'),
    productId: z.string().min(1, 'Product ID is required'),
    quantity: z.number().int().positive('Quantity must be a positive integer'),
  }),
});
