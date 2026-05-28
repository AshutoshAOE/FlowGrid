import { Router } from 'express';
import { requireAuth } from '../../middleware/requireAuth';
import { asyncHandler } from '../../utils/asyncHandler';
import * as aiController from './ai.controller';

const router = Router();

// All AI routes require authentication and are scoped by companyId
router.use(requireAuth);

router.post('/insights/operational', asyncHandler(aiController.getOperationalInsights));
router.post('/insights/inventory', asyncHandler(aiController.getInventoryInsights));
router.post('/insights/dispatch', asyncHandler(aiController.getDispatchInsights));
router.post('/query', asyncHandler(aiController.queryOperations));

export default router;
