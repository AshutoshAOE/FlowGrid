import mongoose from 'mongoose';
import { Shipment } from '../shipment/shipment.model';
import { SHIPMENT_STATUSES } from '../shipment/shipment.constants';
import { reserveInventory } from '../inventory/inventory.service';
import { optimizeShipment as setShipmentOptimized } from '../shipment/shipment.service';
import { planWeightedOperationalAllocation } from './strategies/weightedOperational.strategy';
import { AllocationResult } from './types/optimization.types';
import { NotFoundError, ConflictError, ValidationError } from '../../utils/errors/AppError';

import { runWithTransaction } from '../../utils/transaction';

/**
 * Orchestrates the full atomic workflow of optimizing a shipment.
 * 1. Plans allocation using weighted operational scoring.
 * 2. Locks inventory atomically.
 * 3. Saves permanent snapshots.
 * 4. Transitions shipment FSM.
 */
export const runShipmentOptimization = async (companyId: mongoose.Types.ObjectId, shipmentId: string) => {
  return await runWithTransaction(async (session) => {
    // 1. Fetch Shipment (Locked to this session)
    const shipment = await Shipment.findOne({ _id: shipmentId, companyId }).session(session || null);
    if (!shipment) throw new NotFoundError('Shipment not found');

    if (shipment.status !== SHIPMENT_STATUSES.CREATED) {
      throw new ValidationError(`Optimization can only occur from the 'created' state. Current state: ${shipment.status}`);
    }

    if (!shipment.destination.coordinates) {
      throw new ValidationError('Shipment destination must be geocoded before optimization');
    }

    const masterAllocationPlan: AllocationResult[] = [];

    // 2. Plan Allocations for each item
    for (const item of shipment.shipmentItems) {
      const allocations = await planWeightedOperationalAllocation(
        companyId, 
        item.productId, 
        item.quantity, 
        shipment.destination.coordinates,
        session as mongoose.ClientSession
      );
      
      if (allocations.length === 0) {
        throw new ConflictError(`Insufficient inventory available across all warehouses for product ${item.productId}`);
      }

      masterAllocationPlan.push(...allocations);
    }

    // 3. Atomically Reserve Inventory
    for (const allocation of masterAllocationPlan) {
      await reserveInventory(
        companyId,
        allocation.warehouseId.toString(),
        allocation.productId.toString(),
        allocation.quantity,
        session as mongoose.ClientSession
      );
    }

    // 4. Persist Allocation Snapshots to the Shipment
    shipment.allocationSnapshots = masterAllocationPlan;
    await shipment.save({ session });

    // 5. Transition the Shipment FSM
    const optimizedShipment = await setShipmentOptimized(companyId, shipmentId, session as mongoose.ClientSession);

    return optimizedShipment;
  });
};

