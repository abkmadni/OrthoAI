import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAppointment extends Document {
  title: string;
  start: Date;
  end: Date;
  patient: mongoose.Types.ObjectId;
  dentist: mongoose.Types.ObjectId;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  type: 'checkup' | 'cleaning' | 'x-ray' | 'surgery' | 'ortho' | 'other';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AppointmentSchema: Schema<IAppointment> = new Schema(
  {
    title: { type: String, required: true },
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    patient: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
    dentist: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: { 
      type: String, 
      enum: ['scheduled', 'completed', 'cancelled', 'no-show'], 
      default: 'scheduled' 
    },
    type: { 
      type: String, 
      enum: ['checkup', 'cleaning', 'x-ray', 'surgery', 'ortho', 'other'], 
      default: 'checkup' 
    },
    notes: { type: String },
  },
  { timestamps: true }
);

const Appointment: Model<IAppointment> = mongoose.models.Appointment || mongoose.model<IAppointment>('Appointment', AppointmentSchema);

export default Appointment;
