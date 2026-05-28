"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const AppError_1 = require("../utils/errors/AppError");
const mongoose_1 = __importDefault(require("mongoose"));
const requireAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(new AppError_1.AuthError('Authentication required'));
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        // Inject decoded tenant info into request
        req.user = {
            userId: new mongoose_1.default.Types.ObjectId(decoded.userId),
            companyId: new mongoose_1.default.Types.ObjectId(decoded.companyId),
            role: decoded.role,
        };
        next();
    }
    catch (error) {
        return next(new AppError_1.AuthError('Invalid or expired token'));
    }
};
exports.requireAuth = requireAuth;
//# sourceMappingURL=requireAuth.js.map