import { Request, Response } from 'express';
import * as warehouseService from './warehouse.service';
import { createSuccessResponse } from '../../utils/response';
import { HTTP_STATUS } from '../../constants/httpStatus';

export const createWarehouse = async (req: Request, res: Response) => {
  const result = await warehouseService.createWarehouse(req.user!.companyId, req.body);
  res.status(HTTP_STATUS.CREATED).json(createSuccessResponse('Warehouse created successfully', result));
};

export const getWarehouses = async (req: Request, res: Response) => {
  const result = await warehouseService.getWarehouses(req.user!.companyId);
  res.status(HTTP_STATUS.OK).json(createSuccessResponse('Warehouses retrieved successfully', result));
};

export const getWarehouseById = async (req: Request, res: Response) => {
  const result = await warehouseService.getWarehouseById(req.user!.companyId, req.params.id as string);
  res.status(HTTP_STATUS.OK).json(createSuccessResponse('Warehouse retrieved successfully', result));
};

export const updateWarehouse = async (req: Request, res: Response) => {
  const result = await warehouseService.updateWarehouse(req.user!.companyId, req.params.id as string, req.body);
  res.status(HTTP_STATUS.OK).json(createSuccessResponse('Warehouse updated successfully', result));
};

export const deleteWarehouse = async (req: Request, res: Response) => {
  await warehouseService.deleteWarehouse(req.user!.companyId, req.params.id as string);
  res.status(HTTP_STATUS.NO_CONTENT).send();
};
