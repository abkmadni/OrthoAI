import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string; // Optional if using OAuth
  role: 'admin' | 'dentist' | 'staff';
  image?: string;
  active: boolean;
  settings: {
    theme: 'light' | 'dark' | 'system';
    notifications: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: { type: String, enum: ['admin', 'dentist', 'staff'], default: 'dentist' },
    image: { type: String },
    active: { type: Boolean, default: true },
    settings: {
      theme: { type: String, enum: ['light', 'dark', 'system'], default: 'system' },
      notifications: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
