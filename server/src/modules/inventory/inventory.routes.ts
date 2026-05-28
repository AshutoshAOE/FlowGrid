import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { validateRequest } from '../../middleware/validate';
import { requireAuth } from '../../middleware/requireAuth';
import { requireRole } from '../../middleware/requireRole';
import { updateInventorySchema, operationalInventorySchema } from './inventory.validator';
import * as inventoryController from './inventory.controller';

const router = Router();

router.use(requireAuth);

router.get('/', asyncHandler(inventoryController.getInventory));

router.post(
  '/adjust',
  requireRole(['admin', 'manager', 'dispatcher']),
  validateRequest(updateInventorySchema),
  asyncHandler(inventoryController.adjustInventory)
);

// Operational Engine Endpoints
router.post(
  '/reserve',
  requireRole(['admin', 'manager', 'dispatcher']),
  validateRequest(operationalInventorySchema),
  asyncHandler(inventoryController.reserveInventory)
);

router.post(
  '/release',
  requireRole(['admin', 'manager', 'dispatcher']),
  validateRequest(operationalInventorySchema),
  asyncHandler(inventoryController.releaseInventory)
);

router.post(
  '/deduct',
  requireRole(['admin', 'manager', 'dispatcher']),
  validateRequest(operationalInventorySchema),
  asyncHandler(inventoryController.deductInventory)
);

export default router;
