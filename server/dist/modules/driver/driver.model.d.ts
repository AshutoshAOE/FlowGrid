import mongoose, { Document } from 'mongoose';
export interface IDriver extends Document {
    companyId: mongoose.Types.ObjectId;
    fullName: string;
    phone: string;
    vehicleType: string;
    vehicleCapacity: number;
    availabilityStatus: 'available' | 'on_duty' | 'off_duty';
    currentCoordinates?: {
        lat: number;
        lng: number;
    };
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Driver: mongoose.Model<IDriver, {}, {}, {}, mongoose.Document<unknown, {}, IDriver, {}, mongoose.DefaultSchemaOptions> & IDriver & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IDriver>;
//# sourceMappingURL=driver.model.d.ts.map