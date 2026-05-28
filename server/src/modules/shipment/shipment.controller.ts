import { Request, Response } from 'express';
import * as shipmentService from './shipment.service';
import { createSuccessResponse } from '../../utils/response';
import { HTTP_STATUS } from '../../constants/httpStatus';

export const createShipment = async (req: Request, res: Response) => {
  const result = await shipmentService.createShipment(req.user!.companyId, req.body);
  res.status(HTTP_STATUS.CREATED).json(createSuccessResponse('Shipment created successfully', result));
};

export const getShipments = async (req: Request, res: Response) => {
  const result = await shipmentService.getShipments(req.user!.companyId);
  res.status(HTTP_STATUS.OK).json(createSuccessResponse('Shipments retrieved successfully', result));
};

export const getShipmentById = async (req: Request, res: Response) => {
  const result = await shipmentService.getShipmentById(req.user!.companyId, req.params.id as string);
  res.status(HTTP_STATUS.OK).json(createSuccessResponse('Shipment retrieved successfully', result));
};

// --- WORKFLOW CONTROLLERS ---

import * as optimizationService from '../optimization/optimization.service';

export const optimizeShipment = async (req: Request, res: Response) => {
  const result = await optimizationService.runShipmentOptimization(req.user!.companyId, req.params.id as string);
  res.status(HTTP_STATUS.OK).json(createSuccessResponse('Shipment optimized successfully', result));
};

import * as dispatchService from '../dispatch/dispatch.service';

export const assignDriver = async (req: Request, res: Response) => {
  const result = await dispatchService.assignDriver(req.user!.companyId, req.params.id as string, req.body.driverId);
  res.status(HTTP_STATUS.OK).json(createSuccessResponse('Driver assigned safely by dispatch engine', result));
};

export const startTransit = async (req: Request, res: Response) => {
  const result = await dispatchService.startTransit(req.user!.companyId, req.params.id as string);
  res.status(HTTP_STATUS.OK).json(createSuccessResponse('Transit started safely by dispatch engine', result));
};

export const completeDelivery = async (req: Request, res: Response) => {
  const result = await dispatchService.completeDelivery(req.user!.companyId, req.params.id as string);
  res.status(HTTP_STATUS.OK).json(createSuccessResponse('Delivery completed and driver released', result));
};

export const releaseDriver = async (req: Request, res: Response) => {
  const result = await dispatchService.releaseDriver(req.user!.companyId, req.params.id as string);
  res.status(HTTP_STATUS.OK).json(createSuccessResponse('Driver released', result));
};

export const cancelShipment = async (req: Request, res: Response) => {
  const result = await shipmentService.cancelShipment(req.user!.companyId, req.params.id as string);
  res.status(HTTP_STATUS.OK).json(createSuccessResponse('Shipment cancelled successfully', result));
};
