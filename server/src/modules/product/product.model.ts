import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  companyId: mongoose.Types.ObjectId;
  SKU: string;
  name: string;
  category: string;
  weight?: number; // Optional operational metrics
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    companyId: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
      index: true,
    },
    SKU: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    weight: { type: Number, min: 0 },
    dimensions: {
      length: { type: Number, min: 0 },
      width: { type: Number, min: 0 },
      height: { type: Number, min: 0 },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Compound index to ensure SKU is unique within a company
ProductSchema.index({ companyId: 1, SKU: 1 }, { unique: true });

export const Product = mongoose.model<IProduct>('Product', ProductSchema);
