import mongoose from 'mongoose';
/**
 * Orchestrates the full atomic workflow of optimizing a shipment.
 * 1. Plans allocation.
 * 2. Locks inventory atomically.
 * 3. Saves permanent snapshots.
 * 4. Transitions shipment FSM.
 */
export declare const runShipmentOptimization: (companyId: mongoose.Types.ObjectId, shipmentId: string) => Promise<mongoose.Document<unknown, {}, import("../shipment/shipment.model").IShipment, {}, mongoose.DefaultSchemaOptions> & import("../shipment/shipment.model").IShipment & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}>;
//# sourceMappingURL=optimization.service.d.ts.map