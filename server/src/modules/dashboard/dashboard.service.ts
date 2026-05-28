import mongoose from 'mongoose';
import { Shipment } from '../shipment/shipment.model';
import { Driver } from '../driver/driver.model';
import { Inventory } from '../inventory/inventory.model';

export const getDashboardMetrics = async (companyId: mongoose.Types.ObjectId) => {
  // 1. Shipment Workflow Distribution
  const shipmentAggregation = await Shipment.aggregate([
    { $match: { companyId } },
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ]);
  
  const shipmentDistribution = {
    created: 0,
    optimized: 0,
    driver_assigned: 0,
    in_transit: 0,
    delivered: 0,
    cancelled: 0
  };
  
  let activeShipments = 0;
  shipmentAggregation.forEach((item) => {
    if (item._id in shipmentDistribution) {
      shipmentDistribution[item._id as keyof typeof shipmentDistribution] = item.count;
      if (item._id !== 'delivered' && item._id !== 'cancelled') {
        activeShipments += item.count;
      }
    }
  });

  // 2. Driver Fleet Availability
  const driverAggregation = await Driver.aggregate([
    { $match: { companyId, isActive: true } },
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ]);

  const fleetDistribution = {
    AVAILABLE: 0,
    ASSIGNED: 0,
    IN_TRANSIT: 0,
    OFFLINE: 0
  };

  driverAggregation.forEach((item) => {
    if (item._id in fleetDistribution) {
      fleetDistribution[item._id as keyof typeof fleetDistribution] = item.count;
    }
  });

  // 3. Inventory Operational Pressure
  const inventoryAggregation = await Inventory.aggregate([
    { $match: { companyId } },
    { $group: { 
      _id: null, 
      totalQuantity: { $sum: '$quantity' }, 
      totalReserved: { $sum: '$reservedQuantity' } 
    }}
  ]);

  const inventoryStats = inventoryAggregation.length > 0 ? {
    totalQuantity: inventoryAggregation[0].totalQuantity,
    totalReserved: inventoryAggregation[0].totalReserved,
    pressurePercent: inventoryAggregation[0].totalQuantity > 0 
      ? Math.round((inventoryAggregation[0].totalReserved / inventoryAggregation[0].totalQuantity) * 100)
      : 0
  } : {
    totalQuantity: 0,
    totalReserved: 0,
    pressurePercent: 0
  };

  // 4. Recent Active Shipments (e.g., top 5 non-delivered)
  const recentShipments = await Shipment.find({
    companyId,
    status: { $nin: ['delivered', 'cancelled'] }
  })
  .sort({ updatedAt: -1 })
  .limit(5)
  .populate('assignedDriver', 'fullName')
  .lean();

  return {
    shipments: {
      activeCount: activeShipments,
      distribution: shipmentDistribution
    },
    fleet: {
      totalActive: fleetDistribution.AVAILABLE + fleetDistribution.ASSIGNED + fleetDistribution.IN_TRANSIT,
      distribution: fleetDistribution
    },
    inventory: inventoryStats,
    recentActivity: recentShipments
  };
};
