import express from 'express';
import { login, verifyAuth } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';
import { loginValidators, validate } from '../middleware/validators.js';

const router = express.Router();

// POST /api/admin/login
router.post('/login', loginValidators, validate, login);

// GET /api/admin/verify - verify token validity
router.get('/verify', authenticateToken, verifyAuth);

export default router;

