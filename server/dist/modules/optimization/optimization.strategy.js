"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.planHighestAvailabilityAllocation = void 0;
const inventory_model_1 = require("../inventory/inventory.model");
/**
 * Executes a Greedy Allocation Strategy based on Highest Available Inventory.
 * It will allocate the requested quantity across one or multiple warehouses.
 */
const planHighestAvailabilityAllocation = async (companyId, productId, requiredQuantity, session) => {
    // Find all inventory records for this product in this company, sorting by highest available
    // Because we cannot sort dynamically by (quantity - reservedQuantity) in a simple Mongoose query
    // without an aggregation pipeline, we will fetch all records and sort them in memory.
    // In a massive scale system, this would be an aggregation pipeline.
    const inventoryRecords = await inventory_model_1.Inventory.find({ companyId, productId }).session(session);
    const availableInventory = inventoryRecords
        .map(record => ({
        warehouseId: record.warehouseId,
        productId: record.productId,
        available: record.quantity - record.reservedQuantity
    }))
        .filter(record => record.available > 0)
        .sort((a, b) => b.available - a.available); // Highest first
    const allocations = [];
    let remainingQuantity = requiredQuantity;
    for (const record of availableInventory) {
        if (remainingQuantity <= 0)
            break;
        const allocationAmount = Math.min(remainingQuantity, record.available);
        allocations.push({
            warehouseId: record.warehouseId,
            productId: record.productId,
            quantity: allocationAmount
        });
        remainingQuantity -= allocationAmount;
    }
    // If we couldn't fulfill the entire requirement
    if (remainingQuantity > 0) {
        return []; // Return empty array to signify failure to allocate fully
    }
    return allocations;
};
exports.planHighestAvailabilityAllocation = planHighestAvailabilityAllocation;
//# sourceMappingURL=optimization.strategy.js.map