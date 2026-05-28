"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../../config/env");
const generateToken = (userId, companyId, role) => {
    return jsonwebtoken_1.default.sign({ userId: userId.toString(), companyId: companyId.toString(), role }, env_1.env.JWT_SECRET, { expiresIn: '1d' } // Token expires in 1 day
    );
};
exports.generateToken = generateToken;
const verifyToken = (token) => {
    return jsonwebtoken_1.default.verify(token, env_1.env.JWT_SECRET);
};
exports.verifyToken = verifyToken;
//# sourceMappingURL=auth.utils.js.map