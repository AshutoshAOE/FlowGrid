"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDriver = exports.updateDriver = exports.getDriverById = exports.getDrivers = exports.createDriver = void 0;
const driver_model_1 = require("./driver.model");
const AppError_1 = require("../../utils/errors/AppError");
const createDriver = async (companyId, data) => {
    return await driver_model_1.Driver.create({ ...data, companyId });
};
exports.createDriver = createDriver;
const getDrivers = async (companyId) => {
    return await driver_model_1.Driver.find({ companyId }).sort({ createdAt: -1 });
};
exports.getDrivers = getDrivers;
const getDriverById = async (companyId, id) => {
    const driver = await driver_model_1.Driver.findOne({ _id: id, companyId });
    if (!driver)
        throw new AppError_1.NotFoundError('Driver not found');
    return driver;
};
exports.getDriverById = getDriverById;
const updateDriver = async (companyId, id, data) => {
    const driver = await driver_model_1.Driver.findOneAndUpdate({ _id: id, companyId }, { $set: data }, { new: true, runValidators: true });
    if (!driver)
        throw new AppError_1.NotFoundError('Driver not found');
    return driver;
};
exports.updateDriver = updateDriver;
const deleteDriver = async (companyId, id) => {
    const driver = await driver_model_1.Driver.findOneAndDelete({ _id: id, companyId });
    if (!driver)
        throw new AppError_1.NotFoundError('Driver not found');
    return driver;
};
exports.deleteDriver = deleteDriver;
//# sourceMappingURL=driver.service.js.map