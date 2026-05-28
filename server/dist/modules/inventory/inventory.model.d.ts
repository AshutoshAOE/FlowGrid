import mongoose, { Document } from 'mongoose';
export interface IInventory extends Document {
    companyId: mongoose.Types.ObjectId;
    warehouseId: mongoose.Types.ObjectId;
    productId: mongoose.Types.ObjectId;
    quantity: number;
    reservedQuantity: number;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Inventory: mongoose.Model<IInventory, {}, {}, {}, mongoose.Document<unknown, {}, IInventory, {}, mongoose.DefaultSchemaOptions> & IInventory & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IInventory>;
//# sourceMappingURL=inventory.model.d.ts.map