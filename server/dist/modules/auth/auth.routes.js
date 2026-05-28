"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const asyncHandler_1 = require("../../utils/asyncHandler");
const validate_1 = require("../../middleware/validate");
const auth_validator_1 = require("./auth.validator");
const auth_controller_1 = require("./auth.controller");
const requireAuth_1 = require("../../middleware/requireAuth");
const router = (0, express_1.Router)();
router.post('/register', (0, validate_1.validateRequest)(auth_validator_1.registerSchema), (0, asyncHandler_1.asyncHandler)(auth_controller_1.register));
router.post('/login', (0, validate_1.validateRequest)(auth_validator_1.loginSchema), (0, asyncHandler_1.asyncHandler)(auth_controller_1.login));
// Protected route example
router.get('/me', requireAuth_1.requireAuth, (0, asyncHandler_1.asyncHandler)(auth_controller_1.getMe));
exports.default = router;
//# sourceMappingURL=auth.routes.js.map