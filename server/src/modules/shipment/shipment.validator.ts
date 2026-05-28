import { z } from 'zod';

export const shipmentSchema = z.object({
  body: z.object({
    destination: z.object({
      address: z.string().min(5, 'Address must be at least 5 characters'),
      coordinates: z.object({
        lat: z.number(),
        lng: z.number(),
      }).optional(),
    }),
    shipmentItems: z.array(
      z.object({
        productId: z.string().min(1, 'Product ID is required'),
        quantity: z.number().min(1, 'Quantity must be at least 1'),
      })
    ).min(1, 'At least one item is required'),
  }),
});



// Explicit validation schemas for workflow transitions

export const assignDriverSchema = z.object({
  body: z.object({
    driverId: z.string().min(1, 'Driver ID is required'),
  }),
});

