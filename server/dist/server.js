"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const env_1 = require("./config/env");
const logger_1 = require("./utils/logger");
const connection_1 = require("./database/connection");
const startServer = async () => {
    try {
        // Connect to database
        await (0, connection_1.connectDB)();
        // Start server
        const server = app_1.default.listen(env_1.env.PORT, () => {
            logger_1.logger.info(`Server running in ${env_1.env.NODE_ENV} mode on port ${env_1.env.PORT}`);
        });
        // Handle unhandled promise rejections
        process.on('unhandledRejection', (err) => {
            logger_1.logger.error(`Unhandled Rejection: ${err.message}`);
            server.close(() => process.exit(1));
        });
        // Handle uncaught exceptions
        process.on('uncaughtException', (err) => {
            logger_1.logger.error(`Uncaught Exception: ${err.message}`);
            server.close(() => process.exit(1));
        });
    }
    catch (error) {
        logger_1.logger.error('Failed to start server:', error);
        process.exit(1);
    }
};
startServer();
//# sourceMappingURL=server.js.map