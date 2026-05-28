import { Request, Response } from 'express';
import * as inventoryService from './inventory.service';
import { createSuccessResponse } from '../../utils/response';
import { HTTP_STATUS } from '../../constants/httpStatus';

export const getInventory = async (req: Request, res: Response) => {
  const warehouseId = req.query.warehouseId as string | undefined;
  const result = await inventoryService.getInventory(req.user!.companyId, warehouseId);
  res.status(HTTP_STATUS.OK).json(createSuccessResponse('Inventory retrieved successfully', result));
};

export const adjustInventory = async (req: Request, res: Response) => {
  const { warehouseId, productId, quantityAdjustment } = req.body;
  const result = await inventoryService.adjustInventory(req.user!.companyId, warehouseId, productId, quantityAdjustment);
  res.status(HTTP_STATUS.OK).json(createSuccessResponse('Inventory adjusted successfully', result));
};

export const reserveInventory = async (req: Request, res: Response) => {
  const { warehouseId, productId, quantity } = req.body;
  const result = await inventoryService.reserveInventory(req.user!.companyId, warehouseId, productId, quantity);
  res.status(HTTP_STATUS.OK).json(createSuccessResponse('Inventory reserved successfully', result));
};

export const releaseInventory = async (req: Request, res: Response) => {
  const { warehouseId, productId, quantity } = req.body;
  const result = await inventoryService.releaseInventory(req.user!.companyId, warehouseId, productId, quantity);
  res.status(HTTP_STATUS.OK).json(createSuccessResponse('Inventory released successfully', result));
};

export const deductInventory = async (req: Request, res: Response) => {
  const { warehouseId, productId, quantity } = req.body;
  const result = await inventoryService.deductInventory(req.user!.companyId, warehouseId, productId, quantity);
  res.status(HTTP_STATUS.OK).json(createSuccessResponse('Inventory deducted successfully', result));
};
