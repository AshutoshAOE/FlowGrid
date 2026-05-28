"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelShipment = exports.completeDelivery = exports.startTransit = exports.assignDriver = exports.optimizeShipment = exports.getShipmentById = exports.getShipments = exports.createShipment = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const shipment_model_1 = require("./shipment.model");
const product_model_1 = require("../product/product.model");
const driver_model_1 = require("../driver/driver.model");
const AppError_1 = require("../../utils/errors/AppError");
const shipment_constants_1 = require("./shipment.constants");
const shipment_workflow_1 = require("./shipment.workflow");
const createShipment = async (companyId, data) => {
    // Validate that all products exist within this company
    const productIds = data.shipmentItems.map((item) => item.productId);
    const products = await product_model_1.Product.find({ _id: { $in: productIds }, companyId });
    if (products.length !== productIds.length) {
        throw new AppError_1.ValidationError('One or more products do not exist or do not belong to your company');
    }
    // Explicitly set initial state
    return await shipment_model_1.Shipment.create({ ...data, companyId, status: shipment_constants_1.SHIPMENT_STATUSES.CREATED });
};
exports.createShipment = createShipment;
const getShipments = async (companyId) => {
    return await shipment_model_1.Shipment.find({ companyId })
        .populate('assignedDriver', 'fullName phone')
        .populate('shipmentItems.productId', 'name SKU')
        .sort({ createdAt: -1 });
};
exports.getShipments = getShipments;
const getShipmentById = async (companyId, id) => {
    const shipment = await shipment_model_1.Shipment.findOne({ _id: id, companyId })
        .populate('assignedDriver', 'fullName phone')
        .populate('shipmentItems.productId', 'name SKU');
    if (!shipment)
        throw new AppError_1.NotFoundError('Shipment not found');
    return shipment;
};
exports.getShipmentById = getShipmentById;
// --- WORKFLOW LIFECYCLE METHODS ---
const optimizeShipment = async (companyId, id, session) => {
    const shipment = await shipment_model_1.Shipment.findOne({ _id: id, companyId }).session(session || null);
    if (!shipment)
        throw new AppError_1.NotFoundError('Shipment not found');
    (0, shipment_workflow_1.validateTransition)(shipment.status, shipment_constants_1.SHIPMENT_STATUSES.OPTIMIZED);
    // Future Orchestration Note: This is where we will inject `reserveInventory()`
    shipment.status = shipment_constants_1.SHIPMENT_STATUSES.OPTIMIZED;
    return await shipment.save({ session });
};
exports.optimizeShipment = optimizeShipment;
const assignDriver = async (companyId, id, driverId, session) => {
    const shipment = await shipment_model_1.Shipment.findOne({ _id: id, companyId }).session(session || null);
    if (!shipment)
        throw new AppError_1.NotFoundError('Shipment not found');
    (0, shipment_workflow_1.validateTransition)(shipment.status, shipment_constants_1.SHIPMENT_STATUSES.DRIVER_ASSIGNED);
    const driver = await driver_model_1.Driver.findOne({ _id: driverId, companyId });
    if (!driver)
        throw new AppError_1.NotFoundError('Driver not found');
    // Future Dispatch Note: Update driver availability status here
    shipment.status = shipment_constants_1.SHIPMENT_STATUSES.DRIVER_ASSIGNED;
    shipment.assignedDriver = new mongoose_1.default.Types.ObjectId(driverId);
    return await shipment.save({ session });
};
exports.assignDriver = assignDriver;
const startTransit = async (companyId, id, session) => {
    const shipment = await shipment_model_1.Shipment.findOne({ _id: id, companyId }).session(session || null);
    if (!shipment)
        throw new AppError_1.NotFoundError('Shipment not found');
    (0, shipment_workflow_1.validateTransition)(shipment.status, shipment_constants_1.SHIPMENT_STATUSES.IN_TRANSIT);
    shipment.status = shipment_constants_1.SHIPMENT_STATUSES.IN_TRANSIT;
    return await shipment.save({ session });
};
exports.startTransit = startTransit;
const completeDelivery = async (companyId, id, session) => {
    const shipment = await shipment_model_1.Shipment.findOne({ _id: id, companyId }).session(session || null);
    if (!shipment)
        throw new AppError_1.NotFoundError('Shipment not found');
    (0, shipment_workflow_1.validateTransition)(shipment.status, shipment_constants_1.SHIPMENT_STATUSES.DELIVERED);
    // Future Orchestration Note: This is where we will inject `deductInventory()` and release the driver
    shipment.status = shipment_constants_1.SHIPMENT_STATUSES.DELIVERED;
    return await shipment.save({ session });
};
exports.completeDelivery = completeDelivery;
const cancelShipment = async (companyId, id, session) => {
    const shipment = await shipment_model_1.Shipment.findOne({ _id: id, companyId }).session(session || null);
    if (!shipment)
        throw new AppError_1.NotFoundError('Shipment not found');
    (0, shipment_workflow_1.validateTransition)(shipment.status, shipment_constants_1.SHIPMENT_STATUSES.CANCELLED);
    // Future Orchestration Note: This is where we will inject `releaseInventory()` if it was previously optimized
    shipment.status = shipment_constants_1.SHIPMENT_STATUSES.CANCELLED;
    return await shipment.save({ session });
};
exports.cancelShipment = cancelShipment;
//# sourceMappingURL=shipment.service.js.map