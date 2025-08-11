import express from 'express';
import {
  getActiveSessions,
  getMessages,
  getCannedResponses,
} from '../controllers/chatController.js';

// Import your authentication and authorization middleware
import { protect, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/chat/sessions
// Gets a list of all currently active chat sessions for the admin dashboard.
router.route('/sessions').get(protect, isAdmin, getActiveSessions);

// GET /api/chat/messages/:sessionId
// Gets the full message history for a specific chat session.
router.route('/messages/:sessionId').get(getMessages);


router.route('/canned-responses').get(protect, isAdmin, getCannedResponses);



export default router;