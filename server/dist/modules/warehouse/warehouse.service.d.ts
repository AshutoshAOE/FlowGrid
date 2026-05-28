import mongoose from 'mongoose';
import { IWarehouse } from './warehouse.model';
export declare const createWarehouse: (companyId: mongoose.Types.ObjectId, data: Partial<IWarehouse>) => Promise<mongoose.Document<unknown, {}, IWarehouse, {}, mongoose.DefaultSchemaOptions> & IWarehouse & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}>;
export declare const getWarehouses: (companyId: mongoose.Types.ObjectId) => Promise<(mongoose.Document<unknown, {}, IWarehouse, {}, mongoose.DefaultSchemaOptions> & IWarehouse & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
})[]>;
export declare const getWarehouseById: (companyId: mongoose.Types.ObjectId, id: string) => Promise<mongoose.Document<unknown, {}, IWarehouse, {}, mongoose.DefaultSchemaOptions> & IWarehouse & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}>;
export declare const updateWarehouse: (companyId: mongoose.Types.ObjectId, id: string, data: Partial<IWarehouse>) => Promise<mongoose.Document<unknown, {}, IWarehouse, {}, mongoose.DefaultSchemaOptions> & IWarehouse & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}>;
export declare const deleteWarehouse: (companyId: mongoose.Types.ObjectId, id: string) => Promise<mongoose.Document<unknown, {}, IWarehouse, {}, mongoose.DefaultSchemaOptions> & IWarehouse & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}>;
//# sourceMappingURL=warehouse.service.d.ts.map