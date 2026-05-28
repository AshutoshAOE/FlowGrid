import { Router } from 'express';
import { createSuccessResponse } from '../../utils/response';
import { HTTP_STATUS } from '../../constants/httpStatus';

import authRoutes from '../../modules/auth/auth.routes';
import warehouseRoutes from '../../modules/warehouse/warehouse.routes';
import productRoutes from '../../modules/product/product.routes';
import inventoryRoutes from '../../modules/inventory/inventory.routes';
import driverRoutes from '../../modules/driver/driver.routes';
import shipmentRoutes from '../../modules/shipment/shipment.routes';
import routingRoutes from '../../modules/routing/routing.routes';
import dashboardRoutes from '../../modules/dashboard/dashboard.routes';

import aiRoutes from '../../modules/ai/ai.routes';

const router = Router();

// Health check endpoint for v1
router.get('/health', (req, res) => {
  res.status(HTTP_STATUS.OK).json(
    createSuccessResponse('FlowGrid API v1 is running optimally', {
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    })
  );
});

// Domain routes
router.use('/auth', authRoutes);
router.use('/warehouses', warehouseRoutes);
router.use('/products', productRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/drivers', driverRoutes);
router.use('/shipments', shipmentRoutes);
router.use('/routing', routingRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/ai', aiRoutes);

export default router;
