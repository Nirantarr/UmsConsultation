import mongoose from 'mongoose';

const consultantSchema = new mongoose.Schema({
  email: { 
    type: String, 
    unique: true, 
    required: true 
  },
  phone: String,
  organizationName: String,
  organizationType: String,
  password: {
    type: String,
    required: true
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
}, { timestamps: true }); // Timestamps are great for tracking when a user was created/updated.

export default mongoose.model('Consultant', consultantSchema);