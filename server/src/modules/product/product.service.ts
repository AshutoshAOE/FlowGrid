import mongoose from 'mongoose';
import { Product, IProduct } from './product.model';
import { NotFoundError, ConflictError } from '../../utils/errors/AppError';

export const createProduct = async (companyId: mongoose.Types.ObjectId, data: Partial<IProduct>) => {
  const existingProduct = await Product.findOne({ companyId, SKU: data.SKU });
  if (existingProduct) {
    throw new ConflictError('A product with this SKU already exists in your company');
  }
  return await Product.create({ ...data, companyId });
};

export const getProducts = async (companyId: mongoose.Types.ObjectId) => {
  return await Product.find({ companyId }).sort({ createdAt: -1 });
};

export const getProductById = async (companyId: mongoose.Types.ObjectId, id: string) => {
  const product = await Product.findOne({ _id: id, companyId });
  if (!product) throw new NotFoundError('Product not found');
  return product;
};

export const updateProduct = async (companyId: mongoose.Types.ObjectId, id: string, data: Partial<IProduct>) => {
  // If SKU is being updated, ensure it doesn't conflict
  if (data.SKU) {
    const existingProduct = await Product.findOne({ companyId, SKU: data.SKU, _id: { $ne: id } });
    if (existingProduct) {
      throw new ConflictError('A product with this SKU already exists');
    }
  }

  const product = await Product.findOneAndUpdate(
    { _id: id, companyId },
    { $set: data },
    { new: true, runValidators: true }
  );
  if (!product) throw new NotFoundError('Product not found');
  return product;
};

export const deleteProduct = async (companyId: mongoose.Types.ObjectId, id: string) => {
  const product = await Product.findOneAndDelete({ _id: id, companyId });
  if (!product) throw new NotFoundError('Product not found');
  return product;
};
