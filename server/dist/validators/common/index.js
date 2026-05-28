"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commonValidations = void 0;
const zod_1 = require("zod");
exports.commonValidations = {
    id: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID format'),
    pagination: zod_1.z.object({
        page: zod_1.z.string().regex(/^\d+$/).optional().transform(Number).default(1),
        limit: zod_1.z.string().regex(/^\d+$/).optional().transform(Number).default(10),
    }),
};
//# sourceMappingURL=index.js.map