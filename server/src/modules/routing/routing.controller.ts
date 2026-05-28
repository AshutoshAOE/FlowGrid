import { Request, Response } from 'express';
import * as routingService from './routing.service';
import { createSuccessResponse } from '../../utils/response';
import { HTTP_STATUS } from '../../constants/httpStatus';

export const calculateRoute = async (req: Request, res: Response) => {
  const { origin, destination } = req.body;
  const result = await routingService.calculateRoute(origin, destination);
  res.status(HTTP_STATUS.OK).json(createSuccessResponse('Route calculated successfully', result));
};

export const calculateETA = async (req: Request, res: Response) => {
  const { origin, destination } = req.body;
  const result = await routingService.calculateETA(origin, destination);
  res.status(HTTP_STATUS.OK).json(createSuccessResponse('ETA calculated successfully', result));
};

export const geocode = async (req: Request, res: Response) => {
  const { address } = req.body;
  const result = await routingService.geocodeAddress(address);
  if (!result) {
    res.status(HTTP_STATUS.OK).json(createSuccessResponse('No results found for address', null));
    return;
  }
  res.status(HTTP_STATUS.OK).json(createSuccessResponse('Address geocoded successfully', result));
};
