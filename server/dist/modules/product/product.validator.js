"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProductSchema = exports.productSchema = void 0;
const zod_1 = require("zod");
exports.productSchema = zod_1.z.object({
    body: zod_1.z.object({
        SKU: zod_1.z.string().min(2, 'SKU must be at least 2 characters'),
        name: zod_1.z.string().min(2, 'Name is required'),
        category: zod_1.z.string().min(2, 'Category is required'),
        weight: zod_1.z.number().min(0).optional(),
        dimensions: zod_1.z.object({
            length: zod_1.z.number().min(0),
            width: zod_1.z.number().min(0),
            height: zod_1.z.number().min(0),
        }).optional(),
        isActive: zod_1.z.boolean().optional(),
    }),
});
exports.updateProductSchema = zod_1.z.object({
    body: exports.productSchema.shape.body.partial(),
});
//# sourceMappingURL=product.validator.js.map