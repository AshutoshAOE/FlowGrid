import mongoose from 'mongoose';
import { Shipment } from '../shipment/shipment.model';
import { Driver } from '../driver/driver.model';
import { Product } from '../product/product.model';
import { DRIVER_STATUSES } from '../driver/driver.constants';
import { SHIPMENT_STATUSES } from '../shipment/shipment.constants';
import { NotFoundError, ConflictError, ValidationError } from '../../utils/errors/AppError';
import { runWithTransaction } from '../../utils/transaction';
import * as shipmentFSM from '../shipment/shipment.service';

/**
 * Validates driver capacity against shipment items
 */
const validateDriverCapacity = async (companyId: mongoose.Types.ObjectId, shipment: any, driverId: string, session: any) => {
  const driver = await Driver.findOne({ _id: driverId, companyId }).session(session);
  
  if (!driver) throw new NotFoundError('Driver not found');
  if (!driver.isActive) throw new ValidationError('Driver is inactive');
  if (driver.status !== DRIVER_STATUSES.AVAILABLE) {
    throw new ConflictError(`Driver is currently ${driver.status}, cannot be assigned.`);
  }

  // Calculate shipment load
  let totalLoad = 0;
  for (const item of shipment.shipmentItems) {
    const product = await Product.findById(item.productId).session(session);
    if (!product) throw new NotFoundError(`Product ${item.productId} not found during capacity check`);
    
    const weightPerUnit = product.weight || 1; 
    totalLoad += (item.quantity * weightPerUnit);
  }

  if (totalLoad > driver.vehicleCapacity) {
    throw new ConflictError(`Shipment load (${totalLoad}) exceeds driver vehicle capacity (${driver.vehicleCapacity}).`);
  }

  return driver;
};

/**
 * Orchestrates Assigning a Driver to a Shipment
 */
export const assignDriver = async (companyId: mongoose.Types.ObjectId, shipmentId: string, driverId: string) => {
  return await runWithTransaction(async (session) => {
    const shipment = await Shipment.findOne({ _id: shipmentId, companyId }).session(session || null);
    if (!shipment) throw new NotFoundError('Shipment not found');

    if (shipment.status !== SHIPMENT_STATUSES.OPTIMIZED) {
      throw new ValidationError(`Only OPTIMIZED shipments can be assigned a driver. Current: ${shipment.status}`);
    }

    const driver = await validateDriverCapacity(companyId, shipment, driverId, session || null);

    // 1. Advance Shipment FSM safely
    await shipmentFSM.assignDriver(companyId, shipmentId, driverId, session);

    // 2. Update Driver state
    driver.status = DRIVER_STATUSES.ASSIGNED;
    await driver.save({ session: session || undefined });

    return { shipment, driver };
  });
};

/**
 * Orchestrates Starting Transit
 */
export const startTransit = async (companyId: mongoose.Types.ObjectId, shipmentId: string) => {
  return await runWithTransaction(async (session) => {
    const shipment = await Shipment.findOne({ _id: shipmentId, companyId }).session(session || null);
    if (!shipment) throw new NotFoundError('Shipment not found');
    
    if (!shipment.assignedDriver) {
      throw new ValidationError('Shipment has no driver assigned.');
    }

    const driver = await Driver.findOne({ _id: shipment.assignedDriver, companyId }).session(session || null);
    if (!driver) throw new NotFoundError('Assigned driver not found');

    // 1. Advance Shipment FSM safely
    const updatedShipment = await shipmentFSM.startTransit(companyId, shipmentId, session);

    // 2. Update Driver state
    driver.status = DRIVER_STATUSES.IN_TRANSIT;
    await driver.save({ session: session || undefined });

    return { shipment: updatedShipment, driver };
  });
};

/**
 * Orchestrates Completing Delivery
 */
export const completeDelivery = async (companyId: mongoose.Types.ObjectId, shipmentId: string) => {
  return await runWithTransaction(async (session) => {
    const shipment = await Shipment.findOne({ _id: shipmentId, companyId }).session(session || null);
    if (!shipment) throw new NotFoundError('Shipment not found');
    
    const driverId = shipment.assignedDriver;

    // 1. Advance Shipment FSM safely
    const updatedShipment = await shipmentFSM.completeDelivery(companyId, shipmentId, session);

    // 2. Permanently Deduct Inventory
    // We import deductInventory here to avoid circular dependency or just import at top.
    const { deductInventory } = await import('../inventory/inventory.service');
    if (shipment.allocationSnapshots && shipment.allocationSnapshots.length > 0) {
      for (const alloc of shipment.allocationSnapshots) {
        await deductInventory(
          companyId,
          alloc.warehouseId.toString(),
          alloc.productId.toString(),
          alloc.quantity,
          session
        );
      }
    }

    // 3. Update Driver state back to AVAILABLE if there was a driver
    if (driverId) {
      const driver = await Driver.findOne({ _id: driverId, companyId }).session(session || null);
      if (driver) {
        driver.status = DRIVER_STATUSES.AVAILABLE;
        await driver.save({ session: session || undefined });
      }
    }

    return updatedShipment;
  });
};

/**
 * Unassigns a Driver (cancels dispatch)
 */
export const releaseDriver = async (companyId: mongoose.Types.ObjectId, shipmentId: string) => {
  return await runWithTransaction(async (session) => {
    const shipment = await Shipment.findOne({ _id: shipmentId, companyId }).session(session || null);
    if (!shipment) throw new NotFoundError('Shipment not found');

    if (shipment.status !== SHIPMENT_STATUSES.DRIVER_ASSIGNED) {
      throw new ValidationError('Only DRIVER_ASSIGNED shipments can release their driver');
    }

    const driverId = shipment.assignedDriver;
    
    // Manually push shipment state back to OPTIMIZED
    // (We bypass the strict FSM since releasing a driver is a reverse edge, or we can add it to FSM)
    shipment.status = SHIPMENT_STATUSES.OPTIMIZED;
    shipment.assignedDriver = undefined;
    await shipment.save({ session: session || undefined });

    // Update Driver state
    if (driverId) {
      const driver = await Driver.findOne({ _id: driverId, companyId }).session(session || null);
      if (driver) {
        driver.status = DRIVER_STATUSES.AVAILABLE;
        await driver.save({ session: session || undefined });
      }
    }

    return shipment;
  });
};
