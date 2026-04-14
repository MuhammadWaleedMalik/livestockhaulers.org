import mongoose, { Schema, Document, Types } from 'mongoose';
import { LoadStatus } from '@/lib/types';

export interface ILoad extends Document {
  breederId: Types.ObjectId;
  title: string;
  animalType: string;
  quantity: number;
  pickupLocation: string; // "City, State"
  deliveryLocation: string; // "City, State"
  status: LoadStatus;
  createdAt: Date;
}

const LoadSchema: Schema = new Schema({
  breederId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  animalType: { type: String, required: true },
  quantity: { type: Number, required: true },
  pickupLocation: { type: String, required: true },
  deliveryLocation: { type: String, required: true },
  status: { type: String, enum: Object.values(LoadStatus), default: LoadStatus.ACTIVE }
}, { timestamps: true });

export default mongoose.models.Load || mongoose.model<ILoad>('Load', LoadSchema);
