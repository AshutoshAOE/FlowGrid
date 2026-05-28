"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const zod_1 = require("zod");
const dotenv_1 = __importDefault(require("dotenv"));
const logger_1 = require("../utils/logger");
dotenv_1.default.config();
const envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(['development', 'production', 'test']).default('development'),
    PORT: zod_1.z.string().default('5000'),
    MONGO_URI: zod_1.z.string().url('Invalid MongoDB URI format'),
    JWT_SECRET: zod_1.z.string().min(10, 'JWT secret must be at least 10 characters'),
});
const validateEnv = () => {
    try {
        const envVars = envSchema.parse(process.env);
        return envVars;
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            logger_1.logger.error('Environment validation failed:', error.format());
        }
        else {
            logger_1.logger.error('Unexpected error during environment validation', error);
        }
        process.exit(1);
    }
};
exports.env = validateEnv();
//# sourceMappingURL=env.js.map