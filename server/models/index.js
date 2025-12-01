import User from './User.js';
import GameSession from './GameSession.js';
import LearningProgress from './LearningProgress.js';
import ActivityLog from './ActivityLog.js';

// Define associations
User.hasMany(GameSession, { foreignKey: 'userId', as: 'gameSessions' });
GameSession.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(LearningProgress, { foreignKey: 'userId', as: 'learningProgress' });
LearningProgress.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(ActivityLog, { foreignKey: 'userId', as: 'activities' });
ActivityLog.belongsTo(User, { foreignKey: 'userId' });

export {
  User,
  GameSession,
  LearningProgress,
  ActivityLog
};
