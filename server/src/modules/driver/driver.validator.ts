import { z } from 'zod';
import { DRIVER_STATUSES } from './driver.constants';

export const driverSchema = z.object({
  body: z.object({
    fullName: z.string().min(2, 'Name must be at least 2 characters'),
    phone: z.string().min(10, 'Phone must be at least 10 characters'),
    vehicleType: z.string().min(2, 'Vehicle type is required'),
    vehicleCapacity: z.number().min(0, 'Capacity cannot be negative'),
    status: z.nativeEnum(DRIVER_STATUSES).optional(),
    currentCoordinates: z.object({
      lat: z.number(),
      lng: z.number(),
    }).optional(),
    isActive: z.boolean().optional(),
  }),
});

export const updateDriverSchema = z.object({
  body: driverSchema.shape.body.partial(),
});
