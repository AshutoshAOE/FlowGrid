import { z } from 'zod';

export const warehouseSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    address: z.object({
      street: z.string().min(1, 'Street is required'),
      city: z.string().min(1, 'City is required'),
      state: z.string().min(1, 'State is required'),
      zip: z.string().min(1, 'ZIP is required'),
    }),
    coordinates: z.object({
      lat: z.number(),
      lng: z.number(),
    }).optional(),
    storageCapacity: z.number().min(0),
    isActive: z.boolean().optional(),
  }),
});

export const updateWarehouseSchema = z.object({
  body: warehouseSchema.shape.body.partial(),
});
