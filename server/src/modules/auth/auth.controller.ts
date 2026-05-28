import { Request, Response } from 'express';
import { registerCompanyAndAdmin, loginUser, getUserProfile } from './auth.service';
import { createSuccessResponse } from '../../utils/response';
import { HTTP_STATUS } from '../../constants/httpStatus';

export const register = async (req: Request, res: Response) => {
  const result = await registerCompanyAndAdmin(req.body);
  
  res.status(HTTP_STATUS.CREATED).json(
    createSuccessResponse('Company and Admin registered successfully', result)
  );
};

export const login = async (req: Request, res: Response) => {
  const result = await loginUser(req.body);

  res.status(HTTP_STATUS.OK).json(
    createSuccessResponse('Logged in successfully', result)
  );
};

export const getMe = async (req: Request, res: Response) => {
  // req.user is guaranteed to exist because of requireAuth middleware
  const user = await getUserProfile(req.user!.userId, req.user!.companyId);

  res.status(HTTP_STATUS.OK).json(
    createSuccessResponse('User profile retrieved successfully', { user })
  );
};
