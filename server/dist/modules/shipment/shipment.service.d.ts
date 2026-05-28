import mongoose, { ClientSession } from 'mongoose';
import { IShipment } from './shipment.model';
export declare const createShipment: (companyId: mongoose.Types.ObjectId, data: any) => Promise<mongoose.Document<unknown, {}, IShipment, {}, mongoose.DefaultSchemaOptions> & IShipment & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}>;
export declare const getShipments: (companyId: mongoose.Types.ObjectId) => Promise<(mongoose.Document<unknown, {}, IShipment, {}, mongoose.DefaultSchemaOptions> & IShipment & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
})[]>;
export declare const getShipmentById: (companyId: mongoose.Types.ObjectId, id: string) => Promise<mongoose.Document<unknown, {}, IShipment, {}, mongoose.DefaultSchemaOptions> & IShipment & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}>;
export declare const optimizeShipment: (companyId: mongoose.Types.ObjectId, id: string, session?: ClientSession) => Promise<mongoose.Document<unknown, {}, IShipment, {}, mongoose.DefaultSchemaOptions> & IShipment & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}>;
export declare const assignDriver: (companyId: mongoose.Types.ObjectId, id: string, driverId: string, session?: ClientSession) => Promise<mongoose.Document<unknown, {}, IShipment, {}, mongoose.DefaultSchemaOptions> & IShipment & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}>;
export declare const startTransit: (companyId: mongoose.Types.ObjectId, id: string, session?: ClientSession) => Promise<mongoose.Document<unknown, {}, IShipment, {}, mongoose.DefaultSchemaOptions> & IShipment & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}>;
export declare const completeDelivery: (companyId: mongoose.Types.ObjectId, id: string, session?: ClientSession) => Promise<mongoose.Document<unknown, {}, IShipment, {}, mongoose.DefaultSchemaOptions> & IShipment & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}>;
export declare const cancelShipment: (companyId: mongoose.Types.ObjectId, id: string, session?: ClientSession) => Promise<mongoose.Document<unknown, {}, IShipment, {}, mongoose.DefaultSchemaOptions> & IShipment & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}>;
//# sourceMappingURL=shipment.service.d.ts.map