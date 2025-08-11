import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  // This 'createdAt' field is the key to automatic expiration.
  // The 'expires' option tells MongoDB to automatically delete the document
  // from this collection 10 minutes after its creation time.
  createdAt: {
    type: Date,
    default: Date.now,
    expires: '10m', // You can set this to '5m', '600s', etc.
  }
});

// Create a compound index for faster lookups
otpSchema.index({ email: 1, otp: 1 });

const Otp = mongoose.model('Otp', otpSchema);
export default Otp;