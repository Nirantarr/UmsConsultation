// index.js

import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';

import ChatSession from './models/ChatSession.js';
import Message from './models/Message.js';
import Employee from './models/Employee.js'; // Keep these imports
import Consultant from './models/Consultant.js'; // Keep these imports
import authRoutes from './routes/authRoutes.js';
import chatRoutes from './routes/chatRoutes.js';

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "http://localhost:3000", methods: ["GET", "POST"] } });

app.use(cors());
app.use(express.json());

// ★★★ FIX: Use the dedicated chatRoutes file for API endpoints. ★★★
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes); // This handles /api/chat/sessions and /api/chat/messages


io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  socket.on('adminOnline', (data) => {
    if (data && data.user && (data.user.isAdmin || data.user.is_admin)) { // Check for both isAdmin and is_admin
      console.log(`Verified Admin connected: ${socket.id}, User: ${data.user.name}`);
      socket.join('adminRoom');
    }
  });

  socket.on('startChat', (data) => {
    socket.userId = data.userId;
    socket.userInfo = data.user;
    console.log(`Socket ${socket.id} initialized for user ${socket.userId}`);
  });

   socket.on('joinRoom', (sessionId) => { socket.join(sessionId); });

    socket.on('sendMessage', async (data) => {
  try {
            let sessionId = data.sessionId;
            let session;

            // If there's no session ID, it's the first message from a user.
            if (!sessionId && data.sender === 'user') {
                // Capitalize the user type to match the ChatSession model's enum
                const userType = socket.userInfo.type.charAt(0).toUpperCase() + socket.userInfo.type.slice(1);

                session = new ChatSession({
                    userId: socket.userId,
                    userType: userType, // e.g., "Employee" or "Consultant"
                });
                await session.save();
                sessionId = session._id; // Get the ID from the newly created session

                // Join the user's socket to a room named after the new session ID
                socket.join(sessionId);
                
                // Notify the admin dashboard that a new session has started
                // Note: We populate user data here so the frontend doesn't need to make another request.
                const newSessionForAdmin = await ChatSession.findById(sessionId)
                    .populate('userId', 'fullName organizationName')
                    .lean();
                io.to('adminRoom').emit('newSession', newSessionForAdmin);


                // Send the session object back to the user so they can store it
                socket.emit('sessionStarted', session.toObject());
            }
             else {
                // If a session already exists, ensure the sender is in the room.
                // This is especially important for the admin replying to a chat.
                socket.join(sessionId);
            }
            
            // Determine the sender's name from stored socket info or incoming data
            const senderName = data.senderName;
      
            const message = new Message({ 
                sessionId: sessionId, // Use the (potentially new) sessionId
                sender: data.sender, 
                senderName: senderName, 
                text: data.text 
            });
            await message.save();
            
            // Broadcast the new message to everyone in the room (user and admin)
            io.to(sessionId).emit('newMessage', message.toObject());

        } catch (error) { 
            // The original error you saw would be caught here.
            console.error('Error in sendMessage:', error); 
        }
    });

    socket.on('terminateSession', async (sessionId) => {
        try {
            await ChatSession.findByIdAndUpdate(sessionId, { status: 'terminated' });
            // ★★★ FIX: Target the adminRoom specifically for better performance and security. ★★★
            io.to('adminRoom').emit('sessionTerminated', { sessionId });
        } catch (error)      {
            console.error('Error terminating session:', error);
        }
    });

  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("MongoDB connected");
    server.listen(process.env.PORT || 5000, () => {
        console.log(`Server running on port ${process.env.PORT || 5000}`);
    });
}).catch(err => console.log(err));

