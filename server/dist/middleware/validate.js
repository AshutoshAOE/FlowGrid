"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const zod_1 = require("zod");
const AppError_1 = require("../utils/errors/AppError");
const validateRequest = (schema) => {
    return async (req, res, next) => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError || error.issues) {
                const errorMessages = (error.issues || error.errors || []).map((err) => ({
                    field: err.path.join('.'),
                    message: err.message,
                }));
                next(new AppError_1.ValidationError('Invalid request data', errorMessages));
            }
            else {
                next(error);
            }
        }
    };
};
exports.validateRequest = validateRequest;
//# sourceMappingURL=validate.js.map