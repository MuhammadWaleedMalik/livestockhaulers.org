import mongoose, { Schema, Document, Types } from 'mongoose';
import { InterestStatus } from '@/lib/types';

export interface IInterest extends Document {
  loadId: Types.ObjectId;
  haulerId: Types.ObjectId;
  status: InterestStatus;
  message: string;
}

const InterestSchema: Schema = new Schema({
  loadId: { type: Schema.Types.ObjectId, ref: 'Load', required: true },
  haulerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: Object.values(InterestStatus), default: InterestStatus.PENDING },
  message: { type: String, default: "" }
}, { timestamps: true });

export default mongoose.models.Interest || mongoose.model<IInterest>('Interest', InterestSchema);
