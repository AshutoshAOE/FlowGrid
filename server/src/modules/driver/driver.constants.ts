export const DRIVER_STATUSES = {
  AVAILABLE: 'AVAILABLE',
  ASSIGNED: 'ASSIGNED',
  IN_TRANSIT: 'IN_TRANSIT',
  OFFLINE: 'OFFLINE',
} as const;

export type DriverStatus = typeof DRIVER_STATUSES[keyof typeof DRIVER_STATUSES];
