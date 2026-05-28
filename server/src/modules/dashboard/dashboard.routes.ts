import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { requireAuth } from '../../middleware/requireAuth';
import * as dashboardController from './dashboard.controller';

const router = Router();

router.use(requireAuth);

router.get(
  '/metrics',
  asyncHandler(dashboardController.getMetrics)
);

export default router;
