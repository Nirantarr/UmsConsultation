// controllers/chatController.js

import ChatSession from '../models/ChatSession.js';
import Message from '../models/Message.js';
import CannedResponse from '../models/CannedResponse.js';

export const getActiveSessions = async (req, res) => {
  try {
    const sessions = await ChatSession.find({ status: 'active' })
      // ★★★ FIX: Populate all fields needed by the frontend from both user models. ★★★
      .populate('userId', 'fullName organizationName') 
      .sort({ createdAt: -1 })
      .lean(); // Use .lean() for better performance

    res.json(sessions);
  } catch (error) {
    console.error("Error fetching active sessions:", error);
    res.status(500).json({ message: 'Server error while fetching sessions.' });
  }
};

export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ sessionId: req.params.sessionId }).sort({ timestamp: 'asc' });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getCannedResponses = async (req, res) => {
  try {
    // Use the CannedResponse model
    const responses = await CannedResponse.find({});
    res.json(responses);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

