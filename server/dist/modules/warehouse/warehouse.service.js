"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteWarehouse = exports.updateWarehouse = exports.getWarehouseById = exports.getWarehouses = exports.createWarehouse = void 0;
const warehouse_model_1 = require("./warehouse.model");
const AppError_1 = require("../../utils/errors/AppError");
const createWarehouse = async (companyId, data) => {
    return await warehouse_model_1.Warehouse.create({ ...data, companyId });
};
exports.createWarehouse = createWarehouse;
const getWarehouses = async (companyId) => {
    return await warehouse_model_1.Warehouse.find({ companyId }).sort({ createdAt: -1 });
};
exports.getWarehouses = getWarehouses;
const getWarehouseById = async (companyId, id) => {
    const warehouse = await warehouse_model_1.Warehouse.findOne({ _id: id, companyId });
    if (!warehouse)
        throw new AppError_1.NotFoundError('Warehouse not found');
    return warehouse;
};
exports.getWarehouseById = getWarehouseById;
const updateWarehouse = async (companyId, id, data) => {
    const warehouse = await warehouse_model_1.Warehouse.findOneAndUpdate({ _id: id, companyId }, { $set: data }, { new: true, runValidators: true });
    if (!warehouse)
        throw new AppError_1.NotFoundError('Warehouse not found');
    return warehouse;
};
exports.updateWarehouse = updateWarehouse;
const deleteWarehouse = async (companyId, id) => {
    const warehouse = await warehouse_model_1.Warehouse.findOneAndDelete({ _id: id, companyId });
    if (!warehouse)
        throw new AppError_1.NotFoundError('Warehouse not found');
    return warehouse;
};
exports.deleteWarehouse = deleteWarehouse;
//# sourceMappingURL=warehouse.service.js.map