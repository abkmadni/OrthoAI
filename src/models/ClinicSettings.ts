import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IClinicSettings extends Document {
  dentist: mongoose.Types.ObjectId; // Settings per dentist/clinic owner
  branding: {
    name: string;
    description?: string;
    logoUrl?: string;
    colors: {
      primary: string;
      secondary: string;
      accent: string;
    };
  };
  contact: {
    address?: string;
    email?: string;
    phone?: string;
    website?: string;
  };
  features: {
    enablePatientPortal: boolean;
    enableAiAnalysis: boolean;
    enableOnlineBooking: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ClinicSettingsSchema: Schema<IClinicSettings> = new Schema(
  {
    dentist: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    branding: {
      name: { type: String, default: 'OrthoAI Clinic' },
      description: { type: String },
      logoUrl: { type: String },
      colors: {
        primary: { type: String, default: '#8c62c2' },
        secondary: { type: String, default: '#373941' },
        accent: { type: String, default: '#f3e8ff' },
      },
    },
    contact: {
      address: { type: String },
      email: { type: String },
      phone: { type: String },
      website: { type: String },
    },
    features: {
      enablePatientPortal: { type: Boolean, default: true },
      enableAiAnalysis: { type: Boolean, default: true },
      enableOnlineBooking: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

const ClinicSettings: Model<IClinicSettings> = mongoose.models.ClinicSettings || mongoose.model<IClinicSettings>('ClinicSettings', ClinicSettingsSchema);

export default ClinicSettings;
