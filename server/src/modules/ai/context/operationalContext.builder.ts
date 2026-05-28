import mongoose from 'mongoose';
import { OperationalContext } from '../types/ai.types';
import { getDashboardMetrics } from '../../dashboard/dashboard.service';
import { Inventory } from '../../inventory/inventory.model';

export const buildCompanyOperationalContext = async (companyId: mongoose.Types.ObjectId): Promise<OperationalContext> => {
  // We reuse the dashboard service because it already performs the necessary aggregations
  // efficiently across Shipments, Drivers, and Inventory.
  const metrics = await getDashboardMetrics(companyId);

  // Clean and sanitize the recent activity to prevent sending unnecessary PII 
  // or bloated documents to the AI model.
  const sanitizedRecentActivity = metrics.recentActivity.map((shipment: any) => ({
    id: shipment._id.toString(),
    status: shipment.status,
    destinationAddress: shipment.destination.address,
    updatedAt: shipment.updatedAt,
    hasAssignedDriver: !!shipment.assignedDriver
  }));

  // Fetch product-level inventory details
  const inventoryRecords = await Inventory.find({ companyId })
    .populate('productId', 'SKU name')
    .populate('warehouseId', 'name')
    .lean();

  const productDetails = inventoryRecords.map((record: any) => ({
    sku: record.productId?.SKU || 'UNKNOWN',
    productName: record.productId?.name || 'Unknown Product',
    warehouseName: record.warehouseId?.name || 'Unknown Warehouse',
    availableQuantity: record.quantity - record.reservedQuantity
  }));

  return {
    companyId: companyId.toString(),
    timestamp: new Date().toISOString(),
    metrics: {
      shipments: metrics.shipments,
      fleet: metrics.fleet,
      inventory: {
        ...metrics.inventory,
        productDetails
      }
    },
    recentActivity: sanitizedRecentActivity
  };
};
