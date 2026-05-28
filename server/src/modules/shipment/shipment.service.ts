import mongoose, { ClientSession } from 'mongoose';
import { Shipment, IShipment } from './shipment.model';
import { Product } from '../product/product.model';
import { Driver } from '../driver/driver.model';
import { NotFoundError, ValidationError, ConflictError } from '../../utils/errors/AppError';
import { SHIPMENT_STATUSES } from './shipment.constants';
import { validateTransition } from './shipment.workflow';

export const createShipment = async (companyId: mongoose.Types.ObjectId, data: any) => {
  // Validate that all products exist within this company
  const productIds = data.shipmentItems.map((item: any) => item.productId);
  const products = await Product.find({ _id: { $in: productIds }, companyId });
  if (products.length !== productIds.length) {
    throw new ValidationError('One or more products do not exist or do not belong to your company');
  }

  // Explicitly set initial state
  return await Shipment.create({ ...data, companyId, status: SHIPMENT_STATUSES.CREATED });
};

export const getShipments = async (companyId: mongoose.Types.ObjectId) => {
  const shipments = await Shipment.find({ companyId })
    .populate('assignedDriver', 'fullName phone')
    .populate('shipmentItems.productId', 'name SKU')
    .sort({ createdAt: -1 })
    .lean();

  // Populate warehouse info in allocationSnapshots
  const { Warehouse } = await import('../warehouse/warehouse.model');
  for (const shipment of shipments) {
    if (shipment.allocationSnapshots && shipment.allocationSnapshots.length > 0) {
      for (const alloc of shipment.allocationSnapshots) {
        const wh = await Warehouse.findById(alloc.warehouseId).select('name coordinates').lean();
        if (wh) {
          alloc.warehouseName = wh.name;
          alloc.warehouseCoordinates = wh.coordinates;
        }
      }
    }
  }

  return shipments;
};

export const getShipmentById = async (companyId: mongoose.Types.ObjectId, id: string) => {
  const shipment = await Shipment.findOne({ _id: id, companyId })
    .populate('assignedDriver', 'fullName phone')
    .populate('shipmentItems.productId', 'name SKU');
  if (!shipment) throw new NotFoundError('Shipment not found');
  return shipment;
};

// --- WORKFLOW LIFECYCLE METHODS ---

export const optimizeShipment = async (companyId: mongoose.Types.ObjectId, id: string, session?: ClientSession) => {
  const shipment = await Shipment.findOne({ _id: id, companyId }).session(session || null);
  if (!shipment) throw new NotFoundError('Shipment not found');

  validateTransition(shipment.status, SHIPMENT_STATUSES.OPTIMIZED);

  // Future Orchestration Note: This is where we will inject `reserveInventory()`

  shipment.status = SHIPMENT_STATUSES.OPTIMIZED;
  return await shipment.save({ session });
};

export const assignDriver = async (companyId: mongoose.Types.ObjectId, id: string, driverId: string, session?: ClientSession) => {
  const shipment = await Shipment.findOne({ _id: id, companyId }).session(session || null);
  if (!shipment) throw new NotFoundError('Shipment not found');

  validateTransition(shipment.status, SHIPMENT_STATUSES.DRIVER_ASSIGNED);

  const driver = await Driver.findOne({ _id: driverId, companyId });
  if (!driver) throw new NotFoundError('Driver not found');

  // Future Dispatch Note: Update driver availability status here

  shipment.status = SHIPMENT_STATUSES.DRIVER_ASSIGNED;
  shipment.assignedDriver = new mongoose.Types.ObjectId(driverId);
  return await shipment.save({ session });
};

export const startTransit = async (companyId: mongoose.Types.ObjectId, id: string, session?: ClientSession) => {
  const shipment = await Shipment.findOne({ _id: id, companyId }).session(session || null);
  if (!shipment) throw new NotFoundError('Shipment not found');

  validateTransition(shipment.status, SHIPMENT_STATUSES.IN_TRANSIT);

  shipment.status = SHIPMENT_STATUSES.IN_TRANSIT;
  return await shipment.save({ session });
};

export const completeDelivery = async (companyId: mongoose.Types.ObjectId, id: string, session?: ClientSession) => {
  const shipment = await Shipment.findOne({ _id: id, companyId }).session(session || null);
  if (!shipment) throw new NotFoundError('Shipment not found');

  validateTransition(shipment.status, SHIPMENT_STATUSES.DELIVERED);

  // Future Orchestration Note: This is where we will inject `deductInventory()` and release the driver

  shipment.status = SHIPMENT_STATUSES.DELIVERED;
  return await shipment.save({ session });
};

export const cancelShipment = async (companyId: mongoose.Types.ObjectId, id: string, session?: ClientSession) => {
  const shipment = await Shipment.findOne({ _id: id, companyId }).session(session || null);
  if (!shipment) throw new NotFoundError('Shipment not found');

  validateTransition(shipment.status, SHIPMENT_STATUSES.CANCELLED);

  // Future Orchestration Note: This is where we will inject `releaseInventory()` if it was previously optimized

  shipment.status = SHIPMENT_STATUSES.CANCELLED;
  return await shipment.save({ session });
};
