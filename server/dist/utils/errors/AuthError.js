"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthError = void 0;
const AppError_1 = require("./AppError");
const httpStatus_1 = require("../../constants/httpStatus");
class AuthError extends AppError_1.AppError {
    constructor(message = 'Authentication Error') {
        super(message, httpStatus_1.HTTP_STATUS.UNAUTHORIZED, true);
    }
}
exports.AuthError = AuthError;
//# sourceMappingURL=AuthError.js.map