"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.login = exports.register = void 0;
const auth_service_1 = require("./auth.service");
const response_1 = require("../../utils/response");
const httpStatus_1 = require("../../constants/httpStatus");
const register = async (req, res) => {
    const result = await (0, auth_service_1.registerCompanyAndAdmin)(req.body);
    res.status(httpStatus_1.HTTP_STATUS.CREATED).json((0, response_1.createSuccessResponse)('Company and Admin registered successfully', result));
};
exports.register = register;
const login = async (req, res) => {
    const result = await (0, auth_service_1.loginUser)(req.body);
    res.status(httpStatus_1.HTTP_STATUS.OK).json((0, response_1.createSuccessResponse)('Logged in successfully', result));
};
exports.login = login;
const getMe = async (req, res) => {
    // req.user is guaranteed to exist because of requireAuth middleware
    const user = await (0, auth_service_1.getUserProfile)(req.user.userId, req.user.companyId);
    res.status(httpStatus_1.HTTP_STATUS.OK).json((0, response_1.createSuccessResponse)('User profile retrieved successfully', { user }));
};
exports.getMe = getMe;
//# sourceMappingURL=auth.controller.js.map