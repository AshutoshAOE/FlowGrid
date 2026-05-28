import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { validateRequest } from '../../middleware/validate';
import { requireAuth } from '../../middleware/requireAuth';
import { requireRole } from '../../middleware/requireRole';
import { warehouseSchema, updateWarehouseSchema } from './warehouse.validator';
import * as warehouseController from './warehouse.controller';

const router = Router();

// All warehouse routes are protected
router.use(requireAuth);

router.post(
  '/',
  requireRole(['admin', 'manager']),
  validateRequest(warehouseSchema),
  asyncHandler(warehouseController.createWarehouse)
);

router.get('/', asyncHandler(warehouseController.getWarehouses));

router.get('/:id', asyncHandler(warehouseController.getWarehouseById));

router.patch(
  '/:id',
  requireRole(['admin', 'manager']),
  validateRequest(updateWarehouseSchema),
  asyncHandler(warehouseController.updateWarehouse)
);

router.delete(
  '/:id',
  requireRole(['admin']),
  asyncHandler(warehouseController.deleteWarehouse)
);

export default router;
