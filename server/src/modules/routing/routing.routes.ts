import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { validateRequest } from '../../middleware/validate';
import { requireAuth } from '../../middleware/requireAuth';
import { calculateRouteSchema } from './routing.validator';
import * as routingController from './routing.controller';

const router = Router();

router.use(requireAuth);

router.post(
  '/calculate',
  validateRequest(calculateRouteSchema),
  asyncHandler(routingController.calculateRoute)
);

router.post(
  '/eta',
  validateRequest(calculateRouteSchema),
  asyncHandler(routingController.calculateETA)
);

router.post(
  '/geocode',
  asyncHandler(routingController.geocode)
);

export default router;

