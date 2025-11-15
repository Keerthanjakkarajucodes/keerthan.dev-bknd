import { verifyToken } from '../utils/jwtUtils.js';
import User from '../models/User.js';

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        error: 'Access denied. No token provided.' 
      });
    }

    const decoded = verifyToken(token);
    
    if (!decoded) {
      return res.status(403).json({ 
        error: 'Invalid or expired token.' 
      });
    }

    // Verify user still exists
    const user = await User.findById(decoded.userId).select('-passwordHash');
    
    if (!user) {
      return res.status(403).json({ 
        error: 'User not found.' 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ error: 'Authentication error.' });
  }
};

