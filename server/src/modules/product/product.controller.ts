import { Request, Response } from 'express';
import * as productService from './product.service';
import { createSuccessResponse } from '../../utils/response';
import { HTTP_STATUS } from '../../constants/httpStatus';

export const createProduct = async (req: Request, res: Response) => {
  const result = await productService.createProduct(req.user!.companyId, req.body);
  res.status(HTTP_STATUS.CREATED).json(createSuccessResponse('Product created successfully', result));
};

export const getProducts = async (req: Request, res: Response) => {
  const result = await productService.getProducts(req.user!.companyId);
  res.status(HTTP_STATUS.OK).json(createSuccessResponse('Products retrieved successfully', result));
};

export const getProductById = async (req: Request, res: Response) => {
  const result = await productService.getProductById(req.user!.companyId, req.params.id as string);
  res.status(HTTP_STATUS.OK).json(createSuccessResponse('Product retrieved successfully', result));
};

export const updateProduct = async (req: Request, res: Response) => {
  const result = await productService.updateProduct(req.user!.companyId, req.params.id as string, req.body);
  res.status(HTTP_STATUS.OK).json(createSuccessResponse('Product updated successfully', result));
};

export const deleteProduct = async (req: Request, res: Response) => {
  await productService.deleteProduct(req.user!.companyId, req.params.id as string);
  res.status(HTTP_STATUS.NO_CONTENT).send();
};
