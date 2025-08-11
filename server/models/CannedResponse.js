import { Schema, model } from 'mongoose';

const cannedResponseSchema = new Schema({
  shortcut: { type: String, required: true, unique: true },
  text: { type: String, required: true },
});

export default model('CannedResponse', cannedResponseSchema);