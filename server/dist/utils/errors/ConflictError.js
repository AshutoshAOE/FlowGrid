"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConflictError = void 0;
const AppError_1 = require("./AppError");
const httpStatus_1 = require("../../constants/httpStatus");
class ConflictError extends AppError_1.AppError {
    constructor(message = 'Resource Conflict') {
        super(message, httpStatus_1.HTTP_STATUS.CONFLICT, true);
    }
}
exports.ConflictError = ConflictError;
//# sourceMappingURL=ConflictError.js.map