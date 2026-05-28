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
exports.cancelShipment = exports.completeDelivery = exports.startTransit = exports.assignDriver = exports.optimizeShipment = exports.getShipmentById = exports.getShipments = exports.createShipment = void 0;
const shipmentService = __importStar(require("./shipment.service"));
const response_1 = require("../../utils/response");
const httpStatus_1 = require("../../constants/httpStatus");
const createShipment = async (req, res) => {
    const result = await shipmentService.createShipment(req.user.companyId, req.body);
    res.status(httpStatus_1.HTTP_STATUS.CREATED).json((0, response_1.createSuccessResponse)('Shipment created successfully', result));
};
exports.createShipment = createShipment;
const getShipments = async (req, res) => {
    const result = await shipmentService.getShipments(req.user.companyId);
    res.status(httpStatus_1.HTTP_STATUS.OK).json((0, response_1.createSuccessResponse)('Shipments retrieved successfully', result));
};
exports.getShipments = getShipments;
const getShipmentById = async (req, res) => {
    const result = await shipmentService.getShipmentById(req.user.companyId, req.params.id);
    res.status(httpStatus_1.HTTP_STATUS.OK).json((0, response_1.createSuccessResponse)('Shipment retrieved successfully', result));
};
exports.getShipmentById = getShipmentById;
// --- WORKFLOW CONTROLLERS ---
const optimizationService = __importStar(require("../optimization/optimization.service"));
const optimizeShipment = async (req, res) => {
    const result = await optimizationService.runShipmentOptimization(req.user.companyId, req.params.id);
    res.status(httpStatus_1.HTTP_STATUS.OK).json((0, response_1.createSuccessResponse)('Shipment optimized successfully', result));
};
exports.optimizeShipment = optimizeShipment;
const assignDriver = async (req, res) => {
    const result = await shipmentService.assignDriver(req.user.companyId, req.params.id, req.body.driverId);
    res.status(httpStatus_1.HTTP_STATUS.OK).json((0, response_1.createSuccessResponse)('Driver assigned successfully', result));
};
exports.assignDriver = assignDriver;
const startTransit = async (req, res) => {
    const result = await shipmentService.startTransit(req.user.companyId, req.params.id);
    res.status(httpStatus_1.HTTP_STATUS.OK).json((0, response_1.createSuccessResponse)('Transit started successfully', result));
};
exports.startTransit = startTransit;
const completeDelivery = async (req, res) => {
    const result = await shipmentService.completeDelivery(req.user.companyId, req.params.id);
    res.status(httpStatus_1.HTTP_STATUS.OK).json((0, response_1.createSuccessResponse)('Delivery completed successfully', result));
};
exports.completeDelivery = completeDelivery;
const cancelShipment = async (req, res) => {
    const result = await shipmentService.cancelShipment(req.user.companyId, req.params.id);
    res.status(httpStatus_1.HTTP_STATUS.OK).json((0, response_1.createSuccessResponse)('Shipment cancelled successfully', result));
};
exports.cancelShipment = cancelShipment;
//# sourceMappingURL=shipment.controller.js.map