// models/ChatSession.js

import { Schema, model } from 'mongoose';

const chatSessionSchema = new Schema({
  userType: {
    type: String,
    required: true,
    // ★★★ FIX: Changed to lowercase to match the 'type' field in your user objects. ★★★
    enum: ['Employee', 'Consultant'] 
  },
  userId: { 
    type: Schema.Types.ObjectId,
    required: true, 
    refPath: 'userType' 
  }, 
  status: { 
    type: String, 
    enum: ['active', 'terminated'], 
    default: 'active' 
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: '3d', 
  },
});


export default model('ChatSession', chatSessionSchema);
