import mongoose from 'mongoose';

export interface FactorScores {
  rawDistanceMeters: number;
  normalizedDistanceScore: number;
  rawEtaSeconds: number;
  normalizedEtaScore: number;
  rawInventoryAvailable: number;
  normalizedInventoryScore: number;
  rawDriverProximityMeters: number;
  normalizedDriverProximityScore: number;
}

export interface OptimizationMetadata {
  strategy: string;
  finalScore: number;
  factors: FactorScores;
}

export interface AllocationResult {
  warehouseId: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;
  quantity: number;
  optimizationMetadata?: OptimizationMetadata;
}
