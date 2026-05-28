import { Request, Response } from 'express';
import { generateOperationalSummary } from './services/operationalInsights.service';
import { processNaturalLanguageQuery } from './services/naturalLanguageQuery.service';
import { createSuccessResponse } from '../../utils/response';
import { HTTP_STATUS } from '../../constants/httpStatus';

export const getOperationalInsights = async (req: Request, res: Response) => {
  const result = await generateOperationalSummary(req.user!.companyId);
  res.status(HTTP_STATUS.OK).json(
    createSuccessResponse('Operational insights generated successfully', result)
  );
};

export const queryOperations = async (req: Request, res: Response) => {
  const { query } = req.body;
  const result = await processNaturalLanguageQuery(req.user!.companyId, query);
  res.status(HTTP_STATUS.OK).json(
    createSuccessResponse('Query processed successfully', result)
  );
};

// Placeholders for other specific insight endpoints
export const getInventoryInsights = async (req: Request, res: Response) => {
  // In a full implementation, this would call a dedicated inventoryInsights.service.ts
  const result = await generateOperationalSummary(req.user!.companyId);
  res.status(HTTP_STATUS.OK).json(
    createSuccessResponse('Inventory insights generated successfully', result)
  );
};

export const getDispatchInsights = async (req: Request, res: Response) => {
  // In a full implementation, this would call a dedicated dispatchInsights.service.ts
  const result = await generateOperationalSummary(req.user!.companyId);
  res.status(HTTP_STATUS.OK).json(
    createSuccessResponse('Dispatch insights generated successfully', result)
  );
};
