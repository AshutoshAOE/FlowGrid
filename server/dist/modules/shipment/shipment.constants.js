"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ALLOWED_TRANSITIONS = exports.SHIPMENT_STATUSES = void 0;
exports.SHIPMENT_STATUSES = {
    CREATED: 'created',
    OPTIMIZED: 'optimized',
    DRIVER_ASSIGNED: 'driver_assigned',
    IN_TRANSIT: 'in_transit',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled',
};
// The explicit allowed transitions for the Finite State Machine
exports.ALLOWED_TRANSITIONS = {
    [exports.SHIPMENT_STATUSES.CREATED]: [exports.SHIPMENT_STATUSES.OPTIMIZED, exports.SHIPMENT_STATUSES.CANCELLED],
    [exports.SHIPMENT_STATUSES.OPTIMIZED]: [exports.SHIPMENT_STATUSES.DRIVER_ASSIGNED, exports.SHIPMENT_STATUSES.CANCELLED],
    [exports.SHIPMENT_STATUSES.DRIVER_ASSIGNED]: [exports.SHIPMENT_STATUSES.IN_TRANSIT, exports.SHIPMENT_STATUSES.CANCELLED],
    [exports.SHIPMENT_STATUSES.IN_TRANSIT]: [exports.SHIPMENT_STATUSES.DELIVERED],
    [exports.SHIPMENT_STATUSES.DELIVERED]: [], // Terminal State
    [exports.SHIPMENT_STATUSES.CANCELLED]: [], // Terminal State
};
//# sourceMappingURL=shipment.constants.js.map