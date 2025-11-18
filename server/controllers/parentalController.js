import { ParentalControl, User, GameSession, LearningProgress, ActivityLog } from '../models/index.js';
import { Op } from 'sequelize';
import logger from '../config/logger.js';

class ParentalController {
  // Verify PIN
  async verifyPin(req, res) {
    try {
      const userId = req.user.userId;
      const { pin } = req.body;

      const parentalControl = await ParentalControl.findOne({ where: { userId } });

      if (!parentalControl) {
        return res.status(404).json({
          success: false,
          message: 'Parental controls not found.'
        });
      }

      const isPinValid = await parentalControl.verifyPin(pin);

      if (!isPinValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid PIN. Please try again.'
        });
      }

      logger.info(`PIN verified for user: ${userId}`);

      res.status(200).json({
        success: true,
        message: 'PIN verified successfully!',
        data: {
          settings: {
            isEnabled: parentalControl.isEnabled,
            sessionTimeLimit: parentalControl.sessionTimeLimit,
            dailyTimeLimit: parentalControl.dailyTimeLimit,
            allowedDays: parentalControl.allowedDays,
            allowedTimeStart: parentalControl.allowedTimeStart,
            allowedTimeEnd: parentalControl.allowedTimeEnd,
            blockInappropriateContent: parentalControl.blockInappropriateContent,
            requirePinForSettings: parentalControl.requirePinForSettings
          }
        }
      });
    } catch (error) {
      logger.error('Verify PIN error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to verify PIN.',
        error: error.message
      });
    }
  }

  // Update PIN
  async updatePin(req, res) {
    try {
      const userId = req.user.userId;
      const { currentPin, newPin } = req.body;

      const parentalControl = await ParentalControl.findOne({ where: { userId } });

      if (!parentalControl) {
        return res.status(404).json({
          success: false,
          message: 'Parental controls not found.'
        });
      }

      // Verify current PIN
      const isPinValid = await parentalControl.verifyPin(currentPin);
      if (!isPinValid) {
        return res.status(401).json({
          success: false,
          message: 'Current PIN is incorrect.'
        });
      }

      // Update PIN
      parentalControl.pin = newPin; // Will be hashed by beforeUpdate hook
      await parentalControl.save();

      logger.info(`PIN updated for user: ${userId}`);

      res.status(200).json({
        success: true,
        message: 'PIN updated successfully!'
      });
    } catch (error) {
      logger.error('Update PIN error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update PIN.',
        error: error.message
      });
    }
  }

  // Get parental control settings
  async getSettings(req, res) {
    try {
      const userId = req.user.userId;

      const parentalControl = await ParentalControl.findOne({ where: { userId } });

      if (!parentalControl) {
        return res.status(404).json({
          success: false,
          message: 'Parental controls not found.'
        });
      }

      res.status(200).json({
        success: true,
        data: {
          settings: {
            isEnabled: parentalControl.isEnabled,
            sessionTimeLimit: parentalControl.sessionTimeLimit,
            dailyTimeLimit: parentalControl.dailyTimeLimit,
            allowedDays: parentalControl.allowedDays,
            allowedTimeStart: parentalControl.allowedTimeStart,
            allowedTimeEnd: parentalControl.allowedTimeEnd,
            blockInappropriateContent: parentalControl.blockInappropriateContent,
            requirePinForSettings: parentalControl.requirePinForSettings
          }
        }
      });
    } catch (error) {
      logger.error('Get settings error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch settings.',
        error: error.message
      });
    }
  }

  // Update parental control settings
  async updateSettings(req, res) {
    try {
      const userId = req.user.userId;
      const {
        isEnabled,
        sessionTimeLimit,
        dailyTimeLimit,
        allowedDays,
        allowedTimeStart,
        allowedTimeEnd,
        blockInappropriateContent,
        requirePinForSettings
      } = req.body;

      const parentalControl = await ParentalControl.findOne({ where: { userId } });

      if (!parentalControl) {
        return res.status(404).json({
          success: false,
          message: 'Parental controls not found.'
        });
      }

      // Update fields
      if (isEnabled !== undefined) parentalControl.isEnabled = isEnabled;
      if (sessionTimeLimit !== undefined) parentalControl.sessionTimeLimit = sessionTimeLimit;
      if (dailyTimeLimit !== undefined) parentalControl.dailyTimeLimit = dailyTimeLimit;
      if (allowedDays !== undefined) parentalControl.allowedDays = allowedDays;
      if (allowedTimeStart !== undefined) parentalControl.allowedTimeStart = allowedTimeStart;
      if (allowedTimeEnd !== undefined) parentalControl.allowedTimeEnd = allowedTimeEnd;
      if (blockInappropriateContent !== undefined) parentalControl.blockInappropriateContent = blockInappropriateContent;
      if (requirePinForSettings !== undefined) parentalControl.requirePinForSettings = requirePinForSettings;

      await parentalControl.save();

      logger.info(`Parental settings updated for user: ${userId}`);

      res.status(200).json({
        success: true,
        message: 'Settings updated successfully!',
        data: {
          settings: {
            isEnabled: parentalControl.isEnabled,
            sessionTimeLimit: parentalControl.sessionTimeLimit,
            dailyTimeLimit: parentalControl.dailyTimeLimit,
            allowedDays: parentalControl.allowedDays,
            allowedTimeStart: parentalControl.allowedTimeStart,
            allowedTimeEnd: parentalControl.allowedTimeEnd,
            blockInappropriateContent: parentalControl.blockInappropriateContent,
            requirePinForSettings: parentalControl.requirePinForSettings
          }
        }
      });
    } catch (error) {
      logger.error('Update settings error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update settings.',
        error: error.message
      });
    }
  }

  // Get dashboard statistics
  async getDashboard(req, res) {
    try {
      const userId = req.user.userId;

      // Get user info
      const user = await User.findByPk(userId, {
        attributes: ['childName', 'childAge']
      });

      // Get game statistics
      const gameStats = await GameSession.findAll({
        where: { userId },
        attributes: [
          [sequelize.fn('COUNT', sequelize.col('id')), 'totalGames'],
          [sequelize.fn('AVG', sequelize.col('score')), 'averageScore'],
          [sequelize.fn('SUM', sequelize.col('duration_minutes')), 'totalGameTime'],
          [sequelize.fn('SUM', sequelize.col('correct_answers')), 'totalCorrect'],
          [sequelize.fn('SUM', sequelize.col('wrong_answers')), 'totalWrong']
        ],
        raw: true
      });

      // Get learning statistics
      const learningStats = await LearningProgress.findAll({
        where: { userId },
        attributes: [
          [sequelize.fn('COUNT', sequelize.col('id')), 'totalModules'],
          [sequelize.fn('SUM', sequelize.col('duration_minutes')), 'totalLearningTime'],
          [sequelize.fn('COUNT', sequelize.literal('CASE WHEN "is_completed" = true THEN 1 END')), 'completedModules']
        ],
        raw: true
      });

      // Get recent activities (last 20)
      const recentActivities = await ActivityLog.findAll({
        where: { userId },
        order: [['timestamp', 'DESC']],
        limit: 20,
        attributes: ['id', 'activityType', 'activityName', 'score', 'durationMinutes', 'timestamp', 'details']
      });

      // Get today's activity time
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const todayActivity = await ActivityLog.findAll({
        where: {
          userId,
          timestamp: { [Op.gte]: startOfDay },
          activityType: { [Op.in]: ['game', 'learning'] }
        },
        attributes: [
          [sequelize.fn('SUM', sequelize.col('duration_minutes')), 'todayTime']
        ],
        raw: true
      });

      // Get weekly progress (last 7 days)
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      const weeklyProgress = await ActivityLog.findAll({
        where: {
          userId,
          timestamp: { [Op.gte]: weekAgo }
        },
        attributes: [
          [sequelize.fn('DATE', sequelize.col('timestamp')), 'date'],
          [sequelize.fn('COUNT', sequelize.col('id')), 'activities'],
          [sequelize.fn('SUM', sequelize.col('duration_minutes')), 'time']
        ],
        group: [sequelize.fn('DATE', sequelize.col('timestamp'))],
        order: [[sequelize.fn('DATE', sequelize.col('timestamp')), 'ASC']],
        raw: true
      });

      // Get parental control settings
      const parentalControl = await ParentalControl.findOne({
        where: { userId },
        attributes: { exclude: ['pin'] }
      });

      res.status(200).json({
        success: true,
        data: {
          childInfo: {
            name: user.childName,
            age: user.childAge
          },
          gameStats: {
            totalGames: parseInt(gameStats[0]?.totalGames || 0),
            averageScore: parseFloat(gameStats[0]?.averageScore || 0).toFixed(1),
            totalGameTime: parseInt(gameStats[0]?.totalGameTime || 0),
            totalCorrect: parseInt(gameStats[0]?.totalCorrect || 0),
            totalWrong: parseInt(gameStats[0]?.totalWrong || 0)
          },
          learningStats: {
            totalModules: parseInt(learningStats[0]?.totalModules || 0),
            completedModules: parseInt(learningStats[0]?.completedModules || 0),
            totalLearningTime: parseInt(learningStats[0]?.totalLearningTime || 0)
          },
          todayTime: parseInt(todayActivity[0]?.todayTime || 0),
          recentActivities,
          weeklyProgress,
          settings: parentalControl
        }
      });
    } catch (error) {
      logger.error('Get dashboard error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch dashboard data.',
        error: error.message
      });
    }
  }

  // Clear all data
  async clearData(req, res) {
    try {
      const userId = req.user.userId;
      const { pin } = req.body;

      // Verify PIN before clearing data
      const parentalControl = await ParentalControl.findOne({ where: { userId } });

      if (!parentalControl) {
        return res.status(404).json({
          success: false,
          message: 'Parental controls not found.'
        });
      }

      const isPinValid = await parentalControl.verifyPin(pin);
      if (!isPinValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid PIN.'
        });
      }

      // Delete all game sessions, learning progress, and activity logs
      await GameSession.destroy({ where: { userId } });
      await LearningProgress.destroy({ where: { userId } });
      await ActivityLog.destroy({ where: { userId } });

      logger.info(`All data cleared for user: ${userId}`);

      res.status(200).json({
        success: true,
        message: 'All progress data has been cleared successfully.'
      });
    } catch (error) {
      logger.error('Clear data error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to clear data.',
        error: error.message
      });
    }
  }
}

// Import sequelize for aggregation functions
import { sequelize } from '../config/database.js';

export default new ParentalController();
