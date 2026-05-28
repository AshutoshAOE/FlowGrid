import mongoose from 'mongoose';
import { Warehouse, IWarehouse } from './warehouse.model';
import { NotFoundError } from '../../utils/errors/AppError';

export const createWarehouse = async (companyId: mongoose.Types.ObjectId, data: Partial<IWarehouse>) => {
  // Auto-geocode the warehouse address if no coordinates provided
  if (!data.coordinates?.lat || !data.coordinates?.lng) {
    try {
      const { geocodeAddress } = await import('../routing/routing.service');
      const address = data.address;
      if (address) {
        const fullAddress = `${address.street}, ${address.city}, ${address.state}, ${address.zip}`;
        const result = await geocodeAddress(fullAddress);
        if (result) {
          data.coordinates = { lat: result.lat, lng: result.lng };
        }
      }
    } catch (err) {
      console.warn('Auto-geocoding warehouse address failed, continuing without coordinates', err);
    }
  }
  return await Warehouse.create({ ...data, companyId });
};

export const getWarehouses = async (companyId: mongoose.Types.ObjectId) => {
  return await Warehouse.find({ companyId }).sort({ createdAt: -1 });
};

export const getWarehouseById = async (companyId: mongoose.Types.ObjectId, id: string) => {
  const warehouse = await Warehouse.findOne({ _id: id, companyId });
  if (!warehouse) throw new NotFoundError('Warehouse not found');
  return warehouse;
};

export const updateWarehouse = async (companyId: mongoose.Types.ObjectId, id: string, data: Partial<IWarehouse>) => {
  const warehouse = await Warehouse.findOneAndUpdate(
    { _id: id, companyId },
    { $set: data },
    { new: true, runValidators: true }
  );
  if (!warehouse) throw new NotFoundError('Warehouse not found');
  return warehouse;
};

export const deleteWarehouse = async (companyId: mongoose.Types.ObjectId, id: string) => {
  const warehouse = await Warehouse.findOneAndDelete({ _id: id, companyId });
  if (!warehouse) throw new NotFoundError('Warehouse not found');
  return warehouse;
};
