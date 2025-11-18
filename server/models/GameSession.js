import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const GameSession = sequelize.define('GameSession', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  gameName: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Name of the game played'
  },
  gameType: {
    type: DataTypes.ENUM('body_touch', 'object_recognition', 'quiz'),
    defaultValue: 'body_touch'
  },
  score: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 100
    }
  },
  correctAnswers: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  wrongAnswers: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  totalAttempts: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  durationMinutes: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Session duration in minutes'
  },
  completedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'game_sessions',
  timestamps: true,
  underscored: true
});

export default GameSession;
