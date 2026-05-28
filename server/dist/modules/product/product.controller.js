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
exports.deleteProduct = exports.updateProduct = exports.getProductById = exports.getProducts = exports.createProduct = void 0;
const productService = __importStar(require("./product.service"));
const response_1 = require("../../utils/response");
const httpStatus_1 = require("../../constants/httpStatus");
const createProduct = async (req, res) => {
    const result = await productService.createProduct(req.user.companyId, req.body);
    res.status(httpStatus_1.HTTP_STATUS.CREATED).json((0, response_1.createSuccessResponse)('Product created successfully', result));
};
exports.createProduct = createProduct;
const getProducts = async (req, res) => {
    const result = await productService.getProducts(req.user.companyId);
    res.status(httpStatus_1.HTTP_STATUS.OK).json((0, response_1.createSuccessResponse)('Products retrieved successfully', result));
};
exports.getProducts = getProducts;
const getProductById = async (req, res) => {
    const result = await productService.getProductById(req.user.companyId, req.params.id);
    res.status(httpStatus_1.HTTP_STATUS.OK).json((0, response_1.createSuccessResponse)('Product retrieved successfully', result));
};
exports.getProductById = getProductById;
const updateProduct = async (req, res) => {
    const result = await productService.updateProduct(req.user.companyId, req.params.id, req.body);
    res.status(httpStatus_1.HTTP_STATUS.OK).json((0, response_1.createSuccessResponse)('Product updated successfully', result));
};
exports.updateProduct = updateProduct;
const deleteProduct = async (req, res) => {
    await productService.deleteProduct(req.user.companyId, req.params.id);
    res.status(httpStatus_1.HTTP_STATUS.NO_CONTENT).send();
};
exports.deleteProduct = deleteProduct;
//# sourceMappingURL=product.controller.js.map