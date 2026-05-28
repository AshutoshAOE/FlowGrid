import mongoose, { Document } from 'mongoose';
export interface IProduct extends Document {
    companyId: mongoose.Types.ObjectId;
    SKU: string;
    name: string;
    category: string;
    weight?: number;
    dimensions?: {
        length: number;
        width: number;
        height: number;
    };
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Product: mongoose.Model<IProduct, {}, {}, {}, mongoose.Document<unknown, {}, IProduct, {}, mongoose.DefaultSchemaOptions> & IProduct & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IProduct>;
//# sourceMappingURL=product.model.d.ts.map