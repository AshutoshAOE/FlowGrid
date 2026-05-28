"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserProfile = exports.loginUser = exports.registerCompanyAndAdmin = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const company_model_1 = require("../company/company.model");
const user_model_1 = require("../user/user.model");
const AppError_1 = require("../../utils/errors/AppError");
const auth_utils_1 = require("./auth.utils");
const registerCompanyAndAdmin = async (data) => {
    const session = await mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const existingCompany = await company_model_1.Company.findOne({ email: data.email }).session(session);
        if (existingCompany) {
            throw new AppError_1.ConflictError('Company with this email already exists');
        }
        const existingUser = await user_model_1.User.findOne({ email: data.email }).session(session);
        if (existingUser) {
            throw new AppError_1.ConflictError('User with this email already exists');
        }
        const company = await company_model_1.Company.create([{
                name: data.companyName,
                email: data.email,
            }], { session });
        const user = await user_model_1.User.create([{
                companyId: company[0]._id,
                fullName: data.fullName,
                email: data.email,
                password: data.password,
                role: 'admin',
            }], { session });
        await session.commitTransaction();
        session.endSession();
        const token = (0, auth_utils_1.generateToken)(user[0]._id, company[0]._id, user[0].role);
        // Return sanitized user (without password)
        const userObj = user[0].toObject();
        delete userObj.password;
        return { user: userObj, token };
    }
    catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};
exports.registerCompanyAndAdmin = registerCompanyAndAdmin;
const loginUser = async (data) => {
    const user = await user_model_1.User.findOne({ email: data.email }).select('+password');
    if (!user) {
        throw new AppError_1.AuthError('Invalid email or password');
    }
    if (!user.isActive) {
        throw new AppError_1.AuthError('Account is deactivated');
    }
    const isMatch = await user.comparePassword(data.password);
    if (!isMatch) {
        throw new AppError_1.AuthError('Invalid email or password');
    }
    const token = (0, auth_utils_1.generateToken)(user._id, user.companyId, user.role);
    const userObj = user.toObject();
    delete userObj.password;
    return { user: userObj, token };
};
exports.loginUser = loginUser;
const getUserProfile = async (userId, companyId) => {
    const user = await user_model_1.User.findOne({ _id: userId, companyId }).populate('companyId', 'name subscriptionPlan');
    if (!user) {
        throw new AppError_1.NotFoundError('User not found');
    }
    return user;
};
exports.getUserProfile = getUserProfile;
//# sourceMappingURL=auth.service.js.map