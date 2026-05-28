import mongoose, { ClientSession } from 'mongoose';
import { Inventory } from '../../inventory/inventory.model';
import { AllocationResult } from '../types/optimization.types';

/**
 * Executes a Greedy Allocation Strategy based on Highest Available Inventory.
 * It will allocate the requested quantity across one or multiple warehouses.
 * (Legacy Baseline Strategy)
 */
export const planHighestAvailabilityAllocation = async (
  companyId: mongoose.Types.ObjectId,
  productId: mongoose.Types.ObjectId,
  requiredQuantity: number,
  session: ClientSession
): Promise<AllocationResult[]> => {
  
  const inventoryRecords = await Inventory.find({ companyId, productId }).session(session);
  
  const availableInventory = inventoryRecords
    .map(record => ({
      warehouseId: record.warehouseId,
      productId: record.productId,
      available: record.quantity - record.reservedQuantity
    }))
    .filter(record => record.available > 0)
    .sort((a, b) => b.available - a.available); // Highest first

  const allocations: AllocationResult[] = [];
  let remainingQuantity = requiredQuantity;

  for (const record of availableInventory) {
    if (remainingQuantity <= 0) break;

    const allocationAmount = Math.min(remainingQuantity, record.available);
    
    allocations.push({
      warehouseId: record.warehouseId,
      productId: record.productId,
      quantity: allocationAmount,
      optimizationMetadata: {
        strategy: 'inventory-first-v1',
        finalScore: 1.0,
        factors: {
          rawDistanceMeters: 0,
          normalizedDistanceScore: 0,
          rawEtaSeconds: 0,
          normalizedEtaScore: 0,
          rawInventoryAvailable: record.available,
          normalizedInventoryScore: 1.0,
          rawDriverProximityMeters: 0,
          normalizedDriverProximityScore: 0,
        }
      }
    });

    remainingQuantity -= allocationAmount;
  }

  if (remainingQuantity > 0) {
    return []; // Return empty array to signify failure to allocate fully
  }

  return allocations;
};
