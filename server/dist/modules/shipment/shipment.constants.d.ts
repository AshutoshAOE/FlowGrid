export declare const SHIPMENT_STATUSES: {
    readonly CREATED: "created";
    readonly OPTIMIZED: "optimized";
    readonly DRIVER_ASSIGNED: "driver_assigned";
    readonly IN_TRANSIT: "in_transit";
    readonly DELIVERED: "delivered";
    readonly CANCELLED: "cancelled";
};
export type ShipmentStatus = typeof SHIPMENT_STATUSES[keyof typeof SHIPMENT_STATUSES];
export declare const ALLOWED_TRANSITIONS: Record<ShipmentStatus, ShipmentStatus[]>;
//# sourceMappingURL=shipment.constants.d.ts.map