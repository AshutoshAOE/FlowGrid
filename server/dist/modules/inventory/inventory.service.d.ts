import mongoose, { ClientSession } from 'mongoose';
import { IInventory } from './inventory.model';
export declare const getAvailableQuantity: (inventory: IInventory) => number;
export declare const getInventory: (companyId: mongoose.Types.ObjectId, warehouseId?: string) => Promise<(mongoose.Document<unknown, {}, IInventory, {}, mongoose.DefaultSchemaOptions> & IInventory & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
})[]>;
export declare const adjustInventory: (companyId: mongoose.Types.ObjectId, warehouseId: string, productId: string, quantityAdjustment: number) => Promise<mongoose.Document<unknown, {}, IInventory, {}, mongoose.DefaultSchemaOptions> & IInventory & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}>;
export declare const reserveInventory: (companyId: mongoose.Types.ObjectId, warehouseId: string, productId: string, quantityToReserve: number, session?: ClientSession) => Promise<mongoose.Document<unknown, {}, IInventory, {}, mongoose.DefaultSchemaOptions> & IInventory & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}>;
export declare const releaseInventory: (companyId: mongoose.Types.ObjectId, warehouseId: string, productId: string, quantityToRelease: number, session?: ClientSession) => Promise<mongoose.Document<unknown, {}, IInventory, {}, mongoose.DefaultSchemaOptions> & IInventory & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}>;
export declare const deductInventory: (companyId: mongoose.Types.ObjectId, warehouseId: string, productId: string, quantityToDeduct: number, session?: ClientSession) => Promise<mongoose.Document<unknown, {}, IInventory, {}, mongoose.DefaultSchemaOptions> & IInventory & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}>;
//# sourceMappingURL=inventory.service.d.ts.map