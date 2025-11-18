import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import bcrypt from 'bcryptjs';

const ParentalControl = sequelize.define('ParentalControl', {
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
  pin: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '1234'
  },
  isEnabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  sessionTimeLimit: {
    type: DataTypes.INTEGER, // in minutes
    defaultValue: 30,
    comment: 'Maximum session duration in minutes'
  },
  dailyTimeLimit: {
    type: DataTypes.INTEGER, // in minutes
    defaultValue: 120,
    comment: 'Maximum daily usage in minutes'
  },
  allowedDays: {
    type: DataTypes.ARRAY(DataTypes.INTEGER), // 0-6 (Sunday-Saturday)
    defaultValue: [0, 1, 2, 3, 4, 5, 6],
    comment: 'Days of week when app is allowed'
  },
  allowedTimeStart: {
    type: DataTypes.TIME,
    allowNull: true,
    comment: 'Start time for daily usage'
  },
  allowedTimeEnd: {
    type: DataTypes.TIME,
    allowNull: true,
    comment: 'End time for daily usage'
  },
  blockInappropriateContent: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  requirePinForSettings: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'parental_controls',
  timestamps: true,
  underscored: true
});

// Hash PIN before saving
ParentalControl.beforeCreate(async (control) => {
  if (control.pin) {
    const salt = await bcrypt.genSalt(10);
    control.pin = await bcrypt.hash(control.pin, salt);
  }
});

ParentalControl.beforeUpdate(async (control) => {
  if (control.changed('pin')) {
    const salt = await bcrypt.genSalt(10);
    control.pin = await bcrypt.hash(control.pin, salt);
  }
});

// Instance method to verify PIN
ParentalControl.prototype.verifyPin = async function(candidatePin) {
  return await bcrypt.compare(candidatePin, this.pin);
};

export default ParentalControl;
