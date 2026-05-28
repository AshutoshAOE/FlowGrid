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
exports.deductInventory = exports.releaseInventory = exports.reserveInventory = exports.adjustInventory = exports.getInventory = void 0;
const inventoryService = __importStar(require("./inventory.service"));
const response_1 = require("../../utils/response");
const httpStatus_1 = require("../../constants/httpStatus");
const getInventory = async (req, res) => {
    const warehouseId = req.query.warehouseId;
    const result = await inventoryService.getInventory(req.user.companyId, warehouseId);
    res.status(httpStatus_1.HTTP_STATUS.OK).json((0, response_1.createSuccessResponse)('Inventory retrieved successfully', result));
};
exports.getInventory = getInventory;
const adjustInventory = async (req, res) => {
    const { warehouseId, productId, quantityAdjustment } = req.body;
    const result = await inventoryService.adjustInventory(req.user.companyId, warehouseId, productId, quantityAdjustment);
    res.status(httpStatus_1.HTTP_STATUS.OK).json((0, response_1.createSuccessResponse)('Inventory adjusted successfully', result));
};
exports.adjustInventory = adjustInventory;
const reserveInventory = async (req, res) => {
    const { warehouseId, productId, quantity } = req.body;
    const result = await inventoryService.reserveInventory(req.user.companyId, warehouseId, productId, quantity);
    res.status(httpStatus_1.HTTP_STATUS.OK).json((0, response_1.createSuccessResponse)('Inventory reserved successfully', result));
};
exports.reserveInventory = reserveInventory;
const releaseInventory = async (req, res) => {
    const { warehouseId, productId, quantity } = req.body;
    const result = await inventoryService.releaseInventory(req.user.companyId, warehouseId, productId, quantity);
    res.status(httpStatus_1.HTTP_STATUS.OK).json((0, response_1.createSuccessResponse)('Inventory released successfully', result));
};
exports.releaseInventory = releaseInventory;
const deductInventory = async (req, res) => {
    const { warehouseId, productId, quantity } = req.body;
    const result = await inventoryService.deductInventory(req.user.companyId, warehouseId, productId, quantity);
    res.status(httpStatus_1.HTTP_STATUS.OK).json((0, response_1.createSuccessResponse)('Inventory deducted successfully', result));
};
exports.deductInventory = deductInventory;
//# sourceMappingURL=inventory.controller.js.map