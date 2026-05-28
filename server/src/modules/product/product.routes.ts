import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { validateRequest } from '../../middleware/validate';
import { requireAuth } from '../../middleware/requireAuth';
import { requireRole } from '../../middleware/requireRole';
import { productSchema, updateProductSchema } from './product.validator';
import * as productController from './product.controller';

const router = Router();

router.use(requireAuth);

router.post(
  '/',
  requireRole(['admin', 'manager']),
  validateRequest(productSchema),
  asyncHandler(productController.createProduct)
);

router.get('/', asyncHandler(productController.getProducts));
router.get('/:id', asyncHandler(productController.getProductById));

router.patch(
  '/:id',
  requireRole(['admin', 'manager']),
  validateRequest(updateProductSchema),
  asyncHandler(productController.updateProduct)
);

router.delete(
  '/:id',
  requireRole(['admin']),
  asyncHandler(productController.deleteProduct)
);

export default router;
