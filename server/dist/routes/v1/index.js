"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const response_1 = require("../../utils/response");
const httpStatus_1 = require("../../constants/httpStatus");
const auth_routes_1 = __importDefault(require("../../modules/auth/auth.routes"));
const warehouse_routes_1 = __importDefault(require("../../modules/warehouse/warehouse.routes"));
const product_routes_1 = __importDefault(require("../../modules/product/product.routes"));
const inventory_routes_1 = __importDefault(require("../../modules/inventory/inventory.routes"));
const driver_routes_1 = __importDefault(require("../../modules/driver/driver.routes"));
const shipment_routes_1 = __importDefault(require("../../modules/shipment/shipment.routes"));
const router = (0, express_1.Router)();
// Health check endpoint for v1
router.get('/health', (req, res) => {
    res.status(httpStatus_1.HTTP_STATUS.OK).json((0, response_1.createSuccessResponse)('FlowGrid API v1 is running optimally', {
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
    }));
});
// Domain routes
router.use('/auth', auth_routes_1.default);
router.use('/warehouses', warehouse_routes_1.default);
router.use('/products', product_routes_1.default);
router.use('/inventory', inventory_routes_1.default);
router.use('/drivers', driver_routes_1.default);
router.use('/shipments', shipment_routes_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map