"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.operationalInventorySchema = exports.updateInventorySchema = void 0;
const zod_1 = require("zod");
exports.updateInventorySchema = zod_1.z.object({
    body: zod_1.z.object({
        warehouseId: zod_1.z.string().min(1, 'Warehouse ID is required'),
        productId: zod_1.z.string().min(1, 'Product ID is required'),
        quantityAdjustment: zod_1.z.number(), // Can be positive or negative
    }),
});
exports.operationalInventorySchema = zod_1.z.object({
    body: zod_1.z.object({
        warehouseId: zod_1.z.string().min(1, 'Warehouse ID is required'),
        productId: zod_1.z.string().min(1, 'Product ID is required'),
        quantity: zod_1.z.number().int().positive('Quantity must be a positive integer'),
    }),
});
//# sourceMappingURL=inventory.validator.js.map