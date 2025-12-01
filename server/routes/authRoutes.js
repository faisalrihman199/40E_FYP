import express from 'express';
import authController from '../controllers/authController.js';
import {
  registerValidator,
  loginValidator,
  refreshTokenValidator
} from '../middleware/validators.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', registerValidator, authController.register);
router.post('/login', loginValidator, authController.login);
router.post('/refresh-token', refreshTokenValidator, authController.refreshToken);

// Protected routes
router.post('/logout', verifyToken, authController.logout);

export default router;
