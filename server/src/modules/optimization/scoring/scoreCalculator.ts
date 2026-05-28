import { FactorScores } from '../types/optimization.types';

export const OPTIMIZATION_WEIGHTS = {
  DISTANCE: 0.40,
  INVENTORY: 0.35,
  DRIVER_PROXIMITY: 0.15,
  ETA: 0.10,
};

/**
 * Calculates the final weighted score based on normalized factor scores.
 */
export const calculateWeightedScore = (factors: Partial<FactorScores>): number => {
  const distScore = factors.normalizedDistanceScore ?? 0;
  const invScore = factors.normalizedInventoryScore ?? 0;
  const driverScore = factors.normalizedDriverProximityScore ?? 0;
  const etaScore = factors.normalizedEtaScore ?? 0;

  const finalScore = 
    (distScore * OPTIMIZATION_WEIGHTS.DISTANCE) +
    (invScore * OPTIMIZATION_WEIGHTS.INVENTORY) +
    (driverScore * OPTIMIZATION_WEIGHTS.DRIVER_PROXIMITY) +
    (etaScore * OPTIMIZATION_WEIGHTS.ETA);

  return finalScore;
};
