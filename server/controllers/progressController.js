import { GameSession, LearningProgress, ActivityLog } from '../models/index.js';
import { Op } from 'sequelize';
import logger from '../config/logger.js';

class ProgressController {
  // Log game session
  async logGameSession(req, res) {
    try {
      const userId = req.user.userId;
      const {
        gameName,
        gameType,
        score,
        correctAnswers,
        wrongAnswers,
        totalAttempts,
        durationMinutes
      } = req.body;

      // Create game session
      const gameSession = await GameSession.create({
        userId,
        gameName,
        gameType,
        score,
        correctAnswers,
        wrongAnswers,
        totalAttempts,
        durationMinutes,
        completedAt: new Date()
      });

      // Create activity log
      await ActivityLog.create({
        userId,
        activityType: 'game',
        activityName: gameName,
        score,
        durationMinutes,
        timestamp: new Date(),
        details: {
          gameType,
          correctAnswers,
          wrongAnswers,
          totalAttempts
        }
      });

      logger.info(`Game session logged for user ${userId}: ${gameName}`);

      res.status(201).json({
        success: true,
        message: 'Game session logged successfully!',
        data: { gameSession }
      });
    } catch (error) {
      logger.error('Log game session error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to log game session.',
        error: error.message
      });
    }
  }

  // Log learning progress
  async logLearningProgress(req, res) {
    try {
      const userId = req.user.userId;
      const {
        moduleName,
        moduleType,
        itemsViewed,
        durationMinutes,
        isCompleted
      } = req.body;

      // Create or update learning progress
      const [learningProgress, created] = await LearningProgress.findOrCreate({
        where: { userId, moduleName },
        defaults: {
          moduleType,
          itemsViewed,
          durationMinutes,
          isCompleted,
          completedAt: isCompleted ? new Date() : null
        }
      });

      if (!created) {
        // Update existing record
        learningProgress.itemsViewed += itemsViewed;
        learningProgress.durationMinutes += durationMinutes;
        if (isCompleted) {
          learningProgress.isCompleted = true;
          learningProgress.completedAt = new Date();
        }
        await learningProgress.save();
      }

      // Create activity log
      await ActivityLog.create({
        userId,
        activityType: 'learning',
        activityName: moduleName,
        durationMinutes,
        timestamp: new Date(),
        details: {
          moduleType,
          itemsViewed,
          isCompleted
        }
      });

      logger.info(`Learning progress logged for user ${userId}: ${moduleName}`);

      res.status(201).json({
        success: true,
        message: 'Learning progress logged successfully!',
        data: { learningProgress }
      });
    } catch (error) {
      logger.error('Log learning progress error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to log learning progress.',
        error: error.message
      });
    }
  }

  // Get all game sessions
  async getGameSessions(req, res) {
    try {
      const userId = req.user.userId;
      const { limit = 50, offset = 0, gameType } = req.query;

      const where = { userId };
      if (gameType) where.gameType = gameType;

      const gameSessions = await GameSession.findAndCountAll({
        where,
        order: [['completedAt', 'DESC']],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

      res.status(200).json({
        success: true,
        data: {
          sessions: gameSessions.rows,
          total: gameSessions.count,
          limit: parseInt(limit),
          offset: parseInt(offset)
        }
      });
    } catch (error) {
      logger.error('Get game sessions error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch game sessions.',
        error: error.message
      });
    }
  }

  // Get learning progress
  async getLearningProgress(req, res) {
    try {
      const userId = req.user.userId;
      const { moduleType } = req.query;

      const where = { userId };
      if (moduleType) where.moduleType = moduleType;

      const learningProgress = await LearningProgress.findAll({
        where,
        order: [['updatedAt', 'DESC']]
      });

      res.status(200).json({
        success: true,
        data: { modules: learningProgress }
      });
    } catch (error) {
      logger.error('Get learning progress error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch learning progress.',
        error: error.message
      });
    }
  }

  // Get activity logs
  async getActivityLogs(req, res) {
    try {
      const userId = req.user.userId;
      const { limit = 50, offset = 0, activityType, startDate, endDate } = req.query;

      const where = { userId };
      
      if (activityType) where.activityType = activityType;
      
      if (startDate || endDate) {
        where.timestamp = {};
        if (startDate) where.timestamp[Op.gte] = new Date(startDate);
        if (endDate) where.timestamp[Op.lte] = new Date(endDate);
      }

      const activities = await ActivityLog.findAndCountAll({
        where,
        order: [['timestamp', 'DESC']],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

      res.status(200).json({
        success: true,
        data: {
          activities: activities.rows,
          total: activities.count,
          limit: parseInt(limit),
          offset: parseInt(offset)
        }
      });
    } catch (error) {
      logger.error('Get activity logs error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch activity logs.',
        error: error.message
      });
    }
  }

  // Get analytics/summary
  async getAnalytics(req, res) {
    try {
      const userId = req.user.userId;
      const { period = '7d' } = req.query; // 7d, 30d, 90d, all

      let startDate;
      if (period !== 'all') {
        const days = parseInt(period);
        startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
      }

      const where = { userId };
      if (startDate) where.completedAt = { [Op.gte]: startDate };

      // Game analytics
      const gameAnalytics = await GameSession.findAll({
        where,
        attributes: [
          'gameType',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
          [sequelize.fn('AVG', sequelize.col('score')), 'avgScore'],
          [sequelize.fn('MAX', sequelize.col('score')), 'maxScore'],
          [sequelize.fn('SUM', sequelize.col('correct_answers')), 'totalCorrect'],
          [sequelize.fn('SUM', sequelize.col('wrong_answers')), 'totalWrong'],
          [sequelize.fn('SUM', sequelize.col('duration_minutes')), 'totalTime']
        ],
        group: ['gameType'],
        raw: true
      });

      // Learning analytics
      const learningAnalytics = await LearningProgress.findAll({
        where: { userId },
        attributes: [
          'moduleType',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
          [sequelize.fn('COUNT', sequelize.literal('CASE WHEN "is_completed" = true THEN 1 END')), 'completed'],
          [sequelize.fn('SUM', sequelize.col('items_viewed')), 'totalItems'],
          [sequelize.fn('SUM', sequelize.col('duration_minutes')), 'totalTime']
        ],
        group: ['moduleType'],
        raw: true
      });

      // Daily activity for the period
      const dailyWhere = { userId, activityType: { [Op.in]: ['game', 'learning'] } };
      if (startDate) dailyWhere.timestamp = { [Op.gte]: startDate };

      const dailyActivity = await ActivityLog.findAll({
        where: dailyWhere,
        attributes: [
          [sequelize.fn('DATE', sequelize.col('timestamp')), 'date'],
          'activityType',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
          [sequelize.fn('SUM', sequelize.col('duration_minutes')), 'time'],
          [sequelize.fn('AVG', sequelize.col('score')), 'avgScore']
        ],
        group: [sequelize.fn('DATE', sequelize.col('timestamp')), 'activityType'],
        order: [[sequelize.fn('DATE', sequelize.col('timestamp')), 'ASC']],
        raw: true
      });

      res.status(200).json({
        success: true,
        data: {
          period,
          gameAnalytics,
          learningAnalytics,
          dailyActivity
        }
      });
    } catch (error) {
      logger.error('Get analytics error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch analytics.',
        error: error.message
      });
    }
  }

  // Get progress summary
  async getProgressSummary(req, res) {
    try {
      const userId = req.user.userId;

      // Overall stats
      const [totalGames, totalLearning, recentActivity] = await Promise.all([
        GameSession.count({ where: { userId } }),
        LearningProgress.count({ where: { userId } }),
        ActivityLog.findAll({
          where: { userId },
          order: [['timestamp', 'DESC']],
          limit: 10
        })
      ]);

      // Best scores
      const bestScores = await GameSession.findAll({
        where: { userId },
        attributes: ['gameName', 'gameType', 'score', 'completedAt'],
        order: [['score', 'DESC']],
        limit: 5
      });

      // Completed modules
      const completedModules = await LearningProgress.findAll({
        where: { userId, isCompleted: true },
        attributes: ['moduleName', 'moduleType', 'completedAt']
      });

      res.status(200).json({
        success: true,
        data: {
          summary: {
            totalGames,
            totalLearning,
            completedModules: completedModules.length
          },
          bestScores,
          completedModules,
          recentActivity
        }
      });
    } catch (error) {
      logger.error('Get progress summary error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch progress summary.',
        error: error.message
      });
    }
  }
}

// Import sequelize for aggregation functions
import { sequelize } from '../config/database.js';

export default new ProgressController();
