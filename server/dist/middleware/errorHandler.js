"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const logger_1 = require("../utils/logger");
const response_1 = require("../utils/response");
const httpStatus_1 = require("../constants/httpStatus");
const env_1 = require("../config/env");
const AppError_1 = require("../utils/errors/AppError");
const errorHandler = (err, req, res, next) => {
    logger_1.logger.error(`${err.name}: ${err.message}`, {
        stack: err.stack,
        path: req.path,
        method: req.method,
        correlationId: req.headers['x-correlation-id'],
    });
    if (err instanceof AppError_1.AppError) {
        return res.status(err.statusCode).json((0, response_1.createErrorResponse)(err.message, err.errors || (env_1.env.NODE_ENV === 'development' ? err.stack : undefined)));
    }
    const statusCode = res.statusCode === httpStatus_1.HTTP_STATUS.OK ? httpStatus_1.HTTP_STATUS.INTERNAL_SERVER_ERROR : res.statusCode;
    res.status(statusCode).json((0, response_1.createErrorResponse)('Internal Server Error', env_1.env.NODE_ENV === 'development' ? err.stack : undefined));
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorHandler.js.map