import mongoose, { Document } from 'mongoose';
export interface IWarehouse extends Document {
    companyId: mongoose.Types.ObjectId;
    name: string;
    address: {
        street: string;
        city: string;
        state: string;
        zip: string;
    };
    coordinates?: {
        lat: number;
        lng: number;
    };
    storageCapacity: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Warehouse: mongoose.Model<IWarehouse, {}, {}, {}, mongoose.Document<unknown, {}, IWarehouse, {}, mongoose.DefaultSchemaOptions> & IWarehouse & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IWarehouse>;
//# sourceMappingURL=warehouse.model.d.ts.map