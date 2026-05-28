"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deductInventory = exports.releaseInventory = exports.reserveInventory = exports.adjustInventory = exports.getInventory = exports.getAvailableQuantity = void 0;
const inventory_model_1 = require("./inventory.model");
const warehouse_model_1 = require("../warehouse/warehouse.model");
const product_model_1 = require("../product/product.model");
const AppError_1 = require("../../utils/errors/AppError");
// UTILITY: Deterministic availability calculation
const getAvailableQuantity = (inventory) => {
    return inventory.quantity - inventory.reservedQuantity;
};
exports.getAvailableQuantity = getAvailableQuantity;
const getInventory = async (companyId, warehouseId) => {
    const query = { companyId };
    if (warehouseId)
        query.warehouseId = warehouseId;
    return await inventory_model_1.Inventory.find(query)
        .populate('warehouseId', 'name')
        .populate('productId', 'name SKU')
        .sort({ updatedAt: -1 });
};
exports.getInventory = getInventory;
// Instead of pure CRUD, Inventory focuses on operational adjustments
const adjustInventory = async (companyId, warehouseId, productId, quantityAdjustment) => {
    const warehouse = await warehouse_model_1.Warehouse.findOne({ _id: warehouseId, companyId });
    if (!warehouse)
        throw new AppError_1.NotFoundError('Warehouse not found');
    const product = await product_model_1.Product.findOne({ _id: productId, companyId });
    if (!product)
        throw new AppError_1.NotFoundError('Product not found');
    const inventory = await inventory_model_1.Inventory.findOne({ companyId, warehouseId, productId });
    if (inventory) {
        if (inventory.quantity + quantityAdjustment < 0) {
            throw new AppError_1.ConflictError('Adjustment would result in negative inventory');
        }
        inventory.quantity += quantityAdjustment;
        return await inventory.save();
    }
    else {
        if (quantityAdjustment < 0) {
            throw new AppError_1.ConflictError('Cannot reduce non-existent inventory');
        }
        return await inventory_model_1.Inventory.create({
            companyId,
            warehouseId,
            productId,
            quantity: quantityAdjustment,
            reservedQuantity: 0,
        });
    }
};
exports.adjustInventory = adjustInventory;
// OPERATIONAL: Reserve Inventory (Atomic Lock)
const reserveInventory = async (companyId, warehouseId, productId, quantityToReserve, session) => {
    const inventory = await inventory_model_1.Inventory.findOne({ companyId, warehouseId, productId }).session(session || null);
    if (!inventory)
        throw new AppError_1.NotFoundError('Inventory record not found');
    const available = (0, exports.getAvailableQuantity)(inventory);
    if (available < quantityToReserve) {
        throw new AppError_1.ConflictError(`Insufficient available inventory. Requested: ${quantityToReserve}, Available: ${available}`);
    }
    // Atomically increment the reserved amount
    const updatedInventory = await inventory_model_1.Inventory.findOneAndUpdate({ _id: inventory._id, quantity: { $gte: inventory.reservedQuantity + quantityToReserve } }, { $inc: { reservedQuantity: quantityToReserve } }, { new: true, session: session || null });
    if (!updatedInventory) {
        // If null, it means someone else snatched the inventory in between our find and update
        throw new AppError_1.ConflictError('Inventory reservation failed due to concurrent modification');
    }
    return updatedInventory;
};
exports.reserveInventory = reserveInventory;
// OPERATIONAL: Release Inventory (Atomic Unlock)
const releaseInventory = async (companyId, warehouseId, productId, quantityToRelease, session) => {
    const inventory = await inventory_model_1.Inventory.findOne({ companyId, warehouseId, productId }).session(session || null);
    if (!inventory)
        throw new AppError_1.NotFoundError('Inventory record not found');
    if (inventory.reservedQuantity < quantityToRelease) {
        throw new AppError_1.ValidationError(`Cannot release more than what is reserved. Releasing: ${quantityToRelease}, Reserved: ${inventory.reservedQuantity}`);
    }
    // Atomically decrement the reserved amount
    return await inventory_model_1.Inventory.findOneAndUpdate({ _id: inventory._id, reservedQuantity: { $gte: quantityToRelease } }, { $inc: { reservedQuantity: -quantityToRelease } }, { new: true, session: session || null });
};
exports.releaseInventory = releaseInventory;
// OPERATIONAL: Deduct Inventory (Atomic Consumption)
const deductInventory = async (companyId, warehouseId, productId, quantityToDeduct, session) => {
    const inventory = await inventory_model_1.Inventory.findOne({ companyId, warehouseId, productId }).session(session || null);
    if (!inventory)
        throw new AppError_1.NotFoundError('Inventory record not found');
    // We assume deductions come out of reserved stock during a fulfillment flow.
    if (inventory.reservedQuantity < quantityToDeduct) {
        throw new AppError_1.ValidationError(`Cannot deduct more than reserved quantity. Deducting: ${quantityToDeduct}, Reserved: ${inventory.reservedQuantity}`);
    }
    if (inventory.quantity < quantityToDeduct) {
        throw new AppError_1.ConflictError('Critical data inconsistency: Total quantity is less than deduction amount');
    }
    // Atomically decrement BOTH quantity and reservedQuantity
    return await inventory_model_1.Inventory.findOneAndUpdate({ _id: inventory._id, reservedQuantity: { $gte: quantityToDeduct }, quantity: { $gte: quantityToDeduct } }, { $inc: { quantity: -quantityToDeduct, reservedQuantity: -quantityToDeduct } }, { new: true, session: session || null });
};
exports.deductInventory = deductInventory;
//# sourceMappingURL=inventory.service.js.map