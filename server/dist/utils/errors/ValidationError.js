"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationError = void 0;
const AppError_1 = require("./AppError");
const httpStatus_1 = require("../../constants/httpStatus");
class ValidationError extends AppError_1.AppError {
    constructor(message = 'Validation Error', errors) {
        super(message, httpStatus_1.HTTP_STATUS.BAD_REQUEST, true, errors);
    }
}
exports.ValidationError = ValidationError;
//# sourceMappingURL=ValidationError.js.map