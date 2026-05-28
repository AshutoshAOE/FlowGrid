import mongoose from 'mongoose';
import { Driver, IDriver } from './driver.model';
import { NotFoundError } from '../../utils/errors/AppError';

export const createDriver = async (companyId: mongoose.Types.ObjectId, data: Partial<IDriver>) => {
  return await Driver.create({ ...data, companyId });
};

export const getDrivers = async (companyId: mongoose.Types.ObjectId) => {
  return await Driver.find({ companyId }).sort({ createdAt: -1 });
};

import { DRIVER_STATUSES } from './driver.constants';

export const getAvailableDrivers = async (companyId: mongoose.Types.ObjectId) => {
  return await Driver.find({ 
    companyId, 
    status: DRIVER_STATUSES.AVAILABLE,
    isActive: true 
  }).sort({ createdAt: -1 });
};

export const getDriverById = async (companyId: mongoose.Types.ObjectId, id: string) => {
  const driver = await Driver.findOne({ _id: id, companyId });
  if (!driver) throw new NotFoundError('Driver not found');
  return driver;
};

export const updateDriver = async (companyId: mongoose.Types.ObjectId, id: string, data: Partial<IDriver>) => {
  const driver = await Driver.findOneAndUpdate(
    { _id: id, companyId },
    { $set: data },
    { new: true, runValidators: true }
  );
  if (!driver) throw new NotFoundError('Driver not found');
  return driver;
};

export const deleteDriver = async (companyId: mongoose.Types.ObjectId, id: string) => {
  const driver = await Driver.findOneAndDelete({ _id: id, companyId });
  if (!driver) throw new NotFoundError('Driver not found');
  return driver;
};
