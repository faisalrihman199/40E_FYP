import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const ActivityLog = sequelize.define('ActivityLog', {
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
  activityType: {
    type: DataTypes.ENUM('game', 'learning', 'login', 'logout'),
    allowNull: false
  },
  activityName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  details: {
    type: DataTypes.JSONB,
    defaultValue: {},
    comment: 'Additional activity details'
  },
  score: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  durationMinutes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'activity_logs',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ['user_id', 'timestamp']
    },
    {
      fields: ['activity_type']
    }
  ]
});

export default ActivityLog;
