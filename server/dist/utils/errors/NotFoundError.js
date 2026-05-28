"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFoundError = void 0;
const AppError_1 = require("./AppError");
const httpStatus_1 = require("../../constants/httpStatus");
class NotFoundError extends AppError_1.AppError {
    constructor(message = 'Resource Not Found') {
        super(message, httpStatus_1.HTTP_STATUS.NOT_FOUND, true);
    }
}
exports.NotFoundError = NotFoundError;
//# sourceMappingURL=NotFoundError.js.map