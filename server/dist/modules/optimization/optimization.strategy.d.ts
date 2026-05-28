import mongoose, { ClientSession } from 'mongoose';
export interface AllocationResult {
    warehouseId: mongoose.Types.ObjectId;
    productId: mongoose.Types.ObjectId;
    quantity: number;
}
/**
 * Executes a Greedy Allocation Strategy based on Highest Available Inventory.
 * It will allocate the requested quantity across one or multiple warehouses.
 */
export declare const planHighestAvailabilityAllocation: (companyId: mongoose.Types.ObjectId, productId: mongoose.Types.ObjectId, requiredQuantity: number, session: ClientSession) => Promise<AllocationResult[]>;
//# sourceMappingURL=optimization.strategy.d.ts.map