"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createErrorResponse = exports.createSuccessResponse = void 0;
const createSuccessResponse = (message, data) => {
    return {
        success: true,
        message,
        data,
    };
};
exports.createSuccessResponse = createSuccessResponse;
const createErrorResponse = (message, error) => {
    return {
        success: false,
        message,
        error,
    };
};
exports.createErrorResponse = createErrorResponse;
//# sourceMappingURL=response.js.map