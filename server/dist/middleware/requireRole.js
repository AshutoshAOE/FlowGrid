"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = void 0;
const AppError_1 = require("../utils/errors/AppError");
const requireRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return next(new AppError_1.AuthError('Authentication required'));
        }
        if (!allowedRoles.includes(req.user.role)) {
            return next(new AppError_1.AuthError('You do not have permission to perform this action'));
        }
        next();
    };
};
exports.requireRole = requireRole;
//# sourceMappingURL=requireRole.js.map