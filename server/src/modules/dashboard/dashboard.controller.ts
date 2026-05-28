import { Request, Response } from 'express';
import * as dashboardService from './dashboard.service';
import { createSuccessResponse } from '../../utils/response';
import { HTTP_STATUS } from '../../constants/httpStatus';

export const getMetrics = async (req: Request, res: Response) => {
  const result = await dashboardService.getDashboardMetrics(req.user!.companyId);
  res.status(HTTP_STATUS.OK).json(createSuccessResponse('Dashboard metrics retrieved successfully', result));
};
