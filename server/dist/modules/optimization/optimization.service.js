"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runShipmentOptimization = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const shipment_model_1 = require("../shipment/shipment.model");
const shipment_constants_1 = require("../shipment/shipment.constants");
const inventory_service_1 = require("../inventory/inventory.service");
const shipment_service_1 = require("../shipment/shipment.service");
const optimization_strategy_1 = require("./optimization.strategy");
const AppError_1 = require("../../utils/errors/AppError");
/**
 * Orchestrates the full atomic workflow of optimizing a shipment.
 * 1. Plans allocation.
 * 2. Locks inventory atomically.
 * 3. Saves permanent snapshots.
 * 4. Transitions shipment FSM.
 */
const runShipmentOptimization = async (companyId, shipmentId) => {
    const session = await mongoose_1.default.startSession();
    try {
        session.startTransaction();
        // 1. Fetch Shipment (Locked to this session)
        const shipment = await shipment_model_1.Shipment.findOne({ _id: shipmentId, companyId }).session(session);
        if (!shipment)
            throw new AppError_1.NotFoundError('Shipment not found');
        if (shipment.status !== shipment_constants_1.SHIPMENT_STATUSES.CREATED) {
            throw new AppError_1.ValidationError(`Optimization can only occur from the 'created' state. Current state: ${shipment.status}`);
        }
        const masterAllocationPlan = [];
        // 2. Plan Allocations for each item
        for (const item of shipment.shipmentItems) {
            const allocations = await (0, optimization_strategy_1.planHighestAvailabilityAllocation)(companyId, item.productId, item.quantity, session);
            if (allocations.length === 0) {
                throw new AppError_1.ConflictError(`Insufficient inventory available across all warehouses for product ${item.productId}`);
            }
            masterAllocationPlan.push(...allocations);
        }
        // 3. Atomically Reserve Inventory
        // We loop through the master plan and call the exact same inventory locking engine we built previously
        for (const allocation of masterAllocationPlan) {
            await (0, inventory_service_1.reserveInventory)(companyId, allocation.warehouseId.toString(), allocation.productId.toString(), allocation.quantity, session);
        }
        // 4. Persist Allocation Snapshots to the Shipment
        shipment.allocationSnapshots = masterAllocationPlan;
        await shipment.save({ session });
        // 5. Transition the Shipment FSM
        // We call the existing shipment service method, passing the session!
        const optimizedShipment = await (0, shipment_service_1.optimizeShipment)(companyId, shipmentId, session);
        // 6. Commit Orchestration
        await session.commitTransaction();
        return optimizedShipment;
    }
    catch (error) {
        // If ANY step fails (e.g. inventory locking conflict, or insufficient stock), everything rolls back
        await session.abortTransaction();
        throw error;
    }
    finally {
        session.endSession();
    }
};
exports.runShipmentOptimization = runShipmentOptimization;
//# sourceMappingURL=optimization.service.js.map