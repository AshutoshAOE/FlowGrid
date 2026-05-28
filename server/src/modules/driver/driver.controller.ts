import { Request, Response } from 'express';
import * as driverService from './driver.service';
import { createSuccessResponse } from '../../utils/response';
import { HTTP_STATUS } from '../../constants/httpStatus';

export const createDriver = async (req: Request, res: Response) => {
  const result = await driverService.createDriver(req.user!.companyId, req.body);
  res.status(HTTP_STATUS.CREATED).json(createSuccessResponse('Driver created successfully', result));
};

export const getDrivers = async (req: Request, res: Response) => {
  const result = await driverService.getDrivers(req.user!.companyId);
  res.status(HTTP_STATUS.OK).json(createSuccessResponse('Drivers retrieved successfully', result));
};

export const getAvailableDrivers = async (req: Request, res: Response) => {
  const result = await driverService.getAvailableDrivers(req.user!.companyId);
  res.status(HTTP_STATUS.OK).json(createSuccessResponse('Available drivers retrieved successfully', result));
};

export const getDriverById = async (req: Request, res: Response) => {
  const result = await driverService.getDriverById(req.user!.companyId, req.params.id as string);
  res.status(HTTP_STATUS.OK).json(createSuccessResponse('Driver retrieved successfully', result));
};

export const updateDriver = async (req: Request, res: Response) => {
  const result = await driverService.updateDriver(req.user!.companyId, req.params.id as string, req.body);
  res.status(HTTP_STATUS.OK).json(createSuccessResponse('Driver updated successfully', result));
};

export const deleteDriver = async (req: Request, res: Response) => {
  await driverService.deleteDriver(req.user!.companyId, req.params.id as string);
  res.status(HTTP_STATUS.NO_CONTENT).send();
};
