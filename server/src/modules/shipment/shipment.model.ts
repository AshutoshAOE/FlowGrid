import mongoose, { Document, Schema } from 'mongoose';

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
  allocationSnapshots?: any[]; // Prepared for future reservation engines
  createdAt: Date;
  updatedAt: Date;
}

const ShipmentSchema = new Schema<IShipment>(
  {
    companyId: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
      index: true,
    },
    destination: {
      address: { type: String, required: true },
      coordinates: {
        lat: { type: Number },
        lng: { type: Number },
      },
    },
    shipmentItems: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],
    status: {
      type: String,
      enum: ['created', 'optimized', 'driver_assigned', 'in_transit', 'delivered', 'cancelled'],
      default: 'created',
      index: true,
    },
    assignedDriver: {
      type: Schema.Types.ObjectId,
      ref: 'Driver',
    },
    allocationSnapshots: [{ type: Schema.Types.Mixed }], // Flexible for future phases
  },
  { timestamps: true }
);

export const Shipment = mongoose.model<IShipment>('Shipment', ShipmentSchema);
