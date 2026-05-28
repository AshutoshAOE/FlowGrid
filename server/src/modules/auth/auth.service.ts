import mongoose from 'mongoose';
import { Company } from '../company/company.model';
import { User } from '../user/user.model';
import { ConflictError, AuthError, NotFoundError } from '../../utils/errors/AppError';
import { generateToken } from './auth.utils';

import { runWithTransaction } from '../../utils/transaction';

export const registerCompanyAndAdmin = async (data: any) => {
  return await runWithTransaction(async (session) => {
    const existingCompany = await Company.findOne({ email: data.email }).session(session || null);
    if (existingCompany) {
      throw new ConflictError('Company with this email already exists');
    }

    const existingUser = await User.findOne({ email: data.email }).session(session || null);
    if (existingUser) {
      throw new ConflictError('User with this email already exists');
    }

    const company = await Company.create([{
      name: data.companyName,
      email: data.email,
    }], { session });

    const user = await User.create([{
      companyId: company[0]._id,
      fullName: data.fullName,
      email: data.email,
      password: data.password,
      role: 'admin',
    }], { session });

    const token = generateToken(user[0]._id as mongoose.Types.ObjectId, company[0]._id as mongoose.Types.ObjectId, user[0].role);

    // Return sanitized user (without password)
    const userObj = user[0].toObject();
    delete userObj.password;

    return { user: userObj, token };
  });
};

export const loginUser = async (data: any) => {
  const user = await User.findOne({ email: data.email }).select('+password');
  
  if (!user) {
    throw new AuthError('Invalid email or password');
  }

  if (!user.isActive) {
    throw new AuthError('Account is deactivated');
  }

  const isMatch = await user.comparePassword(data.password);
  if (!isMatch) {
    throw new AuthError('Invalid email or password');
  }

  const token = generateToken(user._id as mongoose.Types.ObjectId, user.companyId, user.role);

  const userObj = user.toObject();
  delete userObj.password;

  return { user: userObj, token };
};

export const getUserProfile = async (userId: mongoose.Types.ObjectId, companyId: mongoose.Types.ObjectId) => {
  const user = await User.findOne({ _id: userId, companyId }).populate('companyId', 'name subscriptionPlan');
  
  if (!user) {
    throw new NotFoundError('User not found');
  }

  return user;
};
