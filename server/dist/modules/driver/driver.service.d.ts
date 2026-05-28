import mongoose from 'mongoose';
import { IDriver } from './driver.model';
export declare const createDriver: (companyId: mongoose.Types.ObjectId, data: Partial<IDriver>) => Promise<mongoose.Document<unknown, {}, IDriver, {}, mongoose.DefaultSchemaOptions> & IDriver & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}>;
export declare const getDrivers: (companyId: mongoose.Types.ObjectId) => Promise<(mongoose.Document<unknown, {}, IDriver, {}, mongoose.DefaultSchemaOptions> & IDriver & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
})[]>;
export declare const getDriverById: (companyId: mongoose.Types.ObjectId, id: string) => Promise<mongoose.Document<unknown, {}, IDriver, {}, mongoose.DefaultSchemaOptions> & IDriver & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}>;
export declare const updateDriver: (companyId: mongoose.Types.ObjectId, id: string, data: Partial<IDriver>) => Promise<mongoose.Document<unknown, {}, IDriver, {}, mongoose.DefaultSchemaOptions> & IDriver & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}>;
export declare const deleteDriver: (companyId: mongoose.Types.ObjectId, id: string) => Promise<mongoose.Document<unknown, {}, IDriver, {}, mongoose.DefaultSchemaOptions> & IDriver & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}>;
//# sourceMappingURL=driver.service.d.ts.map