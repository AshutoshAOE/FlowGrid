import mongoose, { Document, Schema } from 'mongoose';

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

const WarehouseSchema = new Schema<IWarehouse>(
  {
    companyId: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zip: { type: String, required: true },
    },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number },
    },
    storageCapacity: {
      type: Number,
      required: true,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const Warehouse = mongoose.model<IWarehouse>('Warehouse', WarehouseSchema);
