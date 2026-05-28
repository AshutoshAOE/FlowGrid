import { IRoutingProvider, Coordinates, RouteResult } from './providers/IRoutingProvider';
import { ORSProvider } from './providers/ors.provider';

// Factory or DI instantiation
const routingProvider: IRoutingProvider = new ORSProvider();

export const calculateRoute = async (origin: Coordinates, destination: Coordinates): Promise<RouteResult> => {
  return await routingProvider.calculateRoute(origin, destination);
};

export const calculateETA = async (origin: Coordinates, destination: Coordinates) => {
  const route = await calculateRoute(origin, destination);
  return {
    distanceMeters: route.distanceMeters,
    durationSeconds: route.durationSeconds,
    etaMinutes: Math.ceil(route.durationSeconds / 60)
  };
};

/**
 * Given a destination and a list of warehouse coordinates, returns the closest warehouse by drive time.
 */
export const findNearestWarehouse = async (destination: Coordinates, warehouses: Coordinates[]) => {
  if (warehouses.length === 0) return null;
  
  const matrix = await routingProvider.calculateMatrix(warehouses, [destination]);
  
  let minDuration = Infinity;
  let nearestIndex = -1;

  warehouses.forEach((_, idx) => {
    // matrix.durations[originIndex][destIndex]
    const duration = matrix.durations[idx][0];
    if (duration !== null && duration < minDuration) {
      minDuration = duration;
      nearestIndex = idx;
    }
  });

  if (nearestIndex === -1) return null;

  return {
    warehouseIndex: nearestIndex,
    durationSeconds: minDuration,
    distanceMeters: matrix.distances[nearestIndex][0]
  };
};

/**
 * Given a shipment origin and a list of driver coordinates, returns the closest driver by drive time.
 */
export const findNearestDriver = async (origin: Coordinates, drivers: Coordinates[]) => {
  if (drivers.length === 0) return null;
  
  const matrix = await routingProvider.calculateMatrix(drivers, [origin]);
  
  let minDuration = Infinity;
  let nearestIndex = -1;

  drivers.forEach((_, idx) => {
    // matrix.durations[originIndex][destIndex]
    const duration = matrix.durations[idx][0];
    if (duration !== null && duration < minDuration) {
      minDuration = duration;
      nearestIndex = idx;
    }
  });

  if (nearestIndex === -1) return null;

  return {
    driverIndex: nearestIndex,
    durationSeconds: minDuration,
    distanceMeters: matrix.distances[nearestIndex][0]
  };
};

/**
 * Geocodes an address string to coordinates using the routing provider.
 */
export const geocodeAddress = async (address: string) => {
  return await routingProvider.geocode(address);
};

