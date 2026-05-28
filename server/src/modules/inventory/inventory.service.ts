import mongoose, { ClientSession } from 'mongoose';
import { Inventory, IInventory } from './inventory.model';
import { Warehouse } from '../warehouse/warehouse.model';
import { Product } from '../product/product.model';
import { NotFoundError, ConflictError, ValidationError } from '../../utils/errors/AppError';

// UTILITY: Deterministic availability calculation
export const getAvailableQuantity = (inventory: IInventory): number => {
  return inventory.quantity - inventory.reservedQuantity;
};

export const getInventory = async (companyId: mongoose.Types.ObjectId, warehouseId?: string) => {
  const query: any = { companyId };
  if (warehouseId) query.warehouseId = warehouseId;

  return await Inventory.find(query)
    .populate('warehouseId', 'name')
    .populate('productId', 'name SKU')
    .sort({ updatedAt: -1 });
};

// Instead of pure CRUD, Inventory focuses on operational adjustments
export const adjustInventory = async (
  companyId: mongoose.Types.ObjectId,
  warehouseId: string,
  productId: string,
  quantityAdjustment: number
) => {
  const warehouse = await Warehouse.findOne({ _id: warehouseId, companyId });
  if (!warehouse) throw new NotFoundError('Warehouse not found');

  const product = await Product.findOne({ _id: productId, companyId });
  if (!product) throw new NotFoundError('Product not found');

  const inventory = await Inventory.findOne({ companyId, warehouseId, productId });

  if (inventory) {
    if (inventory.quantity + quantityAdjustment < 0) {
      throw new ConflictError('Adjustment would result in negative inventory');
    }
    inventory.quantity += quantityAdjustment;
    return await inventory.save();
  } else {
    if (quantityAdjustment < 0) {
      throw new ConflictError('Cannot reduce non-existent inventory');
    }
    return await Inventory.create({
      companyId,
      warehouseId,
      productId,
      quantity: quantityAdjustment,
      reservedQuantity: 0,
    });
  }
};

// OPERATIONAL: Reserve Inventory (Atomic Lock)
export const reserveInventory = async (
  companyId: mongoose.Types.ObjectId,
  warehouseId: string,
  productId: string,
  quantityToReserve: number,
  session?: ClientSession
) => {
  const inventory = await Inventory.findOne({ companyId, warehouseId, productId }).session(session || null);
  if (!inventory) throw new NotFoundError('Inventory record not found');

  const available = getAvailableQuantity(inventory);
  if (available < quantityToReserve) {
    throw new ConflictError(`Insufficient available inventory. Requested: ${quantityToReserve}, Available: ${available}`);
  }

  // Atomically increment the reserved amount
  const updatedInventory = await Inventory.findOneAndUpdate(
    { _id: inventory._id, quantity: { $gte: inventory.reservedQuantity + quantityToReserve } },
    { $inc: { reservedQuantity: quantityToReserve } },
    { new: true, session: session || null }
  );

  if (!updatedInventory) {
    // If null, it means someone else snatched the inventory in between our find and update
    throw new ConflictError('Inventory reservation failed due to concurrent modification');
  }

  return updatedInventory;
};

// OPERATIONAL: Release Inventory (Atomic Unlock)
export const releaseInventory = async (
  companyId: mongoose.Types.ObjectId,
  warehouseId: string,
  productId: string,
  quantityToRelease: number,
  session?: ClientSession
) => {
  const inventory = await Inventory.findOne({ companyId, warehouseId, productId }).session(session || null);
  if (!inventory) throw new NotFoundError('Inventory record not found');

  if (inventory.reservedQuantity < quantityToRelease) {
    throw new ValidationError(`Cannot release more than what is reserved. Releasing: ${quantityToRelease}, Reserved: ${inventory.reservedQuantity}`);
  }

  // Atomically decrement the reserved amount
  return await Inventory.findOneAndUpdate(
    { _id: inventory._id, reservedQuantity: { $gte: quantityToRelease } },
    { $inc: { reservedQuantity: -quantityToRelease } },
    { new: true, session: session || null }
  );
};

// OPERATIONAL: Deduct Inventory (Atomic Consumption)
export const deductInventory = async (
  companyId: mongoose.Types.ObjectId,
  warehouseId: string,
  productId: string,
  quantityToDeduct: number,
  session?: ClientSession
) => {
  const inventory = await Inventory.findOne({ companyId, warehouseId, productId }).session(session || null);
  if (!inventory) throw new NotFoundError('Inventory record not found');

  // We assume deductions come out of reserved stock during a fulfillment flow.
  if (inventory.reservedQuantity < quantityToDeduct) {
    throw new ValidationError(`Cannot deduct more than reserved quantity. Deducting: ${quantityToDeduct}, Reserved: ${inventory.reservedQuantity}`);
  }

  if (inventory.quantity < quantityToDeduct) {
    throw new ConflictError('Critical data inconsistency: Total quantity is less than deduction amount');
  }

  // Atomically decrement BOTH quantity and reservedQuantity
  return await Inventory.findOneAndUpdate(
    { _id: inventory._id, reservedQuantity: { $gte: quantityToDeduct }, quantity: { $gte: quantityToDeduct } },
    { $inc: { quantity: -quantityToDeduct, reservedQuantity: -quantityToDeduct } },
    { new: true, session: session || null }
  );
};
