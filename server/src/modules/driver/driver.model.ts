import mongoose, { Document, Schema } from 'mongoose';
import { DRIVER_STATUSES, DriverStatus } from './driver.constants';

export interface IDriver extends Document {
  companyId: mongoose.Types.ObjectId;
  fullName: string;
  phone: string;
  vehicleType: string;
  vehicleCapacity: number;
  status: DriverStatus;
  currentCoordinates?: {
    lat: number;
    lng: number;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const DriverSchema = new Schema<IDriver>(
  {
    companyId: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
      index: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    vehicleType: {
      type: String,
      required: true,
      trim: true,
    },
    vehicleCapacity: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: Object.values(DRIVER_STATUSES),
      default: DRIVER_STATUSES.OFFLINE,
      index: true,
    },
    currentCoordinates: {
      lat: { type: Number },
      lng: { type: Number },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Optimize queries for finding available drivers in a company
DriverSchema.index({ companyId: 1, status: 1 });

export const Driver = mongoose.model<IDriver>('Driver', DriverSchema);
