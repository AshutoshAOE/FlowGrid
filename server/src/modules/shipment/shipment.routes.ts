import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { validateRequest } from '../../middleware/validate';
import { requireAuth } from '../../middleware/requireAuth';
import { requireRole } from '../../middleware/requireRole';
import { shipmentSchema, assignDriverSchema } from './shipment.validator';
import * as shipmentController from './shipment.controller';

const router = Router();

router.use(requireAuth);

router.post(
  '/',
  requireRole(['admin', 'manager', 'dispatcher']),
  validateRequest(shipmentSchema),
  asyncHandler(shipmentController.createShipment)
);

router.get('/', asyncHandler(shipmentController.getShipments));
router.get('/:id', asyncHandler(shipmentController.getShipmentById));

// --- WORKFLOW ROUTES ---

router.post(
  '/:id/optimize',
  requireRole(['admin', 'manager', 'dispatcher']),
  asyncHandler(shipmentController.optimizeShipment)
);

router.post(
  '/:id/assign-driver',
  requireRole(['admin', 'manager', 'dispatcher']),
  validateRequest(assignDriverSchema),
  asyncHandler(shipmentController.assignDriver)
);

router.post(
  '/:id/release-driver',
  requireRole(['admin', 'manager', 'dispatcher']),
  asyncHandler(shipmentController.releaseDriver)
);

router.post(
  '/:id/transit',
  requireRole(['admin', 'manager', 'dispatcher']),
  asyncHandler(shipmentController.startTransit)
);

router.post(
  '/:id/deliver',
  requireRole(['admin', 'manager', 'dispatcher']),
  asyncHandler(shipmentController.completeDelivery)
);

router.post(
  '/:id/cancel',
  requireRole(['admin', 'manager', 'dispatcher']),
  asyncHandler(shipmentController.cancelShipment)
);

export default router;
