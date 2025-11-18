import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const LearningProgress = sequelize.define('LearningProgress', {
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
  moduleName: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Name of the learning module'
  },
  moduleType: {
    type: DataTypes.ENUM('body_parts', 'objects', 'scenarios', 'introduction'),
    defaultValue: 'body_parts'
  },
  itemsViewed: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Number of items viewed in this session'
  },
  durationMinutes: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Time spent in minutes'
  },
  completedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  isCompleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'learning_progress',
  timestamps: true,
  underscored: true
});

export default LearningProgress;
