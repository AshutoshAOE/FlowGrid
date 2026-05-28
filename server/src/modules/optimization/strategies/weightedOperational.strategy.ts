import mongoose, { ClientSession } from 'mongoose';
import { Inventory } from '../../inventory/inventory.model';
import { Warehouse } from '../../warehouse/warehouse.model';
import { getAvailableDrivers } from '../../driver/driver.service';
import { calculateRoute, findNearestDriver } from '../../routing/routing.service';
import { AllocationResult, FactorScores } from '../types/optimization.types';
import { normalizeScores } from '../scoring/scoreNormalizer';
import { calculateWeightedScore } from '../scoring/scoreCalculator';

interface FeasibleWarehouse {
  warehouseId: mongoose.Types.ObjectId;
  coordinates: { lat: number, lng: number };
  available: number;
}

/**
 * Intelligent Multi-Factor Scoring Strategy.
 */
export const planWeightedOperationalAllocation = async (
  companyId: mongoose.Types.ObjectId,
  productId: mongoose.Types.ObjectId,
  requiredQuantity: number,
  destinationCoordinates: { lat: number, lng: number },
  session: ClientSession
): Promise<AllocationResult[]> => {
  
  // 1. Feasible Warehouse Filtering
  const inventoryRecords = await Inventory.find({ companyId, productId }).session(session);
  const feasibleWarehouses: FeasibleWarehouse[] = [];

  for (const record of inventoryRecords) {
    const available = record.quantity - record.reservedQuantity;
    if (available > 0) {
      const warehouse = await Warehouse.findById(record.warehouseId).session(session);
      if (warehouse && warehouse.coordinates && warehouse.coordinates.lat && warehouse.coordinates.lng) {
        feasibleWarehouses.push({
          warehouseId: record.warehouseId,
          coordinates: warehouse.coordinates,
          available
        });
      }
    }
  }

  if (feasibleWarehouses.length === 0) return [];

  // 2. Context Gathering (Drivers)
  const availableDrivers = await getAvailableDrivers(companyId);
  const driverCoordinates = availableDrivers
    .filter(d => d.currentCoordinates && d.currentCoordinates.lat && d.currentCoordinates.lng)
    .map(d => d.currentCoordinates!);

  // Arrays to hold raw factors in the same order as feasibleWarehouses
  const rawDistances: number[] = [];
  const rawEtas: number[] = [];
  const rawInventories: number[] = feasibleWarehouses.map(fw => fw.available);
  const rawDriverProximities: number[] = [];

  // 3. Routing Computations
  for (const fw of feasibleWarehouses) {
    try {
      // Distance and ETA to Destination
      const route = await calculateRoute(fw.coordinates, destinationCoordinates);
      rawDistances.push(route.distanceMeters);
      rawEtas.push(route.durationSeconds);
    } catch (error) {
      // Graceful fallback if routing fails
      rawDistances.push(Number.MAX_SAFE_INTEGER);
      rawEtas.push(Number.MAX_SAFE_INTEGER);
    }

    try {
      // Driver Proximity
      if (driverCoordinates.length > 0) {
        const nearestDriver = await findNearestDriver(fw.coordinates, driverCoordinates);
        rawDriverProximities.push(nearestDriver ? nearestDriver.distanceMeters : Number.MAX_SAFE_INTEGER);
      } else {
        // No drivers available, penalize heavily
        rawDriverProximities.push(Number.MAX_SAFE_INTEGER);
      }
    } catch (error) {
      rawDriverProximities.push(Number.MAX_SAFE_INTEGER);
    }
  }

  // 4. Normalization
  const normDistances = normalizeScores(rawDistances, true); // Inverse: closer is better
  const normEtas = normalizeScores(rawEtas, true);           // Inverse: faster is better
  const normInventories = normalizeScores(rawInventories, false); // Normal: more is better
  const normDriverProximities = normalizeScores(rawDriverProximities, true); // Inverse: closer is better

  // 5. Score Calculation
  const scoredWarehouses = feasibleWarehouses.map((fw, index) => {
    const factors: FactorScores = {
      rawDistanceMeters: rawDistances[index],
      normalizedDistanceScore: normDistances[index],
      rawEtaSeconds: rawEtas[index],
      normalizedEtaScore: normEtas[index],
      rawInventoryAvailable: rawInventories[index],
      normalizedInventoryScore: normInventories[index],
      rawDriverProximityMeters: rawDriverProximities[index],
      normalizedDriverProximityScore: normDriverProximities[index],
    };

    const finalScore = calculateWeightedScore(factors);

    return {
      warehouseId: fw.warehouseId,
      productId,
      available: fw.available,
      factors,
      finalScore
    };
  });

  // Sort descending by score
  scoredWarehouses.sort((a, b) => b.finalScore - a.finalScore);

  // 6. Greedy Allocation (Fulfilment)
  const allocations: AllocationResult[] = [];
  let remainingQuantity = requiredQuantity;

  for (const sw of scoredWarehouses) {
    if (remainingQuantity <= 0) break;

    const allocationAmount = Math.min(remainingQuantity, sw.available);
    
    allocations.push({
      warehouseId: sw.warehouseId,
      productId: sw.productId,
      quantity: allocationAmount,
      optimizationMetadata: {
        strategy: 'weighted-operational-v1',
        finalScore: sw.finalScore,
        factors: sw.factors
      }
    });

    remainingQuantity -= allocationAmount;
  }

  if (remainingQuantity > 0) {
    return []; // Could not fulfill entirely
  }

  return allocations;
};
