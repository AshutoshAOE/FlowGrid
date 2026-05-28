import mongoose, { Document } from 'mongoose';
export interface ICompany extends Document {
    name: string;
    email: string;
    subscriptionPlan: 'free' | 'pro' | 'enterprise';
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Company: mongoose.Model<ICompany, {}, {}, {}, mongoose.Document<unknown, {}, ICompany, {}, mongoose.DefaultSchemaOptions> & ICompany & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, ICompany>;
//# sourceMappingURL=company.model.d.ts.map