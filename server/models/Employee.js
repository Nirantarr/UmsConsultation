import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
  fullName: String,
  email: { 
    type: String, 
    unique: true,
    required: true
  },
  phone: String,
  employeeId: { 
    type: Number, 
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  is_admin: { 
    type: Boolean, 
    default: false 
  },
  // The only field needed for verification.
  isVerified: {
    type: Boolean,
    default: false,
  },
  resetPasswordToken: { 
    type: String 
  },
  resetPasswordExpires: { 
    type: Date 
  },
}, { timestamps: true });

export default mongoose.model('Employee', employeeSchema);