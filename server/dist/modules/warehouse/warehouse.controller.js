"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteWarehouse = exports.updateWarehouse = exports.getWarehouseById = exports.getWarehouses = exports.createWarehouse = void 0;
const warehouseService = __importStar(require("./warehouse.service"));
const response_1 = require("../../utils/response");
const httpStatus_1 = require("../../constants/httpStatus");
const createWarehouse = async (req, res) => {
    const result = await warehouseService.createWarehouse(req.user.companyId, req.body);
    res.status(httpStatus_1.HTTP_STATUS.CREATED).json((0, response_1.createSuccessResponse)('Warehouse created successfully', result));
};
exports.createWarehouse = createWarehouse;
const getWarehouses = async (req, res) => {
    const result = await warehouseService.getWarehouses(req.user.companyId);
    res.status(httpStatus_1.HTTP_STATUS.OK).json((0, response_1.createSuccessResponse)('Warehouses retrieved successfully', result));
};
exports.getWarehouses = getWarehouses;
const getWarehouseById = async (req, res) => {
    const result = await warehouseService.getWarehouseById(req.user.companyId, req.params.id);
    res.status(httpStatus_1.HTTP_STATUS.OK).json((0, response_1.createSuccessResponse)('Warehouse retrieved successfully', result));
};
exports.getWarehouseById = getWarehouseById;
const updateWarehouse = async (req, res) => {
    const result = await warehouseService.updateWarehouse(req.user.companyId, req.params.id, req.body);
    res.status(httpStatus_1.HTTP_STATUS.OK).json((0, response_1.createSuccessResponse)('Warehouse updated successfully', result));
};
exports.updateWarehouse = updateWarehouse;
const deleteWarehouse = async (req, res) => {
    await warehouseService.deleteWarehouse(req.user.companyId, req.params.id);
    res.status(httpStatus_1.HTTP_STATUS.NO_CONTENT).send();
};
exports.deleteWarehouse = deleteWarehouse;
//# sourceMappingURL=warehouse.controller.js.map