"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateWarehouseSchema = exports.warehouseSchema = void 0;
const zod_1 = require("zod");
exports.warehouseSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(2, 'Name must be at least 2 characters'),
        address: zod_1.z.object({
            street: zod_1.z.string().min(1, 'Street is required'),
            city: zod_1.z.string().min(1, 'City is required'),
            state: zod_1.z.string().min(1, 'State is required'),
            zip: zod_1.z.string().min(1, 'ZIP is required'),
        }),
        coordinates: zod_1.z.object({
            lat: zod_1.z.number(),
            lng: zod_1.z.number(),
        }).optional(),
        storageCapacity: zod_1.z.number().min(0),
        isActive: zod_1.z.boolean().optional(),
    }),
});
exports.updateWarehouseSchema = zod_1.z.object({
    body: exports.warehouseSchema.shape.body.partial(),
});
//# sourceMappingURL=warehouse.validator.js.map