import { z } from 'zod';

export const coordinatesSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});

export const calculateRouteSchema = z.object({
  body: z.object({
    origin: coordinatesSchema,
    destination: coordinatesSchema,
  }),
});
