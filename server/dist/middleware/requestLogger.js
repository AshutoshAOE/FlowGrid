"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLogger = void 0;
const logger_1 = require("../utils/logger");
const crypto_1 = __importDefault(require("crypto"));
const requestLogger = (req, res, next) => {
    const start = Date.now();
    // Assign correlation ID if not present
    req.headers['x-correlation-id'] = req.headers['x-correlation-id'] || crypto_1.default.randomUUID();
    const correlationId = req.headers['x-correlation-id'];
    res.on('finish', () => {
        const duration = Date.now() - start;
        logger_1.logger.info(`[${correlationId}] ${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`, {
            method: req.method,
            url: req.originalUrl,
            status: res.statusCode,
            durationMs: duration,
            ip: req.ip,
            correlationId,
        });
    });
    next();
};
exports.requestLogger = requestLogger;
//# sourceMappingURL=requestLogger.js.map