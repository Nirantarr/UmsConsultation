import { Schema, model } from 'mongoose';

const messageSchema = new Schema({
  sessionId: { type: Schema.Types.ObjectId, ref: 'ChatSession', required: true },
  sender: { type: String, enum: ['user', 'admin'], required: true },
  senderName: { type: String, required: true }, // e.g., "Nirantar Mandogade" or "Admin"
  text: { type: String, required: true },
  read: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now },
});

export default model('Message', messageSchema);