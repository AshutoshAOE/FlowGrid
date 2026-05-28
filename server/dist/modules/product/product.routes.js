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
const express_1 = require("express");
const asyncHandler_1 = require("../../utils/asyncHandler");
const validate_1 = require("../../middleware/validate");
const requireAuth_1 = require("../../middleware/requireAuth");
const requireRole_1 = require("../../middleware/requireRole");
const product_validator_1 = require("./product.validator");
const productController = __importStar(require("./product.controller"));
const router = (0, express_1.Router)();
router.use(requireAuth_1.requireAuth);
router.post('/', (0, requireRole_1.requireRole)(['admin', 'manager']), (0, validate_1.validateRequest)(product_validator_1.productSchema), (0, asyncHandler_1.asyncHandler)(productController.createProduct));
router.get('/', (0, asyncHandler_1.asyncHandler)(productController.getProducts));
router.get('/:id', (0, asyncHandler_1.asyncHandler)(productController.getProductById));
router.patch('/:id', (0, requireRole_1.requireRole)(['admin', 'manager']), (0, validate_1.validateRequest)(product_validator_1.updateProductSchema), (0, asyncHandler_1.asyncHandler)(productController.updateProduct));
router.delete('/:id', (0, requireRole_1.requireRole)(['admin']), (0, asyncHandler_1.asyncHandler)(productController.deleteProduct));
exports.default = router;
//# sourceMappingURL=product.routes.js.map