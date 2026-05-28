"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.getProductById = exports.getProducts = exports.createProduct = void 0;
const product_model_1 = require("./product.model");
const AppError_1 = require("../../utils/errors/AppError");
const createProduct = async (companyId, data) => {
    const existingProduct = await product_model_1.Product.findOne({ companyId, SKU: data.SKU });
    if (existingProduct) {
        throw new AppError_1.ConflictError('A product with this SKU already exists in your company');
    }
    return await product_model_1.Product.create({ ...data, companyId });
};
exports.createProduct = createProduct;
const getProducts = async (companyId) => {
    return await product_model_1.Product.find({ companyId }).sort({ createdAt: -1 });
};
exports.getProducts = getProducts;
const getProductById = async (companyId, id) => {
    const product = await product_model_1.Product.findOne({ _id: id, companyId });
    if (!product)
        throw new AppError_1.NotFoundError('Product not found');
    return product;
};
exports.getProductById = getProductById;
const updateProduct = async (companyId, id, data) => {
    // If SKU is being updated, ensure it doesn't conflict
    if (data.SKU) {
        const existingProduct = await product_model_1.Product.findOne({ companyId, SKU: data.SKU, _id: { $ne: id } });
        if (existingProduct) {
            throw new AppError_1.ConflictError('A product with this SKU already exists');
        }
    }
    const product = await product_model_1.Product.findOneAndUpdate({ _id: id, companyId }, { $set: data }, { new: true, runValidators: true });
    if (!product)
        throw new AppError_1.NotFoundError('Product not found');
    return product;
};
exports.updateProduct = updateProduct;
const deleteProduct = async (companyId, id) => {
    const product = await product_model_1.Product.findOneAndDelete({ _id: id, companyId });
    if (!product)
        throw new AppError_1.NotFoundError('Product not found');
    return product;
};
exports.deleteProduct = deleteProduct;
//# sourceMappingURL=product.service.js.map