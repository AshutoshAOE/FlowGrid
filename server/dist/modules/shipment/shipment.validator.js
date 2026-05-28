"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assignDriverSchema = exports.shipmentSchema = void 0;
const zod_1 = require("zod");
exports.shipmentSchema = zod_1.z.object({
    body: zod_1.z.object({
        destination: zod_1.z.object({
            address: zod_1.z.string().min(5, 'Address must be at least 5 characters'),
            coordinates: zod_1.z.object({
                lat: zod_1.z.number(),
                lng: zod_1.z.number(),
            }).optional(),
        }),
        shipmentItems: zod_1.z.array(zod_1.z.object({
            productId: zod_1.z.string().min(1, 'Product ID is required'),
            quantity: zod_1.z.number().min(1, 'Quantity must be at least 1'),
        })).min(1, 'At least one item is required'),
    }),
});
// Explicit validation schemas for workflow transitions
exports.assignDriverSchema = zod_1.z.object({
    body: zod_1.z.object({
        driverId: zod_1.z.string().min(1, 'Driver ID is required'),
    }),
});
//# sourceMappingURL=shipment.validator.js.map