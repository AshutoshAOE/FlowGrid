import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { validateRequest } from '../../middleware/validate';
import { requireAuth } from '../../middleware/requireAuth';
import { requireRole } from '../../middleware/requireRole';
import { driverSchema, updateDriverSchema } from './driver.validator';
import * as driverController from './driver.controller';

const router = Router();

router.use(requireAuth);

router.post(
  '/',
  requireRole(['admin', 'manager', 'dispatcher']),
  validateRequest(driverSchema),
  asyncHandler(driverController.createDriver)
);

router.get('/', asyncHandler(driverController.getDrivers));
router.get('/available', asyncHandler(driverController.getAvailableDrivers));
router.get('/:id', asyncHandler(driverController.getDriverById));

router.patch(
  '/:id',
  requireRole(['admin', 'manager', 'dispatcher']),
  validateRequest(updateDriverSchema),
  asyncHandler(driverController.updateDriver)
);

router.delete(
  '/:id',
  requireRole(['admin']),
  asyncHandler(driverController.deleteDriver)
);

export default router;
