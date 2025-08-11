import jwt from 'jsonwebtoken';

// --- CORRECT WAY ---
// Import the entire default model, not a named function from it.
import Employee from '../models/Employee.js';
import Consultant from '../models/Consultant.js';

// This middleware checks if a user is logged in (either type)
export const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token to get the payload { id, type }
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Check the 'type' from the token and query the correct model
            if (decoded.type === 'employee') {
                // Use the imported Employee model here
                req.user = await Employee.findById(decoded.id).select('-password');
            } else if (decoded.type === 'consultant') {
                // Use the imported Consultant model here
                req.user = await Consultant.findById(decoded.id).select('-password');
            } else {
                return res.status(401).json({ message: 'Not authorized, invalid user type in token' });
            }
            
            // This is useful for the isAdmin middleware
            req.userType = decoded.type;

            if (!req.user) {
                return res.status(401).json({ message: 'Not authorized, user not found' });
            }

            next(); // Success! Proceed to the next middleware or controller.
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// This middleware checks if the logged-in user is specifically an ADMIN
export const isAdmin = (req, res, next) => {
    // This must run AFTER the 'protect' middleware
    if (req.userType === 'employee' && req.user && req.user.is_admin === true) {
        next(); // User is an admin, proceed.
    } else {
        res.status(403).json({ message: 'Forbidden: Admin access required' });
    }
};