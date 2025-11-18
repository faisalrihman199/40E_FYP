import express from 'express';
import parentalController from '../controllers/parentalController.js';
import {
  verifyPinValidator,
  updatePinValidator,
  updateSettingsValidator,
  clearDataValidator
} from '../middleware/validators.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// All parental control routes require authentication
router.use(verifyToken);

router.post('/verify-pin', verifyPinValidator, parentalController.verifyPin);
router.put('/update-pin', updatePinValidator, parentalController.updatePin);
router.get('/settings', parentalController.getSettings);
router.put('/settings', updateSettingsValidator, parentalController.updateSettings);
router.get('/dashboard', parentalController.getDashboard);
router.post('/clear-data', clearDataValidator, parentalController.clearData);

export default router;
