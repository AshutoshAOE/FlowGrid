import mongoose, { Document } from 'mongoose';
export interface IShipment extends Document {
    companyId: mongoose.Types.ObjectId;
    destination: {
        address: string;
        coordinates?: {
            lat: number;
            lng: number;
        };
    };
    shipmentItems: {
        productId: mongoose.Types.ObjectId;
        quantity: number;
    }[];
    status: 'created' | 'optimized' | 'driver_assigned' | 'in_transit' | 'delivered' | 'cancelled';
    assignedDriver?: mongoose.Types.ObjectId;
    allocationSnapshots?: any[];
    createdAt: Date;
    updatedAt: Date;
}
export declare const Shipment: mongoose.Model<IShipment, {}, {}, {}, mongoose.Document<unknown, {}, IShipment, {}, mongoose.DefaultSchemaOptions> & IShipment & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IShipment>;
//# sourceMappingURL=shipment.model.d.ts.map