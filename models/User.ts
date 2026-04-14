import mongoose, { Schema, Document } from 'mongoose';
import { UserRole } from '@/lib/types';

export interface IUser extends Document {
  email: string;
  password?: string;
  role: UserRole;
  profile: {
    companyName: string;
    phone: string;
    address: string;
    verified?: boolean;
  };
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false },
  role: { 
    type: String, 
    enum: Object.values(UserRole), 
    default: UserRole.BREEDER 
  },
  profile: {
    companyName: { type: String, default: "" },
    phone: { type: String, default: "" },
    address: { type: String, default: "" },
    verified: { type: Boolean, default: false }
  }
}, { timestamps: true });

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
