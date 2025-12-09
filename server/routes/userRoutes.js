import express from 'express';
import userController from '../controllers/userController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// All user routes require authentication
router.use(verifyToken);

router.get('/profile', userController.getProfile);

export default router;
