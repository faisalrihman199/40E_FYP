import express from 'express';
import progressController from '../controllers/progressController.js';
import {
  logGameSessionValidator,
  logLearningProgressValidator,
  getGameSessionsValidator,
  getLearningProgressValidator,
  getActivityLogsValidator,
  getAnalyticsValidator
} from '../middleware/validators.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// All progress routes require authentication
router.use(verifyToken);

router.post('/game', logGameSessionValidator, progressController.logGameSession);
router.post('/learning', logLearningProgressValidator, progressController.logLearningProgress);
router.get('/games', getGameSessionsValidator, progressController.getGameSessions);
router.get('/learning', getLearningProgressValidator, progressController.getLearningProgress);
router.get('/activities', getActivityLogsValidator, progressController.getActivityLogs);
router.get('/analytics', getAnalyticsValidator, progressController.getAnalytics);
router.get('/summary', progressController.getProgressSummary);

export default router;
