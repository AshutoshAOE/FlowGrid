"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDriverSchema = exports.driverSchema = void 0;
const zod_1 = require("zod");
exports.driverSchema = zod_1.z.object({
    body: zod_1.z.object({
        fullName: zod_1.z.string().min(2, 'Name must be at least 2 characters'),
        phone: zod_1.z.string().min(10, 'Phone must be at least 10 characters'),
        vehicleType: zod_1.z.string().min(2, 'Vehicle type is required'),
        vehicleCapacity: zod_1.z.number().min(0, 'Capacity cannot be negative'),
        availabilityStatus: zod_1.z.enum(['available', 'on_duty', 'off_duty']).optional(),
        currentCoordinates: zod_1.z.object({
            lat: zod_1.z.number(),
            lng: zod_1.z.number(),
        }).optional(),
        isActive: zod_1.z.boolean().optional(),
    }),
});
exports.updateDriverSchema = zod_1.z.object({
    body: exports.driverSchema.shape.body.partial(),
});
//# sourceMappingURL=driver.validator.js.map