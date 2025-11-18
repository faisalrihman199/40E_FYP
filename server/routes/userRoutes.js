import express from 'express';
import userController from '../controllers/userController.js';
import {
  updateProfileValidator,
  changePasswordValidator,
  deactivateAccountValidator,
  deleteAccountValidator
} from '../middleware/validators.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// All user routes require authentication
router.use(verifyToken);

router.get('/profile', userController.getProfile);
router.put('/profile', updateProfileValidator, userController.updateProfile);
router.put('/change-password', changePasswordValidator, userController.changePassword);
router.post('/deactivate', deactivateAccountValidator, userController.deactivateAccount);
router.delete('/delete', deleteAccountValidator, userController.deleteAccount);

export default router;
