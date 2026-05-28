import mongoose, { Document } from 'mongoose';
export interface IUser extends Document {
    companyId: mongoose.Types.ObjectId;
    fullName: string;
    email: string;
    password?: string;
    role: 'admin' | 'manager' | 'dispatcher';
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}
export declare const User: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}, mongoose.DefaultSchemaOptions> & IUser & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IUser>;
//# sourceMappingURL=user.model.d.ts.map